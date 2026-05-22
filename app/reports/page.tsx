"use client";

// app/reports/page.tsx
import { useMemo, useState } from "react";
import {
  TrendingUp,
  TrendingDown,
  Wallet,
  FileDown,
  FileSpreadsheet,
  CalendarDays,
  AlertTriangle,
  CheckCircle2,
  Loader2,
} from "lucide-react";
import { DashboardShell } from "@/components/DashboardShell";
import { StatCard } from "@/components/StatCard";
import { ChartCard } from "@/components/ChartCard";
import { IncomeExpenseChart, CategoryChart } from "@/components/Charts";
import { ReportSummary } from "@/components/ReportSummary";
import { Button } from "@/components/ui/Button";
import { transactions } from "@/lib/mockData";
import {
  sumByType,
  netProfit,
  formatCurrency,
  expensesByCategory,
  profitMargin,
  filterByDateRange,
  buildMonthlyReport,
} from "@/lib/utils";
import {
  exportPdf,
  exportExcel,
  formatPeriodLabel,
  type ReportExportData,
} from "@/lib/exporters";

type Status =
  | { type: "idle" }
  | { type: "pdf-loading" }
  | { type: "excel-loading" }
  | { type: "success"; message: string }
  | { type: "error"; message: string };

export default function ReportsPage() {
  // Derive the available data range so the date inputs can offer sensible
  // min/max bounds (and so "All Available Data" can show a real period).
  const dataMin = useMemo(
    () =>
      transactions.reduce(
        (acc, t) => (acc < t.date ? acc : t.date),
        transactions[0]?.date ?? ""
      ),
    []
  );
  const dataMax = useMemo(
    () =>
      transactions.reduce(
        (acc, t) => (acc > t.date ? acc : t.date),
        transactions[0]?.date ?? ""
      ),
    []
  );

  // Pending values bound to the inputs. Applied values are what actually
  // drives filtering until the user clicks Apply.
  const [pendingStart, setPendingStart] = useState("");
  const [pendingEnd, setPendingEnd] = useState("");
  const [appliedStart, setAppliedStart] = useState<string | undefined>();
  const [appliedEnd, setAppliedEnd] = useState<string | undefined>();
  const [filterError, setFilterError] = useState<string | null>(null);
  const [status, setStatus] = useState<Status>({ type: "idle" });

  const filteredTransactions = useMemo(
    () => filterByDateRange(transactions, appliedStart, appliedEnd),
    [appliedStart, appliedEnd]
  );

  const totalIncome = sumByType(filteredTransactions, "income");
  const totalExpenses = sumByType(filteredTransactions, "expense");
  const profit = netProfit(filteredTransactions);
  const margin = profitMargin(filteredTransactions);
  const categoryData = expensesByCategory(filteredTransactions);
  const monthlyRows = useMemo(
    () => buildMonthlyReport(filteredTransactions),
    [filteredTransactions]
  );

  const periodLabel = formatPeriodLabel(
    appliedStart,
    appliedEnd,
    dataMin,
    dataMax
  );

  function handleApply() {
    if (!pendingStart && !pendingEnd) {
      setFilterError("Pick at least a Start Date or End Date, or use Clear.");
      return;
    }
    if (pendingStart && pendingEnd && pendingStart > pendingEnd) {
      setFilterError("Start Date must be before or equal to End Date.");
      return;
    }
    setFilterError(null);
    setAppliedStart(pendingStart || undefined);
    setAppliedEnd(pendingEnd || undefined);
  }

  function handleClear() {
    setPendingStart("");
    setPendingEnd("");
    setAppliedStart(undefined);
    setAppliedEnd(undefined);
    setFilterError(null);
  }

  function buildExportPayload(): ReportExportData {
    return {
      startDate: appliedStart,
      endDate: appliedEnd,
      periodLabel,
      totalIncome,
      totalExpenses,
      netProfit: profit,
      profitMargin: margin,
      monthlyRows,
      categoryRows: categoryData,
      transactions: filteredTransactions,
    };
  }

  async function handleExportPdf() {
    if (status.type === "pdf-loading" || status.type === "excel-loading")
      return;
    setStatus({ type: "pdf-loading" });
    try {
      await exportPdf(buildExportPayload());
      setStatus({ type: "success", message: "PDF exported successfully." });
      window.setTimeout(
        () => setStatus((s) => (s.type === "success" ? { type: "idle" } : s)),
        3500
      );
    } catch (err) {
      console.error(err);
      setStatus({
        type: "error",
        message: "Could not generate the PDF. Please try again.",
      });
    }
  }

  async function handleExportExcel() {
    if (status.type === "pdf-loading" || status.type === "excel-loading")
      return;
    setStatus({ type: "excel-loading" });
    try {
      await exportExcel(buildExportPayload());
      setStatus({ type: "success", message: "Excel file exported successfully." });
      window.setTimeout(
        () => setStatus((s) => (s.type === "success" ? { type: "idle" } : s)),
        3500
      );
    } catch (err) {
      console.error(err);
      setStatus({
        type: "error",
        message: "Could not generate the Excel file. Please try again.",
      });
    }
  }

  const isExporting =
    status.type === "pdf-loading" || status.type === "excel-loading";

  return (
    <DashboardShell
      title="Reports"
      subtitle="Profit & loss, trends, and category breakdowns"
    >
      {/* Filter bar */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-card dark:border-navy-800 dark:bg-navy-900">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
            <div className="flex items-center gap-3">
              <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-sky-50 text-sky-600 dark:bg-navy-800 dark:text-sky-400">
                <CalendarDays className="h-6 w-6" />
              </span>
              <div>
                <p className="text-sm font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                  Date Range
                </p>
                <p className="text-base text-navy-900 dark:text-white">
                  Filter the report by period
                </p>
              </div>
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label
                  htmlFor="report-start"
                  className="mb-2 block text-base font-medium text-navy-800 dark:text-slate-200"
                >
                  Start Date
                </label>
                <input
                  id="report-start"
                  type="date"
                  value={pendingStart}
                  min={dataMin}
                  max={dataMax}
                  onChange={(e) => setPendingStart(e.target.value)}
                  className="h-12 w-full rounded-xl border border-slate-300 bg-white px-4 text-base text-navy-900 transition focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-500/20 dark:border-navy-700 dark:bg-navy-900 dark:text-slate-100"
                />
              </div>
              <div>
                <label
                  htmlFor="report-end"
                  className="mb-2 block text-base font-medium text-navy-800 dark:text-slate-200"
                >
                  End Date
                </label>
                <input
                  id="report-end"
                  type="date"
                  value={pendingEnd}
                  min={dataMin}
                  max={dataMax}
                  onChange={(e) => setPendingEnd(e.target.value)}
                  className="h-12 w-full rounded-xl border border-slate-300 bg-white px-4 text-base text-navy-900 transition focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-500/20 dark:border-navy-700 dark:bg-navy-900 dark:text-slate-100"
                />
              </div>
            </div>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button variant="outline" onClick={handleClear} type="button">
              Clear Filter
            </Button>
            <Button onClick={handleApply} type="button">
              Apply Filter
            </Button>
          </div>
        </div>
        {filterError && (
          <div
            role="alert"
            className="mt-4 flex items-center gap-2.5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-base text-red-700 dark:border-red-500/30 dark:bg-red-500/10 dark:text-red-300"
          >
            <AlertTriangle className="h-5 w-5 shrink-0" />
            {filterError}
          </div>
        )}
      </div>

      {/* Export toolbar */}
      <div className="mt-7 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-base text-slate-500 dark:text-slate-400">
            Reporting period
          </p>
          <p className="font-display text-2xl font-bold text-navy-900 dark:text-white">
            {periodLabel}
          </p>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            {filteredTransactions.length} transaction
            {filteredTransactions.length === 1 ? "" : "s"} in this range
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          {status.type === "success" && (
            <span
              role="status"
              className="inline-flex items-center gap-2 rounded-xl bg-emerald-50 px-3.5 py-2 text-base font-medium text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300"
            >
              <CheckCircle2 className="h-5 w-5" />
              {status.message}
            </span>
          )}
          <Button
            variant="outline"
            onClick={handleExportPdf}
            disabled={isExporting}
            type="button"
          >
            {status.type === "pdf-loading" ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                Generating PDF...
              </>
            ) : (
              <>
                <FileDown className="h-5 w-5" />
                Export PDF
              </>
            )}
          </Button>
          <Button
            variant="outline"
            onClick={handleExportExcel}
            disabled={isExporting}
            type="button"
          >
            {status.type === "excel-loading" ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                Generating Excel...
              </>
            ) : (
              <>
                <FileSpreadsheet className="h-5 w-5" />
                Export Excel
              </>
            )}
          </Button>
        </div>
      </div>

      {status.type === "error" && (
        <div
          role="alert"
          className="mt-4 flex items-center gap-2.5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-base text-red-700 dark:border-red-500/30 dark:bg-red-500/10 dark:text-red-300"
        >
          <AlertTriangle className="h-5 w-5 shrink-0" />
          {status.message}
        </div>
      )}

      {/* P&L summary cards */}
      <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Total Income"
          value={formatCurrency(totalIncome)}
          icon={TrendingUp}
          accent="green"
        />
        <StatCard
          label="Total Expenses"
          value={formatCurrency(totalExpenses)}
          icon={TrendingDown}
          accent="red"
        />
        <StatCard
          label="Net Profit"
          value={formatCurrency(profit)}
          icon={Wallet}
          accent="navy"
        />
        <StatCard
          label="Profit Margin"
          value={`${margin.toFixed(1)}%`}
          icon={TrendingUp}
          accent="sky"
        />
      </div>

      {/* Charts */}
      <div className="mt-8 grid gap-6 lg:grid-cols-3">
        <ChartCard
          title="Income vs Expenses"
          subtitle="Monthly comparison"
          className="lg:col-span-2"
        >
          <IncomeExpenseChart data={monthlyRows} />
        </ChartCard>
        <ChartCard title="Expense Breakdown" subtitle="By category">
          <CategoryChart data={categoryData} />
        </ChartCard>
      </div>

      {/* Monthly summary table */}
      <div className="mt-8 rounded-2xl border border-slate-200 bg-white shadow-card dark:border-navy-800 dark:bg-navy-900">
        <div className="border-b border-slate-100 px-6 py-5 dark:border-navy-800">
          <h3 className="font-display text-lg font-bold text-navy-900 dark:text-white">
            Monthly Financial Summary
          </h3>
          <p className="mt-1 text-base text-slate-500 dark:text-slate-400">
            Profit and loss by month
          </p>
        </div>
        <ReportSummary rows={monthlyRows} />
      </div>
    </DashboardShell>
  );
}
