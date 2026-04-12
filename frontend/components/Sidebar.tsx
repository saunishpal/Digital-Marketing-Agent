"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { getUser } from "@/lib/auth";
import { canAccessPath } from "@/lib/access";

const links = [
  { href: "/admin", label: "Admin" },
  { href: "/dashboard", label: "Dashboard" },
  { href: "/business-profile", label: "Business Profile" },
  { href: "/client-onboarding", label: "Client Onboarding" },
  { href: "/demo-requests", label: "Demo Requests" },
  { href: "/content-generator", label: "Content Generator" },
  { href: "/ad-copy", label: "Ad Copy Generator" },
  { href: "/campaign-planner", label: "Campaign Planner" },
  { href: "/followup", label: "Lead Follow-up" },
  { href: "/competitor-research", label: "Competitor Research" },
  { href: "/weekly-plan", label: "Weekly Plan" },
  { href: "/lead-tracker", label: "Lead Tracker" },
  { href: "/analytics", label: "Analytics" },
  { href: "/roi-calculator", label: "ROI Calculator" },
  { href: "/client-report", label: "Client Report" },
  { href: "/proposal-generator", label: "Proposal Generator" },
  { href: "/admin-users", label: "Admin Users" },

];


export default function Sidebar() {
  const pathname = usePathname();
  const user = typeof window !== "undefined" ? getUser() : null;

  const visibleLinks = links.filter((link) => {
    if (!user) return false;
    return canAccessPath(user.role, user.package_name, link.href);
  });

  return (
    <aside className="w-full rounded-2xl border border-white/10 bg-white/5 p-4 shadow-2xl shadow-cyan-500/5">
      <nav className="space-y-2">
        <Link
          href="/"
          className="block rounded-xl px-4 py-3 text-sm text-zinc-300 transition hover:bg-white/10 hover:text-white"
        >
          ← Back to Home
        </Link>

        {visibleLinks.map((link) => {
          const active = pathname === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`block rounded-xl px-4 py-3 text-sm transition ${
                active
                  ? "border border-cyan-400/20 bg-cyan-500/20 text-cyan-300"
                  : "text-zinc-300 hover:bg-white/10 hover:text-white"
              }`}
            >
              {link.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}