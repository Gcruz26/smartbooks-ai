// components/PricingCard.tsx
import { Check, Sparkles } from "lucide-react";
import type { PricingPlan } from "@/lib/types";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

export function PricingCard({ plan }: { plan: PricingPlan }) {
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
      >
        {plan.cta}
      </Button>
    </div>
  );
}
