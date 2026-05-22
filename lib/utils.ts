// lib/utils.ts
// Shared helper utilities

import type {
  Transaction,
  Receipt,
  CategoryBreakdown,
  MonthlyReportRow,
} from "./types";

/** Join class names, skipping falsy values. */
export function cn(...classes: (string | false | null | undefined)[]): string {
  return classes.filter(Boolean).join(" ");
}

/** Format a number as USD currency. */
export function formatCurrency(amount: number, currency = "USD"): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

/** Compact currency for tight spaces, e.g. $12.4k */
export function formatCompactCurrency(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(amount);
}

/** Format an ISO date string into a readable form, e.g. "May 20, 2026". */
export function formatDate(iso: string): string {
  const d = new Date(iso);
  if (isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

/** Sum transaction amounts for a given type. */
export function sumByType(
  transactions: Transaction[],
  type: "income" | "expense"
): number {
  return transactions
    .filter((t) => t.type === type)
    .reduce((acc, t) => acc + t.amount, 0);
}

/** Net profit = income - expenses. */
export function netProfit(transactions: Transaction[]): number {
  return sumByType(transactions, "income") - sumByType(transactions, "expense");
}

/** Net profit margin as a percentage (0 if no income). */
export function profitMargin(transactions: Transaction[]): number {
  const income = sumByType(transactions, "income");
  if (income === 0) return 0;
  return (netProfit(transactions) / income) * 100;
}

/** Group expense transactions by category and total each. */
export function expensesByCategory(
  transactions: Transaction[]
): CategoryBreakdown[] {
  const map = new Map<string, number>();
  for (const t of transactions) {
    if (t.type !== "expense") continue;
    map.set(t.category, (map.get(t.category) ?? 0) + t.amount);
  }
  return Array.from(map.entries())
    .map(([category, amount]) => ({ category, amount }))
    .sort((a, b) => b.amount - a.amount);
}

/** Build a month key (YYYY-MM) from an ISO date. */
export function monthKey(iso: string): string {
  return iso.slice(0, 7);
}

/** Short month label, e.g. "May". */
export function monthLabel(iso: string): string {
  const d = new Date(iso + "-01");
  if (isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("en-US", { month: "short" });
}

/**
 * Filter a list of transactions to a date range (inclusive). When either
 * bound is undefined, that side is open. Dates are compared as YYYY-MM-DD
 * strings, which works because the input format is ISO.
 */
export function filterByDateRange(
  transactions: Transaction[],
  startDate?: string,
  endDate?: string
): Transaction[] {
  return transactions.filter((t) => {
    if (startDate && t.date < startDate) return false;
    if (endDate && t.date > endDate) return false;
    return true;
  });
}

/** Friendly alias for the transaction filter. */
export const filterTransactionsByDateRange = filterByDateRange;

/** Filter receipts by their `date` field (inclusive on both ends). */
export function filterReceiptsByDateRange(
  receipts: Receipt[],
  startDate?: string,
  endDate?: string
): Receipt[] {
  return receipts.filter((r) => {
    if (startDate && r.date < startDate) return false;
    if (endDate && r.date > endDate) return false;
    return true;
  });
}

/**
 * Build a monthly summary (income / expenses / profit) directly from
 * transactions. The resulting rows are sorted chronologically and labelled
 * like "May 2026".
 */
export function buildMonthlyReport(
  transactions: Transaction[]
): MonthlyReportRow[] {
  const buckets = new Map<string, { income: number; expenses: number }>();
  for (const t of transactions) {
    const key = monthKey(t.date);
    const bucket = buckets.get(key) ?? { income: 0, expenses: 0 };
    if (t.type === "income") bucket.income += t.amount;
    else bucket.expenses += t.amount;
    buckets.set(key, bucket);
  }
  return Array.from(buckets.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([key, b]) => {
      const d = new Date(key + "-01");
      const label = isNaN(d.getTime())
        ? key
        : d.toLocaleDateString("en-US", { month: "short", year: "numeric" });
      return {
        month: label,
        income: b.income,
        expenses: b.expenses,
        profit: b.income - b.expenses,
      };
    });
}

/** Format an ISO date for file names (YYYY-MM-DD, no slashes). */
export function isoForFileName(iso: string): string {
  if (!iso) return "";
  return iso.slice(0, 10);
}

/** Build a human label for the active filter period. */
export function getActivePeriodLabel(
  startDate?: string,
  endDate?: string
): string {
  if (!startDate && !endDate) return "All Available Data";
  if (startDate && endDate) return `${formatDate(startDate)} - ${formatDate(endDate)}`;
  if (startDate) return `From ${formatDate(startDate)}`;
  if (endDate) return `Until ${formatDate(endDate)}`;
  return "All Available Data";
}

/** Aggregated summary used by the Dashboard summary cards. */
export interface DashboardSummary {
  totalIncome: number;
  totalExpenses: number;
  netProfit: number;
  profitMargin: number;
  transactionCount: number;
  receiptCount: number;
}

/** Compute the dashboard summary from filtered transactions + receipts. */
export function calculateDashboardSummary(
  transactions: Transaction[],
  receipts: Receipt[]
): DashboardSummary {
  const totalIncome = sumByType(transactions, "income");
  const totalExpenses = sumByType(transactions, "expense");
  return {
    totalIncome,
    totalExpenses,
    netProfit: totalIncome - totalExpenses,
    profitMargin: profitMargin(transactions),
    transactionCount: transactions.length,
    receiptCount: receipts.length,
  };
}

/** Two-digit zero-padded number, for date math. */
function pad2(n: number): string {
  return n < 10 ? `0${n}` : String(n);
}

/** Format a Date object as a YYYY-MM-DD ISO date string (local time). */
export function toISODateString(d: Date): string {
  return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`;
}

export type QuickPeriodKind =
  | "this-month"
  | "last-month"
  | "this-quarter"
  | "this-year"
  | "all";

export interface DateRange {
  start: string;
  end: string;
}

/**
 * Compute the date range for a quick period anchored at the given date.
 * Pass `null` for the "all" kind to clear the filter.
 */
export function quickPeriod(
  kind: QuickPeriodKind,
  anchor: Date = new Date()
): DateRange | null {
  if (kind === "all") return null;

  const y = anchor.getFullYear();
  const m = anchor.getMonth(); // 0-11

  if (kind === "this-month") {
    const start = new Date(y, m, 1);
    const end = new Date(y, m + 1, 0);
    return { start: toISODateString(start), end: toISODateString(end) };
  }

  if (kind === "last-month") {
    const start = new Date(y, m - 1, 1);
    const end = new Date(y, m, 0);
    return { start: toISODateString(start), end: toISODateString(end) };
  }

  if (kind === "this-quarter") {
    const qStartMonth = Math.floor(m / 3) * 3;
    const start = new Date(y, qStartMonth, 1);
    const end = new Date(y, qStartMonth + 3, 0);
    return { start: toISODateString(start), end: toISODateString(end) };
  }

  // this-year
  const start = new Date(y, 0, 1);
  const end = new Date(y, 11, 31);
  return { start: toISODateString(start), end: toISODateString(end) };
}
