import React, { useState } from 'react';
import {
  Plus,
  Filter,
  MoreHorizontal,
  Flame,
  AlertCircle,
  X,
  Search,
  SlidersHorizontal,
  Sparkles,
  Bot,
  Zap,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { CardItem } from './CardItem';
import { Priority, List, Card } from '../../types';

interface BoardViewProps {
  onOpenCardModal: (cardId: string) => void;
}

export const BoardView: React.FC<BoardViewProps> = ({ onOpenCardModal }) => {
  const {
    boards,
    activeBoardId,
    lists,
    cards,
    labels,
    allUsers,
    addList,
    addCard,
    moveCard,
    deleteList,
    searchQuery,
    setSearchQuery,
    filterPriority,
    setFilterPriority,
    filterLabelId,
    setFilterLabelId,
    filterAssigneeId,
    setFilterAssigneeId,
    setIsCommandPaletteOpen,
  } = useApp();

  const [newListTitle, setNewListTitle] = useState('');
  const [isAddingList, setIsAddingList] = useState(false);
  const [addingCardToListId, setAddingCardToListId] = useState<string | null>(null);
  const [newCardTitle, setNewCardTitle] = useState('');
  const [draggedCardId, setDraggedCardId] = useState<string | null>(null);

  const activeBoard = boards.find((b) => b.id === activeBoardId) || boards[0];
  const boardLists = lists
    .filter((l) => l.boardId === activeBoard?.id)
    .sort((a, b) => a.position - b.position);

  // Filter Cards
  const filteredCards = cards.filter((c) => {
    if (c.boardId !== activeBoard?.id) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = c.title.toLowerCase().includes(q);
      const matchDesc = c.description.toLowerCase().includes(q);
      if (!matchTitle && !matchDesc) return false;
    }
    if (filterPriority !== 'all' && c.priority !== filterPriority) return false;
    if (filterLabelId !== 'all' && !c.labelIds.includes(filterLabelId)) return false;
    if (filterAssigneeId !== 'all' && !c.assigneeIds.includes(filterAssigneeId)) return false;
    return true;
  });

  // Handle Add List
  const handleCreateList = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newListTitle.trim() || !activeBoard) return;
    addList(activeBoard.id, newListTitle.trim());
    setNewListTitle('');
    setIsAddingList(false);
  };

  // Handle Quick Add Card
  const handleCreateCard = (listId: string, e: React.FormEvent) => {
    e.preventDefault();
    if (!newCardTitle.trim()) return;
    addCard(listId, newCardTitle.trim());
    setNewCardTitle('');
    setAddingCardToListId(null);
  };

  // HTML5 Drag & Drop handlers
  const handleDragStart = (e: React.DragEvent, cardId: string) => {
    e.dataTransfer.setData('text/plain', cardId);
    setDraggedCardId(cardId);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDropOnList = (e: React.DragEvent, listId: string) => {
    e.preventDefault();
    const cardId = e.dataTransfer.getData('text/plain') || draggedCardId;
    if (!cardId) return;

    const listCards = filteredCards.filter((c) => c.listId === listId);
    moveCard(cardId, listId, listCards.length);
    setDraggedCardId(null);
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-slate-50 dark:bg-zinc-950 overflow-hidden text-slate-900 dark:text-zinc-100 transition-colors">
      {/* Board Header Bar */}
      <div className="flex items-center justify-between px-6 py-3 border-b border-slate-200 dark:border-zinc-800/80 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md">
        <div className="flex items-center space-x-3">
          <span className="text-2xl p-1.5 rounded-xl bg-slate-100 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800/80 shadow-inner">
            {activeBoard?.emoji || '⚡'}
          </span>
          <div>
            <h1 className="font-bold text-base text-slate-900 dark:text-white flex items-center space-x-2">
              <span>{activeBoard?.name || 'Kanban Board'}</span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-violet-100 dark:bg-violet-500/20 text-violet-700 dark:text-violet-300 border border-violet-200 dark:border-violet-500/30">
                {activeBoard?.type || 'team'}
              </span>
            </h1>
            <p className="text-xs text-slate-500 dark:text-zinc-400 max-w-xl truncate">
              {activeBoard?.description || 'Track deliverables, manage sprints, and collaborate in real-time.'}
            </p>
          </div>
        </div>

        {/* Board Search & Filter Controls */}
        <div className="flex items-center space-x-2">
          {/* Priority Filter */}
          <select
            value={filterPriority}
            onChange={(e) => setFilterPriority(e.target.value as Priority | 'all')}
            className="px-2.5 py-1.5 text-xs bg-slate-100 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-lg text-slate-800 dark:text-zinc-200 focus:outline-none focus:ring-2 focus:ring-violet-500/50"
          >
            <option value="all">All Priorities</option>
            <option value="urgent">Urgent Only</option>
            <option value="high">High Only</option>
            <option value="medium">Medium Only</option>
            <option value="low">Low Only</option>
          </select>

          {/* Label Filter */}
          <select
            value={filterLabelId}
            onChange={(e) => setFilterLabelId(e.target.value)}
            className="px-2.5 py-1.5 text-xs bg-slate-100 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-lg text-slate-800 dark:text-zinc-200 focus:outline-none focus:ring-2 focus:ring-violet-500/50"
          >
            <option value="all">All Labels</option>
            {labels.map((l) => (
              <option key={l.id} value={l.id}>
                {l.name}
              </option>
            ))}
          </select>

          {/* Reset Filters */}
          {(filterPriority !== 'all' || filterLabelId !== 'all' || searchQuery !== '') && (
            <button
              onClick={() => {
                setFilterPriority('all');
                setFilterLabelId('all');
                setSearchQuery('');
              }}
              className="px-2.5 py-1.5 text-xs font-semibold text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-500/10 hover:bg-rose-100 dark:hover:bg-rose-500/20 rounded-lg border border-rose-200 dark:border-rose-500/30 transition-colors"
            >
              Reset Filters
            </button>
          )}
        </div>
      </div>

      {/* Kanban Board Columns Container */}
      <div className="flex-1 overflow-x-auto p-6 flex space-x-4 items-start select-none">
        {boardLists.map((list) => {
          const listCards = filteredCards
            .filter((c) => c.listId === list.id)
            .sort((a, b) => a.position - b.position);

          return (
            <div
              key={list.id}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDropOnList(e, list.id)}
              className="w-72 flex-shrink-0 bg-slate-200/70 dark:bg-zinc-900/80 border border-slate-300/80 dark:border-zinc-800/90 rounded-2xl flex flex-col max-h-[calc(100vh-10.5rem)] shadow-sm dark:shadow-xl transition-all"
            >
              {/* List Header */}
              <div className="p-3.5 flex items-center justify-between border-b border-slate-300/60 dark:border-zinc-800/80">
                <div className="flex items-center space-x-2">
                  <div className={`w-2.5 h-2.5 rounded-full ${list.color || 'bg-violet-500'}`} />
                  <h3 className="font-bold text-xs text-slate-900 dark:text-zinc-100">{list.name}</h3>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-white dark:bg-zinc-950 text-slate-600 dark:text-zinc-400 border border-slate-200 dark:border-zinc-800">
                    {listCards.length}
                  </span>
                </div>

                <div className="flex items-center space-x-1">
                  <button
                    onClick={() => setAddingCardToListId(list.id)}
                    className="p-1 text-slate-500 dark:text-zinc-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-slate-300/50 dark:hover:bg-zinc-800 rounded-lg transition-colors"
                    title="Add Card to List"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* List Cards Scrollable Area */}
              <div className="flex-1 overflow-y-auto p-2.5 space-y-2.5 min-h-[120px]">
                {listCards.map((card) => (
                  <CardItem
                    key={card.id}
                    card={card}
                    labels={labels}
                    allUsers={allUsers}
                    onOpenModal={onOpenCardModal}
                    onDragStart={handleDragStart}
                  />
                ))}

                {listCards.length === 0 && (
                  <div className="h-24 border-2 border-dashed border-slate-300 dark:border-zinc-800 rounded-xl flex items-center justify-center text-[11px] text-slate-400 dark:text-zinc-600">
                    Drop cards here
                  </div>
                )}
              </div>

              {/* Inline Quick Add Card Form */}
              {addingCardToListId === list.id ? (
                <form
                  onSubmit={(e) => handleCreateCard(list.id, e)}
                  className="p-2.5 border-t border-slate-300/60 dark:border-zinc-800/80 bg-white/60 dark:bg-zinc-950/40 rounded-b-2xl space-y-2"
                >
                  <input
                    type="text"
                    autoFocus
                    placeholder="Enter card title..."
                    value={newCardTitle}
                    onChange={(e) => setNewCardTitle(e.target.value)}
                    className="w-full px-3 py-1.5 text-xs bg-white dark:bg-zinc-900 border border-slate-300 dark:border-zinc-800 rounded-lg text-slate-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-violet-500/50"
                  />
                  <div className="flex items-center space-x-2">
                    <button
                      type="submit"
                      className="px-3 py-1 text-xs font-semibold rounded-lg bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white transition-colors"
                    >
                      Add Card
                    </button>
                    <button
                      type="button"
                      onClick={() => setAddingCardToListId(null)}
                      className="p-1 text-slate-400 dark:text-zinc-400 hover:text-slate-600 dark:hover:text-zinc-200"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </form>
              ) : (
                <button
                  onClick={() => setAddingCardToListId(list.id)}
                  className="p-2.5 border-t border-slate-300/60 dark:border-zinc-800/80 text-xs font-medium text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-zinc-200 hover:bg-slate-300/40 dark:hover:bg-zinc-800/50 rounded-b-2xl flex items-center space-x-1.5 transition-colors"
                >
                  <Plus className="w-3.5 h-3.5 text-violet-600 dark:text-indigo-400" />
                  <span>Add Card</span>
                </button>
              )}
            </div>
          );
        })}

        {/* Add New List Button Column */}
        <div className="w-72 flex-shrink-0">
          {isAddingList ? (
            <form
              onSubmit={handleCreateList}
              className="p-3 bg-white dark:bg-zinc-900 border border-slate-300 dark:border-zinc-800 rounded-2xl space-y-2 shadow-xl"
            >
              <input
                type="text"
                autoFocus
                placeholder="Enter list title..."
                value={newListTitle}
                onChange={(e) => setNewListTitle(e.target.value)}
                className="w-full px-3 py-1.5 text-xs bg-slate-50 dark:bg-zinc-950 border border-slate-300 dark:border-zinc-800 rounded-lg text-slate-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-violet-500/50"
              />
              <div className="flex items-center space-x-2">
                <button
                  type="submit"
                  className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white transition-colors"
                >
                  Add List
                </button>
                <button
                  type="button"
                  onClick={() => setIsAddingList(false)}
                  className="p-1.5 text-slate-400 dark:text-zinc-400 hover:text-slate-600 dark:hover:text-zinc-200"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </form>
          ) : (
            <button
              onClick={() => setIsAddingList(true)}
              className="w-full p-3.5 rounded-2xl border-2 border-dashed border-slate-300 dark:border-zinc-800 hover:border-violet-500/50 bg-slate-200/50 dark:bg-zinc-900/40 hover:bg-slate-200/80 dark:hover:bg-zinc-900/80 text-slate-600 dark:text-zinc-400 hover:text-violet-600 dark:hover:text-violet-300 flex items-center justify-center space-x-2 text-xs font-semibold transition-all shadow-sm"
            >
              <Plus className="w-4 h-4 text-violet-600 dark:text-indigo-400" />
              <span>Add Another List</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
