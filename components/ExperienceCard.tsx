"use client";

import { useEffect, useMemo, useState } from "react";
import type { ExperienceItem } from "@/lib/profile";
import { formatDateRange, highlightParts } from "@/lib/search";
import { Badge } from "@/components/Badge";
import { SELECTION, SPACING, ANIMATION } from "@/lib/constants";

type Props = {
  item: ExperienceItem;
  query: string;
  defaultOpen?: boolean;
  forceOpen?: boolean;
  focusKey?: string;
  selected?: boolean;
  onSelect?: () => void;
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
  selected,
  onSelect
}: Props) {
  const [open, setOpen] = useState(!!defaultOpen);

  // Open when forceOpen becomes true
  useEffect(() => {
    if (forceOpen) setOpen(true);
  }, [forceOpen, focusKey]);

  // Close when card becomes unselected
  useEffect(() => {
    if (!selected && open) {
      setOpen(false);
    }
  }, [selected, open]);

  const cardClass = selected
    ? `${SELECTION.CARD_BORDER_SELECTED} ${SELECTION.CARD_SHADOW_SELECTED} ${SELECTION.CARD_RING_SELECTED} transform-gpu scale-[${ANIMATION.CARD_SELECTED_SCALE}]`
    : `${SELECTION.CARD_BORDER_DEFAULT} ${SELECTION.CARD_SHADOW_DEFAULT}`;

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
        onClick={() => {
          // If card is not selected, select it and open it
          if (!selected) {
            onSelect?.();
          } else {
            // If already selected, just toggle open/close
            setOpen((v) => !v);
          }
        }}
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

          <div className={`${SPACING.xs.mt} text-xs text-gray-500`}>
            {formatDateRange(item.startDate, item.endDate)}
            {item.location ? <> • <Highlighted text={item.location} query={query} /></> : null}
          </div>

          {item.summary ? (
            <div className={`${SPACING.xs.mt} text-sm text-gray-700`}>
              <Highlighted text={item.summary} query={query} />
            </div>
          ) : null}
        </div>

        <div className={`shrink-0 text-sm ${selected ? "text-blue-700" : "text-gray-500"}`}>
          {open ? "−" : "+"}
        </div>
      </button>

      {open ? (
        <div className={`${SPACING.sm.mt} ${SPACING.sm.spaceY}`}>
          <ul className={`list-disc ${SPACING.xs.spaceY} pl-5 text-sm text-gray-700`}>
            {item.bullets.map((b, i) => (
              <li key={i}>
                <Highlighted text={b} query={query} />
              </li>
            ))}
          </ul>

          {item.skillsUsed?.length ? (
            <div className={`flex flex-wrap ${SPACING.xs.gap}`}>
              {item.skillsUsed.map((s) => (
                <Badge key={s} variant={selected ? "selected" : "default"}>
                  <Highlighted text={s} query={query} />
                </Badge>
              ))}
            </div>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}

