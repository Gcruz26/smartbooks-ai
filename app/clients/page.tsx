"use client";

// app/clients/page.tsx
import { useMemo, useState } from "react";
import { Plus, Users, DollarSign, AlertCircle, Search, X } from "lucide-react";
import { DashboardShell } from "@/components/DashboardShell";
import { StatCard } from "@/components/StatCard";
import { ClientTable } from "@/components/ClientTable";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { clients as seedClients } from "@/lib/mockData";
import type { Client, ClientStatus } from "@/lib/types";
import { formatCurrency } from "@/lib/utils";

export default function ClientsPage() {
  const [items, setItems] = useState<Client[]>(seedClients);
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);

  const filtered = useMemo(
    () =>
      items.filter((c) =>
        search
          ? c.name.toLowerCase().includes(search.toLowerCase()) ||
            c.businessType.toLowerCase().includes(search.toLowerCase()) ||
            c.email.toLowerCase().includes(search.toLowerCase())
          : true
      ),
    [items, search]
  );

  const totalBilled = items.reduce((acc, c) => acc + c.totalBilled, 0);
  const totalOutstanding = items.reduce(
    (acc, c) => acc + c.outstandingBalance,
    0
  );
  const activeCount = items.filter((c) => c.status === "active").length;

  function addClient(c: Client) {
    setItems((prev) => [c, ...prev]);
    setShowForm(false);
  }

  return (
    <DashboardShell
      title="Clients"
      subtitle="Manage your customers and outstanding balances"
    >
      <div className="grid gap-5 sm:grid-cols-3">
        <StatCard label="Active Clients" value={String(activeCount)} icon={Users} accent="navy" />
        <StatCard label="Total Billed" value={formatCurrency(totalBilled)} icon={DollarSign} accent="green" />
        <StatCard label="Outstanding" value={formatCurrency(totalOutstanding)} icon={AlertCircle} accent="red" />
      </div>

      <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full sm:max-w-sm">
          <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search clients..."
            className="h-12 w-full rounded-xl border border-slate-300 bg-white pl-11 pr-4 text-base text-navy-900 placeholder:text-slate-400 focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-500/20 dark:border-navy-700 dark:bg-navy-900 dark:text-slate-100"
          />
        </div>
        <Button onClick={() => setShowForm((s) => !s)}>
          <Plus className="h-5 w-5" />
          Add Client
        </Button>
      </div>

      {showForm && <ClientForm onAdd={addClient} onCancel={() => setShowForm(false)} />}

      <div className="mt-6 rounded-2xl border border-slate-200 bg-white shadow-card dark:border-navy-800 dark:bg-navy-900">
        <div className="border-b border-slate-100 px-6 py-5 dark:border-navy-800">
          <h3 className="font-display text-lg font-bold text-navy-900 dark:text-white">
            {filtered.length} client{filtered.length !== 1 ? "s" : ""}
          </h3>
        </div>
        <ClientTable clients={filtered} />
      </div>
    </DashboardShell>
  );
}

function ClientForm({
  onAdd,
  onCancel,
}: {
  onAdd: (c: Client) => void;
  onCancel: () => void;
}) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [businessType, setBusinessType] = useState("");
  const [totalBilled, setTotalBilled] = useState("");
  const [status, setStatus] = useState<ClientStatus>("active");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    onAdd({
      id: `c_${Date.now()}`,
      name: name || "New Client",
      email,
      phone,
      businessType: businessType || "-",
      totalBilled: parseFloat(totalBilled) || 0,
      outstandingBalance: 0,
      status,
    });
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="mt-6 animate-fade-up rounded-2xl border border-slate-200 bg-white p-7 shadow-card dark:border-navy-800 dark:bg-navy-900"
    >
      <div className="mb-5 flex items-center justify-between">
        <h3 className="font-display text-xl font-bold text-navy-900 dark:text-white">
          New Client
        </h3>
        <button
          type="button"
          onClick={onCancel}
          className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 dark:hover:bg-navy-800"
          aria-label="Close form"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        <Input label="Client name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Acme Co." />
        <Input label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="hello@acme.com" />
        <Input label="Phone" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+238 ..." />
        <Input label="Business type" value={businessType} onChange={(e) => setBusinessType(e.target.value)} placeholder="Retail" />
        <Input label="Total billed (USD)" type="number" step="0.01" min="0" value={totalBilled} onChange={(e) => setTotalBilled(e.target.value)} placeholder="0.00" />
        <Select
          label="Status"
          value={status}
          onChange={(e) => setStatus(e.target.value as ClientStatus)}
          options={[
            { value: "active", label: "Active" },
            { value: "lead", label: "Lead" },
            { value: "inactive", label: "Inactive" },
          ]}
        />
      </div>

      <div className="mt-6 flex justify-end gap-3">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">Add Client</Button>
      </div>
    </form>
  );
}
