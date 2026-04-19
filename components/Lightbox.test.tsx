import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { Lightbox } from "@/components/Lightbox";

describe("Lightbox", () => {
  it("renders the image with alt text", () => {
    render(<Lightbox src="/foo.png" alt="foo" onClose={() => {}} />);
    const img = screen.getByAltText("foo") as HTMLImageElement;
    expect(img.getAttribute("src")).toBe("/foo.png");
  });

  it("calls onClose when the backdrop is clicked", () => {
    const onClose = vi.fn();
    render(<Lightbox src="/x.png" alt="x" onClose={onClose} />);
    fireEvent.click(screen.getByRole("dialog"));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("does not call onClose when the image is clicked", () => {
    const onClose = vi.fn();
    render(<Lightbox src="/x.png" alt="x" onClose={onClose} />);
    fireEvent.click(screen.getByAltText("x"));
    expect(onClose).not.toHaveBeenCalled();
  });

  it("calls onClose when the Close button is clicked", () => {
    const onClose = vi.fn();
    render(<Lightbox src="/x.png" alt="x" onClose={onClose} />);
    fireEvent.click(screen.getByRole("button", { name: /close preview/i }));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("calls onClose when Escape is pressed", () => {
    const onClose = vi.fn();
    render(<Lightbox src="/x.png" alt="x" onClose={onClose} />);
    fireEvent.keyDown(document, { key: "Escape" });
    expect(onClose).toHaveBeenCalledTimes(1);
  });
});
