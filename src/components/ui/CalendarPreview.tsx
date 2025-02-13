'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import { Calendar as CalendarIcon, Clock, CheckCircle } from 'lucide-react';

export default function CalendarPreview() {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  
  const tasks = [
    { id: 1, title: "Team Meeting", time: "10:00 AM", completed: false },
    { id: 2, title: "Project Review", time: "2:00 PM", completed: true },
    { id: 3, title: "Client Call", time: "4:30 PM", completed: false }
  ];

  return (
    <div className="bg-white rounded-2xl shadow-xl p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold">Calendar</h3>
        <div className="flex gap-2">
          <button className="p-2 hover:bg-gray-50 rounded-lg">Month</button>
          <button className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">Week</button>
          <button className="p-2 hover:bg-gray-50 rounded-lg">Day</button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-1">
        {/* Calendar header */}
        {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => (
          <div key={day} className="text-center py-2 text-sm text-gray-500">
            {day}
          </div>
        ))}

        {/* Calendar days */}
        {Array.from({ length: 35 }).map((_, i) => (
          <motion.button
            key={i}
            className={`relative p-2 rounded-lg ${
              i === 15 ? 'bg-indigo-50 text-indigo-600' : 'hover:bg-gray-50'
            }`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <span>{i + 1}</span>
            {i % 5 === 0 && (
              <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-indigo-400 rounded-full" />
            )}
          </motion.button>
        ))}
      </div>

      <div className="mt-6 space-y-3">
        {tasks.map(task => (
          <motion.div
            key={task.id}
            className="flex items-center gap-4 p-3 rounded-lg hover:bg-gray-50"
            whileHover={{ x: 5 }}
          >
            <div className={`p-2 rounded-lg ${task.completed ? 'bg-green-100' : 'bg-indigo-100'}`}>
              {task.completed ? (
                <CheckCircle className="w-5 h-5 text-green-600" />
              ) : (
                <Clock className="w-5 h-5 text-indigo-600" />
              )}
            </div>
            <div>
              <p className="font-medium">{task.title}</p>
              <p className="text-sm text-gray-500">{task.time}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
} 