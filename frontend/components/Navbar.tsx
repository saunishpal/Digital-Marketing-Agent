"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { clearToken, getToken } from "@/lib/auth";
import { useEffect, useState } from "react";

export default function Navbar() {
  const router = useRouter();
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    setToken(getToken());
  }, []);

  function handleLogout() {
    clearToken();
    setToken(null);
    router.push("/");
  }

  return (
    <header className="sticky top-0 z-30 border-b border-white/10 bg-black/40 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <div>
          <Link href="/">
            <h1 className="cursor-pointer bg-gradient-to-r from-cyan-300 to-emerald-300 bg-clip-text text-2xl font-bold tracking-wide text-transparent">
              MarketMind AI
            </h1>
          </Link>
          <p className="text-sm text-zinc-400">
            Digital Marketing Agent for Small Businesses
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-white hover:bg-white/10"
          >
            Home
          </Link>

          {token && (
            <Link
              href="/dashboard"
              className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-white hover:bg-white/10"
            >
              Dashboard
            </Link>
          )}

          {!token ? (
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
            </>
          ) : (
            <button
              onClick={handleLogout}
              className="rounded-xl bg-red-500 px-4 py-2 text-sm font-medium text-white hover:bg-red-400"
            >
              Logout
            </button>
          )}
        </div>
      </div>
    </header>
  );
}