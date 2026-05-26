import { eq, and } from "drizzle-orm";
import { tasks } from "@flowspace/db";
import type { DB } from "@flowspace/db";

/**
 * Task service — reusable task queries.
 */

export async function getTasksByProject(
  db: DB,
  workspaceId: string,
  projectId: string,
) {
  return db.query.tasks.findMany({
    where: and(
      eq(tasks.workspaceId, workspaceId),
      eq(tasks.projectId, projectId),
    ),
    with: { assignee: true },
    orderBy: (t, { asc }) => [asc(t.position)],
  });
}

export async function getTaskById(db: DB, taskId: string) {
  return db.query.tasks.findFirst({
    where: eq(tasks.id, taskId),
    with: { assignee: true },
  });
}
