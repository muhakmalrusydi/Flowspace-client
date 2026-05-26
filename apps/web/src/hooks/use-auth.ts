import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "@tanstack/react-router";
import { apiClient } from "@/lib/api-client";
import { queryKeys } from "@/lib/query-keys";
import { useAuthContext } from "@/providers/AuthProvider";
import type { LoginInput, RegisterInput } from "@flowspace/validators";

/**
 * Exposes the current auth state and sign-in / sign-up / sign-out mutations.
 */
export function useAuth() {
  const { user, isLoading, isAuthenticated } = useAuthContext();
  const queryClient = useQueryClient();
  const router = useRouter();

  const signIn = useMutation({
    mutationFn: (data: LoginInput) =>
      apiClient.post("/api/auth/sign-in/email", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.auth.session() });
      router.navigate({ to: "/" });
    },
  });

  const signUp = useMutation({
    mutationFn: (data: RegisterInput) =>
      apiClient.post("/api/auth/sign-up/email", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.auth.session() });
      router.navigate({ to: "/" });
    },
  });

  const signOut = useMutation({
    mutationFn: () => apiClient.post("/api/auth/sign-out", {}),
    onSuccess: () => {
      queryClient.clear();
      router.navigate({ to: "/login" });
    },
  });

  return { user, isLoading, isAuthenticated, signIn, signUp, signOut };
}
