'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import type { TaskFiltersState } from '@/types/taskFilters';
import type { TaskLabel } from '@/types/todo';

interface TaskFiltersProps {
  filters: TaskFiltersState;
  onChange: (filters: TaskFiltersState) => void;
  availableLabels: TaskLabel[];
}

export default function TaskFilters({ filters, onChange, availableLabels }: TaskFiltersProps) {
  const handleLabelToggle = (label: TaskLabel) => {
    onChange({
      ...filters,
      labels: filters.labels.includes(label)
        ? filters.labels.filter((l: TaskLabel) => l !== label)
        : [...filters.labels, label]
    });
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
      <div className="flex flex-col gap-4">
        {/* Search Row */}
        <div className="w-full">
          <input
            type="text"
            value={filters.search}
            onChange={(e) => onChange({ ...filters, search: e.target.value })}
            placeholder="Search tasks..."
            className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 font-dm"
          />
        </div>

        {/* Filters Row */}
        <div className="flex gap-4 flex-wrap">
          {/* Priority Filter */}
          <select
            value={filters.priority}
            onChange={(e) => onChange({ 
              ...filters, 
              priority: e.target.value as TaskFiltersState['priority']
            })}
            className="px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 font-dm"
          >
            <option value="all">All Priorities</option>
            <option value="high">High Priority</option>
            <option value="medium">Medium Priority</option>
            <option value="low">Low Priority</option>
          </select>

          {/* Sort */}
          <select
            value={filters.sort}
            onChange={(e) => onChange({ 
              ...filters, 
              sort: e.target.value as TaskFiltersState['sort']
            })}
            className="px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 font-dm"
          >
            <option value="dueDate-asc">Due Soon First</option>
            <option value="dueDate-desc">Due Later First</option>
          </select>
        </div>

        {/* Labels */}
        <div className="flex flex-wrap gap-2">
          {availableLabels.map((label) => (
            <motion.button
              key={label}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleLabelToggle(label)}
              className={`px-3 py-1 rounded-full text-sm font-dm transition-colors ${
                filters.labels.includes(label)
                  ? 'bg-indigo-100 text-indigo-800'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {label}
            </motion.button>
          ))}
        </div>
      </div>
    </div>
  );
} 