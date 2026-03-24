import { useState } from 'react';
import { getCurrentTime, getToday } from '../utils/time';

export function useTaskParser() {
  const [loading, setLoading] = useState(false);

  async function parseTask(text) {
    setLoading(true);
    try {
      const res = await fetch('/.netlify/functions/parse-task', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text,
          currentTime: getCurrentTime(),
          currentDate: getToday(),
        }),
      });

      if (!res.ok) throw new Error('API error');

      const data = await res.json();
      return {
        description: data.description || text,
        dueTime: data.dueTime || null,
        priority: data.priority || 'medium',
        category: data.category || 'General',
      };
    } catch {
      // Fallback: add as plain task
      return {
        description: text,
        dueTime: null,
        priority: 'medium',
        category: 'General',
      };
    } finally {
      setLoading(false);
    }
  }

  return { parseTask, loading };
}
