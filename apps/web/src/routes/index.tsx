import { createFileRoute, redirect } from "@tanstack/react-router";

/**
 * Root index — redirects authenticated users to their first workspace,
 * or to /login if not authenticated.
 * The actual redirect logic lives in _authenticated.tsx's beforeLoad.
 */
export const Route = createFileRoute("/")({
  component: () => null,
  beforeLoad: () => {
    // Redirect to login by default; _authenticated layout handles auth check
    throw redirect({ to: "/login" });
  },
});
