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
  writeBatch
} from 'firebase/firestore';
import type { Todo, TaskLabel, TodoPriority, TodoStatus } from '@/types/todo';
import { useAuth } from '@/context/AuthContext';
import TaskList from '@/components/tasks/TaskList';
import TaskForm from '@/components/tasks/TaskForm';
import TaskFilters from '@/components/tasks/TaskFilters';
import Goals from '@/components/Goals';
import { useRouter } from 'next/navigation';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
import DateRangeFilter from '@/components/DateRangeFilter';
import { exportToCSV } from '@/utils/exportData';
import TabNavigation, { TabId } from '@/components/TabNavigation';
import AnalyticsDashboard from '@/components/analytics/AnalyticsDashboard';
import Link from 'next/link';
import type { TaskFiltersState } from '@/components/tasks/TaskFilters';

interface EditingTodo {
  id: string;
  title: string;
  description?: string;
  priority: 'low' | 'medium' | 'high';
  dueDate?: Date;
}

interface UpdateTodoData {
  title?: string;
  description?: string;
  completed?: boolean;
  priority?: TodoPriority;
  dueDate?: Date;
  labels?: string[];
  status?: TodoStatus;
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

const isSameDay = (date1: Date, date2: Date) => {
  return date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate();
};

export default function DashboardPage() {
  const { user, signOut } = useAuth();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTodoTitle, setNewTodoTitle] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [isAdding, setIsAdding] = useState(false);
  const [editingTodo, setEditingTodo] = useState<EditingTodo | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [filter, setFilter] = useState<{
    labels: TaskLabel[];
    priority: string;
    completed: 'all' | 'completed' | 'active';
    search: string;
  }>({
    labels: [],
    priority: 'all',
    completed: 'all',
    search: '',
  });
  const [dateRange, setDateRange] = useState({
    start: new Date(new Date().setDate(new Date().getDate() - 30)),
    end: new Date()
  });
  const [activeTab, setActiveTab] = useState<TabId>('dashboard');

  // Add this state for task filters
  const [taskFilters, setTaskFilters] = useState<TaskFiltersState>({
    labels: [] as TaskLabel[],
    priority: 'all',
    completed: 'all',
    search: ''
  });

  // Get all unique labels from todos
  const allLabels = Array.from(new Set(todos.flatMap(todo => todo.labels || [])));

  // Handle mounting
  useEffect(() => {
    setMounted(true);
  }, []);

  // Handle auth and data fetching
  useEffect(() => {
    if (!mounted) return;
    
    if (!user) {
      router.replace('/login');
      return;
    }

    setLoading(true);

    try {
      const q = query(
        collection(db, 'todos'),
        where('userId', '==', user.uid),
        orderBy('order', 'asc'),
        orderBy('createdAt', 'desc')
      );

      const unsubscribe = onSnapshot(q, (snapshot) => {
        const todosList = snapshot.docs.map(doc => {
          const data = doc.data();
          const createdAt = data.createdAt?.toDate() || new Date();
          const updatedAt = data.updatedAt?.toDate() || new Date();
          const dueDate = data.dueDate?.toDate();

          return {
            id: doc.id,
            title: data.title,
            description: data.description || '',
            completed: data.completed || false,
            createdAt: createdAt,
            updatedAt: updatedAt,
            order: data.order || 0,
            priority: data.priority || 'low',
            dueDate: dueDate,
            labels: data.labels || [],
            userId: data.userId,
            status: data.status || 'pending'
          };
        });

        setTodos(todosList);
        setLoading(false);
      }, (error) => {
        console.error("Todos subscription error:", error);
        setError("Failed to load todos");
        setLoading(false);
      });

      return () => {
        unsubscribe();
        setTodos([]);
      };
    } catch (error) {
      console.error("Setup error:", error);
      setError("Failed to set up todos");
      setLoading(false);
    }
  }, [user, router, mounted]);

  // Add analytics calculations
  const analytics = {
    // Task completion rate
    completionRate: (todos: Todo[]) => {
      const filtered = todos.filter(todo => 
        todo.createdAt >= dateRange.start && 
        todo.createdAt <= dateRange.end
      );
      if (filtered.length === 0) return 0;
      return (filtered.filter(todo => todo.completed).length / filtered.length) * 100;
    },

    // Priority distribution (renamed from tasksByPriority)
    priorityDistribution: {
      high: todos.filter(todo => todo.priority === 'high').length,
      medium: todos.filter(todo => todo.priority === 'medium').length,
      low: todos.filter(todo => todo.priority === 'low').length,
    },

    // Label statistics
    labelStats: todos.reduce((acc: Record<string, number>, todo) => {
      todo.labels?.forEach(label => {
        acc[label] = (acc[label] || 0) + 1;
      });
      return acc;
    }, {}),

    // Recent completions
    recentCompletions: getLastNDays(7).map(date => ({
      date,
      count: todos.filter(todo => 
        todo.completed && 
        todo.updatedAt && 
        isSameDay(todo.updatedAt, date)
      ).length
    })),

    // Overdue tasks
    overdueTasks: todos.filter(todo => 
      !todo.completed && 
      todo.dueDate && 
      todo.dueDate < new Date()
    ).length
  };

  // Don't render anything until mounted
  if (!mounted) {
    return null;
  }

  const reorderTodos = async (startIndex: number, endIndex: number) => {
    const updatedTodos = Array.from(todos);
    const [removed] = updatedTodos.splice(startIndex, 1);
    updatedTodos.splice(endIndex, 0, removed);

    // Update the order in Firestore
    const batch = writeBatch(db);
    updatedTodos.forEach((todo, index) => {
      const todoRef = doc(db, 'todos', todo.id);
      batch.update(todoRef, { order: index });
    });

    try {
      setTodos(updatedTodos);
      await batch.commit();
    } catch (error) {
      console.error('Error updating order:', error);
      setError('Failed to reorder todos');
    }
  };

  const onDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const sourceIndex = result.source.index;
    const destinationIndex = result.destination.index;

    if (sourceIndex === destinationIndex) return;

    reorderTodos(sourceIndex, destinationIndex);
  };

  const handleLogout = async () => {
    try {
      await signOut();
      router.push('/');
    } catch (error) {
      console.error('Failed to log out:', error);
    }
  };

  const addTodo = async (todoData: Partial<Todo>) => {
    if (!user) return;

    setIsAdding(true);
    setError('');

    try {
      const newTodo = {
        userId: user.uid,
        title: todoData.title || '',
        description: todoData.description || '',
        completed: false,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        order: todos.length,
        priority: todoData.priority || 'low',
        labels: todoData.labels || [],
        status: todoData.status || 'pending'
      };

      await addDoc(collection(db, 'todos'), newTodo);
    } catch (error) {
      console.error('Error adding todo:', error);
      setError('Failed to add todo. Please try again.');
    } finally {
      setIsAdding(false);
    }
  };

  const toggleTodo = async (todoId: string, completed: boolean) => {
    setError('');
    try {
      await updateDoc(doc(db, 'todos', todoId), {
        completed: !completed,
      });
    } catch (error) {
      setError('Failed to update todo. Please try again.');
      console.error('Error updating todo:', error);
    }
  };

  const deleteTodo = async (todoId: string) => {
    setError('');
    try {
      await deleteDoc(doc(db, 'todos', todoId));
    } catch (error) {
      setError('Failed to delete todo. Please try again.');
      console.error('Error deleting todo:', error);
    }
  };

  const updateTodo = async (todoId: string, updates: UpdateTodoData) => {
    const todoRef = doc(db, 'todos', todoId);
    const updateData: any = {
      ...updates,
      updatedAt: serverTimestamp()
    };

    try {
      // Convert Date to Timestamp for Firestore
      if (updates.dueDate) {
        updateData.dueDate = serverTimestamp();
        updateData.dueDate = Timestamp.fromMillis(updates.dueDate.getTime());
      }

      await updateDoc(todoRef, updateData);
    } catch (error) {
      console.error('Error updating todo:', error);
      setError('Failed to update todo');
    }
  };

  const startEditing = (todo: Todo) => {
    setEditingTodo({
      id: todo.id,
      title: todo.title,
      description: todo.description || '',
      priority: todo.priority || 'low',
      dueDate: todo.dueDate,
    });
  };

  const cancelEditing = () => {
    setEditingTodo(null);
    setError('');
  };

  const filteredTodos = todos.filter(todo => {
    if (taskFilters.completed !== 'all') {
      if (taskFilters.completed === 'completed' && !todo.completed) return false;
      if (taskFilters.completed === 'active' && todo.completed) return false;
    }
    if (taskFilters.priority !== 'all' && todo.priority !== taskFilters.priority) return false;
    if (taskFilters.search && !todo.title.toLowerCase().includes(taskFilters.search.toLowerCase())) return false;
    if (taskFilters.labels.length > 0 && !taskFilters.labels.every(label => todo.labels?.includes(label))) return false;
    return true;
  });

  const handleExport = () => {
    exportToCSV(todos, dateRange);
  };

  const fadeIn = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl font-poppins">Loading todos...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Modern Fixed Header */}
      <motion.header 
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6 }}
        className="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-md z-50 border-b border-gray-100"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-8">
              <Link href="/" className="text-xl font-bold text-gray-900 font-space">
                Task Project
              </Link>
              <nav className="hidden md:flex gap-6">
                <button
                  onClick={() => setActiveTab('dashboard')}
                  className={`font-dm transition-colors ${
                    activeTab === 'dashboard' 
                      ? 'text-gray-900' 
                      : 'text-gray-500 hover:text-gray-900'
                  }`}
                >
                  Tasks
                </button>
                <button
                  onClick={() => setActiveTab('goals')}
                  className={`font-dm transition-colors ${
                    activeTab === 'goals' 
                      ? 'text-gray-900' 
                      : 'text-gray-500 hover:text-gray-900'
                  }`}
                >
                  Goals
                </button>
                <button
                  onClick={() => setActiveTab('analytics')}
                  className={`font-dm transition-colors ${
                    activeTab === 'analytics' 
                      ? 'text-gray-900' 
                      : 'text-gray-500 hover:text-gray-900'
                  }`}
                >
                  Analytics
                </button>
              </nav>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600 font-dm">
                {user?.email}
              </span>
              <button
                onClick={handleLogout}
                className="btn-hover-effect px-4 py-2 bg-gray-900 text-white rounded-full font-dm text-sm hover:bg-gray-800 transition-all duration-300"
              >
                Log out
              </button>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Main Content */}
      <main className="pt-24 pb-12 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial="initial"
            animate="animate"
            variants={fadeIn}
          >
            <TabNavigation activeTab={activeTab} onTabChange={setActiveTab} />
            
            <div className="mt-8">
              <AnimatePresence mode="wait">
                {activeTab === 'dashboard' && (
                  <motion.div
                    key="tasks"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                  >
                    <TaskList
                      tasks={filteredTodos}
                      onToggle={toggleTodo}
                      onDelete={deleteTodo}
                      onEdit={startEditing}
                      onDragEnd={onDragEnd}
                      onAddTodo={addTodo}
                      filters={taskFilters}
                      onFilterChange={(newFilters: TaskFiltersState) => setTaskFilters(newFilters)}
                      availableLabels={allLabels}
                    />
                  </motion.div>
                )}
                
                {activeTab === 'goals' && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.4 }}
                  >
                    <Goals userId={user?.uid || ''} todos={todos} />
                  </motion.div>
                )}

                {activeTab === 'analytics' && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.4 }}
                  >
                    <AnalyticsDashboard
                      todos={todos}
                      dateRange={dateRange}
                      onDateRangeChange={setDateRange}
                      onExport={handleExport}
                      analytics={analytics}
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
      </main>

      {/* Task Creation Button */}
      {activeTab === 'dashboard' && (
        <motion.button
          onClick={() => setActiveTab('dashboard')}
          className={`fixed bottom-8 right-8 p-4 rounded-full shadow-lg ${
            activeTab === 'dashboard'
              ? 'bg-indigo-600 text-white'
              : 'bg-white text-gray-600'
          }`}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <span className="text-2xl">+</span>
        </motion.button>
      )}
    </div>
  );
} 