'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import { CheckCircle, Clock } from 'lucide-react';

export default function CalendarMockup() {
  const [currentDate] = useState(new Date());
  const monthNames = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  // Sample tasks for demo
  const mockTasks = {
    15: [
      { id: 1, title: "Team Meeting", time: "10:00 AM", priority: "high", completed: false },
      { id: 2, title: "Project Review", time: "2:00 PM", priority: "medium", completed: true }
    ],
    18: [
      { id: 3, title: "Client Call", time: "4:30 PM", priority: "low", completed: false }
    ]
  };

  const getPriorityStyles = (priority: string, completed: boolean) => {
    if (completed) {
      return 'bg-gray-100 text-gray-500';
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

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
      <div className="flex justify-between items-center mb-6">
        <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
          ←
        </button>
        <h2 className="text-xl font-bold font-space">
          {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
        </h2>
        <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
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
        {Array.from({ length: 35 }).map((_, index) => {
          const day = index + 1;
          const tasksForDay = mockTasks[day as keyof typeof mockTasks] || [];
          const isToday = currentDate.getDate() === day;

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
                  <motion.div
                    key={task.id}
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
                    {task.time && (
                      <div className={`text-xs opacity-75 mt-0.5 ${
                        task.completed ? 'text-gray-400' : ''
                      }`}>
                        {task.time}
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
} 