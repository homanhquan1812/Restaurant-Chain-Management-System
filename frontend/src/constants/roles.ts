export const ROLES = {
  UTOPIA_MANAGER: "UTOPIA Manager",
  BRAND_MANAGER: "Brand Manager",
  BRANCH_MANAGER: "Branch Manager",
  BRANCH_EMPLOYEE: "Branch Employee",
} as const;

export type Role = typeof ROLES[keyof typeof ROLES];
