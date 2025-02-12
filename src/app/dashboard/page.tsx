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
import Calendar from '@/components/tasks/Calendar';
import Toast from '@/components/Toast';
import Settings from '@/components/settings/Settings';

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
  const [isFormVisible, setIsFormVisible] = useState(false);

  // Add this state for task filters
  const [taskFilters, setTaskFilters] = useState<TaskFiltersState>({
    labels: [] as TaskLabel[],
    priority: 'all',
    search: '',
    showCompleted: false,
    sort: 'dueDate-asc'
  });

  // Add this to your existing state declarations
  const [viewMode, setViewMode] = useState<'list' | 'calendar'>('list');

  // Get all unique labels from todos
  const allLabels = Array.from(new Set(todos.flatMap(todo => todo.labels || [])));

  // Replace the single toast state with an array of toasts
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Store the last deleted/completed task for undo functionality
  const [lastAction, setLastAction] = useState<{
    type: 'delete' | 'complete';
    task: Todo;
  } | null>(null);

  // Add this helper function to add toasts
  const addToast = (toast: Omit<ToastMessage, 'id'>) => {
    const newToast = {
      ...toast,
      id: Math.random().toString(36).substr(2, 9)
    };
    setToasts(prev => [...prev, newToast]);

    // Auto-dismiss after 5 seconds
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== newToast.id));
    }, 5000);
  };

  // Add state for settings modal
  const [showSettings, setShowSettings] = useState(false);

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
            status: data.status || 'pending',
            dueTime: data.dueTime || null
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
    try {
      const newTodo = {
        title: todoData.title,
        description: todoData.description,
        completed: false,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        userId: user?.uid,
        priority: todoData.priority || 'medium',
        dueDate: todoData.dueDate ? Timestamp.fromDate(todoData.dueDate) : null,
        dueTime: todoData.dueTime || null,
        order: todos.length,
        labels: todoData.labels || []
      };

      await addDoc(collection(db, 'todos'), newTodo);
      setIsFormVisible(false);
    } catch (error) {
      console.error('Error adding todo:', error);
    }
  };

  const toggleTodo = async (todoId: string, completed: boolean) => {
    const taskToToggle = todos.find(t => t.id === todoId);
    if (!taskToToggle) return;

    setLastAction({
      type: 'complete',
      task: { ...taskToToggle }
    });

    try {
      await updateDoc(doc(db, 'todos', todoId), {
        completed: completed,
      });
      addToast({
        message: completed ? 'Task completed!' : 'Task uncompleted!',
        type: 'success',
        undoAction: async () => {
          await updateDoc(doc(db, 'todos', todoId), {
            completed: !completed,
          });
        }
      });
    } catch (error) {
      addToast({
        message: 'Failed to update task',
        type: 'error'
      });
    }
  };

  const deleteTodo = async (todoId: string) => {
    const taskToDelete = todos.find(t => t.id === todoId);
    if (!taskToDelete) return;

    setLastAction({
      type: 'delete',
      task: { ...taskToDelete }
    });

    try {
      await deleteDoc(doc(db, 'todos', todoId));
      addToast({
        message: 'Task deleted',
        type: 'success',
        undoAction: async () => {
          const { id, ...taskData } = taskToDelete;
          await addDoc(collection(db, 'todos'), taskData);
        }
      });
    } catch (error) {
      addToast({
        message: 'Failed to delete task',
        type: 'error'
      });
    }
  };

  const updateTodo = async (todoData: Todo) => {
    try {
      const todoRef = doc(db, 'todos', todoData.id);
      const updateData: any = {
        title: todoData.title,
        description: todoData.description,
        priority: todoData.priority,
        labels: todoData.labels || [],
        updatedAt: serverTimestamp()
      };

      if (todoData.dueDate) {
        updateData.dueDate = Timestamp.fromDate(new Date(todoData.dueDate));
      }
      
      if (todoData.dueTime !== undefined) {
        updateData.dueTime = todoData.dueTime || null;
      }

      await updateDoc(todoRef, updateData);
      setEditingTodo(null);
      addToast({
        message: 'Task updated successfully!',
        type: 'success'
      });
    } catch (error) {
      console.error('Error updating todo:', error);
      addToast({
        message: 'Failed to update task',
        type: 'error'
      });
    }
  };

  const startEditing = (todo: Todo) => {
    setEditingTodo({
      id: todo.id,
      title: todo.title,
      description: todo.description || '',
      priority: todo.priority || 'low',
      dueDate: todo.dueDate,
      dueTime: todo.dueTime
    });
  };

  const cancelEditing = () => {
    setEditingTodo(null);
    setError('');
  };

  // This one for the task list (excluding completed tasks by default)
  const filteredListTodos = todos
    .filter(todo => {
      // Hide completed tasks unless showCompleted is true
      if (todo.completed && !taskFilters.showCompleted) return false;
      
      // Apply other filters
      if (taskFilters.priority !== 'all' && todo.priority !== taskFilters.priority) return false;
      if (taskFilters.search && !todo.title.toLowerCase().includes(taskFilters.search.toLowerCase())) return false;
      if (taskFilters.labels.length > 0 && !taskFilters.labels.every(label => todo.labels?.includes(label))) return false;
      return true;
    })
    .sort((a, b) => {
      // First sort by completion status (completed tasks always at bottom if shown)
      if (a.completed !== b.completed) {
        return a.completed ? 1 : -1;
      }
      
      // Then sort by due date if both tasks have due dates
      if (a.dueDate && b.dueDate) {
        const dateA = new Date(a.dueDate).getTime();
        const dateB = new Date(b.dueDate).getTime();
        
        // Consider time if available
        if (a.dueTime && b.dueTime) {
          const timeA = new Date(`${a.dueDate.toDateString()} ${a.dueTime}`).getTime();
          const timeB = new Date(`${b.dueDate.toDateString()} ${b.dueTime}`).getTime();
          return taskFilters.sort === 'dueDate-asc' ? timeA - timeB : timeB - timeA;
        }
        
        return taskFilters.sort === 'dueDate-asc' ? dateA - dateB : dateB - dateA;
      }
      
      // If only one task has a due date, it should come first
      if (a.dueDate) return -1;
      if (b.dueDate) return 1;
      
      // If neither has a due date, sort by title
      return a.title.localeCompare(b.title);
    });

  // This one for the calendar (including completed tasks)
  const filteredCalendarTodos = todos.filter(todo => {
    // Apply filters except completion status (handled in Calendar component)
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

  const handleTabChange = (tab: TabId) => {
    setActiveTab(tab);
    // Reset any form visibility when switching tabs
    setIsFormVisible(false);
    setEditingTodo(null);
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
                  onClick={() => handleTabChange('dashboard')}
                  className={`font-dm transition-colors ${
                    activeTab === 'dashboard' 
                      ? 'text-gray-900' 
                      : 'text-gray-500 hover:text-gray-900'
                  }`}
                >
                  Tasks
                </button>
                <button
                  onClick={() => handleTabChange('goals')}
                  className={`font-dm transition-colors ${
                    activeTab === 'goals' 
                      ? 'text-gray-900' 
                      : 'text-gray-500 hover:text-gray-900'
                  }`}
                >
                  Goals
                </button>
                <button
                  onClick={() => handleTabChange('analytics')}
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
              <Link
                href="/settings"
                className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                aria-label="Profile Settings"
              >
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  className="h-5 w-5 text-gray-600" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                  />
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
              </Link>
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
            <TabNavigation activeTab={activeTab} onTabChange={handleTabChange} />
            
            <div className="mt-8">
              <AnimatePresence mode="wait" initial={false}>
                {activeTab === 'dashboard' && (
                  <motion.div
                    key="tasks"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="grid grid-cols-2 gap-6">
                      {/* Left side - Task List */}
                      <div className="space-y-4">
                        <motion.button
                          onClick={() => setIsFormVisible(true)}
                          className="w-full px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2"
                          whileHover={{ scale: 1.01 }}
                          whileTap={{ scale: 0.99 }}
                        >
                          <span className="text-xl">+</span>
                          <span>Add New Task</span>
                        </motion.button>

                        {isFormVisible ? (
                          <TaskForm
                            onSubmit={addTodo}
                            onCancel={() => setIsFormVisible(false)}
                          />
                        ) : (
                          <TaskList
                            tasks={filteredListTodos}
                            onToggle={toggleTodo}
                            onDelete={deleteTodo}
                            onEdit={updateTodo}
                            onDragEnd={onDragEnd}
                            onAddTodo={addTodo}
                            filters={taskFilters}
                            onFilterChange={setTaskFilters}
                            availableLabels={allLabels}
                          />
                        )}
                      </div>

                      {/* Right side - Calendar */}
                      <div>
                        <Calendar
                          tasks={filteredCalendarTodos}
                          onTaskClick={(task) => setEditingTodo(task)}
                          onToggle={toggleTodo}
                          onDelete={deleteTodo}
                          onEdit={updateTodo}
                        />
                      </div>
                    </div>
                  </motion.div>
                )}
                
                {activeTab === 'goals' && (
                  <motion.div
                    key="goals"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Goals userId={user?.uid || ''} todos={todos} />
                  </motion.div>
                )}

                {activeTab === 'analytics' && (
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

      {/* Toast Notifications */}
      <div className="fixed bottom-4 left-4 space-y-2 z-50">
        <AnimatePresence>
          {toasts.map(toast => (
            <Toast
              key={toast.id}
              message={toast.message}
              type={toast.type}
              onUndo={toast.undoAction}
              onClose={() => setToasts(prev => prev.filter(t => t.id !== toast.id))}
            />
          ))}
        </AnimatePresence>
      </div>

      {/* Add Settings Modal */}
      <AnimatePresence>
        {showSettings && (
          <div 
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
            onClick={(e) => {
              // Close modal when clicking the backdrop
              if (e.target === e.currentTarget) {
                setShowSettings(false);
              }
            }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-gray-50 rounded-2xl w-full max-w-2xl mx-4"
            >
              <div className="p-6 flex justify-between items-center border-b border-gray-200">
                <h2 className="text-2xl font-bold">Settings</h2>
                <button
                  onClick={() => setShowSettings(false)}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  ✕
                </button>
              </div>
              <div className="p-6 overflow-y-auto" style={{ maxHeight: 'calc(85vh - 80px)' }}>
                <Settings user={user} />
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
} 