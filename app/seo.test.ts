import { describe, it, expect } from "vitest";
import robots from "@/app/robots";
import ProjectsLayout, { metadata as projects } from "@/app/projects/layout";
import { getProfile } from "@/lib/profile";
import { getProjects } from "@/lib/projects";

describe("SEO signals", () => {
  it("robots points at this site's own sitemap", () => {
    expect(robots().sitemap).toBe("https://portfolio.izznoland.dev/sitemap.xml");
  });

  it("projects has its own title and canonical", () => {
    expect(projects.title).toMatch(/projects/i);
    expect(projects.alternates?.canonical).toBe("/projects");
  });

  it("projects layout passes its children through", () => {
    expect(ProjectsLayout({ children: "content" })).toBe("content");
  });

  it("header links do not include the personal site", () => {
    expect(getProfile().links?.map((l) => l.href)).not.toContain("https://izznoland.dev");
  });

  it("drovr has descriptive link text", () => {
    const drovr = getProjects().projects.find((p) => p.id === "drovr");
    expect(drovr?.repoLabel).toMatch(/drovr multi-agent/i);
  });
});
