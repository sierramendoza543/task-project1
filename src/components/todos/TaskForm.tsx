'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import type { Todo } from '@/types/todo';

interface TaskFormProps {
  onSubmit: (task: Partial<Todo>) => void;
  onCancel?: () => void;
  initialData?: Partial<Todo>;
  isEditing?: boolean;
}

export default function TaskForm({ onSubmit, onCancel, initialData, isEditing }: TaskFormProps) {
  const [formData, setFormData] = useState({
    title: initialData?.title || '',
    description: initialData?.description || '',
    priority: initialData?.priority || 'medium',
    dueDate: initialData?.dueDate ? new Date(initialData.dueDate).toISOString().split('T')[0] : '',
    dueTime: initialData?.dueTime || '',
    labels: initialData?.labels || []
  });
  const [includeTime, setIncludeTime] = useState(!!initialData?.dueTime);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title.trim()) return;

    try {
      const newTodo = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        priority: formData.priority,
        dueDate: formData.dueDate ? new Date(formData.dueDate) : undefined,
        dueTime: formData.dueTime || undefined,
        labels: formData.labels,
      };

      console.log('Submitting new todo:', newTodo); // Debug log
      
      await onSubmit(newTodo);
      
      // Clear form
      setFormData({
        title: '',
        description: '',
        priority: 'medium',
        dueDate: '',
        dueTime: '',
        labels: []
      });
      setIncludeTime(false);
      
    } catch (error) {
      console.error('Error in task form submission:', error);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden"
    >
      <form onSubmit={handleSubmit} className="p-6 space-y-6">
        <div className="space-y-4">
          <input
            type="text"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            placeholder="Task title"
            className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 font-dm"
            required
          />
          
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="Description (optional)"
            className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 font-dm resize-none"
            rows={3}
          />

          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1 font-dm">Due Date & Time</label>
              <div className="flex gap-2">
                <input
                  type="date"
                  value={formData.dueDate}
                  onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                  className="flex-1 px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 font-dm"
                />
                <input
                  type="time"
                  value={formData.dueTime}
                  onChange={(e) => setFormData({ ...formData, dueTime: e.target.value })}
                  className="w-32 px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 font-dm"
                />
              </div>
            </div>

            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1 font-dm">Priority</label>
              <select
                value={formData.priority}
                onChange={(e) => setFormData({ ...formData, priority: e.target.value as Todo['priority'] })}
                className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 font-dm"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3">
          {onCancel && (
            <motion.button
              type="button"
              onClick={onCancel}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="px-4 py-2 rounded-lg text-gray-600 hover:bg-gray-50 font-dm transition-colors"
            >
              Cancel
            </motion.button>
          )}
          <motion.button
            type="submit"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 font-dm transition-colors"
          >
            {isEditing ? 'Update Task' : 'Add Task'}
          </motion.button>
        </div>
      </form>
    </motion.div>
  );
} 