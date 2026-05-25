// lib/notifications.ts
// Mock notifications shown in the Header dropdown.

export type NotificationType =
  | "receipt"
  | "report"
  | "tax"
  | "user"
  | "insight";

export type NotificationStatus = "read" | "unread";

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  type: NotificationType;
  status: NotificationStatus;
  /** Human-friendly relative time, e.g. "10 minutes ago". */
  time: string;
}

export const mockNotifications: AppNotification[] = [
  {
    id: "n_001",
    title: "Receipt needs review",
    message: "A newly uploaded receipt requires manual verification.",
    type: "receipt",
    status: "unread",
    time: "10 minutes ago",
  },
  {
    id: "n_002",
    title: "Monthly report ready",
    message: "Your financial report for the selected period is ready.",
    type: "report",
    status: "unread",
    time: "1 hour ago",
  },
  {
    id: "n_003",
    title: "Tax reminder",
    message: "A tax payment deadline is approaching.",
    type: "tax",
    status: "unread",
    time: "Today",
  },
  {
    id: "n_004",
    title: "User invitation pending",
    message: "Demo Assistant has not accepted the invitation yet.",
    type: "user",
    status: "read",
    time: "Yesterday",
  },
  {
    id: "n_005",
    title: "High expense alert",
    message: "Expenses increased compared to the previous period.",
    type: "insight",
    status: "read",
    time: "2 days ago",
  },
];

export function getUnreadNotificationsCount(
  notifications: AppNotification[]
): number {
  return notifications.filter((n) => n.status === "unread").length;
}

export function markAllNotificationsAsRead(
  notifications: AppNotification[]
): AppNotification[] {
  return notifications.map((n) =>
    n.status === "unread" ? { ...n, status: "read" } : n
  );
}

export function markOneNotificationAsRead(
  notifications: AppNotification[],
  id: string
): AppNotification[] {
  return notifications.map((n) =>
    n.id === id ? { ...n, status: "read" } : n
  );
}

/** Lucide icon name + brand-friendly tint for each notification type. */
export const notificationTypeStyle: Record<
  NotificationType,
  { iconClass: string; bgClass: string }
> = {
  receipt: {
    iconClass: "text-sky-600 dark:text-sky-300",
    bgClass: "bg-sky-50 dark:bg-sky-500/10",
  },
  report: {
    iconClass: "text-navy-700 dark:text-sky-200",
    bgClass: "bg-navy-100 dark:bg-navy-700/30",
  },
  tax: {
    iconClass: "text-amber-600 dark:text-amber-300",
    bgClass: "bg-amber-50 dark:bg-amber-500/10",
  },
  user: {
    iconClass: "text-violet-600 dark:text-violet-300",
    bgClass: "bg-violet-50 dark:bg-violet-500/10",
  },
  insight: {
    iconClass: "text-emerald-600 dark:text-emerald-300",
    bgClass: "bg-emerald-50 dark:bg-emerald-500/10",
  },
};
