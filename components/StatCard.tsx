// components/StatCard.tsx
import { type LucideIcon } from "lucide-react";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatCardProps {
  label: string;
  value: string;
  icon: LucideIcon;
  trend?: { value: string; positive: boolean };
  accent?: "navy" | "sky" | "green" | "red";
  delay?: number;
}

const accents: Record<string, string> = {
  navy: "bg-navy-800/10 text-navy-800 dark:bg-navy-700/30 dark:text-sky-300",
  sky: "bg-sky-500/10 text-sky-600 dark:bg-sky-500/15 dark:text-sky-300",
  green:
    "bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/15 dark:text-emerald-300",
  red: "bg-red-500/10 text-red-600 dark:bg-red-500/15 dark:text-red-300",
};

export function StatCard({
  label,
  value,
  icon: Icon,
  trend,
  accent = "navy",
  delay = 0,
}: StatCardProps) {
  return (
    <div
      className="group flex h-full min-h-[10rem] animate-fade-up flex-col justify-between rounded-2xl border border-slate-200 bg-white p-6 shadow-card transition-all duration-200 hover:-translate-y-0.5 hover:border-sky-200 hover:shadow-card-hover dark:border-navy-800 dark:bg-navy-900 dark:hover:border-sky-500/30"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="flex items-center justify-between">
        <div
          className={cn(
            "grid h-11 w-11 place-items-center rounded-xl transition-transform group-hover:scale-105",
            accents[accent]
          )}
        >
          <Icon className="h-5 w-5" />
        </div>
        {trend && (
          <span
            className={cn(
              "inline-flex items-center gap-0.5 rounded-full px-2.5 py-1 text-sm font-semibold",
              trend.positive
                ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300"
                : "bg-red-50 text-red-700 dark:bg-red-500/10 dark:text-red-300"
            )}
          >
            {trend.positive ? (
              <ArrowUpRight className="h-4 w-4" />
            ) : (
              <ArrowDownRight className="h-4 w-4" />
            )}
            {trend.value}
          </span>
        )}
      </div>
      <div className="mt-4">
        <p className="text-sm font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">
          {label}
        </p>
        <p className="mt-1.5 font-display text-3xl font-bold leading-tight tracking-tight text-navy-900 dark:text-white">
          {value}
        </p>
      </div>
    </div>
  );
}
