import type { MiddlewareHandler } from "hono";
import { HTTPException } from "hono/http-exception";
import { auth } from "../lib/auth";
import type { HonoEnv } from "../types/hono.types";

/**
 * Validates the session cookie / Bearer token via Better Auth.
 * Injects `userId` into context variables.
 * Throws 401 if the session is missing or invalid.
 */
export const requireAuth: MiddlewareHandler<HonoEnv> = async (c, next) => {
  const session = await auth.api.getSession({ headers: c.req.raw.headers });

  if (!session?.user) {
    throw new HTTPException(401, { message: "Unauthorized" });
  }

  c.set("userId", session.user.id);
  await next();
};
