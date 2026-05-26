import { eq } from "drizzle-orm";
import { workspaces, workspaceMembers } from "@flowspace/db";
import type { DB } from "@flowspace/db";

/**
 * Workspace service — thin layer for reusable workspace queries.
 * Keep this simple. Only extract logic here when it's shared across routes.
 */

export async function getWorkspacesByUser(db: DB, userId: string) {
  const memberships = await db.query.workspaceMembers.findMany({
    where: eq(workspaceMembers.userId, userId),
    with: { workspace: true },
  });
  return memberships.map((m) => m.workspace);
}

export async function getWorkspaceById(db: DB, workspaceId: string) {
  return db.query.workspaces.findFirst({
    where: eq(workspaces.id, workspaceId),
  });
}
