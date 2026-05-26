import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";

import * as workspacesSchema from "./schema/workspaces";
import * as projectsSchema from "./schema/projects";
import * as usersSchema from "./schema/users";
import * as tasksSchema from "./schema/tasks";
import * as commentsSchema from "./schema/comments";
import * as labelsSchema from "./schema/labels";
import * as authSchema from "./schema/auth";

// re-export schema
export * from "./schema/workspaces";
export * from "./schema/projects";
export * from "./schema/users";
export * from "./schema/tasks";
export * from "./schema/comments";
export * from "./schema/labels";
export * from "./schema/auth";

// gabungkan semua schema
const schema = {
  ...workspacesSchema,
  ...projectsSchema,
  ...usersSchema,
  ...tasksSchema,
  ...commentsSchema,
  ...labelsSchema,
  ...authSchema,
};

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export const db = drizzle(pool, { schema });

export type DB = typeof db;
