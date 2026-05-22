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
export type ReceiptStatus = "processing" | "categorized" | "needs_review";
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
  supplier: string;
  date: string;
  amount: number;
  category: string;
  classification: string;
  /** Suggested document type from the OCR/AI extraction (mock). */
  documentType?: DocumentType;
  status: ReceiptStatus;
  confidenceScore: number; // 0-100
  uploadedAt: string;
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
