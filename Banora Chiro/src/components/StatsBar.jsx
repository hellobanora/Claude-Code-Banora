import { isOverdue } from '../utils/time';

export default function StatsBar({ tasks }) {
  const active = tasks.filter(t => !t.completed);
  const overdueCount = active.filter(t => isOverdue(t.dueTime)).length;
  const doneCount = tasks.filter(t => t.completed).length;

  return (
    <div className="flex gap-2 px-4 py-2 bg-gradient-to-r from-sky-50 to-blue-50">
      <div className="flex-1 text-center py-1.5 rounded-lg bg-white shadow-sm">
        <span className="text-lg font-bold text-navy">{active.length}</span>
        <span className="text-xs text-gray-500 ml-1">Active</span>
      </div>
      <div className="flex-1 text-center py-1.5 rounded-lg bg-white shadow-sm">
        <span className={`text-lg font-bold ${overdueCount > 0 ? 'text-red-500' : 'text-gray-400'}`}>
          {overdueCount}
        </span>
        <span className="text-xs text-gray-500 ml-1">Overdue</span>
      </div>
      <div className="flex-1 text-center py-1.5 rounded-lg bg-white shadow-sm">
        <span className="text-lg font-bold text-green-600">{doneCount}</span>
        <span className="text-xs text-gray-500 ml-1">Done</span>
      </div>
    </div>
  );
}
