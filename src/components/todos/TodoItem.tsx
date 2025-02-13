interface TodoItemProps {
  todo: Todo;
  onToggle: (todoId: string, completed: boolean) => Promise<void>;
  onDelete: (todoId: string) => Promise<void>;
  onEdit: (todo: Todo) => void;
}

export default function TodoItem({ todo, onToggle, onDelete, onEdit }: TodoItemProps) {
  const handleToggle = async () => {
    await onToggle(todo.id, !todo.completed);
    // Goal progress will be updated through the todos dependency in Goals component
  };

  return (
    // ... rest of your TodoItem component
  );
} 