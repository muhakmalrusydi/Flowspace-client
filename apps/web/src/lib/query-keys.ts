// ─── TanStack Query key factory ──────────────────────────────────────────────
// Centralised key definitions prevent typos and make cache invalidation easy.
// Usage: queryClient.invalidateQueries({ queryKey: queryKeys.tasks.all(wsId, projId) })

export const queryKeys = {
  auth: {
    session: () => ["auth", "session"] as const,
  },

  workspaces: {
    all: () => ["workspaces"] as const,
    detail: (workspaceId: string) => ["workspaces", workspaceId] as const,
    members: (workspaceId: string) =>
      ["workspaces", workspaceId, "members"] as const,
    labels: (workspaceId: string) =>
      ["workspaces", workspaceId, "labels"] as const,
    activity: (workspaceId: string) =>
      ["workspaces", workspaceId, "activity"] as const,
  },

  projects: {
    all: (workspaceId: string) =>
      ["workspaces", workspaceId, "projects"] as const,
    detail: (workspaceId: string, projectId: string) =>
      ["workspaces", workspaceId, "projects", projectId] as const,
  },

  tasks: {
    all: (workspaceId: string, projectId: string) =>
      ["workspaces", workspaceId, "projects", projectId, "tasks"] as const,
    detail: (workspaceId: string, projectId: string, taskId: string) =>
      [
        "workspaces",
        workspaceId,
        "projects",
        projectId,
        "tasks",
        taskId,
      ] as const,
    comments: (taskId: string) => ["tasks", taskId, "comments"] as const,
  },
};
