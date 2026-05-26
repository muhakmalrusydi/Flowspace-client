import type { DB } from "@flowspace/db";

// ─── Hono context variables ──────────────────────────────────────────────────
// These are injected by middleware and available in all route handlers via c.var

export type HonoVariables = {
  db: DB;
  userId: string;
  workspaceId?: string;
};

export type HonoEnv = {
  Variables: HonoVariables;
};
