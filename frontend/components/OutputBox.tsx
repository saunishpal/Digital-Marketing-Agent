"use client";

import { copyToClipboard, downloadTextAsPdf } from "@/lib/utils";

type OutputBoxProps = {
  title: string;
  content: string;
};

export default function OutputBox({ title, content }: OutputBoxProps) {
  async function handleCopy() {
    if (!content) return;
    try {
      await copyToClipboard(content);
      alert("Copied to clipboard");
    } catch {
      alert("Copy failed");
    }
  }

  function handleDownload() {
    if (!content) return;
    downloadTextAsPdf(title, content);
  }

  return (
    <div className="rounded-2xl border border-white/10 bg-black/30 p-5">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
        <h3 className="text-base font-semibold text-white">{title}</h3>

        <div className="flex gap-2">
          <button
            onClick={handleCopy}
            className="rounded-lg border border-white/10 bg-white/10 px-3 py-2 text-sm text-white hover:bg-white/20"
          >
            Copy
          </button>
          <button
            onClick={handleDownload}
            className="rounded-lg bg-cyan-500 px-3 py-2 text-sm font-medium text-black hover:bg-cyan-400"
          >
            Download PDF
          </button>
        </div>
      </div>

      <pre className="whitespace-pre-wrap break-words text-sm leading-7 text-zinc-300">
        {content || "Your generated output will appear here."}
      </pre>
    </div>
  );
}