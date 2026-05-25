"use client";

// app/pricing/page.tsx
import { useEffect, useMemo, useState } from "react";
import {
  Check,
  HelpCircle,
  Sparkles,
  X,
  CreditCard,
  Calendar,
  ShieldCheck,
  AlertTriangle,
  CheckCircle2,
  Lock,
} from "lucide-react";
import { DashboardShell } from "@/components/DashboardShell";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Badge } from "@/components/ui/Badge";
import { pricingPlans } from "@/lib/mockData";
import { cn, formatCurrency, formatDate } from "@/lib/utils";
import {
  BILLING_CYCLES,
  PAYMENT_METHODS,
  WALLET_PROVIDERS,
  calculateBillingTotal,
  getNextBillingDate,
  getBillingCycleLabel,
  getPaymentMethodLabel,
  validatePaymentDetails,
  buildPaymentSummary,
  loadSubscription,
  saveSubscription,
  clearSubscription,
  type BillingCycle,
  type PaymentMethod,
  type RawPaymentInput,
  type SelectedSubscription,
} from "@/lib/billing";
import type { PricingPlan } from "@/lib/types";

const faqs = [
  {
    q: "Can I change plans later?",
    a: "Yes - you can upgrade or downgrade at any time. Changes take effect on your next billing cycle.",
  },
  {
    q: "Is there a free trial?",
    a: "Every plan comes with a 14-day free trial. No credit card required to start.",
  },
  {
    q: "What happens to my data if I cancel?",
    a: "Your data stays available for export for 90 days after cancellation.",
  },
  {
    q: "Do you offer support?",
    a: "All plans include email support. Pro and Premium include priority and dedicated support.",
  },
];

export default function PricingPage() {
  const [subscription, setSubscription] =
    useState<SelectedSubscription | null>(null);
  const [openPlan, setOpenPlan] = useState<PricingPlan | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    setSubscription(loadSubscription());
  }, []);

  function confirmSubscription(next: SelectedSubscription) {
    saveSubscription(next);
    setSubscription(next);
    setOpenPlan(null);
    setSuccessMessage(
      "Your subscription has been updated successfully. No real payment was processed."
    );
    window.setTimeout(() => setSuccessMessage(null), 4500);
  }

  function handleCancelSubscription() {
    clearSubscription();
    setSubscription(null);
    setSuccessMessage("Demo subscription cancelled.");
    window.setTimeout(() => setSuccessMessage(null), 3000);
  }

  return (
    <DashboardShell
      title="Pricing"
      subtitle="Choose the plan, billing cycle, and payment method that fit your business."
    >
      {successMessage && (
        <div
          role="status"
          className="mb-6 flex items-center gap-2.5 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-base font-medium text-emerald-700 dark:border-emerald-500/30 dark:bg-emerald-500/10 dark:text-emerald-300"
        >
          <CheckCircle2 className="h-5 w-5" />
          {successMessage}
        </div>
      )}

      {subscription && (
        <SubscriptionSummary
          subscription={subscription}
          onCancel={handleCancelSubscription}
        />
      )}

      <div className="mx-auto mt-2 max-w-2xl text-center">
        <h2 className="font-display text-3xl font-bold tracking-tight text-navy-900 dark:text-white sm:text-4xl">
          Plans that scale with you
        </h2>
        <p className="mt-3 text-lg text-slate-600 dark:text-slate-300">
          Start free for 14 days. Cancel anytime. No hidden fees.
        </p>
      </div>

      <div className="mt-14 grid gap-7 lg:grid-cols-3 lg:items-start">
        {pricingPlans.map((plan) => {
          const isCurrent = subscription?.planId === plan.id;
          return (
            <PricingCardWithAction
              key={plan.id}
              plan={plan}
              isCurrent={isCurrent}
              onChoose={() => setOpenPlan(plan)}
            />
          );
        })}
      </div>

      <div className="mt-12 flex items-center justify-center gap-2.5 rounded-2xl border border-emerald-200 bg-emerald-50 px-6 py-5 text-base text-emerald-800 dark:border-emerald-500/30 dark:bg-emerald-500/10 dark:text-emerald-300">
        <Check className="h-5 w-5" />
        30-day money-back guarantee on all annual plans.
      </div>

      <div className="mt-14">
        <h3 className="font-display text-2xl font-bold text-navy-900 dark:text-white">
          Frequently asked questions
        </h3>
        <div className="mt-7 grid gap-5 sm:grid-cols-2">
          {faqs.map((f) => (
            <div
              key={f.q}
              className="rounded-2xl border border-slate-200 bg-white p-6 shadow-card dark:border-navy-800 dark:bg-navy-900"
            >
              <div className="flex items-start gap-3">
                <HelpCircle className="mt-0.5 h-6 w-6 shrink-0 text-sky-500" />
                <div>
                  <p className="text-lg font-semibold text-navy-900 dark:text-white">
                    {f.q}
                  </p>
                  <p className="mt-2 text-base text-slate-500 dark:text-slate-400">
                    {f.a}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {openPlan && (
        <PlanCheckoutModal
          plan={openPlan}
          currentSubscription={subscription}
          onClose={() => setOpenPlan(null)}
          onConfirm={confirmSubscription}
        />
      )}
    </DashboardShell>
  );
}

/* ------------------------------------------------------------------ */
/*  Pricing card                                                       */
/* ------------------------------------------------------------------ */

interface PricingCardWithActionProps {
  plan: PricingPlan;
  isCurrent: boolean;
  onChoose: () => void;
}

function PricingCardWithAction({
  plan,
  isCurrent,
  onChoose,
}: PricingCardWithActionProps) {
  return (
    <div
      className={cn(
        "relative flex flex-col rounded-3xl border p-7 transition",
        plan.highlighted
          ? "border-navy-800 bg-navy-900 text-white shadow-card-hover lg:-translate-y-2"
          : "border-slate-200 bg-white shadow-card dark:border-navy-800 dark:bg-navy-900"
      )}
    >
      {plan.highlighted && (
        <span className="absolute -top-3 left-1/2 inline-flex -translate-x-1/2 items-center gap-1.5 rounded-full bg-sky-500 px-3.5 py-1.5 text-sm font-bold text-white shadow-sm">
          <Sparkles className="h-4 w-4" />
          Most Popular
        </span>
      )}
      {isCurrent && (
        <span className="absolute right-5 top-5 inline-flex items-center gap-1.5 rounded-full bg-emerald-500/15 px-3 py-1 text-sm font-semibold text-emerald-700 dark:text-emerald-300">
          <Check className="h-4 w-4" /> Current Plan
        </span>
      )}

      <h3
        className={cn(
          "font-display text-2xl font-bold",
          plan.highlighted ? "text-white" : "text-navy-900 dark:text-white"
        )}
      >
        {plan.name}
      </h3>
      <p
        className={cn(
          "mt-2 text-base",
          plan.highlighted
            ? "text-slate-300"
            : "text-slate-500 dark:text-slate-400"
        )}
      >
        {plan.description}
      </p>
      <div className="mt-6 flex items-end gap-1.5">
        <span
          className={cn(
            "font-display text-5xl font-bold tracking-tight",
            plan.highlighted ? "text-white" : "text-navy-900 dark:text-white"
          )}
        >
          ${plan.price}
        </span>
        <span
          className={cn(
            "mb-2 text-base",
            plan.highlighted
              ? "text-slate-400"
              : "text-slate-500 dark:text-slate-400"
          )}
        >
          /{plan.period}
        </span>
      </div>
      <ul className="mt-7 flex-1 space-y-3.5">
        {plan.features.map((feature) => (
          <li key={feature} className="flex items-start gap-3 text-base">
            <span
              className={cn(
                "mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full",
                plan.highlighted
                  ? "bg-sky-500/20 text-sky-300"
                  : "bg-emerald-500/10 text-emerald-600 dark:text-emerald-300"
              )}
            >
              <Check className="h-4 w-4" />
            </span>
            <span
              className={cn(
                plan.highlighted
                  ? "text-slate-200"
                  : "text-slate-600 dark:text-slate-300"
              )}
            >
              {feature}
            </span>
          </li>
        ))}
      </ul>
      <Button
        variant={plan.highlighted ? "secondary" : "outline"}
        className="mt-8 w-full"
        onClick={onChoose}
        disabled={isCurrent}
      >
        {isCurrent ? "Current Plan" : "Switch Plan"}
      </Button>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Subscription summary card                                          */
/* ------------------------------------------------------------------ */

function SubscriptionSummary({
  subscription,
  onCancel,
}: {
  subscription: SelectedSubscription;
  onCancel: () => void;
}) {
  const breakdown = calculateBillingTotal(
    subscription.monthlyPrice,
    subscription.billingCycle
  );

  return (
    <div className="mb-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-card dark:border-navy-800 dark:bg-navy-900">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <span className="grid h-12 w-12 place-items-center rounded-xl bg-navy-100 text-navy-800 dark:bg-navy-700/30 dark:text-sky-200">
            <ShieldCheck className="h-6 w-6" />
          </span>
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
              Active Subscription
            </p>
            <p className="font-display text-xl font-bold text-navy-900 dark:text-white">
              {subscription.planName}
            </p>
          </div>
        </div>
        <Badge tone="amber">Demo - Not charged</Badge>
      </div>

      <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <SummaryItem
          label="Billing Cycle"
          value={getBillingCycleLabel(subscription.billingCycle)}
        />
        <SummaryItem
          label="Payment Method"
          value={getPaymentMethodLabel(subscription.paymentMethod)}
        />
        <SummaryItem
          label="Payment Details"
          value={subscription.paymentSummary}
        />
        <SummaryItem
          label="Monthly Base Price"
          value={formatCurrency(subscription.monthlyPrice)}
        />
        <SummaryItem
          label="Discount Applied"
          value={
            subscription.discountRate > 0
              ? `${(subscription.discountRate * 100).toFixed(0)}% (${formatCurrency(
                  breakdown.discount
                )})`
              : "No discount"
          }
        />
        <SummaryItem
          label="Total Amount"
          value={formatCurrency(subscription.totalAmount)}
          highlight
        />
        <SummaryItem
          label="Next Billing Date"
          value={formatDate(subscription.nextBillingDate)}
        />
        <SummaryItem
          label="Selected At"
          value={formatDate(subscription.selectedAt.slice(0, 10))}
        />
      </div>

      <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-4 dark:border-navy-800">
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Status: <span className="font-semibold">Demo - Not charged</span>
        </p>
        <button
          type="button"
          onClick={onCancel}
          className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-semibold text-red-600 transition hover:bg-red-50 dark:text-red-300 dark:hover:bg-red-500/10"
        >
          <X className="h-4 w-4" />
          Cancel demo subscription
        </button>
      </div>
    </div>
  );
}

function SummaryItem({
  label,
  value,
  highlight,
}: {
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <div>
      <p className="text-sm font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">
        {label}
      </p>
      <p
        className={cn(
          "mt-1 font-display text-lg font-bold",
          highlight
            ? "text-navy-900 dark:text-sky-200"
            : "text-navy-900 dark:text-white"
        )}
      >
        {value}
      </p>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Checkout modal with dynamic payment-details section                */
/* ------------------------------------------------------------------ */

interface CheckoutModalProps {
  plan: PricingPlan;
  currentSubscription: SelectedSubscription | null;
  onClose: () => void;
  onConfirm: (sub: SelectedSubscription) => void;
}

function PlanCheckoutModal({
  plan,
  currentSubscription,
  onClose,
  onConfirm,
}: CheckoutModalProps) {
  const samePlan = currentSubscription?.planId === plan.id;
  const [cycle, setCycle] = useState<BillingCycle>(
    samePlan && currentSubscription
      ? currentSubscription.billingCycle
      : "monthly"
  );
  const [method, setMethod] = useState<PaymentMethod | "">(
    samePlan && currentSubscription ? currentSubscription.paymentMethod : ""
  );
  const [details, setDetails] = useState<RawPaymentInput>({});
  const [error, setError] = useState<string | null>(null);

  const breakdown = useMemo(
    () => calculateBillingTotal(plan.price, cycle),
    [plan.price, cycle]
  );

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  function setField<K extends keyof RawPaymentInput>(
    key: K,
    value: RawPaymentInput[K]
  ) {
    setDetails((d) => ({ ...d, [key]: value }));
    setError(null);
  }

  function handleConfirm() {
    if (!cycle) {
      setError("Please choose a billing cycle.");
      return;
    }
    if (!method) {
      setError("Please choose a payment method.");
      return;
    }
    const result = validatePaymentDetails(method, details);
    if (!result.ok) {
      setError(result.error);
      return;
    }
    const safe = result.details;
    onConfirm({
      planId: plan.id,
      planName: plan.name,
      monthlyPrice: plan.price,
      billingCycle: cycle,
      paymentMethod: method,
      paymentSummary: buildPaymentSummary(safe),
      safePaymentDetails: safe,
      discountRate: breakdown.meta.discount,
      totalAmount: breakdown.total,
      status: "demo_not_charged",
      selectedAt: new Date().toISOString(),
      nextBillingDate: getNextBillingDate(cycle),
    });
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`Subscribe to ${plan.name}`}
      className="fixed inset-0 z-50 flex items-center justify-center bg-navy-950/50 px-4 py-6 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="animate-fade-up flex max-h-[92vh] w-full max-w-3xl flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-card-hover dark:border-navy-800 dark:bg-navy-900"
      >
        {/* Modal header */}
        <div className="flex items-start justify-between border-b border-slate-100 px-6 py-5 dark:border-navy-800">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-sky-600">
              Subscribe
            </p>
            <h2 className="font-display text-2xl font-bold text-navy-900 dark:text-white">
              {plan.name} Plan
            </h2>
            <p className="mt-1 text-base text-slate-500 dark:text-slate-400">
              {formatCurrency(plan.price)} / month base price
            </p>
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

        {/* Scrollable body */}
        <div className="flex-1 overflow-y-auto px-6 py-6">
          {/* Section 1: Plan and Billing */}
          <SectionHeading
            step={1}
            title="Plan and Billing"
            description="Longer cycles unlock a discount on the total amount."
          />
          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {BILLING_CYCLES.map((c) => {
              const active = cycle === c.key;
              const detail = calculateBillingTotal(plan.price, c.key);
              return (
                <button
                  key={c.key}
                  type="button"
                  onClick={() => setCycle(c.key)}
                  aria-pressed={active}
                  className={cn(
                    "relative rounded-2xl border p-4 text-left transition",
                    active
                      ? "border-navy-800 bg-navy-50 ring-2 ring-navy-800/30 dark:border-sky-400/50 dark:bg-navy-800/60"
                      : "border-slate-200 bg-white hover:border-navy-300 dark:border-navy-700 dark:bg-navy-900 dark:hover:border-sky-500/40"
                  )}
                >
                  <div className="flex items-center justify-between">
                    <p className="font-display text-base font-bold text-navy-900 dark:text-white">
                      {c.label}
                    </p>
                    {c.discount > 0 && (
                      <Badge tone="amber">
                        -{(c.discount * 100).toFixed(0)}%
                      </Badge>
                    )}
                  </div>
                  <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                    {c.description}
                  </p>
                  <p className="mt-3 font-display text-xl font-bold text-navy-900 dark:text-white">
                    {formatCurrency(detail.total)}
                  </p>
                  {c.discount > 0 && (
                    <p className="text-sm text-slate-400 line-through">
                      {formatCurrency(detail.gross)}
                    </p>
                  )}
                </button>
              );
            })}
          </div>

          {/* Section 2: Payment Method */}
          <SectionHeading
            step={2}
            title="Payment Method"
            description="Choose how you would like to be billed."
            className="mt-8"
          />
          <div className="mt-4 grid gap-2.5 sm:grid-cols-2">
            {PAYMENT_METHODS.map((m) => {
              const active = method === m.key;
              return (
                <label
                  key={m.key}
                  className={cn(
                    "flex cursor-pointer items-start gap-3 rounded-xl border p-4 transition",
                    active
                      ? "border-navy-800 bg-navy-50 ring-2 ring-navy-800/30 dark:border-sky-400/50 dark:bg-navy-800/60"
                      : "border-slate-200 bg-white hover:border-navy-300 dark:border-navy-700 dark:bg-navy-900 dark:hover:border-sky-500/40"
                  )}
                >
                  <input
                    type="radio"
                    name="payment-method"
                    className="mt-1 h-4 w-4 text-navy-800 focus:ring-navy-500"
                    checked={active}
                    onChange={() => {
                      setMethod(m.key);
                      setDetails({});
                      setError(null);
                    }}
                  />
                  <div>
                    <p className="font-display text-base font-bold text-navy-900 dark:text-white">
                      {m.label}
                    </p>
                    <p className="mt-0.5 text-sm text-slate-500 dark:text-slate-400">
                      {m.description}
                    </p>
                  </div>
                </label>
              );
            })}
          </div>

          {/* Section 3: Payment Details */}
          {method && (
            <>
              <SectionHeading
                step={3}
                title="Payment Details"
                description="We only store a safe summary of your payment information."
                className="mt-8"
              />
              <div className="mt-4">
                <PaymentDetailsForm
                  method={method}
                  details={details}
                  setField={setField}
                />
                <p className="mt-3 flex items-start gap-2 text-sm text-slate-500 dark:text-slate-400">
                  <Lock className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600 dark:text-emerald-300" />
                  Sensitive fields (full card number, CVV) are never stored.
                  Only a masked summary is kept locally for this demo.
                </p>
              </div>
            </>
          )}

          {/* Section 4: Confirmation Summary */}
          <SectionHeading
            step={4}
            title="Confirmation"
            description="Review the order before confirming."
            className="mt-8"
          />
          <div className="mt-4 rounded-2xl border border-slate-200 bg-slate-50 p-5 dark:border-navy-700 dark:bg-navy-800/40">
            <SummaryLine label="Selected Plan" value={plan.name} />
            <SummaryLine label="Billing Cycle" value={getBillingCycleLabel(cycle)} />
            <SummaryLine
              label="Payment Method"
              value={method ? getPaymentMethodLabel(method) : "-"}
            />
            <SummaryLine
              label="Monthly Base Price"
              value={formatCurrency(plan.price)}
            />
            <SummaryLine
              label="Gross"
              value={`${formatCurrency(breakdown.gross)} (${breakdown.meta.months} ${breakdown.meta.months === 1 ? "month" : "months"})`}
            />
            <SummaryLine
              label="Discount Applied"
              value={
                breakdown.discount > 0
                  ? `-${formatCurrency(breakdown.discount)} (${(breakdown.meta.discount * 100).toFixed(0)}%)`
                  : "No discount"
              }
            />
            <div className="mt-3 flex items-end justify-between border-t border-slate-200 pt-3 dark:border-navy-700">
              <div>
                <p className="text-sm font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                  Total Amount
                </p>
                <p className="font-display text-3xl font-bold text-navy-900 dark:text-white">
                  {formatCurrency(breakdown.total)}
                </p>
                <p className="mt-0.5 text-sm text-slate-500 dark:text-slate-400">
                  Effective {formatCurrency(breakdown.effectiveMonthly)} / month
                </p>
              </div>
              <div className="hidden text-right sm:block">
                <p className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-600 dark:text-slate-300">
                  <Calendar className="h-4 w-4 text-sky-500" />
                  Next bill on{" "}
                  <span className="font-semibold text-navy-900 dark:text-white">
                    {formatDate(getNextBillingDate(cycle))}
                  </span>
                </p>
              </div>
            </div>
          </div>

          {error && (
            <div
              role="alert"
              className="mt-4 flex items-center gap-2.5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-base text-red-700 dark:border-red-500/30 dark:bg-red-500/10 dark:text-red-300"
            >
              <AlertTriangle className="h-5 w-5 shrink-0" />
              {error}
            </div>
          )}

          <p className="mt-5 flex items-start gap-2.5 rounded-xl bg-sky-50 px-4 py-3 text-base text-sky-800 dark:bg-sky-500/10 dark:text-sky-200">
            <CreditCard className="mt-0.5 h-5 w-5 shrink-0" />
            This is a demo payment flow for the SmartBooks AI MVP. No real
            payment will be processed, and sensitive card details are not
            stored.
          </p>
        </div>

        {/* Footer */}
        <div className="flex flex-wrap items-center justify-end gap-3 border-t border-slate-100 px-6 py-4 dark:border-navy-800">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="button" onClick={handleConfirm}>
            <Check className="h-5 w-5" />
            Confirm Plan
          </Button>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Helper subcomponents                                                */
/* ------------------------------------------------------------------ */

function SectionHeading({
  step,
  title,
  description,
  className,
}: {
  step: number;
  title: string;
  description: string;
  className?: string;
}) {
  return (
    <div className={className}>
      <div className="flex items-center gap-3">
        <span className="grid h-8 w-8 place-items-center rounded-full bg-navy-100 text-base font-bold text-navy-800 dark:bg-navy-700/40 dark:text-sky-200">
          {step}
        </span>
        <h3 className="font-display text-lg font-bold text-navy-900 dark:text-white">
          {title}
        </h3>
      </div>
      <p className="mt-1 text-base text-slate-500 dark:text-slate-400">
        {description}
      </p>
    </div>
  );
}

function SummaryLine({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between py-1">
      <p className="text-base text-slate-600 dark:text-slate-300">{label}</p>
      <p className="text-right font-medium text-navy-900 dark:text-white">
        {value}
      </p>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Dynamic payment-details form                                        */
/* ------------------------------------------------------------------ */

interface PaymentDetailsFormProps {
  method: PaymentMethod;
  details: RawPaymentInput;
  setField: <K extends keyof RawPaymentInput>(
    key: K,
    value: RawPaymentInput[K]
  ) => void;
}

function PaymentDetailsForm({
  method,
  details,
  setField,
}: PaymentDetailsFormProps) {
  if (method === "card") {
    return (
      <div className="grid gap-5 sm:grid-cols-2">
        <Input
          label="Cardholder Name"
          autoComplete="cc-name"
          value={details.cardholderName ?? ""}
          onChange={(e) => setField("cardholderName", e.target.value)}
          placeholder="Gilda Cruz"
        />
        <Input
          label="Card Number"
          inputMode="numeric"
          autoComplete="cc-number"
          value={details.cardNumber ?? ""}
          onChange={(e) =>
            setField(
              "cardNumber",
              e.target.value.replace(/[^\d ]/g, "").replace(/(.{4})/g, "$1 ").trim()
            )
          }
          placeholder="4242 4242 4242 4242"
          maxLength={23}
        />
        <Input
          label="Expiry Date (MM/YY)"
          autoComplete="cc-exp"
          value={details.expiry ?? ""}
          onChange={(e) => {
            const raw = e.target.value.replace(/[^\d/]/g, "");
            // auto-insert "/"
            const formatted =
              raw.length === 2 && !raw.includes("/")
                ? raw + "/"
                : raw;
            setField("expiry", formatted.slice(0, 5));
          }}
          placeholder="MM/YY"
          maxLength={5}
        />
        <Input
          label="CVV"
          type="password"
          inputMode="numeric"
          autoComplete="cc-csc"
          value={details.cvv ?? ""}
          onChange={(e) =>
            setField("cvv", e.target.value.replace(/\D/g, "").slice(0, 4))
          }
          placeholder="***"
          maxLength={4}
        />
        <Input
          label="Billing ZIP / Postal Code"
          autoComplete="postal-code"
          value={details.billingZip ?? ""}
          onChange={(e) => setField("billingZip", e.target.value)}
          placeholder="2710"
        />
      </div>
    );
  }

  if (method === "bank_transfer") {
    return (
      <div className="grid gap-5 sm:grid-cols-2">
        <Input
          label="Account Holder Name"
          value={details.accountHolderName ?? ""}
          onChange={(e) => setField("accountHolderName", e.target.value)}
          placeholder="Gilda Cruz"
        />
        <Input
          label="Bank Name"
          value={details.bankName ?? ""}
          onChange={(e) => setField("bankName", e.target.value)}
          placeholder="Banco Comercial do Atlantico"
        />
        <Input
          label="Bank Account Number / IBAN"
          value={details.accountNumber ?? ""}
          onChange={(e) => setField("accountNumber", e.target.value)}
          placeholder="PT50 0000 0000 0000 0000 0000 0"
        />
        <Input
          label="Reference Number (optional)"
          value={details.referenceNumber ?? ""}
          onChange={(e) => setField("referenceNumber", e.target.value)}
          placeholder="SB-2026-0001"
        />
        <div className="sm:col-span-2">
          <p className="mb-2 block text-base font-medium text-navy-800 dark:text-slate-200">
            Proof of Payment
          </p>
          <button
            type="button"
            disabled
            className="flex w-full cursor-not-allowed items-center justify-center gap-2 rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 px-6 py-6 text-base text-slate-500 dark:border-navy-700 dark:bg-navy-950 dark:text-slate-400"
          >
            Upload proof of payment (placeholder - not active in demo)
          </button>
        </div>
      </div>
    );
  }

  if (method === "mobile_money") {
    return (
      <div className="grid gap-5 sm:grid-cols-2">
        <Select
          label="Wallet Provider"
          value={details.walletProvider ?? ""}
          onChange={(e) => setField("walletProvider", e.target.value)}
          options={[
            { value: "", label: "Select a provider" },
            ...WALLET_PROVIDERS.map((p) => ({ value: p, label: p })),
          ]}
        />
        <Input
          label="Mobile Number / Wallet ID"
          inputMode="tel"
          value={details.walletId ?? ""}
          onChange={(e) => setField("walletId", e.target.value)}
          placeholder="+238 991 2030"
        />
        <Input
          label="Account Holder Name"
          value={details.accountHolderName ?? ""}
          onChange={(e) => setField("accountHolderName", e.target.value)}
          placeholder="Gilda Cruz"
        />
      </div>
    );
  }

  if (method === "paypal") {
    return (
      <div className="grid gap-5 sm:grid-cols-2">
        <Input
          label="PayPal Email"
          type="email"
          value={details.paypalEmail ?? ""}
          onChange={(e) => setField("paypalEmail", e.target.value)}
          placeholder="you@example.com"
        />
        <Input
          label="Payment Reference (optional)"
          value={details.paymentReference ?? ""}
          onChange={(e) => setField("paymentReference", e.target.value)}
          placeholder="ORDER-12345"
        />
      </div>
    );
  }

  // manual
  return (
    <div className="grid gap-5 sm:grid-cols-2">
      <Input
        label="Payer Name"
        value={details.payerName ?? ""}
        onChange={(e) => setField("payerName", e.target.value)}
        placeholder="Gilda Cruz"
      />
      <Input
        label="Expected Payment Date"
        type="date"
        value={details.expectedPaymentDate ?? ""}
        onChange={(e) => setField("expectedPaymentDate", e.target.value)}
      />
      <div className="sm:col-span-2">
        <label
          htmlFor="manual-notes"
          className="mb-2 block text-base font-medium text-navy-800 dark:text-slate-200"
        >
          Payment Notes (optional)
        </label>
        <textarea
          id="manual-notes"
          value={details.paymentNotes ?? ""}
          onChange={(e) => setField("paymentNotes", e.target.value)}
          rows={3}
          placeholder="Will deliver bank slip on the agreed date..."
          className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-base text-navy-900 placeholder:text-slate-400 transition focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-500/20 dark:border-navy-700 dark:bg-navy-900 dark:text-slate-100"
        />
      </div>
    </div>
  );
}
