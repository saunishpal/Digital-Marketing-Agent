"use client";

import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import ProtectedShell from "@/components/ProtectedShell";
import { getJson, putJson } from "@/lib/api";
import { useEffect, useState } from "react";
import Link from "next/link";

type DemoRequest = {
  id: number;
  name: string;
  business_name: string;
  niche: string;
  city: string;
  phone: string;
  need?: string;
  status: string;
};

export default function DemoRequestsPage() {
  const [items, setItems] = useState<DemoRequest[]>([]);

  async function loadData() {
    try {
      const data = await getJson<DemoRequest[]>("/api/demo-requests/all");
      setItems(data);
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  async function updateStatus(id: number, status: string) {
    await putJson(`/api/demo-requests/${id}/status`, { status });
    await loadData();
  }

  return (
    <ProtectedShell>
      <main>
        <Navbar />
        <div className="mx-auto grid max-w-7xl gap-6 px-6 py-8 lg:grid-cols-[280px_1fr]">
          <Sidebar />
          <section className="rounded-2xl border border-white/10 bg-white/5 p-6">
            <h2 className="text-2xl font-bold text-white">Demo Requests</h2>
            <p className="mt-2 text-zinc-400">
              Track incoming leads from your landing page and convert them into clients.
            </p>

            <div className="mt-6 overflow-x-auto">
              <table className="min-w-full text-sm text-zinc-300">
                <thead>
                  <tr className="border-b border-white/10 text-left text-zinc-400">
                    <th className="p-3">Name</th>
                    <th className="p-3">Business</th>
                    <th className="p-3">Niche</th>
                    <th className="p-3">City</th>
                    <th className="p-3">Phone</th>
                    <th className="p-3">Status</th>
                    <th className="p-3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((item) => (
                    <tr key={item.id} className="border-b border-white/5">
                      <td className="p-3">{item.name}</td>
                      <td className="p-3">{item.business_name}</td>
                      <td className="p-3">{item.niche}</td>
                      <td className="p-3">{item.city}</td>
                      <td className="p-3">{item.phone}</td>
                      <td className="p-3">{item.status}</td>
                      <td className="p-3">
                        <div className="flex flex-wrap gap-2">
                          <select
                            value={item.status}
                            onChange={(e) => updateStatus(item.id, e.target.value)}
                            className="rounded-lg border border-white/10 bg-black/30 px-3 py-2 text-white"
                          >
                            <option value="new">new</option>
                            <option value="contacted">contacted</option>
                            <option value="qualified">qualified</option>
                            <option value="converted">converted</option>
                            <option value="closed">closed</option>
                          </select>

                          <Link
                            href={`/client-onboarding?demo_id=${item.id}&business_name=${encodeURIComponent(item.business_name)}&niche=${encodeURIComponent(item.niche)}&city=${encodeURIComponent(item.city)}&whatsapp=${encodeURIComponent(item.phone)}&services=${encodeURIComponent(item.need || "")}`}
                            className="rounded-lg bg-cyan-500 px-3 py-2 font-medium text-black hover:bg-cyan-400"
                          >
                            Convert
                          </Link>
                        </div>
                      </td>
                    </tr>
                  ))}

                  {items.length === 0 && (
                    <tr>
                      <td colSpan={7} className="p-6 text-center text-zinc-500">
                        No demo requests yet.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>
        </div>
      </main>
    </ProtectedShell>
  );
}