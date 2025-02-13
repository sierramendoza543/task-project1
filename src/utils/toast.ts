type ToastType = 'success' | 'error' | 'info';

export const addToast = (message: string, type: ToastType, undoAction?: () => void) => {
  // This will be implemented by each component that needs it
  console.log({ message, type, undoAction });
}; 