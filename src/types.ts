export type Role = 'owner' | 'admin' | 'member' | 'guest';

export type PlanType = 'free' | 'pro' | 'business' | 'enterprise';

export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: Role;
  plan: PlanType;
}

export interface WorkspaceMember {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  userAvatar: string;
  role: Role;
  joinedAt: string;
}

export interface Workspace {
  id: string;
  name: string;
  slug: string;
  description: string;
  logoEmoji: string;
  ownerId: string;
  createdAt: string;
  members: WorkspaceMember[];
}

export type BoardType = 'team' | 'personal' | 'sprint' | 'roadmap';

export interface Board {
  id: string;
  workspaceId: string;
  name: string;
  description: string;
  emoji: string;
  coverGradient: string;
  isFavorite: boolean;
  isPrivate: boolean;
  type: BoardType;
  createdAt: string;
  updatedAt: string;
}

export interface List {
  id: string;
  boardId: string;
  name: string;
  position: number;
  color?: string;
  isCollapsed?: boolean;
}

export type Priority = 'low' | 'medium' | 'high' | 'urgent';

export interface ChecklistItem {
  id: string;
  text: string;
  completed: boolean;
  dueDate?: string;
  assigneeId?: string;
}

export interface Attachment {
  id: string;
  name: string;
  url: string;
  type: 'image' | 'video' | 'pdf' | 'zip' | 'docx' | 'other';
  size: string;
  uploadedAt: string;
}

export interface Comment {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  text: string;
  createdAt: string;
  reactions: Record<string, string[]>; // emoji -> array of userIds
}

export interface Subtask {
  id: string;
  title: string;
  completed: boolean;
  estimatedHours?: number;
}

export interface CustomField {
  id: string;
  name: string;
  type: 'text' | 'number' | 'select' | 'date' | 'checkbox';
  value: any;
}

export interface Card {
  id: string;
  listId: string;
  boardId: string;
  title: string;
  description: string;
  priority: Priority;
  status: 'backlog' | 'in_progress' | 'review' | 'done';
  labelIds: string[];
  assigneeIds: string[];
  dueDate?: string;
  startDate?: string;
  timeEstimateHours: number;
  timeSpentHours: number;
  checklist: ChecklistItem[];
  comments: Comment[];
  attachments: Attachment[];
  subtasks: Subtask[];
  customFields: CustomField[];
  watchers: string[];
  position: number;
  createdAt: string;
  updatedAt: string;
}

export interface Label {
  id: string;
  boardId: string;
  name: string;
  color: string; // hex or tailwind class
}

export interface AutomationRule {
  id: string;
  boardId: string;
  name: string;
  trigger: 'card_completed' | 'due_today' | 'label_added' | 'list_moved';
  action: 'move_to_done' | 'assign_member' | 'send_notification' | 'add_label';
  enabled: boolean;
  executionsCount: number;
  createdAt: string;
}

export interface ActivityLog {
  id: string;
  boardId: string;
  cardId?: string;
  cardTitle?: string;
  userId: string;
  userName: string;
  userAvatar: string;
  action: string;
  timestamp: string;
  details?: string;
}

export interface AppNotification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'mention' | 'due_date' | 'assignment' | 'comment' | 'automation';
  isRead: boolean;
  createdAt: string;
  targetCardId?: string;
}

export type MainTab =
  | 'landing'
  | 'app'
  | 'blog'
  | 'docs';

export type ViewMode =
  | 'board'
  | 'list'
  | 'calendar'
  | 'timeline'
  | 'analytics'
  | 'automations'
  | 'settings'
  | 'admin';
