import React, { useState } from 'react';
import { X, Kanban } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const CreateBoardModal: React.FC = () => {
  const { isCreateBoardOpen, setIsCreateBoardOpen, createBoard, activeWorkspaceId } = useApp();
  const [name, setName] = useState('');
  const [type, setType] = useState<'sprint' | 'roadmap' | 'team' | 'personal'>('sprint');
  const [emoji, setEmoji] = useState('⚡');

  if (!isCreateBoardOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    createBoard(activeWorkspaceId, name.trim(), type, emoji);
    setName('');
    setIsCreateBoardOpen(false);
  };

  const emojiOptions = ['⚡', '🚀', '🎯', '🔥', '📊', '🛠️', '💡', '🎨'];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-2xl p-6 shadow-2xl space-y-4 text-slate-800 dark:text-zinc-100 transition-colors"
      >
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center space-x-2">
            <Kanban className="w-5 h-5 text-violet-600 dark:text-violet-400" />
            <span>Create New Board</span>
          </h3>
          <button type="button" onClick={() => setIsCreateBoardOpen(false)}>
            <X className="w-4 h-4 text-slate-400 dark:text-zinc-400 hover:text-slate-700 dark:hover:text-white" />
          </button>
        </div>

        <div>
          <label className="text-xs font-bold text-slate-500 dark:text-zinc-400 block mb-1">Board Emoji Icon</label>
          <div className="flex items-center space-x-2">
            {emojiOptions.map((em) => (
              <button
                key={em}
                type="button"
                onClick={() => setEmoji(em)}
                className={`p-2 rounded-xl text-lg border transition-all ${
                  emoji === em ? 'bg-violet-600 text-white border-violet-400 ring-2 ring-violet-400/40' : 'bg-slate-100 dark:bg-zinc-950 border-slate-200 dark:border-zinc-800'
                }`}
              >
                {em}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="text-xs font-bold text-slate-500 dark:text-zinc-400 block mb-1">Board Name</label>
          <input
            type="text"
            required
            placeholder="e.g. Q3 Roadmap & Sprints"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-violet-500/50"
          />
        </div>

        <div>
          <label className="text-xs font-bold text-slate-500 dark:text-zinc-400 block mb-1">Board Type</label>
          <select
            value={type}
            onChange={(e) => setType(e.target.value as any)}
            className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-lg text-slate-900 dark:text-white focus:outline-none"
          >
            <option value="sprint">Agile Sprint Board</option>
            <option value="roadmap">Product Roadmap</option>
            <option value="team">Team Backlog</option>
            <option value="personal">Personal Tasks</option>
          </select>
        </div>

        <button
          type="submit"
          className="w-full py-2 text-xs font-bold rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white shadow-md transition-colors"
        >
          Create Board
        </button>
      </form>
    </div>
  );
};
