'use client';

import { motion, AnimatePresence } from 'framer-motion';
import type { Todo } from '@/types/todo';
import EditTaskModal from './EditTaskModal';
import { useState } from 'react';

interface TaskPreviewProps {
  task: Todo;
  onClose: () => void;
  onEdit: (task: Todo) => void;
  onDelete: (taskId: string) => void;
  onToggle: (taskId: string, completed: boolean) => void;
}

export default function TaskPreview({ task, onClose, onEdit, onDelete, onToggle }: TaskPreviewProps) {
  const [isEditing, setIsEditing] = useState(false);

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleEditSubmit = (updatedTask: Partial<Todo>) => {
    onEdit({
      ...task,
      ...updatedTask,
      id: task.id
    });
    setIsEditing(false);
    onClose();
  };

  return (
    <>
      <div 
        className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
        onClick={handleBackdropClick}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="bg-white rounded-2xl shadow-xl w-full max-w-lg mx-4 overflow-hidden"
        >
          {/* Header */}
          <div className="p-6 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <input
                  type="checkbox"
                  checked={task.completed}
                  onChange={() => onToggle(task.id, !task.completed)}
                  className="h-5 w-5 rounded border-gray-300"
                />
                <h2 className={`text-xl font-bold ${task.completed ? 'line-through text-gray-500' : 'text-gray-900'}`}>
                  {task.title}
                </h2>
              </div>
              <button
                onClick={onClose}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 space-y-4">
            {/* Description */}
            {task.description && (
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-1">Description</h3>
                <p className="text-gray-600">{task.description}</p>
              </div>
            )}

            {/* Due Date & Time */}
            {task.dueDate && (
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-1">Due Date</h3>
                <p className="text-gray-600">
                  {new Date(task.dueDate).toLocaleDateString()}
                  {task.dueTime && ` at ${task.dueTime}`}
                </p>
              </div>
            )}

            {/* Priority */}
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-1">Priority</h3>
              <span className={`inline-block px-2 py-1 rounded-full text-sm ${
                task.priority === 'high' ? 'bg-red-100 text-red-800' :
                task.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                'bg-green-100 text-green-800'
              }`}>
                {task.priority}
              </span>
            </div>

            {/* Labels */}
            {task.labels && task.labels.length > 0 && (
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-1">Labels</h3>
                <div className="flex flex-wrap gap-2">
                  {task.labels.map(label => (
                    <span 
                      key={label}
                      className="px-2 py-1 rounded-full bg-indigo-100 text-indigo-800 text-sm"
                    >
                      {label}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="p-6 border-t border-gray-100 bg-gray-50 flex justify-end gap-2">
            <button
              onClick={() => onDelete(task.id)}
              className="px-4 py-2 text-red-600 hover:text-red-800 font-medium"
            >
              Delete
            </button>
            <button
              onClick={() => setIsEditing(true)}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
            >
              Edit
            </button>
          </div>
        </motion.div>
      </div>

      {/* Edit Task Modal */}
      {isEditing && (
        <EditTaskModal
          task={task}
          onSubmit={handleEditSubmit}
          onClose={() => setIsEditing(false)}
        />
      )}
    </>
  );
} 