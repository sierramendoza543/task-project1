'use client';

import { ChangeEvent } from 'react';
import { motion } from 'framer-motion';
import type { TaskLabel, TodoPriority } from '@/types/todo';

type CompletedFilter = 'all' | 'completed' | 'active';

export interface TaskFiltersState {
  labels: TaskLabel[];
  priority: string;
  completed: CompletedFilter;
  search: string;
}

interface TaskFiltersProps {
  filters: TaskFiltersState;
  onChange: (filters: TaskFiltersState) => void;
  availableLabels: TaskLabel[];
}

export default function TaskFilters({ filters, onChange, availableLabels }: TaskFiltersProps) {
  const handleCompletedChange = (e: ChangeEvent<HTMLSelectElement>): void => {
    onChange({ 
      ...filters, 
      completed: e.target.value as CompletedFilter 
    });
  };

  const handleLabelToggle = (label: TaskLabel): void => {
    const newLabels = filters.labels.includes(label)
      ? filters.labels.filter(l => l !== label)
      : [...filters.labels, label];
    onChange({ ...filters, labels: newLabels });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-4"
    >
      <div className="flex gap-4 flex-wrap">
        <div className="flex-1 min-w-[200px]">
          <input
            type="text"
            value={filters.search}
            onChange={(e) => onChange({ ...filters, search: e.target.value })}
            placeholder="Search tasks..."
            className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 font-dm"
          />
        </div>

        <select
          value={filters.completed}
          onChange={handleCompletedChange}
          className="px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 font-dm"
        >
          <option value="all">All Tasks</option>
          <option value="completed">Completed</option>
          <option value="active">Active</option>
        </select>

        <select
          value={filters.priority}
          onChange={(e) => onChange({ ...filters, priority: e.target.value })}
          className="px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 font-dm"
        >
          <option value="all">All Priorities</option>
          <option value="high">High Priority</option>
          <option value="medium">Medium Priority</option>
          <option value="low">Low Priority</option>
        </select>
      </div>

      <div className="flex flex-wrap gap-2">
        {availableLabels.map((label) => (
          <motion.button
            key={label.toString()}
            type="button"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleLabelToggle(label)}
            className={`px-3 py-1 rounded-full text-sm font-dm transition-colors ${
              filters.labels.includes(label)
                ? 'bg-indigo-100 text-indigo-800'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {label.toString()}
          </motion.button>
        ))}
      </div>
    </motion.div>
  );
} 