import { describe, it, expect, vi } from "vitest";
import { render, screen, within, fireEvent } from "@testing-library/react";
import Keywords from "@/components/Keywords";

const fixture = ["terraform", "kubernetes", "incident response"];

describe("Keywords", () => {
  it("renders a title element and a count indicator showing visible keyword count", () => {
    const { container } = render(
      <Keywords keywords={fixture} query="" onPick={() => {}} />
    );
    // Some title/heading element exists
    expect(container.firstChild).not.toBeNull();
    // Count indicator shows "3" for all visible
    expect(container.textContent).toContain("3");
  });

  it("renders one role=button chip per visible keyword", () => {
    render(<Keywords keywords={fixture} query="" onPick={() => {}} />);
    const buttons = screen.getAllByRole("button");
    expect(buttons.length).toBe(3);
    const texts = buttons.map((b) => b.textContent);
    expect(texts.some((t) => t?.includes("terraform"))).toBe(true);
    expect(texts.some((t) => t?.includes("kubernetes"))).toBe(true);
    expect(texts.some((t) => t?.includes("incident response"))).toBe(true);
  });

  it("returns null when keywords is an empty array", () => {
    const { container } = render(
      <Keywords keywords={[]} query="" onPick={() => {}} />
    );
    expect(container.firstChild).toBeNull();
  });

  it("returns null when no keyword matches the query filter", () => {
    const { container } = render(
      <Keywords keywords={fixture} query="zzznomatch" onPick={() => {}} />
    );
    expect(container.firstChild).toBeNull();
  });

  it("filters keywords case-insensitively by query.includes", () => {
    render(<Keywords keywords={fixture} query="KUBE" onPick={() => {}} />);
    const buttons = screen.getAllByRole("button");
    expect(buttons.length).toBe(1);
    expect(buttons[0].textContent).toContain("kubernetes");
  });

  it("treats whitespace-only query as empty and shows all keywords", () => {
    render(<Keywords keywords={fixture} query="   " onPick={() => {}} />);
    const buttons = screen.getAllByRole("button");
    expect(buttons.length).toBe(3);
  });

  it("updates the count indicator to reflect the number of visible keywords after filter", () => {
    const { container } = render(
      <Keywords keywords={fixture} query="KUBE" onPick={() => {}} />
    );
    expect(container.textContent).toContain("1");
  });

  it("calls onPick with the keyword's original-case text when clicking a non-selected chip", () => {
    const onPick = vi.fn();
    render(<Keywords keywords={fixture} query="" onPick={onPick} />);
    const buttons = screen.getAllByRole("button");
    const terraform = buttons.find((b) => b.textContent?.includes("terraform"))!;
    fireEvent.click(terraform);
    expect(onPick).toHaveBeenCalledWith("terraform");
  });

  it("calls onPick('') when clicking a chip whose lowercased text equals the trimmed-lowercased query (toggle off)", () => {
    const onPick = vi.fn();
    render(
      <Keywords keywords={fixture} query="terraform" onPick={onPick} />
    );
    const buttons = screen.getAllByRole("button");
    const terraform = buttons.find(
      (b) => b.textContent?.toLowerCase().includes("terraform")
    )!;
    fireEvent.click(terraform);
    expect(onPick).toHaveBeenCalledWith("");
  });

  it("toggle-off is case-insensitive: query 'TERRAFORM' clicking 'terraform' clears filter", () => {
    const onPick = vi.fn();
    render(
      <Keywords keywords={fixture} query="TERRAFORM" onPick={onPick} />
    );
    const buttons = screen.getAllByRole("button");
    const terraform = buttons.find(
      (b) => b.textContent?.toLowerCase().includes("terraform")
    )!;
    fireEvent.click(terraform);
    expect(onPick).toHaveBeenCalledWith("");
  });

  it("toggle-off respects trim: query '  terraform  ' treats terraform as selected", () => {
    const onPick = vi.fn();
    render(
      <Keywords
        keywords={fixture}
        query="  terraform  "
        onPick={onPick}
      />
    );
    const buttons = screen.getAllByRole("button");
    const terraform = buttons.find(
      (b) => b.textContent?.toLowerCase().includes("terraform")
    )!;
    fireEvent.click(terraform);
    expect(onPick).toHaveBeenCalledWith("");
  });

  it("clicking a different chip when one is exactly selected calls onPick with the new keyword's text", () => {
    const onPick = vi.fn();
    const kws = ["react", "react native", "redux"];
    // query "react" exactly matches "react" chip, and also substring-matches "react native"
    render(<Keywords keywords={kws} query="react" onPick={onPick} />);
    const buttons = screen.getAllByRole("button");
    expect(buttons.length).toBe(2); // "react" and "react native"
    const reactNative = buttons.find(
      (b) => b.textContent?.toLowerCase().includes("react native")
    )!;
    fireEvent.click(reactNative);
    expect(onPick).toHaveBeenCalledWith("react native");
  });

  it("gives the selected chip a different className than non-selected chips", () => {
    const kws = ["react", "react native"];
    render(<Keywords keywords={kws} query="react" onPick={() => {}} />);
    const buttons = screen.getAllByRole("button");
    const selected = buttons.find(
      (b) => b.textContent?.toLowerCase().trim() === "react"
    )!;
    const other = buttons.find(
      (b) => b.textContent?.toLowerCase().includes("native")
    )!;
    expect(selected.className).not.toBe(other.className);
  });

  it("wraps substrings matching the query in a <mark> element inside each chip", () => {
    render(
      <Keywords keywords={fixture} query="kube" onPick={() => {}} />
    );
    const buttons = screen.getAllByRole("button");
    const kube = buttons.find((b) =>
      b.textContent?.toLowerCase().includes("kubernetes")
    )!;
    const marks = within(kube).getAllByText(
      (_, el) => el?.tagName.toLowerCase() === "mark"
    );
    expect(marks.length).toBeGreaterThanOrEqual(1);
  });

  it("does not render <mark> elements when query is empty", () => {
    const { container } = render(
      <Keywords keywords={fixture} query="" onPick={() => {}} />
    );
    expect(container.querySelectorAll("mark").length).toBe(0);
  });
});
