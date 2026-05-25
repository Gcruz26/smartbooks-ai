// lib/billing.ts
// Billing cycles, payment methods, payment-detail types, and helpers for
// the demo Pricing flow. NO real payment processing happens here. Sensitive
// card fields (full PAN, CVV) are NEVER persisted - only safe summaries.

export type BillingCycle =
  | "monthly"
  | "quarterly"
  | "semiannual"
  | "annual";

export type PaymentMethod =
  | "card"
  | "bank_transfer"
  | "mobile_money"
  | "paypal"
  | "manual";

/* ------------------------------------------------------------------ */
/*  Safe payment-detail shapes (these are what we DO persist)          */
/* ------------------------------------------------------------------ */

export interface CardPaymentDetails {
  kind: "card";
  cardholderName: string;
  cardLast4: string;
  cardBrand?: string;
  billingZip: string;
}

export interface BankTransferDetails {
  kind: "bank_transfer";
  accountHolderName: string;
  bankName: string;
  maskedAccountNumber?: string;
  referenceNumber?: string;
}

export interface MobileMoneyDetails {
  kind: "mobile_money";
  walletProvider: string;
  maskedWalletId: string;
  accountHolderName: string;
}

export interface PayPalPaymentDetails {
  kind: "paypal";
  paypalEmail: string;
  paymentReference?: string;
}

export interface ManualPaymentDetails {
  kind: "manual";
  payerName: string;
  paymentNotes?: string;
  expectedPaymentDate: string;
}

export type SafePaymentDetails =
  | CardPaymentDetails
  | BankTransferDetails
  | MobileMoneyDetails
  | PayPalPaymentDetails
  | ManualPaymentDetails;

/* ------------------------------------------------------------------ */
/*  Subscription                                                        */
/* ------------------------------------------------------------------ */

export interface SelectedSubscription {
  planId: string;
  planName: string;
  monthlyPrice: number;
  billingCycle: BillingCycle;
  paymentMethod: PaymentMethod;
  /** Short human-friendly summary, e.g. "Card ending in 4242". */
  paymentSummary: string;
  /** Safe payment details (no sensitive fields). */
  safePaymentDetails: SafePaymentDetails;
  discountRate: number;
  totalAmount: number;
  status: "demo_not_charged";
  selectedAt: string;
  nextBillingDate: string;
}

/* ------------------------------------------------------------------ */
/*  Billing cycles                                                     */
/* ------------------------------------------------------------------ */

export interface BillingCycleMeta {
  key: BillingCycle;
  label: string;
  description: string;
  months: number;
  discount: number;
}

export const BILLING_CYCLES: BillingCycleMeta[] = [
  { key: "monthly", label: "Monthly", description: "Pay every month", months: 1, discount: 0 },
  { key: "quarterly", label: "Quarterly", description: "Pay every 3 months", months: 3, discount: 0.05 },
  { key: "semiannual", label: "Semiannual", description: "Pay every 6 months", months: 6, discount: 0.1 },
  { key: "annual", label: "Annual", description: "Pay once per year", months: 12, discount: 0.15 },
];

export function getBillingCycleMeta(cycle: BillingCycle): BillingCycleMeta {
  return BILLING_CYCLES.find((c) => c.key === cycle) ?? BILLING_CYCLES[0];
}

export function getBillingCycleLabel(cycle: BillingCycle): string {
  return getBillingCycleMeta(cycle).label;
}

/* ------------------------------------------------------------------ */
/*  Payment methods                                                    */
/* ------------------------------------------------------------------ */

export interface PaymentMethodMeta {
  key: PaymentMethod;
  label: string;
  description: string;
}

export const PAYMENT_METHODS: PaymentMethodMeta[] = [
  { key: "card", label: "Credit / Debit Card", description: "Visa, Mastercard, or any major card" },
  { key: "bank_transfer", label: "Bank Transfer", description: "Direct deposit / wire transfer" },
  { key: "mobile_money", label: "Mobile Money / Digital Wallet", description: "M-Pesa, Vinti4, Apple Pay, Google Pay" },
  { key: "paypal", label: "PayPal / Online Payment", description: "Pay with your PayPal account" },
  { key: "manual", label: "Manual Payment", description: "Send proof of payment manually" },
];

export const WALLET_PROVIDERS = [
  "MPesa",
  "Orange Money",
  "PayPal Wallet",
  "Vinti4",
  "Other",
];

export function getPaymentMethodMeta(method: PaymentMethod): PaymentMethodMeta {
  return PAYMENT_METHODS.find((m) => m.key === method) ?? PAYMENT_METHODS[0];
}

export function getPaymentMethodLabel(method: PaymentMethod): string {
  return getPaymentMethodMeta(method).label;
}

/* ------------------------------------------------------------------ */
/*  Calculations                                                       */
/* ------------------------------------------------------------------ */

export interface BillingBreakdown {
  gross: number;
  discount: number;
  total: number;
  effectiveMonthly: number;
  meta: BillingCycleMeta;
}

function round2(n: number): number {
  return Math.round(n * 100) / 100;
}

export function calculateBillingTotal(
  monthlyPrice: number,
  cycle: BillingCycle
): BillingBreakdown {
  const meta = getBillingCycleMeta(cycle);
  const gross = round2(monthlyPrice * meta.months);
  const discount = round2(gross * meta.discount);
  const total = round2(gross - discount);
  const effectiveMonthly = round2(total / meta.months);
  return { gross, discount, total, effectiveMonthly, meta };
}

export function getNextBillingDate(
  cycle: BillingCycle,
  from: Date = new Date()
): string {
  const meta = getBillingCycleMeta(cycle);
  const next = new Date(from);
  next.setMonth(next.getMonth() + meta.months);
  const pad = (n: number) => (n < 10 ? `0${n}` : String(n));
  return `${next.getFullYear()}-${pad(next.getMonth() + 1)}-${pad(
    next.getDate()
  )}`;
}

/* ------------------------------------------------------------------ */
/*  Masking + brand detection                                          */
/* ------------------------------------------------------------------ */

/** Strip everything that isn't a digit. */
function digitsOnly(s: string): string {
  return s.replace(/\D/g, "");
}

/** "4242 4242 4242 4242" -> "**** **** **** 4242". */
export function maskCardNumber(cardNumber: string): string {
  const d = digitsOnly(cardNumber);
  if (d.length < 4) return "****";
  const last4 = d.slice(-4);
  const stars = "*".repeat(Math.max(0, d.length - 4));
  return (stars + last4).replace(/(.{4})/g, "$1 ").trim();
}

/** Return only the last 4 digits, never the whole PAN. */
export function getCardLast4(cardNumber: string): string {
  const d = digitsOnly(cardNumber);
  return d.slice(-4);
}

/** Naive client-side brand detection from the leading digits. */
export function detectCardBrand(cardNumber: string): string | undefined {
  const d = digitsOnly(cardNumber);
  if (!d) return undefined;
  if (/^4/.test(d)) return "Visa";
  if (/^(5[1-5]|2(2[2-9]|[3-6]\d|7[01]|720))/.test(d)) return "Mastercard";
  if (/^3[47]/.test(d)) return "American Express";
  if (/^6(?:011|5)/.test(d)) return "Discover";
  if (/^3(?:0[0-5]|[68])/.test(d)) return "Diners Club";
  if (/^35/.test(d)) return "JCB";
  return undefined;
}

/** Mask an arbitrary account number, keeping only the last 4 chars. */
export function maskAccountNumber(accountNumber: string): string {
  const d = accountNumber.replace(/\s+/g, "");
  if (d.length <= 4) return d;
  return "*".repeat(Math.max(0, d.length - 4)) + d.slice(-4);
}

/** Mask a wallet ID / mobile number, keeping the last 4 chars. */
export function maskWalletId(walletId: string): string {
  const d = walletId.replace(/\s+/g, "");
  if (d.length <= 4) return d;
  return "*".repeat(Math.max(0, d.length - 4)) + d.slice(-4);
}

/* ------------------------------------------------------------------ */
/*  Validation                                                          */
/* ------------------------------------------------------------------ */

export interface RawPaymentInput {
  // Card
  cardholderName?: string;
  cardNumber?: string;
  expiry?: string;
  cvv?: string;
  billingZip?: string;
  // Bank
  bankName?: string;
  accountHolderName?: string;
  accountNumber?: string;
  referenceNumber?: string;
  // Wallet
  walletProvider?: string;
  walletId?: string;
  // PayPal
  paypalEmail?: string;
  paymentReference?: string;
  // Manual
  payerName?: string;
  paymentNotes?: string;
  expectedPaymentDate?: string;
}

const EXPIRY_RE = /^(0[1-9]|1[0-2])\/\d{2}$/;
const EMAIL_RE = /^\S+@\S+\.\S+$/;

/**
 * Validates the raw payment input and returns either an error message or
 * the safe (sanitised) details to store. Never returns raw PAN/CVV.
 */
export function validatePaymentDetails(
  method: PaymentMethod,
  input: RawPaymentInput
):
  | { ok: true; details: SafePaymentDetails }
  | { ok: false; error: string } {
  if (method === "card") {
    if (!input.cardholderName?.trim())
      return { ok: false, error: "Cardholder name is required." };
    const digits = digitsOnly(input.cardNumber ?? "");
    if (digits.length < 12)
      return { ok: false, error: "Card number is required." };
    if (!input.expiry?.trim() || !EXPIRY_RE.test(input.expiry.trim()))
      return { ok: false, error: "Expiry date must be in MM/YY format." };
    if (!input.cvv?.trim() || !/^\d{3,4}$/.test(input.cvv.trim()))
      return { ok: false, error: "CVV must be 3 or 4 digits." };
    if (!input.billingZip?.trim())
      return { ok: false, error: "Billing ZIP / postal code is required." };
    return {
      ok: true,
      details: {
        kind: "card",
        cardholderName: input.cardholderName.trim(),
        cardLast4: digits.slice(-4),
        cardBrand: detectCardBrand(digits),
        billingZip: input.billingZip.trim(),
      },
    };
  }

  if (method === "bank_transfer") {
    if (!input.accountHolderName?.trim())
      return { ok: false, error: "Account holder name is required." };
    if (!input.bankName?.trim())
      return { ok: false, error: "Bank name is required." };
    return {
      ok: true,
      details: {
        kind: "bank_transfer",
        accountHolderName: input.accountHolderName.trim(),
        bankName: input.bankName.trim(),
        maskedAccountNumber: input.accountNumber
          ? maskAccountNumber(input.accountNumber.trim())
          : undefined,
        referenceNumber: input.referenceNumber?.trim() || undefined,
      },
    };
  }

  if (method === "mobile_money") {
    if (!input.walletProvider?.trim())
      return { ok: false, error: "Wallet provider is required." };
    if (!input.walletId?.trim())
      return { ok: false, error: "Mobile number / wallet ID is required." };
    if (!input.accountHolderName?.trim())
      return { ok: false, error: "Account holder name is required." };
    return {
      ok: true,
      details: {
        kind: "mobile_money",
        walletProvider: input.walletProvider.trim(),
        maskedWalletId: maskWalletId(input.walletId.trim()),
        accountHolderName: input.accountHolderName.trim(),
      },
    };
  }

  if (method === "paypal") {
    if (!input.paypalEmail?.trim() || !EMAIL_RE.test(input.paypalEmail.trim()))
      return { ok: false, error: "A valid PayPal email is required." };
    return {
      ok: true,
      details: {
        kind: "paypal",
        paypalEmail: input.paypalEmail.trim(),
        paymentReference: input.paymentReference?.trim() || undefined,
      },
    };
  }

  // manual
  if (!input.payerName?.trim())
    return { ok: false, error: "Payer name is required." };
  if (!input.expectedPaymentDate?.trim())
    return { ok: false, error: "Expected payment date is required." };
  return {
    ok: true,
    details: {
      kind: "manual",
      payerName: input.payerName.trim(),
      paymentNotes: input.paymentNotes?.trim() || undefined,
      expectedPaymentDate: input.expectedPaymentDate.trim(),
    },
  };
}

/* ------------------------------------------------------------------ */
/*  Summary builder                                                    */
/* ------------------------------------------------------------------ */

export function buildPaymentSummary(details: SafePaymentDetails): string {
  switch (details.kind) {
    case "card":
      return `${details.cardBrand ?? "Card"} ending in ${details.cardLast4}`;
    case "bank_transfer":
      return `Bank Transfer from ${details.bankName}`;
    case "mobile_money":
      return `${details.walletProvider} ending in ${details.maskedWalletId.slice(
        -4
      )}`;
    case "paypal":
      return `PayPal: ${details.paypalEmail}`;
    case "manual":
      return `Manual payment expected on ${details.expectedPaymentDate}`;
  }
}

/* ------------------------------------------------------------------ */
/*  localStorage persistence                                           */
/* ------------------------------------------------------------------ */

export const SUBSCRIPTION_STORAGE_KEY = "smartbooks_subscription_v2";

export function loadSubscription(): SelectedSubscription | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(SUBSCRIPTION_STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as SelectedSubscription;
  } catch {
    return null;
  }
}

export function saveSubscription(sub: SelectedSubscription): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(
      SUBSCRIPTION_STORAGE_KEY,
      JSON.stringify(sub)
    );
  } catch {
    /* ignore quota errors in mock flow */
  }
}

export function clearSubscription(): void {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(SUBSCRIPTION_STORAGE_KEY);
  // Clean up old v1 if present.
  window.localStorage.removeItem("smartbooks_subscription_v1");
}
