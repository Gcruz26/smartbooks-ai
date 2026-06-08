// app/layout.tsx
import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import { LanguageProvider } from "@/components/LanguageProvider";

export const metadata: Metadata = {
  title:
    "SmartBooks AI - Smart accounting. Financial clarity for everyone, everywhere.",
  description:
    "SmartBooks AI brings smart accounting and financial clarity to small businesses, freelancers, and entrepreneurs - everyone, everywhere.",
  icons: {
    icon: [
      { url: "/smartbooks-logo.png", type: "image/png" },
    ],
    apple: "/smartbooks-logo.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="font-sans antialiased">
        <LanguageProvider>
          <ThemeProvider>{children}</ThemeProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
