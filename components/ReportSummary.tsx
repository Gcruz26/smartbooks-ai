// components/ReportSummary.tsx
import type { MonthlyReportRow } from "@/lib/types";
import { formatCurrency, cn } from "@/lib/utils";

export function ReportSummary({ rows }: { rows: MonthlyReportRow[] }) {
  if (rows.length === 0) {
    return (
      <div className="px-6 py-14 text-center text-base text-slate-500 dark:text-slate-400">
        No reporting data available yet.
      </div>
    );
  }

  const totals = rows.reduce(
    (acc, r) => ({
      income: acc.income + r.income,
      expenses: acc.expenses + r.expenses,
      profit: acc.profit + r.profit,
    }),
    { income: 0, expenses: 0, profit: 0 }
  );

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[560px] text-base">
        <thead>
          <tr className="border-b border-slate-200 text-left text-sm font-semibold uppercase tracking-wide text-slate-500 dark:border-navy-800 dark:text-slate-400">
            <th className="px-5 py-4">Month</th>
            <th className="px-5 py-4 text-right">Income</th>
            <th className="px-5 py-4 text-right">Expenses</th>
            <th className="px-5 py-4 text-right">Profit</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 dark:divide-navy-800">
          {rows.map((r) => (
            <tr
              key={r.month}
              className="transition hover:bg-slate-50 dark:hover:bg-navy-800/50"
            >
              <td className="px-5 py-4 font-medium text-navy-900 dark:text-white">
                {r.month}
              </td>
              <td className="px-5 py-4 text-right font-mono text-emerald-600 dark:text-emerald-400">
                {formatCurrency(r.income)}
              </td>
              <td className="px-5 py-4 text-right font-mono text-slate-600 dark:text-slate-300">
                {formatCurrency(r.expenses)}
              </td>
              <td
                className={cn(
                  "px-5 py-4 text-right font-mono font-semibold",
                  r.profit >= 0
                    ? "text-navy-900 dark:text-white"
                    : "text-red-600 dark:text-red-400"
                )}
              >
                {formatCurrency(r.profit)}
              </td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr className="border-t-2 border-slate-200 font-semibold dark:border-navy-700">
            <td className="px-5 py-4 text-navy-900 dark:text-white">Total</td>
            <td className="px-5 py-4 text-right font-mono text-emerald-600 dark:text-emerald-400">
              {formatCurrency(totals.income)}
            </td>
            <td className="px-5 py-4 text-right font-mono text-slate-600 dark:text-slate-300">
              {formatCurrency(totals.expenses)}
            </td>
            <td className="px-5 py-4 text-right font-mono text-navy-900 dark:text-white">
              {formatCurrency(totals.profit)}
            </td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
}
