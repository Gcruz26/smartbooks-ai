"use client";

// components/Header.tsx
import { Menu, Search, Bell, Moon, Sun } from "lucide-react";
import { useTheme } from "@/components/ThemeProvider";
import { currentUser } from "@/lib/mockData";

interface HeaderProps {
  title: string;
  subtitle?: string;
  onMenuClick: () => void;
}

export function Header({ title, subtitle, onMenuClick }: HeaderProps) {
  const { theme, toggleTheme } = useTheme();

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

      <button
        className="relative hidden rounded-xl p-3 text-slate-600 transition hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-navy-800 sm:inline-flex"
        aria-label="Notifications"
      >
        <Bell className="h-5 w-5" />
        <span className="absolute right-3 top-3 h-2 w-2 rounded-full bg-sky-500 ring-2 ring-white dark:ring-navy-950" />
      </button>

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
