import TaskCard from './TaskCard';
import { isOverdue } from '../utils/time';

function sortByTime(tasks) {
  return [...tasks].sort((a, b) => {
    if (!a.dueTime && !b.dueTime) return 0;
    if (!a.dueTime) return 1;
    if (!b.dueTime) return -1;
    return a.dueTime.localeCompare(b.dueTime);
  });
}

export default function TaskList({ tasks, onToggle, onUpdate, onDelete }) {
  const activeTasks = tasks.filter(t => !t.completed);

  const carried = sortByTime(activeTasks.filter(t => t.carriedForward));
  const overdue = sortByTime(activeTasks.filter(t => !t.carriedForward && isOverdue(t.dueTime)));
  const upcoming = sortByTime(activeTasks.filter(t => !t.carriedForward && !isOverdue(t.dueTime)));

  const sections = [
    { title: '⏩ Carried Forward', tasks: carried, empty: null },
    { title: '🔴 Overdue', tasks: overdue, empty: null },
    { title: '📋 Upcoming', tasks: upcoming, empty: null },
  ].filter(s => s.tasks.length > 0);

  if (sections.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-gray-400">
        <span className="text-4xl mb-3">✨</span>
        <p className="text-lg font-medium">All clear!</p>
        <p className="text-sm">Add a task above to get started.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {sections.map(section => (
        <div key={section.title}>
          <h2 className="text-xs font-bold uppercase tracking-wider text-gray-400 px-1 mb-2">
            {section.title}
          </h2>
          <div className="space-y-2">
            {section.tasks.map(task => (
              <TaskCard
                key={task.id}
                task={task}
                onToggle={onToggle}
                onUpdate={onUpdate}
                onDelete={onDelete}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
