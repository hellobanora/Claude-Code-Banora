import { useState, useEffect, useCallback } from 'react';
import { STORAGE_PREFIX, ROLLOVER_DAYS } from '../utils/constants';
import { getToday, getPreviousDates, daysBetween } from '../utils/time';

function getStorageKey(date) {
  return `${STORAGE_PREFIX}:${date}`;
}

function loadTasks(date) {
  try {
    const raw = localStorage.getItem(getStorageKey(date));
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveTasks(date, tasks) {
  localStorage.setItem(getStorageKey(date), JSON.stringify(tasks));
}

function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
}

export function useTaskStorage() {
  const [tasks, setTasks] = useState([]);
  const today = getToday();

  // Load tasks and perform rollover on mount
  useEffect(() => {
    const todayTasks = loadTasks(today);
    const carriedIds = new Set(todayTasks.filter(t => t.carriedForward).map(t => t.id));
    const previousDates = getPreviousDates(ROLLOVER_DAYS);
    const newCarried = [];

    for (const date of previousDates) {
      const oldTasks = loadTasks(date);
      for (const task of oldTasks) {
        if (!task.completed && !carriedIds.has(task.id)) {
          newCarried.push({
            ...task,
            carriedForward: true,
            originalDate: task.originalDate || task.sourceDate,
            sourceDate: today,
          });
          carriedIds.add(task.id);
        }
      }
    }

    const merged = [...todayTasks, ...newCarried];
    saveTasks(today, merged);
    setTasks(merged);
  }, [today]);

  const updateTasks = useCallback((updater) => {
    setTasks(prev => {
      const next = typeof updater === 'function' ? updater(prev) : updater;
      saveTasks(today, next);
      return next;
    });
  }, [today]);

  const addTask = useCallback((taskData) => {
    const task = {
      id: generateId(),
      description: taskData.description || taskData.text || '',
      dueTime: taskData.dueTime || null,
      priority: taskData.priority || 'medium',
      category: taskData.category || 'General',
      completed: false,
      createdAt: new Date().toISOString(),
      completedAt: null,
      sourceDate: today,
      carriedForward: false,
    };
    updateTasks(prev => [...prev, task]);
    return task;
  }, [today, updateTasks]);

  const toggleComplete = useCallback((id) => {
    updateTasks(prev => prev.map(t =>
      t.id === id
        ? { ...t, completed: !t.completed, completedAt: !t.completed ? new Date().toISOString() : null }
        : t
    ));
  }, [updateTasks]);

  const updateTask = useCallback((id, updates) => {
    updateTasks(prev => prev.map(t =>
      t.id === id ? { ...t, ...updates } : t
    ));
  }, [updateTasks]);

  const deleteTask = useCallback((id) => {
    updateTasks(prev => prev.filter(t => t.id !== id));
  }, [updateTasks]);

  return { tasks, addTask, toggleComplete, updateTask, deleteTask };
}
