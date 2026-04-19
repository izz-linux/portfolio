import { describe, it, expect } from "vitest";
import { render, screen, within } from "@testing-library/react";
import Skills from "@/components/Skills";
import type { SkillGroup } from "@/lib/profile";

const groups: SkillGroup[] = [
  { group: "Languages", items: ["TypeScript", "Python", "Go"] },
  { group: "Cloud", items: ["AWS", "GCP", "Terraform"] },
  { group: "Frontend", items: ["React", "Next.js"] },
];

describe("Skills", () => {
  it("renders all groups and items when no query", () => {
    const { container } = render(<Skills groups={groups} />);
    expect(container.firstChild).not.toBeNull();
    // Some heading exists
    const headings = container.querySelectorAll("h1,h2,h3,h4,h5,h6");
    expect(headings.length).toBeGreaterThanOrEqual(1);
    // Each group name appears
    expect(container.textContent).toContain("Languages");
    expect(container.textContent).toContain("Cloud");
    expect(container.textContent).toContain("Frontend");
    // Each item appears
    for (const g of groups) {
      for (const item of g.items) {
        expect(container.textContent).toContain(item);
      }
    }
  });

  it("renders all groups and items when query is whitespace-only", () => {
    const { container } = render(<Skills groups={groups} query="   " />);
    expect(container.firstChild).not.toBeNull();
    for (const g of groups) {
      expect(container.textContent).toContain(g.group);
      for (const item of g.items) {
        expect(container.textContent).toContain(item);
      }
    }
    // No mark elements when query empty
    expect(container.querySelectorAll("mark").length).toBe(0);
  });

  it("renders nothing when groups is empty", () => {
    const { container } = render(<Skills groups={[]} />);
    expect(container.firstChild).toBeNull();
  });

  it("filters to a single matching item; sibling items in same group and other groups are hidden", () => {
    const { container } = render(
      <Skills groups={groups} query="python" />
    );
    expect(container.firstChild).not.toBeNull();
    expect(container.textContent).toContain("Python");
    // sibling items in same group
    expect(container.textContent).not.toContain("TypeScript");
    expect(container.textContent).not.toContain("Go");
    // other groups
    expect(container.textContent).not.toContain("Cloud");
    expect(container.textContent).not.toContain("AWS");
    expect(container.textContent).not.toContain("Frontend");
    expect(container.textContent).not.toContain("React");
  });

  it("query matching a group name keeps all items in that group, drops other groups", () => {
    const { container } = render(
      <Skills groups={groups} query="cloud" />
    );
    expect(container.firstChild).not.toBeNull();
    expect(container.textContent).toContain("Cloud");
    expect(container.textContent).toContain("AWS");
    expect(container.textContent).toContain("GCP");
    expect(container.textContent).toContain("Terraform");
    // Other groups gone
    expect(container.textContent).not.toContain("Languages");
    expect(container.textContent).not.toContain("TypeScript");
    expect(container.textContent).not.toContain("Frontend");
    expect(container.textContent).not.toContain("React");
  });

  it("filtering is case-insensitive", () => {
    const { container } = render(
      <Skills groups={groups} query="TYPESCRIPT" />
    );
    expect(container.firstChild).not.toBeNull();
    expect(container.textContent).toContain("TypeScript");
    expect(container.textContent).not.toContain("Python");
    expect(container.textContent).not.toContain("AWS");
  });

  it("renders nothing when query matches no group or item", () => {
    const { container } = render(
      <Skills groups={groups} query="zzznomatch" />
    );
    expect(container.firstChild).toBeNull();
  });

  it("wraps matched substrings inside item labels with <mark>", () => {
    const { container } = render(
      <Skills groups={groups} query="script" />
    );
    const marks = container.querySelectorAll("mark");
    expect(marks.length).toBeGreaterThanOrEqual(1);
    // At least one mark is inside a rendered item (TypeScript or Next.js... "script" only matches TypeScript)
    const markTexts = Array.from(marks).map((m) => m.textContent);
    expect(markTexts.some((t) => t && /script/i.test(t))).toBe(true);
  });

  it("wraps matched substrings inside group names with <mark> when the group matches", () => {
    const { container } = render(
      <Skills groups={groups} query="cloud" />
    );
    const marks = container.querySelectorAll("mark");
    expect(marks.length).toBeGreaterThanOrEqual(1);
    // The Cloud heading should contain a <mark> with "Cloud"
    const cloudMark = Array.from(marks).find(
      (m) => m.textContent?.toLowerCase() === "cloud"
    );
    expect(cloudMark).toBeTruthy();
  });

  it("preserves original casing of matched substring inside <mark>", () => {
    const { container } = render(
      <Skills groups={groups} query="type" />
    );
    const marks = container.querySelectorAll("mark");
    const texts = Array.from(marks).map((m) => m.textContent);
    // Original casing: "Type" (from "TypeScript"), not "type"
    expect(texts).toContain("Type");
  });
});
