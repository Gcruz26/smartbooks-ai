"use client";

// app/login/page.tsx
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Sparkles, Mail, Lock, ArrowRight, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { currentUser, demoPassword } from "@/lib/mockData";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  // Mocked authentication - accepts any input and routes to the dashboard.
  function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => router.push("/dashboard"), 700);
  }

  function handleDemo() {
    setEmail(currentUser.email);
    setPassword(demoPassword);
    setLoading(true);
    setTimeout(() => router.push("/dashboard"), 700);
  }

  return (
    <div className="flex min-h-screen">
      {/* Left brand panel */}
      <div className="relative hidden w-1/2 overflow-hidden bg-gradient-to-br from-navy-800 to-navy-950 lg:block">
        <div className="pointer-events-none absolute -right-20 top-20 h-72 w-72 rounded-full bg-sky-500/20 blur-3xl" />
        <div className="pointer-events-none absolute bottom-10 left-10 h-72 w-72 rounded-full bg-sky-400/10 blur-3xl" />
        <div className="relative flex h-full flex-col justify-between p-14">
          <Link href="/" className="flex items-center gap-3">
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-white/10 text-white ring-1 ring-white/20">
              <Sparkles className="h-6 w-6" />
            </span>
            <span className="font-display text-xl font-bold tracking-tight text-white">
              SmartBooks<span className="text-sky-400"> AI</span>
            </span>
          </Link>

          <div className="max-w-md">
            <h2 className="font-display text-5xl font-bold leading-tight text-white">
              Smart accounting for small businesses.
            </h2>
            <p className="mt-5 text-xl text-slate-300">
              Track income and expenses, scan receipts with AI, and generate
              reports in minutes - not hours.
            </p>
            <div className="mt-10 space-y-4">
              {[
                "AI-powered receipt scanning",
                "Real-time financial insights",
                "Effortless tax preparation",
              ].map((item) => (
                <div key={item} className="flex items-center gap-3 text-lg text-slate-200">
                  <span className="grid h-7 w-7 place-items-center rounded-full bg-sky-500/20 text-sky-300">
                    <Sparkles className="h-4 w-4" />
                  </span>
                  {item}
                </div>
              ))}
            </div>
          </div>

          <p className="text-base text-slate-400">
            (c) 2026 SmartBooks AI. All rights reserved.
          </p>
        </div>
      </div>

      {/* Right form panel */}
      <div className="flex w-full items-center justify-center bg-white px-5 py-14 dark:bg-navy-950 lg:w-1/2">
        <div className="w-full max-w-md">
          <Link href="/" className="mb-10 flex items-center gap-3 lg:hidden">
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-navy-800 text-white">
              <Sparkles className="h-6 w-6" />
            </span>
            <span className="font-display text-xl font-bold tracking-tight text-navy-900 dark:text-white">
              SmartBooks<span className="text-sky-500"> AI</span>
            </span>
          </Link>

          <h1 className="font-display text-3xl font-bold text-navy-900 dark:text-white sm:text-4xl">
            Welcome back
          </h1>
          <p className="mt-3 text-lg text-slate-500 dark:text-slate-400">
            Log in to your SmartBooks AI account.
          </p>

          <form onSubmit={handleLogin} className="mt-9 space-y-6">
            <div>
              <label className="mb-2 block text-base font-medium text-navy-800 dark:text-slate-200">
                Email
              </label>
              <div className="relative">
                <Mail className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@business.com"
                  className="h-12 w-full rounded-xl border border-slate-300 bg-white pl-11 pr-4 text-base text-navy-900 placeholder:text-slate-400 focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-500/20 dark:border-navy-700 dark:bg-navy-900 dark:text-slate-100"
                />
              </div>
            </div>

            <div>
              <div className="mb-2 flex items-center justify-between">
                <label className="block text-base font-medium text-navy-800 dark:text-slate-200">
                  Password
                </label>
                <a href="#" className="text-sm font-medium text-sky-600 hover:underline">
                  Forgot password?
                </a>
              </div>
              <div className="relative">
                <Lock className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="********"
                  className="h-12 w-full rounded-xl border border-slate-300 bg-white pl-11 pr-4 text-base text-navy-900 placeholder:text-slate-400 focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-500/20 dark:border-navy-700 dark:bg-navy-900 dark:text-slate-100"
                />
              </div>
            </div>

            <Button type="submit" size="lg" className="w-full" disabled={loading}>
              {loading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <>
                  Log in
                  <ArrowRight className="h-5 w-5" />
                </>
              )}
            </Button>

            <div className="relative py-2">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200 dark:border-navy-800" />
              </div>
              <div className="relative flex justify-center">
                <span className="bg-white px-3 text-sm text-slate-400 dark:bg-navy-950">
                  or
                </span>
              </div>
            </div>

            <Button
              type="button"
              variant="outline"
              size="lg"
              className="w-full"
              onClick={handleDemo}
              disabled={loading}
            >
              <Sparkles className="h-5 w-5 text-sky-500" />
              Try the live demo
            </Button>
          </form>

          <p className="mt-9 text-center text-base text-slate-500 dark:text-slate-400">
            Don&apos;t have an account?{" "}
            <Link href="/dashboard" className="font-semibold text-sky-600 hover:underline">
              Create one
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
