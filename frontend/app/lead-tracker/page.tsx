"use client";

import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import { getJson, postJson, putJson } from "@/lib/api";
import { useEffect, useState } from "react";

type Lead = {
  id: number;
  lead_name: string;
  phone?: string;
  source?: string;
  service?: string;
  city?: string;
  status: string;
  notes?: string;
};

export default function LeadTrackerPage() {
  const [form, setForm] = useState({
    lead_name: "",
    phone: "",
    source: "",
    service: "",
    city: "",
    status: "new",
    notes: "",
  });

  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(false);

  async function loadLeads() {
    try {
      const data = await getJson<Lead[]>("/api/leads/all");
      setLeads(data);
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    loadLeads();
  }, []);

  async function createLead() {
    try {
      setLoading(true);
      await postJson("/api/leads/create", form);
      setForm({
        lead_name: "",
        phone: "",
        source: "",
        service: "",
        city: "",
        status: "new",
        notes: "",
      });
      await loadLeads();
    } finally {
      setLoading(false);
    }
  }

  async function updateStatus(id: number, status: string) {
    await putJson(`/api/leads/${id}/status`, { status });
    await loadLeads();
  }

  return (
    <main>
      <Navbar />
      <div className="mx-auto grid max-w-7xl gap-6 px-6 py-8 lg:grid-cols-[280px_1fr]">
        <Sidebar />

        <section className="space-y-6">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
            <h2 className="text-2xl font-bold text-white">Lead Tracker</h2>
            <p className="mt-2 text-zinc-400">
              Save leads and move them through your sales pipeline.
            </p>

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
              onClick={createLead}
              disabled={loading}
              className="mt-6 rounded-xl bg-cyan-500 px-5 py-3 font-medium text-black hover:bg-cyan-400 disabled:opacity-50"
            >
              {loading ? "Saving..." : "Save Lead"}
            </button>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
            <h3 className="text-xl font-semibold text-white">Saved Leads</h3>

            <div className="mt-4 overflow-x-auto">
              <table className="min-w-full border-collapse text-sm text-zinc-300">
                <thead>
                  <tr className="border-b border-white/10 text-left text-zinc-400">
                    <th className="p-3">Name</th>
                    <th className="p-3">Phone</th>
                    <th className="p-3">Source</th>
                    <th className="p-3">Service</th>
                    <th className="p-3">City</th>
                    <th className="p-3">Status</th>
                    <th className="p-3">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {leads.map((lead) => (
                    <tr key={lead.id} className="border-b border-white/5">
                      <td className="p-3">{lead.lead_name}</td>
                      <td className="p-3">{lead.phone}</td>
                      <td className="p-3">{lead.source}</td>
                      <td className="p-3">{lead.service}</td>
                      <td className="p-3">{lead.city}</td>
                      <td className="p-3">{lead.status}</td>
                      <td className="p-3">
                        <select
                          value={lead.status}
                          onChange={(e) => updateStatus(lead.id, e.target.value)}
                          className="rounded-lg border border-white/10 bg-black/30 px-3 py-2 text-white"
                        >
                          <option value="new">new</option>
                          <option value="contacted">contacted</option>
                          <option value="qualified">qualified</option>
                          <option value="proposal_sent">proposal_sent</option>
                          <option value="closed">closed</option>
                          <option value="lost">lost</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                  {leads.length === 0 && (
                    <tr>
                      <td colSpan={7} className="p-6 text-center text-zinc-500">
                        No leads saved yet.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}