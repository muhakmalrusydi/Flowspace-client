import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import { db } from "@flowspace/db";
import { errorHandler } from "./middleware/error.middleware";
import authRoutes from "./routes/auth.routes";
import workspaceRoutes from "./routes/workspace.routes";
import projectRoutes from "./routes/project.routes";
import taskRoutes from "./routes/task.routes";
import commentRoutes from "./routes/comment.routes";
import memberRoutes from "./routes/member.routes";
import labelRoutes from "./routes/label.routes";
import activityRoutes from "./routes/activity.routes";
import type { HonoEnv } from "./types/hono.types";

const app = new Hono<HonoEnv>();

// ─── Global middleware ────────────────────────────────────────────────────────

app.use(logger());

app.get("/", (c) => {
  return c.json({
    status: "ok",
    message: "FlowSpace API running",
  });
});

app.use(
  cors({
    origin: process.env.BETTER_AUTH_URL ?? "http://localhost:5173",
    credentials: true,
  }),
);

// Inject db //
app.use(async (c, next) => {
  c.set("db", db);
  await next();
});

// ─── Health check ─────────────────────────────────────────────────────────────

app.get("/health", (c) => c.json({ status: "ok" }));

// ─── Routes ───────────────────────────────────────────────────────────────────

// Better Auth handles all /api/auth/* routes
app.route("/api/auth", authRoutes);

// Workspace-scoped routes
app.route("/api/workspaces", workspaceRoutes);
app.route("/api/workspaces/:workspaceId/projects", projectRoutes);
app.route("/api/workspaces/:workspaceId/projects/:projectId/tasks", taskRoutes);
app.route("/api/workspaces/:workspaceId/tasks/:taskId/comments", commentRoutes);
app.route("/api/workspaces/:workspaceId/members", memberRoutes);
app.route("/api/workspaces/:workspaceId/labels", labelRoutes);
app.route("/api/workspaces/:workspaceId/activity", activityRoutes);

// ─── Error handling ───────────────────────────────────────────────────────────

app.onError(errorHandler);

export default app;
