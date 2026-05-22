// lib/users.ts
// User Management - roles, permissions, and seed data.
//
// This file is the single source of truth for team members shown on the
// Users page. To add a new role, update `UserRole`, `roleLabels`,
// `roleDescriptions` and `permissionMatrix`.

export type UserRole =
  | "owner_admin"
  | "manager"
  | "accountant"
  | "staff"
  | "viewer";

export type AppUserStatus = "active" | "pending" | "inactive";

export interface AppUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  status: AppUserStatus;
  /** Human-friendly label (e.g. "Today", "2 days ago", "Never"). */
  lastLogin: string;
}

/** Ordered list of roles for the role selector and the permission matrix. */
export const ALL_ROLES: UserRole[] = [
  "owner_admin",
  "manager",
  "accountant",
  "staff",
  "viewer",
];

export const roleLabels: Record<UserRole, string> = {
  owner_admin: "Owner / Admin",
  manager: "Manager",
  accountant: "Accountant",
  staff: "Staff / Assistant",
  viewer: "Viewer",
};

export const roleShortLabels: Record<UserRole, string> = {
  owner_admin: "Admin",
  manager: "Manager",
  accountant: "Accountant",
  staff: "Staff",
  viewer: "Viewer",
};

export const roleDescriptions: Record<UserRole, string> = {
  owner_admin:
    "Full access to all features, settings, reports, and user management.",
  manager:
    "Can view dashboard, manage clients, review reports, and monitor transactions.",
  accountant:
    "Can manage transactions, receipts, financial reports, and exports.",
  staff: "Can upload receipts and add basic transactions.",
  viewer: "Can only view dashboard and reports.",
};

export type AppFeature =
  | "dashboard"
  | "transactions"
  | "receipts"
  | "reports"
  | "clients"
  | "users"
  | "settings"
  | "export";

/** Ordered list used to render the permission matrix table. */
export const ALL_FEATURES: AppFeature[] = [
  "dashboard",
  "transactions",
  "receipts",
  "reports",
  "clients",
  "users",
  "settings",
  "export",
];

export const featureLabels: Record<AppFeature, string> = {
  dashboard: "Dashboard",
  transactions: "Transactions",
  receipts: "Receipts",
  reports: "Reports",
  clients: "Clients",
  users: "User Management",
  settings: "Settings",
  export: "Export PDF / Excel",
};

/**
 * Static permission matrix used by `canAccessFeature` and rendered as a
 * visible table on the Users page.
 */
const permissionMatrix: Record<UserRole, Record<AppFeature, boolean>> = {
  owner_admin: {
    dashboard: true,
    transactions: true,
    receipts: true,
    reports: true,
    clients: true,
    users: true,
    settings: true,
    export: true,
  },
  manager: {
    dashboard: true,
    transactions: true,
    receipts: true,
    reports: true,
    clients: true,
    users: false,
    settings: false,
    export: true,
  },
  accountant: {
    dashboard: true,
    transactions: true,
    receipts: true,
    reports: true,
    clients: false,
    users: false,
    settings: false,
    export: true,
  },
  staff: {
    dashboard: true,
    transactions: true,
    receipts: true,
    reports: false,
    clients: false,
    users: false,
    settings: false,
    export: false,
  },
  viewer: {
    dashboard: true,
    transactions: false,
    receipts: false,
    reports: true,
    clients: false,
    users: false,
    settings: false,
    export: false,
  },
};

/** Returns whether a role can access a given feature. */
export function canAccessFeature(role: UserRole, feature: AppFeature): boolean {
  return permissionMatrix[role]?.[feature] ?? false;
}

/** Returns the full row of permissions for a given role. */
export function rolePermissions(role: UserRole): Record<AppFeature, boolean> {
  return permissionMatrix[role];
}

/** Seed data shown on the Users page. */
export const seedUsers: AppUser[] = [
  {
    id: "u_001",
    name: "Gilda Cruz",
    email: "sv25.0091@iscee.edu.cv",
    role: "owner_admin",
    status: "active",
    lastLogin: "Today",
  },
  {
    id: "u_002",
    name: "Demo Accountant",
    email: "accountant@smartbooksai.com",
    role: "accountant",
    status: "active",
    lastLogin: "2 days ago",
  },
  {
    id: "u_003",
    name: "Demo Manager",
    email: "manager@smartbooksai.com",
    role: "manager",
    status: "active",
    lastLogin: "5 days ago",
  },
  {
    id: "u_004",
    name: "Demo Assistant",
    email: "assistant@smartbooksai.com",
    role: "staff",
    status: "pending",
    lastLogin: "Never",
  },
];
