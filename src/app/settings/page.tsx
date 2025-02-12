'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import EditProfileModal from '@/components/settings/EditProfileModal';
import ChangePasswordModal from '@/components/settings/ChangePasswordModal';

export default function SettingsPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [showProfileEdit, setShowProfileEdit] = useState(false);
  const [showPasswordEdit, setShowPasswordEdit] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <motion.header 
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6 }}
        className="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-md z-50 border-b border-gray-100"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-8">
              <Link href="/dashboard" className="text-xl font-bold text-gray-900 font-space">
                Task Project
              </Link>
              <nav className="hidden md:flex gap-6">
                <button
                  onClick={() => router.push('/dashboard')}
                  className="font-dm text-gray-500 hover:text-gray-900 transition-colors"
                >
                  Back to Dashboard
                </button>
              </nav>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Main Content */}
      <main className="pt-24 pb-12 px-4">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Profile Settings Section */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold">Profile Settings</h2>
              <button
                onClick={() => setShowProfileEdit(true)}
                className="px-4 py-2 text-indigo-600 hover:text-indigo-800 font-medium"
              >
                Edit
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="text-sm text-gray-600">Name</label>
                <p className="text-gray-900">{user?.displayName || 'Not set'}</p>
              </div>
              <div>
                <label className="text-sm text-gray-600">Bio</label>
                <p className="text-gray-900">{user?.bio || 'No bio added'}</p>
              </div>
            </div>
          </div>

          {/* Security Settings Section */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold">Privacy & Security</h2>
              <button
                onClick={() => setShowPasswordEdit(true)}
                className="px-4 py-2 text-indigo-600 hover:text-indigo-800 font-medium"
              >
                Change Password
              </button>
            </div>
            
            <div>
              <label className="text-sm text-gray-600">Email</label>
              <p className="text-gray-900">{user?.email}</p>
            </div>
          </div>
        </div>
      </main>

      {/* Modals */}
      <AnimatePresence>
        {showProfileEdit && (
          <EditProfileModal
            user={user}
            onClose={() => setShowProfileEdit(false)}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showPasswordEdit && (
          <ChangePasswordModal
            onClose={() => setShowPasswordEdit(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
} 