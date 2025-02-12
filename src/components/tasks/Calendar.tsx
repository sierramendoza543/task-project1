'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Todo } from '@/types/todo';
import TaskPreview from './TaskPreview';

interface CalendarProps {
  tasks: Todo[];
  onTaskClick: (task: Todo) => void;
  onToggle: (taskId: string, completed: boolean) => void;
  onDelete: (taskId: string) => void;
  onEdit: (task: Todo) => void;
}

const getPriorityStyles = (priority: string, completed: boolean) => {
  if (completed) {
    return 'bg-gray-100 text-gray-500'; // Completed tasks are always gray
  }
  
  switch (priority) {
    case 'high':
      return 'bg-red-100 text-red-800';
    case 'medium':
      return 'bg-yellow-100 text-yellow-800';
    case 'low':
      return 'bg-green-100 text-green-800';
    default:
      return 'bg-indigo-100 text-indigo-800';
  }
};

export default function Calendar({ tasks, onTaskClick, onToggle, onDelete, onEdit }: CalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [previewTask, setPreviewTask] = useState<Todo | null>(null);

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const daysInMonth = getDaysInMonth(currentDate);
  const firstDayOfMonth = getFirstDayOfMonth(currentDate);
  const monthNames = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const getTasksForDay = (day: number) => {
    return tasks
      .filter(task => {
        // Only include tasks with due dates
        if (!task.dueDate) return false;
        
        const dueDate = new Date(task.dueDate);
        return dueDate.getDate() === day &&
               dueDate.getMonth() === currentDate.getMonth() &&
               dueDate.getFullYear() === currentDate.getFullYear();
      })
      .sort((a, b) => {
        // Sort by time if available, otherwise by title
        if (a.dueTime && b.dueTime) {
          return a.dueTime.localeCompare(b.dueTime);
        }
        return a.title.localeCompare(b.title);
      });
  };

  const previousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
  };

  return (
    <>
      <div className="space-y-4">
        {/* Calendar View */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <div className="flex justify-between items-center mb-6">
            <button
              onClick={previousMonth}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              ←
            </button>
            <h2 className="text-xl font-bold font-space">
              {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
            </h2>
            <button
              onClick={nextMonth}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              →
            </button>
          </div>

          <div className="grid grid-cols-7 gap-2 mb-2">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
              <div key={day} className="text-center text-sm font-medium text-gray-600">
                {day}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-2">
            {[...Array(firstDayOfMonth)].map((_, index) => (
              <div key={`empty-${index}`} className="h-24 rounded-lg" />
            ))}
            
            {[...Array(daysInMonth)].map((_, index) => {
              const day = index + 1;
              const tasksForDay = getTasksForDay(day);
              const isToday = new Date().getDate() === day &&
                             new Date().getMonth() === currentDate.getMonth() &&
                             new Date().getFullYear() === currentDate.getFullYear();

              return (
                <motion.div
                  key={day}
                  className={`min-h-[120px] p-2 border rounded-lg ${
                    isToday ? 'border-indigo-500' : 'border-gray-100'
                  } hover:border-indigo-500 transition-colors overflow-y-auto`}
                  whileHover={{ scale: 1.02 }}
                >
                  <div className="text-right text-sm mb-2">
                    {day}
                  </div>
                  <div className="space-y-1">
                    {tasksForDay.map(task => (
                      <motion.button
                        key={task.id}
                        onClick={() => setPreviewTask(task)}
                        className={`w-full text-left text-xs p-2 rounded ${
                          getPriorityStyles(task.priority, task.completed)
                        }`}
                        whileHover={{ scale: 1.05 }}
                      >
                        <div className={`font-medium truncate ${
                          task.completed ? 'line-through' : ''
                        }`}>
                          {task.title}
                        </div>
                        {task.dueTime && (
                          <div className={`text-xs opacity-75 mt-0.5 ${
                            task.completed ? 'text-gray-400' : ''
                          }`}>
                            {task.dueTime}
                          </div>
                        )}
                      </motion.button>
                    ))}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Task Preview Modal */}
      <AnimatePresence>
        {previewTask && (
          <TaskPreview
            task={previewTask}
            onClose={() => setPreviewTask(null)}
            onEdit={onEdit}
            onDelete={onDelete}
            onToggle={onToggle}
          />
        )}
      </AnimatePresence>
    </>
  );
} 