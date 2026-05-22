# SmartBooks AI

> Smart accounting for small businesses, freelancers, and entrepreneurs.

SmartBooks AI is a modern Next.js 14 web application that helps small businesses
organize their finances, scan receipts, track income and expenses, and generate
simple financial reports - all wrapped in a clean, professional UI.

This repository contains the **front-end UI prototype** (with realistic mock
data). It is designed to be production-ready in look and feel and to plug into a
real backend (Supabase, Postgres, etc.) later.

## Features

- **Marketing landing page** with hero, feature grid, target market, pricing
  preview, and CTA sections.
- **Login** screen with split brand panel, demo button, and mocked routing to
  the dashboard.
- **Dashboard** with KPI stat cards, monthly revenue chart, expense-by-category
  donut, recent transactions, and AI financial insights.
- **Transactions** page with full-featured table, filters (type, category,
  status), search, summary cards, and an "Add Transaction" form.
- **Receipts** page with drag-and-drop uploader, simulated AI extraction, and
  status badges (categorized / needs review / processing).
- **Reports** page with income vs. expenses chart, expense breakdown donut,
  monthly P&L table, and PDF/Excel export buttons (UI only).
- **Clients** page with searchable client directory, summary cards, and an
  "Add Client" form.
- **Pricing** page (also embedded in landing and dashboard) with three plans,
  feature comparison, money-back banner, and FAQ.
- **Settings** page with business profile, notification preferences toggle
  switches, and plan & billing block.
- **Dark mode** toggle (persisted in localStorage) with smooth color tokens.
- **Responsive layout** for desktop, tablet, and mobile (collapsible sidebar
  with overlay, horizontally scrollable tables).
- **Empty states** for every data view (transactions, receipts, clients,
  reports, charts).

## Tech Stack

- **Next.js 14** (App Router)
- **React 18**
- **TypeScript 5** in strict mode
- **Tailwind CSS 3** with a custom navy + sky brand palette
- **Recharts** for charts (area, bar, donut)
- **lucide-react** for icons
- **No external state library** - mock data is imported directly from
  `lib/mockData.ts` and managed with React state where interactive.

## Project Structure

```
smartbooks-ai/
|-- app/                       # Next.js App Router pages
|   |-- page.tsx               # Marketing landing page
|   |-- layout.tsx             # Root layout + ThemeProvider
|   |-- globals.css            # Tailwind layers + brand variables
|   |-- login/page.tsx
|   |-- dashboard/page.tsx
|   |-- transactions/page.tsx
|   |-- receipts/page.tsx
|   |-- reports/page.tsx
|   |-- clients/page.tsx
|   |-- pricing/page.tsx
|   `-- settings/page.tsx
|
|-- components/                # Reusable UI building blocks
|   |-- DashboardShell.tsx     # Sidebar + header layout wrapper
|   |-- Sidebar.tsx            # Grouped navigation (Overview/Finance/Business)
|   |-- Header.tsx             # Top bar with search, theme toggle, avatar
|   |-- StatCard.tsx           # KPI cards with trend deltas
|   |-- ChartCard.tsx          # Card wrapper for charts
|   |-- Charts.tsx             # RevenueChart, IncomeExpenseChart, CategoryChart
|   |-- TransactionTable.tsx
|   |-- ClientTable.tsx
|   |-- ReportSummary.tsx
|   |-- ReceiptUploader.tsx    # Drag-and-drop + simulated AI extraction
|   |-- AIInsightCard.tsx      # AI insights list (positive / warning / alert)
|   |-- PricingCard.tsx
|   |-- ThemeProvider.tsx      # Light / dark mode context
|   `-- ui/                    # Primitive UI atoms
|       |-- Button.tsx
|       |-- Input.tsx
|       |-- Select.tsx
|       `-- Badge.tsx
|
|-- lib/                       # Data & helpers
|   |-- types.ts               # Domain types (Transaction, Receipt, etc.)
|   |-- mockData.ts            # Realistic seed data
|   |-- utils.ts               # cn(), formatCurrency, formatDate, sumByType, ...
|   `-- insights.ts            # Deterministic "AI" insight generator
|
|-- public/                    # (optional) static assets
|-- tailwind.config.ts
|-- postcss.config.js
|-- next.config.js
|-- tsconfig.json
|-- package.json
`-- README.md
```

## Getting Started

### Prerequisites

- **Node.js 18.17+** (Node 20 LTS recommended)
- **npm** (or pnpm / yarn)

### Install

```bash
npm install
```

### Run the dev server

```bash
npm run dev
```

Then open <http://localhost:3000> in your browser.

### Build for production

```bash
npm run build
npm run start
```

### Lint

```bash
npm run lint
```

### Type check (optional)

```bash
npx tsc --noEmit
```

## Available Routes

| Route            | Description                                |
| ---------------- | ------------------------------------------ |
| `/`              | Marketing landing page                     |
| `/login`         | Login screen (any input works)             |
| `/dashboard`     | Main KPI overview                          |
| `/transactions`  | Filterable transactions table + add form   |
| `/receipts`      | Upload + simulated AI extraction           |
| `/reports`       | P&L charts and monthly summary             |
| `/clients`       | Client directory + add form                |
| `/pricing`       | Three-tier plans + FAQ                     |
| `/settings`      | Business profile + notification toggles    |

All authenticated pages share the same `DashboardShell` (sidebar + header).

## Demo Credentials

The login screen accepts **any** email + password (auth is mocked). Click
**"Try the live demo"** for an instant routed login.

## Design System

| Token        | Value                                                                |
| ------------ | -------------------------------------------------------------------- |
| Brand primary | navy-800 `#16264f`                                                  |
| Accent       | sky-500 `#3b96f5`                                                    |
| Background   | `--background` (`#f6f8fc` light / `#0a1228` dark)                    |
| Font (body)  | Plus Jakarta Sans (with system-ui fallback)                          |
| Font (display) | Sora (with system-ui fallback)                                     |
| Radii        | xl `0.875rem`, 2xl `1.125rem`                                        |
| Shadows      | `shadow-card` (subtle) and `shadow-card-hover` (deeper, on hover)    |

Brand fonts use CSS fallbacks, so the app builds and runs even without network
access to a font CDN. To enable the brand fonts, wire them up via `next/font` in
`app/layout.tsx`.

## Mock Data

All data lives in [`lib/mockData.ts`](./lib/mockData.ts):

- `currentUser`, `business` - profile data
- `transactions[]` - ~35 entries spanning Dec 2025 - May 2026
- `receipts[]` - 6 sample uploaded receipts (including one "processing")
- `clients[]` - 6 sample clients across statuses
- `monthlyReport[]` - 6 months of income / expense / profit
- `pricingPlans[]` - Basic / Pro / Premium

Replace any of these with API/database calls when you wire up a backend.

## Known Limitations

- **Authentication is mocked.** Any input on `/login` routes to `/dashboard`.
- **Receipt OCR is simulated.** `ReceiptUploader` waits ~1.8s and picks from a
  small pool of canned extractions; it does not actually parse the uploaded
  file.
- **AI insights are heuristic, not ML.** `lib/insights.ts` derives simple
  observations (margin, MoM expense change, top category, etc.) from the
  transaction list.
- **Export buttons are UI-only.** The "Export PDF" and "Export Excel" buttons
  on `/reports` do not yet generate files.
- **No persistence.** All add/edit interactions live in React state and reset
  on refresh.
- **Search bar in the header is decorative.** Per-page search inputs on
  Transactions and Clients are fully functional.
- **Notifications bell is decorative** (no dropdown / inbox).

These are clear extension points for the next development iteration.

## License

This project is provided as-is for demonstration purposes.
