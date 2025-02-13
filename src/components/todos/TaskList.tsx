'use client';

import { useState, forwardRef } from 'react';
import { motion, AnimatePresence, HTMLMotionProps } from 'framer-motion';
import { DragDropContext, Droppable, Draggable, DropResult, DraggableProvided } from '@hello-pangea/dnd';
import type { Todo } from '@/types/todo';
import TaskForm from './TaskForm';
import TaskFilters from './TaskFilters';
import type { TaskFiltersState } from '@/types/taskFilters';
import type { TaskLabel } from '@/types/todo';
import EditTaskModal from './EditTaskModal';

// Create a wrapper component that handles both drag and motion properties
const DraggableMotionDiv = motion(
  forwardRef<HTMLDivElement, any>((props, ref) => {
    const { dragHandleProps, draggableProps, ...rest } = props;
    return (
      <div
        ref={ref}
        {...draggableProps}
        {...dragHandleProps}
        {...rest}
      />
    );
  })
);

DraggableMotionDiv.displayName = 'DraggableMotionDiv';

interface TaskListProps {
  tasks: Todo[];
  onToggle: (id: string, completed: boolean) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
  onEdit: (todo: Todo) => void;
  onDragEnd: (result: DropResult) => void;
  onAddTodo: (todo: Partial<Todo>) => Promise<void>;
  filters: TaskFiltersState;
  onFilterChange: (filters: TaskFiltersState) => void;
  availableLabels: string[];
}

export default function TaskList({ 
  tasks, 
  onToggle, 
  onDelete, 
  onEdit, 
  onDragEnd,
  onAddTodo,
  filters,
  onFilterChange,
  availableLabels
}: TaskListProps) {
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [editingTask, setEditingTask] = useState<Todo | null>(null);

  const handleEditSubmit = (updatedTask: Partial<Todo>) => {
    if (editingTask) {
      onEdit({
        ...editingTask,
        ...updatedTask,
        id: editingTask.id
      });
      setEditingTask(null);
    }
  };

  return (
    <div className="space-y-4">
      <TaskFilters
        filters={filters}
        onChange={onFilterChange}
        availableLabels={availableLabels}
      />
      
      <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg border border-gray-100">
        <label className="flex items-center gap-2 text-sm text-gray-600">
          <input
            type="checkbox"
            checked={filters.showCompleted}
            onChange={(e) => onFilterChange({
              ...filters,
              showCompleted: e.target.checked
            })}
            className="rounded border-gray-300"
          />
          Show Completed Tasks
        </label>
      </div>

      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="tasks">
          {(provided) => (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
              className="space-y-2"
            >
              {tasks.map((task, index) => (
                <Draggable 
                  key={task.id} 
                  draggableId={task.id} 
                  index={index}
                >
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 hover:border-indigo-500 transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <input
                          type="checkbox"
                          checked={task.completed}
                          onChange={() => onToggle(task.id, !task.completed)}
                          className="h-5 w-5 rounded border-gray-300"
                        />
                        <div className="flex-1">
                          <h3 className={`font-medium ${task.completed ? 'line-through text-gray-500' : 'text-gray-900'}`}>
                            {task.title}
                          </h3>
                          {task.description && (
                            <p className="text-sm text-gray-600 mt-1">{task.description}</p>
                          )}
                          {/* Task metadata */}
                          <div className="flex flex-wrap gap-2 mt-2">
                            {task.priority && (
                              <span className={`text-xs px-2 py-1 rounded-full ${
                                task.priority === 'high' ? 'bg-red-100 text-red-800' :
                                task.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                                'bg-green-100 text-green-800'
                              }`}>
                                {task.priority}
                              </span>
                            )}
                            {task.dueDate && (
                              <span className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-700">
                                Due: {new Date(task.dueDate).toLocaleDateString()}
                                {task.dueTime && ` at ${task.dueTime}`}
                              </span>
                            )}
                            {task.labels?.map(label => (
                              <span 
                                key={label}
                                className="text-xs px-2 py-1 rounded-full bg-indigo-100 text-indigo-800"
                              >
                                {label}
                              </span>
                            ))}
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => setEditingTask(task)}
                            className="p-2 text-gray-500 hover:text-indigo-600 rounded-full hover:bg-indigo-50"
                          >
                            ✏️
                          </button>
                          <button
                            onClick={() => onDelete(task.id)}
                            className="p-2 text-gray-500 hover:text-red-600 rounded-full hover:bg-red-50"
                          >
                            🗑️
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>

      {/* Edit Task Modal */}
      {editingTask && (
        <EditTaskModal
          task={editingTask}
          onSubmit={handleEditSubmit}
          onClose={() => setEditingTask(null)}
        />
      )}
    </div>
  );
} 