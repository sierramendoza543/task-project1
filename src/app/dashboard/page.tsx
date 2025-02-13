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
  getDocs
} from 'firebase/firestore';
import type { Todo, TaskLabel, TodoPriority, TodoStatus } from '@/types/todo';
import { useAuth } from '@/context/AuthContext';
import TaskList from '@/components/todos/TaskList';
import TaskForm from '@/components/todos/TaskForm';
import TaskFilters from '@/components/todos/TaskFilters';
import Goals from '@/components/goals/Goals';
import { useRouter } from 'next/navigation';
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
  // All state declarations first
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
  const searchParams = new URLSearchParams(window.location.search);
  const initialTab = searchParams.get('tab') || 'tasks';
  const [activeTab, setActiveTab] = useState(initialTab);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [taskFilters, setTaskFilters] = useState<TaskFiltersState>({
    labels: [] as TaskLabel[],
    priority: 'all',
    search: '',
    showCompleted: false,
    sort: 'dueDate-asc'
  });
  const [viewMode, setViewMode] = useState<'list' | 'calendar'>('list');
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [lastAction, setLastAction] = useState<{
    type: 'delete' | 'complete';
    task: Todo;
  } | null>(null);
  const [showSettings, setShowSettings] = useState(false);

  // Then all useEffect hooks together
  useEffect(() => {
    const handleTabChange = (e: CustomEvent) => {
      setActiveTab(e.detail);
    };

    window.addEventListener('tabchange', handleTabChange as EventListener);
    return () => window.removeEventListener('tabchange', handleTabChange as EventListener);
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const tab = params.get('tab') || 'tasks';
    setActiveTab(tab);
  }, []);

  // Your existing useEffects for todos, etc.
  useEffect(() => {
    setMounted(true);
  }, []);

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
    try {
      const todoRef = doc(db, 'todos', todoId);
      const todo = todos.find(t => t.id === todoId);
      if (!todo) return;

      // Update the todo
      await updateDoc(todoRef, {
        completed,
        updatedAt: serverTimestamp()
      });

      // If the task was completed, update related goals
      if (completed) {
        const goalsQuery = query(
          collection(db, 'goals'),
          where('userId', '==', user?.uid),
          where('createdAt', '<=', todo.updatedAt), // Only goals created before task completion
          where('status', '==', 'in-progress')
        );

        const goalsSnapshot = await getDocs(goalsQuery);
        const batch = writeBatch(db);

        goalsSnapshot.forEach((goalDoc) => {
          const goalData = goalDoc.data();
          const currentProgress = goalData.progress || 0;
          
          // Update goal progress
          batch.update(goalDoc.ref, {
            progress: currentProgress + 1,
            updatedAt: serverTimestamp(),
            // If goal is complete, update status
            ...(currentProgress + 1 >= goalData.targetTasks ? { status: 'completed' } : {})
          });
        });

        await batch.commit();
      }

      addToast({
        message: completed ? 'Task completed!' : 'Task uncompleted',
        type: 'success',
        undoAction: async () => {
          await updateDoc(todoRef, {
            completed: !completed,
            updatedAt: serverTimestamp()
          });
        }
      });
    } catch (error) {
      console.error('Error toggling todo:', error);
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
      if (taskFilters.labels.length > 0 && !taskFilters.labels.every((label: TaskLabel) => todo.labels?.includes(label))) return false;
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
    if (taskFilters.labels.length > 0 && !taskFilters.labels.every((label: TaskLabel) => todo.labels?.includes(label))) return false;
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

  const handleTabChange = (newTab: string) => {
    setActiveTab(newTab);
    setIsFormVisible(false);
    setEditingTodo(null);
    window.history.pushState({}, '', `?tab=${newTab}`);
  };

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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl font-poppins">Loading todos...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Main Content */}
      <main className="pt-24 pb-12 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial="initial"
            animate="animate"
            variants={fadeIn}
          >
            <TabNavigation
              tabs={[
                { id: 'tasks', label: 'Tasks' },
                { id: 'goals', label: 'Goals' },
                { id: 'analytics', label: 'Analytics' }
              ]}
              activeTab={activeTab}
              onTabChange={handleTabChange}
            />
            
            <div className="mt-8">
              <AnimatePresence mode="wait">
                {(activeTab === 'tasks' || activeTab === 'dashboard') && (
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
                      availableLabels={Array.from(new Set(todos.flatMap(todo => todo.labels || [])))}
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
                      analytics={calculateAnalytics(todos)}
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

      {/* Settings Modal */}
      {showSettings && (
        <Settings 
          user={user} 
          isOpen={showSettings} 
          onClose={() => setShowSettings(false)} 
        />
      )}
    </div>
  );
} 