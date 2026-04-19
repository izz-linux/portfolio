import { describe, it, expect } from "vitest";
import { render, screen, within } from "@testing-library/react";
import Certifications from "@/components/Certifications";

const fixture = [
  {
    name: "Certified Kubernetes Administrator (CKA)",
    issuer: "CNCF",
    date: "2023-05",
    credentialId: "CKA-12345",
    credentialUrl: "https://cncf.io/cert/CKA-12345",
  },
  {
    name: "AWS Solutions Architect",
    issuer: "Amazon Web Services",
    date: "2022-11",
  },
];

function formatExpectedDate(ym: string) {
  const [y, m] = ym.split("-").map(Number);
  return new Date(y, m - 1, 1).toLocaleString("en-US", {
    month: "short",
    year: "numeric",
  });
}

describe("Certifications", () => {
  it("renders nothing when certifications is an empty array", () => {
    const { container } = render(<Certifications certifications={[]} />);
    expect(container.firstChild).toBeNull();
  });

  it("renders a section heading and one card per cert when non-empty", () => {
    const { container } = render(
      <Certifications certifications={fixture} />
    );
    expect(container.firstChild).not.toBeNull();
    // Some heading-ish element exists
    const headings = container.querySelectorAll(
      "h1, h2, h3, h4, h5, h6"
    );
    expect(headings.length).toBeGreaterThanOrEqual(1);
    // Each cert name appears
    expect(
      screen.getByText(/Certified Kubernetes Administrator/i)
    ).toBeTruthy();
    expect(screen.getByText(/AWS Solutions Architect/i)).toBeTruthy();
  });

  it("wraps name in an anchor with correct href, target, and rel when credentialUrl is present", () => {
    const { container } = render(
      <Certifications certifications={fixture} />
    );
    const anchors = Array.from(container.querySelectorAll("a"));
    const cka = anchors.find((a) =>
      a.textContent?.includes("Certified Kubernetes Administrator")
    );
    expect(cka).toBeTruthy();
    expect(cka!.getAttribute("href")).toBe(
      "https://cncf.io/cert/CKA-12345"
    );
    expect(cka!.getAttribute("target")).toBe("_blank");
    const rel = cka!.getAttribute("rel") ?? "";
    expect(rel).toContain("noopener");
    expect(rel).toContain("noreferrer");
  });

  it("does not wrap name in an anchor when credentialUrl is absent", () => {
    const { container } = render(
      <Certifications certifications={fixture} />
    );
    const anchors = Array.from(container.querySelectorAll("a"));
    const awsAnchor = anchors.find((a) =>
      a.textContent?.includes("AWS Solutions Architect")
    );
    expect(awsAnchor).toBeUndefined();
    // But the text still renders
    expect(screen.getByText(/AWS Solutions Architect/i)).toBeTruthy();
  });

  it("renders the issuer text for each cert", () => {
    render(<Certifications certifications={fixture} />);
    expect(screen.getByText(/CNCF/)).toBeTruthy();
    expect(screen.getByText(/Amazon Web Services/)).toBeTruthy();
  });

  it("renders the date formatted as 'MMM YYYY'", () => {
    const { container } = render(
      <Certifications certifications={fixture} />
    );
    const may2023 = formatExpectedDate("2023-05");
    const nov2022 = formatExpectedDate("2022-11");
    expect(container.textContent).toContain(may2023);
    expect(container.textContent).toContain(nov2022);
  });

  it("wraps matched substring in <mark> when query matches name (case-insensitive)", () => {
    const { container } = render(
      <Certifications certifications={fixture} query="kubernetes" />
    );
    const marks = container.querySelectorAll("mark");
    expect(marks.length).toBeGreaterThanOrEqual(1);
    // Preserves original casing
    const texts = Array.from(marks).map((m) => m.textContent);
    expect(texts.some((t) => t === "Kubernetes")).toBe(true);
  });

  it("wraps matched substring in <mark> when query matches issuer", () => {
    const { container } = render(
      <Certifications certifications={fixture} query="amazon" />
    );
    const marks = Array.from(container.querySelectorAll("mark"));
    expect(marks.length).toBeGreaterThanOrEqual(1);
    expect(marks.some((m) => m.textContent === "Amazon")).toBe(true);
  });

  it("renders no <mark> elements when query is undefined", () => {
    const { container } = render(
      <Certifications certifications={fixture} />
    );
    expect(container.querySelectorAll("mark").length).toBe(0);
  });

  it("renders no <mark> elements when query is empty or whitespace", () => {
    const { container: c1 } = render(
      <Certifications certifications={fixture} query="" />
    );
    expect(c1.querySelectorAll("mark").length).toBe(0);

    const { container: c2 } = render(
      <Certifications certifications={fixture} query="   " />
    );
    expect(c2.querySelectorAll("mark").length).toBe(0);
  });

  it("does not filter by query — all certs still render when query matches only some", () => {
    const { container } = render(
      <Certifications certifications={fixture} query="kubernetes" />
    );
    // Both certs visible (text may be split across <mark>/<span> nodes)
    expect(container.textContent).toMatch(/Certified Kubernetes Administrator/i);
    expect(container.textContent).toMatch(/AWS Solutions Architect/i);
  });

  it("does not highlight the date even when query would substring-match it", () => {
    const { container } = render(
      <Certifications certifications={fixture} query="May" />
    );
    // If any <mark> exists, none should be inside content that's only the date
    const marks = Array.from(container.querySelectorAll("mark"));
    // Date formatted like "May 2023" should not itself be wrapped
    for (const m of marks) {
      // The mark text shouldn't be "May" coming from the date context
      // Heuristic: ensure no mark's parent textContent equals the formatted date
      const parentText = m.parentElement?.textContent ?? "";
      expect(parentText).not.toBe(formatExpectedDate("2023-05"));
    }
  });
});
