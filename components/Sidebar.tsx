"use client";

// components/Sidebar.tsx
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  ArrowLeftRight,
  ReceiptText,
  BarChart3,
  Users,
  UserCog,
  Tag,
  Settings,
  Sparkles,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";

const navSections: {
  title?: string;
  items: { href: string; label: string; icon: typeof LayoutDashboard }[];
}[] = [
  {
    title: "Overview",
    items: [
      { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    ],
  },
  {
    title: "Finance",
    items: [
      { href: "/transactions", label: "Transactions", icon: ArrowLeftRight },
      { href: "/receipts", label: "Receipts", icon: ReceiptText },
      { href: "/reports", label: "Reports", icon: BarChart3 },
    ],
  },
  {
    title: "Business",
    items: [
      { href: "/clients", label: "Clients", icon: Users },
      { href: "/users", label: "Users", icon: UserCog },
      { href: "/pricing", label: "Pricing", icon: Tag },
      { href: "/settings", label: "Settings", icon: Settings },
    ],
  },
];

interface SidebarProps {
  open: boolean;
  onClose: () => void;
}

export function Sidebar({ open, onClose }: SidebarProps) {
  const pathname = usePathname();

  return (
    <>
      {open && (
        <div
          className="fixed inset-0 z-30 bg-navy-950/40 backdrop-blur-sm lg:hidden"
          onClick={onClose}
          aria-hidden
        />
      )}

      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 flex w-80 flex-col border-r border-slate-200 bg-white transition-transform duration-300 dark:border-navy-800 dark:bg-navy-950 lg:translate-x-0",
          open ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Brand */}
        <div className="flex h-24 shrink-0 items-center justify-between px-6">
          <Link href="/dashboard" className="flex items-center gap-3">
            <span className="grid h-11 w-11 place-items-center rounded-xl bg-navy-800 text-white">
              <Sparkles className="h-6 w-6" />
            </span>
            <span className="font-display text-2xl font-bold tracking-tight text-navy-900 dark:text-white">
              SmartBooks
              <span className="text-sky-500"> AI</span>
            </span>
          </Link>
          <button
            onClick={onClose}
            className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-navy-800 lg:hidden"
            aria-label="Close menu"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto px-4 py-3">
          {navSections.map((section, sIdx) => (
            <div key={section.title ?? sIdx} className={sIdx > 0 ? "mt-5" : ""}>
              {section.title && (
                <p className="mb-2 px-3 text-sm font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                  {section.title}
                </p>
              )}
              <div className="space-y-1">
                {section.items.map(({ href, label, icon: Icon }) => {
                  const active = pathname === href;
                  return (
                    <Link
                      key={href}
                      href={href}
                      onClick={onClose}
                      className={cn(
                        "group flex items-center gap-3.5 rounded-xl px-3.5 py-3 text-lg font-medium transition",
                        active
                          ? "bg-navy-800 text-white shadow-sm"
                          : "text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-navy-800"
                      )}
                    >
                      <Icon
                        className={cn(
                          "h-6 w-6 shrink-0 transition",
                          active
                            ? "text-sky-300"
                            : "text-slate-400 group-hover:text-navy-700 dark:group-hover:text-slate-100"
                        )}
                      />
                      {label}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        {/* Compact upgrade card */}
        <div className="m-3 shrink-0 rounded-xl bg-navy-800 px-4 py-3 text-white">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-sky-300" />
            <p className="text-base font-semibold">Upgrade to Pro</p>
          </div>
          <p className="mt-1 text-sm text-slate-300">
            Unlock AI classification and monthly reports.
          </p>
          <Link
            href="/pricing"
            className="mt-3 inline-flex w-full items-center justify-center rounded-lg border border-white/20 bg-white/10 px-3 py-2 text-sm font-semibold text-white transition hover:border-sky-300/40 hover:bg-white/15"
          >
            View plans
          </Link>
        </div>
      </aside>
    </>
  );
}
