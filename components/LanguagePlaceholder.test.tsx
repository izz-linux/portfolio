import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { LanguagePlaceholder } from "@/components/LanguagePlaceholder";

describe("LanguagePlaceholder", () => {
  it("renders the name", () => {
    render(<LanguagePlaceholder name="OTP" language="Go" />);
    expect(screen.getByText("OTP")).toBeInTheDocument();
  });

  it("renders the language label", () => {
    render(<LanguagePlaceholder name="OTP" language="Go" />);
    expect(screen.getByText(/go/i)).toBeInTheDocument();
  });

  it("sets fill color based on language", () => {
    const { container } = render(<LanguagePlaceholder name="OTP" language="Go" />);
    const rect = container.querySelector("svg rect");
    expect(rect?.getAttribute("fill")).toBe("#00ADD8"); // Go official color
  });

  it("falls back to a default color for unknown languages", () => {
    const { container } = render(
      <LanguagePlaceholder name="Unknown" language="Klingon" />
    );
    const rect = container.querySelector("svg rect");
    expect(rect?.getAttribute("fill")).toBe("#4b5563"); // gray-600
  });
});
