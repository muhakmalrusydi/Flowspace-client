import type { Context } from "hono";
import { HTTPException } from "hono/http-exception";
import { ZodError } from "zod";

/**
 * Global error handler for Hono.
 * Register this with app.onError(errorHandler).
 */
export function errorHandler(err: Error, c: Context) {
  // Zod validation errors → 400
  if (err instanceof ZodError) {
    return c.json(
      {
        error: "Validation failed",
        issues: err.flatten().fieldErrors,
      },
      400,
    );
  }

  // Hono HTTP exceptions (thrown with `throw new HTTPException(...)`)
  if (err instanceof HTTPException) {
    return c.json({ error: err.message }, err.status);
  }

  // Unexpected errors → 500
  console.error("[error]", err);
  return c.json({ error: "Internal server error" }, 500);
}
