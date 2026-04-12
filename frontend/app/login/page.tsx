"use client";

import { useMemo, useState } from "react";
import { postJson } from "@/lib/api";
import { saveToken, saveUser } from "@/lib/auth";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const validationError = useMemo(() => {
    if (!form.email.trim()) return "Email is required";

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(form.email.trim())) return "Enter a valid email address";

    if (!form.password) return "Password is required";
    if (form.password.length < 6) return "Password must be at least 6 characters";

    return "";
  }, [form]);

  const isFormValid = !validationError;

  async function handleLogin() {
    if (!isFormValid) {
      setError(validationError);
      return;
    }

    try {
      setLoading(true);
      setError("");

      const payload = {
        email: form.email.trim(),
        password: form.password,
      };

      const data = await postJson<{
        access_token: string;
        user: {
          id: number;
          email: string;
          full_name?: string;
          role: "admin" | "user";
          package_name: "starter" | "growth" | "agency";
          is_active: boolean;
        };
      }>("/api/auth/login", payload);

      saveToken(data.access_token);
      saveUser(data.user);
      router.push("/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[radial-gradient(circle_at_top_left,rgba(34,211,238,0.12),transparent_30%),radial-gradient(circle_at_top_right,rgba(16,185,129,0.1),transparent_25%),linear-gradient(180deg,#050816_0%,#02040a_100%)] px-6 text-white">
      <div className="w-full max-w-md rounded-3xl border border-white/10 bg-white/5 p-8 shadow-2xl shadow-cyan-500/10 backdrop-blur-xl">
        <div className="mb-6 text-center">
          <h1 className="bg-gradient-to-r from-cyan-300 to-emerald-300 bg-clip-text text-3xl font-bold text-transparent">
            Welcome Back
          </h1>
          <p className="mt-2 text-zinc-400">
            Login to continue to your MarketMind dashboard
          </p>
        </div>

        <div className="space-y-4">
          <div>
            <label className="mb-2 block text-sm text-zinc-300">Email</label>
            <input
              type="email"
              placeholder="Enter your email"
              value={form.email}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, email: e.target.value }))
              }
              className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-white outline-none transition focus:border-cyan-400"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm text-zinc-300">Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                value={form.password}
                maxLength={64}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, password: e.target.value }))
                }
                className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 pr-12 text-white outline-none transition focus:border-cyan-400"
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white"
              >
                {showPassword ? "🙈" : "👁️"}
              </button>
            </div>
          </div>
        </div>

        {validationError && !error && (
          <p className="mt-4 text-sm text-amber-400">{validationError}</p>
        )}
        {error && <p className="mt-4 text-sm text-red-400">{error}</p>}

        <button
          onClick={handleLogin}
          disabled={!isFormValid || loading}
          className="mt-6 w-full rounded-xl bg-cyan-500 px-4 py-3 font-medium text-black transition hover:bg-cyan-400 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading ? "Logging in..." : "Login"}
        </button>

        <p className="mt-5 text-center text-sm text-zinc-400">
          Don&apos;t have an account?{" "}
          <Link href="/register" className="text-cyan-300 hover:text-cyan-200">
            Register here
          </Link>
        </p>
      </div>
    </main>
  );
}