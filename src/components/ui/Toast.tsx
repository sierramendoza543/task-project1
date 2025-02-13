'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, XCircle, Info, X } from 'lucide-react';

interface ToastProps {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
  onDismiss: (id: string) => void;
  undoAction?: () => void;
}

export default function Toast({ id, message, type, onDismiss, undoAction }: ToastProps) {
  const icons = {
    success: <CheckCircle className="w-5 h-5 text-green-500" />,
    error: <XCircle className="w-5 h-5 text-red-500" />,
    info: <Info className="w-5 h-5 text-blue-500" />
  };

  const colors = {
    success: 'bg-green-50 border-green-200',
    error: 'bg-red-50 border-red-200',
    info: 'bg-blue-50 border-blue-200'
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 50, scale: 0.3 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.5, transition: { duration: 0.2 } }}
      className={`flex items-center justify-between gap-4 p-4 rounded-lg border shadow-lg ${colors[type]}`}
    >
      <div className="flex items-center gap-3">
        {icons[type]}
        <span className="text-gray-700">{message}</span>
      </div>
      <div className="flex items-center gap-2">
        {undoAction && (
          <button
            onClick={undoAction}
            className="text-sm font-medium text-indigo-600 hover:text-indigo-800"
          >
            Undo
          </button>
        )}
        <button
          onClick={() => onDismiss(id)}
          className="text-gray-400 hover:text-gray-600"
        >
          <X className="w-5 h-5" />
        </button>
      </div>
    </motion.div>
  );
} 