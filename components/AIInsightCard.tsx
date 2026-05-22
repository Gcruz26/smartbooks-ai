// components/AIInsightCard.tsx
import {
  Sparkles,
  TrendingUp,
  AlertTriangle,
  Info,
  CircleAlert,
} from "lucide-react";
import type { FinancialInsight } from "@/lib/types";
import { cn } from "@/lib/utils";

const config = {
  positive: {
    icon: TrendingUp,
    ring: "ring-emerald-500/20",
    iconBg: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-300",
  },
  warning: {
    icon: AlertTriangle,
    ring: "ring-amber-500/20",
    iconBg: "bg-amber-500/10 text-amber-600 dark:text-amber-300",
  },
  alert: {
    icon: CircleAlert,
    ring: "ring-red-500/20",
    iconBg: "bg-red-500/10 text-red-600 dark:text-red-300",
  },
  neutral: {
    icon: Info,
    ring: "ring-sky-500/20",
    iconBg: "bg-sky-500/10 text-sky-600 dark:text-sky-300",
  },
} as const;

export function AIInsightCard({ insights }: { insights: FinancialInsight[] }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white shadow-card dark:border-navy-800 dark:bg-navy-900">
      <div className="flex items-center gap-3 border-b border-slate-100 px-6 py-5 dark:border-navy-800">
        <span className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-sky-500 to-navy-700 text-white">
          <Sparkles className="h-5 w-5" />
        </span>
        <div>
          <h3 className="font-display text-lg font-bold text-navy-900 dark:text-white">
            AI Financial Insights
          </h3>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Generated from your latest activity
          </p>
        </div>
      </div>

      <ul className="divide-y divide-slate-100 dark:divide-navy-800">
        {insights.map((insight) => {
          const c = config[insight.type];
          const Icon = c.icon;
          return (
            <li
              key={insight.id}
              className="flex gap-3.5 px-6 py-4 transition hover:bg-slate-50 dark:hover:bg-navy-800/50"
            >
              <span
                className={cn(
                  "mt-0.5 grid h-9 w-9 shrink-0 place-items-center rounded-lg ring-1 ring-inset",
                  c.iconBg,
                  c.ring
                )}
              >
                <Icon className="h-5 w-5" />
              </span>
              <div className="min-w-0">
                <p className="text-base font-semibold text-navy-900 dark:text-white">
                  {insight.title}
                </p>
                <p className="mt-1 text-base text-slate-500 dark:text-slate-400">
                  {insight.message}
                </p>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
