"use client";

import { useMemo, useState } from "react";
import { postJson } from "@/lib/api";
import { saveToken, saveUser } from "@/lib/auth";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function AdminLoginPage() {
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
    if (!form.password) return "Password is required";
    return "";
  }, [form]);

  const isFormValid = !validationError;

  async function handleAdminLogin() {
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
      }>("/api/auth/admin-login", payload);

      saveToken(data.access_token);
      saveUser(data.user);
      router.push("/admin");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Admin login failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[radial-gradient(circle_at_top_left,rgba(34,211,238,0.12),transparent_30%),radial-gradient(circle_at_top_right,rgba(16,185,129,0.1),transparent_25%),linear-gradient(180deg,#050816_0%,#02040a_100%)] px-6 text-white">
      <div className="w-full max-w-md rounded-3xl border border-white/10 bg-white/5 p-8 shadow-2xl shadow-cyan-500/10 backdrop-blur-xl">
        <div className="mb-6 text-center">
          <h1 className="bg-gradient-to-r from-cyan-300 to-emerald-300 bg-clip-text text-3xl font-bold text-transparent">
            Admin Login
          </h1>
          <p className="mt-2 text-zinc-400">
            Login as platform owner / admin
          </p>
        </div>

        <div className="space-y-4">
          <div>
            <label className="mb-2 block text-sm text-zinc-300">Admin Email</label>
            <input
              type="email"
              placeholder="Enter admin email"
              value={form.email}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, email: e.target.value }))
              }
              className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-white outline-none transition focus:border-cyan-400"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm text-zinc-300">Admin Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter admin password"
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
          onClick={handleAdminLogin}
          disabled={!isFormValid || loading}
          className="mt-6 w-full rounded-xl bg-cyan-500 px-4 py-3 font-medium text-black transition hover:bg-cyan-400 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading ? "Logging in..." : "Admin Login"}
        </button>

        <p className="mt-5 text-center text-sm text-zinc-400">
          Normal user?{" "}
          <Link href="/login" className="text-cyan-300 hover:text-cyan-200">
            Go to user login
          </Link>
        </p>
      </div>
    </main>
  );
}