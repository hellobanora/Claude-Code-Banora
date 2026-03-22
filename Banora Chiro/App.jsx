import { useState } from 'react';
import Header from './components/Header';
import TaskInput from './components/TaskInput';
import StatsBar from './components/StatsBar';
import TaskList from './components/TaskList';
import TaskCard from './components/TaskCard';
import AlertBanner from './components/AlertBanner';
import TabBar from './components/TabBar';
import { useTaskStorage } from './hooks/useTaskStorage';
import { useTaskParser } from './hooks/useTaskParser';
import { useAlerts } from './hooks/useAlerts';

export default function App() {
  const { tasks, addTask, toggleComplete, updateTask, deleteTask } = useTaskStorage();
  const { parseTask, loading } = useTaskParser();
  const [alertsEnabled, setAlertsEnabled] = useState(true);
  const [activeTab, setActiveTab] = useState('active');
  const { alertTask, dismissAlert } = useAlerts(tasks, alertsEnabled);

  async function handleAddTask(text) {
    const parsed = await parseTask(text);
    addTask(parsed);
  }

  const completedTasks = tasks.filter(t => t.completed);

  return (
    <div className="min-h-screen flex flex-col bg-off-white max-w-lg mx-auto shadow-xl">
      <Header
        alertsEnabled={alertsEnabled}
        onToggleAlerts={() => setAlertsEnabled(prev => !prev)}
      />
      <TaskInput onSubmit={handleAddTask} loading={loading} />
      <StatsBar tasks={tasks} />

      <main className="flex-1 overflow-y-auto px-4 py-3 pb-20">
        {activeTab === 'active' ? (
          <TaskList
            tasks={tasks}
            onToggle={toggleComplete}
            onUpdate={updateTask}
            onDelete={deleteTask}
          />
        ) : (
          <div className="space-y-2">
            {completedTasks.length === 0 ? (
              <div className="text-center py-16 text-gray-400">
                <span className="text-4xl mb-3 block">📭</span>
                <p className="text-sm">No completed tasks yet.</p>
              </div>
            ) : (
              completedTasks.map(task => (
                <TaskCard
                  key={task.id}
                  task={task}
                  onToggle={toggleComplete}
                  onUpdate={updateTask}
                  onDelete={deleteTask}
                />
              ))
            )}
          </div>
        )}
      </main>

      <TabBar
        activeTab={activeTab}
        onChangeTab={setActiveTab}
        completedCount={completedTasks.length}
      />

      <AlertBanner task={alertTask} onDismiss={dismissAlert} />
    </div>
  );
}
