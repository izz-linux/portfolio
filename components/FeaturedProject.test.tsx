import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { FeaturedProject } from "@/components/FeaturedProject";
import type { Project } from "@/lib/projects";

const baseProject: Project = {
  id: "demo",
  name: "Demo",
  tagline: "A demo project",
  description: "Demo description goes here.",
  tech: ["Go", "Kubernetes"],
  featured: true,
  media: {
    kind: "image",
    src: "/projects/demo.png",
    alt: "Demo screenshot",
  },
};

describe("FeaturedProject", () => {
  it("renders name, tagline, description, and tech badges", () => {
    render(<FeaturedProject project={baseProject} />);
    expect(screen.getByText("Demo")).toBeInTheDocument();
    expect(screen.getByText("A demo project")).toBeInTheDocument();
    expect(screen.getByText("Demo description goes here.")).toBeInTheDocument();
    expect(screen.getByText("Go")).toBeInTheDocument();
    expect(screen.getByText("Kubernetes")).toBeInTheDocument();
  });

  it("renders image media with correct src and alt", () => {
    render(<FeaturedProject project={baseProject} />);
    const img = screen.getByAltText("Demo screenshot") as HTMLImageElement;
    expect(img).toBeInTheDocument();
    expect(img.getAttribute("src")).toBe("/projects/demo.png");
  });

  it("renders code media when media.kind is 'code'", () => {
    const codeProject: Project = {
      ...baseProject,
      media: { kind: "code", code: "echo hi", language: "bash" },
    };
    const { container } = render(<FeaturedProject project={codeProject} />);
    expect(container.querySelector("[data-language='bash']")).not.toBeNull();
  });

  it("renders 'Source private' and no repo link when repoPrivate", () => {
    const privProject: Project = { ...baseProject, repoPrivate: true };
    render(<FeaturedProject project={privProject} />);
    expect(screen.getByText(/source private/i)).toBeInTheDocument();
    expect(screen.queryByRole("link", { name: /source/i })).toBeNull();
  });

  it("renders a repo link when repo URL is set", () => {
    const pubProject: Project = {
      ...baseProject,
      repo: "https://github.com/izz-linux/demo",
    };
    render(<FeaturedProject project={pubProject} />);
    const link = screen.getByRole("link", { name: /source/i }) as HTMLAnchorElement;
    expect(link.getAttribute("href")).toBe("https://github.com/izz-linux/demo");
  });

  it("renders a demo link when demo URL is set", () => {
    const demoProject: Project = {
      ...baseProject,
      demo: "https://example.com",
    };
    render(<FeaturedProject project={demoProject} />);
    const link = screen.getByRole("link", { name: /live/i }) as HTMLAnchorElement;
    expect(link.getAttribute("href")).toBe("https://example.com");
  });
});
