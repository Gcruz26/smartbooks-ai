// lib/exporters.ts
// Client-side helpers to generate PDF and Excel exports of the financial
// report. Both helpers operate on already-filtered data so the caller stays
// in control of the date range.

import type {
  Transaction,
  CategoryBreakdown,
  MonthlyReportRow,
} from "./types";
import { formatCurrency, formatDate, isoForFileName } from "./utils";
import {
  getTransactionTypeLabel,
  getDocumentTypeLabel,
} from "./accounting";

export interface ReportExportData {
  startDate?: string;
  endDate?: string;
  periodLabel: string;
  totalIncome: number;
  totalExpenses: number;
  netProfit: number;
  profitMargin: number;
  monthlyRows: MonthlyReportRow[];
  categoryRows: CategoryBreakdown[];
  transactions: Transaction[];
  /** Language used for export labels. */
  language?: "en" | "pt";
}

const EXPORT_LABELS = {
  en: {
    title: "SmartBooks AI",
    report: "Financial Report",
    period: "Period",
    summary: "Summary",
    metric: "Metric",
    value: "Value",
    totalIncome: "Total Income",
    totalExpenses: "Total Expenses",
    netProfit: "Net Profit",
    profitMargin: "Profit Margin",
    monthlySummary: "Monthly Summary",
    month: "Month",
    income: "Income",
    expenses: "Expenses",
    profit: "Profit",
    total: "Total",
    expenseCategories: "Expense Categories",
    category: "Category",
    amount: "Amount",
    share: "Share",
    noData: "No data in selected range",
    noExpenses: "No expenses in selected range",
    generated: "Generated",
    pageOf: (i: number, n: number) => `Page ${i} of ${n}`,
    transactionType: "Transaction Type",
    documentType: "Document Type",
    description: "Description",
    client: "Client",
    paymentMethod: "Payment Method",
    status: "Status",
    date: "Date",
    sheetSummary: "Summary",
    sheetTransactions: "Transactions",
    sheetExpenseCategories: "Expense Categories",
    sheetMonthlySummary: "Monthly Summary",
    shareLabel: "Share of Expenses (%)",
    profitMarginPct: "Profit Margin (%)",
  },
  pt: {
    title: "SmartBooks AI",
    report: "Relatorio Financeiro",
    period: "Periodo",
    summary: "Resumo",
    metric: "Metrica",
    value: "Valor",
    totalIncome: "Receita Total",
    totalExpenses: "Despesas Totais",
    netProfit: "Lucro Liquido",
    profitMargin: "Margem de Lucro",
    monthlySummary: "Resumo Mensal",
    month: "Mes",
    income: "Receita",
    expenses: "Despesas",
    profit: "Lucro",
    total: "Total",
    expenseCategories: "Categorias de Despesa",
    category: "Categoria",
    amount: "Valor",
    share: "Quota",
    noData: "Sem dados no periodo selecionado",
    noExpenses: "Sem despesas no periodo selecionado",
    generated: "Gerado",
    pageOf: (i: number, n: number) => `Pagina ${i} de ${n}`,
    transactionType: "Tipo de Transacao",
    documentType: "Tipo de Documento",
    description: "Descricao",
    client: "Cliente",
    paymentMethod: "Metodo de Pagamento",
    status: "Estado",
    date: "Data",
    sheetSummary: "Resumo",
    sheetTransactions: "Transacoes",
    sheetExpenseCategories: "Categorias de Despesa",
    sheetMonthlySummary: "Resumo Mensal",
    shareLabel: "Quota de Despesas (%)",
    profitMarginPct: "Margem de Lucro (%)",
  },
} as const;

/** Build a filename like SmartBooks_AI_Financial_Report_2026-01-01_to_2026-01-31.<ext> */
export function buildExportFileName(
  data: ReportExportData,
  extension: "pdf" | "xlsx"
): string {
  const base = "SmartBooks_AI_Financial_Report";
  if (data.startDate && data.endDate) {
    return `${base}_${isoForFileName(data.startDate)}_to_${isoForFileName(
      data.endDate
    )}.${extension}`;
  }
  if (data.startDate) {
    return `${base}_from_${isoForFileName(data.startDate)}.${extension}`;
  }
  if (data.endDate) {
    return `${base}_until_${isoForFileName(data.endDate)}.${extension}`;
  }
  return `${base}_All_Available_Data.${extension}`;
}

/** Generate and download a PDF report. */
export async function exportPdf(data: ReportExportData): Promise<void> {
  // Dynamic imports keep these heavy libs out of the initial bundle.
  const { default: jsPDF } = await import("jspdf");
  const { default: autoTable } = await import("jspdf-autotable");

  const doc = new jsPDF({ unit: "pt", format: "a4" });
  const pageWidth = doc.internal.pageSize.getWidth();
  const generatedAt = new Date().toLocaleString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  // Header band
  doc.setFillColor(22, 38, 79); // navy-800
  doc.rect(0, 0, pageWidth, 90, "F");

  const L = EXPORT_LABELS[data.language ?? "en"];

  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(20);
  doc.text(L.title, 40, 42);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(12);
  doc.text(L.report, 40, 62);

  doc.setFontSize(10);
  doc.setTextColor(195, 210, 240);
  doc.text(`${L.period}: ${data.periodLabel}`, 40, 78);

  // Summary block
  doc.setTextColor(15, 27, 58);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);
  doc.text(L.summary, 40, 130);

  const summaryRows: [string, string][] = [
    [L.totalIncome, formatCurrency(data.totalIncome)],
    [L.totalExpenses, formatCurrency(data.totalExpenses)],
    [L.netProfit, formatCurrency(data.netProfit)],
    [L.profitMargin, `${data.profitMargin.toFixed(1)}%`],
  ];

  autoTable(doc, {
    startY: 140,
    head: [[L.metric, L.value]],
    body: summaryRows,
    theme: "grid",
    styles: { fontSize: 11, cellPadding: 8 },
    headStyles: {
      fillColor: [36, 121, 234], // sky-600
      textColor: 255,
      fontStyle: "bold",
    },
    columnStyles: {
      1: { halign: "right", fontStyle: "bold" },
    },
    margin: { left: 40, right: 40 },
  });

  // Monthly summary
  
  let cursorY: number = ((doc as unknown as { lastAutoTable?: { finalY?: number } }).lastAutoTable?.finalY ?? 220) + 30;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);
  doc.text(L.monthlySummary, 40, cursorY);

  const monthlyBody = data.monthlyRows.length
    ? data.monthlyRows.map((r) => [
        r.month,
        formatCurrency(r.income),
        formatCurrency(r.expenses),
        formatCurrency(r.profit),
      ])
    : [[L.noData, "-", "-", "-"]];

  // Totals footer row
  const totalsRow = [
    L.total,
    formatCurrency(data.totalIncome),
    formatCurrency(data.totalExpenses),
    formatCurrency(data.netProfit),
  ];

  autoTable(doc, {
    startY: cursorY + 10,
    head: [[L.month, L.income, L.expenses, L.profit]],
    body: monthlyBody,
    foot: [totalsRow],
    theme: "striped",
    styles: { fontSize: 10, cellPadding: 7 },
    headStyles: {
      fillColor: [22, 38, 79],
      textColor: 255,
      fontStyle: "bold",
    },
    footStyles: {
      fillColor: [239, 244, 252],
      textColor: 15,
      fontStyle: "bold",
    },
    columnStyles: {
      1: { halign: "right" },
      2: { halign: "right" },
      3: { halign: "right" },
    },
    margin: { left: 40, right: 40 },
  });

  // Expense categories
  
  cursorY = ((doc as unknown as { lastAutoTable?: { finalY?: number } }).lastAutoTable?.finalY ?? cursorY + 100) + 30;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);
  doc.text(L.expenseCategories, 40, cursorY);

  const categoryBody = data.categoryRows.length
    ? data.categoryRows.map((c) => {
        const share =
          data.totalExpenses > 0
            ? `${((c.amount / data.totalExpenses) * 100).toFixed(1)}%`
            : "-";
        return [c.category, formatCurrency(c.amount), share];
      })
    : [[L.noExpenses, "-", "-"]];

  autoTable(doc, {
    startY: cursorY + 10,
    head: [[L.category, L.amount, L.share]],
    body: categoryBody,
    theme: "striped",
    styles: { fontSize: 10, cellPadding: 7 },
    headStyles: {
      fillColor: [22, 38, 79],
      textColor: 255,
      fontStyle: "bold",
    },
    columnStyles: {
      1: { halign: "right" },
      2: { halign: "right" },
    },
    margin: { left: 40, right: 40 },
  });

  // Footer with generated timestamp on every page
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(9);
    doc.setTextColor(120, 130, 150);
    doc.text(
      `${L.generated} ${generatedAt}`,
      40,
      doc.internal.pageSize.getHeight() - 24
    );
    doc.text(
      L.pageOf(i, pageCount),
      pageWidth - 40,
      doc.internal.pageSize.getHeight() - 24,
      { align: "right" }
    );
  }

  doc.save(buildExportFileName(data, "pdf"));
}

/** Generate and download an XLSX workbook with 4 sheets. */
export async function exportExcel(data: ReportExportData): Promise<void> {
  const XLSX = await import("xlsx");
  const wb = XLSX.utils.book_new();

  const L = EXPORT_LABELS[data.language ?? "en"];

  // 1) Summary sheet
  const summaryAOA: (string | number)[][] = [
    [`${L.title} - ${L.report}`],
    [L.period, data.periodLabel],
    [L.generated, new Date().toLocaleString(data.language === "pt" ? "pt-PT" : "en-US")],
    [],
    [L.metric, L.value],
    [L.totalIncome, data.totalIncome],
    [L.totalExpenses, data.totalExpenses],
    [L.netProfit, data.netProfit],
    [L.profitMarginPct, Number(data.profitMargin.toFixed(2))],
  ];
  const wsSummary = XLSX.utils.aoa_to_sheet(summaryAOA);
  wsSummary["!cols"] = [{ wch: 26 }, { wch: 22 }];
  XLSX.utils.book_append_sheet(wb, wsSummary, L.sheetSummary);

  // 2) Transactions sheet
  const txHeader = [
    L.date,
    L.transactionType,
    L.documentType,
    L.category,
    L.description,
    L.client,
    L.paymentMethod,
    L.status,
    L.amount,
  ];
  const txRows = data.transactions.map((t) => [
    t.date,
    getTransactionTypeLabel(t.type),
    getDocumentTypeLabel(t.documentType),
    t.category,
    t.description,
    t.client ?? "",
    t.paymentMethod,
    t.status,
    t.amount,
  ]);
  const wsTx = XLSX.utils.aoa_to_sheet([txHeader, ...txRows]);
  wsTx["!cols"] = [
    { wch: 12 }, // date
    { wch: 16 }, // transaction type
    { wch: 16 }, // document type
    { wch: 18 }, // category
    { wch: 36 }, // description
    { wch: 22 }, // client
    { wch: 16 }, // method
    { wch: 10 }, // status
    { wch: 12 }, // amount
  ];
  XLSX.utils.book_append_sheet(wb, wsTx, L.sheetTransactions);

  // 3) Expense Categories sheet
  const catHeader = [L.category, L.amount, L.shareLabel];
  const catRows = data.categoryRows.map((c) => [
    c.category,
    c.amount,
    data.totalExpenses > 0
      ? Number(((c.amount / data.totalExpenses) * 100).toFixed(2))
      : 0,
  ]);
  const wsCat = XLSX.utils.aoa_to_sheet([catHeader, ...catRows]);
  wsCat["!cols"] = [{ wch: 22 }, { wch: 14 }, { wch: 22 }];
  XLSX.utils.book_append_sheet(wb, wsCat, L.sheetExpenseCategories);

  // 4) Monthly Summary sheet
  const mHeader = [L.month, L.income, L.expenses, L.profit];
  const mRows = data.monthlyRows.map((r) => [
    r.month,
    r.income,
    r.expenses,
    r.profit,
  ]);
  const mTotals = [
    L.total,
    data.totalIncome,
    data.totalExpenses,
    data.netProfit,
  ];
  const wsMonthly = XLSX.utils.aoa_to_sheet([mHeader, ...mRows, mTotals]);
  wsMonthly["!cols"] = [
    { wch: 14 },
    { wch: 14 },
    { wch: 14 },
    { wch: 14 },
  ];
  XLSX.utils.book_append_sheet(wb, wsMonthly, L.sheetMonthlySummary);

  XLSX.writeFile(wb, buildExportFileName(data, "xlsx"));
}

/** Format a date range pair into a human label, e.g. "Jan 1, 2026 - Mar 31, 2026". */
export function formatPeriodLabel(
  startDate?: string,
  endDate?: string,
  fallbackStart?: string,
  fallbackEnd?: string
): string {
  if (!startDate && !endDate) return "All Available Data";
  const s = startDate ?? fallbackStart;
  const e = endDate ?? fallbackEnd;
  if (s && e) return `${formatDate(s)} - ${formatDate(e)}`;
  if (s) return `From ${formatDate(s)}`;
  if (e) return `Until ${formatDate(e)}`;
  return "All Available Data";
}
