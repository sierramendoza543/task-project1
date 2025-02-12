'use client';

import { motion } from 'framer-motion';
import type { Todo } from '@/types/todo';
import DateRangeFilter from '@/components/DateRangeFilter';

interface AnalyticsDashboardProps {
  todos: Todo[];
  dateRange: {
    start: Date;
    end: Date;
  };
  onDateRangeChange: (range: { start: Date; end: Date }) => void;
  onExport: () => void;
  analytics: {
    completionRate: (todos: Todo[]) => number;
    priorityDistribution: {
      high: number;
      medium: number;
      low: number;
    };
    labelStats: Record<string, number>;
    recentCompletions: Array<{
      date: Date;
      count: number;
    }>;
    overdueTasks: number;
  };
}

export default function AnalyticsDashboard({ 
  todos, 
  dateRange, 
  onDateRangeChange,
  onExport,
  analytics 
}: AnalyticsDashboardProps) {
  return (
    <div className="space-y-8">
      {/* Controls */}
      <div className="flex justify-between items-center">
        <DateRangeFilter
          dateRange={dateRange}
          onDateRangeChange={onDateRangeChange}
        />
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onExport}
          className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-dm transition-colors"
        >
          Export Data
        </motion.button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100"
        >
          <h3 className="text-lg font-bold font-space mb-4">Completion Rate</h3>
          <div className="text-3xl font-bold text-indigo-600">
            {analytics.completionRate(todos)}%
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100"
        >
          <h3 className="text-lg font-bold font-space mb-4">Overdue Tasks</h3>
          <div className="text-3xl font-bold text-red-600">
            {analytics.overdueTasks}
          </div>
        </motion.div>

        {/* ... Add other stat cards ... */}
      </div>

      {/* Weekly Activity Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100"
      >
        <h3 className="text-lg font-bold font-space mb-6">Weekly Activity</h3>
        <div className="flex items-end justify-between h-40">
          {analytics.recentCompletions.map((day, index) => (
            <div key={index} className="flex flex-col items-center">
              <div className="w-12">
                <div
                  className="bg-indigo-600 rounded-t-lg transition-all duration-500"
                  style={{ height: `${(day.count / 10) * 100}%`, minHeight: day.count > 0 ? '8px' : '0' }}
                />
              </div>
              <span className="text-xs mt-2 text-gray-600">
                {day.date.toLocaleDateString(undefined, { weekday: 'short' })}
              </span>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Priority Distribution */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100"
      >
        <h3 className="text-lg font-bold font-space mb-6">Priority Distribution</h3>
        <div className="grid grid-cols-3 gap-4">
          {Object.entries(analytics.priorityDistribution).map(([priority, count]) => (
            <div key={priority} className="text-center">
              <div className={`text-3xl font-bold mb-2 ${
                priority === 'high' ? 'text-red-600' :
                priority === 'medium' ? 'text-yellow-600' :
                'text-green-600'
              }`}>
                {count}
              </div>
              <div className="text-sm text-gray-600 font-dm capitalize">{priority}</div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
} 