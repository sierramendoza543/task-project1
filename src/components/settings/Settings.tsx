'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { auth } from '@/config/firebase';
import { updateProfile, updatePassword, EmailAuthProvider, reauthenticateWithCredential } from 'firebase/auth';
import { Switch } from '@/components/ui/switch';
import { useAuth } from '@/context/AuthContext';
import { UpdateUserProfileData } from '@/types/user';

interface SettingsProps {
  user: any;
  isOpen: boolean;
  onClose: () => void;
}

interface ProfileData {
  firstName: string;
  lastName: string;
}

interface PasswordData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

interface NotificationSettings {
  goalShared: boolean;
  goalUpdated: boolean;
  goalCompleted: boolean;
}

export default function Settings({ user, isOpen, onClose }: SettingsProps) {
  const { updateUserProfile } = useAuth();
  const [profileData, setProfileData] = useState<ProfileData>({
    firstName: user?.displayName?.split(' ')[0] || '',
    lastName: user?.displayName?.split(' ')[1] || ''
  });

  const [passwordData, setPasswordData] = useState<PasswordData>({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [notificationSettings, setNotificationSettings] = useState<NotificationSettings>({
    goalShared: true,
    goalUpdated: true,
    goalCompleted: true,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const fullName = `${profileData.firstName} ${profileData.lastName}`.trim();
      await updateProfile(auth.currentUser!, {
        displayName: fullName
      });
      await updateUserProfile({
        displayName: fullName
      } as UpdateUserProfileData);
      setSuccess('Profile updated successfully!');
    } catch (error) {
      setError('Failed to update profile. Please try again.');
      console.error('Profile update error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setError('New passwords do not match');
      setLoading(false);
      return;
    }

    try {
      const credential = EmailAuthProvider.credential(
        user.email,
        passwordData.currentPassword
      );
      
      await reauthenticateWithCredential(auth.currentUser!, credential);
      await updatePassword(auth.currentUser!, passwordData.newPassword);
      
      setSuccess('Password updated successfully!');
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
    } catch (error: any) {
      if (error.code === 'auth/wrong-password') {
        setError('Current password is incorrect');
      } else {
        setError('Failed to update password. Please try again.');
      }
      console.error('Password update error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Profile Settings */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-xl font-bold mb-6">Profile Settings</h2>
        <form onSubmit={handleProfileUpdate} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                First Name
              </label>
              <input
                type="text"
                value={profileData.firstName}
                onChange={(e) => setProfileData(prev => ({
                  ...prev,
                  firstName: e.target.value
                }))}
                className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Last Name
              </label>
              <input
                type="text"
                value={profileData.lastName}
                onChange={(e) => setProfileData(prev => ({
                  ...prev,
                  lastName: e.target.value
                }))}
                className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50"
          >
            {loading ? 'Updating...' : 'Update Profile'}
          </button>
        </form>
      </div>

      {/* Password Change */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-xl font-bold mb-6">Change Password</h2>
        <form onSubmit={handlePasswordChange} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Current Password
            </label>
            <input
              type="password"
              value={passwordData.currentPassword}
              onChange={(e) => setPasswordData(prev => ({
                ...prev,
                currentPassword: e.target.value
              }))}
              className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              New Password
            </label>
            <input
              type="password"
              value={passwordData.newPassword}
              onChange={(e) => setPasswordData(prev => ({
                ...prev,
                newPassword: e.target.value
              }))}
              className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Confirm New Password
            </label>
            <input
              type="password"
              value={passwordData.confirmPassword}
              onChange={(e) => setPasswordData(prev => ({
                ...prev,
                confirmPassword: e.target.value
              }))}
              className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50"
          >
            {loading ? 'Updating...' : 'Change Password'}
          </button>
        </form>
      </div>

      {/* Notification Settings */}
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-medium">Notification Settings</h3>
          <p className="text-sm text-gray-500">Choose what you want to be notified about</p>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium">Goal Sharing</h4>
              <p className="text-sm text-gray-500">When someone shares a goal with you</p>
            </div>
            <Switch
              checked={notificationSettings.goalShared}
              onCheckedChange={(checked: boolean) => setNotificationSettings(prev => ({ 
                ...prev, 
                goalShared: checked 
              }))}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium">Goal Updates</h4>
              <p className="text-sm text-gray-500">When a shared goal is updated</p>
            </div>
            <Switch
              checked={notificationSettings.goalUpdated}
              onCheckedChange={(checked: boolean) => setNotificationSettings(prev => ({ 
                ...prev, 
                goalUpdated: checked 
              }))}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium">Goal Completion</h4>
              <p className="text-sm text-gray-500">When a shared goal is completed</p>
            </div>
            <Switch
              checked={notificationSettings.goalCompleted}
              onCheckedChange={(checked: boolean) => setNotificationSettings(prev => ({ 
                ...prev, 
                goalCompleted: checked 
              }))}
            />
          </div>
        </div>
      </div>

      {/* Error/Success Messages */}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 bg-red-100 text-red-800 rounded-lg"
        >
          {error}
        </motion.div>
      )}
      {success && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 bg-green-100 text-green-800 rounded-lg"
        >
          {success}
        </motion.div>
      )}
    </div>
  );
} 