// lib/mockData.ts
// Realistic mock data for SmartBooks AI

import type {
  Transaction,
  Receipt,
  Client,
  PricingPlan,
  Business,
  User,
  MonthlyReportRow,
} from "./types";

export const currentUser: User = {
  id: "u_001",
  name: "Gilda Cruz",
  email: "gcruz@greencafe.cv",
  role: "owner",
};

export const business: Business = {
  id: "b_001",
  name: "Green Cafe",
  ownerName: "Gilda Cruz",
  email: "gcruz@greencafe.cv",
  taxId: "CV-284917365",
  currency: "USD",
  language: "English",
  notifications: {
    taxReminders: true,
    weeklySummary: true,
    invoiceAlerts: true,
    productUpdates: false,
  },
};

export const incomeCategories = [
  "Sales Revenue",
  "Service Revenue",
  "Consulting Income",
  "Other Income",
];

export const expenseCategories = [
  "Rent",
  "Salaries",
  "Utilities",
  "Office Supplies",
  "Marketing",
  "Transport",
  "Taxes",
  "Software",
  "Bank Fees",
  "Miscellaneous",
];

export const paymentMethods = [
  "Bank Transfer",
  "Credit Card",
  "Cash",
  "Mobile Payment",
  "Check",
];

export const transactions: Transaction[] = [
  // May 2026
  { id: "t_101", date: "2026-05-18", type: "income", category: "Sales Revenue", description: "Daily coffee & pastry sales", amount: 1240.5, paymentMethod: "Cash", status: "paid", client: "Walk-in" },
  { id: "t_102", date: "2026-05-17", type: "income", category: "Service Revenue", description: "Catering - corporate breakfast", amount: 680.0, paymentMethod: "Bank Transfer", status: "paid", client: "Island Taxi Services" },
  { id: "t_103", date: "2026-05-16", type: "expense", category: "Office Supplies", description: "Cups, napkins, takeaway boxes", amount: 145.75, paymentMethod: "Credit Card", status: "paid" },
  { id: "t_104", date: "2026-05-15", type: "expense", category: "Marketing", description: "Instagram ad campaign", amount: 320.0, paymentMethod: "Credit Card", status: "paid" },
  { id: "t_105", date: "2026-05-14", type: "income", category: "Sales Revenue", description: "Weekend market stall", amount: 890.25, paymentMethod: "Mobile Payment", status: "paid", client: "Walk-in" },
  { id: "t_106", date: "2026-05-12", type: "expense", category: "Utilities", description: "Electricity & water", amount: 410.4, paymentMethod: "Bank Transfer", status: "paid" },
  { id: "t_107", date: "2026-05-10", type: "expense", category: "Rent", description: "Cafe space - May rent", amount: 1200.0, paymentMethod: "Bank Transfer", status: "paid" },
  { id: "t_108", date: "2026-05-09", type: "expense", category: "Salaries", description: "Part-time barista wages", amount: 1450.0, paymentMethod: "Bank Transfer", status: "pending" },
  { id: "t_109", date: "2026-05-08", type: "income", category: "Consulting Income", description: "Menu design consulting", amount: 450.0, paymentMethod: "Bank Transfer", status: "pending", client: "Mindelo Beauty Salon" },
  { id: "t_110", date: "2026-05-06", type: "expense", category: "Software", description: "SmartBooks AI Pro subscription", amount: 19.99, paymentMethod: "Credit Card", status: "paid" },
  { id: "t_111", date: "2026-05-05", type: "expense", category: "Transport", description: "Supplier delivery fuel", amount: 88.6, paymentMethod: "Cash", status: "paid" },
  { id: "t_112", date: "2026-05-03", type: "income", category: "Sales Revenue", description: "Daily coffee & pastry sales", amount: 1105.0, paymentMethod: "Cash", status: "paid", client: "Walk-in" },
  { id: "t_113", date: "2026-05-02", type: "expense", category: "Bank Fees", description: "Monthly account maintenance", amount: 12.5, paymentMethod: "Bank Transfer", status: "paid" },
  { id: "t_114", date: "2026-05-01", type: "expense", category: "Marketing", description: "Local newspaper feature", amount: 150.0, paymentMethod: "Credit Card", status: "overdue" },

  // April 2026
  { id: "t_201", date: "2026-04-28", type: "income", category: "Sales Revenue", description: "End of month sales", amount: 2310.75, paymentMethod: "Mobile Payment", status: "paid", client: "Walk-in" },
  { id: "t_202", date: "2026-04-25", type: "expense", category: "Salaries", description: "Staff wages", amount: 1450.0, paymentMethod: "Bank Transfer", status: "paid" },
  { id: "t_203", date: "2026-04-20", type: "expense", category: "Rent", description: "Cafe space - April rent", amount: 1200.0, paymentMethod: "Bank Transfer", status: "paid" },
  { id: "t_204", date: "2026-04-18", type: "income", category: "Service Revenue", description: "Private event catering", amount: 1320.0, paymentMethod: "Bank Transfer", status: "paid", client: "Local Market Store" },
  { id: "t_205", date: "2026-04-12", type: "expense", category: "Utilities", description: "Electricity & water", amount: 388.2, paymentMethod: "Bank Transfer", status: "paid" },
  { id: "t_206", date: "2026-04-08", type: "expense", category: "Marketing", description: "Flyer printing", amount: 95.0, paymentMethod: "Cash", status: "paid" },
  { id: "t_207", date: "2026-04-05", type: "income", category: "Sales Revenue", description: "Weekly sales", amount: 1980.0, paymentMethod: "Cash", status: "paid", client: "Walk-in" },

  // March 2026
  { id: "t_301", date: "2026-03-28", type: "income", category: "Sales Revenue", description: "Monthly sales total", amount: 3950.0, paymentMethod: "Mobile Payment", status: "paid", client: "Walk-in" },
  { id: "t_302", date: "2026-03-22", type: "expense", category: "Salaries", description: "Staff wages", amount: 1380.0, paymentMethod: "Bank Transfer", status: "paid" },
  { id: "t_303", date: "2026-03-15", type: "expense", category: "Rent", description: "Cafe space - March rent", amount: 1200.0, paymentMethod: "Bank Transfer", status: "paid" },
  { id: "t_304", date: "2026-03-10", type: "expense", category: "Taxes", description: "Quarterly VAT payment", amount: 640.0, paymentMethod: "Bank Transfer", status: "paid" },
  { id: "t_305", date: "2026-03-04", type: "expense", category: "Utilities", description: "Electricity & water", amount: 372.5, paymentMethod: "Bank Transfer", status: "paid" },

  // February 2026
  { id: "t_401", date: "2026-02-26", type: "income", category: "Sales Revenue", description: "Monthly sales total", amount: 3420.0, paymentMethod: "Mobile Payment", status: "paid", client: "Walk-in" },
  { id: "t_402", date: "2026-02-20", type: "expense", category: "Salaries", description: "Staff wages", amount: 1380.0, paymentMethod: "Bank Transfer", status: "paid" },
  { id: "t_403", date: "2026-02-14", type: "expense", category: "Rent", description: "Cafe space - February rent", amount: 1200.0, paymentMethod: "Bank Transfer", status: "paid" },
  { id: "t_404", date: "2026-02-08", type: "expense", category: "Marketing", description: "Valentine promo campaign", amount: 210.0, paymentMethod: "Credit Card", status: "paid" },

  // January 2026
  { id: "t_501", date: "2026-01-29", type: "income", category: "Sales Revenue", description: "Monthly sales total", amount: 2980.0, paymentMethod: "Mobile Payment", status: "paid", client: "Walk-in" },
  { id: "t_502", date: "2026-01-20", type: "expense", category: "Salaries", description: "Staff wages", amount: 1300.0, paymentMethod: "Bank Transfer", status: "paid" },
  { id: "t_503", date: "2026-01-15", type: "expense", category: "Rent", description: "Cafe space - January rent", amount: 1200.0, paymentMethod: "Bank Transfer", status: "paid" },

  // December 2025
  { id: "t_601", date: "2025-12-30", type: "income", category: "Sales Revenue", description: "Holiday season sales", amount: 4520.0, paymentMethod: "Mobile Payment", status: "paid", client: "Walk-in" },
  { id: "t_602", date: "2025-12-22", type: "expense", category: "Salaries", description: "Staff wages + holiday bonus", amount: 1800.0, paymentMethod: "Bank Transfer", status: "paid" },
  { id: "t_603", date: "2025-12-15", type: "expense", category: "Rent", description: "Cafe space - December rent", amount: 1200.0, paymentMethod: "Bank Transfer", status: "paid" },
];

export const receipts: Receipt[] = [
  { id: "r_001", fileName: "office-supplies-store.pdf", supplier: "Office Supplies Store", date: "2026-05-20", amount: 45.75, category: "Office Supplies", classification: "Operating Expense - Supplies", status: "categorized", confidenceScore: 94, uploadedAt: "2026-05-20T09:14:00Z" },
  { id: "r_002", fileName: "electric-company-may.jpg", supplier: "Cabo Verde Electric Co.", date: "2026-05-12", amount: 410.4, category: "Utilities", classification: "Operating Expense - Utilities", status: "categorized", confidenceScore: 97, uploadedAt: "2026-05-12T16:30:00Z" },
  { id: "r_003", fileName: "coffee-supplier-invoice.pdf", supplier: "Highland Coffee Roasters", date: "2026-05-11", amount: 620.0, category: "Office Supplies", classification: "Cost of Goods Sold", status: "needs_review", confidenceScore: 71, uploadedAt: "2026-05-11T11:02:00Z" },
  { id: "r_004", fileName: "ad-receipt.png", supplier: "Meta Platforms", date: "2026-05-15", amount: 320.0, category: "Marketing", classification: "Operating Expense - Advertising", status: "categorized", confidenceScore: 89, uploadedAt: "2026-05-15T08:45:00Z" },
  { id: "r_005", fileName: "fuel-station.jpg", supplier: "Shell Mindelo", date: "2026-05-05", amount: 88.6, category: "Transport", classification: "Operating Expense - Transport", status: "categorized", confidenceScore: 92, uploadedAt: "2026-05-05T18:20:00Z" },
  { id: "r_006", fileName: "scan_unknown_0521.jpg", supplier: "Processing...", date: "2026-05-21", amount: 0, category: "-", classification: "-", status: "processing", confidenceScore: 0, uploadedAt: "2026-05-21T07:55:00Z" },
];

export const clients: Client[] = [
  { id: "c_001", name: "Green Cafe", email: "ana@greencafe.cv", phone: "+238 991 2030", businessType: "Cafe / Restaurant", totalBilled: 12450.0, outstandingBalance: 0, status: "active" },
  { id: "c_002", name: "Mindelo Beauty Salon", email: "contact@mindelobeauty.cv", phone: "+238 982 4471", businessType: "Beauty Salon", totalBilled: 3200.0, outstandingBalance: 450.0, status: "active" },
  { id: "c_003", name: "Island Taxi Services", email: "fleet@islandtaxi.cv", phone: "+238 973 8820", businessType: "Transport", totalBilled: 5680.0, outstandingBalance: 680.0, status: "active" },
  { id: "c_004", name: "Local Market Store", email: "orders@localmarket.cv", phone: "+238 991 0099", businessType: "Retail", totalBilled: 8900.0, outstandingBalance: 0, status: "active" },
  { id: "c_005", name: "Freelance Designer", email: "hello@designstudio.cv", phone: "+238 985 6612", businessType: "Creative Services", totalBilled: 2100.0, outstandingBalance: 1200.0, status: "lead" },
  { id: "c_006", name: "Sunset Bistro", email: "info@sunsetbistro.cv", phone: "+238 970 1144", businessType: "Cafe / Restaurant", totalBilled: 1500.0, outstandingBalance: 0, status: "inactive" },
];

export const monthlyReport: MonthlyReportRow[] = [
  { month: "Dec 2025", income: 4520.0, expenses: 3000.0, profit: 1520.0 },
  { month: "Jan 2026", income: 2980.0, expenses: 2500.0, profit: 480.0 },
  { month: "Feb 2026", income: 3420.0, expenses: 2790.0, profit: 630.0 },
  { month: "Mar 2026", income: 3950.0, expenses: 3792.5, profit: 157.5 },
  { month: "Apr 2026", income: 5610.75, expenses: 3133.2, profit: 2477.55 },
  { month: "May 2026", income: 4365.75, expenses: 4147.74, profit: 218.01 },
];

export const pricingPlans: PricingPlan[] = [
  {
    id: "basic",
    name: "Basic",
    price: 9.99,
    period: "month",
    description: "Everything a solo freelancer needs to stay organized.",
    features: [
      "Income and expense tracking",
      "Receipt upload",
      "Basic reports",
      "Up to 50 transactions / month",
      "Email support",
    ],
    cta: "Start with Basic",
  },
  {
    id: "pro",
    name: "Pro",
    price: 19.99,
    period: "month",
    description: "For growing businesses that want automation and insights.",
    features: [
      "Automatic AI classification",
      "Monthly financial reports",
      "Tax deadline reminders",
      "Digital document storage",
      "Unlimited transactions",
      "Priority support",
    ],
    highlighted: true,
    cta: "Choose Pro",
  },
  {
    id: "premium",
    name: "Premium",
    price: 39.99,
    period: "month",
    description: "Full accounting support with a human in the loop.",
    features: [
      "All Pro features",
      "Monthly accounting support",
      "Advanced reports & forecasting",
      "Business consulting support",
      "Multi-user access",
      "Dedicated account manager",
    ],
    cta: "Go Premium",
  },
];
