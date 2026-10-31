import { describe, it, expect } from "vitest";
import { getProjects } from "@/lib/projects";

describe("getProjects", () => {
  it("returns a non-empty projects array", () => {
    const data = getProjects();
    expect(Array.isArray(data.projects)).toBe(true);
    expect(data.projects.length).toBeGreaterThan(0);
  });

  it("each project has the required fields", () => {
    for (const p of getProjects().projects) {
      expect(p.id).toBeTruthy();
      expect(p.name).toBeTruthy();
      expect(p.tagline).toBeTruthy();
      expect(Array.isArray(p.tech)).toBe(true);
      expect(typeof p.featured).toBe("boolean");
    }
  });

  it("featured projects have media defined", () => {
    const featured = getProjects().projects.filter((p) => p.featured);
    expect(featured.length).toBe(4);
    for (const p of featured) {
      expect(p.media).toBeDefined();
    }
  });

  it("featured set is exactly drovr, local-wiki, addressable, terraform-modules", () => {
    const ids = getProjects().projects.filter((p) => p.featured).map((p) => p.id).sort();
    expect(ids).toEqual(["addressable", "drovr", "local-wiki", "terraform-modules"]);
  });

  it("drovr is the first featured project", () => {
    const featured = getProjects().projects.filter((p) => p.featured);
    expect(featured[0].id).toBe("drovr");
  });

  it("private repos do not expose a repo url", () => {
    for (const p of getProjects().projects) {
      if (p.repoPrivate) {
        expect(p.repo).toBeUndefined();
      }
    }
  });
});
