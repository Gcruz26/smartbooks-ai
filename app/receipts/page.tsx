"use client";

// app/receipts/page.tsx
import { useState } from "react";
import { FileText, ReceiptText, Clock, CheckCircle2, AlertCircle } from "lucide-react";
import { DashboardShell } from "@/components/DashboardShell";
import { ReceiptUploader } from "@/components/ReceiptUploader";
import { StatCard } from "@/components/StatCard";
import { Badge, statusToTone, statusLabel } from "@/components/ui/Badge";
import { receipts as seedReceipts } from "@/lib/mockData";
import type { Receipt } from "@/lib/types";
import { formatCurrency, formatDate, cn } from "@/lib/utils";

export default function ReceiptsPage() {
  const [items, setItems] = useState<Receipt[]>(seedReceipts);

  const categorized = items.filter((r) => r.status === "categorized").length;
  const needsReview = items.filter((r) => r.status === "needs_review").length;
  const processing = items.filter((r) => r.status === "processing").length;

  function handleExtracted(result: {
    fileName: string;
    supplier: string;
    date: string;
    amount: number;
    category: string;
    classification: string;
    confidenceScore: number;
  }) {
    const newReceipt: Receipt = {
      id: `r_${Date.now()}`,
      fileName: result.fileName,
      supplier: result.supplier,
      date: result.date,
      amount: result.amount,
      category: result.category,
      classification: result.classification,
      status: result.confidenceScore >= 80 ? "categorized" : "needs_review",
      confidenceScore: result.confidenceScore,
      uploadedAt: new Date().toISOString(),
    };
    setItems((prev) => [newReceipt, ...prev]);
  }

  return (
    <DashboardShell
      title="Receipts & Invoices"
      subtitle="Upload documents and let AI handle the data entry"
    >
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total Receipts" value={String(items.length)} icon={ReceiptText} accent="navy" />
        <StatCard label="Categorized" value={String(categorized)} icon={CheckCircle2} accent="green" />
        <StatCard label="Needs Review" value={String(needsReview)} icon={AlertCircle} accent="red" />
        <StatCard label="Processing" value={String(processing)} icon={Clock} accent="sky" />
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-5">
        {/* Uploader */}
        <div className="lg:col-span-2">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-card dark:border-navy-800 dark:bg-navy-900">
            <h3 className="mb-5 font-display text-lg font-bold text-navy-900 dark:text-white">
              Upload a Receipt
            </h3>
            <ReceiptUploader onExtracted={handleExtracted} />
          </div>
        </div>

        {/* Receipt list */}
        <div className="lg:col-span-3">
          <div className="rounded-2xl border border-slate-200 bg-white shadow-card dark:border-navy-800 dark:bg-navy-900">
            <div className="flex items-center justify-between border-b border-slate-100 px-6 py-5 dark:border-navy-800">
              <h3 className="font-display text-lg font-bold text-navy-900 dark:text-white">
                Uploaded Receipts
              </h3>
              <span className="text-sm font-medium text-slate-500 dark:text-slate-400">
                {items.length} total
              </span>
            </div>
            {items.length === 0 ? (
              <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
                <span className="grid h-14 w-14 place-items-center rounded-2xl bg-slate-100 text-slate-400 dark:bg-navy-800 dark:text-slate-500">
                  <FileText className="h-7 w-7" />
                </span>
                <p className="mt-4 font-display text-lg font-bold text-navy-900 dark:text-white">
                  No receipts yet
                </p>
                <p className="mt-1.5 max-w-sm text-base text-slate-500 dark:text-slate-400">
                  Upload your first receipt and SmartBooks AI will extract the
                  details for you.
                </p>
              </div>
            ) : (
              <ul className="divide-y divide-slate-100 dark:divide-navy-800">
                {items.map((r) => (
                  <li
                    key={r.id}
                    className="flex items-center gap-3.5 px-5 py-5 transition hover:bg-slate-50 dark:hover:bg-navy-800/50 sm:gap-4 sm:px-6"
                  >
                    <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-slate-100 text-slate-500 dark:bg-navy-800 dark:text-slate-300">
                      <FileText className="h-6 w-6" />
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-base font-medium text-navy-900 dark:text-white">
                        {r.supplier}
                      </p>
                      <p className="truncate text-sm text-slate-400">
                        {r.fileName}
                        {r.status !== "processing" &&
                          ` - ${r.category} - ${formatDate(r.date)}`}
                      </p>
                    </div>
                    <div className="hidden text-right sm:block">
                      {r.status !== "processing" && (
                        <p className="font-mono text-base font-semibold text-navy-900 dark:text-white">
                          {formatCurrency(r.amount)}
                        </p>
                      )}
                      {r.confidenceScore > 0 && (
                        <p
                          className={cn(
                            "text-sm font-medium",
                            r.confidenceScore >= 80
                              ? "text-emerald-600 dark:text-emerald-400"
                              : "text-amber-600 dark:text-amber-400"
                          )}
                        >
                          {r.confidenceScore}% confidence
                        </p>
                      )}
                    </div>
                    <Badge tone={statusToTone(r.status)}>
                      {statusLabel(r.status)}
                    </Badge>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </DashboardShell>
  );
}
