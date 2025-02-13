'use client';

import { useState, FormEvent, ChangeEvent } from 'react';
import { Milestone } from '@/types/goals';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';

interface MilestoneListProps {
  milestones: Milestone[];
  onAdd: (title: string) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
  onToggle: (id: string, completed: boolean) => Promise<void>;
  onReorder: (startIndex: number, endIndex: number) => Promise<void>;
}

interface DraggableItemProps {
  milestone: Milestone;
  index: number;
  onToggle: (id: string, completed: boolean) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}

export default function MilestoneList({
  milestones,
  onAdd,
  onDelete,
  onToggle,
  onReorder
}: MilestoneListProps) {
  const [newMilestone, setNewMilestone] = useState<string>('');

  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    if (!newMilestone.trim()) return;

    await onAdd(newMilestone.trim());
    setNewMilestone('');
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>): void => {
    setNewMilestone(e.target.value);
  };

  const handleDragEnd = (result: DropResult): void => {
    if (!result.destination) return;

    const sourceIndex = result.source.index;
    const destinationIndex = result.destination.index;

    if (sourceIndex === destinationIndex) return;

    onReorder(sourceIndex, destinationIndex);
  };

  return (
    <div className="space-y-4">
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="text"
          value={newMilestone}
          onChange={handleInputChange}
          placeholder="Add a milestone..."
          className="flex-1 px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
        />
        <button
          type="submit"
          className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
        >
          Add
        </button>
      </form>

      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="milestones">
          {(provided) => (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
              className="space-y-2"
            >
              {milestones.map((milestone, index) => (
                <Draggable
                  key={milestone.id}
                  draggableId={milestone.id}
                  index={index}
                >
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      className="flex items-center gap-3 bg-white p-3 rounded-lg shadow-sm"
                    >
                      <input
                        type="checkbox"
                        checked={milestone.completed}
                        onChange={() => onToggle(milestone.id, milestone.completed)}
                        className="h-5 w-5 rounded border-gray-300"
                      />
                      <span className={milestone.completed ? 'line-through text-gray-500' : ''}>
                        {milestone.title}
                      </span>
                      <button
                        type="button"
                        onClick={() => onDelete(milestone.id)}
                        className="ml-auto text-red-600 hover:text-red-800"
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  );
} 