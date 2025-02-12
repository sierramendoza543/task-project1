import { Timestamp } from 'firebase/firestore';

export type TodoPriority = 'low' | 'medium' | 'high';
export type TodoStatus = 'pending' | 'in-progress' | 'completed';

export interface Todo {
  id: string;
  title: string;
  description?: string;
  status: TodoStatus;
  priority: TodoPriority;
  dueDate?: Date;
  dueTime?: string;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
  labels?: string[];
  completed?: boolean;
  order?: number;
}

export type TaskLabel = string;

export interface FirestoreTodo {
  userId: string;
  title: string;
  description?: string;
  completed: boolean;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  order: number;
  priority: 'low' | 'medium' | 'high';
  dueDate?: Timestamp;
  dueTime?: string;
}

export type NewTodo = Omit<Todo, 'id' | 'userId' | 'createdAt' | 'updatedAt' | 'order'>;

export type TaskSortOption = 'dueDate-asc' | 'dueDate-desc';

export interface TaskFiltersState {
  labels: TaskLabel[];
  priority: string;
  search: string;
  showCompleted: boolean;
  sort: TaskSortOption;
} 