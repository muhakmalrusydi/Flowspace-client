import { createFileRoute } from "@tanstack/react-router";
import { RegisterPage } from "@/components/common/RegisterPage";

export const Route = createFileRoute("/register")({
  component: RegisterPage,
});
