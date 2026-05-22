// app/pricing/page.tsx
import { Check, HelpCircle } from "lucide-react";
import { DashboardShell } from "@/components/DashboardShell";
import { PricingCard } from "@/components/PricingCard";
import { pricingPlans } from "@/lib/mockData";

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
  return (
    <DashboardShell
      title="Pricing"
      subtitle="Choose the plan that fits your business"
    >
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="font-display text-3xl font-bold tracking-tight text-navy-900 dark:text-white sm:text-4xl">
          Plans that scale with you
        </h2>
        <p className="mt-4 text-lg text-slate-600 dark:text-slate-300">
          Start free for 14 days. Cancel anytime. No hidden fees.
        </p>
      </div>

      <div className="mt-16 grid gap-7 lg:grid-cols-3 lg:items-start">
        {pricingPlans.map((plan) => (
          <PricingCard key={plan.id} plan={plan} />
        ))}
      </div>

      {/* Money-back banner */}
      <div className="mt-12 flex items-center justify-center gap-2.5 rounded-2xl border border-emerald-200 bg-emerald-50 px-6 py-5 text-base text-emerald-800 dark:border-emerald-500/30 dark:bg-emerald-500/10 dark:text-emerald-300">
        <Check className="h-5 w-5" />
        30-day money-back guarantee on all annual plans.
      </div>

      {/* FAQ */}
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
    </DashboardShell>
  );
}
