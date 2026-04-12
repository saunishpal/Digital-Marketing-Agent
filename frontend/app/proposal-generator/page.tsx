"use client";

import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import ProtectedShell from "@/components/ProtectedShell";
import OutputBox from "@/components/OutputBox";
import { useState } from "react";

export default function ProposalGeneratorPage() {
  const [form, setForm] = useState({
    client_name: "",
    business_name: "",
    niche: "",
    city: "",
    problem: "",
    solution: "",
    monthly_price: "4999",
    expected_result: "",
  });

  const [output, setOutput] = useState("");

  function generateProposal() {
    const proposal = `
CLIENT PROPOSAL

Client Name: ${form.client_name}
Business Name: ${form.business_name}
Niche: ${form.niche}
City: ${form.city}

Current Problem:
${form.problem}

Proposed Solution:
${form.solution}

What will be included:
- Content generation support
- Ad copy generation
- Weekly marketing planning
- Lead follow-up messaging
- Lead tracking
- Analytics and ROI support

Expected Result:
${form.expected_result}

Monthly Pricing:
₹${form.monthly_price}

Why this makes sense:
This system helps your business save time, improve consistency,
generate better marketing ideas faster, and organize leads properly.

Next Step:
Approve this proposal and begin onboarding.
    `.trim();

    setOutput(proposal);
  }

  return (
    <ProtectedShell>
      <main>
        <Navbar />
        <div className="mx-auto grid max-w-7xl gap-6 px-6 py-8 lg:grid-cols-[280px_1fr]">
          <Sidebar />

          <section className="rounded-2xl border border-white/10 bg-white/5 p-6">
            <h2 className="text-2xl font-bold text-white">Proposal Generator</h2>
            <p className="mt-2 text-zinc-400">
              Create a ready-to-send proposal for small business clients.
            </p>

            <div className="mt-6 grid gap-4 md:grid-cols-2">
              {Object.entries(form).map(([key, value]) => (
                <div key={key} className={key === "problem" || key === "solution" || key === "expected_result" ? "md:col-span-2" : ""}>
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
              onClick={generateProposal}
              className="mt-6 rounded-xl bg-cyan-500 px-5 py-3 font-medium text-black hover:bg-cyan-400"
            >
              Generate Proposal
            </button>

            <div className="mt-6">
              <OutputBox title="Client Proposal" content={output} />
            </div>
          </section>
        </div>
      </main>
    </ProtectedShell>
  );
}