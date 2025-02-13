'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import type { TaskFiltersState } from '@/types/taskFilters';
import type { TaskLabel } from '@/types/todo';

interface TaskFiltersProps {
  filters: TaskFiltersState;
  onFilterChange: (filters: TaskFiltersState) => void;
  availableLabels: string[];
}

export default function TaskFilters({ 
  filters, 
  onFilterChange,
  availableLabels = [] // Provide default empty array
}: TaskFiltersProps) {
  const handleLabelToggle = (label: string) => {
    onFilterChange({
      ...filters,
      labels: filters.labels.includes(label)
        ? filters.labels.filter((l: string) => l !== label)
        : [...filters.labels, label]
    });
  };

  return (
    <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
      <div className="space-y-4">
        {/* Search */}
        <div>
          <input
            type="text"
            value={filters.search}
            onChange={(e) => onFilterChange({ ...filters, search: e.target.value })}
            placeholder="Search tasks..."
            className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
        </div>

        {/* Priority Filter */}
        <div>
          <select
            value={filters.priority}
            onChange={(e) => onFilterChange({ ...filters, priority: e.target.value })}
            className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          >
            <option value="all">All Priorities</option>
            <option value="high">High Priority</option>
            <option value="medium">Medium Priority</option>
            <option value="low">Low Priority</option>
          </select>
        </div>

        {/* Show Completed Tasks Checkbox */}
        <div className="flex items-center gap-2">
          <label className="flex items-center gap-2 text-sm text-gray-600">
            <input
              type="checkbox"
              checked={filters.showCompleted}
              onChange={(e) => onFilterChange({
                ...filters,
                showCompleted: e.target.checked
              })}
              className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
            />
            Show Completed Tasks
          </label>
        </div>

        {/* Labels */}
        {availableLabels.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {availableLabels.map((label) => (
              <motion.button
                key={label}
                whileHover={{ scale: 1.05 }}
                onClick={() => handleLabelToggle(label)}
                className={`px-3 py-1 rounded-full text-sm ${
                  filters.labels.includes(label)
                    ? 'bg-indigo-100 text-indigo-800'
                    : 'bg-gray-100 text-gray-700'
                }`}
              >
                {label}
              </motion.button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
} 