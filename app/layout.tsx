// app/layout.tsx
import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";

export const metadata: Metadata = {
  title:
    "SmartBooks AI — Smart accounting. Financial clarity for everyone, everywhere.",
  description:
    "SmartBooks AI brings smart accounting and financial clarity to small businesses, freelancers, and entrepreneurs - everyone, everywhere. Scan receipts, track income and expenses, and generate financial reports using intelligent technology.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="font-sans antialiased">
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
