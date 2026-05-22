// lib/insights.ts
// Simulated "AI" financial insights derived from transaction data.

import type { Transaction, FinancialInsight } from "./types";
import {
  sumByType,
  netProfit,
  profitMargin,
  expensesByCategory,
  monthKey,
} from "./utils";

/**
 * Analyze a list of transactions and return human-readable insight messages.
 * This simulates an AI analysis layer using simple deterministic heuristics.
 */
export function generateFinancialInsights(
  transactions: Transaction[]
): FinancialInsight[] {
  const insights: FinancialInsight[] = [];

  if (transactions.length === 0) {
    return [
      {
        id: "empty",
        type: "neutral",
        title: "No data yet",
        message:
          "Add a few transactions and SmartBooks AI will start surfacing insights about your finances.",
      },
    ];
  }

  // --- Month-over-month expense comparison ---
  const months = Array.from(new Set(transactions.map((t) => monthKey(t.date)))).sort();
  if (months.length >= 2) {
    const currentMonth = months[months.length - 1];
    const prevMonth = months[months.length - 2];

    const currentExpenses = sumByType(
      transactions.filter((t) => monthKey(t.date) === currentMonth),
      "expense"
    );
    const prevExpenses = sumByType(
      transactions.filter((t) => monthKey(t.date) === prevMonth),
      "expense"
    );

    if (prevExpenses > 0) {
      const change = ((currentExpenses - prevExpenses) / prevExpenses) * 100;
      if (change > 5) {
        insights.push({
          id: "exp-up",
          type: "warning",
          title: "Expenses are rising",
          message: `Your expenses increased by ${Math.abs(change).toFixed(
            0
          )}% compared to last month. Keep an eye on your cash flow.`,
        });
      } else if (change < -5) {
        insights.push({
          id: "exp-down",
          type: "positive",
          title: "Expenses are down",
          message: `Nice work — your expenses dropped by ${Math.abs(
            change
          ).toFixed(0)}% versus last month.`,
        });
      }
    }
  }

  // --- Profit margin ---
  const margin = profitMargin(transactions);
  const profit = netProfit(transactions);
  if (profit >= 0) {
    insights.push({
      id: "profit-positive",
      type: "positive",
      title: "Profit is positive",
      message: `Your net profit margin is positive at ${margin.toFixed(
        1
      )}%. Your business is operating in the black.`,
    });
  } else {
    insights.push({
      id: "profit-negative",
      type: "alert",
      title: "Operating at a loss",
      message: `Your expenses currently exceed income (margin ${margin.toFixed(
        1
      )}%). Review your largest cost categories.`,
    });
  }

  // --- Highest spending category ---
  const byCategory = expensesByCategory(transactions);
  if (byCategory.length > 0) {
    const top = byCategory[0];
    const totalExpenses = sumByType(transactions, "expense");
    const share = totalExpenses > 0 ? (top.amount / totalExpenses) * 100 : 0;
    if (share > 25) {
      insights.push({
        id: "top-category",
        type: "warning",
        title: `${top.category} is your biggest cost`,
        message: `${top.category} makes up ${share.toFixed(
          0
        )}% of your total expenses. Worth reviewing for savings.`,
      });
    }
  }

  // --- Pending / overdue invoices ---
  const pending = transactions.filter(
    (t) => t.status === "pending" || t.status === "overdue"
  );
  if (pending.length > 0) {
    const overdue = pending.filter((t) => t.status === "overdue");
    insights.push({
      id: "pending-invoices",
      type: overdue.length > 0 ? "alert" : "warning",
      title: "Outstanding invoices",
      message: `You have ${pending.length} unpaid item${
        pending.length > 1 ? "s" : ""
      }${
        overdue.length > 0 ? `, including ${overdue.length} overdue` : ""
      }. Review them before the end of the month.`,
    });
  }

  // --- Cash flow health ---
  const income = sumByType(transactions, "income");
  const expenses = sumByType(transactions, "expense");
  if (income > expenses * 1.2) {
    insights.push({
      id: "cashflow",
      type: "positive",
      title: "Cash flow is healthy",
      message:
        "Your income comfortably covers your expenses this period. Consider setting aside a reserve.",
    });
  }

  // --- Tax deadline reminder (static seasonal nudge) ---
  insights.push({
    id: "tax-deadline",
    type: "neutral",
    title: "Tax deadline approaching",
    message:
      "Your next quarterly tax filing is due in 3 weeks. SmartBooks AI can help you prepare the summary.",
  });

  return insights;
}
