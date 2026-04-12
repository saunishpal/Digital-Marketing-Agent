"use client";

import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import { getJson } from "@/lib/api";
import { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

type BreakdownItem = {
  name: string;
  value: number;
};

type AnalyticsResponse = {
  total_leads: number;
  closed_leads: number;
  conversion_rate: number;
  status_breakdown: BreakdownItem[];
  source_breakdown: BreakdownItem[];
};

export default function AnalyticsPage() {
  const [data, setData] = useState<AnalyticsResponse | null>(null);

  useEffect(() => {
    async function loadData() {
      try {
        const result = await getJson<AnalyticsResponse>("/api/analytics/summary");
        setData(result);
      } catch (error) {
        console.error(error);
      }
    }

    loadData();
  }, []);

  return (
    <main>
      <Navbar />
      <div className="mx-auto grid max-w-7xl gap-6 px-6 py-8 lg:grid-cols-[280px_1fr]">
        <Sidebar />

        <section className="space-y-6">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
            <h2 className="text-2xl font-bold text-white">Analytics Dashboard</h2>
            <p className="mt-2 text-zinc-400">
              Track lead performance and simple sales metrics.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
              <p className="text-sm text-zinc-400">Total Leads</p>
              <h3 className="mt-2 text-3xl font-bold text-white">
                {data?.total_leads ?? 0}
              </h3>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
              <p className="text-sm text-zinc-400">Closed Leads</p>
              <h3 className="mt-2 text-3xl font-bold text-white">
                {data?.closed_leads ?? 0}
              </h3>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
              <p className="text-sm text-zinc-400">Conversion Rate</p>
              <h3 className="mt-2 text-3xl font-bold text-white">
                {data?.conversion_rate ?? 0}%
              </h3>
            </div>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
              <h3 className="mb-4 text-lg font-semibold text-white">
                Lead Status Breakdown
              </h3>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={data?.status_breakdown || []}>
                    <XAxis dataKey="name" stroke="#a1a1aa" />
                    <YAxis stroke="#a1a1aa" />
                    <Tooltip />
                    <Bar dataKey="value" fill="#22d3ee" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
              <h3 className="mb-4 text-lg font-semibold text-white">
                Lead Source Breakdown
              </h3>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={data?.source_breakdown || []}
                      dataKey="value"
                      nameKey="name"
                      outerRadius={100}
                      label
                    >
                      {(data?.source_breakdown || []).map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={["#22d3ee", "#34d399", "#818cf8", "#f59e0b", "#f472b6"][index % 5]}
                        />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}