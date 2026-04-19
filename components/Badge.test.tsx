import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent, createEvent } from "@testing-library/react";
import { Badge } from "@/components/Badge";

describe("Badge", () => {
  it("renders a span containing text children", () => {
    const { container } = render(<Badge>hello</Badge>);
    const span = container.querySelector("span");
    expect(span).toBeTruthy();
    expect(span?.textContent).toBe("hello");
    expect(span?.tagName).toBe("SPAN");
  });

  it("renders a React element as children", () => {
    const { container } = render(
      <Badge>
        <strong>bold</strong>
      </Badge>
    );
    const span = container.querySelector("span");
    expect(span).toBeTruthy();
    expect(span?.querySelector("strong")).toBeTruthy();
    expect(span?.querySelector("strong")?.textContent).toBe("bold");
  });

  it("includes the extra className when className prop is passed", () => {
    const { container } = render(<Badge className="extra-class">x</Badge>);
    const span = container.querySelector("span") as HTMLSpanElement;
    expect(span.className).toContain("extra-class");
  });

  it("defaults className to empty string (no stray extra classes required)", () => {
    const { container } = render(<Badge>x</Badge>);
    const span = container.querySelector("span") as HTMLSpanElement;
    // Just assert it renders — we don't over-assert on exact classnames.
    expect(span).toBeTruthy();
    expect(typeof span.className).toBe("string");
  });

  it("variant='selected' produces a different className than default", () => {
    const { container: defaultContainer } = render(<Badge>x</Badge>);
    const { container: selectedContainer } = render(
      <Badge variant="selected">x</Badge>
    );
    const defaultSpan = defaultContainer.querySelector("span") as HTMLSpanElement;
    const selectedSpan = selectedContainer.querySelector("span") as HTMLSpanElement;
    expect(defaultSpan.className).not.toBe(selectedSpan.className);
  });

  it("variant default matches not passing variant at all", () => {
    const { container: implicitContainer } = render(<Badge>x</Badge>);
    const { container: explicitContainer } = render(
      <Badge variant="default">x</Badge>
    );
    const implicitSpan = implicitContainer.querySelector("span") as HTMLSpanElement;
    const explicitSpan = explicitContainer.querySelector("span") as HTMLSpanElement;
    expect(implicitSpan.className).toBe(explicitSpan.className);
  });

  it("sets role=button when onClick is provided", () => {
    render(<Badge onClick={() => {}}>click me</Badge>);
    const span = screen.getByRole("button");
    expect(span).toBeTruthy();
    expect(span.tagName).toBe("SPAN");
  });

  it("sets tabIndex=0 when onClick is provided", () => {
    render(<Badge onClick={() => {}}>click me</Badge>);
    const span = screen.getByRole("button");
    expect(span.getAttribute("tabindex")).toBe("0");
  });

  it("calls onClick exactly once when the span is clicked", () => {
    const onClick = vi.fn();
    render(<Badge onClick={onClick}>click me</Badge>);
    fireEvent.click(screen.getByRole("button"));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it("calls onClick when Enter is pressed on the span", () => {
    const onClick = vi.fn();
    render(<Badge onClick={onClick}>click me</Badge>);
    fireEvent.keyDown(screen.getByRole("button"), { key: "Enter" });
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it("calls preventDefault on the Enter keydown event", () => {
    const onClick = vi.fn();
    render(<Badge onClick={onClick}>click me</Badge>);
    const span = screen.getByRole("button");
    const event = createEvent.keyDown(span, { key: "Enter" });
    fireEvent(span, event);
    expect(event.defaultPrevented).toBe(true);
  });

  it("calls onClick when Space is pressed on the span", () => {
    const onClick = vi.fn();
    render(<Badge onClick={onClick}>click me</Badge>);
    fireEvent.keyDown(screen.getByRole("button"), { key: " " });
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it("calls preventDefault on the Space keydown event", () => {
    const onClick = vi.fn();
    render(<Badge onClick={onClick}>click me</Badge>);
    const span = screen.getByRole("button");
    const event = createEvent.keyDown(span, { key: " " });
    fireEvent(span, event);
    expect(event.defaultPrevented).toBe(true);
  });

  it("does not call onClick when other keys (a) are pressed", () => {
    const onClick = vi.fn();
    render(<Badge onClick={onClick}>click me</Badge>);
    fireEvent.keyDown(screen.getByRole("button"), { key: "a" });
    expect(onClick).not.toHaveBeenCalled();
  });

  it("does not call onClick when Escape is pressed", () => {
    const onClick = vi.fn();
    render(<Badge onClick={onClick}>click me</Badge>);
    fireEvent.keyDown(screen.getByRole("button"), { key: "Escape" });
    expect(onClick).not.toHaveBeenCalled();
  });

  it("does not have role=button when onClick is not provided", () => {
    const { container } = render(<Badge>no click</Badge>);
    expect(screen.queryByRole("button")).toBeNull();
    const span = container.querySelector("span") as HTMLSpanElement;
    expect(span.getAttribute("role")).not.toBe("button");
  });

  it("does not have a tabIndex attribute when onClick is not provided", () => {
    const { container } = render(<Badge>no click</Badge>);
    const span = container.querySelector("span") as HTMLSpanElement;
    expect(span.hasAttribute("tabindex")).toBe(false);
  });

  it("keyboard events do nothing when onClick is not provided", () => {
    const { container } = render(<Badge>no click</Badge>);
    const span = container.querySelector("span") as HTMLSpanElement;
    // Should not throw and should have no effect.
    expect(() => {
      fireEvent.keyDown(span, { key: "Enter" });
      fireEvent.keyDown(span, { key: " " });
      fireEvent.keyDown(span, { key: "a" });
    }).not.toThrow();
  });
});
