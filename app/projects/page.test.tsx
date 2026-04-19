import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import ProjectsPage from "@/app/projects/page";

describe("ProjectsPage", () => {
  it("renders the page heading", () => {
    render(<ProjectsPage />);
    expect(screen.getByRole("heading", { level: 1 })).toBeInTheDocument();
  });

  it("renders a 'Featured' section heading", () => {
    render(<ProjectsPage />);
    expect(screen.getByRole("heading", { name: /featured/i })).toBeInTheDocument();
  });

  it("renders a 'More projects' section heading", () => {
    render(<ProjectsPage />);
    expect(
      screen.getByRole("heading", { name: /more projects/i })
    ).toBeInTheDocument();
  });

  it("renders all 3 featured projects", () => {
    render(<ProjectsPage />);
    expect(screen.getByText("local-wiki")).toBeInTheDocument();
    expect(screen.getByText("addressable")).toBeInTheDocument();
    expect(screen.getByText("terraform-modules")).toBeInTheDocument();
  });

  it("renders all 6 grid projects", () => {
    render(<ProjectsPage />);
    // ProjectTile renders project.name in both <h3> and the LanguagePlaceholder SVG <text>,
    // so each name appears twice — use getAllByText and assert at least one match.
    expect(screen.getAllByText("budget-mgmt").length).toBeGreaterThan(0);
    expect(screen.getAllByText("InternetMonitor").length).toBeGreaterThan(0);
    expect(screen.getAllByText("advent-of-code-2025").length).toBeGreaterThan(0);
    expect(screen.getAllByText("OTP").length).toBeGreaterThan(0);
    expect(screen.getAllByText("find-dupes").length).toBeGreaterThan(0);
    expect(screen.getAllByText("portfolio").length).toBeGreaterThan(0);
  });
});
