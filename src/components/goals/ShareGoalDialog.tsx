'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { auth } from '@/config/firebase';
import type { SharedUser } from '@/types/goals';
import { Dialog } from '@/components/ui/dialog';

interface ShareGoalDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onShare: (goalId: string, email: string) => Promise<void>;
  onLeave: () => Promise<void>;
  currentSharedWith: SharedUser[];
  isOwner: boolean;
  ownerEmail: string;
  goalId: string;
}

const ShareGoalDialog = ({
  isOpen,
  onClose,
  onShare,
  onLeave,
  currentSharedWith,
  isOwner,
  ownerEmail,
  goalId
}: ShareGoalDialogProps) => {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const currentUserEmail = auth.currentUser?.email;

  const handleShare = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsSubmitting(true);
    try {
      await onShare(goalId, email);
      setEmail('');
    } catch (error) {
      console.error('Error sharing goal:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onClose={onClose}>
      <div className="p-6">
        <h3 className="text-lg font-semibold mb-4">Share Goal</h3>
        
        {/* Show current shares */}
        <div className="mb-4">
          <h4 className="font-medium mb-2">Shared with:</h4>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-sm">{ownerEmail} (Owner)</span>
            </div>
            {currentSharedWith.map((user) => (
              <div key={user.email} className="flex items-center justify-between">
                <span className="text-sm">{user.email}</span>
                {user.email === currentUserEmail && (
                  <button
                    onClick={() => onLeave()}
                    className="text-red-600 text-sm hover:text-red-800"
                  >
                    Leave
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Share with new user */}
        <form onSubmit={handleShare} className="space-y-4">
          <div>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter email to share with"
              className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              disabled={isSubmitting}
            />
          </div>
          <button
            type="submit"
            disabled={isSubmitting || !email}
            className="w-full bg-indigo-600 text-white rounded-lg px-4 py-2 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Sharing...' : 'Share'}
          </button>
        </form>
      </div>
    </Dialog>
  );
};

export default ShareGoalDialog; 