'use client';

import { motion } from 'framer-motion';
import { ChangeEvent } from 'react';

interface DateRange {
  start: Date;
  end: Date;
}

interface DateRangeFilterProps {
  dateRange: DateRange;
  onDateRangeChange: (range: DateRange) => void;
}

export default function DateRangeFilter({ 
  dateRange, 
  onDateRangeChange 
}: DateRangeFilterProps) {
  const formatDateForInput = (date: Date): string => {
    return date.toISOString().split('T')[0];
  };

  const handleStartDateChange = (e: ChangeEvent<HTMLInputElement>): void => {
    onDateRangeChange({
      start: new Date(e.target.value),
      end: dateRange.end
    });
  };

  const handleEndDateChange = (e: ChangeEvent<HTMLInputElement>): void => {
    onDateRangeChange({
      start: dateRange.start,
      end: new Date(e.target.value)
    });
  };

  const setLastNDays = (days: number): void => {
    const end = new Date();
    const start = new Date();
    start.setDate(end.getDate() - days);
    onDateRangeChange({ start, end });
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-center gap-4 bg-white p-4 rounded-xl shadow-sm border border-gray-100"
    >
      <div className="flex items-center gap-2">
        <label className="text-sm font-dm text-gray-600">From:</label>
        <input
          type="date"
          value={formatDateForInput(dateRange.start)}
          onChange={handleStartDateChange}
          className="px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 font-dm"
          max={formatDateForInput(dateRange.end)}
        />
      </div>

      <div className="flex items-center gap-2">
        <label className="text-sm font-dm text-gray-600">To:</label>
        <input
          type="date"
          value={formatDateForInput(dateRange.end)}
          onChange={handleEndDateChange}
          className="px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 font-dm"
          min={formatDateForInput(dateRange.start)}
        />
      </div>

      {/* Quick Select Buttons */}
      <div className="flex gap-2">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setLastNDays(7)}
          className="px-3 py-1 text-sm font-dm text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
        >
          Last 7 Days
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setLastNDays(30)}
          className="px-3 py-1 text-sm font-dm text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
        >
          Last 30 Days
        </motion.button>
      </div>
    </motion.div>
  );
} 