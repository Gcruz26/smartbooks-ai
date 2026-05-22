// components/TransactionTable.tsx
import { ArrowDownLeft, ArrowUpRight } from "lucide-react";
import type { Transaction } from "@/lib/types";
import { formatCurrency, formatDate, cn } from "@/lib/utils";
import { Badge, statusToTone, statusLabel } from "@/components/ui/Badge";

interface TransactionTableProps {
  transactions: Transaction[];
  compact?: boolean;
}

export function TransactionTable({
  transactions,
  compact = false,
}: TransactionTableProps) {
  if (transactions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center px-6 py-14 text-center">
        <span className="grid h-14 w-14 place-items-center rounded-2xl bg-slate-100 text-slate-400 dark:bg-navy-800 dark:text-slate-500">
          <ArrowUpRight className="h-7 w-7" />
        </span>
        <p className="mt-4 font-display text-lg font-bold text-navy-900 dark:text-white">
          No transactions yet
        </p>
        <p className="mt-1.5 max-w-sm text-base text-slate-500 dark:text-slate-400">
          Add your first income or expense to start tracking cash flow.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[720px] text-base">
        <thead>
          <tr className="border-b border-slate-200 text-left text-sm font-semibold uppercase tracking-wide text-slate-500 dark:border-navy-800 dark:text-slate-400">
            <th className="px-5 py-4 font-semibold">Description</th>
            {!compact && <th className="px-5 py-4 font-semibold">Category</th>}
            <th className="px-5 py-4 font-semibold">Date</th>
            {!compact && (
              <th className="px-5 py-4 font-semibold">Method</th>
            )}
            <th className="px-5 py-4 font-semibold">Status</th>
            <th className="px-5 py-4 text-right font-semibold">Amount</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 dark:divide-navy-800">
          {transactions.map((t) => {
            const isIncome = t.type === "income";
            return (
              <tr
                key={t.id}
                className="transition hover:bg-slate-50 dark:hover:bg-navy-800/50"
              >
                <td className="px-5 py-4">
                  <div className="flex items-center gap-3.5">
                    <span
                      className={cn(
                        "grid h-10 w-10 shrink-0 place-items-center rounded-lg",
                        isIncome
                          ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-300"
                          : "bg-slate-200/70 text-slate-600 dark:bg-navy-800 dark:text-slate-300"
                      )}
                    >
                      {isIncome ? (
                        <ArrowDownLeft className="h-5 w-5" />
                      ) : (
                        <ArrowUpRight className="h-5 w-5" />
                      )}
                    </span>
                    <div className="min-w-0">
                      <p className="truncate font-medium text-navy-900 dark:text-white">
                        {t.description}
                      </p>
                      {t.client && (
                        <p className="truncate text-sm text-slate-400">
                          {t.client}
                        </p>
                      )}
                    </div>
                  </div>
                </td>
                {!compact && (
                  <td className="px-5 py-4 text-slate-600 dark:text-slate-300">
                    {t.category}
                  </td>
                )}
                <td className="px-5 py-4 text-slate-500 dark:text-slate-400">
                  {formatDate(t.date)}
                </td>
                {!compact && (
                  <td className="px-5 py-4 text-slate-500 dark:text-slate-400">
                    {t.paymentMethod}
                  </td>
                )}
                <td className="px-5 py-4">
                  <Badge tone={statusToTone(t.status)}>
                    {statusLabel(t.status)}
                  </Badge>
                </td>
                <td
                  className={cn(
                    "px-5 py-4 text-right font-mono font-semibold",
                    isIncome
                      ? "text-emerald-600 dark:text-emerald-400"
                      : "text-navy-900 dark:text-white"
                  )}
                >
                  {isIncome ? "+" : "-"}
                  {formatCurrency(t.amount)}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
