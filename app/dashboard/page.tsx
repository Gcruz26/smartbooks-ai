"use client";

// app/dashboard/page.tsx
import { useMemo, useState } from "react";
import Link from "next/link";
import {
  TrendingUp,
  TrendingDown,
  Wallet,
  ReceiptText,
  Plus,
  Upload,
  AlertTriangle,
  Eye,
} from "lucide-react";
import { DashboardShell } from "@/components/DashboardShell";
import { StatCard } from "@/components/StatCard";
import { ChartCard } from "@/components/ChartCard";
import { RevenueChart, CategoryChart } from "@/components/Charts";
import { TransactionTable } from "@/components/TransactionTable";
import { AIInsightCard } from "@/components/AIInsightCard";
import { Button } from "@/components/ui/Button";
import { useLanguage } from "@/components/LanguageProvider";
import {
  transactions as allTransactions,
  receipts as allReceipts,
} from "@/lib/mockData";
import { generateFinancialInsights } from "@/lib/insights";
import {
  cn,
  formatCurrency,
  expensesByCategory,
  filterTransactionsByDateRange,
  filterReceiptsByDateRange,
  buildMonthlyReport,
  calculateDashboardSummary,
  getActivePeriodLabel,
  quickPeriod,
  toISODateString,
  type QuickPeriodKind,
} from "@/lib/utils";

interface QuickPreset {
  key: QuickPeriodKind;
  labelKey:
    | "this_month"
    | "last_month"
    | "this_quarter"
    | "this_year"
    | "all_data";
}

const QUICK_PRESETS: QuickPreset[] = [
  { key: "this-month", labelKey: "this_month" },
  { key: "last-month", labelKey: "last_month" },
  { key: "this-quarter", labelKey: "this_quarter" },
  { key: "this-year", labelKey: "this_year" },
  { key: "all", labelKey: "all_data" },
];

function previousPeriodBounds(
  start: string | undefined,
  end: string | undefined
): { start: string; end: string } | null {
  if (!start || !end) return null;
  const startD = new Date(start);
  const endD = new Date(end);
  if (isNaN(startD.getTime()) || isNaN(endD.getTime())) return null;
  const durationMs = endD.getTime() - startD.getTime();
  const prevEnd = new Date(startD.getTime() - 24 * 60 * 60 * 1000);
  const prevStart = new Date(prevEnd.getTime() - durationMs);
  return {
    start: toISODateString(prevStart),
    end: toISODateString(prevEnd),
  };
}

function pctDelta(
  current: number,
  previous: number
): { value: string; positive: boolean } | null {
  if (previous === 0) return null;
  const change = ((current - previous) / Math.abs(previous)) * 100;
  if (!isFinite(change)) return null;
  return {
    value: `${Math.abs(change).toFixed(1)}%`,
    positive: change >= 0,
  };
}

export default function DashboardPage() {
  const { t } = useLanguage();
  const dataAnchor = useMemo(() => {
    const max = allTransactions.reduce(
      (acc, t) => (acc > t.date ? acc : t.date),
      allTransactions[0]?.date ?? ""
    );
    if (!max) return new Date();
    const [y, m, d] = max.split("-").map(Number);
    return new Date(y, (m ?? 1) - 1, d ?? 1);
  }, []);
  const dataMin = useMemo(
    () =>
      allTransactions.reduce(
        (acc, t) => (acc < t.date ? acc : t.date),
        allTransactions[0]?.date ?? ""
      ),
    []
  );
  const dataMax = useMemo(
    () =>
      allTransactions.reduce(
        (acc, t) => (acc > t.date ? acc : t.date),
        allTransactions[0]?.date ?? ""
      ),
    []
  );

  const [pendingStart, setPendingStart] = useState("");
  const [pendingEnd, setPendingEnd] = useState("");
  const [appliedStart, setAppliedStart] = useState<string | undefined>();
  const [appliedEnd, setAppliedEnd] = useState<string | undefined>();
  const [filterError, setFilterError] = useState<string | null>(null);
  const [activePreset, setActivePreset] = useState<QuickPeriodKind | null>(
    "all"
  );

  const filteredTransactions = useMemo(
    () =>
      filterTransactionsByDateRange(allTransactions, appliedStart, appliedEnd),
    [appliedStart, appliedEnd]
  );
  const filteredReceipts = useMemo(
    () => filterReceiptsByDateRange(allReceipts, appliedStart, appliedEnd),
    [appliedStart, appliedEnd]
  );

  const prevRange = useMemo(
    () => previousPeriodBounds(appliedStart, appliedEnd),
    [appliedStart, appliedEnd]
  );
  const prevTransactions = useMemo(
    () =>
      prevRange
        ? filterTransactionsByDateRange(
            allTransactions,
            prevRange.start,
            prevRange.end
          )
        : [],
    [prevRange]
  );
  const prevReceipts = useMemo(
    () =>
      prevRange
        ? filterReceiptsByDateRange(allReceipts, prevRange.start, prevRange.end)
        : [],
    [prevRange]
  );

  const summary = useMemo(
    () => calculateDashboardSummary(filteredTransactions, filteredReceipts),
    [filteredTransactions, filteredReceipts]
  );
  const prevSummary = useMemo(
    () =>
      prevRange
        ? calculateDashboardSummary(prevTransactions, prevReceipts)
        : null,
    [prevRange, prevTransactions, prevReceipts]
  );

  const monthlyRows = useMemo(
    () => buildMonthlyReport(filteredTransactions),
    [filteredTransactions]
  );
  const categoryData = useMemo(
    () => expensesByCategory(filteredTransactions),
    [filteredTransactions]
  );
  const insights = useMemo(
    () => generateFinancialInsights(filteredTransactions),
    [filteredTransactions]
  );
  const recent = useMemo(
    () =>
      [...filteredTransactions]
        .sort((a, b) => b.date.localeCompare(a.date))
        .slice(0, 6),
    [filteredTransactions]
  );

  const rawPeriodLabel = getActivePeriodLabel(appliedStart, appliedEnd);
  const periodLabel =
    rawPeriodLabel === "All Available Data"
      ? t("all_available_data")
      : rawPeriodLabel;

  function applyDates(start: string | undefined, end: string | undefined) {
    setAppliedStart(start);
    setAppliedEnd(end);
    setPendingStart(start ?? "");
    setPendingEnd(end ?? "");
    setFilterError(null);
  }

  function handleApply() {
    if (!pendingStart && !pendingEnd) {
      setFilterError("Pick at least a Start Date or End Date, or use Clear.");
      return;
    }
    if (pendingStart && pendingEnd && pendingStart > pendingEnd) {
      setFilterError("Start Date must be before or equal to End Date.");
      return;
    }
    setActivePreset(null);
    applyDates(pendingStart || undefined, pendingEnd || undefined);
  }

  function handleClear() {
    setActivePreset("all");
    applyDates(undefined, undefined);
  }

  function handlePreset(kind: QuickPeriodKind) {
    setActivePreset(kind);
    const range = quickPeriod(kind, dataAnchor);
    applyDates(range?.start, range?.end);
  }

  const incomeTrend = prevSummary
    ? pctDelta(summary.totalIncome, prevSummary.totalIncome)
    : null;
  const expenseTrend = prevSummary
    ? pctDelta(summary.totalExpenses, prevSummary.totalExpenses)
    : null;
  const profitTrend = prevSummary
    ? pctDelta(summary.netProfit, prevSummary.netProfit)
    : null;

  return (
    <DashboardShell
      title="Dashboard"
      subtitle={t("dashboard_subtitle")}
    >
      {/* Header strip: viewing label + quick actions */}
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-base font-medium text-navy-700 ring-1 ring-slate-200 dark:bg-navy-900 dark:text-slate-200 dark:ring-navy-800">
          <Eye className="h-4 w-4 text-sky-500" />
          <span className="text-slate-500 dark:text-slate-400">{t("viewing")}:</span>
          <span className="font-semibold text-navy-900 dark:text-white">
            {periodLabel}
          </span>
        </div>
        <div className="flex flex-wrap gap-2.5">
          <Link href="/receipts">
            <Button variant="outline" size="sm">
              <Upload className="h-4 w-4" />
              Upload Receipt
            </Button>
          </Link>
          <Link href="/transactions">
            <Button size="sm">
              <Plus className="h-4 w-4" />
              New Transaction
            </Button>
          </Link>
        </div>
      </div>

      {/* Filter card - 2 clean rows */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-card dark:border-navy-800 dark:bg-navy-900">
        {/* Row 1: quick filter pills */}
        <div className="-mx-1 overflow-x-auto">
          <div
            role="tablist"
            aria-label="Quick period"
            className="inline-flex min-w-max gap-2"
          >
            {QUICK_PRESETS.map((p) => {
              const active = activePreset === p.key;
              return (
                <button
                  key={p.key}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  onClick={() => handlePreset(p.key)}
                  className={cn(
                    "whitespace-nowrap rounded-lg px-4 py-2.5 text-base font-semibold transition-all duration-200",
                    active
                      ? "bg-navy-800 text-white shadow-sm ring-1 ring-navy-800/20 dark:bg-sky-500 dark:ring-sky-400/30"
                      : "border border-slate-200 bg-white text-slate-700 hover:border-navy-300 hover:bg-slate-50 hover:text-navy-900 dark:border-navy-700 dark:bg-navy-900 dark:text-slate-300 dark:hover:bg-navy-800 dark:hover:text-white"
                  )}
                >
                  {t(p.labelKey)}
                </button>
              );
            })}
          </div>
        </div>

        {/* Row 2: custom range label + dates + actions */}
        <div className="mt-4 flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
          <div className="grid w-full grid-cols-1 gap-3 sm:grid-cols-[auto_1fr_1fr] sm:items-end lg:max-w-xl">
            <div className="hidden self-end pb-3 sm:block">
              <p className="text-sm font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                {t("custom_range")}
              </p>
            </div>
            <div>
              <label
                htmlFor="dash-start"
                className="mb-1.5 block text-sm font-semibold text-slate-600 dark:text-slate-300"
              >
                {t("start_date")}
              </label>
              <input
                id="dash-start"
                type="date"
                value={pendingStart}
                min={dataMin}
                max={dataMax}
                onChange={(e) => setPendingStart(e.target.value)}
                className="h-11 w-full rounded-lg border border-slate-200 bg-white px-3 text-base text-navy-900 transition focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-500/20 dark:border-navy-700 dark:bg-navy-950 dark:text-slate-100"
              />
            </div>
            <div>
              <label
                htmlFor="dash-end"
                className="mb-1.5 block text-sm font-semibold text-slate-600 dark:text-slate-300"
              >
                {t("end_date")}
              </label>
              <input
                id="dash-end"
                type="date"
                value={pendingEnd}
                min={dataMin}
                max={dataMax}
                onChange={(e) => setPendingEnd(e.target.value)}
                className="h-11 w-full rounded-lg border border-slate-200 bg-white px-3 text-base text-navy-900 transition focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-500/20 dark:border-navy-700 dark:bg-navy-950 dark:text-slate-100"
              />
            </div>
          </div>
          <div className="flex gap-2 lg:self-end">
            <button
              type="button"
              onClick={handleClear}
              className="h-11 rounded-lg border border-slate-200 px-5 text-base font-semibold text-slate-600 transition hover:bg-slate-50 hover:text-navy-900 dark:border-navy-700 dark:text-slate-300 dark:hover:bg-navy-800 dark:hover:text-white"
            >
              {t("clear")}
            </button>
            <button
              type="button"
              onClick={handleApply}
              className="h-11 rounded-lg bg-navy-800 px-6 text-base font-semibold text-white shadow-sm transition hover:bg-navy-700"
            >
              {t("apply_filter")}
            </button>
          </div>
        </div>

        {filterError && (
          <div
            role="alert"
            className="mt-4 flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-3.5 py-2.5 text-sm text-red-700 dark:border-red-500/30 dark:bg-red-500/10 dark:text-red-300"
          >
            <AlertTriangle className="h-4 w-4 shrink-0" />
            {filterError}
          </div>
        )}
      </div>

      {/* Stat cards */}
      <div className="mt-7 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label={t("total_income")}
          value={formatCurrency(summary.totalIncome)}
          icon={TrendingUp}
          accent="green"
          trend={incomeTrend ?? undefined}
          delay={0}
        />
        <StatCard
          label={t("total_expenses")}
          value={formatCurrency(summary.totalExpenses)}
          icon={TrendingDown}
          accent="red"
          trend={
            expenseTrend
              ? { value: expenseTrend.value, positive: !expenseTrend.positive }
              : undefined
          }
          delay={60}
        />
        <StatCard
          label={t("net_profit")}
          value={formatCurrency(summary.netProfit)}
          icon={Wallet}
          accent="navy"
          trend={profitTrend ?? undefined}
          delay={120}
        />
        <StatCard
          label={t("receipts_uploaded")}
          value={String(summary.receiptCount)}
          icon={ReceiptText}
          accent="sky"
          delay={180}
        />
      </div>

      {/* Charts */}
      <div className="mt-7 grid gap-6 lg:grid-cols-3">
        <ChartCard
          title={t("monthly_revenue")}
          subtitle={periodLabel}
          className="lg:col-span-2"
          action={
            <Link href="/reports">
              <Button variant="ghost" size="sm">
                {t("view_reports")}
              </Button>
            </Link>
          }
        >
          <RevenueChart data={monthlyRows} />
        </ChartCard>

        <ChartCard title={t("expenses_by_category")} subtitle={periodLabel}>
          <CategoryChart data={categoryData} />
        </ChartCard>
      </div>

      {/* Recent transactions + AI insights */}
      <div className="mt-7 grid gap-6 lg:grid-cols-3">
        <div className="rounded-2xl border border-slate-200 bg-white shadow-card dark:border-navy-800 dark:bg-navy-900 lg:col-span-2">
          <div className="flex items-center justify-between border-b border-slate-100 px-6 py-5 dark:border-navy-800">
            <div>
              <h3 className="font-display text-lg font-bold text-navy-900 dark:text-white">
                {t("recent_transactions")}
              </h3>
              <p className="mt-1 text-base text-slate-500 dark:text-slate-400">
                {t("showing_n_of_m", { n: recent.length, m: filteredTransactions.length })}
              </p>
            </div>
            <Link href="/transactions">
              <Button variant="ghost" size="sm">
                View all
              </Button>
            </Link>
          </div>
          <TransactionTable transactions={recent} compact />
        </div>

        <AIInsightCard insights={insights} />
      </div>
    </DashboardShell>
  );
}
