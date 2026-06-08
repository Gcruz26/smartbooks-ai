"use client";

// components/Sidebar.tsx
import Link from "next/link";
import { BrandLogo } from "@/components/BrandLogo";
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
import { useLanguage } from "@/components/LanguageProvider";
import type { TranslationKey } from "@/lib/i18n";

interface NavItem {
  href: string;
  labelKey: TranslationKey;
  icon: typeof LayoutDashboard;
}

const navSections: { titleKey?: TranslationKey; items: NavItem[] }[] = [
  {
    titleKey: "section_overview",
    items: [
      { href: "/dashboard", labelKey: "nav_dashboard", icon: LayoutDashboard },
    ],
  },
  {
    titleKey: "section_finance",
    items: [
      { href: "/transactions", labelKey: "nav_transactions", icon: ArrowLeftRight },
      { href: "/receipts", labelKey: "nav_receipts", icon: ReceiptText },
      { href: "/reports", labelKey: "nav_reports", icon: BarChart3 },
    ],
  },
  {
    titleKey: "section_business",
    items: [
      { href: "/clients", labelKey: "nav_clients", icon: Users },
      { href: "/users", labelKey: "nav_users", icon: UserCog },
      { href: "/pricing", labelKey: "nav_pricing", icon: Tag },
      { href: "/settings", labelKey: "nav_settings", icon: Settings },
    ],
  },
];

interface SidebarProps {
  open: boolean;
  onClose: () => void;
}

export function Sidebar({ open, onClose }: SidebarProps) {
  const pathname = usePathname();
  const { t } = useLanguage();

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
        <div className="flex h-32 shrink-0 items-center justify-between px-5">
          <Link href="/dashboard" aria-label="SmartBooks AI" className="inline-flex">
            <BrandLogo size="sidebar" priority />
          </Link>
          <button
            onClick={onClose}
            className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-navy-800 lg:hidden"
            aria-label={t("close_menu")}
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto px-4 py-3">
          {navSections.map((section, sIdx) => (
            <div key={section.titleKey ?? sIdx} className={sIdx > 0 ? "mt-5" : ""}>
              {section.titleKey && (
                <p className="mb-2 px-3 text-sm font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                  {t(section.titleKey)}
                </p>
              )}
              <div className="space-y-1">
                {section.items.map(({ href, labelKey, icon: Icon }) => {
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
                      {t(labelKey)}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        <div className="m-3 shrink-0 rounded-xl bg-navy-800 px-4 py-3 text-white">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-sky-300" />
            <p className="text-base font-semibold">{t("upgrade_to_pro")}</p>
          </div>
          <p className="mt-1 text-sm text-slate-300">{t("upgrade_blurb")}</p>
          <Link
            href="/pricing"
            className="mt-3 inline-flex w-full items-center justify-center rounded-lg border border-white/20 bg-white/10 px-3 py-2 text-sm font-semibold text-white transition hover:border-sky-300/40 hover:bg-white/15"
          >
            {t("view_plans")}
          </Link>
        </div>
      </aside>
    </>
  );
}
