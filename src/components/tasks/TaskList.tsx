'use client';

import { useState, forwardRef } from 'react';
import { motion, AnimatePresence, HTMLMotionProps } from 'framer-motion';
import { DragDropContext, Droppable, Draggable, DropResult, DraggableProvided } from '@hello-pangea/dnd';
import type { Todo } from '@/types/todo';
import TaskForm from './TaskForm';
import TaskFilters from './TaskFilters';
import type { TaskFiltersState } from './TaskFilters';
import type { TaskLabel } from '@/types/todo';

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
  const [editingTodo, setEditingTodo] = useState<Todo | null>(null);

  const handleEdit = (todo: Todo) => {
    setEditingTodo(todo);
  };

  const handleEditSubmit = (updatedTodo: Partial<Todo>) => {
    if (editingTodo) {
      onEdit({
        ...editingTodo,
        ...updatedTodo
      });
      setEditingTodo(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Add Task Button */}
      <motion.button
        onClick={() => setIsFormVisible(!isFormVisible)}
        className="w-full bg-white p-4 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300 flex items-center justify-between font-dm"
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.99 }}
      >
        <span className="text-gray-900">
          {isFormVisible ? 'Cancel Adding Task' : 'Add New Task'}
        </span>
        <motion.span
          animate={{ rotate: isFormVisible ? 180 : 0 }}
          transition={{ duration: 0.3 }}
        >
          ↓
        </motion.span>
      </motion.button>

      {/* Collapsible Add Form */}
      <AnimatePresence>
        {isFormVisible && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <TaskForm 
              onSubmit={(todo) => {
                onAddTodo(todo);
                setIsFormVisible(false);
              }}
              onCancel={() => setIsFormVisible(false)}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Edit Form */}
      <AnimatePresence>
        {editingTodo && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-white rounded-2xl shadow-md border border-gray-100 p-4"
          >
            <h3 className="text-lg font-bold font-space mb-4">Edit Task</h3>
            <TaskForm
              initialData={editingTodo}
              onSubmit={handleEditSubmit}
              onCancel={() => setEditingTodo(null)}
              isEditing
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Filters */}
      <TaskFilters
        filters={filters}
        onChange={onFilterChange}
        availableLabels={availableLabels}
      />

      {/* Task List */}
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="todos">
          {(provided) => (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
              className="space-y-3"
            >
              <AnimatePresence>
                {tasks.map((todo, index) => (
                  <Draggable key={todo.id} draggableId={todo.id} index={index}>
                    {(provided) => (
                      <DraggableMotionDiv
                        ref={provided.innerRef}
                        draggableProps={provided.draggableProps}
                        dragHandleProps={provided.dragHandleProps}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="group bg-white p-4 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300"
                      >
                        <div className="flex items-center gap-4">
                          <input
                            type="checkbox"
                            checked={todo.completed || false}
                            onChange={() => onToggle(todo.id, todo.completed || false)}
                            className="h-5 w-5 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                          />
                          <div className="flex-1">
                            <h3 className={`font-dm ${todo.completed ? 'line-through text-gray-400' : 'text-gray-900'}`}>
                              {todo.title}
                            </h3>
                            {todo.description && (
                              <p className="text-sm text-gray-500 mt-1">{todo.description}</p>
                            )}
                            {/* Priority and Due Date */}
                            <div className="flex gap-2 mt-2">
                              <span className={`text-xs px-2 py-1 rounded-full ${
                                todo.priority === 'high' ? 'bg-red-100 text-red-800' :
                                todo.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                                'bg-green-100 text-green-800'
                              }`}>
                                {todo.priority}
                              </span>
                              {todo.dueDate && (
                                <span className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-700">
                                  Due: {new Date(todo.dueDate).toLocaleDateString()}
                                </span>
                              )}
                            </div>
                          </div>
                          <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-all">
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => handleEdit(todo)}
                              className="p-2 text-gray-500 hover:text-indigo-600 rounded-full hover:bg-indigo-50"
                            >
                              ✏️
                            </motion.button>
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => onDelete(todo.id)}
                              className="p-2 text-gray-500 hover:text-red-600 rounded-full hover:bg-red-50"
                            >
                              🗑️
                            </motion.button>
                          </div>
                        </div>
                      </DraggableMotionDiv>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </AnimatePresence>
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  );
} 