export default function TabBar({ activeTab, onChangeTab, completedCount }) {
  return (
    <div className="flex bg-white border-t border-gray-200 sticky bottom-0 z-40">
      <button
        onClick={() => onChangeTab('active')}
        className={`flex-1 py-3 text-sm font-semibold text-center transition-colors min-h-[52px] ${
          activeTab === 'active'
            ? 'text-navy border-t-2 border-navy bg-blue-50'
            : 'text-gray-400'
        }`}
      >
        📋 Active
      </button>
      <button
        onClick={() => onChangeTab('completed')}
        className={`flex-1 py-3 text-sm font-semibold text-center transition-colors min-h-[52px] ${
          activeTab === 'completed'
            ? 'text-navy border-t-2 border-navy bg-blue-50'
            : 'text-gray-400'
        }`}
      >
        ✅ Completed {completedCount > 0 && `(${completedCount})`}
      </button>
    </div>
  );
}
