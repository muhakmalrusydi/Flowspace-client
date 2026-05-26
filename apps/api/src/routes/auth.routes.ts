import { Hono } from "hono";
import { auth } from "../lib/auth";

/**
 * All Better Auth routes are handled here.
 * Better Auth exposes a fetch handler that Hono delegates to.
 * Routes: POST /sign-in/email, POST /sign-up/email, POST /sign-out, GET /session, etc.
 */
const authRoutes = new Hono();

authRoutes.on(["GET", "POST"], "/**", (c) => {
  return auth.handler(c.req.raw);
});

export default authRoutes;
