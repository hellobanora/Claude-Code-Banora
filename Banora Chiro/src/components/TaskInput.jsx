import { useState } from 'react';

export default function TaskInput({ onSubmit, loading }) {
  const [text, setText] = useState('');

  function handleSubmit(e) {
    e.preventDefault();
    const trimmed = text.trim();
    if (!trimmed || loading) return;
    onSubmit(trimmed);
    setText('');
  }

  return (
    <form onSubmit={handleSubmit} className="px-4 py-3 bg-white shadow-sm border-b border-gray-100">
      <div className="flex gap-2">
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder='e.g. "Call supplier about headrest paper at 2pm"'
          className="flex-1 px-4 py-3 rounded-xl border border-gray-200 bg-off-white text-base placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-light-blue focus:border-transparent min-h-[44px]"
          disabled={loading}
          autoComplete="off"
        />
        <button
          type="submit"
          disabled={!text.trim() || loading}
          className="px-5 py-3 bg-navy text-white font-semibold rounded-xl hover:bg-mid-blue active:scale-95 transition-all disabled:opacity-40 disabled:cursor-not-allowed min-h-[44px] min-w-[44px]"
        >
          {loading ? (
            <span className="inline-block w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            'Add'
          )}
        </button>
      </div>
    </form>
  );
}
