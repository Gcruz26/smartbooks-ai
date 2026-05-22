// lib/types.ts
// Core data models for SmartBooks AI

export type TransactionType = "income" | "expense";
export type TransactionStatus = "paid" | "pending" | "overdue";
export type ReceiptStatus = "processing" | "categorized" | "needs_review";
export type ClientStatus = "active" | "inactive" | "lead";

export interface User {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  role: "owner" | "accountant" | "staff";
}

export interface Business {
  id: string;
  name: string;
  ownerName: string;
  email: string;
  taxId: string;
  currency: string;
  language: string;
  notifications: {
    taxReminders: boolean;
    weeklySummary: boolean;
    invoiceAlerts: boolean;
    productUpdates: boolean;
  };
}

export interface Transaction {
  id: string;
  date: string; // ISO date string (YYYY-MM-DD)
  type: TransactionType;
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
  classification: string; // suggested accounting classification
  status: ReceiptStatus;
  confidenceScore: number; // 0–100
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
