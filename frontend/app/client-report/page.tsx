"use client";

import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import ProtectedShell from "@/components/ProtectedShell";
import ProfileSelector from "@/components/ProfileSelector";
import { getJson } from "@/lib/api";
import { useState } from "react";

type Lead = {
  id: number;
  lead_name: string;
  status: string;
  source?: string;
};

type Profile = {
  id: number;
  business_name: string;
  niche: string;
  city: string;
  services: string;
  target_audience: string;
  main_offer: string;
  usp: string;
};

export default function ClientReportPage() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [leads, setLeads] = useState<Lead[]>([]);

  async function handleSelect(selected: Profile) {
    setProfile(selected);
    const result = await getJson<Lead[]>(`/api/leads/profile/${selected.id}`);
    setLeads(result);
  }

  const closedLeads = leads.filter((lead) => lead.status === "closed").length;
  const conversionRate = leads.length ? ((closedLeads / leads.length) * 100).toFixed(2) : "0.00";

  return (
    <ProtectedShell>
      <main>
        <Navbar />
        <div className="mx-auto grid max-w-7xl gap-6 px-6 py-8 lg:grid-cols-[280px_1fr]">
          <Sidebar />
          <section className="space-y-6">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
              <h2 className="text-2xl font-bold text-white">Client Report</h2>
              <p className="mt-2 text-zinc-400">Choose a business profile to see a snapshot.</p>
              <div className="mt-6">
                <ProfileSelector onSelect={handleSelect} />
              </div>
            </div>

            {profile && (
              <>
                <div className="grid gap-6 md:grid-cols-3">
                  <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
                    <p className="text-sm text-zinc-400">Business</p>
                    <h3 className="mt-2 text-xl font-bold text-white">{profile.business_name}</h3>
                    <p className="mt-2 text-zinc-400">{profile.city}</p>
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
                    <p className="text-sm text-zinc-400">Total Leads</p>
                    <h3 className="mt-2 text-3xl font-bold text-white">{leads.length}</h3>
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
                    <p className="text-sm text-zinc-400">Conversion Rate</p>
                    <h3 className="mt-2 text-3xl font-bold text-white">{conversionRate}%</h3>
                  </div>
                </div>

                <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
                  <h3 className="text-xl font-semibold text-white">Lead Snapshot</h3>
                  <div className="mt-4 space-y-3">
                    {leads.map((lead) => (
                      <div
                        key={lead.id}
                        className="rounded-xl border border-white/10 bg-black/20 p-4"
                      >
                        <p className="font-medium text-white">{lead.lead_name}</p>
                        <p className="text-sm text-zinc-400">
                          Status: {lead.status} {lead.source ? `• Source: ${lead.source}` : ""}
                        </p>
                      </div>
                    ))}
                    {leads.length === 0 && (
                      <p className="text-zinc-500">No leads found for this profile.</p>
                    )}
                  </div>
                </div>
              </>
            )}
          </section>
        </div>
      </main>
    </ProtectedShell>
  );
}