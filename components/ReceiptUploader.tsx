"use client";

// components/ReceiptUploader.tsx
import { useRef, useState } from "react";
import { UploadCloud, FileText, Loader2, Sparkles, Check } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { formatCurrency, cn } from "@/lib/utils";
import type { DocumentType } from "@/lib/types";
import {
  documentTypeBadgeTone,
  documentTypeLabels,
} from "@/lib/accounting";
import { Badge } from "@/components/ui/Badge";

interface ExtractionResult {
  fileName: string;
  supplier: string;
  date: string;
  amount: number;
  category: string;
  classification: string;
  documentType: DocumentType;
  confidenceScore: number;
}

// Mock extraction templates the simulated AI cycles through.
const mockResults: Omit<ExtractionResult, "fileName">[] = [
  {
    supplier: "Office Supplies Store",
    date: "2026-05-20",
    amount: 45.75,
    category: "Office Expenses",
    classification: "Operating Expense - Supplies",
    documentType: "invoice",
    confidenceScore: 94,
  },
  {
    supplier: "Highland Coffee Roasters",
    date: "2026-05-19",
    amount: 312.4,
    category: "Cost of Goods",
    classification: "Cost of Goods Sold",
    documentType: "invoice_receipt",
    confidenceScore: 88,
  },
  {
    supplier: "Cabo Verde Electric Co.",
    date: "2026-05-18",
    amount: 198.2,
    category: "Utilities",
    classification: "Operating Expense - Utilities",
    documentType: "receipt",
    confidenceScore: 96,
  },
];

interface ReceiptUploaderProps {
  onExtracted?: (result: ExtractionResult) => void;
}

export function ReceiptUploader({ onExtracted }: ReceiptUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [result, setResult] = useState<ExtractionResult | null>(null);

  function handleFiles(files: FileList | null) {
    const file = files?.[0];
    const fileName = file?.name ?? `receipt-${Date.now()}.jpg`;
    setProcessing(true);
    setResult(null);

    // Simulate AI processing latency + extraction.
    setTimeout(() => {
      const template =
        mockResults[Math.floor(Math.random() * mockResults.length)];
      const extracted: ExtractionResult = { fileName, ...template };
      setResult(extracted);
      setProcessing(false);
      onExtracted?.(extracted);
    }, 1800);
  }

  return (
    <div className="space-y-6">
      {/* Drop zone */}
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragging(false);
          handleFiles(e.dataTransfer.files);
        }}
        onClick={() => inputRef.current?.click()}
        className={cn(
          "flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed px-6 py-14 text-center transition",
          dragging
            ? "border-sky-500 bg-sky-50 dark:bg-sky-500/10"
            : "border-slate-300 bg-slate-50 hover:border-sky-400 hover:bg-slate-100 dark:border-navy-700 dark:bg-navy-900 dark:hover:border-sky-500"
        )}
      >
        <input
          ref={inputRef}
          type="file"
          accept="image/*,.pdf"
          className="hidden"
          onChange={(e) => handleFiles(e.target.files)}
        />
        <span className="grid h-16 w-16 place-items-center rounded-2xl bg-navy-800 text-white">
          <UploadCloud className="h-8 w-8" />
        </span>
        <p className="mt-5 font-display text-lg font-bold text-navy-900 dark:text-white">
          Drag &amp; drop your receipt here
        </p>
        <p className="mt-1.5 text-base text-slate-500 dark:text-slate-400">
          or click to browse - JPG, PNG, or PDF up to 10MB
        </p>
        <Button
          className="mt-6"
          variant="secondary"
          onClick={(e) => {
            e.stopPropagation();
            inputRef.current?.click();
          }}
        >
          <UploadCloud className="h-5 w-5" />
          Upload Receipt
        </Button>
      </div>

      {/* Processing state */}
      {processing && (
        <div className="flex items-center gap-3.5 rounded-2xl border border-sky-200 bg-sky-50 px-6 py-5 dark:border-sky-500/30 dark:bg-sky-500/10">
          <Loader2 className="h-6 w-6 animate-spin text-sky-600 dark:text-sky-300" />
          <div>
            <p className="text-base font-semibold text-navy-900 dark:text-white">
              Analyzing receipt with AI...
            </p>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Extracting supplier, amount, and category
            </p>
          </div>
        </div>
      )}

      {/* Extraction result */}
      {result && !processing && (
        <div className="animate-fade-up overflow-hidden rounded-2xl border border-emerald-200 bg-white shadow-card dark:border-emerald-500/30 dark:bg-navy-900">
          <div className="flex items-center gap-2 border-b border-slate-100 bg-emerald-50/60 px-6 py-4 dark:border-navy-800 dark:bg-emerald-500/10">
            <Check className="h-5 w-5 text-emerald-600 dark:text-emerald-300" />
            <p className="text-base font-semibold text-navy-900 dark:text-white">
              Extraction complete
            </p>
            <span className="ml-auto inline-flex items-center gap-1 rounded-full bg-sky-500/10 px-3 py-1 text-sm font-semibold text-sky-700 dark:text-sky-300">
              <Sparkles className="h-3.5 w-3.5" />
              {result.confidenceScore}% confidence
            </span>
          </div>
          <div className="grid grid-cols-2 gap-px bg-slate-100 dark:bg-navy-800 sm:grid-cols-3">
            <Field label="Supplier" value={result.supplier} wide />
            <Field label="Date" value={result.date} />
            <Field label="Amount" value={formatCurrency(result.amount)} />
            <Field label="Category" value={result.category} />
            <div className="bg-white px-6 py-4 dark:bg-navy-900">
              <p className="text-sm font-medium uppercase tracking-wide text-slate-400">
                Document type
              </p>
              <div className="mt-1.5">
                <Badge tone={documentTypeBadgeTone[result.documentType]}>
                  {documentTypeLabels[result.documentType]}
                </Badge>
              </div>
            </div>
            <Field
              label="Suggested classification"
              value={result.classification}
              wide
            />
          </div>
          <div className="flex items-center gap-2 px-6 py-4">
            <FileText className="h-5 w-5 text-slate-400" />
            <span className="truncate text-sm text-slate-500 dark:text-slate-400">
              {result.fileName}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

function Field({
  label,
  value,
  wide,
}: {
  label: string;
  value: string;
  wide?: boolean;
}) {
  return (
    <div
      className={cn(
        "bg-white px-6 py-4 dark:bg-navy-900",
        wide && "col-span-2 sm:col-span-1"
      )}
    >
      <p className="text-sm font-medium uppercase tracking-wide text-slate-400">
        {label}
      </p>
      <p className="mt-1 text-base font-semibold text-navy-900 dark:text-white">
        {value}
      </p>
    </div>
  );
}
