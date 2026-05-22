"use client";

// app/settings/page.tsx
import { useState } from "react";
import {
  Building2,
  Bell,
  Check,
  Save,
  ShieldCheck,
  CreditCard,
} from "lucide-react";
import { DashboardShell } from "@/components/DashboardShell";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { business } from "@/lib/mockData";

const currencyOptions = [
  { value: "USD", label: "USD - US Dollar ($)" },
  { value: "EUR", label: "EUR - Euro" },
  { value: "CVE", label: "CVE - Cape Verdean Escudo" },
  { value: "GBP", label: "GBP - British Pound" },
  { value: "BRL", label: "BRL - Brazilian Real" },
];

const languageOptions = [
  { value: "English", label: "English" },
  { value: "Portuguese", label: "Portugues" },
  { value: "Spanish", label: "Espanol" },
  { value: "French", label: "Francais" },
];

type NotificationKey = keyof typeof business.notifications;

const notificationMeta: {
  key: NotificationKey;
  title: string;
  description: string;
}[] = [
  {
    key: "taxReminders",
    title: "Tax deadline reminders",
    description: "Get notified before important tax and filing deadlines.",
  },
  {
    key: "weeklySummary",
    title: "Weekly financial summary",
    description: "A digest of your income, expenses, and cash flow each week.",
  },
  {
    key: "invoiceAlerts",
    title: "Invoice & payment alerts",
    description: "Be alerted when invoices are due, paid, or overdue.",
  },
  {
    key: "productUpdates",
    title: "Product updates",
    description: "Occasional news about new SmartBooks AI features.",
  },
];

function Toggle({
  checked,
  onChange,
}: {
  checked: boolean;
  onChange: () => void;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={onChange}
      className={`relative inline-flex h-7 w-12 shrink-0 items-center rounded-full transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-navy-950 ${
        checked ? "bg-sky-500" : "bg-slate-300 dark:bg-navy-700"
      }`}
    >
      <span
        className={`inline-block h-6 w-6 transform rounded-full bg-white shadow transition-transform ${
          checked ? "translate-x-5" : "translate-x-0.5"
        }`}
      />
    </button>
  );
}

function SectionCard({
  icon: Icon,
  title,
  description,
  children,
}: {
  icon: React.ElementType;
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-7 shadow-card dark:border-navy-800 dark:bg-navy-900">
      <div className="mb-6 flex items-start gap-3.5">
        <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-sky-50 text-sky-600 dark:bg-navy-800 dark:text-sky-400">
          <Icon className="h-6 w-6" />
        </span>
        <div>
          <h2 className="font-display text-xl font-semibold text-navy-900 dark:text-white">
            {title}
          </h2>
          <p className="mt-1 text-base text-slate-500 dark:text-slate-400">
            {description}
          </p>
        </div>
      </div>
      {children}
    </section>
  );
}

export default function SettingsPage() {
  const [form, setForm] = useState({
    name: business.name,
    ownerName: business.ownerName,
    email: business.email,
    taxId: business.taxId,
    currency: business.currency,
    language: business.language,
  });
  const [notifications, setNotifications] = useState({
    ...business.notifications,
  });
  const [saved, setSaved] = useState(false);

  const update = (key: keyof typeof form, value: string) => {
    setForm((f) => ({ ...f, [key]: value }));
    setSaved(false);
  };

  const toggleNotification = (key: NotificationKey) => {
    setNotifications((n) => ({ ...n, [key]: !n[key] }));
    setSaved(false);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    window.setTimeout(() => setSaved(false), 2600);
  };

  return (
    <DashboardShell
      title="Settings"
      subtitle="Manage your business profile and preferences"
    >
      <form onSubmit={handleSave} className="max-w-3xl space-y-7">
        <SectionCard
          icon={Building2}
          title="Business profile"
          description="This information appears on your reports and invoices."
        >
          <div className="grid gap-5 sm:grid-cols-2">
            <Input
              id="name"
              label="Business name"
              value={form.name}
              onChange={(e) => update("name", e.target.value)}
            />
            <Input
              id="ownerName"
              label="Owner name"
              value={form.ownerName}
              onChange={(e) => update("ownerName", e.target.value)}
            />
            <Input
              id="email"
              type="email"
              label="Email address"
              value={form.email}
              onChange={(e) => update("email", e.target.value)}
            />
            <Input
              id="taxId"
              label="Tax identification number"
              value={form.taxId}
              onChange={(e) => update("taxId", e.target.value)}
            />
            <Select
              id="currency"
              label="Currency"
              options={currencyOptions}
              value={form.currency}
              onChange={(e) => update("currency", e.target.value)}
            />
            <Select
              id="language"
              label="Language"
              options={languageOptions}
              value={form.language}
              onChange={(e) => update("language", e.target.value)}
            />
          </div>
        </SectionCard>

        <SectionCard
          icon={Bell}
          title="Notification preferences"
          description="Choose which alerts SmartBooks AI sends you."
        >
          <div className="divide-y divide-slate-100 dark:divide-navy-800">
            {notificationMeta.map((item) => (
              <div
                key={item.key}
                className="flex items-center justify-between gap-4 py-4 first:pt-0 last:pb-0"
              >
                <div>
                  <p className="text-base font-medium text-navy-900 dark:text-slate-100">
                    {item.title}
                  </p>
                  <p className="mt-1 text-base text-slate-500 dark:text-slate-400">
                    {item.description}
                  </p>
                </div>
                <Toggle
                  checked={notifications[item.key]}
                  onChange={() => toggleNotification(item.key)}
                />
              </div>
            ))}
          </div>
        </SectionCard>

        <SectionCard
          icon={CreditCard}
          title="Plan & billing"
          description="You are currently on the Pro plan."
        >
          <div className="flex flex-col items-start justify-between gap-4 rounded-xl bg-slate-50 p-5 dark:bg-navy-800/60 sm:flex-row sm:items-center">
            <div className="flex items-center gap-3.5">
              <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-sky-500/10 text-sky-600 dark:text-sky-400">
                <ShieldCheck className="h-6 w-6" />
              </span>
              <div>
                <p className="text-base font-semibold text-navy-900 dark:text-white">
                  Pro Plan - $19.99/month
                </p>
                <p className="mt-0.5 text-base text-slate-500 dark:text-slate-400">
                  Renews automatically - cancel anytime
                </p>
              </div>
            </div>
            <Button type="button" variant="outline" size="sm">
              Manage plan
            </Button>
          </div>
        </SectionCard>

        <div className="flex items-center justify-end gap-3">
          {saved && (
            <span className="flex items-center gap-1.5 text-base font-medium text-green-600 dark:text-green-400">
              <Check className="h-5 w-5" />
              Changes saved
            </span>
          )}
          <Button type="submit">
            <Save className="h-5 w-5" />
            Save changes
          </Button>
        </div>
      </form>
    </DashboardShell>
  );
}
