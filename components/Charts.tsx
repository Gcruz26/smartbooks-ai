"use client";

// components/Charts.tsx
// Recharts-based chart components for SmartBooks AI.

import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import { formatCompactCurrency, formatCurrency } from "@/lib/utils";
import type { MonthlyReportRow, CategoryBreakdown } from "@/lib/types";

const PIE_COLORS = [
  "#1E3A8A",
  "#E6A57E",
  "#3970D6",
  "#F4C7A8",
  "#152C68",
  "#D38563",
  "#93BAF6",
  "#FADFC4",
  "#2447B0",
  "#0F1B47",
];

interface TooltipPayloadItem {
  name?: string;
  value?: number;
  color?: string;
  fill?: string;
}

interface CurrencyTooltipProps {
  active?: boolean;
  payload?: TooltipPayloadItem[];
  label?: string | number;
}

function CurrencyTooltip({ active, payload, label }: CurrencyTooltipProps) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm shadow-lg dark:border-navy-700 dark:bg-navy-900">
      {label !== undefined && label !== "" && (
        <p className="mb-1.5 text-base font-semibold text-navy-900 dark:text-white">
          {label}
        </p>
      )}
      {payload.map((p, idx) => (
        <p
          key={`${p.name ?? "item"}-${idx}`}
          className="flex items-center gap-2 text-slate-600 dark:text-slate-300"
        >
          <span
            className="inline-block h-3 w-3 rounded-full"
            style={{ backgroundColor: p.color || p.fill }}
          />
          <span className="capitalize">{p.name}:</span>
          <span className="font-semibold text-navy-900 dark:text-white">
            {formatCurrency(p.value ?? 0)}
          </span>
        </p>
      ))}
    </div>
  );
}

const axisTick = { fontSize: 14, fill: "#64748B" } as const;

/** Monthly revenue area chart. */
export function RevenueChart({ data }: { data: MonthlyReportRow[] }) {
  if (data.length === 0) {
    return (
      <div className="flex h-[280px] items-center justify-center text-base text-slate-400 dark:text-slate-500">
        No revenue data yet.
      </div>
    );
  }
  return (
    <ResponsiveContainer width="100%" height={280}>
      <AreaChart data={data} margin={{ top: 10, right: 8, left: -4, bottom: 0 }}>
        <defs>
          <linearGradient id="incomeFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#1E3A8A" stopOpacity={0.35} />
            <stop offset="95%" stopColor="#1E3A8A" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" vertical={false} />
        <XAxis
          dataKey="month"
          tick={axisTick}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          tick={axisTick}
          axisLine={false}
          tickLine={false}
          tickFormatter={(v) => formatCompactCurrency(v)}
        />
        <Tooltip content={<CurrencyTooltip />} />
        <Area
          type="monotone"
          dataKey="income"
          name="Revenue"
          stroke="#1E3A8A"
          strokeWidth={2.5}
          fill="url(#incomeFill)"
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}

/** Income vs expenses grouped bar chart. */
export function IncomeExpenseChart({ data }: { data: MonthlyReportRow[] }) {
  if (data.length === 0) {
    return (
      <div className="flex h-[300px] items-center justify-center text-base text-slate-400 dark:text-slate-500">
        No comparison data yet.
      </div>
    );
  }
  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data} margin={{ top: 10, right: 8, left: -4, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" vertical={false} />
        <XAxis
          dataKey="month"
          tick={axisTick}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          tick={axisTick}
          axisLine={false}
          tickLine={false}
          tickFormatter={(v) => formatCompactCurrency(v)}
        />
        <Tooltip
          content={<CurrencyTooltip />}
          cursor={{ fill: "rgba(30,58,138,0.05)" }}
        />
        <Legend
          wrapperStyle={{ fontSize: 15, paddingTop: 10 }}
          iconType="circle"
        />
        <Bar
          dataKey="income"
          name="Income"
          fill="#1E3A8A"
          radius={[6, 6, 0, 0]}
          maxBarSize={32}
        />
        <Bar
          dataKey="expenses"
          name="Expenses"
          fill="#E6A57E"
          radius={[6, 6, 0, 0]}
          maxBarSize={32}
        />
      </BarChart>
    </ResponsiveContainer>
  );
}

/** Expense-by-category donut chart. */
export function CategoryChart({ data }: { data: CategoryBreakdown[] }) {
  if (data.length === 0) {
    return (
      <div className="flex h-[280px] items-center justify-center text-base text-slate-400 dark:text-slate-500">
        No expense data to display yet.
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={data}
          dataKey="amount"
          nameKey="category"
          cx="50%"
          cy="42%"
          innerRadius={56}
          outerRadius={92}
          paddingAngle={2}
          stroke="none"
        >
          {data.map((_, i) => (
            <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
          ))}
        </Pie>
        <Tooltip content={<CurrencyTooltip />} />
        <Legend
          layout="horizontal"
          align="center"
          verticalAlign="bottom"
          wrapperStyle={{ fontSize: 14, paddingTop: 16 }}
          iconType="circle"
        />
      </PieChart>
    </ResponsiveContainer>
  );
}
