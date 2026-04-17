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
    expect(featured.length).toBe(3);
    for (const p of featured) {
      expect(p.media).toBeDefined();
    }
  });

  it("featured set is exactly local-wiki, addressable, terraform-modules", () => {
    const ids = getProjects().projects.filter((p) => p.featured).map((p) => p.id).sort();
    expect(ids).toEqual(["addressable", "local-wiki", "terraform-modules"]);
  });

  it("private repos do not expose a repo url", () => {
    for (const p of getProjects().projects) {
      if (p.repoPrivate) {
        expect(p.repo).toBeUndefined();
      }
    }
  });
});
