'use client';

import { motion } from 'framer-motion';
import type { GoalData } from '@/types/goals';
import { Timestamp } from 'firebase/firestore';
import { isInDateRange, timestampToDate } from '@/utils/dates';

interface StatCardProps {
  icon: string;
  label: string;
  value: number;
  bgColor: string;
}

function StatCard({ icon, label, value, bgColor }: StatCardProps) {
  return (
    <motion.div 
      whileHover={{ y: -5 }}
      className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100"
    >
      <div className="flex items-center gap-4">
        <div className={`h-12 w-12 rounded-full ${bgColor} flex items-center justify-center`}>
          <span className="text-2xl">{icon}</span>
        </div>
        <div>
          <p className="text-sm text-gray-500 font-dm">{label}</p>
          <p className="text-2xl font-bold font-space">{value}</p>
        </div>
      </div>
    </motion.div>
  );
}

interface GoalStats {
  total: number;
  completed: number;
  inProgress: number;
  notStarted: number;
}

interface GoalStatsProps {
  stats: GoalStats;
}

export default function GoalStats({ stats }: GoalStatsProps) {
  const statItems = [
    {
      label: 'Total Goals',
      value: stats.total,
      bgColor: 'bg-indigo-100'
    },
    {
      label: 'Completed',
      value: stats.completed,
      bgColor: 'bg-green-100'
    },
    {
      label: 'In Progress',
      value: stats.inProgress,
      bgColor: 'bg-yellow-100'
    },
    {
      label: 'Not Started',
      value: stats.notStarted,
      bgColor: 'bg-gray-100'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      {statItems.map((item, index) => (
        <div
          key={item.label}
          className={`${item.bgColor} rounded-xl p-4 text-center`}
        >
          <h3 className="text-3xl font-bold mb-2">{item.value}</h3>
          <p className="text-gray-600">{item.label}</p>
        </div>
      ))}
    </div>
  );
} 