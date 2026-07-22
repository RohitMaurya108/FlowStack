import React from 'react';
import {
  Flame,
  AlertCircle,
  Clock,
  CheckSquare,
  MessageSquare,
  Paperclip,
  MoreHorizontal,
  Pencil,
  Trash2,
  ListTodo,
} from 'lucide-react';
import { Card, Label, Priority, User } from '../../types';
import { useApp } from '../../context/AppContext';

interface CardItemProps {
  card: Card;
  labels: Label[];
  allUsers: User[];
  onOpenModal: (cardId: string) => void;
  onDragStart?: (e: React.DragEvent, cardId: string) => void;
}

export const CardItem: React.FC<CardItemProps> = ({
  card,
  labels,
  allUsers,
  onOpenModal,
  onDragStart,
}) => {
  const { deleteCard, moveCard, lists } = useApp();

  const cardLabels = labels.filter((l) => card.labelIds.includes(l.id));
  const assignees = allUsers.filter((u) => card.assigneeIds.includes(u.id));

  // Calculate checklist & subtasks progress
  const totalChecklist = card.checklist.length;
  const completedChecklist = card.checklist.filter((i) => i.completed).length;

  const totalSubtasks = card.subtasks.length;
  const completedSubtasks = card.subtasks.filter((s) => s.completed).length;

  // Due date status
  const isOverdue = card.dueDate && new Date(card.dueDate) < new Date() && card.status !== 'done';
  const imageAttachment = card.attachments.find((a) => a.type === 'image');

  const priorityBadgeMap: Record<Priority, { label: string; bg: string; text: string; icon: React.ReactNode }> = {
    urgent: {
      label: 'Urgent',
      bg: 'bg-rose-100 dark:bg-rose-500/20 border-rose-300 dark:border-rose-500/40',
      text: 'text-rose-700 dark:text-rose-400',
      icon: <Flame className="w-3 h-3 text-rose-600 dark:text-rose-400 fill-rose-600 dark:fill-rose-400 animate-pulse" />,
    },
    high: {
      label: 'High',
      bg: 'bg-amber-100 dark:bg-amber-500/20 border-amber-300 dark:border-amber-500/40',
      text: 'text-amber-800 dark:text-amber-400',
      icon: <AlertCircle className="w-3 h-3 text-amber-600 dark:text-amber-400" />,
    },
    medium: {
      label: 'Medium',
      bg: 'bg-indigo-100 dark:bg-indigo-500/20 border-indigo-300 dark:border-indigo-500/40',
      text: 'text-indigo-800 dark:text-indigo-400',
      icon: <Clock className="w-3 h-3 text-indigo-600 dark:text-indigo-400" />,
    },
    low: {
      label: 'Low',
      bg: 'bg-slate-200 dark:bg-slate-500/20 border-slate-300 dark:border-slate-500/40',
      text: 'text-slate-700 dark:text-slate-400',
      icon: null,
    },
  };

  const pInfo = priorityBadgeMap[card.priority] || priorityBadgeMap.medium;

  return (
    <div
      draggable
      onDragStart={(e) => onDragStart && onDragStart(e, card.id)}
      onClick={() => onOpenModal(card.id)}
      className="group relative bg-white dark:bg-zinc-900/90 hover:bg-slate-50 dark:hover:bg-zinc-800/90 border border-slate-200 dark:border-zinc-800 hover:border-violet-500/50 rounded-xl p-3 shadow-sm hover:shadow-md transition-all cursor-pointer select-none space-y-2.5"
    >
      {/* Optional Card Cover Header */}
      {imageAttachment && (
        <div className="w-full h-28 rounded-lg overflow-hidden -mt-1 mb-1 bg-slate-100 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800">
          <img
            src={imageAttachment.url}
            alt={card.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>
      )}

      {/* Priority & Quick Actions */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-1.5 flex-wrap gap-y-1">
          <span
            className={`inline-flex items-center space-x-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${pInfo.bg} ${pInfo.text}`}
          >
            {pInfo.icon}
            <span>{pInfo.label}</span>
          </span>

          {cardLabels.map((l) => (
            <span
              key={l.id}
              className={`px-2 py-0.5 rounded-full text-[10px] font-semibold border ${l.color}`}
            >
              {l.name}
            </span>
          ))}
        </div>

        {/* Quick Delete / Menu button */}
        <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center space-x-1">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onOpenModal(card.id);
            }}
            className="p-1 text-slate-400 dark:text-zinc-400 hover:text-violet-600 dark:hover:text-violet-400 hover:bg-slate-200 dark:hover:bg-zinc-800 rounded transition-colors"
            title="Edit Card Details"
          >
            <Pencil className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              deleteCard(card.id);
            }}
            className="p-1 text-slate-400 dark:text-zinc-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-slate-200 dark:hover:bg-zinc-800 rounded transition-colors"
            title="Delete Card"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Card Title */}
      <h4 className="font-semibold text-xs text-slate-900 dark:text-zinc-100 leading-snug group-hover:text-violet-600 dark:group-hover:text-violet-300 transition-colors line-clamp-2">
        {card.title}
      </h4>

      {/* Subtasks / Checklist Progress Bar if items exist */}
      {(totalChecklist > 0 || totalSubtasks > 0) && (
        <div className="space-y-1">
          <div className="flex items-center justify-between text-[10px] text-slate-500 dark:text-zinc-400">
            <span className="flex items-center space-x-1">
              <CheckSquare className="w-3 h-3 text-violet-600 dark:text-violet-400" />
              <span>
                {completedChecklist + completedSubtasks}/{totalChecklist + totalSubtasks} Done
              </span>
            </span>
            <span>
              {Math.round(
                ((completedChecklist + completedSubtasks) / (totalChecklist + totalSubtasks)) * 100
              )}
              %
            </span>
          </div>
          <div className="w-full h-1.5 rounded-full bg-slate-100 dark:bg-zinc-950 overflow-hidden border border-slate-200 dark:border-zinc-800/80">
            <div
              className="h-full bg-gradient-to-r from-violet-600 to-indigo-500 rounded-full transition-all duration-300"
              style={{
                width: `${
                  ((completedChecklist + completedSubtasks) / (totalChecklist + totalSubtasks)) * 100
                }%`,
              }}
            />
          </div>
        </div>
      )}

      {/* Footer Meta: Due date, comments, attachments, assignees */}
      <div className="flex items-center justify-between pt-1 border-t border-slate-200 dark:border-zinc-800/80 text-[11px] text-slate-500 dark:text-zinc-400">
        <div className="flex items-center space-x-2.5">
          {card.dueDate && (
            <span
              className={`flex items-center space-x-1 font-medium ${
                isOverdue
                  ? 'text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-500/10 px-1.5 py-0.5 rounded border border-rose-200 dark:border-rose-500/20'
                  : 'text-slate-500 dark:text-zinc-400'
              }`}
            >
              <Clock className="w-3 h-3" />
              <span>{card.dueDate.split('-').slice(1).join('/')}</span>
            </span>
          )}

          {card.comments.length > 0 && (
            <span className="flex items-center space-x-1 hover:text-slate-800 dark:hover:text-zinc-200">
              <MessageSquare className="w-3 h-3 text-slate-400 dark:text-zinc-500" />
              <span>{card.comments.length}</span>
            </span>
          )}

          {card.attachments.length > 0 && (
            <span className="flex items-center space-x-1 hover:text-slate-800 dark:hover:text-zinc-200">
              <Paperclip className="w-3 h-3 text-slate-400 dark:text-zinc-500" />
              <span>{card.attachments.length}</span>
            </span>
          )}
        </div>

        {/* Assignees Avatars */}
        <div className="flex items-center -space-x-1.5">
          {assignees.map((u) => (
            <img
              key={u.id}
              src={u.avatar}
              alt={u.name}
              title={u.name}
              className="w-5 h-5 rounded-full object-cover ring-2 ring-white dark:ring-zinc-900"
            />
          ))}
        </div>
      </div>
    </div>
  );
};
