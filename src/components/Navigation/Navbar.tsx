import React, { useState } from 'react';
import {
  Search,
  Plus,
  Bell,
  Command,
  Sun,
  Moon,
  Zap,
  Kanban,
  List as ListIcon,
  Calendar,
  Settings,
  HelpCircle,
  PanelLeftClose,
  PanelLeftOpen,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { ViewMode } from '../../types';

export const Navbar: React.FC = () => {
  const {
    setMainTab,
    viewMode,
    setViewMode,
    user,
    theme,
    toggleTheme,
    isSidebarCollapsed,
    toggleSidebarCollapsed,
    notifications,
    markNotificationRead,
    clearAllNotifications,
    setIsCommandPaletteOpen,
    setIsCreateBoardOpen,
    setIsShortcutsOpen,
  } = useApp();

  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const views: { mode: ViewMode; label: string; icon: React.ReactNode }[] = [
    { mode: 'board', label: 'Board', icon: <Kanban className="w-4 h-4" /> },
    { mode: 'list', label: 'List', icon: <ListIcon className="w-4 h-4" /> },
    { mode: 'calendar', label: 'Calendar', icon: <Calendar className="w-4 h-4" /> },
  ];

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between h-14 px-4 bg-white/90 dark:bg-zinc-950/90 backdrop-blur-md border-b border-slate-200 dark:border-zinc-800/80 text-slate-800 dark:text-zinc-100 shadow-sm transition-colors">
      {/* Left: Brand / Logo + Sidebar Toggle + View Selectors */}
      <div className="flex items-center space-x-3 md:space-x-4">
        {/* Toggle Sidebar Button */}
        <button
          onClick={toggleSidebarCollapsed}
          title={isSidebarCollapsed ? 'Expand Sidebar' : 'Minimize Sidebar'}
          className="p-1.5 text-slate-500 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-zinc-100 hover:bg-slate-100 dark:hover:bg-zinc-800 rounded-lg transition-colors"
        >
          {isSidebarCollapsed ? (
            <PanelLeftOpen className="w-4 h-4 text-violet-600 dark:text-violet-400" />
          ) : (
            <PanelLeftClose className="w-4 h-4 text-slate-500 dark:text-zinc-400" />
          )}
        </button>

        <button
          onClick={() => {
            setMainTab('app');
            setViewMode('board');
          }}
          className="flex items-center space-x-2.5 group focus:outline-none"
        >
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-violet-600 via-indigo-600 to-purple-600 flex items-center justify-center text-white font-bold shadow-md shadow-indigo-500/20 group-hover:scale-105 transition-transform">
            <Zap className="w-4 h-4 fill-current text-white" />
          </div>
          <div className="hidden sm:block text-left">
            <span className="font-black tracking-tight text-base text-gradient">
              FlowStack
            </span>
          </div>
        </button>

        <div className="h-5 w-px bg-slate-200 dark:bg-zinc-800 hidden sm:block" />

        {/* Board View Switcher Tabs */}
        <div className="hidden lg:flex items-center space-x-1 bg-slate-100 dark:bg-zinc-900/80 p-1 rounded-lg border border-slate-200 dark:border-zinc-800">
          {views.map((v) => (
            <button
              key={v.mode}
              onClick={() => setViewMode(v.mode)}
              className={`flex items-center space-x-1.5 px-2.5 py-1 text-xs font-medium rounded-md transition-all ${
                viewMode === v.mode
                  ? 'bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-sm glow-indigo'
                  : 'text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-zinc-200 hover:bg-slate-200/60 dark:hover:bg-zinc-800/70'
              }`}
            >
              {v.icon}
              <span>{v.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Middle: Search Bar / Command Palette Trigger */}
      <div className="flex-1 max-w-md mx-4">
        <button
          onClick={() => setIsCommandPaletteOpen(true)}
          className="w-full flex items-center justify-between px-3 py-1.5 text-xs text-slate-500 dark:text-zinc-400 bg-slate-100/90 dark:bg-zinc-900/90 hover:bg-slate-200/80 dark:hover:bg-zinc-800/90 border border-slate-200 dark:border-zinc-800 rounded-lg shadow-inner transition-colors group"
        >
          <div className="flex items-center space-x-2">
            <Search className="w-3.5 h-3.5 text-slate-400 dark:text-zinc-400 group-hover:text-indigo-500 dark:group-hover:text-indigo-400 transition-colors" />
            <span>Search cards and boards...</span>
          </div>
          <kbd className="hidden sm:inline-flex items-center gap-0.5 px-1.5 py-0.5 text-[10px] font-mono text-slate-500 dark:text-zinc-400 bg-white dark:bg-zinc-950 rounded border border-slate-200 dark:border-zinc-800">
            <Command className="w-3 h-3" /> K
          </kbd>
        </button>
      </div>

      {/* Right: Quick Actions, Notifications, Profile */}
      <div className="flex items-center space-x-2.5">
        {/* Create Board Quick Button */}
        <button
          onClick={() => setIsCreateBoardOpen(true)}
          className="hidden sm:flex items-center space-x-1 px-2.5 py-1.5 text-xs font-medium rounded-lg bg-slate-100 dark:bg-zinc-900 hover:bg-slate-200 dark:hover:bg-zinc-800 text-slate-800 dark:text-zinc-200 border border-slate-200 dark:border-zinc-800 transition-colors"
        >
          <Plus className="w-3.5 h-3.5 text-violet-600 dark:text-indigo-400" />
          <span>New Board</span>
        </button>

        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          className="p-1.5 text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-zinc-100 hover:bg-slate-100 dark:hover:bg-zinc-900 rounded-lg transition-colors flex items-center justify-center"
        >
          {theme === 'dark' ? (
            <Sun className="w-4 h-4 text-amber-400 hover:rotate-45 transition-transform" />
          ) : (
            <Moon className="w-4 h-4 text-indigo-600 hover:-rotate-12 transition-transform" />
          )}
        </button>

        {/* Shortcuts Cheat Sheet */}
        <button
          onClick={() => setIsShortcutsOpen(true)}
          title="Keyboard Shortcuts (?)"
          className="p-1.5 text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-zinc-100 hover:bg-slate-100 dark:hover:bg-zinc-900 rounded-lg transition-colors hidden md:block"
        >
          <HelpCircle className="w-4 h-4" />
        </button>

        {/* Notifications Dropdown */}
        <div className="relative">
          <button
            onClick={() => setIsNotifOpen((prev) => !prev)}
            className="relative p-1.5 text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-zinc-100 hover:bg-slate-100 dark:hover:bg-zinc-900 rounded-lg transition-colors"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
            )}
          </button>

          {isNotifOpen && (
            <div className="absolute right-0 mt-2 w-80 bg-white/95 dark:bg-zinc-900/95 backdrop-blur-md border border-slate-200 dark:border-zinc-800 rounded-xl shadow-2xl p-3 z-50 text-slate-800 dark:text-zinc-200">
              <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-200 dark:border-zinc-800">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-zinc-400">
                  Notifications ({unreadCount})
                </span>
                {notifications.length > 0 && (
                  <button
                    onClick={clearAllNotifications}
                    className="text-[11px] text-indigo-600 dark:text-indigo-400 hover:underline"
                  >
                    Clear All
                  </button>
                )}
              </div>
              <div className="max-h-64 overflow-y-auto space-y-2">
                {notifications.length === 0 ? (
                  <p className="text-xs text-slate-500 dark:text-zinc-500 text-center py-4">No new notifications</p>
                ) : (
                  notifications.map((n, idx) => (
                    <div
                      key={`${n.id}_${idx}`}
                      onClick={() => markNotificationRead(n.id)}
                      className={`p-2 rounded-lg text-xs transition-colors cursor-pointer ${
                        n.isRead
                          ? 'bg-slate-100/60 dark:bg-zinc-800/40 opacity-70'
                          : 'bg-indigo-50/80 dark:bg-zinc-800/90 border border-indigo-200 dark:border-zinc-700/60'
                      }`}
                    >
                      <div className="font-semibold text-indigo-700 dark:text-indigo-300 mb-0.5">{n.title}</div>
                      <p className="text-slate-700 dark:text-zinc-300 text-[11px] line-clamp-2">{n.message}</p>
                      <span className="text-[10px] text-slate-400 dark:text-zinc-500 block mt-1">
                        {new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* User Menu */}
        <div className="relative">
          <button
            onClick={() => setIsUserMenuOpen((prev) => !prev)}
            className="flex items-center space-x-2 focus:outline-none"
          >
            <img
              src={user.avatar}
              alt={user.name}
              className="w-7 h-7 rounded-full object-cover ring-2 ring-indigo-500/50 hover:ring-indigo-400 transition-all"
            />
          </button>

          {isUserMenuOpen && (
            <div className="absolute right-0 mt-2 w-56 bg-white/95 dark:bg-zinc-900/95 backdrop-blur-md border border-slate-200 dark:border-zinc-800 rounded-xl shadow-2xl p-2 z-50 text-slate-800 dark:text-zinc-200">
              <div className="px-3 py-2 border-b border-slate-200 dark:border-zinc-800 mb-1">
                <div className="text-xs font-bold text-slate-900 dark:text-white">{user.name}</div>
                <div className="text-[11px] text-slate-500 dark:text-zinc-400 truncate">{user.email}</div>
              </div>
              <button
                onClick={() => {
                  setMainTab('app');
                  setViewMode('settings');
                  setIsUserMenuOpen(false);
                }}
                className="w-full flex items-center space-x-2 px-3 py-1.5 text-xs text-slate-700 dark:text-zinc-300 hover:bg-slate-100 dark:hover:bg-zinc-800 rounded-lg transition-colors"
              >
                <Settings className="w-3.5 h-3.5 text-slate-500 dark:text-zinc-400" />
                <span>Settings</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
