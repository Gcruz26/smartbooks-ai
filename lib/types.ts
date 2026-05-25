// lib/types.ts
// Core data models for SmartBooks AI

/**
 * Full set of accounting movement types supported by the app.
 * The original "income" / "expense" pair is kept; the rest model the
 * additional movements common in Portuguese / Cape Verdean SMB bookkeeping.
 */
export type TransactionType =
  | "income"
  | "expense"
  | "transfer"
  | "refund"
  | "tax_payment"
  | "payroll"
  | "owner_draw"
  | "owner_contribution"
  | "bank_fee"
  | "adjustment";

/**
 * Portuguese/Cape Verdean accounting source documents:
 *   invoice         - Fatura
 *   invoice_receipt - Fatura-Recibo
 *   receipt         - Recibo
 *   debit_note      - Nota de Debito
 *   credit_note     - Nota de Credito
 */
export type DocumentType =
  | "invoice"
  | "invoice_receipt"
  | "receipt"
  | "debit_note"
  | "credit_note";

export type TransactionStatus = "paid" | "pending" | "overdue";
export type ReceiptStatus =
  | "processing"
  | "categorized"
  | "needs_review"
  | "approved"
  | "rejected";
export type ClientStatus = "active" | "inactive" | "lead";

export interface User {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  role: string;
  institution?: string;
}

export interface Business {
  id: string;
  name: string;
  ownerName: string;
  email: string;
  taxId: string;
  currency: string;
  language: string;
  institution?: string;
  notifications: {
    taxReminders: boolean;
    weeklySummary: boolean;
    invoiceAlerts: boolean;
    productUpdates: boolean;
  };
}

export interface Transaction {
  id: string;
  date: string; // ISO date (YYYY-MM-DD)
  type: TransactionType;
  documentType: DocumentType;
  category: string;
  description: string;
  amount: number;
  paymentMethod: string;
  status: TransactionStatus;
  client?: string;
}

export interface Receipt {
  id: string;
  fileName: string;
  uploadedAt: string;
  status: ReceiptStatus;

  /** Suggested document type from the OCR/AI extraction. */
  documentType: DocumentType;

  /** Supplier (or client, for income receipts). */
  supplier: string;
  taxId?: string;
  documentNumber?: string;
  /** Date printed on the source document. */
  documentDate: string;
  dueDate?: string;
  amount: number;
  taxAmount?: number;
  currency: string;
  paymentMethod?: string;

  /** Suggested accounting classification. */
  transactionType: TransactionType;
  category: string;
  suggestedAccount?: string;
  classification: string;
  description: string;

  /** AI confidence (0-100) and an explanation of the call. */
  confidenceScore: number;
  confidenceExplanation: string;

  /** Optional link to the Transaction this receipt produced. */
  linkedTransactionId?: string;

  /** Cached OCR text shown in the preview block. */
  extractedText?: string;

  /**
   * Legacy alias for documentDate. Older mock entries used date;
   * new code should use documentDate.
   */
  date?: string;
}

export interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  businessType: string;
  totalBilled: number;
  outstandingBalance: number;
  status: ClientStatus;
}

export interface MonthlyReportRow {
  month: string;
  income: number;
  expenses: number;
  profit: number;
}

export interface Report {
  period: string;
  totalIncome: number;
  totalExpenses: number;
  netProfit: number;
  rows: MonthlyReportRow[];
}

export interface PricingPlan {
  id: string;
  name: string;
  price: number;
  period: string;
  description: string;
  features: string[];
  highlighted?: boolean;
  cta: string;
}

export interface CategoryBreakdown {
  category: string;
  amount: number;
}

export interface FinancialInsight {
  id: string;
  type: "positive" | "warning" | "neutral" | "alert";
  title: string;
  message: string;
}
