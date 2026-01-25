"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { getProfile } from "@/lib/profile";
import { matchesExperience } from "@/lib/search";
import { ANIMATION, LAYOUT, SPACING, TEXT } from "@/lib/constants";
import SearchBar from "@/components/SearchBar";
import Timeline from "@/components/Timeline";
import Skills from "@/components/Skills";
import Keywords from "@/components/Keywords";
import ExperienceCard from "@/components/ExperienceCard";

export default function Home() {
  const profile = useMemo(() => getProfile(), []);
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [focusKey, setFocusKey] = useState<string>(""); // changes to trigger open effect

  const cardsSectionRef = useRef<HTMLDivElement | null>(null);
  const cardRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const filteredExperience = useMemo(() => {
    const sorted = [...profile.experience].sort((a, b) => (a.startDate < b.startDate ? 1 : -1));
    return sorted.filter((e) => matchesExperience(e, query));
  }, [profile.experience, query]);

  // If search filter removes the selected item, clear selection
  useEffect(() => {
    if (selectedId && !filteredExperience.some((e) => e.id === selectedId)) {
      setSelectedId(null);
    }
  }, [filteredExperience, selectedId]);

  const onSelectFromTimeline = (id: string) => {
    setSelectedId(id);
    setFocusKey(String(Date.now())); // bump to force open in ExperienceCard

    // First scroll to the cards section
    cardsSectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });

    // Then scroll/focus the specific card after a short delay
    window.setTimeout(() => {
      const el = cardRefs.current[id];
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "center" });
        // focus the inner card div (ExperienceCard has tabIndex=-1)
        const focusable = el.querySelector<HTMLElement>("[tabindex='-1']");
        focusable?.focus();
      }
    }, ANIMATION.CARD_SCROLL_DELAY_MS);
  };

  const onSelectCard = (id: string) => {
    setSelectedId(id);
    setFocusKey(String(Date.now())); // bump to force open in ExperienceCard
  };

  return (
    <main className={`mx-auto ${LAYOUT.MAX_WIDTH} ${LAYOUT.PAGE_PADDING_X} ${LAYOUT.PAGE_PADDING_Y}`}>
      <header className={SPACING.sm.spaceY}>
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">{profile.name}</h1>
          <div className="text-sm text-gray-600 dark:text-gray-400">{profile.headline}</div>
        </div>

        {profile.links?.length ? (
          <div className={`flex flex-wrap ${SPACING.sm.gap} text-sm`}>
            {profile.links.map((l) => (
              <a
                key={l.href}
                href={l.href}
                target={l.target}
                rel={l.rel}
                className="underline decoration-gray-300 underline-offset-4 hover:decoration-gray-500 dark:decoration-gray-600 dark:hover:decoration-gray-400"
              >
                {l.label}
              </a>
            ))}
          </div>
        ) : null}

        {profile.summary?.length ? (
          <div className={`${SPACING.xs.spaceY} text-sm text-gray-700 dark:text-gray-300`}>
            {profile.summary.map((s, i) => (
              <p key={i}>{s}</p>
            ))}
          </div>
        ) : null}

        <div className={SPACING.xs.pt}>
          <SearchBar query={query} onChange={setQuery} />
        </div>
      </header>

      <section className={`${SPACING["2xl"].mt} grid ${SPACING["2xl"].gap} md:grid-cols-[1.6fr_1fr]`}>
        <div className={SPACING.lg.spaceY}>
          {/* Timeline picker */}
          {filteredExperience.length ? (
            <Timeline items={filteredExperience} selectedId={selectedId} onSelect={onSelectFromTimeline} />
          ) : (
            <div className="rounded-md border border-gray-200 bg-white p-4 text-sm text-gray-700 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300">
              {TEXT.NO_MATCHES}
            </div>
          )}

          {/* Cards live below timeline */}
          <div ref={cardsSectionRef} className={SPACING.md.spaceY}>
            <div className="text-sm font-semibold text-gray-900 dark:text-gray-100">{TEXT.EXPERIENCE_TITLE}</div>

            {filteredExperience.map((item, idx) => (
              <div
                key={item.id}
                ref={(el) => {
                  cardRefs.current[item.id] = el;
                }}
              >
                <ExperienceCard
                  item={item}
                  query={query}
                  defaultOpen={idx === 0 && !selectedId}
                  forceOpen={selectedId === item.id}
                  focusKey={focusKey}
                  selected={selectedId === item.id}
                  onSelect={() => onSelectCard(item.id)}
                />
              </div>
            ))}
          </div>
        </div>

        <aside className={SPACING.xl.spaceY}>
          <Skills groups={profile.skills} />
          <Keywords keywords={profile.keywords} query={query} onPick={(kw) => setQuery(kw)} />
        </aside>
      </section>
    </main>
  );
}

