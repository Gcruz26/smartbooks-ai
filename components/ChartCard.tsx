// components/ChartCard.tsx
import { type ReactNode } from "react";
import { cn } from "@/lib/utils";

interface ChartCardProps {
  title: string;
  subtitle?: string;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
}

export function ChartCard({
  title,
  subtitle,
  action,
  children,
  className,
}: ChartCardProps) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-slate-200 bg-white p-6 shadow-card dark:border-navy-800 dark:bg-navy-900",
        className
      )}
    >
      <div className="mb-5 flex items-start justify-between gap-4">
        <div>
          <h3 className="font-display text-xl font-bold text-navy-900 dark:text-white">
            {title}
          </h3>
          {subtitle && (
            <p className="mt-1 text-base text-slate-500 dark:text-slate-400">
              {subtitle}
            </p>
          )}
        </div>
        {action}
      </div>
      {children}
    </div>
  );
}
