"use client";

import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import ProtectedShell from "@/components/ProtectedShell";
import { getJson } from "@/lib/api";
import Link from "next/link";
import { useEffect, useState } from "react";

type AdminOverview = {
  stats: {
    total_users: number;
    total_clients: number;
    total_leads: number;
    total_demo_requests: number;
  };
  recent_users: {
    id: number;
    email: string;
    full_name: string;
  }[];
  recent_clients: {
    id: number;
    business_name: string;
    city: string;
    niche: string;
  }[];
  recent_leads: {
    id: number;
    lead_name: string;
    status: string;
    source?: string;
    city?: string;
  }[];
  recent_demo_requests: {
    id: number;
    name: string;
    business_name: string;
    status: string;
    city: string;
  }[];
};

export default function AdminPage() {
  const [data, setData] = useState<AdminOverview | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadAdminData() {
      try {
        const result = await getJson<AdminOverview>("/api/admin/overview");
        setData(result);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load admin data");
      }
    }

    loadAdminData();
  }, []);

  return (
    <ProtectedShell>
      <main>
        <Navbar />
        <div className="mx-auto grid max-w-7xl gap-6 px-6 py-8 lg:grid-cols-[280px_1fr]">
          <Sidebar />

          <section className="space-y-6">
            <div className="rounded-3xl border border-white/10 bg-white/5 p-8">
              <p className="mb-3 text-sm uppercase tracking-[0.3em] text-cyan-300">
                Admin Control Center
              </p>
              <h1 className="text-3xl font-bold text-white">
                Monitor users, clients, leads, and demo requests
              </h1>
              <p className="mt-3 text-zinc-400">
                This is your platform overview and quick management area.
              </p>
            </div>

            {error && (
              <div className="rounded-2xl border border-red-400/20 bg-red-400/10 p-4 text-red-300">
                {error}
              </div>
            )}

            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
                <p className="text-sm text-zinc-400">Total Users</p>
                <h3 className="mt-2 text-3xl font-bold text-white">
                  {data?.stats.total_users ?? 0}
                </h3>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
                <p className="text-sm text-zinc-400">Total Clients</p>
                <h3 className="mt-2 text-3xl font-bold text-white">
                  {data?.stats.total_clients ?? 0}
                </h3>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
                <p className="text-sm text-zinc-400">Total Leads</p>
                <h3 className="mt-2 text-3xl font-bold text-white">
                  {data?.stats.total_leads ?? 0}
                </h3>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
                <p className="text-sm text-zinc-400">Demo Requests</p>
                <h3 className="mt-2 text-3xl font-bold text-white">
                  {data?.stats.total_demo_requests ?? 0}
                </h3>
              </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
              <Link
                href="/demo-requests"
                className="rounded-2xl border border-white/10 bg-white/5 p-6 transition hover:bg-white/10"
              >
                <h3 className="text-lg font-semibold text-white">View Demo Requests</h3>
                <p className="mt-2 text-sm text-zinc-400">
                  Check new inbound interest from your landing page.
                </p>
              </Link>

              <Link
                href="/client-onboarding"
                className="rounded-2xl border border-white/10 bg-white/5 p-6 transition hover:bg-white/10"
              >
                <h3 className="text-lg font-semibold text-white">Onboard Client</h3>
                <p className="mt-2 text-sm text-zinc-400">
                  Save a new client and start campaign work quickly.
                </p>
              </Link>

              <Link
                href="/lead-tracker"
                className="rounded-2xl border border-white/10 bg-white/5 p-6 transition hover:bg-white/10"
              >
                <h3 className="text-lg font-semibold text-white">Manage Leads</h3>
                <p className="mt-2 text-sm text-zinc-400">
                  Track lead status and move them through the pipeline.
                </p>
              </Link>

              <Link
                href="/analytics"
                className="rounded-2xl border border-white/10 bg-white/5 p-6 transition hover:bg-white/10"
              >
                <h3 className="text-lg font-semibold text-white">Open Analytics</h3>
                <p className="mt-2 text-sm text-zinc-400">
                  Review performance and conversion overview.
                </p>
              </Link>
            </div>

            <div className="grid gap-6 xl:grid-cols-2">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
                <h2 className="text-xl font-semibold text-white">Recent Users</h2>
                <div className="mt-4 space-y-3">
                  {data?.recent_users?.length ? (
                    data.recent_users.map((user) => (
                      <div
                        key={user.id}
                        className="rounded-xl border border-white/10 bg-black/20 p-4"
                      >
                        <p className="font-medium text-white">
                          {user.full_name || "No name"}
                        </p>
                        <p className="text-sm text-zinc-400">{user.email}</p>
                      </div>
                    ))
                  ) : (
                    <p className="text-zinc-500">No users yet.</p>
                  )}
                </div>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
                <h2 className="text-xl font-semibold text-white">Recent Clients</h2>
                <div className="mt-4 space-y-3">
                  {data?.recent_clients?.length ? (
                    data.recent_clients.map((client) => (
                      <div
                        key={client.id}
                        className="rounded-xl border border-white/10 bg-black/20 p-4"
                      >
                        <p className="font-medium text-white">{client.business_name}</p>
                        <p className="text-sm text-zinc-400">
                          {client.niche} • {client.city}
                        </p>
                      </div>
                    ))
                  ) : (
                    <p className="text-zinc-500">No clients yet.</p>
                  )}
                </div>
              </div>
            </div>

            <div className="grid gap-6 xl:grid-cols-2">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
                <h2 className="text-xl font-semibold text-white">Recent Leads</h2>
                <div className="mt-4 space-y-3">
                  {data?.recent_leads?.length ? (
                    data.recent_leads.map((lead) => (
                      <div
                        key={lead.id}
                        className="rounded-xl border border-white/10 bg-black/20 p-4"
                      >
                        <p className="font-medium text-white">{lead.lead_name}</p>
                        <p className="text-sm text-zinc-400">
                          {lead.status}
                          {lead.source ? ` • ${lead.source}` : ""}
                          {lead.city ? ` • ${lead.city}` : ""}
                        </p>
                      </div>
                    ))
                  ) : (
                    <p className="text-zinc-500">No leads yet.</p>
                  )}
                </div>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
                <h2 className="text-xl font-semibold text-white">Recent Demo Requests</h2>
                <div className="mt-4 space-y-3">
                  {data?.recent_demo_requests?.length ? (
                    data.recent_demo_requests.map((demo) => (
                      <div
                        key={demo.id}
                        className="rounded-xl border border-white/10 bg-black/20 p-4"
                      >
                        <p className="font-medium text-white">{demo.business_name}</p>
                        <p className="text-sm text-zinc-400">
                          {demo.name} • {demo.city} • {demo.status}
                        </p>
                      </div>
                    ))
                  ) : (
                    <p className="text-zinc-500">No demo requests yet.</p>
                  )}
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>
    </ProtectedShell>
  );
}