import { createFileRoute, redirect } from "@tanstack/react-router";
import { LoginPage } from "@/components/common/LoginPage";

export const Route = createFileRoute("/login")({
  // If already authenticated, skip the login page
  beforeLoad: ({ context }) => {
    if ((context as { isAuthenticated?: boolean }).isAuthenticated) {
      throw redirect({ to: "/" });
    }
  },
  component: LoginPage,
});
