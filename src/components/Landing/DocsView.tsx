import React from 'react';
import { BookOpen, Command, Terminal, Sparkles, Key, Check } from 'lucide-react';

export const DocsView: React.FC = () => {
  return (
    <div className="flex-1 overflow-y-auto bg-slate-950 p-8 text-slate-100 max-w-4xl mx-auto space-y-8">
      <div className="space-y-2 border-b border-slate-800 pb-6">
        <h1 className="text-3xl font-black text-white flex items-center space-x-3">
          <BookOpen className="w-7 h-7 text-purple-400" />
          <span>FlowStack Documentation & User Guide</span>
        </h1>
        <p className="text-xs text-slate-400">
          Everything you need to master FlowStack keyboard shortcuts, AI features, and REST API routes.
        </p>
      </div>

      {/* Keyboard Shortcuts Section */}
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
        <h2 className="text-sm font-bold text-white flex items-center space-x-2">
          <Key className="w-4 h-4 text-amber-400" />
          <span>Productivity Keyboard Shortcuts</span>
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950 border border-slate-800">
            <span className="text-slate-300">Open Command Palette</span>
            <kbd className="px-2 py-1 rounded bg-slate-800 text-slate-300 font-mono text-[11px] border border-slate-700">
              Cmd + K / Ctrl + K
            </kbd>
          </div>
          <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950 border border-slate-800">
            <span className="text-slate-300">Keyboard Shortcuts Sheet</span>
            <kbd className="px-2 py-1 rounded bg-slate-800 text-slate-300 font-mono text-[11px] border border-slate-700">
              ?
            </kbd>
          </div>
          <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950 border border-slate-800">
            <span className="text-slate-300">Create New Card</span>
            <kbd className="px-2 py-1 rounded bg-slate-800 text-slate-300 font-mono text-[11px] border border-slate-700">
              C
            </kbd>
          </div>
          <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950 border border-slate-800">
            <span className="text-slate-300">Switch to Board View</span>
            <kbd className="px-2 py-1 rounded bg-slate-800 text-slate-300 font-mono text-[11px] border border-slate-700">
              B
            </kbd>
          </div>
        </div>
      </div>

      {/* REST API Reference */}
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
        <h2 className="text-sm font-bold text-white flex items-center space-x-2">
          <Terminal className="w-4 h-4 text-emerald-400" />
          <span>Server AI API Endpoints Reference</span>
        </h2>
        <div className="space-y-2 text-xs font-mono">
          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
            <div className="flex items-center space-x-2">
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                POST
              </span>
              <span className="text-indigo-300 font-bold">/api/ai/generate-subtasks</span>
            </div>
            <p className="text-[11px] text-slate-400 font-sans">
              Accepts cardTitle & cardDescription, calls Gemini 3.6 Flash server-side, returns structured subtasks array.
            </p>
          </div>

          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
            <div className="flex items-center space-x-2">
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                POST
              </span>
              <span className="text-indigo-300 font-bold">/api/ai/risk-prediction</span>
            </div>
            <p className="text-[11px] text-slate-400 font-sans">
              Analyzes list of cards, calculates overall risk score, identifies bottlenecks, and returns 3 recommendations.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
