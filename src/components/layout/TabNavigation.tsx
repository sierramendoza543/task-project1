'use client';

import { motion } from 'framer-motion';

interface Tab {
  id: string;
  label: string;
  count?: number;
}

interface TabNavigationProps {
  tabs?: Tab[];
  activeTab: string;
  onTabChange: (tabId: string) => void;
}

export default function TabNavigation({ 
  tabs = [],
  activeTab, 
  onTabChange 
}: TabNavigationProps) {
  return (
    <div className="border-b border-gray-200 mb-8">
      <nav className="flex gap-12">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`relative py-6 px-2 text-base font-medium transition-colors ${
              (activeTab === tab.id || (tab.id === 'tasks' && activeTab === 'dashboard'))
                ? 'text-indigo-600' 
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <span className="flex items-center gap-3">
              {tab.label}
            </span>
            {activeTab === tab.id && (
              <motion.div
                layoutId="activeTab"
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600"
                initial={false}
                animate={{ opacity: 1 }}
                transition={{
                  type: "spring",
                  stiffness: 500,
                  damping: 30
                }}
              />
            )}
          </button>
        ))}
      </nav>
    </div>
  );
} 