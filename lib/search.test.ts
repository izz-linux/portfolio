import { describe, it, expect } from "vitest";
import type { ExperienceItem, Certification } from "@/lib/profile";
import {
  normalize,
  formatDateRange,
  matchesExperience,
  matchesCertification,
  highlightParts,
} from "@/lib/search";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function makeExperience(overrides: Partial<ExperienceItem> = {}): ExperienceItem {
  return {
    id: "test-job",
    company: "Acme Corp",
    title: "Software Engineer",
    startDate: "2022-01",
    endDate: "2024-06",
    bullets: ["Built a thing", "Fixed another thing"],
    ...overrides,
  };
}

function makeCertification(overrides: Partial<Certification> = {}): Certification {
  return {
    name: "AWS Certified Developer",
    issuer: "Amazon Web Services",
    date: "2023-05",
    ...overrides,
  };
}

// ---------------------------------------------------------------------------
// normalize
// ---------------------------------------------------------------------------

describe("normalize", () => {
  it("lowercases uppercase input", () => {
    expect(normalize("HELLO")).toBe("hello");
  });

  it("lowercases mixed-case input", () => {
    expect(normalize("TypeScript")).toBe("typescript");
  });

  it("trims leading whitespace", () => {
    expect(normalize("   hello")).toBe("hello");
  });

  it("trims trailing whitespace", () => {
    expect(normalize("hello   ")).toBe("hello");
  });

  it("trims both sides and lowercases simultaneously", () => {
    expect(normalize("  Hello World  ")).toBe("hello world");
  });

  it("returns empty string unchanged", () => {
    expect(normalize("")).toBe("");
  });

  it("returns whitespace-only input as empty string after trim", () => {
    expect(normalize("   ")).toBe("");
  });
});

// ---------------------------------------------------------------------------
// formatDateRange
// ---------------------------------------------------------------------------

describe("formatDateRange", () => {
  it("formats a range with both start and end", () => {
    const result = formatDateRange("2024-03", "2025-12");
    expect(result).toBe("Mar 2024 — Dec 2025");
  });

  it("uses Present when end is null", () => {
    const result = formatDateRange("2022-06", null);
    expect(result).toBe("Jun 2022 — Present");
  });

  it("handles January (month 01)", () => {
    const result = formatDateRange("2020-01", "2021-01");
    expect(result).toMatch(/Jan 2020/);
    expect(result).toMatch(/Jan 2021/);
  });

  it("handles December (month 12)", () => {
    const result = formatDateRange("2023-12", null);
    expect(result).toMatch(/Dec 2023/);
    expect(result).toContain("Present");
  });

  it("falls back to January when month part is missing (bare year)", () => {
    const result = formatDateRange("2024", null);
    expect(result).toMatch(/Jan 2024/);
    expect(result).toContain("Present");
  });

  it("falls back to January when month part is empty (trailing dash)", () => {
    const result = formatDateRange("2024-", null);
    expect(result).toMatch(/Jan 2024/);
    expect(result).toContain("Present");
  });

  it("falls back to January for end date when month is NaN", () => {
    const result = formatDateRange("2023-06", "2024-");
    expect(result).toMatch(/Jun 2023/);
    expect(result).toMatch(/Jan 2024/);
  });

  it("falls back to January when month part is non-numeric (malformed)", () => {
    const result = formatDateRange("2024-abc", null);
    expect(result).toMatch(/Jan 2024/);
    expect(result).toContain("Present");
  });
});

// ---------------------------------------------------------------------------
// matchesExperience
// ---------------------------------------------------------------------------

describe("matchesExperience", () => {
  it("returns true for empty query (match-all)", () => {
    const e = makeExperience();
    expect(matchesExperience(e, "")).toBe(true);
  });

  it("returns true for whitespace-only query (match-all)", () => {
    const e = makeExperience();
    expect(matchesExperience(e, "   ")).toBe(true);
  });

  it("matches on company name (case-insensitive)", () => {
    const e = makeExperience({ company: "Initech" });
    expect(matchesExperience(e, "INITECH")).toBe(true);
  });

  it("matches on title (case-insensitive)", () => {
    const e = makeExperience({ title: "Senior Engineer" });
    expect(matchesExperience(e, "senior")).toBe(true);
  });

  it("matches on location when present", () => {
    const e = makeExperience({ location: "San Francisco, CA" });
    expect(matchesExperience(e, "francisco")).toBe(true);
  });

  it("does not crash when location is absent", () => {
    const e = makeExperience({ location: undefined });
    expect(matchesExperience(e, "francisco")).toBe(false);
  });

  it("matches on summary when present", () => {
    const e = makeExperience({ summary: "Led cross-functional teams" });
    expect(matchesExperience(e, "cross-functional")).toBe(true);
  });

  it("does not crash when summary is absent", () => {
    const e = makeExperience({ summary: undefined });
    expect(matchesExperience(e, "anything")).toBe(false);
  });

  it("matches on a bullet entry", () => {
    const e = makeExperience({ bullets: ["Deployed microservices on Kubernetes"] });
    expect(matchesExperience(e, "kubernetes")).toBe(true);
  });

  it("matches on skillsUsed when present", () => {
    const e = makeExperience({ skillsUsed: ["TypeScript", "React"] });
    expect(matchesExperience(e, "react")).toBe(true);
  });

  it("does not crash when skillsUsed is absent", () => {
    const e = makeExperience({ skillsUsed: undefined });
    expect(matchesExperience(e, "react")).toBe(false);
  });

  it("returns false when query matches none of the fields", () => {
    const e = makeExperience();
    expect(matchesExperience(e, "zzznomatch")).toBe(false);
  });

  it("matches partial substrings", () => {
    const e = makeExperience({ company: "Umbrella Corporation" });
    expect(matchesExperience(e, "brella")).toBe(true);
  });
});

// ---------------------------------------------------------------------------
// matchesCertification
// ---------------------------------------------------------------------------

describe("matchesCertification", () => {
  it("returns true for empty query (match-all)", () => {
    const c = makeCertification();
    expect(matchesCertification(c, "")).toBe(true);
  });

  it("returns true for whitespace-only query (match-all)", () => {
    const c = makeCertification();
    expect(matchesCertification(c, "   ")).toBe(true);
  });

  it("matches on cert name (case-insensitive)", () => {
    const c = makeCertification({ name: "AWS Certified Developer" });
    expect(matchesCertification(c, "aws certified")).toBe(true);
  });

  it("matches on issuer (case-insensitive)", () => {
    const c = makeCertification({ issuer: "Amazon Web Services" });
    expect(matchesCertification(c, "AMAZON")).toBe(true);
  });

  it("matches on credentialId when present", () => {
    const c = makeCertification({ credentialId: "ABC-12345" });
    expect(matchesCertification(c, "ABC-12345")).toBe(true);
  });

  it("does not crash when credentialId is absent", () => {
    const c = makeCertification({ credentialId: undefined });
    expect(matchesCertification(c, "ABC-12345")).toBe(false);
  });

  it("only searches name, issuer, and credentialId (not credentialUrl or date)", () => {
    const c = makeCertification({ date: "2023-05", credentialUrl: "https://example.com/cert/99" });
    // date and URL should not be matched
    expect(matchesCertification(c, "2023-05")).toBe(false);
    expect(matchesCertification(c, "https://example.com")).toBe(false);
  });

  it("returns false when query matches none of the cert fields", () => {
    const c = makeCertification();
    expect(matchesCertification(c, "zzznomatch")).toBe(false);
  });
});

// ---------------------------------------------------------------------------
// highlightParts
// ---------------------------------------------------------------------------

describe("highlightParts", () => {
  it("returns single non-hit segment for empty query", () => {
    const parts = highlightParts("Hello World", "");
    expect(parts).toEqual([{ text: "Hello World", hit: false }]);
  });

  it("returns single non-hit segment for whitespace-only query", () => {
    const parts = highlightParts("Hello World", "   ");
    expect(parts).toEqual([{ text: "Hello World", hit: false }]);
  });

  it("marks a match in the middle with surrounding non-hit segments", () => {
    const parts = highlightParts("Hello World", "World");
    expect(parts).toEqual([
      { text: "Hello ", hit: false },
      { text: "World", hit: true },
    ]);
  });

  it("marks a match at the very start of text", () => {
    const parts = highlightParts("TypeScript is cool", "TypeScript");
    expect(parts[0]).toEqual({ text: "TypeScript", hit: true });
  });

  it("marks a match at the very end of text", () => {
    const parts = highlightParts("I love TypeScript", "TypeScript");
    const last = parts[parts.length - 1];
    expect(last).toEqual({ text: "TypeScript", hit: true });
  });

  it("marks multiple non-adjacent matches", () => {
    const parts = highlightParts("Hello World", "o");
    const hits = parts.filter((p) => p.hit);
    expect(hits).toHaveLength(2);
    expect(hits[0].text).toBe("o");
    expect(hits[1].text).toBe("o");
  });

  it("concatenating all part texts reconstructs the original string", () => {
    const original = "The quick brown fox";
    const parts = highlightParts(original, "o");
    expect(parts.map((p) => p.text).join("")).toBe(original);
  });

  it("is case-insensitive in matching", () => {
    const parts = highlightParts("Hello World", "HELLO");
    const hit = parts.find((p) => p.hit);
    expect(hit).toBeDefined();
    expect(hit!.hit).toBe(true);
  });

  it("preserves original casing in matched segment", () => {
    const parts = highlightParts("Hello World", "hello");
    const hit = parts.find((p) => p.hit);
    // original casing must be preserved — "Hello" not "hello"
    expect(hit!.text).toBe("Hello");
  });

  it("treats regex metacharacters as literals — dot", () => {
    // "." should match only a literal dot, not every character
    const parts = highlightParts("foo.bar baz", ".");
    const hits = parts.filter((p) => p.hit);
    expect(hits).toHaveLength(1);
    expect(hits[0].text).toBe(".");
  });

  it("treats regex metacharacters as literals — asterisk", () => {
    const parts = highlightParts("a*b+c(d)", "*");
    const hits = parts.filter((p) => p.hit);
    expect(hits).toHaveLength(1);
    expect(hits[0].text).toBe("*");
  });

  it("treats regex metacharacters as literals — parentheses", () => {
    const parts = highlightParts("func(arg)", "(arg)");
    const hits = parts.filter((p) => p.hit);
    expect(hits).toHaveLength(1);
    expect(hits[0].text).toBe("(arg)");
  });

  it("treats regex metacharacters as literals — plus sign", () => {
    const parts = highlightParts("a+b", "+");
    const hits = parts.filter((p) => p.hit);
    expect(hits).toHaveLength(1);
    expect(hits[0].text).toBe("+");
  });

  it("treats regex metacharacters as literals — question mark", () => {
    const parts = highlightParts("a?b", "?");
    const hits = parts.filter((p) => p.hit);
    expect(hits).toHaveLength(1);
    expect(hits[0].text).toBe("?");
  });

  it("returns single non-hit segment for empty text with non-empty query", () => {
    const parts = highlightParts("", "foo");
    expect(parts).toEqual([{ text: "", hit: false }]);
  });

  it("returns no hits when query has no match in text", () => {
    const parts = highlightParts("Hello World", "zzz");
    expect(parts).toEqual([{ text: "Hello World", hit: false }]);
  });

  it("handles back-to-back matches correctly and preserves text reconstruction", () => {
    const original = "aaa";
    const parts = highlightParts(original, "a");
    expect(parts.map((p) => p.text).join("")).toBe(original);
    expect(parts.every((p) => p.hit)).toBe(true);
  });

  it("handles query that matches entire text", () => {
    const parts = highlightParts("exact", "exact");
    expect(parts).toEqual([{ text: "exact", hit: true }]);
  });
});
