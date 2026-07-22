import React, { useState } from 'react';
import {
  Bot,
  Zap,
  Plus,
  Play,
  CheckCircle2,
  Trash2,
  Sparkles,
  ToggleLeft,
  ToggleRight,
  Shield,
  ArrowRight,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { AutomationRule } from '../../types';

export const AutomationsView: React.FC = () => {
  const {
    automations,
    addAutomationRule,
    toggleAutomationRule,
    deleteAutomationRule,
    boards,
    activeBoardId,
    logActivity,
  } = useApp();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [ruleName, setRuleName] = useState('');
  const [trigger, setTrigger] = useState<AutomationRule['trigger']>('card_completed');
  const [action, setAction] = useState<AutomationRule['action']>('move_to_done');

  const activeBoard = boards.find((b) => b.id === activeBoardId);
  const boardRules = automations.filter((a) => a.boardId === activeBoardId);

  const handleCreateRule = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ruleName.trim()) return;
    addAutomationRule(activeBoardId, ruleName, trigger, action);
    setRuleName('');
    setIsModalOpen(false);
    logActivity(`created automation rule "${ruleName}"`);
  };

  const triggerLabels: Record<AutomationRule['trigger'], string> = {
    card_completed: 'When a card is marked complete',
    due_today: 'When due date is today',
    label_added: 'When a label is added to card',
    list_moved: 'When card moves to new list',
  };

  const actionLabels: Record<AutomationRule['action'], string> = {
    move_to_done: 'Move card to "Done" list',
    assign_member: 'Assign default team member',
    send_notification: 'Send team escalation notification',
    add_label: 'Add "High Priority" label',
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-slate-950 p-6 space-y-6 overflow-y-auto text-slate-100">
      {/* Top Banner */}
      <div className="flex items-center justify-between p-5 bg-slate-900 border border-slate-800 rounded-2xl shadow-xl">
        <div className="flex items-center space-x-3">
          <div className="p-2 rounded-xl bg-purple-600/20 text-purple-400 border border-purple-500/30">
            <Bot className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">FlowStack Automation Engine</h2>
            <p className="text-xs text-slate-400">
              No-code rule builder for automated task routing, escalations, and status transitions for {activeBoard?.name}.
            </p>
          </div>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-lg shadow-indigo-500/20 flex items-center space-x-2 transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Create New Rule</span>
        </button>
      </div>

      {/* Rules List Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {boardRules.map((rule) => (
          <div
            key={rule.id}
            className={`p-4 rounded-2xl border transition-all space-y-3 ${
              rule.enabled
                ? 'bg-slate-900/90 border-slate-800 shadow-md'
                : 'bg-slate-900/40 border-slate-800/50 opacity-60'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Zap className={`w-4 h-4 ${rule.enabled ? 'text-amber-400 fill-amber-400' : 'text-slate-600'}`} />
                <h3 className="font-bold text-xs text-white">{rule.name}</h3>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => toggleAutomationRule(rule.id)}
                  className="text-slate-400 hover:text-indigo-400 transition-colors"
                >
                  {rule.enabled ? (
                    <ToggleRight className="w-6 h-6 text-indigo-400" />
                  ) : (
                    <ToggleLeft className="w-6 h-6 text-slate-600" />
                  )}
                </button>
                <button
                  onClick={() => deleteAutomationRule(rule.id)}
                  className="p-1 text-slate-500 hover:text-rose-400"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            <div className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800 text-xs flex items-center justify-between">
              <span className="text-slate-300 font-medium">{triggerLabels[rule.trigger]}</span>
              <ArrowRight className="w-3.5 h-3.5 text-indigo-400 flex-shrink-0 mx-2" />
              <span className="text-indigo-300 font-bold">{actionLabels[rule.action]}</span>
            </div>

            <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
              <span>Executed {rule.executionsCount} times</span>
              <span className="text-emerald-400 font-semibold flex items-center space-x-1">
                <CheckCircle2 className="w-3 h-3" />
                <span>Active</span>
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Rule Creator Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <form
            onSubmit={handleCreateRule}
            className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-4 text-slate-100"
          >
            <h3 className="text-base font-bold text-white flex items-center space-x-2">
              <Bot className="w-5 h-5 text-indigo-400" />
              <span>Create Automation Rule</span>
            </h3>

            <div>
              <label className="text-xs font-bold text-slate-400 block mb-1">Rule Name</label>
              <input
                type="text"
                required
                placeholder="e.g. Auto-Assign Lead on High Priority"
                value={ruleName}
                onChange={(e) => setRuleName(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-slate-950 border border-slate-800 rounded-lg focus:ring-2 focus:ring-indigo-500 text-white"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-400 block mb-1">WHEN (Trigger)</label>
              <select
                value={trigger}
                onChange={(e) => setTrigger(e.target.value as any)}
                className="w-full px-3 py-2 text-xs bg-slate-950 border border-slate-800 rounded-lg text-white"
              >
                <option value="card_completed">When card is completed</option>
                <option value="due_today">When due date is today</option>
                <option value="list_moved">When card moves to new list</option>
                <option value="label_added">When label is added</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-400 block mb-1">THEN (Action)</label>
              <select
                value={action}
                onChange={(e) => setAction(e.target.value as any)}
                className="w-full px-3 py-2 text-xs bg-slate-950 border border-slate-800 rounded-lg text-white"
              >
                <option value="move_to_done">Move to "Done" list</option>
                <option value="send_notification">Send team notification</option>
                <option value="assign_member">Assign default team member</option>
                <option value="add_label">Add "High Priority" label</option>
              </select>
            </div>

            <div className="flex items-center justify-end space-x-2 pt-2">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="px-3 py-1.5 text-xs font-semibold rounded-lg text-slate-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 text-xs font-bold rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white shadow-md"
              >
                Save Automation
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
