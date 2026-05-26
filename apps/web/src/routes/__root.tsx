import { createRootRoute, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/router-devtools";
import { QueryProvider } from "@/providers/QueryProvider";
import { AuthProvider } from "@/providers/AuthProvider";

/**
 * Root route — wraps the entire app with global providers.
 * All other routes render inside <Outlet />.
 */
export const Route = createRootRoute({
  component: () => (
    <QueryProvider>
      <AuthProvider>
        <Outlet />
        {import.meta.env.DEV && <TanStackRouterDevtools />}
      </AuthProvider>
    </QueryProvider>
  ),
});
