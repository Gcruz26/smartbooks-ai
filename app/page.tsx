// app/page.tsx
import Link from "next/link";
import {
  Sparkles,
  ScanLine,
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
  { icon: Store, label: "Small shops" },
  { icon: Coffee, label: "Restaurants & cafes" },
  { icon: Laptop, label: "Freelancers" },
  { icon: Scissors, label: "Beauty salons" },
  { icon: Car, label: "Taxi drivers" },
  { icon: ShoppingBag, label: "Online sellers" },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-navy-950">
      {/* Nav */}
      <header className="sticky top-0 z-30 border-b border-slate-100 bg-white/80 backdrop-blur-md dark:border-navy-800 dark:bg-navy-950/80">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-5 lg:px-10">
          <Link href="/" className="flex items-center gap-3">
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-navy-800 text-white">
              <Sparkles className="h-6 w-6" />
            </span>
            <span className="font-display text-xl font-bold tracking-tight text-navy-900 dark:text-white">
              SmartBooks<span className="text-sky-500"> AI</span>
            </span>
          </Link>
          <nav className="hidden items-center gap-9 text-base font-medium text-slate-600 dark:text-slate-300 md:flex">
            <a href="#features" className="hover:text-navy-900 dark:hover:text-white">
              Features
            </a>
            <a href="#market" className="hover:text-navy-900 dark:hover:text-white">
              Who it&apos;s for
            </a>
            <a href="#pricing" className="hover:text-navy-900 dark:hover:text-white">
              Pricing
            </a>
          </nav>
          <div className="flex items-center gap-3">
            <Link href="/login">
              <Button variant="ghost" size="sm">
                Log in
              </Button>
            </Link>
            <Link href="/dashboard">
              <Button size="sm">Get Started</Button>
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
              Intelligent accounting, built for small business
            </span>
            <h1 className="mt-7 font-display text-5xl font-bold leading-[1.1] tracking-tight text-navy-900 dark:text-white sm:text-7xl">
              Smart accounting for{" "}
              <span className="bg-gradient-to-r from-navy-600 to-navy-800 bg-clip-text text-transparent">
                small businesses
              </span>
            </h1>
            <p className="mx-auto mt-7 max-w-2xl text-xl leading-relaxed text-slate-600 dark:text-slate-300">
              SmartBooks AI helps small businesses, freelancers, and
              entrepreneurs organize their finances, scan receipts, track income
              and expenses, and generate simple financial reports using
              intelligent technology.
            </p>
            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link href="/dashboard">
                <Button size="lg" className="w-full sm:w-auto">
                  Get Started
                  <ArrowRight className="h-5 w-5" />
                </Button>
              </Link>
              <Link href="#pricing">
                <Button size="lg" variant="outline" className="w-full sm:w-auto">
                  View Pricing
                </Button>
              </Link>
            </div>
            <p className="mt-5 text-sm text-slate-400">
              No credit card required - Free 14-day trial
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
              Everything you need to run the books
            </h2>
            <p className="mt-5 text-xl text-slate-600 dark:text-slate-300">
              Powerful tools that feel simple - designed for people who&apos;d
              rather run their business than do paperwork.
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
              Built for businesses like yours
            </h2>
            <p className="mt-5 text-xl text-slate-600 dark:text-slate-300">
              Whatever you do, SmartBooks AI adapts to the way you work.
            </p>
          </div>
          <div className="mt-16 grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-6">
            {targetMarket.map((m) => (
              <div
                key={m.label}
                className="flex flex-col items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-8 text-center shadow-card transition hover:border-sky-300 dark:border-navy-800 dark:bg-navy-900"
              >
                <span className="grid h-14 w-14 place-items-center rounded-full bg-sky-500/10 text-sky-600 dark:text-sky-300">
                  <m.icon className="h-7 w-7" />
                </span>
                <span className="text-base font-medium text-navy-900 dark:text-white">
                  {m.label}
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
              Simple, transparent pricing
            </h2>
            <p className="mt-5 text-xl text-slate-600 dark:text-slate-300">
              Start free, then pick the plan that grows with you.
            </p>
          </div>
          <div className="mt-16 grid gap-7 lg:grid-cols-3 lg:items-start">
            {pricingPlans.map((plan) => (
              <PricingCard key={plan.id} plan={plan} />
            ))}
          </div>
          <div className="mt-12 text-center">
            <Link href="/pricing">
              <Button variant="ghost">
                Compare all features
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
              Ready to take control of your finances?
            </h2>
            <p className="relative mx-auto mt-5 max-w-xl text-xl text-slate-300">
              Join small businesses already saving hours every month with
              SmartBooks AI.
            </p>
            <div className="relative mt-9 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link href="/dashboard">
                <Button size="lg" variant="secondary" className="w-full sm:w-auto">
                  Get Started Free
                  <ArrowRight className="h-5 w-5" />
                </Button>
              </Link>
              <div className="flex items-center gap-2 text-base text-slate-300">
                <Check className="h-5 w-5 text-sky-300" />
                No setup fees
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
              <Link href="/" className="flex items-center gap-3">
                <span className="grid h-10 w-10 place-items-center rounded-xl bg-navy-800 text-white">
                  <Sparkles className="h-6 w-6" />
                </span>
                <span className="font-display text-xl font-bold tracking-tight text-navy-900 dark:text-white">
                  SmartBooks<span className="text-sky-500"> AI</span>
                </span>
              </Link>
              <p className="mt-4 text-base text-slate-500 dark:text-slate-400">
                Smart accounting for small businesses.
              </p>
            </div>
            <FooterCol
              title="Product"
              links={["Features", "Pricing", "Receipts", "Reports"]}
            />
            <FooterCol
              title="Company"
              links={["About", "Careers", "Blog", "Contact"]}
            />
            <FooterCol
              title="Legal"
              links={["Privacy", "Terms", "Security", "Cookies"]}
            />
          </div>
          <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-slate-100 pt-7 text-sm text-slate-400 dark:border-navy-800 sm:flex-row">
            <p>(c) 2026 SmartBooks AI. All rights reserved.</p>
            <p>Made for small businesses everywhere.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

function FooterCol({ title, links }: { title: string; links: string[] }) {
  return (
    <div>
      <h4 className="text-base font-semibold text-navy-900 dark:text-white">
        {title}
      </h4>
      <ul className="mt-4 space-y-3">
        {links.map((l) => (
          <li key={l}>
            <a
              href="#"
              className="text-base text-slate-500 transition hover:text-navy-900 dark:text-slate-400 dark:hover:text-white"
            >
              {l}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
