import { Todo } from '@/types/todo';
import { isInDateRange, formatTimestamp } from '@/utils/dates';

export const exportToCSV = (todos: Todo[], dateRange: { start: Date; end: Date }) => {
  const filteredTodos = todos.filter(todo => 
    isInDateRange(todo.createdAt, dateRange)
  );

  const headers = [
    'Title',
    'Description',
    'Status',
    'Priority',
    'Created At',
    'Due Date',
    'Labels'
  ];

  const rows = filteredTodos.map(todo => [
    todo.title,
    todo.description || '',
    todo.completed ? 'Completed' : 'Active',
    todo.priority,
    formatTimestamp(todo.createdAt),
    todo.dueDate ? todo.dueDate.toLocaleDateString() : '',
    todo.labels?.join(', ') || ''
  ]);

  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.join(','))
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', `tasks_${dateRange.start.toISOString().split('T')[0]}_${dateRange.end.toISOString().split('T')[0]}.csv`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}; 