'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';

export type TabId = 'dashboard' | 'goals' | 'analytics';

export const tabs: { id: TabId; name: string; href: string }[] = [
  { id: 'dashboard', name: 'Tasks', href: '/dashboard' },
  { id: 'goals', name: 'Goals', href: '/goals' },
  { id: 'analytics', name: 'Analytics', href: '/analytics' }
];

export interface TabNavigationProps {
  activeTab: TabId;
  onTabChange: (tab: TabId) => void;
}

export default function TabNavigation({ activeTab, onTabChange }: TabNavigationProps) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="grid grid-cols-3 divide-x divide-gray-100">
        {tabs.map((tab) => (
          <motion.button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            type="button"
            className={`relative py-4 px-6 transition-all duration-300 ${
              activeTab === tab.id 
                ? 'bg-gray-50 text-gray-900' 
                : 'bg-white text-gray-500 hover:bg-gray-50'
            }`}
            whileHover={{ scale: 0.98 }}
            whileTap={{ scale: 0.95 }}
          >
            <div className="flex flex-col items-center gap-2">
              <span className="text-xl">{tab.name}</span>
            </div>
            {activeTab === tab.id && (
              <motion.div
                layoutId="activeTab"
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-gray-900"
                initial={false}
                transition={{ 
                  type: "spring", 
                  stiffness: 300, 
                  damping: 30 
                }}
              />
            )}
          </motion.button>
        ))}
      </div>
    </div>
  );
} 