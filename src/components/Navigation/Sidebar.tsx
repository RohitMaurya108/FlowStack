import React, { useState } from 'react';
import {
  ChevronDown,
  Plus,
  Kanban,
  Star,
  Settings,
  Calendar,
  List as ListIcon,
  ChevronRight,
  PanelLeftClose,
  PanelLeftOpen,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { ViewMode } from '../../types';

export const Sidebar: React.FC = () => {
  const {
    mainTab,
    setMainTab,
    viewMode,
    setViewMode,
    workspaces,
    activeWorkspaceId,
    setActiveWorkspaceId,
    boards,
    activeBoardId,
    setActiveBoardId,
    toggleFavoriteBoard,
    setIsCreateBoardOpen,
    setIsCreateWorkspaceOpen,
    isSidebarCollapsed,
    toggleSidebarCollapsed,
    user,
  } = useApp();

  const [isWsDropdownOpen, setIsWsDropdownOpen] = useState(false);
  const [isBoardsCollapsed, setIsBoardsCollapsed] = useState(false);

  const activeWs = workspaces.find((w) => w.id === activeWorkspaceId) || workspaces[0];
  const wsBoards = boards.filter((b) => b.workspaceId === activeWorkspaceId);
  const favoriteBoards = boards.filter((b) => b.isFavorite);

  const views: { mode: ViewMode; label: string; icon: React.ReactNode }[] = [
    { mode: 'board', label: 'Kanban Board', icon: <Kanban className="w-4 h-4" /> },
    { mode: 'list', label: 'Task List', icon: <ListIcon className="w-4 h-4" /> },
    { mode: 'calendar', label: 'Calendar View', icon: <Calendar className="w-4 h-4" /> },
    { mode: 'settings', label: 'Settings', icon: <Settings className="w-4 h-4" /> },
  ];

  return (
    <aside
      className={`${
        isSidebarCollapsed ? 'w-16' : 'w-64'
      } bg-white/90 dark:bg-zinc-950/80 border-r border-slate-200 dark:border-zinc-800/80 flex flex-col justify-between h-[calc(100vh-3.5rem)] text-slate-700 dark:text-zinc-300 select-none text-xs flex-shrink-0 transition-all duration-300 ease-in-out relative z-20`}
    >
      {/* Top Workspace Selector & Minimize Toggle */}
      <div className="p-2.5 border-b border-slate-200 dark:border-zinc-800/80">
        <div className="relative">
          {!isSidebarCollapsed ? (
            <div className="flex items-center space-x-1.5">
              <button
                onClick={() => setIsWsDropdownOpen((prev) => !prev)}
                className="flex-1 flex items-center justify-between p-2 rounded-xl bg-slate-100/90 dark:bg-zinc-900/90 hover:bg-slate-200/80 dark:hover:bg-zinc-800/80 border border-slate-200 dark:border-zinc-800 text-slate-900 dark:text-zinc-100 transition-colors group truncate"
              >
                <div className="flex items-center space-x-2.5 truncate">
                  <span className="text-lg p-1 rounded-lg bg-white dark:bg-zinc-950 shadow-inner border border-slate-200 dark:border-zinc-800/60">
                    {activeWs?.logoEmoji || '🚀'}
                  </span>
                  <div className="text-left truncate">
                    <span className="font-bold text-xs block text-slate-900 dark:text-zinc-100 group-hover:text-violet-600 dark:group-hover:text-indigo-300 transition-colors">
                      {activeWs?.name || 'Workspace'}
                    </span>
                    <span className="text-[10px] text-slate-500 dark:text-zinc-400 block -mt-0.5">
                      {activeWs?.members.length} Members
                    </span>
                  </div>
                </div>
                <ChevronDown className="w-4 h-4 text-slate-400 dark:text-zinc-400 group-hover:text-slate-600 dark:group-hover:text-zinc-200 transition-colors" />
              </button>

              <button
                onClick={toggleSidebarCollapsed}
                title="Minimize Sidebar"
                className="p-2 text-slate-400 dark:text-zinc-400 hover:text-slate-700 dark:hover:text-zinc-200 hover:bg-slate-200/60 dark:hover:bg-zinc-800 rounded-xl transition-colors"
              >
                <PanelLeftClose className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex flex-col items-center space-y-2">
              <button
                onClick={() => setIsWsDropdownOpen((prev) => !prev)}
                title={activeWs?.name || 'Workspace'}
                className="p-2 rounded-xl bg-slate-100 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 text-lg hover:scale-105 transition-transform"
              >
                {activeWs?.logoEmoji || '🚀'}
              </button>
              <button
                onClick={toggleSidebarCollapsed}
                title="Expand Sidebar"
                className="p-1.5 text-slate-400 dark:text-zinc-400 hover:text-violet-600 dark:hover:text-violet-400 hover:bg-slate-200/60 dark:hover:bg-zinc-800 rounded-lg transition-colors"
              >
                <PanelLeftOpen className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Workspace Dropdown */}
          {isWsDropdownOpen && (
            <div className={`absolute top-full ${isSidebarCollapsed ? 'left-full ml-2 w-52' : 'left-0 right-0'} mt-1 bg-white/95 dark:bg-zinc-900/95 backdrop-blur-md border border-slate-200 dark:border-zinc-800 rounded-xl shadow-2xl p-1.5 z-50 space-y-1`}>
              <div className="px-2 py-1 text-[10px] uppercase font-bold text-slate-400 dark:text-zinc-500 tracking-wider">
                Switch Workspace
              </div>
              {workspaces.map((ws) => (
                <button
                  key={ws.id}
                  onClick={() => {
                    setActiveWorkspaceId(ws.id);
                    setIsWsDropdownOpen(false);
                    const firstWsBoard = boards.find((b) => b.workspaceId === ws.id);
                    if (firstWsBoard) setActiveBoardId(firstWsBoard.id);
                  }}
                  className={`w-full flex items-center justify-between p-2 rounded-lg text-left transition-colors ${
                    ws.id === activeWorkspaceId
                      ? 'bg-violet-50 dark:bg-indigo-600/20 text-violet-700 dark:text-indigo-300 border border-violet-200 dark:border-indigo-500/30'
                      : 'hover:bg-slate-100 dark:hover:bg-zinc-800 text-slate-700 dark:text-zinc-300'
                  }`}
                >
                  <div className="flex items-center space-x-2 truncate">
                    <span>{ws.logoEmoji}</span>
                    <span className="font-medium truncate">{ws.name}</span>
                  </div>
                </button>
              ))}

              <button
                onClick={() => {
                  setIsWsDropdownOpen(false);
                  setIsCreateWorkspaceOpen(true);
                }}
                className="w-full flex items-center space-x-2 p-2 rounded-lg text-violet-600 dark:text-indigo-400 hover:bg-violet-50 dark:hover:bg-indigo-500/10 font-semibold transition-colors mt-1 border border-violet-200 dark:border-indigo-500/20"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Create Workspace</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Main Navigation Items */}
      <div className="flex-1 overflow-y-auto px-2 py-3 space-y-4">
        {/* Workspace Views */}
        <div>
          {!isSidebarCollapsed && (
            <div className="px-2 pb-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-zinc-500">
              Views
            </div>
          )}
          <div className="space-y-0.5">
            {views.map((v) => {
              const isActive = mainTab === 'app' && viewMode === v.mode;
              return (
                <button
                  key={v.mode}
                  title={v.label}
                  onClick={() => {
                    setMainTab('app');
                    setViewMode(v.mode);
                  }}
                  className={`w-full flex items-center ${
                    isSidebarCollapsed ? 'justify-center p-2' : 'justify-between px-2.5 py-1.5'
                  } rounded-lg text-xs font-medium transition-colors ${
                    isActive
                      ? 'bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-semibold shadow-sm'
                      : 'text-slate-600 dark:text-zinc-400 hover:bg-slate-100 dark:hover:bg-zinc-800/80 hover:text-slate-900 dark:hover:text-zinc-200'
                  }`}
                >
                  <div className={`flex items-center ${isSidebarCollapsed ? '' : 'space-x-2.5'}`}>
                    {v.icon}
                    {!isSidebarCollapsed && <span>{v.label}</span>}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Favorites Section */}
        {favoriteBoards.length > 0 && (
          <div>
            {!isSidebarCollapsed && (
              <div className="flex items-center justify-between px-2 pb-1.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-zinc-500 flex items-center space-x-1">
                  <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
                  <span>Favorites</span>
                </span>
              </div>
            )}
            <div className="space-y-0.5">
              {favoriteBoards.map((b) => {
                const isActive = b.id === activeBoardId && mainTab === 'app';
                return (
                  <button
                    key={b.id}
                    title={b.name}
                    onClick={() => {
                      setMainTab('app');
                      setActiveBoardId(b.id);
                      setViewMode('board');
                    }}
                    className={`w-full flex items-center ${
                      isSidebarCollapsed ? 'justify-center p-2' : 'justify-between px-2.5 py-1.5'
                    } rounded-lg text-xs transition-colors ${
                      isActive
                        ? 'bg-slate-200/80 dark:bg-zinc-800 text-violet-700 dark:text-indigo-300 font-semibold border border-slate-300 dark:border-zinc-700/50'
                        : 'text-slate-600 dark:text-zinc-400 hover:bg-slate-100 dark:hover:bg-zinc-800/60 hover:text-slate-900 dark:hover:text-zinc-200'
                    }`}
                  >
                    <div className={`flex items-center ${isSidebarCollapsed ? '' : 'space-x-2 truncate'}`}>
                      <span className="text-base">{b.emoji}</span>
                      {!isSidebarCollapsed && <span className="truncate">{b.name}</span>}
                    </div>
                    {!isSidebarCollapsed && (
                      <Star
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleFavoriteBoard(b.id);
                        }}
                        className="w-3.5 h-3.5 text-amber-500 fill-amber-500 hover:scale-110 transition-transform"
                      />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Boards List Section */}
        <div>
          <div className={`flex items-center ${isSidebarCollapsed ? 'justify-center py-1' : 'justify-between px-2 pb-1.5'}`}>
            {!isSidebarCollapsed ? (
              <>
                <button
                  onClick={() => setIsBoardsCollapsed((prev) => !prev)}
                  className="flex items-center space-x-1 text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-zinc-500 hover:text-slate-700 dark:hover:text-zinc-300"
                >
                  {isBoardsCollapsed ? <ChevronRight className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                  <span>Boards ({wsBoards.length})</span>
                </button>
                <button
                  onClick={() => setIsCreateBoardOpen(true)}
                  className="p-0.5 text-slate-400 dark:text-zinc-400 hover:text-violet-600 dark:hover:text-indigo-400 hover:bg-slate-100 dark:hover:bg-zinc-800 rounded transition-colors"
                  title="Create New Board"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </>
            ) : (
              <button
                onClick={() => setIsCreateBoardOpen(true)}
                className="p-1 text-slate-400 dark:text-zinc-400 hover:text-violet-600 dark:hover:text-indigo-400 hover:bg-slate-100 dark:hover:bg-zinc-800 rounded-lg transition-colors"
                title="Create New Board"
              >
                <Plus className="w-4 h-4" />
              </button>
            )}
          </div>

          {!isBoardsCollapsed && (
            <div className="space-y-0.5">
              {wsBoards.map((b) => {
                const isActive = b.id === activeBoardId && mainTab === 'app';
                return (
                  <div
                    key={b.id}
                    title={b.name}
                    onClick={() => {
                      setMainTab('app');
                      setActiveBoardId(b.id);
                      setViewMode('board');
                    }}
                    className={`group flex items-center ${
                      isSidebarCollapsed ? 'justify-center p-2' : 'justify-between px-2.5 py-1.5'
                    } rounded-lg text-xs cursor-pointer transition-colors ${
                      isActive
                        ? 'bg-violet-50 dark:bg-indigo-600/20 text-violet-700 dark:text-indigo-200 font-semibold border border-violet-200 dark:border-indigo-500/30'
                        : 'text-slate-600 dark:text-zinc-400 hover:bg-slate-100 dark:hover:bg-zinc-800 hover:text-slate-900 dark:hover:text-zinc-200'
                    }`}
                  >
                    <div className={`flex items-center ${isSidebarCollapsed ? '' : 'space-x-2 truncate'}`}>
                      <span className="text-base">{b.emoji}</span>
                      {!isSidebarCollapsed && <span className="truncate">{b.name}</span>}
                    </div>
                    {!isSidebarCollapsed && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleFavoriteBoard(b.id);
                        }}
                        className={`opacity-0 group-hover:opacity-100 transition-opacity ${
                          b.isFavorite ? 'opacity-100 text-amber-500' : 'text-slate-400 dark:text-zinc-500 hover:text-amber-500'
                        }`}
                      >
                        <Star className={`w-3.5 h-3.5 ${b.isFavorite ? 'fill-amber-500' : ''}`} />
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Footer: User Profile */}
      <div className="p-2.5 border-t border-slate-200 dark:border-zinc-800/80 bg-slate-50 dark:bg-zinc-950/60">
        <div className={`flex items-center ${isSidebarCollapsed ? 'justify-center' : 'space-x-2.5 px-2 py-1'}`}>
          <img
            src={user.avatar}
            alt={user.name}
            title={user.name}
            className="w-7 h-7 rounded-full object-cover ring-1 ring-slate-300 dark:ring-zinc-700"
          />
          {!isSidebarCollapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-slate-900 dark:text-zinc-200 truncate">{user.name}</p>
              <p className="text-[10px] text-slate-500 dark:text-zinc-500 truncate">{user.email}</p>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
};
