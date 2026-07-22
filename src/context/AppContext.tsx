import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  User,
  Workspace,
  Board,
  List,
  Card,
  Label,
  AutomationRule,
  ActivityLog,
  AppNotification,
  MainTab,
  ViewMode,
  Priority,
  ChecklistItem,
  Comment,
  Subtask,
} from '../types';
import {
  CURRENT_USER,
  INITIAL_WORKSPACES,
  INITIAL_BOARDS,
  INITIAL_LISTS,
  INITIAL_CARDS,
  INITIAL_LABELS,
  INITIAL_AUTOMATIONS,
  INITIAL_ACTIVITIES,
  INITIAL_NOTIFICATIONS,
  MOCK_USERS,
} from '../data/initialData';

interface AppContextType {
  mainTab: MainTab;
  setMainTab: (tab: MainTab) => void;
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;
  user: User;
  setUser: React.Dispatch<React.SetStateAction<User>>;
  theme: 'dark' | 'light';
  toggleTheme: () => void;
  isSidebarCollapsed: boolean;
  setIsSidebarCollapsed: React.Dispatch<React.SetStateAction<boolean>>;
  toggleSidebarCollapsed: () => void;
  
  workspaces: Workspace[];
  activeWorkspaceId: string;
  setActiveWorkspaceId: (id: string) => void;
  
  boards: Board[];
  activeBoardId: string;
  setActiveBoardId: (id: string) => void;
  
  lists: List[];
  cards: Card[];
  labels: Label[];
  automations: AutomationRule[];
  activities: ActivityLog[];
  notifications: AppNotification[];
  allUsers: User[];
  
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  filterPriority: Priority | 'all';
  setFilterPriority: (p: Priority | 'all') => void;
  filterLabelId: string | 'all';
  setFilterLabelId: (l: string | 'all') => void;
  filterAssigneeId: string | 'all';
  setFilterAssigneeId: (a: string | 'all') => void;
  
  // Modals state
  activeCardId: string | null;
  setActiveCardId: (id: string | null) => void;
  isCreateBoardOpen: boolean;
  setIsCreateBoardOpen: (open: boolean) => void;
  isCreateWorkspaceOpen: boolean;
  setIsCreateWorkspaceOpen: (open: boolean) => void;
  isCommandPaletteOpen: boolean;
  setIsCommandPaletteOpen: (open: boolean) => void;
  isShortcutsOpen: boolean;
  setIsShortcutsOpen: (open: boolean) => void;
  isUpgradeModalOpen: boolean;
  setIsUpgradeModalOpen: (open: boolean) => void;

  // Actions
  addCard: (listId: string, title: string, priority?: Priority) => Card;
  updateCard: (cardId: string, updates: Partial<Card>) => void;
  deleteCard: (cardId: string) => void;
  moveCard: (cardId: string, targetListId: string, newPosition: number) => void;
  
  addList: (boardId: string, name: string) => List;
  updateList: (listId: string, updates: Partial<List>) => void;
  deleteList: (listId: string) => void;
  moveList: (listId: string, newPosition: number) => void;
  
  addBoard: (workspaceId: string, name: string, emoji?: string, coverGradient?: string, isPrivate?: boolean, boardType?: 'sprint' | 'roadmap' | 'team' | 'personal') => Board;
  createBoard: (workspaceId: string, name: string, type?: 'sprint' | 'roadmap' | 'team' | 'personal', emoji?: string) => Board;
  updateBoard: (boardId: string, updates: Partial<Board>) => void;
  deleteBoard: (boardId: string) => void;
  toggleFavoriteBoard: (boardId: string) => void;
  
  addWorkspace: (name: string, description?: string, logoEmoji?: string) => Workspace;
  createWorkspace: (name: string, slugOrDesc?: string, logoEmoji?: string) => Workspace;
  
  addComment: (cardId: string, text: string) => void;
  addChecklistItem: (cardId: string, text: string) => void;
  toggleChecklistItem: (cardId: string, itemId: string) => void;
  addSubtask: (cardId: string, title: string, estimatedHours?: number) => void;
  toggleSubtask: (cardId: string, subtaskId: string) => void;
  
  addLabel: (boardId: string, name: string, color: string) => Label;
  toggleCardLabel: (cardId: string, labelId: string) => void;
  toggleCardAssignee: (cardId: string, userId: string) => void;
  
  addAutomationRule: (boardId: string, name: string, trigger: AutomationRule['trigger'], action: AutomationRule['action']) => void;
  toggleAutomationRule: (ruleId: string) => void;
  deleteAutomationRule: (ruleId: string) => void;
  
  markNotificationRead: (id: string) => void;
  clearAllNotifications: () => void;
  
  resetToDefaultData: () => void;
  logActivity: (action: string, cardId?: string, cardTitle?: string, details?: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const LOCAL_STORAGE_KEY = 'flowstack_saas_v1_data';

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [mainTab, setMainTab] = useState<MainTab>('app');
  const [viewMode, setViewMode] = useState<ViewMode>('board');
  const [user, setUser] = useState<User>(CURRENT_USER);
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  // Core Data
  const [workspaces, setWorkspaces] = useState<Workspace[]>(INITIAL_WORKSPACES);
  const [activeWorkspaceId, setActiveWorkspaceId] = useState<string>('ws_1');
  const [boards, setBoards] = useState<Board[]>(INITIAL_BOARDS);
  const [activeBoardId, setActiveBoardId] = useState<string>('board_1');
  const [lists, setLists] = useState<List[]>(INITIAL_LISTS);
  const [cards, setCards] = useState<Card[]>(INITIAL_CARDS);
  const [labels, setLabels] = useState<Label[]>(INITIAL_LABELS);
  const [automations, setAutomations] = useState<AutomationRule[]>(INITIAL_AUTOMATIONS);
  const [activities, setActivities] = useState<ActivityLog[]>(INITIAL_ACTIVITIES);
  const [notifications, setNotifications] = useState<AppNotification[]>(INITIAL_NOTIFICATIONS);
  const [allUsers] = useState<User[]>(MOCK_USERS);

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [filterPriority, setFilterPriority] = useState<Priority | 'all'>('all');
  const [filterLabelId, setFilterLabelId] = useState<string | 'all'>('all');
  const [filterAssigneeId, setFilterAssigneeId] = useState<string | 'all'>('all');

  // Modals
  const [activeCardId, setActiveCardId] = useState<string | null>(null);
  const [isCreateBoardOpen, setIsCreateBoardOpen] = useState(false);
  const [isCreateWorkspaceOpen, setIsCreateWorkspaceOpen] = useState(false);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [isShortcutsOpen, setIsShortcutsOpen] = useState(false);
  const [isUpgradeModalOpen, setIsUpgradeModalOpen] = useState(false);

  // Load from LocalStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.workspaces) setWorkspaces(parsed.workspaces);
        if (parsed.boards) setBoards(parsed.boards);
        if (parsed.lists) setLists(parsed.lists);
        if (parsed.cards) setCards(parsed.cards);
        if (parsed.labels) setLabels(parsed.labels);
        if (parsed.automations) setAutomations(parsed.automations);
        if (parsed.activities) setActivities(parsed.activities);
        if (parsed.notifications) setNotifications(parsed.notifications);
        if (parsed.user) setUser(parsed.user);
        if (parsed.activeWorkspaceId) setActiveWorkspaceId(parsed.activeWorkspaceId);
        if (parsed.activeBoardId) setActiveBoardId(parsed.activeBoardId);
        if (parsed.theme) setTheme(parsed.theme);
      }
    } catch (e) {
      console.warn('Could not read saved state from localStorage:', e);
    }
  }, []);

  // Save to LocalStorage on state change
  useEffect(() => {
    try {
      const payload = {
        workspaces,
        boards,
        lists,
        cards,
        labels,
        automations,
        activities,
        notifications,
        user,
        activeWorkspaceId,
        activeBoardId,
        theme,
      };
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(payload));
    } catch (e) {
      console.warn('Could not save state to localStorage:', e);
    }
  }, [workspaces, boards, lists, cards, labels, automations, activities, notifications, user, activeWorkspaceId, activeBoardId, theme]);

  // Sync dark class on document root
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  // Keyboard shortcut listener (Cmd+K / Ctrl+K & ?)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsCommandPaletteOpen((prev) => !prev);
      } else if (e.key === '?' && !['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) {
        e.preventDefault();
        setIsShortcutsOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  const toggleSidebarCollapsed = () => {
    setIsSidebarCollapsed((prev) => !prev);
  };

  const logActivity = (action: string, cardId?: string, cardTitle?: string, details?: string) => {
    const newLog: ActivityLog = {
      id: `act_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
      boardId: activeBoardId,
      cardId,
      cardTitle,
      userId: user.id,
      userName: user.name,
      userAvatar: user.avatar,
      action,
      timestamp: new Date().toISOString(),
      details,
    };
    setActivities((prev) => [newLog, ...prev]);
  };

  // Card Actions
  const addCard = (listId: string, title: string, priority: Priority = 'medium'): Card => {
    const newCard: Card = {
      id: `card_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
      listId,
      boardId: activeBoardId,
      title: title.trim(),
      description: '',
      priority,
      status: 'backlog',
      labelIds: [],
      assigneeIds: [user.id],
      dueDate: new Date(Date.now() + 86400000 * 3).toISOString().split('T')[0],
      timeEstimateHours: 4,
      timeSpentHours: 0,
      checklist: [],
      comments: [],
      attachments: [],
      subtasks: [],
      customFields: [],
      watchers: [user.id],
      position: cards.filter((c) => c.listId === listId).length,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setCards((prev) => [...prev, newCard]);
    logActivity('created card', newCard.id, newCard.title);
    return newCard;
  };

  const updateCard = (cardId: string, updates: Partial<Card>) => {
    setCards((prev) =>
      prev.map((c) => (c.id === cardId ? { ...c, ...updates, updatedAt: new Date().toISOString() } : c))
    );
  };

  const deleteCard = (cardId: string) => {
    const target = cards.find((c) => c.id === cardId);
    setCards((prev) => prev.filter((c) => c.id !== cardId));
    if (activeCardId === cardId) setActiveCardId(null);
    if (target) logActivity('deleted card', cardId, target.title);
  };

  const moveCard = (cardId: string, targetListId: string, newPosition: number) => {
    setCards((prev) => {
      const targetCard = prev.find((c) => c.id === cardId);
      if (!targetCard) return prev;

      const sourceListId = targetCard.listId;
      const isListChange = sourceListId !== targetListId;

      const updated = prev.map((c) => {
        if (c.id === cardId) {
          return {
            ...c,
            listId: targetListId,
            position: newPosition,
            updatedAt: new Date().toISOString(),
          };
        }
        return c;
      });

      // Execute Automations check if list changed
      if (isListChange) {
        const targetList = lists.find((l) => l.id === targetListId);
        const isDoneList = targetList?.name.toLowerCase().includes('done') || targetList?.name.toLowerCase().includes('shipped');
        
        // Trigger auto rules
        automations
          .filter((a) => a.enabled && a.boardId === activeBoardId)
          .forEach((rule) => {
            if (rule.trigger === 'list_moved' && rule.action === 'assign_member') {
              // Trigger assignment automation
              setNotifications((n) => [
                {
                  id: `notif_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
                  userId: user.id,
                  title: `Automation Triggered: ${rule.name}`,
                  message: `Card "${targetCard.title}" was moved to ${targetList?.name}.`,
                  type: 'automation',
                  isRead: false,
                  createdAt: new Date().toISOString(),
                  targetCardId: cardId,
                },
                ...n,
              ]);
            } else if (isDoneList && rule.trigger === 'card_completed' && rule.action === 'send_notification') {
              setNotifications((n) => [
                {
                  id: `notif_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
                  userId: user.id,
                  title: `Task Shipped 🎉`,
                  message: `"${targetCard.title}" was marked as completed!`,
                  type: 'automation',
                  isRead: false,
                  createdAt: new Date().toISOString(),
                  targetCardId: cardId,
                },
                ...n,
              ]);
            }
          });
      }

      return updated;
    });

    logActivity('moved card position', cardId);
  };

  // List Actions
  const addList = (boardId: string, name: string): List => {
    const newList: List = {
      id: `list_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
      boardId,
      name: name.trim(),
      position: lists.filter((l) => l.boardId === boardId).length,
      color: 'bg-indigo-500',
    };
    setLists((prev) => [...prev, newList]);
    logActivity(`created list "${newList.name}"`);
    return newList;
  };

  const updateList = (listId: string, updates: Partial<List>) => {
    setLists((prev) => prev.map((l) => (l.id === listId ? { ...l, ...updates } : l)));
  };

  const deleteList = (listId: string) => {
    setLists((prev) => prev.filter((l) => l.id !== listId));
    setCards((prev) => prev.filter((c) => c.listId !== listId));
  };

  const moveList = (listId: string, newPosition: number) => {
    setLists((prev) =>
      prev.map((l) => (l.id === listId ? { ...l, position: newPosition } : l))
    );
  };

  // Board Actions
  const addBoard = (
    workspaceId: string,
    name: string,
    emoji = '⚡',
    coverGradient = 'from-indigo-600 via-purple-600 to-pink-600',
    isPrivate = false,
    boardType: 'sprint' | 'roadmap' | 'team' | 'personal' = 'team'
  ): Board => {
    const targetWsId = workspaceId || activeWorkspaceId;
    const newBoard: Board = {
      id: `board_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
      workspaceId: targetWsId,
      name: name.trim(),
      description: 'Newly created board for sprint tracking and tasks.',
      emoji: emoji || '⚡',
      coverGradient,
      isFavorite: false,
      isPrivate,
      type: boardType,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setBoards((prev) => [...prev, newBoard]);
    setActiveBoardId(newBoard.id);
    setActiveWorkspaceId(targetWsId);
    setMainTab('app');
    setViewMode('board');

    // Create default lists for the board
    const defaultLists: List[] = [
      { id: `list_b_${newBoard.id}_1`, boardId: newBoard.id, name: 'To Do', position: 0, color: 'bg-blue-500' },
      { id: `list_b_${newBoard.id}_2`, boardId: newBoard.id, name: 'In Progress', position: 1, color: 'bg-amber-500' },
      { id: `list_b_${newBoard.id}_3`, boardId: newBoard.id, name: 'Done ✅', position: 2, color: 'bg-emerald-500' },
    ];
    setLists((prev) => [...prev, ...defaultLists]);

    logActivity(`created board "${newBoard.name}"`);
    return newBoard;
  };

  const createBoard = (
    workspaceId: string,
    name: string,
    type: 'sprint' | 'roadmap' | 'team' | 'personal' = 'team',
    emoji = '⚡'
  ): Board => {
    return addBoard(workspaceId || activeWorkspaceId, name, emoji, 'from-indigo-600 via-purple-600 to-pink-600', false, type);
  };

  const updateBoard = (boardId: string, updates: Partial<Board>) => {
    setBoards((prev) =>
      prev.map((b) => (b.id === boardId ? { ...b, ...updates, updatedAt: new Date().toISOString() } : b))
    );
  };

  const deleteBoard = (boardId: string) => {
    setBoards((prev) => prev.filter((b) => b.id !== boardId));
    setLists((prev) => prev.filter((l) => l.boardId !== boardId));
    setCards((prev) => prev.filter((c) => c.boardId !== boardId));
    const remaining = boards.filter((b) => b.id !== boardId);
    if (remaining.length > 0) setActiveBoardId(remaining[0].id);
  };

  const toggleFavoriteBoard = (boardId: string) => {
    setBoards((prev) =>
      prev.map((b) => (b.id === boardId ? { ...b, isFavorite: !b.isFavorite } : b))
    );
  };

  // Workspace Actions
  const addWorkspace = (name: string, description?: string, logoEmoji = '🚀'): Workspace => {
    const wsId = `ws_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`;
    const wsName = name.trim();
    const newWs: Workspace = {
      id: wsId,
      name: wsName,
      slug: wsName.toLowerCase().replace(/\s+/g, '-'),
      description: (description && description.trim()) || 'Custom collaborative workspace',
      logoEmoji: logoEmoji || '🚀',
      ownerId: user.id,
      createdAt: new Date().toISOString(),
      members: [
        {
          id: `wm_${Date.now()}`,
          userId: user.id,
          userName: user.name,
          userEmail: user.email,
          userAvatar: user.avatar,
          role: 'owner',
          joinedAt: new Date().toISOString().split('T')[0],
        },
      ],
    };

    setWorkspaces((prev) => [...prev, newWs]);
    setActiveWorkspaceId(newWs.id);

    // Create a starter board for new workspace
    const newBoard = addBoard(newWs.id, `${newWs.name} Board`, logoEmoji);
    setActiveBoardId(newBoard.id);
    setMainTab('app');
    setViewMode('board');

    return newWs;
  };

  const createWorkspace = (name: string, slugOrDesc?: string, logoEmoji = '🚀'): Workspace => {
    return addWorkspace(name, slugOrDesc, logoEmoji);
  };

  // Comments & Checklists & Subtasks
  const addComment = (cardId: string, text: string) => {
    if (!text.trim()) return;
    const newComment: Comment = {
      id: `cm_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
      userId: user.id,
      userName: user.name,
      userAvatar: user.avatar,
      text: text.trim(),
      createdAt: new Date().toISOString(),
      reactions: {},
    };

    setCards((prev) =>
      prev.map((c) => (c.id === cardId ? { ...c, comments: [newComment, ...c.comments] } : c))
    );
    const card = cards.find((c) => c.id === cardId);
    logActivity('commented on card', cardId, card?.title, `"${text.substring(0, 30)}..."`);
  };

  const addChecklistItem = (cardId: string, text: string) => {
    if (!text.trim()) return;
    const newItem: ChecklistItem = {
      id: `chk_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
      text: text.trim(),
      completed: false,
    };

    setCards((prev) =>
      prev.map((c) => (c.id === cardId ? { ...c, checklist: [...c.checklist, newItem] } : c))
    );
  };

  const toggleChecklistItem = (cardId: string, itemId: string) => {
    setCards((prev) =>
      prev.map((c) => {
        if (c.id !== cardId) return c;
        const updatedChecklist = c.checklist.map((item) =>
          item.id === itemId ? { ...item, completed: !item.completed } : item
        );
        return { ...c, checklist: updatedChecklist };
      })
    );
  };

  const addSubtask = (cardId: string, title: string, estimatedHours = 2) => {
    if (!title.trim()) return;
    const newSubtask: Subtask = {
      id: `sub_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
      title: title.trim(),
      completed: false,
      estimatedHours,
    };

    setCards((prev) =>
      prev.map((c) => (c.id === cardId ? { ...c, subtasks: [...c.subtasks, newSubtask] } : c))
    );
  };

  const toggleSubtask = (cardId: string, subtaskId: string) => {
    setCards((prev) =>
      prev.map((c) => {
        if (c.id !== cardId) return c;
        const updatedSubtasks = c.subtasks.map((st) =>
          st.id === subtaskId ? { ...st, completed: !st.completed } : st
        );
        return { ...c, subtasks: updatedSubtasks };
      })
    );
  };

  // Labels & Assignees
  const addLabel = (boardId: string, name: string, color: string): Label => {
    const newLabel: Label = {
      id: `lbl_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
      boardId,
      name: name.trim(),
      color,
    };
    setLabels((prev) => [...prev, newLabel]);
    return newLabel;
  };

  const toggleCardLabel = (cardId: string, labelId: string) => {
    setCards((prev) =>
      prev.map((c) => {
        if (c.id !== cardId) return c;
        const exists = c.labelIds.includes(labelId);
        const updated = exists
          ? c.labelIds.filter((id) => id !== labelId)
          : [...c.labelIds, labelId];
        return { ...c, labelIds: updated };
      })
    );
  };

  const toggleCardAssignee = (cardId: string, userId: string) => {
    setCards((prev) =>
      prev.map((c) => {
        if (c.id !== cardId) return c;
        const exists = c.assigneeIds.includes(userId);
        const updated = exists
          ? c.assigneeIds.filter((id) => id !== userId)
          : [...c.assigneeIds, userId];
        return { ...c, assigneeIds: updated };
      })
    );
  };

  // Automations
  const addAutomationRule = (
    boardId: string,
    name: string,
    trigger: AutomationRule['trigger'],
    action: AutomationRule['action']
  ) => {
    const newRule: AutomationRule = {
      id: `rule_${Date.now()}`,
      boardId,
      name: name.trim(),
      trigger,
      action,
      enabled: true,
      executionsCount: 0,
      createdAt: new Date().toISOString(),
    };
    setAutomations((prev) => [...prev, newRule]);
  };

  const toggleAutomationRule = (ruleId: string) => {
    setAutomations((prev) =>
      prev.map((a) => (a.id === ruleId ? { ...a, enabled: !a.enabled } : a))
    );
  };

  const deleteAutomationRule = (ruleId: string) => {
    setAutomations((prev) => prev.filter((a) => a.id !== ruleId));
  };

  // Notifications
  const markNotificationRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
    );
  };

  const clearAllNotifications = () => {
    setNotifications([]);
  };

  const resetToDefaultData = () => {
    localStorage.removeItem(LOCAL_STORAGE_KEY);
    setWorkspaces(INITIAL_WORKSPACES);
    setBoards(INITIAL_BOARDS);
    setLists(INITIAL_LISTS);
    setCards(INITIAL_CARDS);
    setLabels(INITIAL_LABELS);
    setAutomations(INITIAL_AUTOMATIONS);
    setActivities(INITIAL_ACTIVITIES);
    setNotifications(INITIAL_NOTIFICATIONS);
    setUser(CURRENT_USER);
    setActiveWorkspaceId('ws_1');
    setActiveBoardId('board_1');
  };

  return (
    <AppContext.Provider
      value={{
        mainTab,
        setMainTab,
        viewMode,
        setViewMode,
        user,
        setUser,
        theme,
        toggleTheme,
        isSidebarCollapsed,
        setIsSidebarCollapsed,
        toggleSidebarCollapsed,

        workspaces,
        activeWorkspaceId,
        setActiveWorkspaceId,

        boards,
        activeBoardId,
        setActiveBoardId,

        lists,
        cards,
        labels,
        automations,
        activities,
        notifications,
        allUsers,

        searchQuery,
        setSearchQuery,
        filterPriority,
        setFilterPriority,
        filterLabelId,
        setFilterLabelId,
        filterAssigneeId,
        setFilterAssigneeId,

        activeCardId,
        setActiveCardId,
        isCreateBoardOpen,
        setIsCreateBoardOpen,
        isCreateWorkspaceOpen,
        setIsCreateWorkspaceOpen,
        isCommandPaletteOpen,
        setIsCommandPaletteOpen,
        isShortcutsOpen,
        setIsShortcutsOpen,
        isUpgradeModalOpen,
        setIsUpgradeModalOpen,

        addCard,
        updateCard,
        deleteCard,
        moveCard,

        addList,
        updateList,
        deleteList,
        moveList,

        addBoard,
        createBoard,
        updateBoard,
        deleteBoard,
        toggleFavoriteBoard,

        addWorkspace,
        createWorkspace,

        addComment,
        addChecklistItem,
        toggleChecklistItem,
        addSubtask,
        toggleSubtask,

        addLabel,
        toggleCardLabel,
        toggleCardAssignee,

        addAutomationRule,
        toggleAutomationRule,
        deleteAutomationRule,

        markNotificationRead,
        clearAllNotifications,

        resetToDefaultData,
        logActivity,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
