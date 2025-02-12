import { Timestamp } from 'firebase/firestore';

export type GoalStatus = 'in-progress' | 'completed' | 'cancelled';
export type GoalPriority = 'low' | 'medium' | 'high';

export interface SharedUser {
  email: string;
  role: 'viewer' | 'editor';
  userId?: string;
}

export interface Goal {
  id: string;
  userId: string;
  title: string;
  description?: string;
  targetDate: Date;
  status: GoalStatus;
  priority: GoalPriority;
  progress: number;
  createdAt: Date;
  updatedAt: Date;
  relatedTodos: string[];
  tags: string[];
  sharedWith: SharedUser[];
  sharedBy?: string;
}

export interface FirestoreGoal {
  userId: string;
  title: string;
  description?: string;
  targetDate: Timestamp;
  status: GoalStatus;
  priority: GoalPriority;
  progress: number;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  relatedTodos?: string[];
  tags: string[];
  sharedWith: SharedUser[];
}

export type NewGoal = Omit<Goal, 'id' | 'userId' | 'createdAt' | 'updatedAt' | 'progress'>;

export interface Milestone {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  dueDate?: Date;
  order: number;
  goalId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface FirestoreMilestone {
  title: string;
  description?: string;
  completed: boolean;
  dueDate?: Timestamp;
  order: number;
  goalId: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
} 