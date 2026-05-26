import { Hono } from "hono";
import { z } from "zod";
import { zValidator } from "@hono/zod-validator";
import { eq } from "drizzle-orm";
import { comments } from "@flowspace/db";
import { requireAuth } from "../middleware/auth.middleware";
import { requireWorkspaceMember } from "../middleware/workspace.middleware";
import type { HonoEnv } from "../types/hono.types";

const commentSchema = z.object({
  content: z.string().min(1).max(5000),
});

const commentRoutes = new Hono<HonoEnv>();

commentRoutes.use("/*", requireAuth, requireWorkspaceMember);

// GET /workspaces/:workspaceId/tasks/:taskId/comments
commentRoutes.get("/", async (c) => {
  const db = c.get("db");
  const taskId = c.req.param("taskId");

  const data = await db.query.comments.findMany({
    where: eq(comments.taskId, taskId),
    with: { author: true },
    orderBy: (c, { asc }) => [asc(c.createdAt)],
  });

  return c.json({ data });
});

// POST /workspaces/:workspaceId/tasks/:taskId/comments
commentRoutes.post("/", zValidator("json", commentSchema), async (c) => {
  const db = c.get("db");
  const userId = c.get("userId");
  const taskId = c.req.param("taskId");
  const { content } = c.req.valid("json");

  const [comment] = await db
    .insert(comments)
    .values({ taskId, authorId: userId, content })
    .returning();

  return c.json({ data: comment }, 201);
});

// DELETE /workspaces/:workspaceId/tasks/:taskId/comments/:commentId
commentRoutes.delete("/:commentId", async (c) => {
  const db = c.get("db");
  const commentId = c.req.param("commentId");

  await db.delete(comments).where(eq(comments.id, commentId));
  return c.json({ message: "Comment deleted" });
});

export default commentRoutes;
