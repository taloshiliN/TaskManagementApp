import { useState, useEffect } from 'react';
import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  query,
  orderBy,
  onSnapshot,
  where,
  Timestamp
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuth } from '../contexts/AuthContext';

export interface Task {
  id: string;
  title: string;
  description: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  ownerId: string;
}

export const useTasks = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    if (!user) {
      setTasks([]);
      setLoading(false);
      return;
    }

    const q = query(
      collection(db, 'tasks'),
      where('ownerId', '==', user.uid),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(
      q,
      (querySnapshot) => {
        const tasksData: Task[] = [];
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          tasksData.push({
            id: doc.id,
            title: data.title || '',
            description: data.description || '',
            createdAt: data.createdAt || Timestamp.now(),
            updatedAt: data.updatedAt || Timestamp.now(),
            ownerId: data.ownerId || user.uid
          } as Task);
        });
        setTasks(tasksData);
        setLoading(false);
        setError(null);
      },
      (err) => {
        console.error('Error fetching tasks with ordering:', err);

        // If ordering fails, try without ordering as fallback
        const fallbackQuery = query(
          collection(db, 'tasks'),
          where('ownerId', '==', user.uid)
        );

        const fallbackUnsubscribe = onSnapshot(
          fallbackQuery,
          (fallbackSnapshot) => {
            const fallbackTasks: Task[] = [];
            fallbackSnapshot.forEach((doc) => {
              const data = doc.data();
              fallbackTasks.push({
                id: doc.id,
                title: data.title || '',
                description: data.description || '',
                createdAt: data.createdAt || Timestamp.now(),
                updatedAt: data.updatedAt || Timestamp.now(),
                ownerId: data.ownerId || user.uid
              } as Task);
            });
            // Sort manually by createdAt
            fallbackTasks.sort((a, b) => {
              const aTime = a.createdAt?.toMillis?.() || 0;
              const bTime = b.createdAt?.toMillis?.() || 0;
              return bTime - aTime;
            });
            setTasks(fallbackTasks);
            setLoading(false);
            setError('Loaded tasks without ordering - some tasks may be missing timestamps');
          },
          (fallbackErr) => {
            console.error('Error with fallback query:', fallbackErr);
            setError(fallbackErr.message);
            setLoading(false);
          }
        );

        return () => fallbackUnsubscribe();
      }
    );

    return () => unsubscribe();
  }, [user]);
  const addTask = async (title: string, description: string): Promise<boolean> => {
    if (!user) return false;

    try {
      setError(null);
      const now = Timestamp.now();
      await addDoc(collection(db, 'tasks'), {
        title,
        description,
        createdAt: now,
        updatedAt: now,
        ownerId: user.uid
      });
      return true;
    } catch (err: any) {
      console.error('Error adding task:', err);
      setError(err.message);
      return false;
    }
  };

  const updateTask = async (taskId: string, updates: Partial<Pick<Task, 'title' | 'description'>>): Promise<boolean> => {
    if (!user) return false;

    try {
      setError(null);
      const taskRef = doc(db, 'tasks', taskId);
      await updateDoc(taskRef, {
        ...updates,
        updatedAt: Timestamp.now()
      });
      return true;
    } catch (err: any) {
      console.error('Error updating task:', err);
      setError(err.message);
      return false;
    }
  };

  const deleteTask = async (taskId: string): Promise<boolean> => {
    if (!user) return false;

    try {
      setError(null);
      await deleteDoc(doc(db, 'tasks', taskId));
      return true;
    } catch (err: any) {
      console.error('Error deleting task:', err);
      setError(err.message);
      return false;
    }
  };

  return {
    tasks,
    loading,
    error,
    addTask,
    updateTask,
    deleteTask
  };
};
