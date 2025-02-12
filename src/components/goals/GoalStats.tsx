'use client';

import { motion } from 'framer-motion';
import type { Goal } from '@/types/goals';

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

interface GoalStatsProps {
  goals: Goal[];
}

export default function GoalStats({ goals }: GoalStatsProps) {
  const stats = [
    {
      icon: '🎯',
      label: 'Total Goals',
      value: goals.length,
      bgColor: 'bg-indigo-100'
    },
    {
      icon: '✅',
      label: 'Completed',
      value: goals.filter(g => g.status === 'completed').length,
      bgColor: 'bg-green-100'
    },
    {
      icon: '🏃',
      label: 'In Progress',
      value: goals.filter(g => g.status === 'in-progress').length,
      bgColor: 'bg-blue-100'
    },
    {
      icon: '⏳',
      label: 'Due Soon',
      value: goals.filter(g => {
        const daysUntilDue = Math.ceil((g.targetDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
        return daysUntilDue <= 7 && daysUntilDue > 0 && g.status === 'in-progress';
      }).length,
      bgColor: 'bg-yellow-100'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      {stats.map((stat, index) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <StatCard {...stat} />
        </motion.div>
      ))}
    </div>
  );
} 