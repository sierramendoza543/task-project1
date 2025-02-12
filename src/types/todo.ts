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
}

export type NewTodo = Omit<Todo, 'id' | 'userId' | 'createdAt' | 'updatedAt' | 'order'>; 