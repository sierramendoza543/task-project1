'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import type { Todo } from '@/types/todo';

interface CompletionStatsProps {
  todos: Todo[];
}

type TimeRange = 'day' | 'week' | 'month' | 'year' | 'all';

export default function CompletionStats({ todos }: CompletionStatsProps) {
  const [selectedRange, setSelectedRange] = useState<TimeRange>('day');

  const getCompletedTasksCount = (range: TimeRange): number => {
    const now = new Date();
    const startDate = new Date();

    switch (range) {
      case 'day':
        startDate.setHours(0, 0, 0, 0);
        break;
      case 'week':
        startDate.setDate(now.getDate() - 7);
        break;
      case 'month':
        startDate.setMonth(now.getMonth() - 1);
        break;
      case 'year':
        startDate.setFullYear(now.getFullYear() - 1);
        break;
      case 'all':
        return todos.filter(todo => todo.completed).length;
    }

    return todos.filter(todo => {
      if (!todo.completed) return false;
      const completedDate = new Date(todo.updatedAt);
      return completedDate >= startDate && completedDate <= now;
    }).length;
  };

  const timeRanges: { value: TimeRange; label: string }[] = [
    { value: 'day', label: 'Today' },
    { value: 'week', label: 'This Week' },
    { value: 'month', label: 'This Month' },
    { value: 'year', label: 'This Year' },
    { value: 'all', label: 'All Time' },
  ];

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
      <h2 className="text-xl font-bold mb-6">Task Completion Statistics</h2>
      
      {/* Time range selector */}
      <div className="flex flex-wrap gap-2 mb-6">
        {timeRanges.map(({ value, label }) => (
          <button
            key={value}
            onClick={() => setSelectedRange(value)}
            className={`px-4 py-2 rounded-lg transition-colors ${
              selectedRange === value
                ? 'bg-indigo-600 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Stats display */}
      <motion.div
        key={selectedRange}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center p-6 bg-gray-50 rounded-xl"
      >
        <div className="text-4xl font-bold text-indigo-600 mb-2">
          {getCompletedTasksCount(selectedRange)}
        </div>
        <div className="text-gray-600">
          Tasks Completed {selectedRange === 'all' ? 'in Total' : 
            selectedRange === 'day' ? 'Today' :
            `This ${selectedRange.charAt(0).toUpperCase() + selectedRange.slice(1)}`}
        </div>
      </motion.div>
    </div>
  );
} 