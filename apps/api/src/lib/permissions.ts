import type { Role } from "@flowspace/types";

// ─── Role hierarchy ──────────────────────────────────────────────────────────
// Higher index = more permissions
const ROLE_HIERARCHY: Role[] = ["VIEWER", "MEMBER", "ADMIN", "OWNER"];

/**
 * Returns true if `userRole` has at least the permissions of `requiredRole`.
 */
export function hasPermission(userRole: Role, requiredRole: Role): boolean {
  return (
    ROLE_HIERARCHY.indexOf(userRole) >= ROLE_HIERARCHY.indexOf(requiredRole)
  );
}

/**
 * Returns true if the user can manage workspace settings (ADMIN or OWNER).
 */
export function canManageWorkspace(role: Role): boolean {
  return hasPermission(role, "ADMIN");
}

/**
 * Returns true if the user can delete the workspace (OWNER only).
 */
export function canDeleteWorkspace(role: Role): boolean {
  return role === "OWNER";
}
