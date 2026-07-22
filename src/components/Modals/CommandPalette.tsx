import React, { useState } from 'react';
import { Search, Command, Kanban, Plus, Settings, Sparkles, X, ArrowRight } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const CommandPalette: React.FC = () => {
  const {
    isCommandPaletteOpen,
    setIsCommandPaletteOpen,
    boards,
    setActiveBoardId,
    setMainTab,
    setViewMode,
    cards,
    setActiveCardId,
  } = useApp();

  const [query, setQuery] = useState('');

  if (!isCommandPaletteOpen) return null;

  const matchedBoards = boards.filter((b) => b.name.toLowerCase().includes(query.toLowerCase()));
  const matchedCards = cards.filter((c) => c.title.toLowerCase().includes(query.toLowerCase())).slice(0, 5);

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 p-4 bg-slate-950/70 backdrop-blur-sm">
      <div className="w-full max-w-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl overflow-hidden text-slate-800 dark:text-slate-100 space-y-2 p-3 transition-colors">
        {/* Search Input Bar */}
        <div className="flex items-center space-x-2 px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl">
          <Search className="w-4 h-4 text-indigo-600 dark:text-indigo-400 flex-shrink-0" />
          <input
            type="text"
            autoFocus
            placeholder="Type a command or search cards & boards..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full bg-transparent text-xs text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none"
          />
          <button onClick={() => setIsCommandPaletteOpen(false)}>
            <X className="w-4 h-4 text-slate-400 dark:text-slate-500 hover:text-slate-700 dark:hover:text-white" />
          </button>
        </div>

        {/* Results List */}
        <div className="max-h-72 overflow-y-auto space-y-1 p-1 text-xs">
          <div className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
            Quick Actions
          </div>
          <button
            onClick={() => {
              setMainTab('app');
              setViewMode('analytics');
              setIsCommandPaletteOpen(false);
            }}
            className="w-full flex items-center justify-between p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 transition-colors"
          >
            <div className="flex items-center space-x-2">
              <Sparkles className="w-3.5 h-3.5 text-amber-500 dark:text-amber-400" />
              <span>Go to Sprint Analytics & AI Risk Audit</span>
            </div>
            <ArrowRight className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500" />
          </button>

          {/* Matched Boards */}
          {matchedBoards.length > 0 && (
            <>
              <div className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 pt-2">
                Boards
              </div>
              {matchedBoards.map((b) => (
                <button
                  key={b.id}
                  onClick={() => {
                    setMainTab('app');
                    setActiveBoardId(b.id);
                    setViewMode('board');
                    setIsCommandPaletteOpen(false);
                  }}
                  className="w-full flex items-center space-x-2 p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 transition-colors"
                >
                  <span>{b.emoji}</span>
                  <span className="font-semibold">{b.name}</span>
                </button>
              ))}
            </>
          )}

          {/* Matched Cards */}
          {matchedCards.length > 0 && (
            <>
              <div className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 pt-2">
                Cards
              </div>
              {matchedCards.map((c) => (
                <button
                  key={c.id}
                  onClick={() => {
                    setMainTab('app');
                    setActiveCardId(c.id);
                    setIsCommandPaletteOpen(false);
                  }}
                  className="w-full flex items-center justify-between p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 transition-colors"
                >
                  <span className="font-medium text-indigo-600 dark:text-indigo-300 truncate">{c.title}</span>
                  <span className="text-[10px] uppercase font-bold text-slate-400 dark:text-slate-500">{c.priority}</span>
                </button>
              ))}
            </>
          )}
        </div>
      </div>
    </div>
  );
};
