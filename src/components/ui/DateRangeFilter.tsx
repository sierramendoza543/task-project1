'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar } from 'lucide-react';

interface DateRangeFilterProps {
  startDate: Date;
  endDate: Date;
  onDateChange: (start: Date, end: Date) => void;
}

export default function DateRangeFilter({ startDate, endDate, onDateChange }: DateRangeFilterProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleDateChange = (type: 'start' | 'end', date: string) => {
    const newDate = new Date(date);
    if (type === 'start') {
      onDateChange(newDate, endDate);
    } else {
      onDateChange(startDate, newDate);
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 text-sm text-gray-600 hover:text-gray-900 transition-colors"
      >
        <Calendar className="w-4 h-4" />
        <span>Date Range</span>
      </button>

      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute top-full right-0 mt-2 bg-white rounded-lg shadow-lg p-4 z-50"
        >
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Start Date
              </label>
              <input
                type="date"
                value={startDate.toISOString().split('T')[0]}
                onChange={(e) => handleDateChange('start', e.target.value)}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                End Date
              </label>
              <input
                type="date"
                value={endDate.toISOString().split('T')[0]}
                onChange={(e) => handleDateChange('end', e.target.value)}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
} 