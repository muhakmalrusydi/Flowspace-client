import { createContext, useContext } from "react";
import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import { queryKeys } from "@/lib/query-keys";
import type { User } from "@flowspace/types";

// ─── Context ─────────────────────────────────────────────────────────────────

interface AuthContextValue {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextValue | null>(null);

// ─── Provider ─────────────────────────────────────────────────────────────────

/**
 * Fetches the current session on mount and makes the user available
 * throughout the app via useAuthContext().
 */
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { data, isLoading } = useQuery({
    queryKey: queryKeys.auth.session(),
    queryFn: () =>
      apiClient
        .get<{ user: User | null }>("/api/auth/get-session")
        .catch(() => ({ user: null })),
  });

  return (
    <AuthContext.Provider
      value={{
        user: data?.user ?? null,
        isLoading,
        isAuthenticated: !!data?.user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useAuthContext() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuthContext must be used within AuthProvider");
  return ctx;
}
