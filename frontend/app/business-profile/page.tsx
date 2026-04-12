"use client";

import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import { useState } from "react";
import { postJson } from "@/lib/api";

type BusinessProfileResponse = {
  message: string;
  profile: Record<string, string>;
};

export default function BusinessProfilePage() {
  const [form, setForm] = useState({
    business_name: "Sunvolt Energy",
    niche: "Solar Installation",
    city: "Bhagabanpur, West Bengal",
    services: "Residential solar, commercial solar, maintenance",
    target_audience: "Homeowners, shops, schools, small factories",
    main_offer: "Save electricity bills with trusted solar installation",
    whatsapp: "",
    website: "",
    usp: "20+ years of local experience and trusted service",
  });

  const [result, setResult] = useState("Not saved yet.");
  const [loading, setLoading] = useState(false);

  function updateField(key: string, value: string) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function saveProfile() {
    try {
      setLoading(true);
      const data = await postJson<BusinessProfileResponse>(
        "/api/business-profile/save",
        form
      );
      setResult(JSON.stringify(data, null, 2));
    } catch (error) {
      setResult(error instanceof Error ? error.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main>
      <Navbar />
      <div className="mx-auto grid max-w-7xl gap-6 px-6 py-8 lg:grid-cols-[280px_1fr]">
        <Sidebar />
        <section className="rounded-2xl border border-white/10 bg-white/5 p-6">
          <h2 className="text-2xl font-bold text-white">Business Profile</h2>
          <p className="mt-2 text-zinc-400">
            Save your client details once and reuse them everywhere.
          </p>

          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {Object.entries(form).map(([key, value]) => (
              <div key={key}>
                <label className="mb-2 block text-sm text-zinc-300">
                  {key.replaceAll("_", " ")}
                </label>
                <input
                  value={value}
                  onChange={(e) => updateField(key, e.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-white outline-none focus:border-cyan-400"
                />
              </div>
            ))}
          </div>

          <button
            onClick={saveProfile}
            disabled={loading}
            className="mt-6 rounded-xl bg-cyan-500 px-5 py-3 font-medium text-black hover:bg-cyan-400 disabled:opacity-50"
          >
            {loading ? "Saving..." : "Save Profile"}
          </button>

          <pre className="mt-6 whitespace-pre-wrap rounded-2xl border border-white/10 bg-black/30 p-5 text-sm text-zinc-300">
            {result}
          </pre>
        </section>
      </div>
    </main>
  );
}