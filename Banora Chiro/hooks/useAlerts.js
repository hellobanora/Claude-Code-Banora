import { useState, useEffect, useRef, useCallback } from 'react';
import { getCurrentTime } from '../utils/time';
import { playAlertBeep } from '../utils/audio';
import { ALERT_CHECK_INTERVAL } from '../utils/constants';

export function useAlerts(tasks, alertsEnabled) {
  const [alertTask, setAlertTask] = useState(null);
  const notifiedIds = useRef(new Set());
  const dismissTimer = useRef(null);

  const dismissAlert = useCallback(() => {
    setAlertTask(null);
    if (dismissTimer.current) clearTimeout(dismissTimer.current);
  }, []);

  useEffect(() => {
    if (!alertsEnabled) return;

    function checkAlerts() {
      const now = getCurrentTime();
      const activeTasks = tasks.filter(t => !t.completed && t.dueTime);

      for (const task of activeTasks) {
        if (task.dueTime === now && !notifiedIds.current.has(task.id)) {
          notifiedIds.current.add(task.id);

          // Browser notification
          if (Notification.permission === 'granted') {
            new Notification('Banora Shift Tasks', {
              body: task.description,
              icon: '/logo.png',
              tag: task.id,
            });
          }

          // In-app alert
          setAlertTask(task);
          playAlertBeep();

          // Auto-dismiss after 30 seconds
          if (dismissTimer.current) clearTimeout(dismissTimer.current);
          dismissTimer.current = setTimeout(() => setAlertTask(null), 30000);

          break; // One alert at a time
        }
      }
    }

    checkAlerts();
    const interval = setInterval(checkAlerts, ALERT_CHECK_INTERVAL);
    return () => {
      clearInterval(interval);
      if (dismissTimer.current) clearTimeout(dismissTimer.current);
    };
  }, [tasks, alertsEnabled]);

  return { alertTask, dismissAlert };
}
