"use client";

import { useEffect, useMemo, useState } from "react";
import type { ExperienceItem } from "@/lib/profile";
import { formatDateRange, highlightParts } from "@/lib/search";

type Props = {
  item: ExperienceItem;
  query: string;
  defaultOpen?: boolean;
  forceOpen?: boolean;
  focusKey?: string;
  selected?: boolean;
};

function Highlighted({ text, query }: { text: string; query: string }) {
  const parts = useMemo(() => highlightParts(text, query), [text, query]);
  return (
    <>
      {parts.map((p, i) =>
        p.hit ? (
          <mark key={i} className="rounded bg-yellow-200 px-1">
            {p.text}
          </mark>
        ) : (
          <span key={i}>{p.text}</span>
        )
      )}
    </>
  );
}

export default function ExperienceCard({
  item,
  query,
  defaultOpen,
  forceOpen,
  focusKey,
  selected
}: Props) {
  const [open, setOpen] = useState(!!defaultOpen);

  useEffect(() => {
    if (forceOpen) setOpen(true);
  }, [forceOpen, focusKey]);

  const cardClass = selected
    ? "border-blue-300 shadow-lg ring-2 ring-blue-200 transform-gpu scale-[1.01]"
    : "border-gray-200 shadow-sm";

  return (
    <div
      className={`relative rounded-lg border bg-white p-4 transition-all duration-200 ${cardClass}`}
      tabIndex={-1}
    >
      {/* left accent */}
      <div
        className={`absolute left-0 top-0 h-full w-1 rounded-l-lg ${
          selected ? "bg-blue-600" : "bg-transparent"
        }`}
      />

      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-start justify-between gap-4 text-left"
        aria-expanded={open}
      >
        <div className="min-w-0">
          <div className="text-sm text-gray-600">
            <span className="font-medium text-gray-900">
              <Highlighted text={item.title} query={query} />
            </span>{" "}
            <span className="text-gray-500">@</span>{" "}
            <span className="font-medium">
              <Highlighted text={item.company} query={query} />
            </span>
          </div>

          <div className="mt-1 text-xs text-gray-500">
            {formatDateRange(item.startDate, item.endDate)}
            {item.location ? <> • <Highlighted text={item.location} query={query} /></> : null}
          </div>

          {item.summary ? (
            <div className="mt-2 text-sm text-gray-700">
              <Highlighted text={item.summary} query={query} />
            </div>
          ) : null}
        </div>

        <div className={`shrink-0 text-sm ${selected ? "text-blue-700" : "text-gray-500"}`}>
          {open ? "−" : "+"}
        </div>
      </button>

      {open ? (
        <div className="mt-3 space-y-3">
          <ul className="list-disc space-y-2 pl-5 text-sm text-gray-700">
            {item.bullets.map((b, i) => (
              <li key={i}>
                <Highlighted text={b} query={query} />
              </li>
            ))}
          </ul>

          {item.skillsUsed?.length ? (
            <div className="flex flex-wrap gap-2">
              {item.skillsUsed.map((s) => (
                <span
                  key={s}
                  className={`rounded-full border px-2 py-1 text-xs ${
                    selected
                      ? "border-blue-200 bg-blue-50 text-blue-900"
                      : "border-gray-200 bg-gray-50 text-gray-700"
                  }`}
                >
                  <Highlighted text={s} query={query} />
                </span>
              ))}
            </div>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}

