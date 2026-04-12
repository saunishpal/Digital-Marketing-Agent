"use client";

import { useState } from "react";
import { postJson } from "@/lib/api";

type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};

type SourceItem = {
  title: string;
  url: string;
};

type ChatbotBoxProps = {
  title?: string;
  subtitle?: string;
  endpoint?: string;
  businessType?: string;
  location?: string;
  websiteUrl?: string;
  placeholder?: string;
  quickPrompts?: string[];
  initialMessage?: string;
};

export default function ChatbotBox({
  title = "Market Mind AI Chatbot",
  subtitle = "Research-backed marketing chatbot with competitor, SEO, and website analysis.",
  endpoint = "/api/competitor/chat",
  businessType = "",
  location = "",
  websiteUrl = "",
  placeholder = "Ask about competitors, SEO, ads, website analysis, local strategy, offers, or positioning...",
  quickPrompts = [
    "Research my top local competitors and tell me how my business can stand out.",
    "Analyze my competitor website and tell me what marketing angle they are using.",
    "Find SEO keyword ideas and content opportunities for my niche in my city.",
  ],
  initialMessage = "Hi, I’m Market Mind AI. Ask me to research competitors, analyze a website, find SEO ideas, or suggest ad angles for your business.",
}: ChatbotBoxProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: "assistant",
      content: initialMessage,
    },
  ]);
  const [chatInput, setChatInput] = useState("");
  const [chatLoading, setChatLoading] = useState(false);
  const [sources, setSources] = useState<SourceItem[]>([]);

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
      }>(endpoint, {
        messages: updatedMessages,
        business_type: businessType,
        location,
        website_url: websiteUrl,
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
    <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
      <div className="mb-4">
        <h3 className="text-2xl font-bold text-white">{title}</h3>
        <p className="mt-2 text-sm text-zinc-400">{subtitle}</p>
      </div>

      <div className="mb-4 flex flex-wrap gap-2">
        {quickPrompts.map((prompt, index) => (
          <button
            key={`${prompt}-${index}`}
            onClick={() => setChatInput(prompt)}
            className="rounded-full border border-white/10 bg-black/30 px-4 py-2 text-sm text-zinc-200 hover:border-cyan-400"
          >
            {prompt.length > 32 ? `${prompt.slice(0, 32)}...` : prompt}
          </button>
        ))}
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
            placeholder={placeholder}
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
  );
}