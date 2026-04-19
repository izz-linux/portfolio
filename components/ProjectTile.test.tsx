import { describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { ProjectTile } from "@/components/ProjectTile";
import type { Project } from "@/lib/projects";

const baseProject: Project = {
  id: "demo",
  name: "Demo",
  tagline: "A demo project",
  tech: ["Go"],
  featured: false,
};

describe("ProjectTile", () => {
  it("renders name, tagline, and tech badges", () => {
    render(<ProjectTile project={baseProject} />);
    expect(
      screen.getByRole("heading", { level: 3, name: "Demo" }),
    ).toBeInTheDocument();
    expect(screen.getByText("A demo project")).toBeInTheDocument();
    expect(screen.getAllByText("Go").length).toBeGreaterThan(0);
  });

  it("renders a LanguagePlaceholder SVG when no media is provided", () => {
    const { container } = render(<ProjectTile project={baseProject} />);
    expect(container.querySelector("svg")).not.toBeNull();
  });

  it("renders an image when media.kind is 'image'", () => {
    const withImg: Project = {
      ...baseProject,
      media: { kind: "image", src: "/projects/demo.png", alt: "demo" },
    };
    render(<ProjectTile project={withImg} />);
    const img = screen.getByAltText("demo") as HTMLImageElement;
    expect(img.getAttribute("src")).toBe("/projects/demo.png");
  });

  it("renders a repo link when repo URL is set", () => {
    const pub: Project = {
      ...baseProject,
      repo: "https://github.com/izz-linux/demo",
    };
    render(<ProjectTile project={pub} />);
    const link = screen.getByRole("link", { name: /source/i }) as HTMLAnchorElement;
    expect(link.getAttribute("href")).toBe("https://github.com/izz-linux/demo");
  });

  it("does not render a repo link when repoPrivate", () => {
    const priv: Project = { ...baseProject, repoPrivate: true };
    render(<ProjectTile project={priv} />);
    expect(screen.queryByRole("link", { name: /source/i })).toBeNull();
  });

  it("opens a lightbox when the image is clicked and closes it via the Close button", () => {
    const withImg: Project = {
      ...baseProject,
      media: { kind: "image", src: "/projects/demo.png", alt: "demo shot" },
    };
    render(<ProjectTile project={withImg} />);
    expect(screen.queryByRole("dialog")).toBeNull();

    fireEvent.click(screen.getByRole("button", { name: /enlarge image: demo shot/i }));
    expect(screen.getByRole("dialog")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: /close preview/i }));
    expect(screen.queryByRole("dialog")).toBeNull();
  });
});
