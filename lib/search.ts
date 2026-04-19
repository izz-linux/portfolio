import type { Certification, ExperienceItem } from "./profile";

export function normalize(s: string): string {
  return s.toLowerCase().trim();
}

export function formatDateRange(start: string, end: string | null): string {
  const fmt = (ym: string) => {
    const [y, m] = ym.split("-").map(Number);
    // Use `||` (not `??`) so NaN from malformed input (e.g. "2024-", "2024-abc") also falls back to January.
    const date = new Date(y, (m || 1) - 1, 1);
    return date.toLocaleString("en-US", { month: "short", year: "numeric" });
  };
  return `${fmt(start)} — ${end ? fmt(end) : "Present"}`;
}

export function matchesExperience(e: ExperienceItem, qRaw: string): boolean {
  const q = normalize(qRaw);
  if (!q) return true;

  const hay = [
    e.company,
    e.title,
    e.location ?? "",
    e.summary ?? "",
    ...(e.bullets ?? []),
    ...((e.skillsUsed ?? []).map((s) => s) ?? [])
  ]
    .join(" ")
    .toLowerCase();

  return hay.includes(q);
}

export function matchesCertification(c: Certification, qRaw: string): boolean {
  const q = normalize(qRaw);
  if (!q) return true;

  const hay = [c.name, c.issuer, c.credentialId ?? ""].join(" ").toLowerCase();

  return hay.includes(q);
}

// Simple, safe highlighter (no dangerouslySetInnerHTML)
export function highlightParts(text: string, qRaw: string): Array<{ text: string; hit: boolean }> {
  const q = qRaw.trim();
  if (!q) return [{ text, hit: false }];

  // Escape regex chars
  const escaped = q.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const re = new RegExp(escaped, "ig");

  const parts: Array<{ text: string; hit: boolean }> = [];
  let last = 0;

  for (const m of text.matchAll(re)) {
    const idx = m.index ?? 0;
    if (idx > last) parts.push({ text: text.slice(last, idx), hit: false });
    parts.push({ text: text.slice(idx, idx + m[0].length), hit: true });
    last = idx + m[0].length;
  }

  if (last < text.length) parts.push({ text: text.slice(last), hit: false });
  return parts.length ? parts : [{ text, hit: false }];
}

