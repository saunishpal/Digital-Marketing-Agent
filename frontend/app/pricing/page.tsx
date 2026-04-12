import Link from "next/link";

const plans = [
  {
    name: "Starter",
    price: "₹1,999",
    desc: "For solo local businesses starting online marketing",
    features: [
      "Content generation",
      "Ad copy generation",
      "Weekly marketing plan",
      "Lead follow-up messages",
    ],
  },
  {
    name: "Growth",
    price: "₹4,999",
    desc: "For businesses that want lead tracking and analytics",
    features: [
      "Everything in Starter",
      "Lead tracker",
      "Analytics dashboard",
      "ROI calculator",
      "Client reports",
    ],
  },
  {
    name: "Agency",
    price: "₹9,999",
    desc: "For marketers handling multiple local clients",
    features: [
      "Everything in Growth",
      "Multi-client workspace",
      "Proposal generator",
      "Competitor research",
      "Premium reporting workflow",
    ],
  },
];

export default function PricingPage() {
  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top_left,rgba(34,211,238,0.12),transparent_30%),radial-gradient(circle_at_top_right,rgba(16,185,129,0.1),transparent_25%),linear-gradient(180deg,#050816_0%,#02040a_100%)] px-6 py-16 text-white">
      <div className="mx-auto max-w-7xl">
        <div className="text-center">
          <p className="text-sm uppercase tracking-[0.3em] text-cyan-300">
            Pricing
          </p>
          <h1 className="mt-4 text-4xl font-bold">Simple plans for small business growth</h1>
          <p className="mt-4 text-zinc-400">
            Choose a plan based on how many tools and workflows you need.
          </p>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className="rounded-3xl border border-white/10 bg-white/5 p-8"
            >
              <h2 className="text-2xl font-bold">{plan.name}</h2>
              <p className="mt-2 text-zinc-400">{plan.desc}</p>
              <p className="mt-6 text-4xl font-bold">{plan.price}</p>

              <ul className="mt-6 space-y-3 text-zinc-300">
                {plan.features.map((feature) => (
                  <li key={feature}>• {feature}</li>
                ))}
              </ul>

              <Link
                href="/demo"
                className="mt-8 inline-block rounded-xl bg-cyan-500 px-5 py-3 font-medium text-black hover:bg-cyan-400"
              >
                Request Demo
              </Link>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}