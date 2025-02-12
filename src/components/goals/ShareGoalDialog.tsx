'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '@/config/firebase';
import type { SharedUser } from '@/types/goals';

interface ShareGoalDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onShare: (email: string) => Promise<void>;
  currentSharedWith: SharedUser[];
  onRemoveShare: (email: string) => Promise<void>;
}

export default function ShareGoalDialog({ 
  isOpen, 
  onClose, 
  onShare,
  currentSharedWith,
  onRemoveShare
}: ShareGoalDialogProps) {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    setError('');
    setIsSubmitting(true);

    try {
      const usersRef = collection(db, 'users');
      const q = query(usersRef, where('email', '==', email.trim()));
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        setError('No user found with this email address');
        return;
      }

      await onShare(email.trim());
      setEmail('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to share goal');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 z-40"
          />

          {/* Dialog */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6">
              <h2 className="text-xl font-bold font-space mb-4">Share Goal</h2>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    placeholder="Enter email address"
                    required
                  />
                </div>

                {error && (
                  <p className="text-red-600 text-sm">{error}</p>
                )}

                <div className="flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-4 py-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50"
                  >
                    Share
                  </button>
                </div>
              </form>

              {/* Current shares */}
              {currentSharedWith.length > 0 && (
                <div className="mt-6">
                  <h3 className="text-sm font-medium text-gray-700 mb-2">Shared with:</h3>
                  <ul className="space-y-2">
                    {currentSharedWith.map((user) => (
                      <li key={user.email} className="flex items-center justify-between bg-gray-50 px-3 py-2 rounded-lg">
                        <span className="text-sm text-gray-600">{user.email}</span>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-gray-500 capitalize">({user.role})</span>
                          <button
                            type="button"
                            onClick={() => onRemoveShare(user.email)}
                            className="text-red-600 hover:text-red-800 text-sm"
                          >
                            Remove
                          </button>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
} 