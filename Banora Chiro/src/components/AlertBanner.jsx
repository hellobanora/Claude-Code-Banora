import { formatTime12h } from '../utils/time';

export default function AlertBanner({ task, onDismiss }) {
  if (!task) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-[100] animate-slide-down">
      <div className="mx-2 mt-2 p-4 bg-red-500 text-white rounded-xl shadow-2xl flex items-center gap-3">
        <span className="text-2xl">🔔</span>
        <div className="flex-1 min-w-0">
          <p className="font-bold text-sm">Task Due Now</p>
          <p className="text-sm opacity-90 truncate">{task.description}</p>
          {task.dueTime && (
            <p className="text-xs opacity-75 mt-0.5">{formatTime12h(task.dueTime)}</p>
          )}
        </div>
        <button
          onClick={onDismiss}
          className="text-white text-2xl font-bold min-w-[44px] min-h-[44px] flex items-center justify-center"
          aria-label="Dismiss alert"
        >
          ×
        </button>
      </div>
    </div>
  );
}
