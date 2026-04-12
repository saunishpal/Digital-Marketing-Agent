import Link from "next/link";

type AgentCardProps = {
  title: string;
  description: string;
  href: string;
};

export default function AgentCard({
  title,
  description,
  href,
}: AgentCardProps) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-6 shadow-xl shadow-cyan-500/5 transition hover:-translate-y-1 hover:bg-white/10">
      <h3 className="text-lg font-semibold text-white">{title}</h3>
      <p className="mt-2 text-sm leading-6 text-zinc-400">{description}</p>
      <Link
        href={href}
        className="mt-5 inline-block rounded-xl bg-cyan-500 px-4 py-2 text-sm font-medium text-black transition hover:bg-cyan-400"
      >
        Open Tool
      </Link>
    </div>
  );
}