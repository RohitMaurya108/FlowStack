import React, { useState } from 'react';
import {
  X,
  Sparkles,
  Bot,
  Calendar,
  Clock,
  User as UserIcon,
  CheckSquare,
  MessageSquare,
  Paperclip,
  Plus,
  Flame,
  AlertCircle,
  Tag,
  Trash2,
  FileText,
  Send,
  Loader2,
  UploadCloud,
  Eye,
  Check,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Priority, Card, Attachment } from '../../types';

interface CardModalProps {
  cardId: string;
  onClose: () => void;
}

export const CardModal: React.FC<CardModalProps> = ({ cardId, onClose }) => {
  const {
    cards,
    updateCard,
    deleteCard,
    labels,
    allUsers,
    addComment,
    addChecklistItem,
    toggleChecklistItem,
    addSubtask,
    toggleSubtask,
    toggleCardLabel,
    toggleCardAssignee,
    boards,
    activeBoardId,
    logActivity,
  } = useApp();

  const card = cards.find((c) => c.id === cardId);
  const activeBoard = boards.find((b) => b.id === activeBoardId);

  const [title, setTitle] = useState(card?.title || '');
  const [description, setDescription] = useState(card?.description || '');
  const [newSubtaskTitle, setNewSubtaskTitle] = useState('');
  const [newChecklistText, setNewChecklistText] = useState('');
  const [newCommentText, setNewCommentText] = useState('');
  const [timeSpent, setTimeSpent] = useState(card?.timeSpentHours || 0);
  const [timeEstimate, setTimeEstimate] = useState(card?.timeEstimateHours || 4);

  // AI Loading States
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [aiStatusMessage, setAiStatusMessage] = useState('');

  if (!card) return null;

  const cardLabels = labels.filter((l) => card.labelIds.includes(l.id));

  // Save description
  const handleSaveDescription = () => {
    updateCard(card.id, { description });
    logActivity('updated card description', card.id, card.title);
  };

  // Save title
  const handleSaveTitle = () => {
    if (title.trim()) {
      updateCard(card.id, { title: title.trim() });
    }
  };

  // AI Feature: Auto Generate Description
  const handleAiGenerateDescription = async () => {
    setIsAiLoading(true);
    setAiStatusMessage('Connecting to Gemini 3.6 Flash server...');
    try {
      const res = await fetch('/api/ai/generate-description', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: card.title,
          context: card.description || 'Software feature card',
          boardName: activeBoard?.name,
        }),
      });
      const data = await res.json();
      if (data.description) {
        setDescription(data.description);
        updateCard(card.id, { description: data.description });
        setAiStatusMessage('Generated description with Gemini!');
      } else if (data.error) {
        setAiStatusMessage(`Error: ${data.error}`);
      }
    } catch (e: any) {
      setAiStatusMessage('Failed to contact AI service.');
    } finally {
      setIsAiLoading(false);
    }
  };

  // AI Feature: Auto Generate Subtasks
  const handleAiGenerateSubtasks = async () => {
    setIsAiLoading(true);
    setAiStatusMessage('Generating subtasks via Gemini...');
    try {
      const res = await fetch('/api/ai/generate-subtasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cardTitle: card.title,
          cardDescription: card.description,
        }),
      });
      const data = await res.json();
      if (Array.isArray(data.subtasks)) {
        data.subtasks.forEach((st: { title: string; estimatedHours?: number }) => {
          addSubtask(card.id, st.title, st.estimatedHours || 2);
        });
        setAiStatusMessage(`Added ${data.subtasks.length} AI subtasks!`);
      } else if (data.error) {
        setAiStatusMessage(`Error: ${data.error}`);
      }
    } catch (e: any) {
      setAiStatusMessage('Failed to generate AI subtasks.');
    } finally {
      setIsAiLoading(false);
    }
  };

  // AI Feature: Suggest Priority
  const handleAiSuggestPriority = async () => {
    setIsAiLoading(true);
    setAiStatusMessage('Evaluating risk & priority with Gemini...');
    try {
      const res = await fetch('/api/ai/suggest-priority', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cardTitle: card.title,
          cardDescription: card.description,
          dueDate: card.dueDate,
        }),
      });
      const data = await res.json();
      if (data.priority) {
        updateCard(card.id, { priority: data.priority as Priority });
        setAiStatusMessage(`AI Suggestion: ${data.priority.toUpperCase()} - ${data.reason}`);
      }
    } catch (e) {
      setAiStatusMessage('Failed to get priority suggestion.');
    } finally {
      setIsAiLoading(false);
    }
  };

  // Attachment Upload Simulator
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    const newAtt: Attachment = {
      id: `att_${Date.now()}`,
      name: file.name,
      url: URL.createObjectURL(file),
      type: file.type.includes('image') ? 'image' : 'pdf',
      size: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
      uploadedAt: new Date().toISOString().split('T')[0],
    };
    updateCard(card.id, { attachments: [...card.attachments, newAtt] });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl overflow-hidden my-8 text-slate-800 dark:text-slate-100 flex flex-col md:flex-row transition-colors">
        
        {/* Left Side: Main Content (Title, AI Sidekick, Description, Subtasks, Comments) */}
        <div className="flex-1 p-6 space-y-6 overflow-y-auto max-h-[85vh]">
          {/* Header Title Bar */}
          <div className="flex items-start justify-between">
            <div className="flex-1 mr-4">
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                onBlur={handleSaveTitle}
                className="w-full text-lg font-bold bg-transparent border-b border-transparent hover:border-slate-300 dark:hover:border-slate-700 focus:border-indigo-500 text-slate-900 dark:text-white focus:outline-none transition-colors"
              />
              <span className="text-xs text-slate-500 dark:text-slate-400 block mt-1">
                In board: <strong className="text-slate-800 dark:text-slate-200">{activeBoard?.name}</strong>
              </span>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* AI Sidekick Assistant Panel */}
          <div className="p-3.5 rounded-xl bg-gradient-to-r from-indigo-50 via-purple-50 to-slate-50 dark:from-indigo-950/80 dark:via-purple-950/60 dark:to-slate-900 border border-indigo-200 dark:border-indigo-500/30 text-xs space-y-2 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2 text-indigo-700 dark:text-indigo-300 font-bold">
                <Sparkles className="w-4 h-4 text-amber-500 dark:text-amber-400 fill-amber-500 dark:fill-amber-400 animate-pulse" />
                <span>FlowStack AI Sidekick (Gemini 3.6 Flash)</span>
              </div>
              {isAiLoading && (
                <div className="flex items-center space-x-1.5 text-indigo-600 dark:text-indigo-400 text-[11px]">
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Processing...</span>
                </div>
              )}
            </div>

            <p className="text-[11px] text-slate-600 dark:text-slate-300">
              Generate specs, extract subtasks, and assess project risk automatically.
            </p>

            <div className="flex items-center space-x-2 flex-wrap gap-y-1.5 pt-1">
              <button
                onClick={handleAiGenerateDescription}
                disabled={isAiLoading}
                className="px-2.5 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-[11px] flex items-center space-x-1.5 transition-colors disabled:opacity-50 shadow-sm"
              >
                <Bot className="w-3.5 h-3.5" />
                <span>Auto-Draft Specs</span>
              </button>

              <button
                onClick={handleAiGenerateSubtasks}
                disabled={isAiLoading}
                className="px-2.5 py-1 rounded-lg bg-purple-600 hover:bg-purple-500 text-white font-semibold text-[11px] flex items-center space-x-1.5 transition-colors disabled:opacity-50 shadow-sm"
              >
                <CheckSquare className="w-3.5 h-3.5" />
                <span>Generate Subtasks</span>
              </button>

              <button
                onClick={handleAiSuggestPriority}
                disabled={isAiLoading}
                className="px-2.5 py-1 rounded-lg bg-amber-600/90 hover:bg-amber-600 text-white font-semibold text-[11px] flex items-center space-x-1.5 transition-colors disabled:opacity-50 shadow-sm"
              >
                <Flame className="w-3.5 h-3.5 text-amber-200" />
                <span>Assess Risk</span>
              </button>
            </div>

            {aiStatusMessage && (
              <div className="p-2 rounded bg-white dark:bg-slate-900/80 border border-indigo-200 dark:border-indigo-500/20 text-[11px] text-indigo-800 dark:text-indigo-200">
                {aiStatusMessage}
              </div>
            )}
          </div>

          {/* Markdown Description */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center space-x-1.5">
                <FileText className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                <span>Description & Specs</span>
              </label>
              <button
                onClick={handleSaveDescription}
                className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline font-semibold"
              >
                Save Specs
              </button>
            </div>
            <textarea
              rows={5}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add detailed markdown specifications, acceptance criteria..."
              className="w-full p-3 text-xs bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono"
            />
          </div>

          {/* Subtasks Section */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center space-x-1.5">
                <CheckSquare className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                <span>Actionable Subtasks ({card.subtasks.length})</span>
              </h4>
            </div>

            <div className="space-y-1.5">
              {card.subtasks.map((st) => (
                <div
                  key={st.id}
                  onClick={() => toggleSubtask(card.id, st.id)}
                  className="flex items-center justify-between p-2 rounded-lg bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 cursor-pointer text-xs"
                >
                  <div className="flex items-center space-x-2.5">
                    <div
                      className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${
                        st.completed
                          ? 'bg-emerald-500 border-emerald-500 text-white'
                          : 'border-slate-400 dark:border-slate-600'
                      }`}
                    >
                      {st.completed && <Check className="w-3 h-3" />}
                    </div>
                    <span className={st.completed ? 'line-through text-slate-400 dark:text-slate-500' : 'text-slate-800 dark:text-slate-200'}>
                      {st.title}
                    </span>
                  </div>
                  {st.estimatedHours && (
                    <span className="text-[10px] text-slate-400 dark:text-slate-500">{st.estimatedHours}h est.</span>
                  )}
                </div>
              ))}
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                addSubtask(card.id, newSubtaskTitle);
                setNewSubtaskTitle('');
              }}
              className="flex items-center space-x-2"
            >
              <input
                type="text"
                placeholder="Add subtask title..."
                value={newSubtaskTitle}
                onChange={(e) => setNewSubtaskTitle(e.target.value)}
                className="flex-1 px-3 py-1.5 text-xs bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
              <button
                type="submit"
                className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white transition-colors"
              >
                Add
              </button>
            </form>
          </div>

          {/* Attachments Section */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center space-x-1.5">
                <Paperclip className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span>Attachments ({card.attachments.length})</span>
              </h4>
              <label className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer flex items-center space-x-1">
                <UploadCloud className="w-3.5 h-3.5" />
                <span>Upload File</span>
                <input type="file" onChange={handleFileUpload} className="hidden" />
              </label>
            </div>

            <div className="grid grid-cols-2 gap-2">
              {card.attachments.map((att) => (
                <div
                  key={att.id}
                  className="flex items-center justify-between p-2 rounded-lg bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 text-xs"
                >
                  <div className="flex items-center space-x-2 truncate">
                    <Paperclip className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                    <span className="truncate text-slate-800 dark:text-slate-200">{att.name}</span>
                  </div>
                  <a
                    href={att.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-1 text-indigo-600 dark:text-indigo-400 hover:text-indigo-500"
                  >
                    <Eye className="w-3.5 h-3.5" />
                  </a>
                </div>
              ))}
            </div>
          </div>

          {/* Comments Section */}
          <div className="space-y-3 pt-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center space-x-1.5">
              <MessageSquare className="w-4 h-4 text-amber-500 dark:text-amber-400" />
              <span>Discussion & Comments ({card.comments.length})</span>
            </h4>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                addComment(card.id, newCommentText);
                setNewCommentText('');
              }}
              className="flex items-center space-x-2"
            >
              <input
                type="text"
                placeholder="Write a comment..."
                value={newCommentText}
                onChange={(e) => setNewCommentText(e.target.value)}
                className="flex-1 px-3 py-2 text-xs bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
              <button
                type="submit"
                className="p-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white transition-colors"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>

            <div className="space-y-2 max-h-48 overflow-y-auto">
              {card.comments.map((cm) => (
                <div key={cm.id} className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 space-y-1 text-xs">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <img src={cm.userAvatar} alt="" className="w-4 h-4 rounded-full object-cover" />
                      <span className="font-bold text-slate-800 dark:text-slate-200">{cm.userName}</span>
                    </div>
                    <span className="text-[10px] text-slate-400 dark:text-slate-500">
                      {new Date(cm.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <p className="text-slate-600 dark:text-slate-300">{cm.text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Side: Meta Sidebar (Priority, Assignees, Labels, Dates, Time Tracking) */}
        <div className="w-full md:w-64 bg-slate-100/70 dark:bg-slate-950 border-t md:border-t-0 md:border-l border-slate-200 dark:border-slate-800 p-6 space-y-5 text-xs">
          {/* Priority */}
          <div>
            <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block mb-1">
              Priority Level
            </label>
            <select
              value={card.priority}
              onChange={(e) => updateCard(card.id, { priority: e.target.value as Priority })}
              className="w-full px-2.5 py-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500 capitalize"
            >
              <option value="urgent">🔥 Urgent</option>
              <option value="high">⚠️ High</option>
              <option value="medium">⏱️ Medium</option>
              <option value="low">🔹 Low</option>
            </select>
          </div>

          {/* Due Date */}
          <div>
            <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block mb-1">
              Due Date
            </label>
            <input
              type="date"
              value={card.dueDate || ''}
              onChange={(e) => updateCard(card.id, { dueDate: e.target.value })}
              className="w-full px-2.5 py-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>

          {/* Time Tracking */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
              Time Tracking (Hours)
            </label>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <span className="text-[10px] text-slate-500 dark:text-slate-400 block">Est:</span>
                <input
                  type="number"
                  value={timeEstimate}
                  onChange={(e) => {
                    const val = Number(e.target.value);
                    setTimeEstimate(val);
                    updateCard(card.id, { timeEstimateHours: val });
                  }}
                  className="w-full px-2 py-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded text-slate-800 dark:text-slate-200"
                />
              </div>
              <div>
                <span className="text-[10px] text-slate-500 dark:text-slate-400 block">Spent:</span>
                <input
                  type="number"
                  value={timeSpent}
                  onChange={(e) => {
                    const val = Number(e.target.value);
                    setTimeSpent(val);
                    updateCard(card.id, { timeSpentHours: val });
                  }}
                  className="w-full px-2 py-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded text-slate-800 dark:text-slate-200"
                />
              </div>
            </div>
          </div>

          {/* Assignees */}
          <div>
            <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block mb-1.5">
              Assignees
            </label>
            <div className="space-y-1">
              {allUsers.map((u) => {
                const assigned = card.assigneeIds.includes(u.id);
                return (
                  <button
                    key={u.id}
                    onClick={() => toggleCardAssignee(card.id, u.id)}
                    className={`w-full flex items-center justify-between p-1.5 rounded-lg transition-colors ${
                      assigned ? 'bg-indigo-100 dark:bg-indigo-600/20 border border-indigo-200 dark:border-indigo-500/30 text-indigo-700 dark:text-indigo-300' : 'hover:bg-slate-200/60 dark:hover:bg-slate-900 text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    <div className="flex items-center space-x-2">
                      <img src={u.avatar} alt="" className="w-5 h-5 rounded-full object-cover" />
                      <span>{u.name}</span>
                    </div>
                    {assigned && <Check className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Labels */}
          <div>
            <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block mb-1.5">
              Labels
            </label>
            <div className="space-y-1">
              {labels.map((l) => {
                const active = card.labelIds.includes(l.id);
                return (
                  <button
                    key={l.id}
                    onClick={() => toggleCardLabel(card.id, l.id)}
                    className={`w-full flex items-center justify-between p-1.5 rounded-lg text-[11px] font-semibold border transition-all ${
                      active ? l.color : 'border-slate-200 dark:border-slate-800 text-slate-500 hover:bg-slate-200/60 dark:hover:bg-slate-900'
                    }`}
                  >
                    <span>{l.name}</span>
                    {active && <Check className="w-3 h-3" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Delete Card Button */}
          <div className="pt-4 border-t border-slate-200 dark:border-slate-800">
            <button
              onClick={() => {
                deleteCard(card.id);
                onClose();
              }}
              className="w-full py-1.5 text-xs font-semibold rounded-lg bg-rose-50 dark:bg-rose-500/10 hover:bg-rose-100 dark:hover:bg-rose-500/20 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-500/30 transition-colors flex items-center justify-center space-x-1.5"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Delete Card</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
