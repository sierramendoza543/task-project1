'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { db } from '@/config/firebase';
import { 
  collection, 
  query, 
  where, 
  orderBy, 
  addDoc, 
  deleteDoc, 
  updateDoc,
  doc, 
  onSnapshot,
  serverTimestamp,
  Timestamp,
  writeBatch,
  getDocs,
  getDoc
} from 'firebase/firestore';
import type { Todo, TaskLabel, TodoPriority, TodoStatus } from '@/types/todo';
import { useAuth } from '@/context/AuthContext';
import TaskList from '@/components/todos/TaskList';
import TaskForm from '@/components/todos/TaskForm';
import TaskFilters from '@/components/todos/TaskFilters';
import Goals from '@/components/goals/Goals';
import { useRouter, useSearchParams } from 'next/navigation';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
import DateRangeFilter from '@/components/ui/DateRangeFilter';
import { exportToCSV } from '@/utils/exportData';
import TabNavigation from '@/components/layout/TabNavigation';
import AnalyticsDashboard from '@/components/analytics/AnalyticsDashboard';
import Link from 'next/link';
import type { TaskFiltersState } from '@/types/taskFilters';
import Calendar from '@/components/todos/Calendar';
import Toast from '@/components/shared/Toast';
import Settings from '@/components/settings/Settings';
import { Settings2 } from 'lucide-react';
import { AuthUser } from '@/types/user';
import { isInDateRange, timestampToDate } from '@/utils/dates';

interface EditingTodo {
  id: string;
  title: string;
  description?: string;
  priority: 'low' | 'medium' | 'high';
  dueDate?: Date;
  dueTime?: string;
}

interface UpdateTodoData {
  title?: string;
  description?: string;
  completed?: boolean;
  priority?: TodoPriority;
  dueDate?: Date;
  dueTime?: string;
  labels?: string[];
  status?: TodoStatus;
}

// Add this type at the top with other interfaces
interface ToastMessage {
  id: string;
  message: string;
  type: 'success' | 'error';
  undoAction?: () => void;
}

// Add these utility functions at the top of the file, outside the component
const getLastNDays = (n: number) => {
  const result = [];
  for (let i = n - 1; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    date.setHours(0, 0, 0, 0);
    result.push(date);
  }
  return result;
};

const isSameDay = (timestamp: Timestamp | Date, date: Date) => {
  const timestampDate = timestampToDate(timestamp);
  return timestampDate.getFullYear() === date.getFullYear() &&
    timestampDate.getMonth() === date.getMonth() &&
    timestampDate.getDate() === date.getDate();
};

// Add this function at the top of your component or in a utils file
const calculateAnalytics = (todos: Todo[]) => {
  // Calculate completion rate
  const completedTasks = todos.filter(todo => todo.completed).length;
  const completionRate = todos.length > 0 
    ? Math.round((completedTasks / todos.length) * 100) 
    : 0;

  // Calculate other analytics...
  const priorityDistribution = {
    high: todos.filter(todo => todo.priority === 'high').length,
    medium: todos.filter(todo => todo.priority === 'medium').length,
    low: todos.filter(todo => todo.priority === 'low').length
  };

  const labelStats = todos.reduce((acc: Record<string, number>, todo) => {
    todo.labels?.forEach(label => {
      acc[label] = (acc[label] || 0) + 1;
    });
    return acc;
  }, {});

  // Helper function to get date from updatedAt field
  const getUpdatedAtDate = (todo: Todo) => {
    if (!todo.updatedAt) return null;
    
    // Handle Firestore Timestamp
    if (typeof todo.updatedAt === 'object' && 'toDate' in todo.updatedAt) {
      return todo.updatedAt.toDate();
    }
    
    // Handle regular Date object or string
    return new Date(todo.updatedAt);
  };

  const recentCompletions = getLastNDays(7).map(date => ({
    date,
    count: todos.filter(todo => {
      if (!todo.completed) return false;
      
      const updatedAtDate = getUpdatedAtDate(todo);
      if (!updatedAtDate) return false;
      
      return updatedAtDate.toDateString() === date.toDateString();
    }).length
  }));

  const overdueTasks = todos.filter(todo => 
    !todo.completed && 
    todo.dueDate && 
    new Date(todo.dueDate) < new Date()
  ).length;

  return {
    completionRate,
    priorityDistribution,
    labelStats,
    recentCompletions,
    overdueTasks
  };
};

export default function DashboardPage() {
  const searchParams = useSearchParams();
  const currentTab = searchParams.get('tab') || 'tasks';

  // 1. Context hooks
  const { user, loading } = useAuth();
  const router = useRouter();

  // 2. State hooks
  const [todos, setTodos] = useState<Todo[]>([]);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [editingTodo, setEditingTodo] = useState<Todo | null>(null);
  const [activeTab, setActiveTab] = useState<string>('tasks');
  const [taskFilters, setTaskFilters] = useState<TaskFiltersState>({
    labels: [],
    priority: 'all',
    search: '',
    showCompleted: false,
    sort: 'dueDate-desc'
  });
  const [filter, setFilter] = useState({
    search: '',
    priority: 'all',
    labels: [] as string[]
  });
  const [dateRange, setDateRange] = useState({
    start: new Date(new Date().setDate(new Date().getDate() - 30)),
    end: new Date()
  });
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // 3. Effects
  // Initial tab setup
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const tabParam = params.get('tab');
    if (tabParam) {
      setActiveTab(tabParam);
    }
  }, []);

  // Todos listener
  useEffect(() => {
    if (!user?.uid) return;

    try {
      const q = query(
        collection(db, 'todos'),
        where('userId', '==', user.uid),
        orderBy('createdAt', 'desc')
      );

      const unsubscribe = onSnapshot(q, (snapshot) => {
        const newTodos = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Todo[];
        
        console.log('Fetched todos:', newTodos);
        setTodos(newTodos);
      }, (error) => {
        console.error('Error fetching todos:', error);
      });

      return () => unsubscribe();
    } catch (error) {
      console.error('Error setting up todos listener:', error);
    }
  }, [user?.uid]);

  // 4. Handlers
  const handleAddTodo = async (todo: Partial<Todo>) => {
    try {
      if (!user?.uid) {
        console.error('No user ID found');
        return;
      }

      // Base todo object with required fields
      const baseTodo = {
        title: todo.title || '',
        description: todo.description || '',
        userId: user.uid,
        completed: false,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        order: todos.length,
        labels: todo.labels || [],
        priority: todo.priority || 'medium'
      };

      // Optional fields - only add if they have valid values
      let additionalFields = {};
      
      if (todo.dueDate && !isNaN(new Date(todo.dueDate).getTime())) {
        additionalFields = {
          ...additionalFields,
          dueDate: Timestamp.fromDate(new Date(todo.dueDate))
        };
      }

      if (todo.dueTime && todo.dueTime.trim()) {
        additionalFields = {
          ...additionalFields,
          dueTime: todo.dueTime.trim()
        };
      }

      // Combine base todo with additional fields
      const newTodo = {
        ...baseTodo,
        ...additionalFields
      };

      console.log('Creating new todo:', newTodo);

      const docRef = await addDoc(collection(db, 'todos'), newTodo);
      
      setToasts(prev => [...prev, {
        id: Date.now(),
        message: 'Task created successfully',
        type: 'success',
      }]);

    } catch (error) {
      console.error('Error adding todo:', error);
      setToasts(prev => [...prev, {
        id: Date.now(),
        message: 'Failed to create task',
        type: 'error',
      }]);
    }
  };

  const handleToggle = async (id: string) => {
    try {
      const todoRef = doc(db, 'todos', id);
      const todoDoc = await getDoc(todoRef);
      
      if (!todoDoc.exists()) {
        console.error('Todo not found');
        return;
      }

      const todo = todoDoc.data();
      await updateDoc(todoRef, {
        completed: !todo.completed,
        updatedAt: serverTimestamp()
      });

      setToasts(prev => [...prev, {
        id: Date.now(),
        message: todo.completed ? 'Task uncompleted' : 'Task completed',
        type: 'success'
      }]);

    } catch (error) {
      console.error('Error toggling todo:', error);
      setToasts(prev => [...prev, {
        id: Date.now(),
        message: 'Failed to update task',
        type: 'error'
      }]);
    }
  };

  // ... rest of your handlers

  // 5. Render logic
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl font-poppins">Loading todos...</div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="space-y-6">
        <AnimatePresence mode="wait">
          {currentTab === 'tasks' && (
            <motion.div
              key="tasks"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.2 }}
            >
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-6">
                  {isFormVisible ? (
                    <TaskForm
                      onSubmit={handleAddTodo}
                      onCancel={() => setIsFormVisible(false)}
                    />
                  ) : (
                    <button
                      onClick={() => setIsFormVisible(true)}
                      className="w-full p-4 border-2 border-dashed border-gray-200 rounded-xl text-gray-500 hover:border-indigo-500 hover:text-indigo-500 transition-colors"
                    >
                      + Add New Task
                    </button>
                  )}

                  <TaskList
                    todos={todos.filter(todo => 
                      taskFilters.showCompleted ? true : !todo.completed
                    )}
                    onToggle={handleToggle}
                    onDelete={(id) => {}} // Implement delete handler
                    onEdit={(todo) => setEditingTodo(todo)}
                    filters={taskFilters}
                    onFilterChange={setTaskFilters}
                  />
                </div>

                <div className="lg:sticky lg:top-24">
                  <Calendar
                    tasks={todos}
                    onTaskClick={(task) => setEditingTodo(task)}
                    onToggle={handleToggle}
                    onDelete={(id) => {}} // Implement delete handler
                    onEdit={(todo) => setEditingTodo(todo)}
                  />
                </div>
              </div>
            </motion.div>
          )}

          {currentTab === 'goals' && (
            <motion.div
              key="goals"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.2 }}
            >
              {user && <Goals userId={user.uid} todos={todos} />}
            </motion.div>
          )}

          {currentTab === 'analytics' && (
            <motion.div
              key="analytics"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.2 }}
            >
              <AnalyticsDashboard
                todos={todos}
                dateRange={dateRange}
                onDateRangeChange={setDateRange}
                onExport={() => {}} // Implement export handler
                analytics={calculateAnalytics(todos)}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Toast Notifications */}
      <div className="fixed bottom-4 left-4 space-y-2 z-50">
        <AnimatePresence>
          {toasts.map(toast => (
            <Toast
              key={toast.id}
              message={toast.message}
              type={toast.type}
              onClose={() => setToasts(prev => prev.filter(t => t.id !== toast.id))}
            />
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
} 