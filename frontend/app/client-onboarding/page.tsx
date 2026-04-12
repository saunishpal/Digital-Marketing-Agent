"use client";

import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import ProtectedShell from "@/components/ProtectedShell";
import { postJson, putJson } from "@/lib/api";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function ClientOnboardingPage() {
  const searchParams = useSearchParams();

  const [form, setForm] = useState({
    business_name: "",
    niche: "",
    city: "",
    services: "",
    target_audience: "",
    main_offer: "",
    whatsapp: "",
    website: "",
    usp: "",
  });

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const demoId = searchParams.get("demo_id");

  useEffect(() => {
    setForm((prev) => ({
      ...prev,
      business_name: searchParams.get("business_name") || "",
      niche: searchParams.get("niche") || "",
      city: searchParams.get("city") || "",
      whatsapp: searchParams.get("whatsapp") || "",
      services: searchParams.get("services") || "",
    }));
  }, [searchParams]);

  async function handleSave() {
    try {
      setLoading(true);
      setMessage("");

      const data = await postJson<{ message: string }>("/api/business-profile/save", form);

      if (demoId) {
        await putJson(`/api/demo-requests/${demoId}/status`, {
          status: "converted",
        });
      }

      setMessage(data.message || "Client saved successfully");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Failed to save");
    } finally {
      setLoading(false);
    }
  }

  return (
    <ProtectedShell>
      <main>
        <Navbar />
        <div className="mx-auto grid max-w-7xl gap-6 px-6 py-8 lg:grid-cols-[280px_1fr]">
          <Sidebar />
          <section className="rounded-2xl border border-white/10 bg-white/5 p-6">
            <h2 className="text-2xl font-bold text-white">Client Onboarding</h2>
            <p className="mt-2 text-zinc-400">
              Save a new client’s business details for campaign work.
            </p>

            {demoId && (
              <div className="mt-4 rounded-xl border border-cyan-400/20 bg-cyan-400/10 p-4 text-sm text-cyan-300">
                This onboarding form was prefilled from a demo request. Saving this client
                will also mark that demo request as converted.
              </div>
            )}

            <div className="mt-6 grid gap-4 md:grid-cols-2">
              {Object.entries(form).map(([key, value]) => (
                <div key={key}>
                  <label className="mb-2 block text-sm text-zinc-300">
                    {key.replaceAll("_", " ")}
                  </label>
                  <input
                    value={value}
                    onChange={(e) =>
                      setForm((prev) => ({ ...prev, [key]: e.target.value }))
                    }
                    className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-white outline-none focus:border-cyan-400"
                  />
                </div>
              ))}
            </div>

            <button
              onClick={handleSave}
              disabled={loading}
              className="mt-6 rounded-xl bg-cyan-500 px-5 py-3 font-medium text-black hover:bg-cyan-400 disabled:opacity-50"
            >
              {loading ? "Saving..." : "Save Client"}
            </button>

            {message && <p className="mt-4 text-sm text-emerald-400">{message}</p>}
          </section>
        </div>
      </main>
    </ProtectedShell>
  );
}