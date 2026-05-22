// components/ClientTable.tsx
import { Mail, Phone, Users } from "lucide-react";
import type { Client } from "@/lib/types";
import { formatCurrency, cn } from "@/lib/utils";
import { Badge, statusToTone, statusLabel } from "@/components/ui/Badge";

export function ClientTable({ clients }: { clients: Client[] }) {
  if (clients.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center px-6 py-14 text-center">
        <span className="grid h-14 w-14 place-items-center rounded-2xl bg-slate-100 text-slate-400 dark:bg-navy-800 dark:text-slate-500">
          <Users className="h-7 w-7" />
        </span>
        <p className="mt-4 font-display text-lg font-bold text-navy-900 dark:text-white">
          No clients yet
        </p>
        <p className="mt-1.5 max-w-sm text-base text-slate-500 dark:text-slate-400">
          Add a client to track invoices and outstanding balances.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[800px] text-base">
        <thead>
          <tr className="border-b border-slate-200 text-left text-sm font-semibold uppercase tracking-wide text-slate-500 dark:border-navy-800 dark:text-slate-400">
            <th className="px-5 py-4">Client</th>
            <th className="px-5 py-4">Contact</th>
            <th className="px-5 py-4">Business Type</th>
            <th className="px-5 py-4 text-right">Total Billed</th>
            <th className="px-5 py-4 text-right">Outstanding</th>
            <th className="px-5 py-4">Status</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 dark:divide-navy-800">
          {clients.map((c) => (
            <tr
              key={c.id}
              className="transition hover:bg-slate-50 dark:hover:bg-navy-800/50"
            >
              <td className="px-5 py-4">
                <div className="flex items-center gap-3.5">
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-navy-800 text-sm font-semibold text-white">
                    {c.name
                      .split(" ")
                      .slice(0, 2)
                      .map((w) => w[0])
                      .join("")}
                  </span>
                  <span className="font-medium text-navy-900 dark:text-white">
                    {c.name}
                  </span>
                </div>
              </td>
              <td className="px-5 py-4">
                <div className="space-y-1 text-slate-500 dark:text-slate-400">
                  <p className="flex items-center gap-1.5 text-sm">
                    <Mail className="h-4 w-4" /> {c.email}
                  </p>
                  <p className="flex items-center gap-1.5 text-sm">
                    <Phone className="h-4 w-4" /> {c.phone}
                  </p>
                </div>
              </td>
              <td className="px-5 py-4 text-slate-600 dark:text-slate-300">
                {c.businessType}
              </td>
              <td className="px-5 py-4 text-right font-mono font-semibold text-navy-900 dark:text-white">
                {formatCurrency(c.totalBilled)}
              </td>
              <td
                className={cn(
                  "px-5 py-4 text-right font-mono font-semibold",
                  c.outstandingBalance > 0
                    ? "text-red-600 dark:text-red-400"
                    : "text-slate-400"
                )}
              >
                {formatCurrency(c.outstandingBalance)}
              </td>
              <td className="px-5 py-4">
                <Badge tone={statusToTone(c.status)}>
                  {statusLabel(c.status)}
                </Badge>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
