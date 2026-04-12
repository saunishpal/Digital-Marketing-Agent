"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { clearToken, getUser } from "@/lib/auth";
import { useRouter } from "next/navigation";

type SessionUser = {
  id: number;
  email: string;
  full_name?: string;
  role: "admin" | "user";
  package_name: "starter" | "growth" | "agency";
  is_active: boolean;
};

export default function HomePage() {
  const router = useRouter();
  const [user, setUser] = useState<SessionUser | null>(null);

  useEffect(() => {
    const currentUser = getUser();
    setUser(currentUser);
  }, []);

  function handleLogout() {
    clearToken();
    setUser(null);
    router.push("/");
  }

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top_left,rgba(34,211,238,0.12),transparent_30%),radial-gradient(circle_at_top_right,rgba(16,185,129,0.1),transparent_25%),linear-gradient(180deg,#050816_0%,#02040a_100%)] text-white">
      <section className="mx-auto max-w-7xl px-6 py-8">
        <header className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="bg-gradient-to-r from-cyan-300 to-emerald-300 bg-clip-text text-3xl font-bold text-transparent">
              MarketMind AI
            </h1>
            <p className="mt-2 text-zinc-400">
              AI-powered digital marketing agent for small businesses
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link
              href="/pricing"
              className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-white hover:bg-white/10"
            >
              Pricing
            </Link>

            {!user && (
              <>
                <Link
                  href="/login"
                  className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-white hover:bg-white/10"
                >
                  Login
                </Link>

                <Link
                  href="/register"
                  className="rounded-xl bg-cyan-500 px-4 py-2 text-sm font-medium text-black hover:bg-cyan-400"
                >
                  Register
                </Link>

                <Link
                  href="/admin-login"
                  className="rounded-xl border border-amber-400/20 bg-amber-400/10 px-4 py-2 text-sm text-amber-300 hover:bg-amber-400/20"
                >
                  Admin
                </Link>
              </>
            )}

            {user?.role === "user" && (
              <>
                <Link
                  href="/dashboard"
                  className="rounded-xl bg-cyan-500 px-4 py-2 text-sm font-medium text-black hover:bg-cyan-400"
                >
                  Dashboard
                </Link>

                <button
                  onClick={handleLogout}
                  className="rounded-xl border border-red-400/20 bg-red-400/10 px-4 py-2 text-sm text-red-300 hover:bg-red-400/20"
                >
                  Logout
                </button>
              </>
            )}

            {user?.role === "admin" && (
              <>
                <Link
                  href="/admin"
                  className="rounded-xl border border-amber-400/20 bg-amber-400/10 px-4 py-2 text-sm text-amber-300 hover:bg-amber-400/20"
                >
                  Admin Panel
                </Link>

                <button
                  onClick={handleLogout}
                  className="rounded-xl border border-red-400/20 bg-red-400/10 px-4 py-2 text-sm text-red-300 hover:bg-red-400/20"
                >
                  Logout
                </button>
              </>
            )}
          </div>
        </header>

        <section className="grid gap-10 py-20 lg:grid-cols-2 lg:items-center">
          <div>
            <p className="mb-4 inline-block rounded-full border border-cyan-400/20 bg-cyan-400/10 px-4 py-2 text-sm text-cyan-300">
              Built for local businesses
            </p>

            <h2 className="text-5xl font-bold leading-tight">
              Your AI Digital Marketing Agent for content, ads, leads, and growth
            </h2>

            <p className="mt-6 max-w-2xl text-lg leading-8 text-zinc-400">
              MarketMind AI helps small businesses generate content ideas,
              ad copy, campaign plans, lead follow-ups, analytics, and client-ready
              reports from one premium workspace.
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                href="/demo"
                className="rounded-xl bg-cyan-500 px-6 py-3 font-medium text-black hover:bg-cyan-400"
              >
                Book Demo
              </Link>

              <Link
                href="/pricing"
                className="rounded-xl border border-white/10 bg-white/5 px-6 py-3 font-medium text-white hover:bg-white/10"
              >
                See Pricing
              </Link>
            </div>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/5 p-8 shadow-2xl shadow-cyan-500/10">
            <div className="grid gap-4">
              <div className="rounded-2xl border border-white/10 bg-black/30 p-5">
                <h3 className="text-lg font-semibold text-white">Generate Content</h3>
                <p className="mt-2 text-sm text-zinc-400">
                  Reels, captions, hooks, hashtags, CTAs
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-black/30 p-5">
                <h3 className="text-lg font-semibold text-white">Run Better Campaigns</h3>
                <p className="mt-2 text-sm text-zinc-400">
                  Ad copy, strategy, weekly plan, ROI forecasting
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-black/30 p-5">
                <h3 className="text-lg font-semibold text-white">Track Leads</h3>
                <p className="mt-2 text-sm text-zinc-400">
                  Lead status, source breakdown, client report generation
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="grid gap-6 py-10 md:grid-cols-3">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
            <h3 className="text-xl font-semibold">Content Engine</h3>
            <p className="mt-3 text-zinc-400">
              Create platform-ready content ideas and captions in minutes.
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
            <h3 className="text-xl font-semibold">Lead Management</h3>
            <p className="mt-3 text-zinc-400">
              Track leads and move them through your pipeline easily.
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
            <h3 className="text-xl font-semibold">Client Reporting</h3>
            <p className="mt-3 text-zinc-400">
              Show performance clearly with dashboards and proposal-ready outputs.
            </p>
          </div>
        </section>
      </section>
    </main>
  );
}