'use client';

import { motion } from 'framer-motion';
import type { Goal } from '@/types/goals';

interface GoalTabsProps {
  activeTab: 'personal' | 'shared';
  onTabChange: (tab: 'personal' | 'shared') => void;
  personalCount: number;
  sharedCount: number;
}

export default function GoalTabs({ activeTab, onTabChange, personalCount, sharedCount }: GoalTabsProps) {
  return (
    <div className="flex gap-4 border-b border-gray-200">
      <button
        onClick={() => onTabChange('personal')}
        className={`pb-4 px-2 relative ${
          activeTab === 'personal' ? 'text-indigo-600' : 'text-gray-500 hover:text-gray-700'
        }`}
      >
        <span className="flex items-center gap-2">
          Personal Goals
          <span className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full text-sm">
            {personalCount}
          </span>
        </span>
        {activeTab === 'personal' && (
          <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600" />
        )}
      </button>
      <button
        onClick={() => onTabChange('shared')}
        className={`pb-4 px-2 relative ${
          activeTab === 'shared' ? 'text-indigo-600' : 'text-gray-500 hover:text-gray-700'
        }`}
      >
        <span className="flex items-center gap-2">
          Shared Goals
          <span className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full text-sm">
            {sharedCount}
          </span>
        </span>
        {activeTab === 'shared' && (
          <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600" />
        )}
      </button>
    </div>
  );
} 