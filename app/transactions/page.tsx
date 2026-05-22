"use client";

// app/transactions/page.tsx
import { useMemo, useState } from "react";
import { Plus, TrendingUp, TrendingDown, Wallet, X, Search } from "lucide-react";
import { DashboardShell } from "@/components/DashboardShell";
import { StatCard } from "@/components/StatCard";
import { TransactionTable } from "@/components/TransactionTable";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import {
  transactions as seedTransactions,
  incomeCategories,
  expenseCategories,
  paymentMethods,
} from "@/lib/mockData";
import type {
  Transaction,
  TransactionType,
  TransactionStatus,
  DocumentType,
} from "@/lib/types";
import { sumByType, netProfit, formatCurrency } from "@/lib/utils";
import {
  ALL_TRANSACTION_TYPES,
  ALL_DOCUMENT_TYPES,
  transactionTypeLabels,
  documentTypeLabels,
} from "@/lib/accounting";

const TRANSACTION_TYPE_OPTIONS = ALL_TRANSACTION_TYPES.map((t) => ({
  value: t,
  label: transactionTypeLabels[t],
}));

const DOCUMENT_TYPE_OPTIONS = ALL_DOCUMENT_TYPES.map((d) => ({
  value: d,
  label: documentTypeLabels[d],
}));

export default function TransactionsPage() {
  const [items, setItems] = useState<Transaction[]>(seedTransactions);
  const [showForm, setShowForm] = useState(false);

  // Filters
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [docFilter, setDocFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  const filtered = useMemo(() => {
    return items
      .filter((t) => (typeFilter === "all" ? true : t.type === typeFilter))
      .filter((t) =>
        docFilter === "all" ? true : t.documentType === docFilter
      )
      .filter((t) =>
        categoryFilter === "all" ? true : t.category === categoryFilter
      )
      .filter((t) =>
        statusFilter === "all" ? true : t.status === statusFilter
      )
      .filter((t) =>
        search
          ? t.description.toLowerCase().includes(search.toLowerCase()) ||
            t.category.toLowerCase().includes(search.toLowerCase()) ||
            (t.client ?? "").toLowerCase().includes(search.toLowerCase())
          : true
      )
      .sort((a, b) => b.date.localeCompare(a.date));
  }, [items, typeFilter, docFilter, categoryFilter, statusFilter, search]);

  const totalIncome = sumByType(filtered, "income");
  const totalExpenses = sumByType(filtered, "expense");
  const profit = netProfit(filtered);

  const allCategories = Array.from(
    new Set([...incomeCategories, ...expenseCategories])
  );

  function addTransaction(t: Transaction) {
    setItems((prev) => [t, ...prev]);
    setShowForm(false);
  }

  return (
    <DashboardShell
      title="Transactions"
      subtitle="Track every movement and its supporting accounting document."
    >
      {/* Summary */}
      <div className="grid gap-5 sm:grid-cols-3">
        <StatCard
          label="Income"
          value={formatCurrency(totalIncome)}
          icon={TrendingUp}
          accent="green"
        />
        <StatCard
          label="Expenses"
          value={formatCurrency(totalExpenses)}
          icon={TrendingDown}
          accent="red"
        />
        <StatCard
          label="Net Profit"
          value={formatCurrency(profit)}
          icon={Wallet}
          accent="navy"
        />
      </div>

      {/* Toolbar */}
      <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full sm:max-w-sm">
          <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search transactions..."
            className="h-12 w-full rounded-xl border border-slate-300 bg-white pl-11 pr-4 text-base text-navy-900 placeholder:text-slate-400 focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-500/20 dark:border-navy-700 dark:bg-navy-900 dark:text-slate-100"
          />
        </div>
        <Button onClick={() => setShowForm((s) => !s)}>
          <Plus className="h-5 w-5" />
          Add Transaction
        </Button>
      </div>

      {showForm && (
        <TransactionForm
          onAdd={addTransaction}
          onCancel={() => setShowForm(false)}
        />
      )}

      {/* Filters */}
      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Select
          label="Transaction Type"
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          options={[
            { value: "all", label: "All types" },
            ...TRANSACTION_TYPE_OPTIONS,
          ]}
        />
        <Select
          label="Document Type"
          value={docFilter}
          onChange={(e) => setDocFilter(e.target.value)}
          options={[
            { value: "all", label: "All documents" },
            ...DOCUMENT_TYPE_OPTIONS,
          ]}
        />
        <Select
          label="Category"
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          options={[
            { value: "all", label: "All categories" },
            ...allCategories.map((c) => ({ value: c, label: c })),
          ]}
        />
        <Select
          label="Status"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          options={[
            { value: "all", label: "All statuses" },
            { value: "paid", label: "Paid" },
            { value: "pending", label: "Pending" },
            { value: "overdue", label: "Overdue" },
          ]}
        />
      </div>

      {/* Table */}
      <div className="mt-6 rounded-2xl border border-slate-200 bg-white shadow-card dark:border-navy-800 dark:bg-navy-900">
        <div className="border-b border-slate-100 px-6 py-5 dark:border-navy-800">
          <h3 className="font-display text-xl font-bold text-navy-900 dark:text-white">
            {filtered.length} transaction{filtered.length !== 1 ? "s" : ""}
          </h3>
        </div>
        <TransactionTable transactions={filtered} />
      </div>
    </DashboardShell>
  );
}

function TransactionForm({
  onAdd,
  onCancel,
}: {
  onAdd: (t: Transaction) => void;
  onCancel: () => void;
}) {
  const [type, setType] = useState<TransactionType>("expense");
  const [documentType, setDocumentType] = useState<DocumentType>("invoice");
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [category, setCategory] = useState(expenseCategories[0]);
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [paymentMethod, setPaymentMethod] = useState(paymentMethods[0]);
  const [status, setStatus] = useState<TransactionStatus>("paid");

  const categories = type === "income" ? incomeCategories : expenseCategories;

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    onAdd({
      id: `t_${Date.now()}`,
      date,
      type,
      documentType,
      category,
      description: description || "Untitled transaction",
      amount: parseFloat(amount) || 0,
      paymentMethod,
      status,
    });
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="mt-6 animate-fade-up rounded-2xl border border-slate-200 bg-white p-7 shadow-card dark:border-navy-800 dark:bg-navy-900"
    >
      <div className="mb-5 flex items-center justify-between">
        <div>
          <h3 className="font-display text-xl font-bold text-navy-900 dark:text-white">
            New Transaction
          </h3>
          <p className="mt-1 text-base text-slate-500 dark:text-slate-400">
            Choose the movement type and the accounting document that supports it.
          </p>
        </div>
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
        <Select
          label="Transaction Type"
          value={type}
          onChange={(e) => {
            const newType = e.target.value as TransactionType;
            setType(newType);
            if (newType === "income") setCategory(incomeCategories[0]);
            else setCategory(expenseCategories[0]);
          }}
          options={TRANSACTION_TYPE_OPTIONS}
        />
        <Select
          label="Document Type"
          value={documentType}
          onChange={(e) => setDocumentType(e.target.value as DocumentType)}
          options={DOCUMENT_TYPE_OPTIONS}
        />
        <Input
          label="Date"
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
        <Select
          label="Category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          options={categories.map((c) => ({ value: c, label: c }))}
        />
        <Input
          label="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="e.g. Office rent"
        />
        <Input
          label="Amount (USD)"
          type="number"
          step="0.01"
          min="0"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="0.00"
        />
        <Select
          label="Payment Method"
          value={paymentMethod}
          onChange={(e) => setPaymentMethod(e.target.value)}
          options={paymentMethods.map((m) => ({ value: m, label: m }))}
        />
        <Select
          label="Status"
          value={status}
          onChange={(e) => setStatus(e.target.value as TransactionStatus)}
          options={[
            { value: "paid", label: "Paid" },
            { value: "pending", label: "Pending" },
            { value: "overdue", label: "Overdue" },
          ]}
        />
      </div>

      <div className="mt-6 flex justify-end gap-3">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">Add Transaction</Button>
      </div>
    </form>
  );
}
