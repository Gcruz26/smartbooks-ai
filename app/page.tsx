"use client";

// app/page.tsx
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { BrandLogo } from "@/components/BrandLogo";
import { useLanguage } from "@/components/LanguageProvider";
import { SUPPORTED_LANGUAGES } from "@/lib/i18n";
import type { Language, TranslationKey } from "@/lib/i18n";
import {
  Sparkles,
  ScanLine,
  Globe,
  ChevronDown,
  Check as CheckIcon,
  TrendingUp,
  FileBarChart,
  BellRing,
  FolderArchive,
  Headphones,
  ArrowRight,
  Check,
  Store,
  Coffee,
  Laptop,
  Scissors,
  Car,
  ShoppingBag,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { PricingCard } from "@/components/PricingCard";
import { pricingPlans } from "@/lib/mockData";

const features = [
  {
    icon: ScanLine,
    title: "AI Receipt Scanning",
    desc: "Snap a photo and let SmartBooks AI extract the supplier, amount, and category automatically.",
  },
  {
    icon: TrendingUp,
    title: "Income & Expense Tracking",
    desc: "Record every transaction and watch your cash flow update in real time.",
  },
  {
    icon: FileBarChart,
    title: "Monthly Financial Reports",
    desc: "Clear profit-and-loss summaries you can share with your accountant in one click.",
  },
  {
    icon: BellRing,
    title: "Tax Deadline Reminders",
    desc: "Never miss a filing again - get nudges before every important date.",
  },
  {
    icon: FolderArchive,
    title: "Digital Document Storage",
    desc: "Keep every receipt and invoice safely organized and searchable in the cloud.",
  },
  {
    icon: Headphones,
    title: "Accounting Support",
    desc: "Get human help when you need it, right alongside your AI assistant.",
  },
];

const targetMarket = [
  { icon: Store, labelKey: "landing_who_small_shops" as const },
  { icon: Coffee, labelKey: "landing_who_restaurants" as const },
  { icon: Laptop, labelKey: "landing_who_freelancers" as const },
  { icon: Scissors, labelKey: "landing_who_beauty_salons" as const },
  { icon: Car, labelKey: "landing_who_taxi_drivers" as const },
  { icon: ShoppingBag, labelKey: "landing_who_online_sellers" as const },
];

export default function LandingPage() {
  const { t } = useLanguage();
  return (
    <div className="min-h-screen bg-white dark:bg-navy-950">
      {/* Nav */}
      <header className="sticky top-0 z-30 border-b border-slate-100 bg-white/80 backdrop-blur-md dark:border-navy-800 dark:bg-navy-950/80">
        <div className="mx-auto flex h-28 max-w-7xl items-center justify-between px-5 lg:px-10">
          <Link href="/" aria-label="SmartBooks AI" className="inline-flex">
            <BrandLogo size="header" priority />
          </Link>
          <nav className="hidden items-center gap-9 text-base font-medium text-slate-600 dark:text-slate-300 md:flex">
            <a href="#features" className="hover:text-navy-900 dark:hover:text-white">
              {t("landing_nav_features")}
            </a>
            <a href="#market" className="hover:text-navy-900 dark:hover:text-white">
              {t("landing_nav_market")}
            </a>
            <a href="#pricing" className="hover:text-navy-900 dark:hover:text-white">
              {t("landing_nav_pricing")}
            </a>
          </nav>
          <div className="flex items-center gap-3">
            <LanguageSwitcher />
            <Link href="/login">
              <Button variant="ghost" size="sm">
                {t("landing_log_in")}
              </Button>
            </Link>
            <Link href="/dashboard">
              <Button size="sm">{t("landing_get_started")}</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden bg-grid">
        <div className="pointer-events-none absolute -right-40 -top-40 h-96 w-96 rounded-full bg-sky-500/10 blur-3xl" />
        <div className="pointer-events-none absolute -left-40 top-40 h-96 w-96 rounded-full bg-navy-500/10 blur-3xl" />
        <div className="mx-auto max-w-7xl px-5 py-24 lg:px-10 lg:py-32">
          <div className="mx-auto max-w-3xl text-center">
            <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-5 py-2 text-base font-medium text-navy-700 shadow-sm dark:border-navy-700 dark:bg-navy-900 dark:text-slate-200">
              <Sparkles className="h-5 w-5 text-sky-500" />
              {t("landing_hero_badge")}
            </span>
            <h1 className="mt-7 font-display text-4xl font-bold leading-[1.1] tracking-tight text-navy-900 dark:text-white sm:text-6xl">
              {t("slogan_login_a")}{" "}
              <span className="bg-gradient-to-r from-navy-600 to-navy-800 bg-clip-text text-transparent">
                {t("slogan_login_b")} {t("slogan_login_c")}
              </span>
            </h1>
            <p className="mx-auto mt-7 max-w-2xl text-xl leading-relaxed text-slate-600 dark:text-slate-300">
              {t("landing_hero_lead")}
            </p>
            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link href="/dashboard">
                <Button size="lg" className="w-full sm:w-auto">
                  {t("landing_get_started")}
                  <ArrowRight className="h-5 w-5" />
                </Button>
              </Link>
              <Link href="#pricing">
                <Button size="lg" variant="outline" className="w-full sm:w-auto">
                  {t("landing_view_pricing")}
                </Button>
              </Link>
            </div>
            <p className="mt-5 text-sm text-slate-400">
              {t("landing_no_credit_card")}
            </p>
          </div>

          {/* Hero preview mockup */}
          <div className="mx-auto mt-20 max-w-4xl">
            <div className="rounded-3xl border border-slate-200 bg-white p-3 shadow-card-hover dark:border-navy-800 dark:bg-navy-900">
              <div className="rounded-2xl bg-gradient-to-br from-navy-800 to-navy-950 p-7 sm:p-9">
                <div className="grid grid-cols-2 gap-5 sm:grid-cols-4">
                  {[
                    { label: "Total Income", value: "$24.8k" },
                    { label: "Total Expenses", value: "$18.0k" },
                    { label: "Net Profit", value: "$6.8k" },
                    { label: "Receipts", value: "142" },
                  ].map((s) => (
                    <div
                      key={s.label}
                      className="rounded-xl bg-white/5 p-5 ring-1 ring-white/10 backdrop-blur"
                    >
                      <p className="text-sm text-slate-400">{s.label}</p>
                      <p className="mt-1.5 font-display text-2xl font-bold text-white">
                        {s.value}
                      </p>
                    </div>
                  ))}
                </div>
                <div className="mt-5 flex items-center gap-2.5 rounded-xl bg-sky-500/10 p-5 ring-1 ring-sky-400/20">
                  <Sparkles className="h-5 w-5 shrink-0 text-sky-300" />
                  <p className="text-base text-slate-200">
                    Your net profit margin is positive this month - up 12% from
                    April.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="bg-slate-50 py-24 dark:bg-navy-900/30 lg:py-32">
        <div className="mx-auto max-w-7xl px-5 lg:px-10">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="font-display text-4xl font-bold tracking-tight text-navy-900 dark:text-white sm:text-5xl">
              {t("landing_features_title")}
            </h2>
            <p className="mt-5 text-xl text-slate-600 dark:text-slate-300">
              {t("landing_features_subtitle")}
            </p>
          </div>
          <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((f) => (
              <div
                key={f.title}
                className="group rounded-2xl border border-slate-200 bg-white p-7 shadow-card transition hover:-translate-y-1 hover:shadow-card-hover dark:border-navy-800 dark:bg-navy-900"
              >
                <span className="grid h-14 w-14 place-items-center rounded-xl bg-navy-800/10 text-navy-800 transition group-hover:bg-navy-800 group-hover:text-white dark:bg-navy-700/30 dark:text-sky-300">
                  <f.icon className="h-7 w-7" />
                </span>
                <h3 className="mt-6 font-display text-xl font-bold text-navy-900 dark:text-white">
                  {f.title}
                </h3>
                <p className="mt-2.5 text-base leading-relaxed text-slate-600 dark:text-slate-300">
                  {f.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Target market */}
      <section id="market" className="py-24 lg:py-32">
        <div className="mx-auto max-w-7xl px-5 lg:px-10">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="font-display text-4xl font-bold tracking-tight text-navy-900 dark:text-white sm:text-5xl">
              {t("landing_who_title")}
            </h2>
            <p className="mt-5 text-xl text-slate-600 dark:text-slate-300">
              {t("landing_who_subtitle")}
            </p>
          </div>
          <div className="mt-16 grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-6">
            {targetMarket.map((m) => (
              <div
                key={t(m.labelKey)}
                className="flex flex-col items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-8 text-center shadow-card transition hover:border-sky-300 dark:border-navy-800 dark:bg-navy-900"
              >
                <span className="grid h-14 w-14 place-items-center rounded-full bg-sky-500/10 text-sky-600 dark:text-sky-300">
                  <m.icon className="h-7 w-7" />
                </span>
                <span className="text-base font-medium text-navy-900 dark:text-white">
                  {t(m.labelKey)}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing preview */}
      <section id="pricing" className="bg-slate-50 py-24 dark:bg-navy-900/30 lg:py-32">
        <div className="mx-auto max-w-7xl px-5 lg:px-10">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="font-display text-4xl font-bold tracking-tight text-navy-900 dark:text-white sm:text-5xl">
              {t("landing_pricing_title")}
            </h2>
            <p className="mt-5 text-xl text-slate-600 dark:text-slate-300">
              {t("landing_pricing_subtitle")}
            </p>
          </div>
          <div className="mt-16 grid gap-7 lg:grid-cols-3 lg:items-start">
            {pricingPlans.map((plan) => (
              <PricingCard key={plan.id} plan={translatePlan(plan, t)} />
            ))}
          </div>
          <div className="mt-12 text-center">
            <Link href="/pricing">
              <Button variant="ghost">
                {t("landing_compare_features")}
                <ArrowRight className="h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 lg:py-32">
        <div className="mx-auto max-w-5xl px-5 lg:px-10">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-navy-800 to-navy-950 px-7 py-16 text-center sm:px-14">
            <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-sky-500/20 blur-3xl" />
            <h2 className="relative font-display text-4xl font-bold tracking-tight text-white sm:text-5xl">
              {t("landing_cta_title")}
            </h2>
            <p className="relative mx-auto mt-5 max-w-xl text-xl text-slate-300">
              {t("landing_cta_subtitle")}
            </p>
            <div className="relative mt-9 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link href="/dashboard">
                <Button size="lg" variant="secondary" className="w-full sm:w-auto">
                  {t("landing_cta_button")}
                  <ArrowRight className="h-5 w-5" />
                </Button>
              </Link>
              <div className="flex items-center gap-2 text-base text-slate-300">
                <Check className="h-5 w-5 text-sky-300" />
                {t("landing_cta_note")}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white dark:border-navy-800 dark:bg-navy-950">
        <div className="mx-auto max-w-7xl px-5 py-14 lg:px-10">
          <div className="grid gap-9 md:grid-cols-4">
            <div className="md:col-span-1">
              <Link href="/" aria-label="SmartBooks AI" className="inline-flex">
                <BrandLogo size="medium" />
              </Link>
              <p className="mt-4 text-base text-slate-500 dark:text-slate-400">
                {t("slogan")}
              </p>
            </div>
            <FooterCol
              titleKey="footer_product"
              linkKeys={[
                "footer_features",
                "footer_pricing",
                "footer_receipts",
                "footer_reports",
              ]}
            />
            <FooterCol
              titleKey="footer_company"
              linkKeys={[
                "footer_about",
                "footer_careers",
                "footer_blog",
                "footer_contact",
              ]}
            />
            <FooterCol
              titleKey="footer_legal"
              linkKeys={[
                "footer_privacy",
                "footer_terms",
                "footer_security",
                "footer_cookies",
              ]}
            />
          </div>
          <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-slate-100 pt-7 text-sm text-slate-400 dark:border-navy-800 sm:flex-row">
            <p>{t("footer_rights")}</p>
            <p>{t("footer_tagline")}</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

function FooterCol({
  titleKey,
  linkKeys,
}: {
  titleKey: TranslationKey;
  linkKeys: TranslationKey[];
}) {
  const { t } = useLanguage();
  return (
    <div>
      <h4 className="text-base font-semibold text-navy-900 dark:text-white">
        {t(titleKey)}
      </h4>
      <ul className="mt-4 space-y-3">
        {linkKeys.map((k) => (
          <li key={k}>
            <a
              href="#"
              className="text-base text-slate-500 transition hover:text-navy-900 dark:text-slate-400 dark:hover:text-white"
            >
              {t(k)}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}


/** Translate a pricing plan's text fields. Falls back to the seed values. */
function translatePlan(
  plan: typeof pricingPlans[number],
  t: (k: TranslationKey) => string
): typeof pricingPlans[number] {
  const id = plan.id as "basic" | "pro" | "premium";
  const featureKeys: Record<"basic" | "pro" | "premium", TranslationKey[]> = {
    basic: [
      "landing_plan_basic_f1",
      "landing_plan_basic_f2",
      "landing_plan_basic_f3",
      "landing_plan_basic_f4",
      "landing_plan_basic_f5",
    ],
    pro: [
      "landing_plan_pro_f1",
      "landing_plan_pro_f2",
      "landing_plan_pro_f3",
      "landing_plan_pro_f4",
      "landing_plan_pro_f5",
      "landing_plan_pro_f6",
    ],
    premium: [
      "landing_plan_premium_f1",
      "landing_plan_premium_f2",
      "landing_plan_premium_f3",
      "landing_plan_premium_f4",
      "landing_plan_premium_f5",
      "landing_plan_premium_f6",
    ],
  };
  return {
    ...plan,
    name: t(`landing_plan_${id}_name` as TranslationKey),
    description: t(`landing_plan_${id}_desc` as TranslationKey),
    cta: t(`landing_plan_${id}_cta` as TranslationKey),
    features: featureKeys[id].map((k) => t(k)),
  };
}

/* ------------------------------------------------------------------ */
/*  Inline language switcher (used in the landing nav)                  */
/* ------------------------------------------------------------------ */

function LanguageSwitcher() {
  const { language, setLanguage, t } = useLanguage();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function onDocClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", onDocClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDocClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  function pick(lang: Language) {
    setLanguage(lang);
    setOpen(false);
  }

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((s) => !s)}
        aria-haspopup="true"
        aria-expanded={open}
        aria-label="Language"
        className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-2.5 text-sm font-semibold text-navy-800 transition hover:bg-slate-50 dark:border-navy-700 dark:bg-navy-900 dark:text-slate-100 dark:hover:bg-navy-800"
      >
        <Globe className="h-4 w-4 text-sky-500" />
        <span className="font-mono">{language.toUpperCase()}</span>
        <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
      </button>
      {open && (
        <div className="animate-fade-in absolute right-0 top-full z-50 mt-2 w-40 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-card-hover dark:border-navy-800 dark:bg-navy-900">
          <p className="border-b border-slate-100 px-3 py-2 text-xs font-semibold uppercase tracking-wide text-slate-400 dark:border-navy-800">
            {t("language")}
          </p>
          {SUPPORTED_LANGUAGES.map((opt) => {
            const active = opt.code === language;
            return (
              <button
                key={opt.code}
                type="button"
                onClick={() => pick(opt.code)}
                className={
                  "flex w-full items-center justify-between gap-2 px-3 py-2 text-left text-sm transition " +
                  (active
                    ? "bg-sky-50 font-semibold text-navy-900 dark:bg-sky-500/10 dark:text-white"
                    : "text-slate-700 hover:bg-slate-50 dark:text-slate-200 dark:hover:bg-navy-800")
                }
              >
                <span>{opt.label}</span>
                {active && (
                  <CheckIcon className="h-4 w-4 text-sky-600 dark:text-sky-300" />
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
