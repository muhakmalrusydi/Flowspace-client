import type { MiddlewareHandler } from "hono";
import { HTTPException } from "hono/http-exception";
import { eq, and } from "drizzle-orm";
import { workspaceMembers } from "@flowspace/db";
import type { HonoEnv } from "../types/hono.types";

/**
 * Verifies the current user is a member of the workspace specified in :workspaceId.
 * Must be used after requireAuth middleware.
 * Injects `workspaceId` into context variables.
 */
export const requireWorkspaceMember: MiddlewareHandler<HonoEnv> = async (
  c,
  next,
) => {
  const workspaceId = c.req.param("workspaceId");
  const userId = c.get("userId");
  const db = c.get("db");

  if (!workspaceId) {
    throw new HTTPException(400, { message: "workspaceId is required" });
  }

  const member = await db.query.workspaceMembers.findFirst({
    where: and(
      eq(workspaceMembers.workspaceId, workspaceId),
      eq(workspaceMembers.userId, userId),
    ),
  });

  if (!member) {
    throw new HTTPException(403, {
      message: "You are not a member of this workspace",
    });
  }

  c.set("workspaceId", workspaceId);
  await next();
};
