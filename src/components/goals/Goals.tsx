'use client';

import { useState, useEffect, FormEvent } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { db, auth } from '@/config/firebase';
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
  getDoc,
  getDocs,
  writeBatch
} from 'firebase/firestore';
import type { 
  Goal, 
  GoalStatus, 
  GoalPriority, 
  FirestoreGoal, 
  SharedUser,
  GoalData 
} from '@/types/goals';
import type { Todo } from '@/types/todo';
import TagInput from '../ui/TagInput';
import GoalStats from './GoalStats';
import GoalTabs from './GoalTabs';
import ShareGoalDialog from './ShareGoalDialog';
import { PlusIcon } from 'lucide-react';
import Toast from '../ui/Toast';
import { createNotification, generateNotificationMessage } from '@/utils/notifications';
import AlertModal from './AlertModal';

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
  targetTasks: number;
}

const initialGoalState: NewGoal = {
  title: '',
  description: '',
  targetDate: new Date(),
  priority: 'medium',
  tags: [],
  targetTasks: 1,
};

// Add these animation variants at the top of the component, with other state declarations
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

interface GoalProgress {
  completed: number;
  total: number;
  percentage: number;
}

export default function Goals({ userId, todos }: GoalsProps) {
  const [activeTab, setActiveTab] = useState<'personal' | 'shared'>('personal');
  const [goals, setGoals] = useState<GoalData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [newGoal, setNewGoal] = useState<NewGoal>(initialGoalState);
  const [showAddGoal, setShowAddGoal] = useState(false);
  const [isShareDialogOpen, setIsShareDialogOpen] = useState<string | null>(null);
  const [toasts, setToasts] = useState<Array<{
    id: string;
    message: string;
    type: 'success' | 'error' | 'info';
    undoAction?: () => void;
  }>>([]);
  const [editingGoal, setEditingGoal] = useState<GoalData | null>(null);
  const [showEditGoal, setShowEditGoal] = useState(false);

  const [personalGoals, setPersonalGoals] = useState<GoalData[]>([]);
  const [sharedGoals, setSharedGoals] = useState<GoalData[]>([]);
  
  // Add these new state variables for filtering
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPriority, setSelectedPriority] = useState<'all' | GoalPriority>('all');
  const [selectedStatus, setSelectedStatus] = useState<'all' | GoalStatus>('all');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  // Get all unique tags from goals for suggestions
  const allTags = Array.from(new Set(goals.flatMap(goal => goal.tags)));

  // Add new state for alert modal
  const [alertModal, setAlertModal] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
  } | null>(null);

  const addToast = (message: string, type: 'success' | 'error' | 'info') => {
    setToasts(prev => [...prev, { 
      id: Date.now().toString(), 
      message, 
      type 
    }]);
  };

  // Fetch goals
  useEffect(() => {
    if (!userId || !auth.currentUser?.email) {
      setLoading(false);
      return;
    }

    let unsubscribePersonal: () => void;
    let unsubscribeSharedWithMe: () => void;
    let unsubscribeMyShared: () => void;

    const setupSubscriptions = async () => {
      try {
        // Personal goals query - goals with empty sharedWith array
        const personalQuery = query(
          collection(db, 'goals'),
          where('userId', '==', userId),
          where('sharedWith', '==', []),
          orderBy('createdAt', 'desc')
        );

        // Shared goals query - goals shared with current user
        const sharedWithMeQuery = query(
          collection(db, 'goals'),
          where('sharedWith', 'array-contains', {
            email: auth.currentUser?.email,
          }),
          orderBy('createdAt', 'desc')
        );

        // Goals that I've shared with others
        const mySharedGoalsQuery = query(
          collection(db, 'goals'),
          where('userId', '==', userId),
          where('sharedWith', '!=', []),
          orderBy('createdAt', 'desc')
        );

        // Set up listeners
        unsubscribePersonal = onSnapshot(personalQuery, (snapshot) => {
          const goalsData = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          })) as GoalData[];
          setPersonalGoals(goalsData);
        });

        unsubscribeSharedWithMe = onSnapshot(sharedWithMeQuery, (snapshot) => {
          const goalsData = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          })) as GoalData[];
          setSharedGoals(prev => {
            // Combine with existing shared goals, avoiding duplicates
            const existingGoals = prev.filter(g => 
              !goalsData.some(newGoal => newGoal.id === g.id)
            );
            return [...existingGoals, ...goalsData];
          });
        });

        unsubscribeMyShared = onSnapshot(mySharedGoalsQuery, (snapshot) => {
          const goalsData = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          })) as GoalData[];
          setSharedGoals(prev => {
            // Combine with existing shared goals, avoiding duplicates
            const existingGoals = prev.filter(g => 
              !goalsData.some(newGoal => newGoal.id === g.id)
            );
            return [...existingGoals, ...goalsData];
          });
        });

        return () => {
          unsubscribePersonal?.();
          unsubscribeSharedWithMe?.();
          unsubscribeMyShared?.();
        };
      } catch (error) {
        console.error('Error setting up goal subscriptions:', error);
      }
    };

    setupSubscriptions();
    return () => {
      unsubscribePersonal?.();
    };
  }, [userId]);

  // Handle adding a new goal
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!userId || !auth.currentUser?.email) return;

    setLoading(true);
    try {
      const newGoalData = {
        userId,
        ...newGoal,
        status: 'in-progress' as GoalStatus,
        progress: 0,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        targetDate: Timestamp.fromDate(newGoal.targetDate),
        targetTasks: newGoal.targetTasks || 1,
        sharedWith: [],
        ownerEmail: auth.currentUser.email
      };

      await addDoc(collection(db, 'goals'), newGoalData);

      setShowAddGoal(false);
      setNewGoal(initialGoalState);
      setAlertModal({
        isOpen: true,
        title: 'Success',
        message: 'Created new goal!'
      });
    } catch (error) {
      console.error('Error creating goal:', error);
      setAlertModal({
        isOpen: true,
        title: 'Error',
        message: 'Failed to create goal'
      });
    } finally {
      setLoading(false);
    }
  };

  // Add this function with the other state management functions
  const startEditing = (goal: GoalData) => {
    setEditingGoal(goal);
    setNewGoal({
      title: goal.title,
      description: goal.description,
      targetDate: goal.targetDate.toDate(),
      priority: goal.priority,
      tags: goal.tags,
      targetTasks: goal.targetTasks
    });
    setShowEditGoal(true);
  };

  // Add these functions after the handleSubmit function

  const deleteGoal = async (goalId: string) => {
    try {
      const goalRef = doc(db, 'goals', goalId);
      const goalDoc = await getDoc(goalRef);
      const goalData = goalDoc.data();

      if (!goalData) {
        addToast('Goal not found', 'error');
        return;
      }

      // Only allow deletion if user is the owner
      if (goalData.userId !== userId) {
        addToast('You can only leave shared goals, not delete them', 'error');
        return;
      }

      await deleteDoc(goalRef);
      addToast('Goal deleted successfully', 'success');
    } catch (error) {
      console.error('Error deleting goal:', error);
      addToast('Failed to delete goal', 'error');
    }
  };

  const handleEditSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!editingGoal) return;

    try {
      const goalRef = doc(db, 'goals', editingGoal.id);
      const oldGoal = { ...editingGoal };

      await updateDoc(goalRef, {
        ...newGoal,
        updatedAt: serverTimestamp(),
        targetDate: Timestamp.fromDate(newGoal.targetDate),
      });

      setShowEditGoal(false);
      setEditingGoal(null);
      setNewGoal(initialGoalState);

      addToast('Goal updated successfully!', 'success');
    } catch (error) {
      console.error(error);
      addToast('Failed to update goal', 'error');
    }
  };

  // Convert Firestore data to Goal type
  const convertGoalData = (data: FirestoreGoal, id: string): GoalData => ({
    id,
    title: data.title,
    description: data.description || '',
    targetTasks: data.targetTasks,
    progress: data.progress,
    status: data.status === 'cancelled' ? 'in-progress' : data.status,
    createdAt: data.createdAt,
    updatedAt: data.updatedAt,
    userId: data.userId,
    priority: data.priority,
    targetDate: data.targetDate,
    tags: data.tags,
    sharedWith: data.sharedWith,
    ownerEmail: data.ownerEmail
  });

  // Handle sharing a goal
  const handleShare = async (goalId: string, newUserEmail: string) => {
    try {
      const goalRef = doc(db, 'goals', goalId);
      const goalDoc = await getDoc(goalRef);
      const goalData = goalDoc.data();

      if (!goalData) {
        addToast('Goal not found', 'error');
        return;
      }

      // Check if already shared
      const sharedWith = goalData.sharedWith || [];
      if (sharedWith.some((user: SharedUser) => user.email === newUserEmail)) {
        addToast('This goal is already shared with this user', 'error');
        return;
      }

      // Add new user to shared list - only store email for query matching
      const newSharedUser = {
        email: newUserEmail // Remove addedAt for query matching
      };

      // Move goal to shared goals by updating it
      await updateDoc(goalRef, {
        sharedWith: arrayUnion(newSharedUser),
        updatedAt: serverTimestamp()
      });

      addToast(`Goal shared with ${newUserEmail}`, 'success');
      setIsShareDialogOpen(null);
    } catch (error) {
      console.error('Error sharing goal:', error);
      addToast('Failed to share goal', 'error');
    }
  };

  const handleLeaveGoal = async (goalId: string) => {
    try {
      const goalRef = doc(db, 'goals', goalId);
      const goalDoc = await getDoc(goalRef);
      const goalData = goalDoc.data();

      if (!goalData) {
        addToast('Goal not found', 'error');
        return;
      }

      const currentUserEmail = auth.currentUser?.email;
      if (!currentUserEmail) return;

      // Remove current user from shared list
      const updatedSharedWith = (goalData.sharedWith || []).filter(
        (user: SharedUser) => user.email !== currentUserEmail
      );

      // If only owner remains, convert back to personal goal
      if (updatedSharedWith.length === 0) {
        await updateDoc(goalRef, {
          sharedWith: [],
          updatedAt: serverTimestamp()
        });
      } else {
        await updateDoc(goalRef, {
          sharedWith: updatedSharedWith,
          updatedAt: serverTimestamp()
        });
      }

      addToast('You have left the goal', 'success');
    } catch (error) {
      console.error('Error leaving goal:', error);
      addToast('Failed to leave goal', 'error');
    }
  };

  // Update the filtering logic
  const getFilteredGoals = () => {
    const goalsToFilter = activeTab === 'personal' ? personalGoals : sharedGoals;
    
    return goalsToFilter.filter(goal => {
      const matchesSearch = goal.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        goal.description.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesPriority = selectedPriority === 'all' || goal.priority === selectedPriority;
      
      const matchesStatus = selectedStatus === 'all' || goal.status === selectedStatus;
      
      const matchesTags = selectedTags.length === 0 || 
        selectedTags.every(tag => goal.tags.includes(tag));
      
      return matchesSearch && matchesPriority && matchesStatus && matchesTags;
    });
  };

  // Update the tab change handler
  const handleTabChange = (newTab: 'personal' | 'shared') => {
    setActiveTab(newTab);
    // Close any open dialogs when switching tabs
    setIsShareDialogOpen(null);
    setShowAddGoal(false);
    setShowEditGoal(false);
  };

  // Update the calculateGoalProgress function with null checks
  const calculateGoalProgress = (goal: GoalData, todos: Todo[]) => {
    // Get goal creation time with fallback
    const goalCreationTime = goal.createdAt 
      ? goal.createdAt.toDate().getTime()
      : new Date(0).getTime(); // Fallback to Unix epoch if no creation date

    // Count completed tasks that were completed after goal creation
    const completedTasksCount = todos.filter(todo => {
      if (!todo.completed || !todo.updatedAt) return false;
      
      // Get task completion time from updatedAt with type checking
      let completionTime: number;
      try {
        completionTime = todo.updatedAt instanceof Timestamp 
          ? todo.updatedAt.toDate().getTime()
          : new Date(todo.updatedAt).getTime();
      } catch (error) {
        console.error('Invalid updatedAt timestamp for todo:', todo);
        return false;
      }
      
      // Only count tasks completed after goal creation
      return completionTime >= goalCreationTime;
    }).length;

    // Calculate progress percentage
    const progress = Math.min(
      Math.round((completedTasksCount / (goal.targetTasks || 1)) * 100),
      100
    );

    return {
      completedTasks: completedTasksCount,
      totalTasks: goal.targetTasks || 1,
      percentage: progress,
      isCompleted: completedTasksCount >= (goal.targetTasks || 1)
    };
  };

  // Update the useEffect that watches todos with error handling
  useEffect(() => {
    const updateGoalProgress = async (goal: GoalData) => {
      if (!goal || !goal.createdAt) {
        console.warn('Invalid goal data:', goal);
        return;
      }

      try {
        const progress = calculateGoalProgress(goal, todos);
        const wasNotCompleted = goal.status !== 'completed';
        const isNowCompleted = progress.isCompleted;

        // Only update if progress has changed
        if (progress.percentage !== goal.progress || isNowCompleted !== (goal.status === 'completed')) {
          const goalRef = doc(db, 'goals', goal.id);
          await updateDoc(goalRef, {
            progress: progress.percentage,
            status: isNowCompleted ? 'completed' : 'in-progress',
            updatedAt: serverTimestamp()
          });

          // Show completion messages when a goal is newly completed
          if (wasNotCompleted && isNowCompleted) {
            addToast(`🎉 Goal Completed: ${goal.title}`, 'success');

            setAlertModal({
              isOpen: true,
              title: '🎉 Goal Achievement!',
              message: `Congratulations! You've completed your goal: "${goal.title}"\n\nYou completed ${progress.completedTasks} tasks to achieve this goal!`
            });

            const audio = new Audio('/success.mp3');
            audio.play().catch(() => {});
          }
        }
      } catch (error) {
        console.error('Error updating goal progress:', error);
      }
    };

    const updateAllGoals = async () => {
      const allGoals = [...personalGoals, ...sharedGoals].filter(goal => goal && goal.createdAt);
      for (const goal of allGoals) {
        await updateGoalProgress(goal);
      }
    };

    updateAllGoals();
  }, [todos, personalGoals, sharedGoals]);

  // Update the renderGoalProgress function
  const renderGoalProgress = (goal: GoalData) => {
    const progress = calculateGoalProgress(goal, todos);
    
    return (
      <div className="mt-4">
        <div className="flex items-center gap-4">
          <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-indigo-600 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progress.percentage}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
          <div className="flex items-center gap-2 text-sm font-medium font-dm">
            <span>{progress.percentage}%</span>
            <span className="text-gray-500">
              ({progress.completedTasks}/{progress.totalTasks} tasks)
            </span>
          </div>
        </div>
      </div>
    );
  };

  // Add type guard for auth.currentUser
  if (!auth.currentUser?.email) return;

  return (
    <div className="space-y-6">
      <GoalTabs 
        activeTab={activeTab} 
        onTabChange={handleTabChange}
        personalCount={personalGoals.length}
        sharedCount={sharedGoals.length}
      />
      <GoalStats goals={goals as GoalData[]} />

      {/* Add New Goal Button */}
      {activeTab === 'personal' && (
        <>
          <button
            onClick={() => setShowAddGoal(true)}
            className="flex items-center gap-2 text-indigo-600 hover:text-indigo-800"
          >
            <PlusIcon className="w-5 h-5" />
            Add New Goal
          </button>

          {/* Add Goal Modal */}
          <AnimatePresence>
            {showAddGoal && (
              <div
                className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
                onClick={(e) => {
                  if (e.target === e.currentTarget) {
                    setShowAddGoal(false);
                  }
                }}
              >
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="bg-white rounded-2xl shadow-lg w-full max-w-2xl mx-4 overflow-hidden"
                >
                  <div className="p-6 border-b border-gray-100">
                    <h3 className="text-lg font-semibold">Add New Goal</h3>
                  </div>
                  <form onSubmit={handleSubmit} className="p-6 space-y-6">
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
                      <label className="block text-sm font-medium text-gray-700">
                        Target Number of Tasks
                      </label>
                      <div className="flex items-center gap-2">
                        <input
                          type="number"
                          min="1"
                          value={newGoal.targetTasks}
                          onChange={(e) => setNewGoal({ ...newGoal, targetTasks: Math.max(1, parseInt(e.target.value)) })}
                          className="px-4 py-2 border rounded-md w-32"
                          required
                        />
                        <span className="text-gray-600">tasks to complete</span>
                      </div>
                      <p className="text-sm text-gray-500">
                        Set how many tasks you need to complete to achieve this goal
                      </p>
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
                      <button
                        type="button"
                        onClick={() => setShowAddGoal(false)}
                        className="px-4 py-2 text-gray-600 hover:text-gray-800"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                      >
                        Create Goal
                      </button>
                    </div>
                  </form>
                </motion.div>
              </div>
            )}
          </AnimatePresence>

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
        </>
      )}

      {/* Goals List */}
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="space-y-4"
      >
        {getFilteredGoals().map((goal) => (
          <motion.div
            key={goal.id}
            variants={itemVariants}
            className="group bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300"
          >
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-semibold">{goal.title}</h3>
                <p className="text-gray-600">{goal.description}</p>
              </div>
              <div className="flex gap-2">
                {activeTab === 'shared' ? (
                  // Shared goal actions
                  <>
                    <button
                      onClick={() => setIsShareDialogOpen(goal.id)}
                      className="text-indigo-600 hover:text-indigo-800 text-sm font-dm flex items-center gap-1"
                    >
                      <span>👥</span> Manage Sharing
                    </button>
                    {goal.userId === userId ? (
                      // Owner actions
                      <>
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
                      </>
                    ) : (
                      // Non-owner actions
                      <button
                        onClick={() => handleLeaveGoal(goal.id)}
                        className="text-red-600 hover:text-red-800 text-sm font-dm"
                      >
                        Leave Goal
                      </button>
                    )}
                  </>
                ) : (
                  // Personal goal actions
                  <>
                    <button
                      onClick={() => setIsShareDialogOpen(goal.id)}
                      className="text-indigo-600 hover:text-indigo-800 text-sm font-dm flex items-center gap-1"
                    >
                      <span>👥</span> Share
                    </button>
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
                  </>
                )}
              </div>
            </div>

            {renderGoalProgress(goal)}

            {isShareDialogOpen === goal.id && (
              <ShareGoalDialog
                isOpen={true}
                onClose={() => setIsShareDialogOpen(null)}
                onShare={handleShare}
                onLeave={() => handleLeaveGoal(goal.id)}
                currentSharedWith={goal.sharedWith || []}
                isOwner={goal.userId === auth.currentUser?.uid}
                ownerEmail={goal.ownerEmail}
                goalId={goal.id}
              />
            )}
          </motion.div>
        ))}
      </motion.div>

      {activeTab === 'shared' && getFilteredGoals().length === 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-12 px-4"
        >
          <div className="mb-4 text-4xl">🤝</div>
          <h3 className="text-xl font-semibold mb-2 text-gray-800">
            No Goals Yet
          </h3>
          <p className="text-gray-600 max-w-md mx-auto">
            Create a new goal in the Personal Goals tab and share it with another user to start collaborating!
          </p>
        </motion.div>
      )}

      {/* Edit Goal Modal */}
      <AnimatePresence>
        {showEditGoal && editingGoal && (
          <div
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
            onClick={(e) => {
              if (e.target === e.currentTarget) {
                setShowEditGoal(false);
                setEditingGoal(null);
                setNewGoal(initialGoalState);
              }
            }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl shadow-lg w-full max-w-2xl mx-4 overflow-hidden"
            >
              <div className="p-6 border-b border-gray-100">
                <h3 className="text-lg font-semibold">Edit Goal</h3>
              </div>
              <form onSubmit={handleEditSubmit} className="p-6 space-y-6">
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
                  <label className="block text-sm font-medium text-gray-700">
                    Target Number of Tasks
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      min="1"
                      value={newGoal.targetTasks}
                      onChange={(e) => setNewGoal({ ...newGoal, targetTasks: Math.max(1, parseInt(e.target.value)) })}
                      className="px-4 py-2 border rounded-md w-32"
                      required
                    />
                    <span className="text-gray-600">tasks to complete</span>
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
                  <button
                    type="button"
                    onClick={() => {
                      setShowEditGoal(false);
                      setEditingGoal(null);
                      setNewGoal(initialGoalState);
                    }}
                    className="px-4 py-2 text-gray-600 hover:text-gray-800"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Alert Modal */}
      <AlertModal
        isOpen={alertModal?.isOpen || false}
        title={alertModal?.title || ''}
        message={alertModal?.message || ''}
        onClose={() => setAlertModal(null)}
      />
    </div>
  );
} 