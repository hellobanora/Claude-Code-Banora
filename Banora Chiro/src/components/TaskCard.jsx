import { useState } from 'react';
import { PRIORITIES, PRIORITY_COLORS, CATEGORIES } from '../utils/constants';
import { formatTime12h, isOverdue, daysBetween, getToday } from '../utils/time';

export default function TaskCard({ task, onToggle, onUpdate, onDelete }) {
  const [editing, setEditing] = useState(null); // 'priority' | 'category' | 'time' | null

  const overdue = !task.completed && isOverdue(task.dueTime);
  const carriedDays = task.carriedForward && task.originalDate
    ? daysBetween(task.originalDate, getToday())
    : 0;
  const stalePending = carriedDays >= 7;

  const borderColor = task.completed
    ? 'border-gray-200'
    : task.carriedForward
      ? 'border-amber-400'
      : overdue
        ? 'border-red-500'
        : 'border-gray-200';

  const pulseClass = overdue && !task.completed ? 'animate-pulse' : '';

  return (
    <div className={`bg-white rounded-xl border-l-4 ${borderColor} shadow-sm p-3 ${pulseClass} ${task.completed ? 'opacity-50' : ''}`}>
      <div className="flex items-start gap-3">
        {/* Checkbox */}
        <button
          onClick={() => onToggle(task.id)}
          className="mt-0.5 w-6 h-6 rounded-md border-2 flex items-center justify-center shrink-0 min-w-[44px] min-h-[44px] -m-2 p-2"
          style={{ borderColor: task.completed ? '#16A34A' : '#CBD5E1' }}
          aria-label={task.completed ? 'Mark incomplete' : 'Mark complete'}
        >
          {task.completed && (
            <svg className="w-4 h-4 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          )}
        </button>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <p className={`text-base font-medium ${task.completed ? 'line-through text-gray-400' : 'text-gray-800'}`}>
            {task.description}
          </p>

          <div className="flex flex-wrap items-center gap-1.5 mt-1.5">
            {/* Priority badge */}
            <button
              onClick={() => setEditing(editing === 'priority' ? null : 'priority')}
              className="px-2 py-0.5 rounded-full text-xs font-semibold min-h-[28px]"
              style={{
                backgroundColor: PRIORITY_COLORS[task.priority].bg,
                color: PRIORITY_COLORS[task.priority].text,
              }}
            >
              {task.priority}
            </button>

            {/* Category badge */}
            <button
              onClick={() => setEditing(editing === 'category' ? null : 'category')}
              className="px-2 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-mid-blue min-h-[28px]"
            >
              {task.category}
            </button>

            {/* Due time */}
            <button
              onClick={() => setEditing(editing === 'time' ? null : 'time')}
              className={`px-2 py-0.5 rounded-full text-xs font-medium min-h-[28px] ${
                overdue ? 'bg-red-100 text-red-600 font-bold' : 'bg-gray-100 text-gray-500'
              }`}
            >
              {task.dueTime ? formatTime12h(task.dueTime) : 'No time'}
            </button>
          </div>

          {/* Stale carried task warning */}
          {stalePending && !task.completed && (
            <div className="mt-2 flex items-center gap-2 bg-amber-50 rounded-lg px-2 py-1.5 text-xs text-amber-700">
              <span>Pending {carriedDays} days — still needed?</span>
              <button
                onClick={() => onDelete(task.id)}
                className="text-red-500 font-semibold underline min-h-[28px]"
              >
                Remove
              </button>
            </div>
          )}
        </div>

        {/* Delete button */}
        <button
          onClick={() => onDelete(task.id)}
          className="text-gray-300 hover:text-red-500 transition-colors text-xl font-bold min-w-[44px] min-h-[44px] flex items-center justify-center -m-2 p-2"
          aria-label="Delete task"
        >
          ×
        </button>
      </div>

      {/* Inline editors */}
      {editing === 'priority' && (
        <div className="flex gap-2 mt-2 pt-2 border-t border-gray-100">
          {PRIORITIES.map(p => (
            <button
              key={p}
              onClick={() => { onUpdate(task.id, { priority: p }); setEditing(null); }}
              className="flex-1 py-2 rounded-lg text-xs font-bold capitalize min-h-[44px]"
              style={{
                backgroundColor: task.priority === p ? PRIORITY_COLORS[p].text : PRIORITY_COLORS[p].bg,
                color: task.priority === p ? '#fff' : PRIORITY_COLORS[p].text,
              }}
            >
              {p}
            </button>
          ))}
        </div>
      )}

      {editing === 'category' && (
        <div className="flex flex-wrap gap-2 mt-2 pt-2 border-t border-gray-100">
          {CATEGORIES.map(c => (
            <button
              key={c}
              onClick={() => { onUpdate(task.id, { category: c }); setEditing(null); }}
              className={`px-3 py-2 rounded-lg text-xs font-medium min-h-[44px] ${
                task.category === c ? 'bg-navy text-white' : 'bg-gray-100 text-gray-600'
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      )}

      {editing === 'time' && (
        <div className="flex items-center gap-2 mt-2 pt-2 border-t border-gray-100">
          <input
            type="time"
            defaultValue={task.dueTime || ''}
            onChange={(e) => { onUpdate(task.id, { dueTime: e.target.value || null }); setEditing(null); }}
            className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm min-h-[44px]"
          />
          <button
            onClick={() => { onUpdate(task.id, { dueTime: null }); setEditing(null); }}
            className="px-3 py-2 bg-gray-100 text-gray-500 rounded-lg text-xs font-medium min-h-[44px]"
          >
            Clear
          </button>
        </div>
      )}
    </div>
  );
}
