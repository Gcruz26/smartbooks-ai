"use client";

// components/Header.tsx
import { useEffect, useRef, useState } from "react";
import {
  Menu,
  Search,
  Bell,
  Moon,
  Sun,
  ReceiptText,
  FileBarChart,
  AlertTriangle,
  UserPlus,
  TrendingUp,
  CheckCheck,
} from "lucide-react";
import { useTheme } from "@/components/ThemeProvider";
import { currentUser } from "@/lib/mockData";
import {
  mockNotifications,
  getUnreadNotificationsCount,
  markAllNotificationsAsRead,
  markOneNotificationAsRead,
  notificationTypeStyle,
  type AppNotification,
  type NotificationType,
} from "@/lib/notifications";

interface HeaderProps {
  title: string;
  subtitle?: string;
  onMenuClick: () => void;
}

const TYPE_ICONS: Record<NotificationType, typeof Bell> = {
  receipt: ReceiptText,
  report: FileBarChart,
  tax: AlertTriangle,
  user: UserPlus,
  insight: TrendingUp,
};

export function Header({ title, subtitle, onMenuClick }: HeaderProps) {
  const { theme, toggleTheme } = useTheme();
  const [notifications, setNotifications] =
    useState<AppNotification[]>(mockNotifications);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const unreadCount = getUnreadNotificationsCount(notifications);

  // Close the dropdown when clicking outside or pressing Escape.
  useEffect(() => {
    if (!dropdownOpen) return;
    function onDocClick(e: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setDropdownOpen(false);
      }
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setDropdownOpen(false);
    }
    document.addEventListener("mousedown", onDocClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDocClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [dropdownOpen]);

  function handleMarkAllAsRead() {
    setNotifications((prev) => markAllNotificationsAsRead(prev));
  }

  function handleMarkOneAsRead(id: string) {
    setNotifications((prev) => markOneNotificationAsRead(prev, id));
  }

  return (
    <header className="sticky top-0 z-20 flex h-24 items-center gap-3 border-b border-slate-200 bg-white/85 px-5 backdrop-blur-md dark:border-navy-800 dark:bg-navy-950/85 sm:gap-4 lg:px-10">
      <button
        onClick={onMenuClick}
        className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-navy-800 lg:hidden"
        aria-label="Open menu"
      >
        <Menu className="h-6 w-6" />
      </button>

      <div className="min-w-0 flex-1">
        <h1 className="font-display text-3xl font-bold leading-tight text-navy-900 dark:text-white sm:text-4xl">
          {title}
        </h1>
        {subtitle && (
          <p className="hidden text-base text-slate-500 dark:text-slate-400 sm:block">
            {subtitle}
          </p>
        )}
      </div>

      {/* Search (desktop) */}
      <div className="relative hidden lg:block">
        <Search className="pointer-events-none absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
        <input
          type="search"
          placeholder="Search..."
          aria-label="Search"
          className="h-12 w-56 rounded-xl border border-slate-200 bg-slate-50 pl-11 pr-4 text-base text-navy-900 placeholder:text-slate-400 focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-500/20 dark:border-navy-700 dark:bg-navy-900 dark:text-slate-100"
        />
      </div>

      <button
        onClick={toggleTheme}
        className="rounded-xl p-3 text-slate-600 transition hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-navy-800"
        aria-label="Toggle dark mode"
      >
        {theme === "dark" ? (
          <Sun className="h-5 w-5" />
        ) : (
          <Moon className="h-5 w-5" />
        )}
      </button>

      {/* Notification bell + dropdown */}
      <div
        ref={dropdownRef}
        className="relative hidden sm:inline-flex"
      >
        <button
          type="button"
          onClick={() => setDropdownOpen((s) => !s)}
          aria-label="Notifications"
          aria-haspopup="true"
          aria-expanded={dropdownOpen}
          className="relative rounded-xl p-3 text-slate-600 transition hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-navy-800"
        >
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <span
              className="absolute right-2.5 top-2.5 inline-flex h-4 min-w-[1rem] items-center justify-center rounded-full bg-sky-500 px-1 text-[10px] font-bold text-white ring-2 ring-white dark:ring-navy-950"
              aria-label={`${unreadCount} unread notifications`}
            >
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          )}
        </button>

        {dropdownOpen && (
          <NotificationsPanel
            notifications={notifications}
            unreadCount={unreadCount}
            onMarkAllRead={handleMarkAllAsRead}
            onMarkOneRead={handleMarkOneAsRead}
            onClose={() => setDropdownOpen(false)}
          />
        )}
      </div>

      <div className="flex items-center gap-3">
        <div
          className="grid h-12 w-12 place-items-center rounded-full bg-navy-800 text-lg font-semibold text-white"
          aria-hidden
        >
          {currentUser.name
            .split(" ")
            .map((n) => n[0])
            .join("")}
        </div>
        <div className="hidden leading-tight md:block">
          <p className="text-lg font-semibold text-navy-900 dark:text-white">
            {currentUser.name}
          </p>
          <p className="text-base text-slate-500 dark:text-slate-400">
            {currentUser.role}
          </p>
        </div>
      </div>
    </header>
  );
}

/* ------------------------------------------------------------------ */
/*  Dropdown panel                                                      */
/* ------------------------------------------------------------------ */

interface NotificationsPanelProps {
  notifications: AppNotification[];
  unreadCount: number;
  onMarkAllRead: () => void;
  onMarkOneRead: (id: string) => void;
  onClose: () => void;
}

function NotificationsPanel({
  notifications,
  unreadCount,
  onMarkAllRead,
  onMarkOneRead,
  onClose,
}: NotificationsPanelProps) {
  return (
    <div
      role="dialog"
      aria-label="Notifications"
      className="animate-fade-in absolute right-0 top-full z-50 mt-2 w-[22rem] max-w-[calc(100vw-2rem)] origin-top-right overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-card-hover dark:border-navy-800 dark:bg-navy-900 sm:w-[24rem]"
    >
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4 dark:border-navy-800">
        <div>
          <p className="font-display text-lg font-bold text-navy-900 dark:text-white">
            Notifications
          </p>
          <p className="mt-0.5 text-sm text-slate-500 dark:text-slate-400">
            {unreadCount > 0
              ? `${unreadCount} unread`
              : "You're all caught up"}
          </p>
        </div>
        {unreadCount > 0 && (
          <button
            type="button"
            onClick={onMarkAllRead}
            className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-sm font-semibold text-sky-700 transition hover:bg-sky-50 dark:text-sky-300 dark:hover:bg-sky-500/10"
          >
            <CheckCheck className="h-4 w-4" />
            Mark all as read
          </button>
        )}
      </div>

      {/* List */}
      {notifications.length === 0 ? (
        <div className="px-6 py-10 text-center">
          <span className="mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-slate-100 text-slate-400 dark:bg-navy-800 dark:text-slate-500">
            <Bell className="h-6 w-6" />
          </span>
          <p className="mt-3 text-base font-medium text-navy-900 dark:text-white">
            No notifications at the moment.
          </p>
        </div>
      ) : (
        <ul className="max-h-[24rem] overflow-y-auto divide-y divide-slate-100 dark:divide-navy-800">
          {notifications.map((n) => {
            const Icon = TYPE_ICONS[n.type];
            const tint = notificationTypeStyle[n.type];
            const isUnread = n.status === "unread";
            return (
              <li key={n.id}>
                <button
                  type="button"
                  onClick={() => onMarkOneRead(n.id)}
                  className={
                    "flex w-full items-start gap-3 px-5 py-4 text-left transition " +
                    (isUnread
                      ? "bg-sky-50/40 hover:bg-sky-50 dark:bg-sky-500/5 dark:hover:bg-sky-500/10"
                      : "hover:bg-slate-50 dark:hover:bg-navy-800/60")
                  }
                >
                  <span
                    className={
                      "grid h-10 w-10 shrink-0 place-items-center rounded-xl " +
                      tint.bgClass +
                      " " +
                      tint.iconClass
                    }
                  >
                    <Icon className="h-5 w-5" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <p
                        className={
                          "truncate text-base " +
                          (isUnread
                            ? "font-semibold text-navy-900 dark:text-white"
                            : "font-medium text-slate-700 dark:text-slate-300")
                        }
                      >
                        {n.title}
                      </p>
                      {isUnread && (
                        <span
                          aria-hidden
                          className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-sky-500"
                        />
                      )}
                    </div>
                    <p
                      className={
                        "mt-0.5 text-sm " +
                        (isUnread
                          ? "text-slate-600 dark:text-slate-300"
                          : "text-slate-500 dark:text-slate-400")
                      }
                    >
                      {n.message}
                    </p>
                    <p className="mt-1 text-xs text-slate-400 dark:text-slate-500">
                      {n.time}
                    </p>
                  </div>
                </button>
              </li>
            );
          })}
        </ul>
      )}

      {/* Footer */}
      {notifications.length > 0 && (
        <div className="border-t border-slate-100 px-5 py-3 text-center dark:border-navy-800">
          <button
            type="button"
            onClick={onClose}
            className="text-sm font-semibold text-navy-800 hover:underline dark:text-sky-300"
          >
            View all
          </button>
        </div>
      )}
    </div>
  );
}
