'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import type { GoalData } from '@/types/goals';
import ShareGoalDialog from './ShareGoalDialog';
import { Timestamp } from 'firebase/firestore';
import { auth } from '@/config/firebase';
import { formatTimestamp } from '@/utils/dates';

interface GoalCardProps {
  goal: GoalData;
  onEdit: (goal: GoalData) => void;
  onDelete: (goalId: string) => Promise<void>;
  onProgressChange: (goalId: string, progress: number) => Promise<void>;
  onShare: (goalId: string) => Promise<void>;
  onRemoveShare: (goalId: string, email: string) => Promise<void>;
  onLeave: (goalId: string) => Promise<void>;
}

export default function GoalCard({
  goal,
  onEdit,
  onDelete,
  onProgressChange,
  onShare,
  onRemoveShare,
  onLeave
}: GoalCardProps) {
  const [isShareDialogOpen, setIsShareDialogOpen] = useState(false);
  const isShared = (goal.sharedWith?.length ?? 0) > 0;
  const currentUserEmail = auth.currentUser?.email;
  const isOwner = goal.userId === auth.currentUser?.uid;

  const percentage = Math.min(Math.round((goal.progress || 0) / goal.targetTasks * 100), 100);

  const getStatusColor = (status: 'in-progress' | 'completed') => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'in-progress':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <>
      <motion.div
        layout
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="group bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300"
      >
        <div className="flex justify-between items-start">
          <div className="space-y-2">
            <h3 className="text-xl font-bold font-space group-hover:text-indigo-600 transition-colors">
              {goal.title}
            </h3>
            {goal.description && (
              <p className="text-gray-600 font-dm">{goal.description}</p>
            )}
            <div className="flex flex-wrap gap-2">
              <motion.span 
                whileHover={{ scale: 1.05 }}
                className={`px-3 py-1 rounded-full text-sm font-dm ${
                  goal.priority === 'high' ? 'bg-red-100 text-red-800' :
                  goal.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-green-100 text-green-800'
                }`}
              >
                {goal.priority}
              </motion.span>
              <motion.span
                whileHover={{ scale: 1.05 }}
                className={getStatusColor(goal.status as 'in-progress' | 'completed')}
              >
                {goal.status}
              </motion.span>
              {(goal.sharedWith || []).length > 0 && (
                <span className="px-3 py-1 rounded-full text-sm font-dm bg-indigo-100 text-indigo-800">
                  Shared ({(goal.sharedWith || []).length})
                </span>
              )}
            </div>
          </div>
          
          <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300">
            {isShared ? (
              <>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setIsShareDialogOpen(true)}
                  className="p-2 text-gray-500 hover:text-indigo-600 rounded-full hover:bg-indigo-50 transition-colors"
                >
                  👥
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => onEdit(goal)}
                  className="p-2 text-gray-500 hover:text-indigo-600 rounded-full hover:bg-indigo-50 transition-colors"
                >
                  ✏️
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => onLeave(goal.id)}
                  className="p-2 text-gray-500 hover:text-red-600 rounded-full hover:bg-red-50 transition-colors"
                >
                  🗑️
                </motion.button>
              </>
            ) : (
              <>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setIsShareDialogOpen(true)}
                  className="p-2 text-gray-500 hover:text-indigo-600 rounded-full hover:bg-indigo-50 transition-colors"
                >
                  👥
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => onEdit(goal)}
                  className="p-2 text-gray-500 hover:text-indigo-600 rounded-full hover:bg-indigo-50 transition-colors"
                >
                  ✏️
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => onDelete(goal.id)}
                  className="p-2 text-gray-500 hover:text-red-600 rounded-full hover:bg-red-50 transition-colors"
                >
                  🗑️
                </motion.button>
              </>
            )}
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mt-6">
          <div className="flex items-center gap-4">
            <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-indigo-500 to-indigo-600 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${percentage}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
            <span className="text-sm font-medium font-dm min-w-[3rem] text-right">
              {percentage}%
            </span>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            value={percentage}
            onChange={(e) => onProgressChange(goal.id, Number(e.target.value))}
            className="w-full mt-2 accent-indigo-600"
          />
        </div>

        {/* Tags */}
        {goal.tags.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            {goal.tags.map((tag, index) => (
              <motion.span
                key={index}
                whileHover={{ scale: 1.05 }}
                className="px-2 py-1 bg-gray-100 text-gray-700 rounded-md text-xs font-dm"
              >
                #{tag}
              </motion.span>
            ))}
          </div>
        )}

        {/* Due Date */}
        <div className="mt-4 text-sm text-gray-500 font-dm">
          Due: {formatTimestamp(goal.targetDate)}
        </div>

        {goal.status === 'completed' && (
          <div className="mt-4 text-green-600 font-medium">
            ✨ Goal Completed!
          </div>
        )}
      </motion.div>

      <ShareGoalDialog
        isOpen={isShareDialogOpen}
        onClose={() => setIsShareDialogOpen(false)}
        onShare={onShare}
        onLeave={() => onLeave(goal.id)}
        currentSharedWith={goal.sharedWith || []}
        isOwner={isOwner}
        ownerEmail={goal.ownerEmail}
        goalId={goal.id}
      />
    </>
  );
} 