"use client";

import { useEffect, useState } from "react";
import { getJson } from "@/lib/api";
import { getToken } from "@/lib/auth";

type Profile = {
  id: number;
  business_name: string;
  niche: string;
  city: string;
  services: string;
  target_audience: string;
  main_offer: string;
  whatsapp?: string;
  website?: string;
  usp: string;
};

type Props = {
  onSelect: (profile: Profile) => void;
};

export default function ProfileSelector({ onSelect }: Props) {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [selectedId, setSelectedId] = useState("");

  useEffect(() => {
    async function loadProfiles() {
      const token = getToken();
      if (!token) return;

      try {
        const data = await getJson<Profile[]>("/api/business-profile/all");
        setProfiles(data);
      } catch (error) {
        console.error("Failed to load profiles:", error);
      }
    }

    loadProfiles();
  }, []);

  function handleChange(value: string) {
    setSelectedId(value);
    const selected = profiles.find((p) => String(p.id) === value);
    if (selected) onSelect(selected);
  }

  return (
    <div className="mb-6">
      <label className="mb-2 block text-sm text-zinc-300">
        Load Saved Profile
      </label>
      <select
        value={selectedId}
        onChange={(e) => handleChange(e.target.value)}
        className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-white outline-none focus:border-cyan-400"
      >
        <option value="">Select a saved business profile</option>
        {profiles.map((profile) => (
          <option key={profile.id} value={profile.id}>
            {profile.business_name} - {profile.city}
          </option>
        ))}
      </select>
    </div>
  );
}