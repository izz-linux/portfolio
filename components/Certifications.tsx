"use client";

import type { Certification } from "@/lib/profile";
import { highlightParts } from "@/lib/search";
import { SPACING, TEXT } from "@/lib/constants";

type Props = {
  certifications: Certification[];
  query?: string;
};

function Highlight({ text, query }: { text: string; query?: string }) {
  const parts = highlightParts(text, query ?? "");
  return (
    <>
      {parts.map((p, i) =>
        p.hit ? (
          <mark key={i} className="bg-yellow-200 dark:bg-yellow-900">
            {p.text}
          </mark>
        ) : (
          <span key={i}>{p.text}</span>
        )
      )}
    </>
  );
}

function formatDate(ym: string): string {
  const [y, m] = ym.split("-").map(Number);
  const date = new Date(y, (m ?? 1) - 1, 1);
  return date.toLocaleString(undefined, { month: "short", year: "numeric" });
}

export default function Certifications({ certifications, query }: Props) {
  if (!certifications.length) return null;

  return (
    <div className={SPACING.md.spaceY}>
      <h2 className="text-sm font-semibold text-gray-900 dark:text-gray-100">
        {TEXT.CERTIFICATIONS_TITLE}
      </h2>
      <div className={SPACING.sm.spaceY}>
        {certifications.map((cert) => (
          <div
            key={cert.name}
            className="rounded-md border border-gray-200 bg-white p-3 dark:border-gray-700 dark:bg-gray-900"
          >
            <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
              {cert.credentialUrl ? (
                <a
                  href={cert.credentialUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline decoration-gray-300 underline-offset-4 hover:decoration-gray-500 dark:decoration-gray-600 dark:hover:decoration-gray-400"
                >
                  <Highlight text={cert.name} query={query} />
                </a>
              ) : (
                <Highlight text={cert.name} query={query} />
              )}
            </div>
            <div className="text-xs text-gray-600 dark:text-gray-400">
              <Highlight text={cert.issuer} query={query} />
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-500">
              {formatDate(cert.date)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
