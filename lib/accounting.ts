// lib/accounting.ts
// Labels, mappings, and rules for Portuguese / Cape Verdean accounting
// document and transaction types. Kept in its own module so the UI never
// hard-codes labels and the operating P&L rules live in one place.

import type { Transaction, TransactionType, DocumentType } from "./types";

/* ------------------------------------------------------------------ */
/*  Transaction types                                                  */
/* ------------------------------------------------------------------ */

export const ALL_TRANSACTION_TYPES: TransactionType[] = [
  "income",
  "expense",
  "transfer",
  "refund",
  "tax_payment",
  "payroll",
  "owner_draw",
  "owner_contribution",
  "bank_fee",
  "adjustment",
];

export const transactionTypeLabels: Record<TransactionType, string> = {
  income: "Income",
  expense: "Expense",
  transfer: "Transfer",
  refund: "Refund",
  tax_payment: "Tax Payment",
  payroll: "Payroll",
  owner_draw: "Owner Draw",
  owner_contribution: "Owner Contribution",
  bank_fee: "Bank Fee",
  adjustment: "Adjustment",
};

export function getTransactionTypeLabel(type: TransactionType): string {
  return transactionTypeLabels[type] ?? type;
}

/* ------------------------------------------------------------------ */
/*  Document types                                                     */
/* ------------------------------------------------------------------ */

export const ALL_DOCUMENT_TYPES: DocumentType[] = [
  "invoice",
  "invoice_receipt",
  "receipt",
  "debit_note",
  "credit_note",
];

export const documentTypeLabels: Record<DocumentType, string> = {
  invoice: "Fatura",
  invoice_receipt: "Fatura-Recibo",
  receipt: "Recibo",
  debit_note: "Nota de Debito",
  credit_note: "Nota de Credito",
};

export const documentTypeEnglishLabels: Record<DocumentType, string> = {
  invoice: "Invoice",
  invoice_receipt: "Invoice-Receipt",
  receipt: "Receipt",
  debit_note: "Debit Note",
  credit_note: "Credit Note",
};

export function getDocumentTypeLabel(doc: DocumentType): string {
  return documentTypeLabels[doc] ?? doc;
}

/** Badge tone (matches our Badge tones) for each document type. */
export const documentTypeBadgeTone: Record<
  DocumentType,
  "navy" | "green" | "slate" | "amber" | "purple"
> = {
  invoice: "navy",
  invoice_receipt: "green",
  receipt: "slate",
  debit_note: "amber",
  credit_note: "purple",
};

/* ------------------------------------------------------------------ */
/*  Operating P&L rules                                                */
/* ------------------------------------------------------------------ */

export const OPERATING_INCOME_TYPES: TransactionType[] = ["income"];

export const OPERATING_EXPENSE_TYPES: TransactionType[] = [
  "expense",
  "payroll",
  "tax_payment",
  "bank_fee",
];

export const NON_OPERATING_TYPES: TransactionType[] = [
  "transfer",
  "owner_draw",
  "owner_contribution",
  "adjustment",
];

export function isOperatingIncome(t: Transaction): boolean {
  return OPERATING_INCOME_TYPES.includes(t.type);
}

export function isOperatingExpense(t: Transaction): boolean {
  return OPERATING_EXPENSE_TYPES.includes(t.type);
}

export function isNonOperatingTransaction(t: Transaction): boolean {
  return NON_OPERATING_TYPES.includes(t.type);
}

/**
 * Returns the contribution of a transaction to operating profit.
 *
 *   +amount  => operating income (e.g. an Income transaction)
 *   -amount  => operating expense (e.g. Expense/Payroll/Tax/Bank Fee)
 *   0        => non-operating (Transfer, Owner Draw/Contribution, Adjustment)
 *
 * A credit_note inverts the sign of the underlying movement (it reduces
 * the prior income or refunds a prior expense). A refund acts as a
 * reduction of operating income.
 */
export function calculateSignedAmount(t: Transaction): number {
  const creditFlip = t.documentType === "credit_note" ? -1 : 1;
  if (isOperatingIncome(t)) return creditFlip * t.amount;
  if (isOperatingExpense(t)) return -creditFlip * t.amount;
  if (t.type === "refund") return -creditFlip * t.amount;
  return 0;
}

/** Sum operating income contribution across a list of transactions. */
export function sumOperatingIncome(transactions: Transaction[]): number {
  let total = 0;
  for (const t of transactions) {
    if (isOperatingIncome(t)) {
      total += t.documentType === "credit_note" ? -t.amount : t.amount;
    } else if (t.type === "refund") {
      total -= t.documentType === "credit_note" ? -t.amount : t.amount;
    }
  }
  return total;
}

/** Sum operating expenses (positive number). */
export function sumOperatingExpenses(transactions: Transaction[]): number {
  let total = 0;
  for (const t of transactions) {
    if (isOperatingExpense(t)) {
      total += t.documentType === "credit_note" ? -t.amount : t.amount;
    }
  }
  return total;
}

/** Operating profit = operating income - operating expenses. */
export function operatingProfit(transactions: Transaction[]): number {
  return sumOperatingIncome(transactions) - sumOperatingExpenses(transactions);
}

/** Count occurrences of each document type. */
export function documentCounts(
  transactions: Transaction[]
): Record<DocumentType, number> {
  const counts: Record<DocumentType, number> = {
    invoice: 0,
    invoice_receipt: 0,
    receipt: 0,
    debit_note: 0,
    credit_note: 0,
  };
  for (const t of transactions) counts[t.documentType] += 1;
  return counts;
}
