import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { eq, and } from "drizzle-orm";
import { tasks } from "@flowspace/db";
import { createTaskSchema, updateTaskSchema } from "@flowspace/validators";
import { requireAuth } from "../middleware/auth.middleware";
import { requireWorkspaceMember } from "../middleware/workspace.middleware";
import type { HonoEnv } from "../types/hono.types";

const taskRoutes = new Hono<HonoEnv>();

taskRoutes.use("/*", requireAuth, requireWorkspaceMember);

// GET /workspaces/:workspaceId/projects/:projectId/tasks
taskRoutes.get("/", async (c) => {
  const db = c.get("db");
  const workspaceId = c.get("workspaceId")!;
  const projectId = c.req.param("projectId");

  const data = await db.query.tasks.findMany({
    where: and(
      eq(tasks.workspaceId, workspaceId),
      eq(tasks.projectId, projectId),
    ),
    with: { assignee: true },
    orderBy: (t, { asc }) => [asc(t.position)],
  });

  return c.json({ data });
});

// POST /workspaces/:workspaceId/projects/:projectId/tasks
taskRoutes.post("/", zValidator("json", createTaskSchema), async (c) => {
  const db = c.get("db");
  const workspaceId = c.get("workspaceId")!;
  const projectId = c.req.param("projectId");
  const body = c.req.valid("json");

  const [task] = await db
    .insert(tasks)
    .values({ ...body, projectId, workspaceId })
    .returning();

  return c.json({ data: task }, 201);
});

// GET /workspaces/:workspaceId/projects/:projectId/tasks/:taskId
taskRoutes.get("/:taskId", async (c) => {
  const db = c.get("db");
  const taskId = c.req.param("taskId");

  const task = await db.query.tasks.findFirst({
    where: eq(tasks.id, taskId),
    with: { assignee: true },
  });

  if (!task) return c.json({ error: "Not found" }, 404);
  return c.json({ data: task });
});

// PATCH /workspaces/:workspaceId/projects/:projectId/tasks/:taskId
taskRoutes.patch(
  "/:taskId",
  zValidator("json", updateTaskSchema),
  async (c) => {
    const db = c.get("db");
    const taskId = c.req.param("taskId");
    const body = c.req.valid("json");

    const [updated] = await db
      .update(tasks)
      .set({ ...body, updatedAt: new Date() })
      .where(eq(tasks.id, taskId))
      .returning();

    return c.json({ data: updated });
  },
);

// DELETE /workspaces/:workspaceId/projects/:projectId/tasks/:taskId
taskRoutes.delete("/:taskId", async (c) => {
  const db = c.get("db");
  const taskId = c.req.param("taskId");

  await db.delete(tasks).where(eq(tasks.id, taskId));
  return c.json({ message: "Task deleted" });
});

export default taskRoutes;
