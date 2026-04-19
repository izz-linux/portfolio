import { describe, it, expect, vi } from "vitest";
import { render, fireEvent } from "@testing-library/react";
import ExperienceCard from "@/components/ExperienceCard";
import type { ExperienceItem } from "@/lib/profile";

const baseItem: ExperienceItem = {
  id: "acme",
  company: "Acme Corp",
  title: "Senior Engineer",
  startDate: "2022-03",
  endDate: "2024-06",
  bullets: ["Shipped feature X", "Improved latency by 30%"],
  location: "Remote",
  summary: "Led platform migration",
  skillsUsed: ["TypeScript", "Kubernetes"],
};

function getHeaderButton(container: HTMLElement): HTMLButtonElement {
  const btn = container.querySelector('button[aria-expanded]') as HTMLButtonElement | null;
  if (!btn) throw new Error("header button not found");
  return btn;
}

describe("ExperienceCard", () => {
  it("renders title, company, date range, location, and summary when present", () => {
    const { container } = render(
      <ExperienceCard item={baseItem} query="" defaultOpen />
    );
    expect(container.textContent).toContain("Senior Engineer");
    expect(container.textContent).toContain("Acme Corp");
    expect(container.textContent).toContain("2022");
    expect(container.textContent).toContain("Remote");
    expect(container.textContent).toContain("Led platform migration");
  });

  it("does not crash when location and summary are undefined", () => {
    const item: ExperienceItem = {
      ...baseItem,
      location: undefined,
      summary: undefined,
    };
    const { container } = render(<ExperienceCard item={item} query="" />);
    expect(container.textContent).not.toContain("Remote");
    expect(container.textContent).not.toContain("Led platform migration");
    expect(container.textContent).toContain("Senior Engineer");
  });

  it("defaultOpen undefined → card closed initially (no bullets/skills, toggle shows +)", () => {
    const { container } = render(<ExperienceCard item={baseItem} query="" />);
    expect(container.querySelector("ul")).toBeNull();
    expect(container.textContent).not.toContain("Shipped feature X");
    expect(container.textContent).not.toContain("TypeScript");
    expect(container.textContent).toContain("+");
  });

  it("defaultOpen=false → closed", () => {
    const { container } = render(
      <ExperienceCard item={baseItem} query="" defaultOpen={false} />
    );
    expect(container.querySelector("ul")).toBeNull();
    expect(container.textContent).not.toContain("Shipped feature X");
    expect(container.textContent).toContain("+");
  });

  it("defaultOpen=true → open initially (bullets render, toggle shows −)", () => {
    const { container } = render(
      <ExperienceCard item={baseItem} query="" defaultOpen />
    );
    expect(container.querySelector("ul")).not.toBeNull();
    expect(container.textContent).toContain("Shipped feature X");
    expect(container.textContent).toContain("Improved latency by 30%");
    expect(container.textContent).toContain("\u2212");
  });

  it("clicking header toggles open when selected=true", () => {
    const { container } = render(
      <ExperienceCard item={baseItem} query="" selected defaultOpen={false} />
    );
    const btn = getHeaderButton(container);
    expect(btn.getAttribute("aria-expanded")).toBe("false");
    fireEvent.click(btn);
    expect(btn.getAttribute("aria-expanded")).toBe("true");
    expect(container.querySelector("ul")).not.toBeNull();
    fireEvent.click(btn);
    expect(btn.getAttribute("aria-expanded")).toBe("false");
    expect(container.querySelector("ul")).toBeNull();
  });

  it("clicking header when selected=false with onSelect calls onSelect once and does NOT open", () => {
    const onSelect = vi.fn();
    const { container } = render(
      <ExperienceCard item={baseItem} query="" onSelect={onSelect} />
    );
    const btn = getHeaderButton(container);
    fireEvent.click(btn);
    expect(onSelect).toHaveBeenCalledTimes(1);
    expect(btn.getAttribute("aria-expanded")).toBe("false");
    expect(container.querySelector("ul")).toBeNull();
  });

  it("clicking header when selected=false and onSelect undefined does not throw", () => {
    const { container } = render(<ExperienceCard item={baseItem} query="" />);
    const btn = getHeaderButton(container);
    expect(() => fireEvent.click(btn)).not.toThrow();
  });

  it("aria-expanded reflects open state", () => {
    const { container, rerender } = render(
      <ExperienceCard item={baseItem} query="" defaultOpen={false} />
    );
    expect(getHeaderButton(container).getAttribute("aria-expanded")).toBe("false");
    rerender(<ExperienceCard item={baseItem} query="" defaultOpen />);
    // defaultOpen is initial-only; re-render won't reset. Test open state via click with selected.
    const { container: c2 } = render(
      <ExperienceCard item={baseItem} query="" defaultOpen />
    );
    expect(getHeaderButton(c2).getAttribute("aria-expanded")).toBe("true");
  });

  it("changing focusKey while forceOpen=true and closed → card opens", () => {
    const { container, rerender } = render(
      <ExperienceCard
        item={baseItem}
        query=""
        forceOpen
        focusKey="a"
        defaultOpen={false}
      />
    );
    expect(container.querySelector("ul")).toBeNull();
    rerender(
      <ExperienceCard
        item={baseItem}
        query=""
        forceOpen
        focusKey="b"
        defaultOpen={false}
      />
    );
    expect(container.querySelector("ul")).not.toBeNull();
    expect(getHeaderButton(container).getAttribute("aria-expanded")).toBe("true");
  });

  it("changing focusKey while forceOpen=false and closed → card stays closed", () => {
    const { container, rerender } = render(
      <ExperienceCard
        item={baseItem}
        query=""
        forceOpen={false}
        focusKey="a"
        defaultOpen={false}
      />
    );
    expect(container.querySelector("ul")).toBeNull();
    rerender(
      <ExperienceCard
        item={baseItem}
        query=""
        forceOpen={false}
        focusKey="b"
        defaultOpen={false}
      />
    );
    expect(container.querySelector("ul")).toBeNull();
  });

  it("selected true → false while open=true auto-closes", () => {
    const { container, rerender } = render(
      <ExperienceCard item={baseItem} query="" selected defaultOpen />
    );
    expect(container.querySelector("ul")).not.toBeNull();
    rerender(
      <ExperienceCard item={baseItem} query="" selected={false} defaultOpen />
    );
    expect(container.querySelector("ul")).toBeNull();
    expect(getHeaderButton(container).getAttribute("aria-expanded")).toBe("false");
  });

  it("selected false → true while open=false does NOT auto-open", () => {
    const { container, rerender } = render(
      <ExperienceCard item={baseItem} query="" selected={false} defaultOpen={false} />
    );
    expect(container.querySelector("ul")).toBeNull();
    rerender(
      <ExperienceCard item={baseItem} query="" selected defaultOpen={false} />
    );
    expect(container.querySelector("ul")).toBeNull();
  });

  it("selected styling differs from unselected", () => {
    const { container: cSel } = render(
      <ExperienceCard item={baseItem} query="" selected />
    );
    const { container: cUnsel } = render(
      <ExperienceCard item={baseItem} query="" selected={false} />
    );
    const selRoot = cSel.firstElementChild as HTMLElement;
    const unselRoot = cUnsel.firstElementChild as HTMLElement;
    expect(selRoot.className).not.toBe(unselRoot.className);
  });

  it("query matches title → <mark> appears over matched substring", () => {
    const { container } = render(
      <ExperienceCard item={baseItem} query="Senior" />
    );
    const marks = container.querySelectorAll("mark");
    expect(marks.length).toBeGreaterThanOrEqual(1);
    const texts = Array.from(marks).map((m) => m.textContent?.toLowerCase());
    expect(texts.some((t) => t === "senior")).toBe(true);
  });

  it("query empty → no <mark> anywhere", () => {
    const { container } = render(
      <ExperienceCard item={baseItem} query="" defaultOpen />
    );
    expect(container.querySelectorAll("mark").length).toBe(0);
  });

  it("bullets only render when open", () => {
    const { container, rerender } = render(
      <ExperienceCard item={baseItem} query="" selected defaultOpen={false} />
    );
    expect(container.querySelector("ul")).toBeNull();
    expect(container.textContent).not.toContain("Shipped feature X");
    rerender(
      <ExperienceCard item={baseItem} query="" selected defaultOpen />
    );
    // defaultOpen is initial-only; click instead
    fireEvent.click(getHeaderButton(container));
    expect(container.querySelector("ul")).not.toBeNull();
    const lis = container.querySelectorAll("li");
    expect(lis.length).toBeGreaterThanOrEqual(2);
  });

  it("skillsUsed only render when open", () => {
    const { container: cClosed } = render(
      <ExperienceCard item={baseItem} query="" defaultOpen={false} />
    );
    expect(cClosed.textContent).not.toContain("TypeScript");
    expect(cClosed.textContent).not.toContain("Kubernetes");

    const { container: cOpen } = render(
      <ExperienceCard item={baseItem} query="" defaultOpen />
    );
    expect(cOpen.textContent).toContain("TypeScript");
    expect(cOpen.textContent).toContain("Kubernetes");
  });

  it("no badge row when skillsUsed undefined or empty, even when open", () => {
    const itemNoSkills: ExperienceItem = { ...baseItem, skillsUsed: undefined };
    const { container: c1 } = render(
      <ExperienceCard item={itemNoSkills} query="" defaultOpen />
    );
    expect(c1.textContent).not.toContain("TypeScript");
    expect(c1.textContent).not.toContain("Kubernetes");

    const itemEmpty: ExperienceItem = { ...baseItem, skillsUsed: [] };
    const { container: c2 } = render(
      <ExperienceCard item={itemEmpty} query="" defaultOpen />
    );
    expect(c2.textContent).not.toContain("TypeScript");
  });
});
