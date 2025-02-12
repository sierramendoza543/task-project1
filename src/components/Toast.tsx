'use client';

import { motion } from 'framer-motion';
import { useEffect } from 'react';

interface ToastProps {
  message: string;
  type: 'success' | 'error';
  onUndo?: () => void;
  onClose: () => void;
}

export default function Toast({ message, type, onUndo, onClose }: ToastProps) {
  // Auto-dismiss progress bar animation
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 5000);

    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <motion.div
      layout // This helps with smooth stacking
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95, y: 20 }}
      className={`relative overflow-hidden rounded-lg shadow-lg ${
        type === 'success' ? 'bg-green-100' : 'bg-red-100'
      }`}
    >
      <div className="p-4 pr-12 flex items-center gap-3">
        <span className={type === 'success' ? 'text-green-800' : 'text-red-800'}>
          {message}
        </span>
        {onUndo && (
          <button
            onClick={() => {
              onUndo();
              onClose();
            }}
            className="px-2 py-1 text-sm font-medium text-indigo-600 hover:text-indigo-800"
          >
            Undo
          </button>
        )}
        <button
          onClick={onClose}
          className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
        >
          ✕
        </button>
      </div>

      {/* Progress bar */}
      <motion.div
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 5 }}
        className={`absolute bottom-0 left-0 right-0 h-1 origin-left ${
          type === 'success' ? 'bg-green-500/20' : 'bg-red-500/20'
        }`}
      />
    </motion.div>
  );
} 