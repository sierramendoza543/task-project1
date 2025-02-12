'use client';

import { motion } from 'framer-motion';

interface GoalTabsProps {
  activeTab: 'personal' | 'shared';
  onTabChange: (tab: 'personal' | 'shared') => void;
  personalCount: number;
  sharedCount: number;
}

export default function GoalTabs({ activeTab, onTabChange, personalCount, sharedCount }: GoalTabsProps) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 mb-6">
      <div className="flex gap-4">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => onTabChange('personal')}
          className={`flex-1 py-3 px-4 rounded-xl font-dm transition-all duration-300 relative ${
            activeTab === 'personal'
              ? 'bg-gray-50 text-gray-900'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          <div className="flex items-center justify-center gap-2">
            <span>Personal Goals</span>
            <span className="bg-gray-200 text-gray-700 px-2 py-0.5 rounded-full text-sm">
              {personalCount}
            </span>
          </div>
          {activeTab === 'personal' && (
            <motion.div
              layoutId="activeGoalTab"
              className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600"
              initial={false}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            />
          )}
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => onTabChange('shared')}
          className={`flex-1 py-3 px-4 rounded-xl font-dm transition-all duration-300 relative ${
            activeTab === 'shared'
              ? 'bg-gray-50 text-gray-900'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          <div className="flex items-center justify-center gap-2">
            <span>Shared Goals</span>
            <span className="bg-gray-200 text-gray-700 px-2 py-0.5 rounded-full text-sm">
              {sharedCount}
            </span>
          </div>
          {activeTab === 'shared' && (
            <motion.div
              layoutId="activeGoalTab"
              className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600"
              initial={false}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            />
          )}
        </motion.button>
      </div>
    </div>
  );
} 