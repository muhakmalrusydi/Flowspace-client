// ─── Shared domain types used across frontend and backend ───────────────────

export type Role = "OWNER" | "ADMIN" | "MEMBER" | "VIEWER";

export type TaskStatus = "TODO" | "IN_PROGRESS" | "IN_REVIEW" | "DONE";

export type TaskPriority = "LOW" | "MEDIUM" | "HIGH" | "URGENT";

// ─── User ────────────────────────────────────────────────────────────────────

export interface User {
  id: string;
  name: string;
  email: string;
  avatarUrl: string | null;
  createdAt: string;
}

// ─── Workspace ───────────────────────────────────────────────────────────────

export interface Workspace {
  id: string;
  name: string;
  slug: string;
  logoUrl: string | null;
  ownerId: string;
  createdAt: string;
}

export interface WorkspaceMember {
  id: string;
  workspaceId: string;
  userId: string;
  role: Role;
  user: User;
  joinedAt: string;
}

// ─── Project ─────────────────────────────────────────────────────────────────

export interface Project {
  id: string;
  workspaceId: string;
  name: string;
  description: string | null;
  color: string;
  createdAt: string;
}

// ─── Task ────────────────────────────────────────────────────────────────────

export interface Task {
  id: string;
  projectId: string;
  workspaceId: string;
  title: string;
  description: string | null;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate: string | null;
  position: number;
  assignee: User | null;
  labels: Label[];
  createdAt: string;
  updatedAt: string;
}

// ─── Label ───────────────────────────────────────────────────────────────────

export interface Label {
  id: string;
  workspaceId: string;
  name: string;
  color: string;
}

// ─── Comment ─────────────────────────────────────────────────────────────────

export interface Comment {
  id: string;
  taskId: string;
  author: User;
  content: string;
  createdAt: string;
  updatedAt: string;
}

// ─── Activity ────────────────────────────────────────────────────────────────

export type ActivityAction =
  | "TASK_CREATED"
  | "TASK_UPDATED"
  | "TASK_DELETED"
  | "COMMENT_ADDED"
  | "MEMBER_ADDED"
  | "MEMBER_REMOVED"
  | "STATUS_CHANGED"
  | "ASSIGNEE_CHANGED";

export interface Activity {
  id: string;
  workspaceId: string;
  projectId: string | null;
  taskId: string | null;
  actor: User;
  action: ActivityAction;
  metadata: Record<string, unknown>;
  createdAt: string;
}

// ─── API response wrappers ───────────────────────────────────────────────────

export interface ApiResponse<T> {
  data: T;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
}
