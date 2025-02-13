'use client';

import { motion } from 'framer-motion';
import type { Todo } from '@/types/todo';
import DateRangeFilter from '@/components/ui/DateRangeFilter';
import CompletionStats from './CompletionStats';
import CircularProgress from '../ui/CircularProgress';
import 'react-circular-progressbar/dist/styles.css';

interface AnalyticsDashboardProps {
  todos: Todo[];
  dateRange: {
    start: Date;
    end: Date;
  };
  onDateRangeChange: (range: { start: Date; end: Date }) => void;
  onExport: () => void;
  analytics: {
    completionRate: number;
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
  const { completionRate, priorityDistribution, overdueTasks } = analytics;
  const totalTasks = Object.values(priorityDistribution).reduce((a, b) => a + b, 0);
  const overduePercentage = overdueTasks > 0 ? (overdueTasks / totalTasks) * 100 : 0;
  const overdueCount = overdueTasks;

  return (
    <div className="space-y-6">
      {/* Add CompletionStats at the top */}
      <CompletionStats todos={todos} />

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
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Completion Rate Card */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold mb-4">Completion Rate</h3>
          <div className="flex items-center justify-center">
            <CircularProgress
              value={completionRate}
              text={`${completionRate}%`}
              pathColor="#4F46E5"
              textColor="#4F46E5"
              trailColor="#E0E7FF"
            />
          </div>
        </div>

        {/* Overdue Tasks Card */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold mb-4">Overdue Tasks</h3>
          <div className="flex items-center justify-center">
            <CircularProgress
              value={overduePercentage}
              text={`${overdueCount}`}
              pathColor="#EF4444"
              textColor="#EF4444"
              trailColor="#FEE2E2"
            />
          </div>
        </div>

        {/* Priority Distribution Card */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold mb-4">Priority Distribution</h3>
          <div className="space-y-4">
            {Object.entries(priorityDistribution).map(([priority, count]) => (
              <div key={priority}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="capitalize">{priority}</span>
                  <span>{count}</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full ${
                      priority === 'high'
                        ? 'bg-red-500'
                        : priority === 'medium'
                        ? 'bg-yellow-500'
                        : 'bg-green-500'
                    }`}
                    style={{
                      width: `${(count / totalTasks) * 100}%`
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
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
    </div>
  );
} 