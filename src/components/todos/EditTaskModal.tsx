'use client';

import { motion } from 'framer-motion';
import TaskForm from './TaskForm';
import type { Todo } from '@/types/todo';

interface EditTaskModalProps {
  task: Todo;
  onSubmit: (updatedTask: Partial<Todo>) => void;
  onClose: () => void;
}

export default function EditTaskModal({ task, onSubmit, onClose }: EditTaskModalProps) {
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
      onClick={handleBackdropClick}
    >
      <div className="w-full max-w-lg mx-4">
        <TaskForm
          initialData={task}
          onSubmit={onSubmit}
          onCancel={onClose}
          isEditing={true}
        />
      </div>
    </div>
  );
} 