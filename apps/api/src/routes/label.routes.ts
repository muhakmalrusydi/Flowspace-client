import { Hono } from "hono";
import { z } from "zod";
import { zValidator } from "@hono/zod-validator";
import { eq } from "drizzle-orm";
import { labels } from "@flowspace/db";
import { requireAuth } from "../middleware/auth.middleware";
import { requireWorkspaceMember } from "../middleware/workspace.middleware";
import type { HonoEnv } from "../types/hono.types";

const createLabelSchema = z.object({
  name: z.string().min(1).max(50),
  color: z
    .string()
    .regex(/^#[0-9a-fA-F]{6}$/)
    .default("#6366f1"),
});

const labelRoutes = new Hono<HonoEnv>();

labelRoutes.use("/*", requireAuth, requireWorkspaceMember);

// GET /workspaces/:workspaceId/labels
labelRoutes.get("/", async (c) => {
  const db = c.get("db");
  const workspaceId = c.get("workspaceId")!;

  const data = await db.query.labels.findMany({
    where: eq(labels.workspaceId, workspaceId),
  });

  return c.json({ data });
});

// POST /workspaces/:workspaceId/labels
labelRoutes.post("/", zValidator("json", createLabelSchema), async (c) => {
  const db = c.get("db");
  const workspaceId = c.get("workspaceId")!;
  const body = c.req.valid("json");

  const [label] = await db
    .insert(labels)
    .values({ ...body, workspaceId })
    .returning();

  return c.json({ data: label }, 201);
});

// DELETE /workspaces/:workspaceId/labels/:labelId
labelRoutes.delete("/:labelId", async (c) => {
  const db = c.get("db");
  const labelId = c.req.param("labelId");

  await db.delete(labels).where(eq(labels.id, labelId));
  return c.json({ message: "Label deleted" });
});

export default labelRoutes;
