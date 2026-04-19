import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import Timeline from "@/components/Timeline";
import type { ExperienceItem } from "@/lib/profile";

const now = new Date();
const currentYear = now.getFullYear();

const items: ExperienceItem[] = [
  {
    id: "a",
    company: "Acme",
    title: "Engineer",
    startDate: `${currentYear - 2}-01`,
    endDate: `${currentYear - 1}-06`,
    bullets: [],
  },
  {
    id: "b",
    company: "Globex",
    title: "Senior Engineer",
    startDate: `${currentYear - 1}-07`,
    endDate: null,
    bullets: [],
  },
];

const yy = (year: number) => `'${String(year).slice(-2)}`;

describe("Timeline", () => {
  it("renders one button per item", () => {
    render(
      <Timeline items={items} selectedId={null} onSelect={() => {}} />
    );
    const buttons = screen.getAllByRole("button");
    expect(buttons.length).toBe(items.length);
  });

  it("each button has aria-label 'Select {title} at {company}'", () => {
    render(
      <Timeline items={items} selectedId={null} onSelect={() => {}} />
    );
    expect(
      screen.getByRole("button", { name: "Select Engineer at Acme" })
    ).toBeTruthy();
    expect(
      screen.getByRole("button", {
        name: "Select Senior Engineer at Globex",
      })
    ).toBeTruthy();
  });

  it("clicking a button calls onSelect with that item's id exactly once", () => {
    const onSelect = vi.fn();
    render(
      <Timeline items={items} selectedId={null} onSelect={onSelect} />
    );
    const btn = screen.getByRole("button", {
      name: "Select Engineer at Acme",
    });
    fireEvent.click(btn);
    expect(onSelect).toHaveBeenCalledTimes(1);
    expect(onSelect).toHaveBeenCalledWith("a");
  });

  it("each button contains the item's title text", () => {
    render(
      <Timeline items={items} selectedId={null} onSelect={() => {}} />
    );
    const btnA = screen.getByRole("button", {
      name: "Select Engineer at Acme",
    });
    const btnB = screen.getByRole("button", {
      name: "Select Senior Engineer at Globex",
    });
    expect(btnA.textContent).toContain("Engineer");
    expect(btnB.textContent).toContain("Senior Engineer");
  });

  it("each button contains the item's company text", () => {
    render(
      <Timeline items={items} selectedId={null} onSelect={() => {}} />
    );
    const btnA = screen.getByRole("button", {
      name: "Select Engineer at Acme",
    });
    const btnB = screen.getByRole("button", {
      name: "Select Senior Engineer at Globex",
    });
    expect(btnA.textContent).toContain("Acme");
    expect(btnB.textContent).toContain("Globex");
  });

  it("year axis contains short-year labels for earliest and current year", () => {
    const { container } = render(
      <Timeline items={items} selectedId={null} onSelect={() => {}} />
    );
    const text = container.textContent ?? "";
    // Earliest item starts at currentYear - 2
    expect(text).toContain(yy(currentYear - 2));
    expect(text).toContain(yy(currentYear));
  });

  it("year axis does NOT contain future years even when endDate is in future", () => {
    const futureItems: ExperienceItem[] = [
      {
        id: "f",
        company: "FutureCo",
        title: "Time Traveler",
        startDate: `${currentYear - 1}-01`,
        endDate: `${currentYear + 2}-01`,
        bullets: [],
      },
    ];
    const { container } = render(
      <Timeline
        items={futureItems}
        selectedId={null}
        onSelect={() => {}}
      />
    );
    const text = container.textContent ?? "";
    expect(text).not.toContain(yy(currentYear + 1));
    expect(text).not.toContain(yy(currentYear + 2));
  });

  // Collect the set of classNames for a button and its descendants.
  const classNamesOf = (el: Element): string[] => {
    const out: string[] = [el.className ?? ""];
    el.querySelectorAll("*").forEach((child) => {
      out.push((child as HTMLElement).className ?? "");
    });
    return out;
  };

  it("selected button's rendered content className differs from non-selected", () => {
    render(
      <Timeline items={items} selectedId="a" onSelect={() => {}} />
    );
    const btnA = screen.getByRole("button", {
      name: "Select Engineer at Acme",
    });
    const btnB = screen.getByRole("button", {
      name: "Select Senior Engineer at Globex",
    });
    const aClasses = classNamesOf(btnA).join("|");
    const bClasses = classNamesOf(btnB).join("|");
    expect(aClasses).not.toBe(bClasses);
  });

  it("when selectedId is null, buttons share the same className signature", () => {
    render(
      <Timeline items={items} selectedId={null} onSelect={() => {}} />
    );
    const btnA = screen.getByRole("button", {
      name: "Select Engineer at Acme",
    });
    const btnB = screen.getByRole("button", {
      name: "Select Senior Engineer at Globex",
    });
    const aClasses = classNamesOf(btnA).join("|");
    const bClasses = classNamesOf(btnB).join("|");
    expect(aClasses).toBe(bClasses);
  });

  it("renders with empty items array and no buttons", () => {
    const { container } = render(
      <Timeline items={[]} selectedId={null} onSelect={() => {}} />
    );
    expect(container.firstChild).not.toBeNull();
    expect(screen.queryAllByRole("button")).toEqual([]);
  });

  it("item with endDate: null renders without crashing", () => {
    const onlyCurrent: ExperienceItem[] = [
      {
        id: "b",
        company: "Globex",
        title: "Senior Engineer",
        startDate: `${currentYear - 1}-07`,
        endDate: null,
        bullets: [],
      },
    ];
    expect(() =>
      render(
        <Timeline
          items={onlyCurrent}
          selectedId={null}
          onSelect={() => {}}
        />
      )
    ).not.toThrow();
    expect(
      screen.getByRole("button", {
        name: "Select Senior Engineer at Globex",
      })
    ).toBeTruthy();
  });
});
