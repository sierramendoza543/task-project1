'use client';

import { motion } from 'framer-motion';
import { useEffect } from 'react';

interface ToastProps {
  message: string;
  type: 'success' | 'error' | 'info';
  onClose: () => void;
  onUndo?: () => void;
}

export default function Toast({ message, type, onClose, onUndo }: ToastProps) {
  const bgColor = {
    success: 'bg-green-100',
    error: 'bg-red-100',
    info: 'bg-blue-100'
  }[type];

  const textColor = {
    success: 'text-green-800',
    error: 'text-red-800',
    info: 'text-blue-800'
  }[type];

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
      className={`${bgColor} ${textColor} p-4 pr-12 rounded-lg shadow-lg flex items-center gap-3`}
    >
      <span>{message}</span>
      {onUndo && (
        <button
          onClick={() => {
            onUndo();
            onClose();
          }}
          className={`px-2 py-1 text-sm font-medium ${textColor} hover:text-${textColor.replace('800', '900')}`}
        >
          Undo
        </button>
      )}
      <button
        onClick={onClose}
        className={`absolute right-2 top-1/2 -translate-y-1/2 ${textColor} hover:opacity-75`}
      >
        ✕
      </button>

      {/* Progress bar */}
      <motion.div
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 5 }}
        className={`absolute bottom-0 left-0 right-0 h-1 origin-left ${
          type === 'success' ? 'bg-green-500/20' : type === 'error' ? 'bg-red-500/20' : 'bg-blue-500/20'
        }`}
      />
    </motion.div>
  );
} 