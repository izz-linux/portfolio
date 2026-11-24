import { describe, it, expect } from "vitest";
import type { Profile } from "@/lib/profile";
import { getProfile } from "@/lib/profile";
import { buildProfilePage, buildWebSite, serializeJsonLd } from "@/lib/structured-data";

const base: Profile = {
  name: "Test User",
  headline: "Headline",
  experience: [
    { id: "a", company: "Current Co", title: "Staff Engineer", startDate: "2024-01", endDate: null, bullets: [] },
    { id: "b", company: "Old Co", title: "Engineer", startDate: "2020-01", endDate: "2023-12", bullets: [] },
  ],
  skills: [],
  keywords: ["Platform Engineering", "SRE"],
};

describe("buildProfilePage", () => {
  it("describes the current role and topics", () => {
    const person = buildProfilePage(base).mainEntity;
    expect(person.hasOccupation).toEqual({ "@type": "Occupation", name: "Staff Engineer" });
    expect(person.worksFor).toEqual({ "@type": "Organization", name: "Current Co" });
    expect(person.knowsAbout).toEqual(["Platform Engineering", "SRE"]);
  });

  it.each([
    ["no links", undefined, []],
    [
      "external and internal links",
      [
        { label: "Email", href: "mailto:a@example.com" },
        { label: "Projects", href: "/projects" },
        { label: "GitHub", href: "https://github.com/test" },
      ],
      ["https://github.com/test"],
    ],
  ])("builds sameAs from %s", (_name, links, expected) => {
    expect(buildProfilePage({ ...base, links }).mainEntity.sameAs).toEqual(expected);
  });

  it("omits occupation and employer when there is no current role", () => {
    const person = buildProfilePage({ ...base, experience: [base.experience[1]] }).mainEntity;
    expect(person).not.toHaveProperty("hasOccupation");
    expect(person).not.toHaveProperty("worksFor");
  });

  it("does not point at the personal site", () => {
    expect(JSON.stringify(buildProfilePage(getProfile()))).not.toContain('"https://izznoland.dev');
  });
});

describe("buildWebSite", () => {
  it("names the portfolio separately from the personal site", () => {
    expect(buildWebSite(base)).toMatchObject({
      "@type": "WebSite",
      name: "Test User Portfolio",
      url: "https://portfolio.izznoland.dev/",
    });
  });
});

describe("serializeJsonLd", () => {
  it("escapes markup so data cannot close the script tag", () => {
    const out = serializeJsonLd({ a: "</script>" });
    expect(out).not.toContain("<");
    expect(JSON.parse(out)).toEqual({ a: "</script>" });
  });
});
