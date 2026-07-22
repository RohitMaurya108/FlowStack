import React from 'react';
import { X, Key } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const ShortcutsModal: React.FC = () => {
  const { isShortcutsModalOpen, setIsShortcutsModalOpen } = useApp();

  if (!isShortcutsModalOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm">
      <div className="w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-2xl space-y-4 text-slate-800 dark:text-slate-100 transition-colors">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center space-x-2">
            <Key className="w-5 h-5 text-amber-500 dark:text-amber-400" />
            <span>Keyboard Shortcuts Sheet</span>
          </h3>
          <button onClick={() => setIsShortcutsModalOpen(false)}>
            <X className="w-4 h-4 text-slate-400 dark:text-slate-400 hover:text-slate-700 dark:hover:text-white" />
          </button>
        </div>

        <div className="space-y-2 text-xs">
          <div className="flex items-center justify-between p-2 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
            <span className="text-slate-700 dark:text-slate-300">Command Palette</span>
            <kbd className="px-2 py-0.5 rounded bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-mono text-[11px]">Cmd + K</kbd>
          </div>
          <div className="flex items-center justify-between p-2 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
            <span className="text-slate-700 dark:text-slate-300">Switch Views (Board, Gantt, Calendar)</span>
            <kbd className="px-2 py-0.5 rounded bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-mono text-[11px]">B / G / C</kbd>
          </div>
          <div className="flex items-center justify-between p-2 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
            <span className="text-slate-700 dark:text-slate-300">New Card Quick Add</span>
            <kbd className="px-2 py-0.5 rounded bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-mono text-[11px]">N</kbd>
          </div>
          <div className="flex items-center justify-between p-2 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
            <span className="text-slate-700 dark:text-slate-300">Show Shortcuts Help</span>
            <kbd className="px-2 py-0.5 rounded bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-mono text-[11px]">?</kbd>
          </div>
        </div>
      </div>
    </div>
  );
};
