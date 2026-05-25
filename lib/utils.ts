// lib/utils.ts
// Shared helper utilities

import type {
  Transaction,
  Receipt,
  CategoryBreakdown,
  MonthlyReportRow,
} from "./types";
import {
  isOperatingIncome,
  isOperatingExpense,
  sumOperatingIncome,
  sumOperatingExpenses,
  operatingProfit,
} from "./accounting";

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

/** Compact currency for tight spaces. */
export function formatCompactCurrency(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(amount);
}

/** Format an ISO date string into a readable form. */
export function formatDate(iso: string): string {
  const d = new Date(iso);
  if (isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

/**
 * Sum operating income or operating expenses for a transaction list.
 * "income" now covers all operating income (currently the "income" type),
 * "expense" now covers all operating expenses (expense, payroll,
 * tax_payment, bank_fee). Credit notes inversely adjust the relevant side.
 */
export function sumByType(
  transactions: Transaction[],
  type: "income" | "expense"
): number {
  return type === "income"
    ? sumOperatingIncome(transactions)
    : sumOperatingExpenses(transactions);
}

/** Operating profit (income - expenses) for a list of transactions. */
export function netProfit(transactions: Transaction[]): number {
  return operatingProfit(transactions);
}

/** Operating profit margin as a percentage. */
export function profitMargin(transactions: Transaction[]): number {
  const income = sumOperatingIncome(transactions);
  if (income === 0) return 0;
  return (operatingProfit(transactions) / income) * 100;
}

/**
 * Group operating-expense transactions by category. Credit notes deduct
 * from their category bucket.
 */
export function expensesByCategory(
  transactions: Transaction[]
): CategoryBreakdown[] {
  const map = new Map<string, number>();
  for (const t of transactions) {
    if (!isOperatingExpense(t)) continue;
    const delta = t.documentType === "credit_note" ? -t.amount : t.amount;
    map.set(t.category, (map.get(t.category) ?? 0) + delta);
  }
  return Array.from(map.entries())
    .filter(([, amount]) => amount !== 0)
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

/** Filter a list of transactions to a date range (inclusive). */
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

export const filterTransactionsByDateRange = filterByDateRange;

export function filterReceiptsByDateRange(
  receipts: Receipt[],
  startDate?: string,
  endDate?: string
): Receipt[] {
  return receipts.filter((r) => {
    const d = r.documentDate ?? r.date ?? "";
    if (startDate && d < startDate) return false;
    if (endDate && d > endDate) return false;
    return true;
  });
}

/** Build a monthly summary using the operating P&L rules. */
export function buildMonthlyReport(
  transactions: Transaction[]
): MonthlyReportRow[] {
  const buckets = new Map<string, { income: number; expenses: number }>();
  for (const t of transactions) {
    const key = monthKey(t.date);
    const bucket = buckets.get(key) ?? { income: 0, expenses: 0 };
    if (isOperatingIncome(t)) {
      bucket.income += t.documentType === "credit_note" ? -t.amount : t.amount;
    } else if (t.type === "refund") {
      bucket.income -= t.documentType === "credit_note" ? -t.amount : t.amount;
    } else if (isOperatingExpense(t)) {
      bucket.expenses +=
        t.documentType === "credit_note" ? -t.amount : t.amount;
    }
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

export function isoForFileName(iso: string): string {
  if (!iso) return "";
  return iso.slice(0, 10);
}

export function getActivePeriodLabel(
  startDate?: string,
  endDate?: string
): string {
  if (!startDate && !endDate) return "All Available Data";
  if (startDate && endDate)
    return `${formatDate(startDate)} - ${formatDate(endDate)}`;
  if (startDate) return `From ${formatDate(startDate)}`;
  if (endDate) return `Until ${formatDate(endDate)}`;
  return "All Available Data";
}

export interface DashboardSummary {
  totalIncome: number;
  totalExpenses: number;
  netProfit: number;
  profitMargin: number;
  transactionCount: number;
  receiptCount: number;
}

export function calculateDashboardSummary(
  transactions: Transaction[],
  receipts: Receipt[]
): DashboardSummary {
  const totalIncome = sumOperatingIncome(transactions);
  const totalExpenses = sumOperatingExpenses(transactions);
  return {
    totalIncome,
    totalExpenses,
    netProfit: totalIncome - totalExpenses,
    profitMargin: profitMargin(transactions),
    transactionCount: transactions.length,
    receiptCount: receipts.length,
  };
}

function pad2(n: number): string {
  return n < 10 ? `0${n}` : String(n);
}

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

export function quickPeriod(
  kind: QuickPeriodKind,
  anchor: Date = new Date()
): DateRange | null {
  if (kind === "all") return null;
  const y = anchor.getFullYear();
  const m = anchor.getMonth();
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
    const qStart = Math.floor(m / 3) * 3;
    const start = new Date(y, qStart, 1);
    const end = new Date(y, qStart + 3, 0);
    return { start: toISODateString(start), end: toISODateString(end) };
  }
  const start = new Date(y, 0, 1);
  const end = new Date(y, 11, 31);
  return { start: toISODateString(start), end: toISODateString(end) };
}
