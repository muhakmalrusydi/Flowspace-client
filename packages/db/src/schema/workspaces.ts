import { pgTable, text, timestamp, pgEnum } from "drizzle-orm/pg-core";
import { users } from "./users";

export const roleEnum = pgEnum("role", ["OWNER", "ADMIN", "MEMBER", "VIEWER"]);

// TABLE: workspaces
export const workspaces = pgTable("workspaces", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),

  name: text("name").notNull(),

  slug: text("slug").notNull().unique(),

  logoUrl: text("logo_url"),

  ownerId: text("owner_id")
    .notNull()
    .references(() => users.id, {
      onDelete: "cascade",
    }),

  createdAt: timestamp("created_at", {
    withTimezone: true,
  })
    .notNull()
    .defaultNow(),

  updatedAt: timestamp("updated_at", {
    withTimezone: true,
  })
    .notNull()
    .defaultNow(),
});

// TABLE: workspace_members
export const workspaceMembers = pgTable("workspace_members", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),

  workspaceId: text("workspace_id")
    .notNull()
    .references(() => workspaces.id, {
      onDelete: "cascade",
    }),

  userId: text("user_id")
    .notNull()
    .references(() => users.id, {
      onDelete: "cascade",
    }),

  role: roleEnum("role").notNull().default("MEMBER"),

  joinedAt: timestamp("joined_at", {
    withTimezone: true,
  })
    .notNull()
    .defaultNow(),
});
