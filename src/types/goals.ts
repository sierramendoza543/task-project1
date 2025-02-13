import { Timestamp } from 'firebase/firestore';

export type GoalStatus = 'in-progress' | 'completed' | 'cancelled';
export type GoalPriority = 'low' | 'medium' | 'high';

export interface SharedUser {
  email: string;
}

export interface FirestoreGoal {
  userId: string;
  title: string;
  description?: string;
  status: GoalStatus;
  priority: GoalPriority;
  progress: number;
  targetDate: Timestamp;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  tags: string[];
  targetTasks: number;
  sharedWith: SharedUser[];
  ownerEmail: string;
}

export interface Goal {
  id: string;
  userId: string;
  title: string;
  description?: string;
  status: GoalStatus;
  priority: GoalPriority;
  progress: number;
  targetDate: Date;
  createdAt: Date;
  updatedAt: Timestamp;
  tags: string[];
  targetTasks: number;
  sharedWith: SharedUser[];
  ownerEmail: string;
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