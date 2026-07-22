import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/Navigation/Navbar';
import { Sidebar } from './components/Navigation/Sidebar';
import { BoardView } from './components/Kanban/BoardView';
import { CalendarView } from './components/Calendar/CalendarView';
import { SettingsView } from './components/Settings/SettingsView';
import { CardModal } from './components/Kanban/CardModal';
import { CommandPalette } from './components/Modals/CommandPalette';
import { ShortcutsModal } from './components/Modals/ShortcutsModal';
import { CreateBoardModal } from './components/Modals/CreateBoardModal';
import { CreateWorkspaceModal } from './components/Modals/CreateWorkspaceModal';

const AppContent: React.FC = () => {
  const { viewMode, activeCardId, setActiveCardId } = useApp();

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-slate-50 dark:bg-zinc-950 text-slate-900 dark:text-zinc-100 font-sans antialiased selection:bg-indigo-600/80 selection:text-white transition-colors duration-200">
      {/* Top Navbar */}
      <Navbar />

      {/* Main Body */}
      <div className="flex-1 flex overflow-hidden">
        <Sidebar />

        {/* View Switcher */}
        <main className="flex-1 flex flex-col overflow-hidden relative">
          {(viewMode === 'board' || viewMode === 'list') && (
            <BoardView onOpenCardModal={(cardId) => setActiveCardId(cardId)} />
          )}
          {viewMode === 'calendar' && (
            <CalendarView onOpenCardModal={(cardId) => setActiveCardId(cardId)} />
          )}
          {viewMode === 'settings' && <SettingsView />}
        </main>
      </div>

      {/* Global Modals */}
      {activeCardId && (
        <CardModal cardId={activeCardId} onClose={() => setActiveCardId(null)} />
      )}
      <CommandPalette />
      <ShortcutsModal />
      <CreateBoardModal />
      <CreateWorkspaceModal />
    </div>
  );
};

export function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

export default App;
