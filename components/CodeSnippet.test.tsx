import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { CodeSnippet } from "@/components/CodeSnippet";

describe("CodeSnippet", () => {
  it("renders the provided code", () => {
    render(<CodeSnippet code={'let x = "hi"'} language="bash" />);
    expect(screen.getAllByText(/let/i).length).toBeGreaterThan(0);
  });

  it("exposes the language via data-language", () => {
    const { container } = render(<CodeSnippet code={"x"} language="bash" />);
    const root = container.querySelector("[data-language]");
    expect(root).not.toBeNull();
    expect(root?.getAttribute("data-language")).toBe("bash");
  });

  it("renders a caption when provided", () => {
    render(<CodeSnippet code={"x"} language="bash" caption="Sample" />);
    expect(screen.getByText("Sample")).toBeInTheDocument();
  });

  it("renders both light and dark code blocks (one visible per mode)", () => {
    const { container } = render(<CodeSnippet code={"x"} language="bash" />);
    const pres = container.querySelectorAll("pre");
    expect(pres.length).toBe(2);
  });
});
