import { Hono } from "hono";
import { eq } from "drizzle-orm";
import { workspaceMembers } from "@flowspace/db";
import { requireAuth } from "../middleware/auth.middleware";
import { requireWorkspaceMember } from "../middleware/workspace.middleware";
import type { HonoEnv } from "../types/hono.types";

const memberRoutes = new Hono<HonoEnv>();

memberRoutes.use("/*", requireAuth, requireWorkspaceMember);

// GET /workspaces/:workspaceId/members
memberRoutes.get("/", async (c) => {
  const db = c.get("db");
  const workspaceId = c.get("workspaceId")!;

  const data = await db.query.workspaceMembers.findMany({
    where: eq(workspaceMembers.workspaceId, workspaceId),
    with: { user: true },
  });

  return c.json({ data });
});

// DELETE /workspaces/:workspaceId/members/:memberId
memberRoutes.delete("/:memberId", async (c) => {
  const db = c.get("db");
  const memberId = c.req.param("memberId");

  await db.delete(workspaceMembers).where(eq(workspaceMembers.id, memberId));

  return c.json({ message: "Member removed" });
});

export default memberRoutes;
