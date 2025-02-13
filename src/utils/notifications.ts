import { db } from '@/config/firebase';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';

interface NotificationData {
  userId: string;
  type: 'goal_shared' | 'goal_completed' | 'task_assigned' | 'goal_progress';
  title: string;
  message: string;
  link?: string;
  read?: boolean;
}

export async function createNotification(data: NotificationData) {
  try {
    const notificationsRef = collection(db, 'notifications');
    await addDoc(notificationsRef, {
      ...data,
      createdAt: serverTimestamp(),
      read: false
    });
  } catch (error) {
    console.error('Error creating notification:', error);
  }
}

export function generateNotificationMessage(type: NotificationData['type'], data: {
  goalTitle?: string;
  taskTitle?: string;
  userName?: string;
  progress?: number;
}): string {
  switch (type) {
    case 'goal_shared':
      return `${data.userName} shared a goal with you: "${data.goalTitle}"`;
    
    case 'goal_completed':
      return `Congratulations! You've completed your goal: "${data.goalTitle}"`;
    
    case 'task_assigned':
      return `${data.userName} assigned you a task: "${data.taskTitle}"`;
    
    case 'goal_progress':
      return `You've made progress on "${data.goalTitle}"! Now at ${data.progress}%`;
    
    default:
      return 'New notification';
  }
} 