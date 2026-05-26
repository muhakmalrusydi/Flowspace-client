import { createFileRoute, redirect, Outlet } from "@tanstack/react-router";
import { Dashboard } from "@/components/layout/Dashboard";

/**
 * Authenticated layout route.
 * All child routes under _authenticated/ are protected.
 * Unauthenticated users are redirected to /login.
 *
 * Note: beforeLoad runs before the component renders, so we can
 * redirect before any authenticated UI is shown.
 */
export const Route = createFileRoute("/_authenticated")({
  beforeLoad: async ({ context }) => {
    const ctx = context as { isAuthenticated?: boolean; isLoading?: boolean };
    // If auth is still loading, let it through — AuthProvider handles the loading state
    if (!ctx.isLoading && !ctx.isAuthenticated) {
      throw redirect({ to: "/login" });
    }
  },
  component: () => (
    <Dashboard>
      <Outlet />
    </Dashboard>
  ),
});
