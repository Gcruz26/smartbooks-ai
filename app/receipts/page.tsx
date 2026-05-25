"use client";

// app/receipts/page.tsx
import { useMemo, useState } from "react";
import {
  FileText,
  ReceiptText,
  Clock,
  CheckCircle2,
  AlertCircle,
  Search,
  X,
  Eye,
  CircleCheck,
  CircleX,
  Pencil,
  Plus,
  Sparkles,
} from "lucide-react";
import { DashboardShell } from "@/components/DashboardShell";
import { ReceiptUploader } from "@/components/ReceiptUploader";
import { StatCard } from "@/components/StatCard";
import { Badge, statusToTone, statusLabel } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import {
  receipts as seedReceipts,
  transactions as seedTransactions,
  expenseCategories,
  incomeCategories,
  paymentMethods,
} from "@/lib/mockData";
import type {
  Receipt,
  ReceiptStatus,
  DocumentType,
  Transaction,
  TransactionType,
} from "@/lib/types";
import { cn, formatCurrency, formatDate } from "@/lib/utils";
import {
  ALL_DOCUMENT_TYPES,
  ALL_TRANSACTION_TYPES,
  documentTypeBadgeTone,
  documentTypeLabels,
  transactionTypeLabels,
} from "@/lib/accounting";

type ConfidenceFilter = "all" | "high" | "medium" | "low";

const CONFIDENCE_OPTIONS: { value: ConfidenceFilter; label: string }[] = [
  { value: "all", label: "All confidence" },
  { value: "high", label: "High (90%+)" },
  { value: "medium", label: "Medium (70-89%)" },
  { value: "low", label: "Low (<70%)" },
];

const STATUS_OPTIONS: { value: ReceiptStatus | "all"; label: string }[] = [
  { value: "all", label: "All statuses" },
  { value: "processing", label: "Processing" },
  { value: "categorized", label: "Categorized" },
  { value: "needs_review", label: "Needs Review" },
  { value: "approved", label: "Approved" },
  { value: "rejected", label: "Rejected" },
];

function confidenceTier(score: number): "high" | "medium" | "low" {
  if (score >= 90) return "high";
  if (score >= 70) return "medium";
  return "low";
}

function confidenceLabel(score: number): string {
  const tier = confidenceTier(score);
  if (tier === "high") return "High confidence";
  if (tier === "medium") return "Medium confidence";
  return "Low confidence";
}

export default function ReceiptsPage() {
  const [items, setItems] = useState<Receipt[]>(seedReceipts);
  const [transactions, setTransactions] =
    useState<Transaction[]>(seedTransactions);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [flash, setFlash] = useState<string | null>(null);

  // Filters
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<ReceiptStatus | "all">(
    "all"
  );
  const [docFilter, setDocFilter] = useState<DocumentType | "all">("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [confidenceFilter, setConfidenceFilter] =
    useState<ConfidenceFilter>("all");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const allCategories = useMemo(
    () => Array.from(new Set([...incomeCategories, ...expenseCategories])),
    []
  );

  const filtered = useMemo(() => {
    return items.filter((r) => {
      if (statusFilter !== "all" && r.status !== statusFilter) return false;
      if (docFilter !== "all" && r.documentType !== docFilter) return false;
      if (categoryFilter !== "all" && r.category !== categoryFilter)
        return false;
      if (
        confidenceFilter !== "all" &&
        confidenceTier(r.confidenceScore) !== confidenceFilter
      )
        return false;
      if (startDate && r.documentDate < startDate) return false;
      if (endDate && r.documentDate > endDate) return false;
      if (search) {
        const q = search.toLowerCase();
        const hay = `${r.supplier} ${r.fileName} ${r.description} ${r.documentNumber ?? ""}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });
  }, [
    items,
    statusFilter,
    docFilter,
    categoryFilter,
    confidenceFilter,
    startDate,
    endDate,
    search,
  ]);

  const total = items.length;
  const categorized = items.filter(
    (r) => r.status === "categorized" || r.status === "approved"
  ).length;
  const needsReview = items.filter((r) => r.status === "needs_review").length;
  const processing = items.filter((r) => r.status === "processing").length;

  const selected = selectedId
    ? items.find((r) => r.id === selectedId) ?? null
    : null;

  function showFlash(msg: string) {
    setFlash(msg);
    window.setTimeout(() => setFlash(null), 3500);
  }

  function handleExtracted(result: {
    fileName: string;
    supplier: string;
    date: string;
    amount: number;
    category: string;
    classification: string;
    documentType: DocumentType;
    confidenceScore: number;
  }) {
    const newReceipt: Receipt = {
      id: `r_${Date.now()}`,
      fileName: result.fileName,
      uploadedAt: new Date().toISOString(),
      status: result.confidenceScore >= 80 ? "categorized" : "needs_review",
      documentType: result.documentType,
      supplier: result.supplier,
      documentDate: result.date,
      amount: result.amount,
      currency: "USD",
      transactionType: "expense",
      category: result.category,
      classification: result.classification,
      description: `Uploaded receipt from ${result.supplier}`,
      confidenceScore: result.confidenceScore,
      confidenceExplanation:
        result.confidenceScore >= 80
          ? "AI extraction is consistent with known supplier templates."
          : "AI is not fully confident - please review the suggested category.",
    };
    setItems((prev) => [newReceipt, ...prev]);
    showFlash("Receipt uploaded and analysed.");
  }

  function updateReceipt(id: string, patch: Partial<Receipt>) {
    setItems((prev) =>
      prev.map((r) => (r.id === id ? { ...r, ...patch } : r))
    );
  }

  function approveReceipt(id: string) {
    const r = items.find((x) => x.id === id);
    if (!r) return;
    updateReceipt(id, { status: "approved" });
    if (r.linkedTransactionId) {
      setTransactions((prev) =>
        prev.map((t) =>
          t.id === r.linkedTransactionId ? { ...t, status: "paid" } : t
        )
      );
    }
    showFlash("Receipt categorization approved.");
  }

  function markNeedsReview(id: string) {
    updateReceipt(id, { status: "needs_review" });
    showFlash("Receipt marked for manual review.");
  }

  function rejectReceipt(id: string) {
    updateReceipt(id, { status: "rejected" });
    showFlash("Receipt rejected and excluded from reports.");
  }

  function createTransactionFromReceipt(r: Receipt): Transaction {
    const tx: Transaction = {
      id: `t_${Date.now()}`,
      date: r.documentDate,
      type: r.transactionType,
      documentType: r.documentType,
      category: r.category,
      description: r.description || `From receipt ${r.fileName}`,
      amount: r.amount,
      paymentMethod: r.paymentMethod ?? "Bank Transfer",
      status: "paid",
      client: r.supplier,
    };
    setTransactions((prev) => [tx, ...prev]);
    updateReceipt(r.id, { linkedTransactionId: tx.id });
    showFlash(`Transaction ${tx.id} created from receipt.`);
    return tx;
  }

  function saveEdit(id: string, patch: Partial<Receipt>) {
    updateReceipt(id, patch);
    const updated = { ...(items.find((x) => x.id === id) ?? null), ...patch } as
      | Receipt
      | null;
    if (updated?.linkedTransactionId) {
      setTransactions((prev) =>
        prev.map((t) =>
          t.id === updated.linkedTransactionId
            ? {
                ...t,
                date: patch.documentDate ?? t.date,
                type: patch.transactionType ?? t.type,
                documentType: patch.documentType ?? t.documentType,
                category: patch.category ?? t.category,
                description: patch.description ?? t.description,
                amount: patch.amount ?? t.amount,
              }
            : t
        )
      );
    }
    showFlash("Receipt categorization updated successfully.");
  }

  function clearFilters() {
    setSearch("");
    setStatusFilter("all");
    setDocFilter("all");
    setCategoryFilter("all");
    setConfidenceFilter("all");
    setStartDate("");
    setEndDate("");
  }

  const linkedTx = selected?.linkedTransactionId
    ? transactions.find((t) => t.id === selected.linkedTransactionId)
    : undefined;

  return (
    <DashboardShell
      title="Receipts & Invoices"
      subtitle="Upload, review, and approve AI-categorized documents."
    >
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Total Receipts"
          value={String(total)}
          icon={ReceiptText}
          accent="navy"
        />
        <StatCard
          label="Categorized"
          value={String(categorized)}
          icon={CheckCircle2}
          accent="green"
        />
        <StatCard
          label="Needs Review"
          value={String(needsReview)}
          icon={AlertCircle}
          accent="red"
        />
        <StatCard
          label="Processing"
          value={String(processing)}
          icon={Clock}
          accent="sky"
        />
      </div>

      {flash && (
        <div
          role="status"
          className="mt-5 flex items-center gap-2.5 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-base font-medium text-emerald-700 dark:border-emerald-500/30 dark:bg-emerald-500/10 dark:text-emerald-300"
        >
          <CheckCircle2 className="h-5 w-5" />
          {flash}
        </div>
      )}

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

        {/* Receipt list + filters */}
        <div className="lg:col-span-3">
          <div className="rounded-2xl border border-slate-200 bg-white shadow-card dark:border-navy-800 dark:bg-navy-900">
            {/* Filter bar */}
            <div className="border-b border-slate-100 px-5 py-4 dark:border-navy-800">
              <div className="relative">
                <Search className="pointer-events-none absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                <input
                  type="search"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search by supplier, file, or document number..."
                  className="h-11 w-full rounded-xl border border-slate-200 bg-white pl-11 pr-3 text-base text-navy-900 placeholder:text-slate-400 focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-500/20 dark:border-navy-700 dark:bg-navy-900 dark:text-slate-100"
                />
              </div>
              <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                <Select
                  aria-label="Status"
                  value={statusFilter}
                  onChange={(e) =>
                    setStatusFilter(e.target.value as ReceiptStatus | "all")
                  }
                  options={STATUS_OPTIONS}
                />
                <Select
                  aria-label="Document type"
                  value={docFilter}
                  onChange={(e) =>
                    setDocFilter(e.target.value as DocumentType | "all")
                  }
                  options={[
                    { value: "all", label: "All documents" },
                    ...ALL_DOCUMENT_TYPES.map((d) => ({
                      value: d,
                      label: documentTypeLabels[d],
                    })),
                  ]}
                />
                <Select
                  aria-label="Category"
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  options={[
                    { value: "all", label: "All categories" },
                    ...allCategories.map((c) => ({ value: c, label: c })),
                  ]}
                />
                <Select
                  aria-label="AI confidence"
                  value={confidenceFilter}
                  onChange={(e) =>
                    setConfidenceFilter(e.target.value as ConfidenceFilter)
                  }
                  options={CONFIDENCE_OPTIONS}
                />
                <Input
                  type="date"
                  aria-label="Start date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                />
                <Input
                  type="date"
                  aria-label="End date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                />
              </div>
              <div className="mt-3 flex items-center justify-between">
                <span className="text-sm text-slate-500 dark:text-slate-400">
                  {filtered.length} of {items.length} receipts
                </span>
                <button
                  type="button"
                  onClick={clearFilters}
                  className="text-sm font-semibold text-sky-700 transition hover:underline dark:text-sky-300"
                >
                  Clear filters
                </button>
              </div>
            </div>

            {filtered.length === 0 ? (
              <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
                <span className="grid h-14 w-14 place-items-center rounded-2xl bg-slate-100 text-slate-400 dark:bg-navy-800 dark:text-slate-500">
                  <FileText className="h-7 w-7" />
                </span>
                <p className="mt-4 font-display text-lg font-bold text-navy-900 dark:text-white">
                  No receipts match these filters
                </p>
                <p className="mt-1.5 max-w-sm text-base text-slate-500 dark:text-slate-400">
                  Try clearing filters or upload a new document.
                </p>
              </div>
            ) : (
              <ul className="divide-y divide-slate-100 dark:divide-navy-800">
                {filtered.map((r) => {
                  const needsAttention =
                    r.status === "needs_review" || r.status === "rejected";
                  return (
                    <li key={r.id}>
                      <button
                        type="button"
                        onClick={() => setSelectedId(r.id)}
                        className={cn(
                          "flex w-full items-center gap-4 px-5 py-5 text-left transition hover:bg-slate-50 dark:hover:bg-navy-800/50",
                          needsAttention &&
                            "bg-amber-50/40 hover:bg-amber-50 dark:bg-amber-500/5 dark:hover:bg-amber-500/10"
                        )}
                      >
                        <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-slate-100 text-slate-500 dark:bg-navy-800 dark:text-slate-300">
                          <FileText className="h-6 w-6" />
                        </span>
                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <p className="truncate text-base font-medium text-navy-900 dark:text-white">
                              {r.supplier}
                            </p>
                            <Badge
                              tone={documentTypeBadgeTone[r.documentType]}
                            >
                              {documentTypeLabels[r.documentType]}
                            </Badge>
                          </div>
                          <p className="truncate text-sm text-slate-500 dark:text-slate-400">
                            {r.fileName}
                            {r.status !== "processing" &&
                              ` - ${r.category} - ${formatDate(r.documentDate)}`}
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
                                confidenceTier(r.confidenceScore) === "high" &&
                                  "text-emerald-600 dark:text-emerald-400",
                                confidenceTier(r.confidenceScore) ===
                                  "medium" &&
                                  "text-amber-600 dark:text-amber-400",
                                confidenceTier(r.confidenceScore) === "low" &&
                                  "text-red-600 dark:text-red-400"
                              )}
                            >
                              {r.confidenceScore}% confidence
                            </p>
                          )}
                        </div>
                        <Badge tone={statusToTone(r.status)}>
                          {statusLabel(r.status)}
                        </Badge>
                      </button>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        </div>
      </div>

      {selected && (
        <ReceiptDetailsModal
          receipt={selected}
          linkedTransaction={linkedTx}
          onClose={() => setSelectedId(null)}
          onApprove={() => approveReceipt(selected.id)}
          onMarkReview={() => markNeedsReview(selected.id)}
          onReject={() => rejectReceipt(selected.id)}
          onCreateTransaction={() => createTransactionFromReceipt(selected)}
          onSaveEdit={(patch) => saveEdit(selected.id, patch)}
        />
      )}
    </DashboardShell>
  );
}

/* ------------------------------------------------------------------ */
/*  Details Modal                                                       */
/* ------------------------------------------------------------------ */

interface ReceiptDetailsModalProps {
  receipt: Receipt;
  linkedTransaction?: Transaction;
  onClose: () => void;
  onApprove: () => void;
  onMarkReview: () => void;
  onReject: () => void;
  onCreateTransaction: () => void;
  onSaveEdit: (patch: Partial<Receipt>) => void;
}

function ReceiptDetailsModal({
  receipt,
  linkedTransaction,
  onClose,
  onApprove,
  onMarkReview,
  onReject,
  onCreateTransaction,
  onSaveEdit,
}: ReceiptDetailsModalProps) {
  const [editing, setEditing] = useState(false);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`Receipt ${receipt.fileName}`}
      className="fixed inset-0 z-50 flex items-center justify-center bg-navy-950/50 px-4 py-6 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="animate-fade-up flex max-h-[92vh] w-full max-w-4xl flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-card-hover dark:border-navy-800 dark:bg-navy-900"
      >
        {/* Header */}
        <div className="flex items-start justify-between border-b border-slate-100 px-6 py-5 dark:border-navy-800">
          <div className="min-w-0">
            <p className="text-sm font-semibold uppercase tracking-wide text-sky-600">
              Receipt
            </p>
            <h2 className="font-display text-2xl font-bold text-navy-900 dark:text-white">
              {receipt.supplier}
            </h2>
            <div className="mt-2 flex flex-wrap items-center gap-2">
              <Badge tone={statusToTone(receipt.status)}>
                {statusLabel(receipt.status)}
              </Badge>
              <Badge tone={documentTypeBadgeTone[receipt.documentType]}>
                {documentTypeLabels[receipt.documentType]}
              </Badge>
              <span className="text-sm text-slate-500 dark:text-slate-400">
                {receipt.fileName}
              </span>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 dark:hover:bg-navy-800"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-6 py-6">
          {editing ? (
            <EditCategorizationForm
              receipt={receipt}
              onCancel={() => setEditing(false)}
              onSave={(patch) => {
                onSaveEdit(patch);
                setEditing(false);
              }}
            />
          ) : (
            <div className="space-y-7">
              {/* Overview */}
              <section>
                <h3 className="font-display text-lg font-bold text-navy-900 dark:text-white">
                  Receipt Overview
                </h3>
                <div className="mt-3 grid gap-x-6 gap-y-3 sm:grid-cols-2">
                  <Field label="Receipt ID" value={receipt.id} mono />
                  <Field label="Uploaded" value={formatDate(receipt.uploadedAt.slice(0, 10))} />
                  <Field
                    label="AI Confidence"
                    value={`${receipt.confidenceScore}% - ${confidenceLabel(
                      receipt.confidenceScore
                    )}`}
                  />
                  <Field
                    label="Status"
                    value={statusLabel(receipt.status)}
                  />
                </div>
              </section>

              {/* Extracted document info */}
              <section>
                <h3 className="font-display text-lg font-bold text-navy-900 dark:text-white">
                  Extracted Document Information
                </h3>
                <div className="mt-3 grid gap-x-6 gap-y-3 sm:grid-cols-2">
                  <Field
                    label="Document Type"
                    value={documentTypeLabels[receipt.documentType]}
                  />
                  <Field label="Supplier / Client" value={receipt.supplier} />
                  <Field label="Tax ID / NIF" value={receipt.taxId ?? "-"} />
                  <Field
                    label="Document Number"
                    value={receipt.documentNumber ?? "-"}
                  />
                  <Field
                    label="Document Date"
                    value={formatDate(receipt.documentDate)}
                  />
                  <Field
                    label="Due Date"
                    value={receipt.dueDate ? formatDate(receipt.dueDate) : "-"}
                  />
                  <Field
                    label="Amount"
                    value={formatCurrency(receipt.amount, receipt.currency)}
                    highlight
                  />
                  <Field
                    label="Tax / VAT Amount"
                    value={
                      receipt.taxAmount !== undefined
                        ? formatCurrency(receipt.taxAmount, receipt.currency)
                        : "-"
                    }
                  />
                  <Field label="Currency" value={receipt.currency} />
                  <Field
                    label="Payment Method"
                    value={receipt.paymentMethod ?? "-"}
                  />
                </div>
              </section>

              {/* Suggested classification */}
              <section>
                <h3 className="font-display text-lg font-bold text-navy-900 dark:text-white">
                  Suggested Accounting Classification
                </h3>
                <div className="mt-3 grid gap-x-6 gap-y-3 sm:grid-cols-2">
                  <Field
                    label="Transaction Type"
                    value={transactionTypeLabels[receipt.transactionType]}
                  />
                  <Field label="Category" value={receipt.category} />
                  <Field
                    label="Suggested Account"
                    value={receipt.suggestedAccount ?? "-"}
                  />
                  <Field label="Classification" value={receipt.classification} />
                </div>
                <div className="mt-3">
                  <FieldBlock label="Description" value={receipt.description} />
                </div>
                <div className="mt-3 flex items-start gap-2.5 rounded-xl bg-sky-50 px-4 py-3 text-sm text-sky-800 dark:bg-sky-500/10 dark:text-sky-200">
                  <Sparkles className="mt-0.5 h-4 w-4 shrink-0" />
                  <span>{receipt.confidenceExplanation}</span>
                </div>
              </section>

              {/* Linked transaction */}
              <section>
                <h3 className="font-display text-lg font-bold text-navy-900 dark:text-white">
                  Linked Transaction
                </h3>
                {linkedTransaction ? (
                  <div className="mt-3 rounded-2xl border border-slate-200 bg-slate-50 p-5 dark:border-navy-700 dark:bg-navy-800/40">
                    <div className="grid gap-x-6 gap-y-3 sm:grid-cols-2">
                      <Field label="Transaction ID" value={linkedTransaction.id} mono />
                      <Field
                        label="Date"
                        value={formatDate(linkedTransaction.date)}
                      />
                      <Field
                        label="Type"
                        value={transactionTypeLabels[linkedTransaction.type]}
                      />
                      <Field
                        label="Document Type"
                        value={documentTypeLabels[linkedTransaction.documentType]}
                      />
                      <Field label="Category" value={linkedTransaction.category} />
                      <Field
                        label="Status"
                        value={statusLabel(linkedTransaction.status)}
                      />
                      <Field
                        label="Amount"
                        value={formatCurrency(linkedTransaction.amount)}
                        highlight
                      />
                      <FieldBlock
                        label="Description"
                        value={linkedTransaction.description}
                      />
                    </div>
                  </div>
                ) : (
                  <div className="mt-3 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-5 py-4 text-base text-slate-600 dark:border-navy-700 dark:bg-navy-800/40 dark:text-slate-300">
                    <span>No transaction is linked to this receipt yet.</span>
                    <Button
                      type="button"
                      onClick={onCreateTransaction}
                      size="sm"
                    >
                      <Plus className="h-5 w-5" />
                      Create Transaction
                    </Button>
                  </div>
                )}
              </section>

              {/* Preview */}
              <section>
                <h3 className="font-display text-lg font-bold text-navy-900 dark:text-white">
                  Document Preview
                </h3>
                <div className="mt-3 grid gap-3 sm:grid-cols-[1fr_1.4fr]">
                  <div className="flex aspect-[3/4] flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50 text-center text-slate-400 dark:border-navy-700 dark:bg-navy-950">
                    <FileText className="h-10 w-10" />
                    <p className="mt-3 text-sm font-medium text-slate-600 dark:text-slate-300">
                      {receipt.fileName}
                    </p>
                    <p className="mt-1 text-xs">
                      (Mock preview - real file rendering not enabled)
                    </p>
                  </div>
                  <pre className="overflow-auto whitespace-pre-wrap rounded-2xl border border-slate-200 bg-white p-4 font-mono text-sm text-slate-700 dark:border-navy-700 dark:bg-navy-950 dark:text-slate-300">
                    {receipt.extractedText ??
                      "No OCR text available for this receipt."}
                  </pre>
                </div>
              </section>
            </div>
          )}
        </div>

        {/* Footer actions */}
        {!editing && (
          <div className="flex flex-wrap items-center justify-end gap-2 border-t border-slate-100 px-6 py-4 dark:border-navy-800">
            <button
              type="button"
              onClick={onReject}
              className="inline-flex h-11 items-center gap-1.5 rounded-lg border border-red-200 px-4 text-base font-semibold text-red-700 transition hover:bg-red-50 dark:border-red-500/30 dark:text-red-300 dark:hover:bg-red-500/10"
            >
              <CircleX className="h-5 w-5" />
              Reject
            </button>
            <button
              type="button"
              onClick={onMarkReview}
              className="inline-flex h-11 items-center gap-1.5 rounded-lg border border-amber-200 px-4 text-base font-semibold text-amber-700 transition hover:bg-amber-50 dark:border-amber-500/30 dark:text-amber-300 dark:hover:bg-amber-500/10"
            >
              <Eye className="h-5 w-5" />
              Mark Needs Review
            </button>
            <button
              type="button"
              onClick={() => setEditing(true)}
              className="inline-flex h-11 items-center gap-1.5 rounded-lg border border-slate-200 px-4 text-base font-semibold text-slate-700 transition hover:bg-slate-50 dark:border-navy-700 dark:text-slate-200 dark:hover:bg-navy-800"
            >
              <Pencil className="h-5 w-5" />
              Edit
            </button>
            <Button type="button" onClick={onApprove}>
              <CircleCheck className="h-5 w-5" />
              Approve Categorization
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Edit Categorization form                                            */
/* ------------------------------------------------------------------ */

function EditCategorizationForm({
  receipt,
  onCancel,
  onSave,
}: {
  receipt: Receipt;
  onCancel: () => void;
  onSave: (patch: Partial<Receipt>) => void;
}) {
  const [documentType, setDocumentType] = useState<DocumentType>(
    receipt.documentType
  );
  const [transactionType, setTransactionType] = useState<TransactionType>(
    receipt.transactionType
  );
  const [category, setCategory] = useState(receipt.category);
  const [description, setDescription] = useState(receipt.description);
  const [amount, setAmount] = useState(String(receipt.amount));
  const [documentDate, setDocumentDate] = useState(receipt.documentDate);
  const [status, setStatus] = useState<ReceiptStatus>(receipt.status);
  const [paymentMethod, setPaymentMethod] = useState(
    receipt.paymentMethod ?? paymentMethods[0]
  );
  const [error, setError] = useState<string | null>(null);

  const categories =
    transactionType === "income" ? incomeCategories : expenseCategories;

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!category.trim()) {
      setError("Category is required.");
      return;
    }
    const numericAmount = parseFloat(amount);
    if (isNaN(numericAmount) || numericAmount < 0) {
      setError("Amount must be a positive number.");
      return;
    }
    onSave({
      documentType,
      transactionType,
      category,
      description: description.trim() || receipt.description,
      amount: numericAmount,
      documentDate,
      status,
      paymentMethod,
    });
  }

  return (
    <form onSubmit={handleSubmit}>
      <h3 className="font-display text-lg font-bold text-navy-900 dark:text-white">
        Edit categorization
      </h3>
      <p className="mt-1 text-base text-slate-500 dark:text-slate-400">
        Adjust the AI suggestions before approving. Changes apply to the linked
        transaction too.
      </p>
      <div className="mt-5 grid gap-5 sm:grid-cols-2">
        <Select
          label="Document Type"
          value={documentType}
          onChange={(e) => setDocumentType(e.target.value as DocumentType)}
          options={ALL_DOCUMENT_TYPES.map((d) => ({
            value: d,
            label: documentTypeLabels[d],
          }))}
        />
        <Select
          label="Transaction Type"
          value={transactionType}
          onChange={(e) => {
            const t = e.target.value as TransactionType;
            setTransactionType(t);
            const cats =
              t === "income" ? incomeCategories : expenseCategories;
            if (!cats.includes(category)) setCategory(cats[0]);
          }}
          options={ALL_TRANSACTION_TYPES.map((t) => ({
            value: t,
            label: transactionTypeLabels[t],
          }))}
        />
        <Select
          label="Category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          options={categories.map((c) => ({ value: c, label: c }))}
        />
        <Input
          label="Document Date"
          type="date"
          value={documentDate}
          onChange={(e) => setDocumentDate(e.target.value)}
        />
        <Input
          label="Amount"
          type="number"
          min="0"
          step="0.01"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
        <Select
          label="Payment Method"
          value={paymentMethod}
          onChange={(e) => setPaymentMethod(e.target.value)}
          options={paymentMethods.map((m) => ({ value: m, label: m }))}
        />
        <Select
          label="Status"
          value={status}
          onChange={(e) => setStatus(e.target.value as ReceiptStatus)}
          options={[
            { value: "categorized", label: "Categorized" },
            { value: "needs_review", label: "Needs Review" },
            { value: "approved", label: "Approved" },
            { value: "rejected", label: "Rejected" },
            { value: "processing", label: "Processing" },
          ]}
        />
        <div className="sm:col-span-2">
          <label
            htmlFor="receipt-desc"
            className="mb-2 block text-base font-medium text-navy-800 dark:text-slate-200"
          >
            Description
          </label>
          <textarea
            id="receipt-desc"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={2}
            className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-base text-navy-900 placeholder:text-slate-400 transition focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-500/20 dark:border-navy-700 dark:bg-navy-900 dark:text-slate-100"
          />
        </div>
      </div>

      {error && (
        <p
          role="alert"
          className="mt-4 rounded-lg border border-red-200 bg-red-50 px-4 py-2.5 text-base text-red-700 dark:border-red-500/30 dark:bg-red-500/10 dark:text-red-300"
        >
          {error}
        </p>
      )}

      <div className="mt-6 flex justify-end gap-3">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">
          <CircleCheck className="h-5 w-5" />
          Save categorization
        </Button>
      </div>
    </form>
  );
}

/* ------------------------------------------------------------------ */
/*  Field helpers                                                       */
/* ------------------------------------------------------------------ */

function Field({
  label,
  value,
  mono,
  highlight,
}: {
  label: string;
  value: string;
  mono?: boolean;
  highlight?: boolean;
}) {
  return (
    <div>
      <p className="text-sm font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">
        {label}
      </p>
      <p
        className={cn(
          "mt-1 text-base",
          mono && "font-mono",
          highlight
            ? "font-display text-xl font-bold text-navy-900 dark:text-white"
            : "font-medium text-navy-900 dark:text-white"
        )}
      >
        {value}
      </p>
    </div>
  );
}

function FieldBlock({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-sm font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">
        {label}
      </p>
      <p className="mt-1 whitespace-pre-line text-base text-slate-700 dark:text-slate-200">
        {value}
      </p>
    </div>
  );
}
