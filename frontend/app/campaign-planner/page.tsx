"use client";

import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import OutputBox from "@/components/OutputBox";
import ProfileSelector from "@/components/ProfileSelector";
import ChatbotBox from "@/components/ChatbotBox";
import { postJson } from "@/lib/api";
import { useState } from "react";

export default function CampaignPlannerPage() {
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
    "Generate a professional campaign creative concept for a solar installation company in West Bengal with premium design, trust-building visuals, and strong local lead-generation appeal."
  );
  const [imageUrl, setImageUrl] = useState("");
  const [imageLoading, setImageLoading] = useState(false);
  const [imageError, setImageError] = useState("");

  async function generate() {
    try {
      setLoading(true);
      const data = await postJson<{ result: string }>("/api/planner/generate", form);
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
            page: "campaign-planner",
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
      `Generate a campaign creative concept for ${form.business_name}, a ${form.niche} business in ${form.city}. Highlight services: ${form.services}. Target audience: ${form.target_audience}. Main offer: ${form.main_offer}. Unique selling point: ${form.usp}. Make it suitable for Facebook and Instagram lead generation with a clean premium modern design.`
    );
  }

  return (
    <main>
      <Navbar />
      <div className="mx-auto grid max-w-7xl gap-6 px-6 py-8 lg:grid-cols-[280px_1fr]">
        <Sidebar />

        <section className="space-y-6">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
            <h2 className="text-2xl font-bold text-white">Campaign Planner</h2>
            <p className="mt-2 text-zinc-400">
              Build campaign plans, refine them with AI, and create matching visual concepts.
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
                {loading ? "Generating..." : "Generate Campaign Plan"}
              </button>

              <button
                onClick={() => setOutput("")}
                className="rounded-xl border border-white/10 bg-white/5 px-5 py-3 font-medium text-white hover:border-cyan-400"
              >
                Clear Output
              </button>
            </div>

            <div className="mt-6">
              <OutputBox title="Campaign Plan" content={output} />
            </div>
          </div>

          <ChatbotBox
            title="Campaign Strategy AI Assistant"
            subtitle="ChatGPT-style campaign strategist that improves targeting, offers, funnels, budget ideas, and local lead-generation angles."
            endpoint="/api/competitor/chat"
            businessType={form.niche}
            location={form.city}
            websiteUrl=""
            placeholder="Ask for audience targeting, funnel ideas, budget split, retargeting strategy, local campaign angles, or better offers..."
            quickPrompts={[
              "Improve this campaign for local lead generation.",
              "Suggest the best audience targeting for my business.",
              "Create a Facebook and Google campaign split.",
              "Research better local campaign angles for my niche.",
            ]}
            initialMessage={`Hi, I’m Market Mind AI. I can help plan campaigns for ${form.business_name}, improve targeting, and suggest better local growth strategies.`}
          />

          <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
            <div className="flex flex-col gap-2">
              <h3 className="text-2xl font-bold text-white">
                Campaign Visual Generator
              </h3>
              <p className="text-sm text-zinc-400">
                Generate a matching campaign visual concept so the planner feels like a complete digital marketing AI.
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
                    `Generate a Facebook lead generation campaign visual for ${form.business_name} in ${form.city} promoting ${form.main_offer} with strong trust-building design and premium layout.`
                  )
                }
                className="rounded-full border border-white/10 bg-black/30 px-4 py-2 text-sm text-zinc-200 hover:border-cyan-400"
              >
                Facebook campaign visual
              </button>

              <button
                onClick={() =>
                  setImagePrompt(
                    `Generate an Instagram campaign creative for ${form.business_name}, a ${form.niche} business in ${form.city}. Highlight ${form.services} for ${form.target_audience} with a premium modern marketing style.`
                  )
                }
                className="rounded-full border border-white/10 bg-black/30 px-4 py-2 text-sm text-zinc-200 hover:border-cyan-400"
              >
                Instagram campaign visual
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
                  placeholder="Describe the campaign visual you want to generate..."
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
                  Generated Visual
                </h4>

                {imageUrl ? (
                  <div className="space-y-3">
                    <img
                      src={imageUrl}
                      alt="Generated campaign creative"
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
                    Your generated campaign visual will appear here.
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