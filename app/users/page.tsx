"use client";

// app/users/page.tsx
import { useMemo, useState } from "react";
import {
  Users,
  ShieldCheck,
  UserPlus,
  Clock,
  Mail,
  X,
  Check,
  Trash2,
  Power,
  KeyRound,
} from "lucide-react";
import { DashboardShell } from "@/components/DashboardShell";
import { StatCard } from "@/components/StatCard";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Badge } from "@/components/ui/Badge";
import {
  seedUsers,
  roleLabels,
  roleShortLabels,
  roleDescriptions,
  rolePermissions,
  ALL_ROLES,
  ALL_FEATURES,
  featureLabels,
  type AppUser,
  type AppUserStatus,
  type UserRole,
  type AppFeature,
} from "@/lib/users";

const ROLE_OPTIONS = ALL_ROLES.map((r) => ({ value: r, label: roleLabels[r] }));
const STATUS_OPTIONS: { value: AppUserStatus; label: string }[] = [
  { value: "active", label: "Active" },
  { value: "pending", label: "Pending" },
  { value: "inactive", label: "Inactive" },
];

const roleBadgeTone: Record<
  UserRole,
  "blue" | "green" | "purple" | "amber" | "slate"
> = {
  owner_admin: "purple",
  manager: "blue",
  accountant: "green",
  staff: "amber",
  viewer: "slate",
};

const statusBadgeTone: Record<AppUserStatus, "green" | "amber" | "slate"> = {
  active: "green",
  pending: "amber",
  inactive: "slate",
};

const statusLabel: Record<AppUserStatus, string> = {
  active: "Active",
  pending: "Pending",
  inactive: "Inactive",
};

export default function UsersPage() {
  const [users, setUsers] = useState<AppUser[]>(seedUsers);
  const [showForm, setShowForm] = useState(false);

  const total = users.length;
  const active = users.filter((u) => u.status === "active").length;
  const pending = users.filter((u) => u.status === "pending").length;
  const admins = users.filter((u) => u.role === "owner_admin").length;

  function addUser(u: AppUser) {
    setUsers((prev) => [u, ...prev]);
    setShowForm(false);
  }

  function updateRole(id: string, role: UserRole) {
    setUsers((prev) => prev.map((u) => (u.id === id ? { ...u, role } : u)));
  }

  function toggleStatus(id: string) {
    setUsers((prev) =>
      prev.map((u) =>
        u.id === id
          ? { ...u, status: u.status === "active" ? "inactive" : "active" }
          : u
      )
    );
  }

  function removeUser(id: string) {
    setUsers((prev) => prev.filter((u) => u.id !== id));
  }

  return (
    <DashboardShell
      title="User Management"
      subtitle="Manage team members, roles, and access permissions."
    >
      {/* Summary cards */}
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Total Users"
          value={String(total)}
          icon={Users}
          accent="navy"
          delay={0}
        />
        <StatCard
          label="Active Users"
          value={String(active)}
          icon={ShieldCheck}
          accent="green"
          delay={60}
        />
        <StatCard
          label="Pending Invites"
          value={String(pending)}
          icon={Clock}
          accent="sky"
          delay={120}
        />
        <StatCard
          label="Admin Users"
          value={String(admins)}
          icon={KeyRound}
          accent="navy"
          delay={180}
        />
      </div>

      {/* Toolbar */}
      <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="font-display text-xl font-bold text-navy-900 dark:text-white">
            Team Members
          </h3>
          <p className="mt-1 text-base text-slate-500 dark:text-slate-400">
            {total} {total === 1 ? "user" : "users"} in this workspace
          </p>
        </div>
        <Button onClick={() => setShowForm((s) => !s)}>
          <UserPlus className="h-5 w-5" />
          Add User
        </Button>
      </div>

      {showForm && (
        <AddUserForm
          onAdd={addUser}
          onCancel={() => setShowForm(false)}
        />
      )}

      {/* Users table */}
      <div className="mt-6 rounded-2xl border border-slate-200 bg-white shadow-card dark:border-navy-800 dark:bg-navy-900">
        {users.length === 0 ? (
          <div className="flex flex-col items-center justify-center px-6 py-14 text-center">
            <span className="grid h-14 w-14 place-items-center rounded-2xl bg-slate-100 text-slate-400 dark:bg-navy-800 dark:text-slate-500">
              <Users className="h-7 w-7" />
            </span>
            <p className="mt-4 font-display text-lg font-bold text-navy-900 dark:text-white">
              No team members yet
            </p>
            <p className="mt-1.5 max-w-sm text-base text-slate-500 dark:text-slate-400">
              Add your first user to start managing roles and permissions.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[920px] text-lg">
              <thead>
                <tr className="border-b border-slate-200 text-left text-base font-semibold uppercase tracking-wide text-slate-500 dark:border-navy-800 dark:text-slate-400">
                  <th className="px-5 py-5">Name</th>
                  <th className="px-5 py-5">Email</th>
                  <th className="px-5 py-5">Role</th>
                  <th className="px-5 py-5">Status</th>
                  <th className="px-5 py-5">Last Login</th>
                  <th className="px-5 py-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-navy-800">
                {users.map((u) => (
                  <tr
                    key={u.id}
                    className="transition hover:bg-slate-50 dark:hover:bg-navy-800/50"
                  >
                    <td className="px-5 py-5">
                      <div className="flex items-center gap-3.5">
                        <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-navy-800 text-base font-semibold text-white">
                          {u.name
                            .split(" ")
                            .slice(0, 2)
                            .map((w) => w[0])
                            .join("")}
                        </span>
                        <span className="font-medium text-navy-900 dark:text-white">
                          {u.name}
                        </span>
                      </div>
                    </td>
                    <td className="px-5 py-5">
                      <p className="flex items-center gap-1.5 text-base text-slate-500 dark:text-slate-400">
                        <Mail className="h-4 w-4" /> {u.email}
                      </p>
                    </td>
                    <td className="px-5 py-5">
                      <RoleCell
                        role={u.role}
                        onChange={(r) => updateRole(u.id, r)}
                      />
                    </td>
                    <td className="px-5 py-5">
                      <Badge tone={statusBadgeTone[u.status]}>
                        {statusLabel[u.status]}
                      </Badge>
                    </td>
                    <td className="px-5 py-5 text-base text-slate-500 dark:text-slate-400">
                      {u.lastLogin}
                    </td>
                    <td className="px-5 py-5">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => toggleStatus(u.id)}
                          title={
                            u.status === "active" ? "Deactivate" : "Activate"
                          }
                          aria-label={
                            u.status === "active"
                              ? `Deactivate ${u.name}`
                              : `Activate ${u.name}`
                          }
                          className="rounded-lg p-2 text-slate-500 transition hover:bg-slate-100 hover:text-navy-900 dark:text-slate-400 dark:hover:bg-navy-800 dark:hover:text-white"
                        >
                          <Power className="h-5 w-5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => removeUser(u.id)}
                          title="Remove user"
                          aria-label={`Remove ${u.name}`}
                          className="rounded-lg p-2 text-slate-500 transition hover:bg-red-50 hover:text-red-600 dark:text-slate-400 dark:hover:bg-red-500/10 dark:hover:text-red-300"
                        >
                          <Trash2 className="h-5 w-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Role descriptions */}
      <div className="mt-10">
        <div className="mb-5">
          <h3 className="font-display text-xl font-bold text-navy-900 dark:text-white">
            Role descriptions
          </h3>
          <p className="mt-1 text-base text-slate-500 dark:text-slate-400">
            Each role grants a different level of access across the app.
          </p>
        </div>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {ALL_ROLES.map((role) => (
            <div
              key={role}
              className="rounded-2xl border border-slate-200 bg-white p-5 shadow-card dark:border-navy-800 dark:bg-navy-900"
            >
              <div className="flex items-center gap-2.5">
                <Badge tone={roleBadgeTone[role]}>{roleLabels[role]}</Badge>
              </div>
              <p className="mt-3 text-base text-slate-600 dark:text-slate-300">
                {roleDescriptions[role]}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Permission matrix */}
      <div className="mt-10 rounded-2xl border border-slate-200 bg-white shadow-card dark:border-navy-800 dark:bg-navy-900">
        <div className="border-b border-slate-100 px-6 py-5 dark:border-navy-800">
          <h3 className="font-display text-xl font-bold text-navy-900 dark:text-white">
            Permission matrix
          </h3>
          <p className="mt-1 text-base text-slate-500 dark:text-slate-400">
            What each role can do in SmartBooks AI.
          </p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] text-lg">
            <thead>
              <tr className="border-b border-slate-200 text-left text-base font-semibold uppercase tracking-wide text-slate-500 dark:border-navy-800 dark:text-slate-400">
                <th className="px-5 py-5">Feature</th>
                {ALL_ROLES.map((role) => (
                  <th
                    key={role}
                    className="px-5 py-5 text-center"
                    title={roleLabels[role]}
                  >
                    {roleShortLabels[role]}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-navy-800">
              {ALL_FEATURES.map((feature) => (
                <PermissionRow key={feature} feature={feature} />
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardShell>
  );
}

/* ------------------------------------------------------------------ */
/*  Sub-components                                                     */
/* ------------------------------------------------------------------ */

function RoleCell({
  role,
  onChange,
}: {
  role: UserRole;
  onChange: (role: UserRole) => void;
}) {
  return (
    <div className="flex items-center gap-2">
      <Badge tone={roleBadgeTone[role]}>{roleLabels[role]}</Badge>
      <select
        aria-label="Change role"
        value={role}
        onChange={(e) => onChange(e.target.value as UserRole)}
        className="h-9 rounded-lg border border-slate-200 bg-white px-2 text-sm text-slate-600 transition focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-500/20 dark:border-navy-700 dark:bg-navy-950 dark:text-slate-300"
      >
        {ALL_ROLES.map((r) => (
          <option key={r} value={r}>
            {roleLabels[r]}
          </option>
        ))}
      </select>
    </div>
  );
}

function PermissionRow({ feature }: { feature: AppFeature }) {
  return (
    <tr className="transition hover:bg-slate-50 dark:hover:bg-navy-800/50">
      <td className="px-5 py-4 font-medium text-navy-900 dark:text-white">
        {featureLabels[feature]}
      </td>
      {ALL_ROLES.map((role) => {
        const allowed = rolePermissions(role)[feature];
        return (
          <td key={role} className="px-5 py-4 text-center">
            {allowed ? (
              <span
                className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-300"
                title="Allowed"
                aria-label="Allowed"
              >
                <Check className="h-5 w-5" />
              </span>
            ) : (
              <span
                className="text-2xl text-slate-300 dark:text-slate-600"
                title="Not allowed"
                aria-label="Not allowed"
              >
                -
              </span>
            )}
          </td>
        );
      })}
    </tr>
  );
}

function AddUserForm({
  onAdd,
  onCancel,
}: {
  onAdd: (u: AppUser) => void;
  onCancel: () => void;
}) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<UserRole>("staff");
  const [status, setStatus] = useState<AppUserStatus>("pending");
  const [sendInvitation, setSendInvitation] = useState(true);
  const [feedback, setFeedback] = useState<string | null>(null);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) {
      setFeedback("Please enter the user's full name.");
      return;
    }
    if (!email.trim() || !/^\S+@\S+\.\S+$/.test(email)) {
      setFeedback("Please enter a valid email address.");
      return;
    }
    onAdd({
      id: `u_${Date.now()}`,
      name: name.trim(),
      email: email.trim(),
      role,
      status,
      lastLogin: status === "pending" ? "Never" : "Just now",
    });
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="mt-6 animate-fade-up rounded-2xl border border-slate-200 bg-white p-7 shadow-card dark:border-navy-800 dark:bg-navy-900"
    >
      <div className="mb-5 flex items-center justify-between">
        <div>
          <h3 className="font-display text-xl font-bold text-navy-900 dark:text-white">
            Invite a new user
          </h3>
          <p className="mt-1 text-base text-slate-500 dark:text-slate-400">
            Set their role and access level - you can change these later.
          </p>
        </div>
        <button
          type="button"
          onClick={onCancel}
          className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 dark:hover:bg-navy-800"
          aria-label="Close form"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <Input
          id="user-name"
          label="Full name"
          value={name}
          onChange={(e) => {
            setName(e.target.value);
            setFeedback(null);
          }}
          placeholder="Ada Lovelace"
        />
        <Input
          id="user-email"
          type="email"
          label="Email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            setFeedback(null);
          }}
          placeholder="ada@smartbooksai.com"
        />
        <Select
          id="user-role"
          label="Role"
          value={role}
          onChange={(e) => setRole(e.target.value as UserRole)}
          options={ROLE_OPTIONS}
        />
        <Select
          id="user-status"
          label="Status"
          value={status}
          onChange={(e) => setStatus(e.target.value as AppUserStatus)}
          options={STATUS_OPTIONS}
        />
      </div>

      <label className="mt-5 flex items-start gap-3 text-base text-slate-700 dark:text-slate-200">
        <input
          type="checkbox"
          checked={sendInvitation}
          onChange={(e) => setSendInvitation(e.target.checked)}
          className="mt-1 h-5 w-5 rounded border-slate-300 text-sky-500 focus:ring-sky-500/30 dark:border-navy-700 dark:bg-navy-900"
        />
        <span>
          <span className="font-medium">Send invitation email</span>
          <span className="block text-sm text-slate-500 dark:text-slate-400">
            The user receives a magic link to set up their password. (Mock - no
            email is actually sent yet.)
          </span>
        </span>
      </label>

      {feedback && (
        <p
          role="alert"
          className="mt-4 rounded-lg border border-red-200 bg-red-50 px-4 py-2.5 text-base text-red-700 dark:border-red-500/30 dark:bg-red-500/10 dark:text-red-300"
        >
          {feedback}
        </p>
      )}

      <div className="mt-6 flex justify-end gap-3">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">
          <Check className="h-5 w-5" />
          Save user
        </Button>
      </div>
    </form>
  );
}

