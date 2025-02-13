import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { 
  doc, 
  getDoc, 
  updateDoc, 
  serverTimestamp 
} from 'firebase/firestore';
import { db } from '@/config/firebase';
import { collection, query, where, orderBy, getDocs } from 'firebase/firestore';
import Toast from '@/components/shared/Toast';
import AlertModal from '@/components/shared/AlertModal';
import { Todo } from '@/types/todo';
import { addToast } from '@/utils/toast';

const handleToggle = async (todoId: string, completed: boolean) => {
  try {
    const todoRef = doc(db, 'todos', todoId);
    const todoDoc = await getDoc(todoRef);
    if (!todoDoc.exists()) return;

    const todoData = todoDoc.data() as Todo;
    
    await updateDoc(todoRef, {
      completed,
      updatedAt: serverTimestamp()
    });

    // If this todo is associated with a goal, update the goal's progress
    if (todoData.goalId) {
      const goalRef = doc(db, 'goals', todoData.goalId);
      const goalDoc = await getDoc(goalRef);
      
      if (goalDoc.exists()) {
        // Get all todos for this goal
        const todosSnapshot = await getDocs(
          query(collection(db, 'todos'), 
            where('goalId', '==', todoData.goalId)
          )
        );

        const goalTodos = todosSnapshot.docs.map(doc => ({
          ...doc.data(),
          id: doc.id
        })) as Todo[];

        const completedTodos = goalTodos.filter(todo => todo.completed);
        
        // Calculate progress based on completed todos
        const progress = Math.round((completedTodos.length / goalTodos.length) * 100);

        const wasNotCompleted = goalDoc.data().status !== 'completed';
        const isNowCompleted = progress === 100;

        await updateDoc(goalRef, {
          progress,
          updatedAt: serverTimestamp(),
          status: isNowCompleted ? 'completed' : 'in-progress'
        });

        // Show completion message if goal is newly completed
        if (wasNotCompleted && isNowCompleted) {
          addToast(`🎉 Goal "${goalDoc.data().title}" completed!`, 'success');
        }
      }
    }
  } catch (error) {
    console.error('Error toggling todo:', error);
    addToast('Failed to update todo', 'error');
  }
}; 