"use client";

import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import OutputBox from "@/components/OutputBox";
import { postJson } from "@/lib/api";
import { useState } from "react";

export default function FollowupPage() {
  const [form, setForm] = useState({
    lead_name: "Rahul",
    service: "Residential solar installation",
    city: "Contai",
    pain_point: "High electricity bill",
    business_name: "Sunvolt Energy",
    main_offer: "Save electricity bills with trusted solar installation",
  });

  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);

  async function generate() {
    try {
      setLoading(true);
      const data = await postJson<{ result: string }>("/api/followup/generate", form);
      setOutput(data.result);
    } catch (error) {
      setOutput(error instanceof Error ? error.message : "Something went wrong");
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
          <h2 className="text-2xl font-bold text-white">Lead Follow-up Generator</h2>

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
            onClick={generate}
            disabled={loading}
            className="mt-6 rounded-xl bg-cyan-500 px-5 py-3 font-medium text-black hover:bg-cyan-400 disabled:opacity-50"
          >
            {loading ? "Generating..." : "Generate Follow-up"}
          </button>

          <div className="mt-6">
            <OutputBox title="Follow-up Messages" content={output} />
          </div>
        </section>
      </div>
    </main>
  );
}