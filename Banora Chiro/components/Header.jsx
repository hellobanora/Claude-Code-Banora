import { formatDate, getToday } from '../utils/time';

export default function Header({ alertsEnabled, onToggleAlerts }) {
  const today = getToday();
  const dateDisplay = formatDate(today);

  return (
    <header className="bg-navy text-white px-4 py-3 flex items-center justify-between sticky top-0 z-50 shadow-lg">
      <div className="flex items-center gap-3">
        <img src="/logo.png" alt="Banora Chiropractic" className="h-9 w-9 rounded-md object-contain bg-white p-0.5" />
        <div>
          <h1 className="text-lg font-bold leading-tight">Shift Tasks</h1>
          <p className="text-xs text-blue-200 leading-tight">{dateDisplay}</p>
        </div>
      </div>
      <button
        onClick={onToggleAlerts}
        className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors min-h-[44px]"
        style={{
          backgroundColor: alertsEnabled ? 'rgba(255,255,255,0.15)' : 'rgba(220,38,38,0.3)',
        }}
        aria-label={alertsEnabled ? 'Mute alerts' : 'Enable alerts'}
      >
        <span className="text-lg">{alertsEnabled ? '🔔' : '🔕'}</span>
        <span className="hidden sm:inline">{alertsEnabled ? 'Alerts On' : 'Muted'}</span>
      </button>
    </header>
  );
}
