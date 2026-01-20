"use client";

import { useMemo, useState } from "react";
import { getProfile } from "@/lib/profile";
import { matchesExperience } from "@/lib/search";
import SearchBar from "@/components/SearchBar";
import Timeline from "@/components/Timeline";
import Skills from "@/components/Skills";
import Keywords from "@/components/Keywords";

export default function Home() {
  const profile = useMemo(() => getProfile(), []);
  const [query, setQuery] = useState("");

  const filteredExperience = useMemo(() => {
    // Sort newest first by startDate, then filter by query
    const sorted = [...profile.experience].sort((a, b) => (a.startDate < b.startDate ? 1 : -1));
    return sorted.filter((e) => matchesExperience(e, query));
  }, [profile.experience, query]);

  return (
    <main className="mx-auto max-w-5xl px-4 py-10">
      <header className="space-y-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{profile.name}</h1>
          <div className="text-sm text-gray-600">{profile.headline}</div>
        </div>

        {profile.links?.length ? (
          <div className="flex flex-wrap gap-3 text-sm">
            {profile.links.map((l) => (
              <a key={l.href} href={l.href} className="underline decoration-gray-300 underline-offset-4 hover:decoration-gray-500">
                {l.label}
              </a>
            ))}
          </div>
        ) : null}

        {profile.summary?.length ? (
          <div className="space-y-1 text-sm text-gray-700">
            {profile.summary.map((s, i) => (
              <p key={i}>{s}</p>
            ))}
          </div>
        ) : null}

        <div className="pt-2">
          <SearchBar query={query} onChange={setQuery} />
        </div>
      </header>

      <section className="mt-10 grid gap-10 md:grid-cols-[1.6fr_1fr]">
        <div className="space-y-4">
          <h2 className="text-sm font-semibold text-gray-900">Work Experience</h2>

          {filteredExperience.length ? (
            <Timeline items={filteredExperience} query={query} />
          ) : (
            <div className="rounded-md border border-gray-200 bg-white p-4 text-sm text-gray-700">
              No matches. Try a different search term.
            </div>
          )}
        </div>

        <aside className="space-y-8">
          <Skills groups={profile.skills} />
          <Keywords keywords={profile.keywords} query={query} onPick={(kw) => setQuery(kw)} />
        </aside>
      </section>
    </main>
  );
}

