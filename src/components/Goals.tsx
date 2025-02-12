'use client';

import { useState, useEffect, FormEvent } from 'react';
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
  arrayUnion,
  arrayRemove,
  QueryDocumentSnapshot,
  getDoc
} from 'firebase/firestore';
import type { Goal, GoalStatus, GoalPriority, FirestoreGoal, SharedUser } from '@/types/goals';
import type { Todo } from '@/types/todo';
import TagInput from './TagInput';
import GoalStats from './goals/GoalStats';
import GoalTabs from './goals/GoalTabs';
import ShareGoalDialog from './goals/ShareGoalDialog';

interface GoalsProps {
  userId: string;
  todos: Todo[];
}

interface NewGoal {
  title: string;
  description: string;
  targetDate: Date;
  priority: GoalPriority;
  tags: string[];
}

interface GoalFilter {
  status: 'all' | GoalStatus;
  priority: 'all' | GoalPriority;
  search: string;
  tag: string;
}

const initialGoalState: NewGoal = {
  title: '',
  description: '',
  targetDate: new Date(),
  priority: 'medium',
  tags: [],
};

export default function Goals({ userId, todos }: GoalsProps) {
  const [activeTab, setActiveTab] = useState<'personal' | 'shared'>('personal');
  const [goals, setGoals] = useState<Goal[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [newGoal, setNewGoal] = useState<NewGoal>(initialGoalState);
  const [editingGoal, setEditingGoal] = useState<Goal | null>(null);
  const [selectedTodos, setSelectedTodos] = useState<string[]>([]);
  const [filter, setFilter] = useState<GoalFilter>({
    status: 'all',
    priority: 'all',
    search: '',
    tag: '',
  });
  const [isFormVisible, setIsFormVisible] = useState<boolean>(false);
  const [isShareDialogOpen, setIsShareDialogOpen] = useState<string | null>(null);

  // Get all unique tags from goals for suggestions
  const allTags = Array.from(new Set(goals.flatMap(goal => goal.tags)));

  useEffect(() => {
    const q = query(
      collection(db, 'goals'),
      where('userId', '==', userId),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const goalsList: Goal[] = [];
      snapshot.forEach((doc: QueryDocumentSnapshot) => {
        const data = doc.data() as FirestoreGoal;
        goalsList.push({
          id: doc.id,
          userId: data.userId,
          title: data.title,
          description: data.description,
          targetDate: data.targetDate?.toDate() || new Date(),
          status: data.status || 'in-progress',
          priority: data.priority || 'medium',
          progress: data.progress || 0,
          createdAt: data.createdAt?.toDate() || new Date(),
          updatedAt: data.updatedAt?.toDate() || new Date(),
          relatedTodos: data.relatedTodos || [],
          tags: data.tags || [],
          sharedWith: data.sharedWith || [],
        });
      });
      setGoals(goalsList);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [userId]);

  const addGoal = async (e: FormEvent): Promise<void> => {
    e.preventDefault();
    try {
      await addDoc(collection(db, 'goals'), {
        userId,
        ...newGoal,
        status: 'in-progress' as GoalStatus,
        progress: 0,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        targetDate: Timestamp.fromDate(newGoal.targetDate),
        relatedTodos: selectedTodos,
        sharedWith: []
      });
      setNewGoal(initialGoalState);
      setSelectedTodos([]);
    } catch (error) {
      console.error(error);
    }
  };

  const updateGoalProgress = async (goalId: string, progress: number): Promise<void> => {
    try {
      const goalRef = doc(db, 'goals', goalId);
      await updateDoc(goalRef, {
        progress,
        updatedAt: serverTimestamp(),
        status: progress === 100 ? 'completed' : 'in-progress',
      });
    } catch (error) {
      console.error(error);
    }
  };

  const deleteGoal = async (goalId: string): Promise<void> => {
    if (!window.confirm('Are you sure you want to delete this goal?')) return;
    
    try {
      await deleteDoc(doc(db, 'goals', goalId));
    } catch (error) {
      console.error(error);
    }
  };

  const startEditing = (goal: Goal): void => {
    setEditingGoal(goal);
    setSelectedTodos(goal.relatedTodos || []);
    setNewGoal({
      title: goal.title,
      description: goal.description || '',
      targetDate: goal.targetDate,
      priority: goal.priority,
      tags: goal.tags,
    });
  };

  const cancelEditing = (): void => {
    setEditingGoal(null);
    setSelectedTodos([]);
    setNewGoal(initialGoalState);
  };

  const handleSubmit = async (e: FormEvent): Promise<void> => {
    e.preventDefault();
    if (editingGoal) {
      try {
        const goalRef = doc(db, 'goals', editingGoal.id);
        await updateDoc(goalRef, {
          title: newGoal.title,
          description: newGoal.description,
          targetDate: Timestamp.fromDate(newGoal.targetDate),
          priority: newGoal.priority,
          tags: newGoal.tags,
          relatedTodos: selectedTodos,
          updatedAt: serverTimestamp(),
        });
        cancelEditing();
      } catch (error) {
        console.error(error);
      }
    } else {
      await addGoal(e);
    }
  };

  const handleShare = async (goalId: string, email: string): Promise<void> => {
    try {
      const goalRef = doc(db, 'goals', goalId);
      const newSharedUser: SharedUser = {
        email,
        role: 'viewer',  // Default role
      };
      await updateDoc(goalRef, {
        sharedWith: arrayUnion(newSharedUser),
        updatedAt: serverTimestamp()
      });
    } catch (error) {
      console.error(error);
    }
  };

  const handleRemoveShare = async (goalId: string, email: string): Promise<void> => {
    try {
      const goalRef = doc(db, 'goals', goalId);
      const goalDoc = await getDoc(goalRef);
      const currentSharedWith = goalDoc.data()?.sharedWith || [];
      const userToRemove = currentSharedWith.find((user: SharedUser) => user.email === email);
      
      if (userToRemove) {
        await updateDoc(goalRef, {
          sharedWith: arrayRemove(userToRemove),
          updatedAt: serverTimestamp()
        });
      }
    } catch (error) {
      console.error(error);
    }
  };

  const filteredGoals = goals.filter(goal => {
    if (filter.status !== 'all' && goal.status !== filter.status) return false;
    if (filter.priority !== 'all' && goal.priority !== filter.priority) return false;
    if (filter.search && !goal.title.toLowerCase().includes(filter.search.toLowerCase())) return false;
    if (filter.tag && !goal.tags.includes(filter.tag)) return false;
    return true;
  });

  // Filter goals based on active tab
  const personalGoals = goals.filter(goal => !goal.sharedWith?.length);
  const sharedGoals = goals.filter(goal => goal.sharedWith?.length > 0);

  const displayedGoals = activeTab === 'personal' ? personalGoals : sharedGoals;

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  if (loading) {
    return <div>Loading goals...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Stats */}
      <GoalStats goals={goals} />

      {/* Tabs */}
      <GoalTabs
        activeTab={activeTab}
        onTabChange={setActiveTab}
        personalCount={personalGoals.length}
        sharedCount={sharedGoals.length}
      />

      {/* Add/Edit Goal Form */}
      <motion.div 
        className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <button
          onClick={() => setIsFormVisible(!isFormVisible)}
          className="w-full px-6 py-4 text-left flex justify-between items-center hover:bg-gray-50 transition-colors"
        >
          <span className="text-lg font-space">
            {editingGoal ? 'Edit Goal' : 'Add New Goal'}
          </span>
          <motion.span
            animate={{ rotate: isFormVisible ? 180 : 0 }}
            transition={{ duration: 0.3 }}
            className="text-xl"
          >
            ↓
          </motion.span>
        </button>

        <AnimatePresence>
          {isFormVisible && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <form onSubmit={handleSubmit} className="p-6 space-y-6 border-t border-gray-100">
                <h3 className="text-lg font-semibold mb-4">
                  {editingGoal ? 'Edit Goal' : 'Add New Goal'}
                </h3>
                <input
                  type="text"
                  value={newGoal.title}
                  onChange={(e) => setNewGoal({ ...newGoal, title: e.target.value })}
                  placeholder="Goal title"
                  className="w-full px-4 py-2 border rounded-md"
                  required
                />
                <textarea
                  value={newGoal.description}
                  onChange={(e) => setNewGoal({ ...newGoal, description: e.target.value })}
                  placeholder="Goal description"
                  className="w-full px-4 py-2 border rounded-md"
                />
                <div className="flex gap-4">
                  <input
                    type="date"
                    value={newGoal.targetDate.toISOString().split('T')[0]}
                    onChange={(e) => setNewGoal({ ...newGoal, targetDate: new Date(e.target.value) })}
                    className="px-4 py-2 border rounded-md"
                    required
                  />
                  <select
                    value={newGoal.priority}
                    onChange={(e) => setNewGoal({ ...newGoal, priority: e.target.value as GoalPriority })}
                    className="px-4 py-2 border rounded-md"
                  >
                    <option value="low">Low Priority</option>
                    <option value="medium">Medium Priority</option>
                    <option value="high">High Priority</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Related Tasks</label>
                  <div className="max-h-40 overflow-y-auto border rounded-md p-2">
                    {todos.map(todo => (
                      <label key={todo.id} className="flex items-center space-x-2 p-1 hover:bg-gray-50">
                        <input
                          type="checkbox"
                          checked={selectedTodos.includes(todo.id)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedTodos(prev => [...prev, todo.id]);
                            } else {
                              setSelectedTodos(prev => prev.filter(id => id !== todo.id));
                            }
                          }}
                          className="rounded text-indigo-600"
                        />
                        <span className={todo.completed ? 'line-through text-gray-400' : ''}>
                          {todo.title}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Tags</label>
                  <TagInput
                    tags={newGoal.tags}
                    onTagsChange={(tags) => setNewGoal({ ...newGoal, tags })}
                    suggestedTags={allTags}
                  />
                </div>

                <div className="flex justify-end gap-2">
                  {editingGoal && (
                    <button
                      type="button"
                      onClick={cancelEditing}
                      className="px-4 py-2 text-gray-600 hover:text-gray-800"
                    >
                      Cancel
                    </button>
                  )}
                  <button
                    type="submit"
                    className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                  >
                    {editingGoal ? 'Update Goal' : 'Add Goal'}
                  </button>
                </div>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Goals List */}
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="space-y-4"
      >
        {displayedGoals.map((goal) => (
          <motion.div
            key={goal.id}
            variants={itemVariants}
            className="group bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300"
          >
            <div className="flex justify-between items-start">
              <div className="space-y-2">
                <h3 className="text-xl font-bold font-space">{goal.title}</h3>
                {goal.description && (
                  <p className="text-gray-600 font-dm">{goal.description}</p>
                )}
                <div className="flex gap-2">
                  <span className={`px-3 py-1 rounded-full text-sm font-dm ${
                    goal.priority === 'high' ? 'bg-red-100 text-red-800' :
                    goal.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-green-100 text-green-800'
                  }`}>
                    {goal.priority}
                  </span>
                  <span className={`px-3 py-1 rounded-full text-sm font-dm ${
                    goal.status === 'completed' ? 'bg-green-100 text-green-800' :
                    goal.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                    'bg-blue-100 text-blue-800'
                  }`}>
                    {goal.status}
                  </span>
                </div>
              </div>
              
              <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                {activeTab === 'personal' && (
                  <button
                    onClick={() => setIsShareDialogOpen(goal.id)}
                    className="p-2 text-gray-500 hover:text-gray-700 rounded-full hover:bg-gray-100 transition-colors"
                  >
                    👥
                  </button>
                )}
                <button
                  onClick={() => startEditing(goal)}
                  className="p-2 text-gray-500 hover:text-gray-700 rounded-full hover:bg-gray-100 transition-colors"
                >
                  ✏️
                </button>
                <button
                  onClick={() => deleteGoal(goal.id)}
                  className="p-2 text-gray-500 hover:text-red-600 rounded-full hover:bg-gray-100 transition-colors"
                >
                  🗑️
                </button>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="mt-4">
              <div className="flex items-center gap-4">
                <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-indigo-600 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${goal.progress}%` }}
                    transition={{ duration: 0.5 }}
                  />
                </div>
                <span className="text-sm font-medium font-dm">{goal.progress}%</span>
              </div>
            </div>

            <div className="mt-4 flex justify-end gap-2">
              {activeTab === 'personal' && (
                <button
                  onClick={() => setIsShareDialogOpen(goal.id)}
                  className="text-indigo-600 hover:text-indigo-800 text-sm font-dm flex items-center gap-1"
                >
                  <span>👥</span> Share
                </button>
              )}
              <button
                onClick={() => startEditing(goal)}
                className="text-indigo-600 hover:text-indigo-800 text-sm font-dm"
              >
                Edit
              </button>
              <button
                onClick={() => deleteGoal(goal.id)}
                className="text-red-600 hover:text-red-800 text-sm font-dm"
              >
                Delete
              </button>
            </div>

            {/* Share Dialog */}
            {isShareDialogOpen === goal.id && (
              <ShareGoalDialog
                isOpen={true}
                onClose={() => setIsShareDialogOpen(null)}
                onShare={(email) => handleShare(goal.id, email)}
                currentSharedWith={goal.sharedWith}
                onRemoveShare={(email) => handleRemoveShare(goal.id, email)}
              />
            )}
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
} 