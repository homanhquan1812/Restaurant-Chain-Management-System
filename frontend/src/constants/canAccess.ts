import { PERMISSIONS } from "./permissions";
import type { Role } from "./roles";

export const canAccessRoute = (role: Role, path: string): boolean => {
  const allowedRoles = PERMISSIONS[path];
  return allowedRoles?.includes(role) ?? false;
};
