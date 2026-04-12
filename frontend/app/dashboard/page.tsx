"use client";

import AgentCard from "@/components/AgentCard";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import ProtectedShell from "@/components/ProtectedShell";

const cards = [
  {
    title: "Business Profile",
    description: "Save business details once and reuse them across all AI tools.",
    href: "/business-profile",
  },
  {
    title: "Content Generator",
    description: "Generate post ideas, reel hooks, hashtags, CTAs, and weekly content.",
    href: "/content-generator",
  },
  {
    title: "Ad Copy Generator",
    description: "Create high-converting ad copy for local lead generation campaigns.",
    href: "/ad-copy",
  },
  {
    title: "Campaign Planner",
    description: "Get platform, audience, budget, angles, and next action steps.",
    href: "/campaign-planner",
  },
  {
    title: "Lead Follow-up",
    description: "Generate WhatsApp follow-ups and closing messages for incoming leads.",
    href: "/followup",
  },
  {
    title: "Competitor Research",
    description: "Analyze local competitors and find ways to stand out.",
    href: "/competitor-research",
  },
  {
    title: "Weekly Marketing Plan",
    description: "Generate a practical 7-day local marketing execution plan.",
    href: "/weekly-plan",
  },
  {
    title: "Lead Tracker",
    description: "Save leads, update their status, and manage follow-up flow.",
    href: "/lead-tracker",
  },
  {
    title: "Analytics Dashboard",
    description: "Track lead totals, source breakdown, and conversion rate.",
    href: "/analytics",
  },
  {
    title: "ROI Calculator",
    description: "Show expected revenue, profit, and return from marketing spend.",
    href: "/roi-calculator",
  },
  {
    title: "Client Report",
    description: "View a business summary with leads and performance snapshot.",
    href: "/client-report",
  },
  {
    title: "Proposal Generator",
    description: "Generate a ready-to-send client proposal.",
    href: "/proposal-generator",
  },
  {
  title: "Admin Panel",
  description: "View platform stats, recent users, leads, demo requests, and clients.",
  href: "/admin",
  },
  {
  title: "Admin Users",
  description: "Assign packages and control account activation.",
  href: "/admin-users",
},


];

export default function DashboardPage() {
  return (
    <ProtectedShell>
      <main>
        <Navbar />
        <div className="mx-auto grid max-w-7xl gap-6 px-6 py-8 lg:grid-cols-[280px_1fr]">
          <Sidebar />
          <section>
            <div className="mb-8 rounded-3xl border border-white/10 bg-white/5 p-8">
              <p className="mb-3 text-sm uppercase tracking-[0.3em] text-cyan-300">
                AI Marketing Workspace
              </p>
              <h2 className="text-3xl font-bold text-white">
                Build campaigns, content, and follow-ups in minutes
              </h2>
              <p className="mt-3 max-w-2xl text-zinc-400">
                This workspace helps small businesses with strategy, content,
                ads, follow-up messaging, lead tracking, analytics, and client reporting.
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              {cards.map((card) => (
                <AgentCard key={card.title} {...card} />
              ))}
            </div>
          </section>
        </div>
      </main>
    </ProtectedShell>
  );
}