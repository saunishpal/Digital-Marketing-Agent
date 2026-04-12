"use client";

import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import OutputBox from "@/components/OutputBox";
import { postJson } from "@/lib/api";
import { useState } from "react";

type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};

type SourceItem = {
  title: string;
  url: string;
};

export default function CompetitorResearchPage() {
  const [form, setForm] = useState({
    business_name: "Sunvolt Energy",
    niche: "Solar Installation",
    city: "Bhagabanpur, West Bengal",
    competitor_name: "",
    competitor_website: "",
    competitor_notes: "",
  });

  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: "assistant",
      content:
        "Hi, I’m Market Mind AI. Ask me to research competitors, analyze a website, find SEO ideas, or suggest ad angles for your business.",
    },
  ]);
  const [chatInput, setChatInput] = useState("");
  const [chatLoading, setChatLoading] = useState(false);
  const [sources, setSources] = useState<SourceItem[]>([]);

  async function analyze() {
    try {
      setLoading(true);
      const data = await postJson<{ result: string }>(
        "/api/competitor/analyze",
        form
      );
      setOutput(data.result);
    } catch (error) {
      setOutput(error instanceof Error ? error.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  async function sendChat() {
    if (!chatInput.trim() || chatLoading) return;

    const userMessage: ChatMessage = {
      role: "user",
      content: chatInput,
    };

    const updatedMessages = [...messages, userMessage];

    setMessages(updatedMessages);
    setChatInput("");
    setChatLoading(true);
    setSources([]);

    try {
      const data = await postJson<{
        reply: string;
        sources?: SourceItem[];
        tools_used?: string[];
      }>("/api/competitor/chat", {
        messages: updatedMessages,
        business_type: form.niche,
        location: form.city,
        website_url: form.competitor_website || "",
      });

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: data.reply,
        },
      ]);

      setSources(data.sources || []);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            error instanceof Error ? error.message : "Something went wrong",
        },
      ]);
    } finally {
      setChatLoading(false);
    }
  }

  return (
    <main>
      <Navbar />
      <div className="mx-auto grid max-w-7xl gap-6 px-6 py-8 lg:grid-cols-[280px_1fr]">
        <Sidebar />

        <section className="space-y-6">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
            <h2 className="text-2xl font-bold text-white">Competitor Research</h2>

            <div className="mt-6 grid gap-4 md:grid-cols-2">
              {Object.entries(form).map(([key, value]) => (
                <div key={key}>
                  <label className="mb-2 block text-sm text-zinc-300 capitalize">
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
              onClick={analyze}
              disabled={loading}
              className="mt-6 rounded-xl bg-cyan-500 px-5 py-3 font-medium text-black hover:bg-cyan-400 disabled:opacity-50"
            >
              {loading ? "Analyzing..." : "Analyze Competitor"}
            </button>

            <div className="mt-6">
              <OutputBox title="Competitor Analysis" content={output} />
            </div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
            <div className="mb-4">
              <h3 className="text-2xl font-bold text-white">Market Mind AI Chatbot</h3>
              <p className="mt-2 text-sm text-zinc-400">
                Research-backed marketing chatbot with competitor, SEO, and website analysis.
              </p>
            </div>

            <div className="mb-4 flex flex-wrap gap-2">
              <button
                onClick={() =>
                  setChatInput(
                    "Research my top local competitors and tell me how my business can stand out."
                  )
                }
                className="rounded-full border border-white/10 bg-black/30 px-4 py-2 text-sm text-zinc-200 hover:border-cyan-400"
              >
                Local competitors
              </button>

              <button
                onClick={() =>
                  setChatInput(
                    "Analyze my competitor website and tell me what marketing angle they are using."
                  )
                }
                className="rounded-full border border-white/10 bg-black/30 px-4 py-2 text-sm text-zinc-200 hover:border-cyan-400"
              >
                Website angle
              </button>

              <button
                onClick={() =>
                  setChatInput(
                    "Find SEO keyword ideas and content opportunities for my niche in my city."
                  )
                }
                className="rounded-full border border-white/10 bg-black/30 px-4 py-2 text-sm text-zinc-200 hover:border-cyan-400"
              >
                SEO ideas
              </button>
            </div>

            <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
              <div className="max-h-[420px] space-y-4 overflow-y-auto pr-1">
                {messages.map((msg, idx) => (
                  <div
                    key={idx}
                    className={`flex ${
                      msg.role === "user" ? "justify-end" : "justify-start"
                    }`}
                  >
                    <div
                      className={`max-w-[85%] whitespace-pre-wrap rounded-2xl px-4 py-3 text-sm leading-7 ${
                        msg.role === "user"
                          ? "bg-cyan-500 text-black"
                          : "border border-white/10 bg-white/10 text-white"
                      }`}
                    >
                      {msg.content}
                    </div>
                  </div>
                ))}

                {chatLoading && (
                  <div className="flex justify-start">
                    <div className="max-w-[85%] rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-sm text-zinc-300">
                      Researching the web and thinking...
                    </div>
                  </div>
                )}
              </div>

              {sources.length > 0 && (
                <div className="mt-4 rounded-2xl border border-white/10 bg-black/20 p-4">
                  <h4 className="mb-3 text-sm font-semibold text-zinc-200">
                    Sources used
                  </h4>
                  <div className="space-y-2">
                    {sources.map((source, index) => (
                      <a
                        key={`${source.url}-${index}`}
                        href={source.url}
                        target="_blank"
                        rel="noreferrer"
                        className="block rounded-xl border border-white/10 bg-white/5 px-4 py-3 transition hover:border-cyan-400"
                      >
                        <p className="text-sm font-medium text-white">
                          {source.title}
                        </p>
                        <p className="mt-1 break-all text-xs text-zinc-400">
                          {source.url}
                        </p>
                      </a>
                    ))}
                  </div>
                </div>
              )}

              <div className="mt-4 grid gap-3 md:grid-cols-[1fr_auto]">
                <textarea
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  placeholder="Ask about competitors, SEO, ads, website analysis, local strategy, offers, or positioning..."
                  className="min-h-[110px] w-full resize-none rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-white outline-none focus:border-cyan-400"
                />
                <button
                  onClick={sendChat}
                  disabled={chatLoading}
                  className="rounded-2xl bg-cyan-500 px-6 py-4 font-medium text-black hover:bg-cyan-400 disabled:opacity-50 md:min-w-[140px]"
                >
                  {chatLoading ? "Thinking..." : "Send"}
                </button>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}