"use client";

import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import { useMemo, useState } from "react";

export default function RoiCalculatorPage() {
  const [form, setForm] = useState({
    monthly_ad_spend: "5000",
    monthly_leads: "30",
    close_rate: "10",
    avg_sale_value: "25000",
    profit_margin: "20",
  });

  const result = useMemo(() => {
    const adSpend = Number(form.monthly_ad_spend) || 0;
    const leads = Number(form.monthly_leads) || 0;
    const closeRate = Number(form.close_rate) || 0;
    const avgSale = Number(form.avg_sale_value) || 0;
    const margin = Number(form.profit_margin) || 0;

    const customers = (leads * closeRate) / 100;
    const revenue = customers * avgSale;
    const profit = (revenue * margin) / 100;
    const roi = adSpend > 0 ? ((profit - adSpend) / adSpend) * 100 : 0;

    return {
      customers: customers.toFixed(2),
      revenue: revenue.toFixed(2),
      profit: profit.toFixed(2),
      roi: roi.toFixed(2),
    };
  }, [form]);

  return (
    <main>
      <Navbar />
      <div className="mx-auto grid max-w-7xl gap-6 px-6 py-8 lg:grid-cols-[280px_1fr]">
        <Sidebar />

        <section className="space-y-6">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
            <h2 className="text-2xl font-bold text-white">ROI Calculator</h2>
            <p className="mt-2 text-zinc-400">
              Estimate return from local marketing campaigns.
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
          </div>

          <div className="grid gap-6 md:grid-cols-4">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
              <p className="text-sm text-zinc-400">Expected Customers</p>
              <h3 className="mt-2 text-2xl font-bold text-white">
                {result.customers}
              </h3>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
              <p className="text-sm text-zinc-400">Estimated Revenue</p>
              <h3 className="mt-2 text-2xl font-bold text-white">
                ₹{result.revenue}
              </h3>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
              <p className="text-sm text-zinc-400">Estimated Profit</p>
              <h3 className="mt-2 text-2xl font-bold text-white">
                ₹{result.profit}
              </h3>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
              <p className="text-sm text-zinc-400">ROI</p>
              <h3 className="mt-2 text-2xl font-bold text-white">
                {result.roi}%
              </h3>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}