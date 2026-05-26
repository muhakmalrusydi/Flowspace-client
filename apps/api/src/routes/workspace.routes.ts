import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { eq } from "drizzle-orm";
import { workspaces, workspaceMembers } from "@flowspace/db";
import {
  createWorkspaceSchema,
  updateWorkspaceSchema,
} from "@flowspace/validators";
import { requireAuth } from "../middleware/auth.middleware";
import { requireWorkspaceMember } from "../middleware/workspace.middleware";
import type { HonoEnv } from "../types/hono.types";

const workspaceRoutes = new Hono<HonoEnv>();

// All workspace routes require authentication
workspaceRoutes.use("/*", requireAuth);

// GET /workspaces — list workspaces the current user belongs to
workspaceRoutes.get("/", async (c) => {
  const db = c.get("db");
  const userId = c.get("userId");

  const memberships = await db.query.workspaceMembers.findMany({
    where: eq(workspaceMembers.userId, userId),
    with: { workspace: true },
  });

  const data = memberships.map((m) => m.workspace);
  return c.json({ data });
});

// POST /workspaces — create a new workspace
workspaceRoutes.post(
  "/",
  zValidator("json", createWorkspaceSchema),
  async (c) => {
    const db = c.get("db");
    const userId = c.get("userId");
    const body = c.req.valid("json");

    const [workspace] = await db
      .insert(workspaces)
      .values({ ...body, ownerId: userId })
      .returning();

    // Add creator as OWNER
    await db.insert(workspaceMembers).values({
      workspaceId: workspace.id,
      userId,
      role: "OWNER",
    });

    return c.json({ data: workspace }, 201);
  },
);

// GET /workspaces/:workspaceId
workspaceRoutes.get("/:workspaceId", requireWorkspaceMember, async (c) => {
  const db = c.get("db");
  const workspaceId = c.get("workspaceId")!;

  const workspace = await db.query.workspaces.findFirst({
    where: eq(workspaces.id, workspaceId),
  });

  if (!workspace) return c.json({ error: "Not found" }, 404);
  return c.json({ data: workspace });
});

// PATCH /workspaces/:workspaceId
workspaceRoutes.patch(
  "/:workspaceId",
  requireWorkspaceMember,
  zValidator("json", updateWorkspaceSchema),
  async (c) => {
    const db = c.get("db");
    const workspaceId = c.get("workspaceId")!;
    const body = c.req.valid("json");

    const [updated] = await db
      .update(workspaces)
      .set({ ...body, updatedAt: new Date() })
      .where(eq(workspaces.id, workspaceId))
      .returning();

    return c.json({ data: updated });
  },
);

// DELETE /workspaces/:workspaceId
workspaceRoutes.delete("/:workspaceId", requireWorkspaceMember, async (c) => {
  const db = c.get("db");
  const workspaceId = c.get("workspaceId")!;

  await db.delete(workspaces).where(eq(workspaces.id, workspaceId));
  return c.json({ message: "Workspace deleted" });
});

export default workspaceRoutes;
