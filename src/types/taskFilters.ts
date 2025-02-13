import type { TaskLabel } from './todo';

export interface TaskFiltersState {
  labels: TaskLabel[];
  priority: 'all' | 'low' | 'medium' | 'high';
  search: string;
  showCompleted: boolean;
  sort: 'dueDate-asc' | 'dueDate-desc';
} 