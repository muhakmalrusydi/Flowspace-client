import { pgTable, text, timestamp } from "drizzle-orm/pg-core";

// Better Auth manages the core auth tables (user, session, account, verification).
// This table extends the user with app-specific profile fields.
export const users = pgTable("users", {
  id: text("id").primaryKey(), // matches Better Auth user id
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  avatarUrl: text("avatar_url"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});
