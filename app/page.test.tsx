import { describe, it, expect, vi, beforeAll, beforeEach } from "vitest";
import { render, screen, fireEvent, within, cleanup } from "@testing-library/react";
import type { Profile } from "@/lib/profile";
import { TEXT } from "@/lib/constants";

const baseFixture: Profile = {
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
  keywords: ["typescript", "react"],
};

vi.mock("@/lib/profile", async () => {
  return {
    getProfile: () => baseFixture,
  };
});

import Page from "@/app/page";

beforeAll(() => {
  // happy-dom doesn't implement scrollIntoView
  Element.prototype.scrollIntoView = vi.fn();
});

beforeEach(() => {
  cleanup();
});

describe("Home page", () => {
  it("does not auto-expand any experience card on initial render", () => {
    render(<Page />);
    const expanded = screen.queryAllByRole("button", { expanded: true });
    expect(expanded).toHaveLength(0);
  });

  it("renders the first summary paragraph", () => {
    render(<Page />);
    expect(screen.getByText("A brief summary.")).toBeTruthy();
  });

  it("clicking a timeline bar selects and opens the corresponding card", () => {
    vi.useFakeTimers();
    try {
      render(<Page />);
      const tlButton = screen.getByLabelText("Select Older Role at Older Co");
      fireEvent.click(tlButton);
      vi.runAllTimers();

      const expanded = screen.getAllByRole("button", { expanded: true });
      expect(expanded.length).toBeGreaterThan(0);
      const matched = expanded.find((b) => b.textContent?.includes("Older Role"));
      expect(matched).toBeTruthy();
    } finally {
      vi.useRealTimers();
    }
  });

  it("clicking a card header on a non-selected card selects and opens it", () => {
    render(<Page />);
    // Find the header button for "Older Role" card (it has aria-expanded=false)
    const headers = screen.getAllByRole("button", { expanded: false });
    const olderHeader = headers.find((h) => h.textContent?.includes("Older Role"));
    expect(olderHeader).toBeTruthy();
    fireEvent.click(olderHeader!);

    const expanded = screen.getAllByRole("button", { expanded: true });
    const matched = expanded.find((b) => b.textContent?.includes("Older Role"));
    expect(matched).toBeTruthy();
  });

  it("clicking a different timeline bar swaps selection", () => {
    render(<Page />);
    fireEvent.click(screen.getByLabelText("Select Older Role at Older Co"));
    fireEvent.click(screen.getByLabelText("Select Most Recent Role at Recent Co"));

    const expanded = screen.getAllByRole("button", { expanded: true });
    expect(expanded.length).toBe(1);
    expect(expanded[0].textContent).toContain("Most Recent Role");
    expect(expanded[0].textContent).not.toContain("Older Role");
  });

  it("typing in the search bar filters the experience list", () => {
    render(<Page />);
    const input = screen.getByPlaceholderText(TEXT.SEARCH_PLACEHOLDER) as HTMLInputElement;
    fireEvent.change(input, { target: { value: "React" } });

    expect(screen.queryAllByText("Older Role").length).toBeGreaterThan(0);
    expect(screen.queryByText("Most Recent Role")).toBeNull();
  });

  it("shows NO_MATCHES empty state when nothing matches", () => {
    render(<Page />);
    const input = screen.getByPlaceholderText(TEXT.SEARCH_PLACEHOLDER) as HTMLInputElement;
    fireEvent.change(input, { target: { value: "zzzzz-nonsense-xxxx" } });
    expect(screen.getByText(TEXT.NO_MATCHES)).toBeTruthy();
  });

  it("clears selection when filter removes the selected item", () => {
    render(<Page />);
    fireEvent.click(screen.getByLabelText("Select Older Role at Older Co"));
    // confirm opened
    expect(screen.getAllByRole("button", { expanded: true }).length).toBe(1);

    const input = screen.getByPlaceholderText(TEXT.SEARCH_PLACEHOLDER) as HTMLInputElement;
    fireEvent.change(input, { target: { value: "TypeScript" } });

    // Older Co filtered out
    expect(screen.queryAllByText("Older Role").length).toBe(0);
    expect(screen.queryAllByRole("button", { expanded: true }).length).toBe(0);
  });

  it("clicking a keyword chip sets the search query", () => {
    render(<Page />);
    // keyword chips have role=button (from Badge when onClick present)
    const chips = screen.getAllByRole("button").filter((b) => b.textContent?.trim() === "react");
    expect(chips.length).toBeGreaterThan(0);
    fireEvent.click(chips[0]);

    const input = screen.getByPlaceholderText(TEXT.SEARCH_PLACEHOLDER) as HTMLInputElement;
    expect(input.value).toBe("react");
  });
});

describe("Home page with links and certifications", () => {
  beforeEach(() => {
    vi.resetModules();
    cleanup();
  });

  it("renders profile links with href", async () => {
    vi.doMock("@/lib/profile", () => ({
      getProfile: (): Profile => ({
        ...baseFixture,
        links: [
          { label: "GitHub", href: "https://github.com/test", target: "_blank", rel: "noopener" },
        ],
      }),
    }));
    const { default: LinkedPage } = await import("@/app/page");
    render(<LinkedPage />);
    const anchor = screen.getByRole("link", { name: "GitHub" }) as HTMLAnchorElement;
    expect(anchor.getAttribute("href")).toBe("https://github.com/test");
    expect(anchor.getAttribute("target")).toBe("_blank");
    vi.doUnmock("@/lib/profile");
  });

  it("renders fine when summary, links, and certifications are all absent", async () => {
    vi.doMock("@/lib/profile", () => ({
      getProfile: (): Profile => ({
        name: "Minimal",
        headline: "Minimal headline",
        experience: baseFixture.experience,
        skills: baseFixture.skills,
        keywords: baseFixture.keywords,
      }),
    }));
    const { default: MinimalPage } = await import("@/app/page");
    render(<MinimalPage />);
    expect(screen.getByText("Minimal")).toBeTruthy();
    expect(screen.queryByText("A brief summary.")).toBeNull();
    expect(screen.queryByText(TEXT.CERTIFICATIONS_TITLE)).toBeNull();
    vi.doUnmock("@/lib/profile");
  });

  it("renders certifications section when matching certs exist", async () => {
    vi.doMock("@/lib/profile", () => ({
      getProfile: (): Profile => ({
        ...baseFixture,
        certifications: [
          {
            name: "AWS Certified Solutions Architect",
            issuer: "Amazon",
            date: "2022-06",
          },
        ],
      }),
    }));
    const { default: CertPage } = await import("@/app/page");
    render(<CertPage />);
    expect(screen.getByText(TEXT.CERTIFICATIONS_TITLE)).toBeTruthy();
    expect(screen.getByText("AWS Certified Solutions Architect")).toBeTruthy();
    vi.doUnmock("@/lib/profile");
  });
});
