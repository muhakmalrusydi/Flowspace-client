import type { DB } from "@flowspace/db";
import type { ActivityAction } from "@flowspace/types";

interface LogActivityParams {
  db: DB;
  workspaceId: string;
  actorId: string;
  action: ActivityAction;
  projectId?: string;
  taskId?: string;
  metadata?: Record<string, unknown>;
}

/**
 * Logs an activity event to the database.
 * Call this after any significant state change (task created, member added, etc.)
 */
export async function logActivity({
  db,
  workspaceId,
  actorId,
  action,
  projectId,
  taskId,
  metadata = {},
}: LogActivityParams): Promise<void> {
  // TODO: insert into activities table once schema is added
  // For now, just log to console in development
  if (process.env.NODE_ENV === "development") {
    console.log("[activity]", {
      workspaceId,
      actorId,
      action,
      projectId,
      taskId,
      metadata,
    });
  }
}
