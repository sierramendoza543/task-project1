'use client';

import { useState, MouseEvent } from 'react';
import { useAuth } from '@/context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import type { UserProfile } from '@/types/auth';

interface UserMenuProps {}

export default function UserMenu({}: UserMenuProps) {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const { userProfile, signOut } = useAuth();

  const handleToggleMenu = (): void => {
    setIsOpen(!isOpen);
  };

  const handleSignOut = async (e: MouseEvent<HTMLButtonElement>): Promise<void> => {
    e.preventDefault();
    await signOut();
  };

  if (!userProfile) return null;

  return (
    <div className="relative">
      <button
        type="button"
        onClick={handleToggleMenu}
        className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100 transition-colors"
      >
        <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center">
          <span className="text-indigo-600 font-medium">
            {userProfile.firstName[0]}
            {userProfile.lastName[0]}
          </span>
        </div>
        <span className="font-dm">
          {userProfile.firstName} {userProfile.lastName}
        </span>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden"
          >
            <div className="p-2 space-y-1">
              <Link
                href="/dashboard"
                className="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
              >
                Dashboard
              </Link>
              <Link
                href="/dashboard/settings"
                className="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
              >
                Settings
              </Link>
              <button
                type="button"
                onClick={handleSignOut}
                className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              >
                Sign Out
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
} 