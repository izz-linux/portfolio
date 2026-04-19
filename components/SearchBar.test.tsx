import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import SearchBar from "@/components/SearchBar";

// Note: @testing-library/user-event is not installed in this project.
// fireEvent is used instead; behaviorally equivalent for the spec's assertions
// (input change + button click).

describe("SearchBar", () => {
  it("renders a label with the expected text", () => {
    render(<SearchBar query="" onChange={() => {}} />);
    expect(
      screen.getByText(
        "Search experience, skills, certifications, keywords"
      )
    ).toBeTruthy();
  });

  it("renders an input whose value reflects the query prop", () => {
    render(<SearchBar query="hello" onChange={() => {}} />);
    const input = screen.getByRole("textbox") as HTMLInputElement;
    expect(input.value).toBe("hello");
  });

  it("renders an empty input when query is an empty string", () => {
    render(<SearchBar query="" onChange={() => {}} />);
    const input = screen.getByRole("textbox") as HTMLInputElement;
    expect(input.value).toBe("");
  });

  it("renders the expected placeholder on the input", () => {
    render(<SearchBar query="" onChange={() => {}} />);
    const input = screen.getByPlaceholderText(
      'Try "terraform", "kubernetes", "incident"...'
    ) as HTMLInputElement;
    expect(input).toBeTruthy();
  });

  it("renders a Clear button with type=button", () => {
    render(<SearchBar query="" onChange={() => {}} />);
    const btn = screen.getByRole("button", { name: "Clear" }) as HTMLButtonElement;
    expect(btn).toBeTruthy();
    expect(btn.getAttribute("type")).toBe("button");
  });

  it("calls onChange with the full new value when the user types a character into an empty input", () => {
    const onChange = vi.fn();
    render(<SearchBar query="" onChange={onChange} />);
    const input = screen.getByRole("textbox");
    fireEvent.change(input, { target: { value: "a" } });
    expect(onChange).toHaveBeenCalledWith("a");
  });

  it("calls onChange with the full new value when typing into an already-populated input", () => {
    const onChange = vi.fn();
    render(<SearchBar query="foo" onChange={onChange} />);
    const input = screen.getByRole("textbox");
    fireEvent.change(input, { target: { value: "foox" } });
    expect(onChange).toHaveBeenLastCalledWith("foox");
  });

  it("calls onChange with empty string when Clear is clicked", () => {
    const onChange = vi.fn();
    render(<SearchBar query="something" onChange={onChange} />);
    fireEvent.click(screen.getByRole("button", { name: "Clear" }));
    expect(onChange).toHaveBeenCalledWith("");
  });

  it("calls onChange with empty string when Clear is clicked while input is empty", () => {
    const onChange = vi.fn();
    render(<SearchBar query="" onChange={onChange} />);
    fireEvent.click(screen.getByRole("button", { name: "Clear" }));
    expect(onChange).toHaveBeenCalledWith("");
  });

  it("is controlled: updating the query prop updates the displayed value", () => {
    const { rerender } = render(<SearchBar query="first" onChange={() => {}} />);
    let input = screen.getByRole("textbox") as HTMLInputElement;
    expect(input.value).toBe("first");
    rerender(<SearchBar query="second" onChange={() => {}} />);
    input = screen.getByRole("textbox") as HTMLInputElement;
    expect(input.value).toBe("second");
  });
});
