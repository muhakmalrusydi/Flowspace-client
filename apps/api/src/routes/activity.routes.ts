import { Hono } from "hono";
import { requireAuth } from "../middleware/auth.middleware";
import { requireWorkspaceMember } from "../middleware/workspace.middleware";
import type { HonoEnv } from "../types/hono.types";

const activityRoutes = new Hono<HonoEnv>();

activityRoutes.use("/*", requireAuth, requireWorkspaceMember);

// GET /workspaces/:workspaceId/activity
// Returns recent activity for the workspace
activityRoutes.get("/", async (c) => {
  // TODO: query activities table once schema is added
  return c.json({ data: [] });
});

export default activityRoutes;
