import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import type { Profile } from "@/lib/profile";

vi.mock("@/lib/profile", async () => {
  const fixture: Profile = {
    name: "Test User",
    headline: "Test Headline",
    links: [],
    summary: ["A brief summary."],
    experience: [
      {
        id: "recent",
        company: "Recent Co",
        title: "Most Recent Role",
        startDate: "2023-01",
        endDate: null,
        bullets: ["Did a thing", "Did another thing"],
        location: "Remote",
        summary: "Recent summary",
        skillsUsed: ["TypeScript"],
      },
      {
        id: "older",
        company: "Older Co",
        title: "Older Role",
        startDate: "2020-01",
        endDate: "2022-12",
        bullets: ["Built stuff"],
        location: "Remote",
        summary: "Older summary",
        skillsUsed: ["React"],
      },
    ],
    skills: [{ group: "Languages", items: ["TypeScript"] }],
    certifications: [],
    keywords: ["typescript"],
  };
  return {
    getProfile: () => fixture,
  };
});

import Page from "@/app/page";

describe("Home page", () => {
  it("does not auto-expand any experience card on initial render", () => {
    render(<Page />);
    const expanded = screen.queryAllByRole("button", { expanded: true });
    expect(expanded).toHaveLength(0);
  });
});
