import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { eq } from "drizzle-orm";
import { projects } from "@flowspace/db";
import {
  createProjectSchema,
  updateProjectSchema,
} from "@flowspace/validators";
import { requireAuth } from "../middleware/auth.middleware";
import { requireWorkspaceMember } from "../middleware/workspace.middleware";
import type { HonoEnv } from "../types/hono.types";

const projectRoutes = new Hono<HonoEnv>();

projectRoutes.use("/*", requireAuth, requireWorkspaceMember);

// GET /workspaces/:workspaceId/projects
projectRoutes.get("/", async (c) => {
  const db = c.get("db");
  const workspaceId = c.get("workspaceId")!;

  const data = await db.query.projects.findMany({
    where: eq(projects.workspaceId, workspaceId),
  });

  return c.json({ data });
});

// POST /workspaces/:workspaceId/projects
projectRoutes.post("/", zValidator("json", createProjectSchema), async (c) => {
  const db = c.get("db");
  const workspaceId = c.get("workspaceId")!;
  const body = c.req.valid("json");

  const [project] = await db
    .insert(projects)
    .values({ ...body, workspaceId })
    .returning();

  return c.json({ data: project }, 201);
});

// GET /workspaces/:workspaceId/projects/:projectId
projectRoutes.get("/:projectId", async (c) => {
  const db = c.get("db");
  const projectId = c.req.param("projectId");

  const project = await db.query.projects.findFirst({
    where: eq(projects.id, projectId),
  });

  if (!project) return c.json({ error: "Not found" }, 404);
  return c.json({ data: project });
});

// PATCH /workspaces/:workspaceId/projects/:projectId
projectRoutes.patch(
  "/:projectId",
  zValidator("json", updateProjectSchema),
  async (c) => {
    const db = c.get("db");
    const projectId = c.req.param("projectId");
    const body = c.req.valid("json");

    const [updated] = await db
      .update(projects)
      .set({ ...body, updatedAt: new Date() })
      .where(eq(projects.id, projectId))
      .returning();

    return c.json({ data: updated });
  },
);

// DELETE /workspaces/:workspaceId/projects/:projectId
projectRoutes.delete("/:projectId", async (c) => {
  const db = c.get("db");
  const projectId = c.req.param("projectId");

  await db.delete(projects).where(eq(projects.id, projectId));
  return c.json({ message: "Project deleted" });
});

export default projectRoutes;
