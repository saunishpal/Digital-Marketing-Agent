"use client";

import { useMemo, useState } from "react";
import { postJson } from "@/lib/api";

export default function DemoPage() {
  const [form, setForm] = useState({
    name: "",
    business_name: "",
    niche: "",
    city: "",
    phone: "",
    need: "",
  });

  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const validationError = useMemo(() => {
    if (!form.name.trim()) return "Name is required";
    if (form.name.trim().length < 2) return "Name must be at least 2 characters";
    if (!form.business_name.trim()) return "Business name is required";
    if (!form.niche.trim()) return "Business niche is required";
    if (!form.city.trim()) return "City is required";
    if (!form.phone.trim()) return "Phone number is required";

    const phoneRegex = /^[0-9]{10}$/;
    if (!phoneRegex.test(form.phone.trim())) {
      return "Enter a valid 10-digit phone number";
    }

    return "";
  }, [form]);

  const isFormValid = !validationError;

  async function handleSubmit() {
    if (!isFormValid) {
      setError(validationError);
      return;
    }

    try {
      setLoading(true);
      setError("");
      setSuccess("");

      const payload = {
        name: form.name.trim(),
        business_name: form.business_name.trim(),
        niche: form.niche.trim(),
        city: form.city.trim(),
        phone: form.phone.trim(),
        need: form.need.trim(),
      };

      const data = await postJson<{ message: string }>(
        "/api/demo-requests/create",
        payload
      );

      setSubmitted(true);
      setSuccess(data.message || "Demo request submitted successfully");

      setForm({
        name: "",
        business_name: "",
        niche: "",
        city: "",
        phone: "",
        need: "",
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to submit demo request");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top_left,rgba(34,211,238,0.12),transparent_30%),radial-gradient(circle_at_top_right,rgba(16,185,129,0.1),transparent_25%),linear-gradient(180deg,#050816_0%,#02040a_100%)] px-6 py-16 text-white">
      <div className="mx-auto max-w-4xl rounded-3xl border border-white/10 bg-white/5 p-8 shadow-2xl shadow-cyan-500/10">
        <div className="mb-8 text-center">
          <p className="mb-3 inline-block rounded-full border border-cyan-400/20 bg-cyan-400/10 px-4 py-2 text-sm text-cyan-300">
            Demo Request
          </p>
          <h1 className="text-4xl font-bold">Book a Demo for Your Business</h1>
          <p className="mt-3 text-zinc-400">
            Tell us about your business and we’ll prepare a relevant walkthrough for you.
          </p>
        </div>

        {!submitted ? (
          <>
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm text-zinc-300">Your Name</label>
                <input
                  value={form.name}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, name: e.target.value }))
                  }
                  placeholder="Enter your name"
                  className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-white outline-none focus:border-cyan-400"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm text-zinc-300">Business Name</label>
                <input
                  value={form.business_name}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, business_name: e.target.value }))
                  }
                  placeholder="Enter business name"
                  className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-white outline-none focus:border-cyan-400"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm text-zinc-300">Business Niche</label>
                <input
                  value={form.niche}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, niche: e.target.value }))
                  }
                  placeholder="e.g. Solar, Gym, Salon"
                  className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-white outline-none focus:border-cyan-400"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm text-zinc-300">City</label>
                <input
                  value={form.city}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, city: e.target.value }))
                  }
                  placeholder="Enter city"
                  className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-white outline-none focus:border-cyan-400"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm text-zinc-300">Phone Number</label>
                <input
                  value={form.phone}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, phone: e.target.value }))
                  }
                  placeholder="Enter 10-digit mobile number"
                  className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-white outline-none focus:border-cyan-400"
                />
              </div>

              <div className="md:col-span-2">
                <label className="mb-2 block text-sm text-zinc-300">
                  What do you need help with?
                </label>
                <textarea
                  value={form.need}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, need: e.target.value }))
                  }
                  placeholder="Tell us about your business goals or problems"
                  rows={5}
                  className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-white outline-none focus:border-cyan-400"
                />
              </div>
            </div>

            {validationError && !error && (
              <p className="mt-4 text-sm text-amber-400">{validationError}</p>
            )}
            {error && <p className="mt-4 text-sm text-red-400">{error}</p>}
            {success && <p className="mt-4 text-sm text-emerald-400">{success}</p>}

            <button
              onClick={handleSubmit}
              disabled={!isFormValid || loading}
              className="mt-6 w-full rounded-xl bg-cyan-500 px-5 py-3 font-medium text-black transition hover:bg-cyan-400 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? "Submitting..." : "Submit Demo Request"}
            </button>
          </>
        ) : (
          <div className="rounded-2xl border border-emerald-400/20 bg-emerald-400/10 p-6 text-emerald-300">
            <h2 className="text-xl font-semibold">Demo request submitted successfully</h2>
            <p className="mt-2">
              We’ve received your request. The admin can now review it and contact you.
            </p>

            <button
              onClick={() => {
                setSubmitted(false);
                setSuccess("");
              }}
              className="mt-5 rounded-xl bg-cyan-500 px-5 py-3 font-medium text-black hover:bg-cyan-400"
            >
              Submit Another Request
            </button>
          </div>
        )}
      </div>
    </main>
  );
}