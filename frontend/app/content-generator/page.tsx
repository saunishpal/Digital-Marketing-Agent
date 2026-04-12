"use client";

import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import OutputBox from "@/components/OutputBox";
import ProfileSelector from "@/components/ProfileSelector";
import ChatbotBox from "@/components/ChatbotBox";
import { postJson } from "@/lib/api";
import { useState } from "react";

type GenerateResponse = {
  result: string;
};

export default function ContentGeneratorPage() {
  const [form, setForm] = useState({
    business_name: "Sunvolt Energy",
    niche: "Solar Installation",
    city: "Bhagabanpur, West Bengal",
    services: "Residential solar, commercial solar, maintenance",
    target_audience: "Homeowners, shops, schools, small factories",
    main_offer: "Save electricity bills with trusted solar installation",
    usp: "20+ years of local experience and trusted service",
  });

  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);

  const [imagePrompt, setImagePrompt] = useState(
    "Generate a professional social media post image for a solar installation company in West Bengal with a clean premium design, rooftop solar visuals, trust-building feel, and marketing-friendly composition."
  );
  const [imageUrl, setImageUrl] = useState("");
  const [imageLoading, setImageLoading] = useState(false);
  const [imageError, setImageError] = useState("");

  async function generate() {
    try {
      setLoading(true);
      const data = await postJson<GenerateResponse>("/api/content/generate", form);
      setOutput(data.result);
    } catch (error) {
      setOutput(error instanceof Error ? error.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  async function generateImage() {
    try {
      setImageLoading(true);
      setImageError("");

      const data = await postJson<{ image_url?: string; url?: string }>(
        "/api/image/generate",
        {
          prompt: imagePrompt,
          context: {
            ...form,
            page: "content",
          },
        }
      );

      setImageUrl(data.image_url || data.url || "");
    } catch (error) {
      setImageError(
        error instanceof Error ? error.message : "Image generation failed"
      );
    } finally {
      setImageLoading(false);
    }
  }

  function fillImagePromptFromForm() {
    setImagePrompt(
      `Generate a promotional social media creative for ${form.business_name}, a ${form.niche} business in ${form.city}. Highlight services: ${form.services}. Target audience: ${form.target_audience}. Main offer: ${form.main_offer}. Unique selling point: ${form.usp}. Make it visually premium, modern, engaging, and suitable for Instagram and Facebook.`
    );
  }

  return (
    <main>
      <Navbar />
      <div className="mx-auto grid max-w-7xl gap-6 px-6 py-8 lg:grid-cols-[280px_1fr]">
        <Sidebar />

        <section className="space-y-6">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
            <h2 className="text-2xl font-bold text-white">Content Generator</h2>
            <p className="mt-2 text-zinc-400">
              Generate content ideas, hooks, hashtags, CTAs, and matching creatives.
            </p>

            <div className="mt-5">
              <ProfileSelector
                onSelect={(profile) =>
                  setForm({
                    business_name: profile.business_name,
                    niche: profile.niche,
                    city: profile.city,
                    services: profile.services,
                    target_audience: profile.target_audience,
                    main_offer: profile.main_offer,
                    usp: profile.usp,
                  })
                }
              />
            </div>

            <div className="mt-6 grid gap-4 md:grid-cols-2">
              {Object.entries(form).map(([key, value]) => (
                <div key={key}>
                  <label className="mb-2 block text-sm capitalize text-zinc-300">
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

            <div className="mt-6 flex flex-wrap gap-3">
              <button
                onClick={generate}
                disabled={loading}
                className="rounded-xl bg-cyan-500 px-5 py-3 font-medium text-black hover:bg-cyan-400 disabled:opacity-50"
              >
                {loading ? "Generating..." : "Generate Content"}
              </button>

              <button
                onClick={() => setOutput("")}
                className="rounded-xl border border-white/10 bg-white/5 px-5 py-3 font-medium text-white hover:border-cyan-400"
              >
                Clear Output
              </button>
            </div>

            <div className="mt-6">
              <OutputBox title="Generated Content" content={output} />
            </div>
          </div>

          <ChatbotBox
            title="Content AI Assistant"
            subtitle="ChatGPT-style content strategist that improves hooks, finds trend angles, suggests content ideas, and helps turn ideas into posts."
            endpoint="/api/competitor/chat"
            businessType={form.niche}
            location={form.city}
            websiteUrl=""
            placeholder="Ask for post ideas, hooks, captions, reels concepts, SEO content ideas, trending angles, or better CTAs..."
            quickPrompts={[
              "Give me 10 content ideas for my business.",
              "Turn my offer into 5 Instagram post ideas.",
              "Research local trend-based content angles for my niche.",
              "Create engaging hooks and CTAs for my audience.",
            ]}
            initialMessage={`Hi, I’m Market Mind AI. I can help create better content ideas for ${form.business_name}, research angles, and suggest high-performing content directions.`}
          />

          <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
            <div className="flex flex-col gap-2">
              <h3 className="text-2xl font-bold text-white">
                Marketing Image Generator
              </h3>
              <p className="text-sm text-zinc-400">
                Generate social post creatives so the content tool feels like a complete digital marketing AI.
              </p>
            </div>

            <div className="mt-5 flex flex-wrap gap-2">
              <button
                onClick={fillImagePromptFromForm}
                className="rounded-full border border-white/10 bg-black/30 px-4 py-2 text-sm text-zinc-200 hover:border-cyan-400"
              >
                Auto-fill from profile
              </button>

              <button
                onClick={() =>
                  setImagePrompt(
                    `Generate an Instagram post creative for ${form.business_name} in ${form.city} promoting ${form.main_offer} with clean design, trust-building visuals, and premium style.`
                  )
                }
                className="rounded-full border border-white/10 bg-black/30 px-4 py-2 text-sm text-zinc-200 hover:border-cyan-400"
              >
                Instagram post prompt
              </button>

              <button
                onClick={() =>
                  setImagePrompt(
                    `Generate a Facebook promotional image for ${form.business_name}, a ${form.niche} business in ${form.city}. Highlight ${form.services} and target ${form.target_audience}.`
                  )
                }
                className="rounded-full border border-white/10 bg-black/30 px-4 py-2 text-sm text-zinc-200 hover:border-cyan-400"
              >
                Facebook creative prompt
              </button>
            </div>

            <div className="mt-5 grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
              <div>
                <label className="mb-2 block text-sm text-zinc-300">
                  Image Prompt
                </label>
                <textarea
                  value={imagePrompt}
                  onChange={(e) => setImagePrompt(e.target.value)}
                  className="min-h-[170px] w-full resize-none rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-white outline-none focus:border-cyan-400"
                  placeholder="Describe the marketing image you want to generate..."
                />

                <div className="mt-4 flex flex-wrap gap-3">
                  <button
                    onClick={generateImage}
                    disabled={imageLoading}
                    className="rounded-xl bg-cyan-500 px-5 py-3 font-medium text-black hover:bg-cyan-400 disabled:opacity-50"
                  >
                    {imageLoading ? "Generating..." : "Generate Image"}
                  </button>

                  <button
                    onClick={() => {
                      setImageUrl("");
                      setImageError("");
                    }}
                    className="rounded-xl border border-white/10 bg-white/5 px-5 py-3 font-medium text-white hover:border-cyan-400"
                  >
                    Clear Image
                  </button>
                </div>

                {imageError && (
                  <p className="mt-3 text-sm text-red-400">{imageError}</p>
                )}
              </div>

              <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                <h4 className="mb-3 text-lg font-semibold text-white">
                  Generated Creative
                </h4>

                {imageUrl ? (
                  <div className="space-y-3">
                    <img
                      src={imageUrl}
                      alt="Generated marketing creative"
                      className="w-full rounded-2xl border border-white/10 object-cover"
                    />
                    <a
                      href={imageUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-block rounded-xl bg-cyan-500 px-4 py-2 font-medium text-black hover:bg-cyan-400"
                    >
                      Open Image
                    </a>
                  </div>
                ) : (
                  <div className="flex min-h-[260px] items-center justify-center rounded-2xl border border-dashed border-white/10 text-center text-sm text-zinc-500">
                    Your generated content creative will appear here.
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}