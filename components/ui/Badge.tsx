// components/ui/Badge.tsx
import { type ReactNode } from "react";
import { cn } from "@/lib/utils";

type Tone =
  | "green"
  | "amber"
  | "red"
  | "blue"
  | "navy"
  | "slate"
  | "purple";

interface BadgeProps {
  children: ReactNode;
  tone?: Tone;
  className?: string;
}

const tones: Record<Tone, string> = {
  green:
    "bg-emerald-50 text-emerald-700 ring-emerald-600/20 dark:bg-emerald-500/10 dark:text-emerald-300 dark:ring-emerald-400/20",
  amber:
    "bg-amber-50 text-amber-700 ring-amber-600/20 dark:bg-amber-500/10 dark:text-amber-300 dark:ring-amber-400/20",
  red: "bg-red-50 text-red-700 ring-red-600/20 dark:bg-red-500/10 dark:text-red-300 dark:ring-red-400/20",
  // "blue" maps to the sky ramp (which is now the Accent Orange ramp in
  // this build). Kept for backwards compatibility with status badges.
  blue: "bg-sky-50 text-sky-700 ring-sky-600/20 dark:bg-sky-500/10 dark:text-sky-300 dark:ring-sky-400/20",
  // True brand-blue badge for Fatura and other primary-blue accents.
  navy: "bg-navy-100 text-navy-800 ring-navy-700/20 dark:bg-navy-700/30 dark:text-navy-100 dark:ring-navy-400/20",
  slate:
    "bg-slate-100 text-slate-700 ring-slate-500/20 dark:bg-navy-800 dark:text-slate-300 dark:ring-slate-400/10",
  purple:
    "bg-violet-50 text-violet-700 ring-violet-600/20 dark:bg-violet-500/10 dark:text-violet-300 dark:ring-violet-400/20",
};

export function Badge({ children, tone = "slate", className }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-3 py-1 text-sm font-medium ring-1 ring-inset",
        tones[tone],
        className
      )}
    >
      {children}
    </span>
  );
}

/** Map a transaction/receipt/client status to a badge tone + label. */
export function statusToTone(status: string): Tone {
  switch (status) {
    case "paid":
    case "categorized":
    case "active":
      return "green";
    case "approved":
      return "navy";
    case "pending":
    case "lead":
      return "amber";
    case "processing":
      return "blue";
    case "needs_review":
    case "overdue":
      return "red";
    case "rejected":
    case "inactive":
      return "slate";
    default:
      return "slate";
  }
}

export function statusLabel(status: string): string {
  return status
    .split("_")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}
