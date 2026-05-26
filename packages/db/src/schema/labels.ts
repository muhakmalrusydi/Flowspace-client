import { pgTable, text } from "drizzle-orm/pg-core";
import { workspaces } from "./workspaces";

export const labels = pgTable("labels", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  workspaceId: text("workspace_id")
    .notNull()
    .references(() => workspaces.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  color: text("color").notNull().default("#6366f1"),
});
