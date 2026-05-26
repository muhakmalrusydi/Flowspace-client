import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "@flowspace/db";

/**
 * Better Auth instance.
 * Handles session management, OAuth, email/password auth.
 * The auth routes are mounted at /api/auth/* in app.ts.
 */
export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
  }),
  emailAndPassword: {
    enabled: true,
  },
  trustedOrigins: [process.env.BETTER_AUTH_URL ?? "http://localhost:5173"],
  secret: process.env.BETTER_AUTH_SECRET,
});
