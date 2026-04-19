# Projects Page Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a `/projects` route to the portfolio site showcasing 3 featured projects (rich cards) and 6 grid tiles, with dark-mode-aware styling matching the existing home page.

**Architecture:** New data file (`data/projects.json`) loaded by a thin `lib/projects.ts` module. Four new components (`FeaturedProject`, `ProjectTile`, `CodeSnippet`, `LanguagePlaceholder`) rendered by a new `app/projects/page.tsx` client component. Vitest + @testing-library/react + happy-dom is introduced as the test stack.

**Tech Stack:** Next.js 16 App Router, React 19, TypeScript (strict), Tailwind v4, prism-react-renderer (syntax highlighting), Vitest + @testing-library/react + happy-dom.

**Spec:** [docs/superpowers/specs/2026-04-17-projects-page-design.md](../specs/2026-04-17-projects-page-design.md)

---

## Preflight

- [ ] **Confirm working branch:** `git status` shows a clean tree on `feature/projects-page` off `main`. If not, start by checking out that branch.

---

### Task 1: Test infrastructure

**Goal:** Bring Vitest + @testing-library/react + happy-dom online so all subsequent tasks can be TDD'd.

**Files:**
- Create: `vitest.config.ts`
- Create: `test-setup.ts`
- Create: `lib/__smoke__.test.ts` (temporary smoke test, deleted at end of task)
- Modify: `package.json` (devDeps + scripts)
- Modify: `tsconfig.json` (exclude test output, keep tests in includes)

- [ ] **Step 1: Install dev deps**

```bash
cd ~/develop/tools/src/github.com/izz-linux/portfolio
npm install --save-dev vitest @testing-library/react @testing-library/jest-dom happy-dom @vitejs/plugin-react
```

Expected: `package.json` updates and `package-lock.json` created (the repo has no lockfile currently — it's expected to be created).

- [ ] **Step 2: Add scripts to `package.json`**

Replace the `scripts` section so it reads:

```json
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "eslint",
    "test": "vitest",
    "test:run": "vitest run"
  },
```

- [ ] **Step 3: Create `vitest.config.ts` at repo root**

```ts
import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import path from "node:path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./"),
    },
  },
  test: {
    environment: "happy-dom",
    globals: false,
    setupFiles: ["./test-setup.ts"],
    include: ["**/*.test.{ts,tsx}"],
  },
});
```

- [ ] **Step 4: Create `test-setup.ts` at repo root**

```ts
import "@testing-library/jest-dom/vitest";
```

- [ ] **Step 5: Write a temporary smoke test at `lib/__smoke__.test.ts`**

```ts
import { describe, it, expect } from "vitest";

describe("smoke", () => {
  it("runs", () => {
    expect(1 + 1).toBe(2);
  });
});
```

- [ ] **Step 6: Run the smoke test**

```bash
npm run test:run
```

Expected: 1 passed, 0 failed. If Vitest complains about missing deps, install them; if happy-dom fails to load, recheck `environment` in config.

- [ ] **Step 7: Delete the smoke test**

```bash
rm lib/__smoke__.test.ts
```

- [ ] **Step 8: Confirm lint still passes**

```bash
npm run lint
```

Expected: no errors.

- [ ] **Step 9: Commit**

```bash
git add package.json package-lock.json vitest.config.ts test-setup.ts
git commit -m "chore: add Vitest + Testing Library + happy-dom test stack"
```

---

### Task 2: Project types and loader (with tests)

**Goal:** Define the `Project` type and a `getProjects()` loader backed by `data/projects.json`. Seed the JSON with the 9 projects from the spec so later tests have realistic data to assert on.

**Files:**
- Create: `data/projects.json`
- Create: `lib/projects.ts`
- Create: `lib/projects.test.ts`

- [ ] **Step 1: Write the failing test at `lib/projects.test.ts`**

```ts
import { describe, it, expect } from "vitest";
import { getProjects } from "@/lib/projects";

describe("getProjects", () => {
  it("returns a non-empty projects array", () => {
    const data = getProjects();
    expect(Array.isArray(data.projects)).toBe(true);
    expect(data.projects.length).toBeGreaterThan(0);
  });

  it("each project has the required fields", () => {
    for (const p of getProjects().projects) {
      expect(p.id).toBeTruthy();
      expect(p.name).toBeTruthy();
      expect(p.tagline).toBeTruthy();
      expect(Array.isArray(p.tech)).toBe(true);
      expect(typeof p.featured).toBe("boolean");
    }
  });

  it("featured projects have media defined", () => {
    const featured = getProjects().projects.filter((p) => p.featured);
    expect(featured.length).toBe(3);
    for (const p of featured) {
      expect(p.media).toBeDefined();
    }
  });

  it("featured set is exactly local-wiki, addressable, terraform-modules", () => {
    const ids = getProjects().projects.filter((p) => p.featured).map((p) => p.id).sort();
    expect(ids).toEqual(["addressable", "local-wiki", "terraform-modules"]);
  });

  it("private repos do not expose a repo url", () => {
    for (const p of getProjects().projects) {
      if (p.repoPrivate) {
        expect(p.repo).toBeUndefined();
      }
    }
  });
});
```

- [ ] **Step 2: Run the test to confirm it fails**

```bash
npm run test:run -- lib/projects.test.ts
```

Expected: FAIL (`Cannot find module '@/lib/projects'`).

- [ ] **Step 3: Create `data/projects.json`**

```json
{
  "projects": [
    {
      "id": "local-wiki",
      "name": "local-wiki",
      "tagline": "Local-first Notion alternative for macOS",
      "description": "A Tauri + React + Rust desktop app that treats a folder of plain GFM markdown files as your knowledge base. Rich TipTap editor, wiki-style [[links]], folder-as-hierarchy navigation, and zero lock-in — your notes stay on disk. Built mostly via an agentic Claude Code workflow.",
      "tech": ["Tauri", "React", "TypeScript", "Rust", "TipTap", "Vitest"],
      "repoPrivate": true,
      "featured": true,
      "media": {
        "kind": "image",
        "src": "/projects/local-wiki.png",
        "alt": "local-wiki editor with sidebar, TipTap editor, and wiki-link suggestion popup",
        "caption": "Editor with wiki-link autocomplete and folder-as-hierarchy navigation"
      }
    },
    {
      "id": "addressable",
      "name": "addressable",
      "tagline": "Agentic IPAM for multi-project GCP networks",
      "description": "Scans 20+ GCP projects sharing a 10.0.0.0/8 address space, builds a complete live inventory of allocations, detects 8 classes of CIDR conflicts, and recommends safe CIDRs for new subnets. No database — the source of truth is always live GCP state. Runs as a Claude Code native interface with a standalone CLI fallback.",
      "tech": ["TypeScript", "Bun", "GCP", "Claude Code", "IPAM", "Networking"],
      "repoPrivate": true,
      "featured": true,
      "media": {
        "kind": "image",
        "src": "/projects/addressable.png",
        "alt": "addressable HTML report showing CIDR block utilization and detected conflicts",
        "caption": "HTML report viewer — block utilization and detected conflicts"
      }
    },
    {
      "id": "terraform-modules",
      "name": "terraform-modules",
      "tagline": "Reusable HCL modules for everyday cloud infra",
      "description": "A collection of small, opinionated Terraform modules I reach for across projects — thin wrappers that codify patterns I've found worth standardizing rather than re-deriving each time.",
      "tech": ["Terraform", "HCL", "AWS", "GCP", "Infrastructure as Code"],
      "repo": "https://github.com/izz-linux/terraform-modules",
      "featured": true,
      "media": {
        "kind": "code",
        "language": "bash",
        "code": "module \"vpc\" {\n  source  = \"github.com/izz-linux/terraform-modules//aws/vpc\"\n  name    = \"prod\"\n  cidr    = \"10.20.0.0/16\"\n  azs     = [\"us-east-1a\", \"us-east-1b\", \"us-east-1c\"]\n  enable_flow_logs = true\n}",
        "caption": "Sample module usage"
      }
    },
    {
      "id": "budget-mgmt",
      "name": "budget-mgmt",
      "tagline": "Personal finance app replacing my old Excel workflow",
      "description": "",
      "tech": ["Go", "Node.js", "TypeScript"],
      "repo": "https://github.com/izz-linux/budget-mgmt",
      "featured": false
    },
    {
      "id": "internet-monitor",
      "name": "InternetMonitor",
      "tagline": "Connectivity monitoring from an internal Linux host",
      "description": "",
      "tech": ["Shell", "Linux", "Monitoring"],
      "repo": "https://github.com/izz-linux/InternetMonitor",
      "featured": false
    },
    {
      "id": "advent-of-code-2025",
      "name": "advent-of-code-2025",
      "tagline": "My 2025 Advent of Code solutions in Go",
      "description": "",
      "tech": ["Go", "Algorithms"],
      "repo": "https://github.com/izz-linux/advent-of-code-2025",
      "featured": false
    },
    {
      "id": "otp",
      "name": "OTP",
      "tagline": "Go one-time-password generator (TOTP/HOTP)",
      "description": "",
      "tech": ["Go", "Cryptography", "Security"],
      "repo": "https://github.com/izz-linux/OTP",
      "featured": false
    },
    {
      "id": "find-dupes",
      "name": "find-dupes",
      "tagline": "Tree-walking duplicate-file finder in Python",
      "description": "",
      "tech": ["Python", "CLI"],
      "repo": "https://github.com/izz-linux/find-dupes",
      "featured": false
    },
    {
      "id": "portfolio",
      "name": "portfolio",
      "tagline": "This site — Next.js 16, React 19, Tailwind v4",
      "description": "",
      "tech": ["Next.js", "React", "TypeScript", "Tailwind CSS"],
      "repo": "https://github.com/izz-linux/portfolio",
      "featured": false
    }
  ]
}
```

- [ ] **Step 4: Create `lib/projects.ts`**

```ts
import projectsData from "@/data/projects.json";

export type ProjectMedia =
  | { kind: "image"; src: string; alt: string; caption?: string }
  | { kind: "code"; code: string; language: string; caption?: string };

export type Project = {
  id: string;
  name: string;
  tagline: string;
  description?: string;
  tech: string[];
  repo?: string;
  repoPrivate?: boolean;
  demo?: string;
  featured: boolean;
  media?: ProjectMedia;
};

export type ProjectsData = {
  projects: Project[];
};

export function getProjects(): ProjectsData {
  return projectsData as ProjectsData;
}
```

- [ ] **Step 5: Run tests — expect pass**

```bash
npm run test:run -- lib/projects.test.ts
```

Expected: 5 passed.

- [ ] **Step 6: Commit**

```bash
git add data/projects.json lib/projects.ts lib/projects.test.ts
git commit -m "feat: add projects data model, loader, and seed data"
```

---

### Task 3: CodeSnippet component

**Goal:** Small syntax-highlighted code block used in featured cards for `media.kind === "code"`. Dark-mode support via two `<Highlight>` instances toggled by Tailwind `dark:` visibility classes (no JS state).

**Note on HCL:** `prism-react-renderer` does not ship the HCL grammar. We render HCL as `"bash"` which reasonably approximates Terraform highlighting (comments, strings, identifiers). If higher fidelity is wanted later, extend via `prismjs` — out of scope here.

**Files:**
- Create: `components/CodeSnippet.tsx`
- Create: `components/CodeSnippet.test.tsx`

- [ ] **Step 1: Install `prism-react-renderer`**

```bash
npm install prism-react-renderer
```

- [ ] **Step 2: Write the failing test at `components/CodeSnippet.test.tsx`**

```tsx
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
```

- [ ] **Step 3: Run the test — expect failure**

```bash
npm run test:run -- components/CodeSnippet.test.tsx
```

Expected: FAIL (`Cannot find module '@/components/CodeSnippet'`).

- [ ] **Step 4: Create `components/CodeSnippet.tsx`**

```tsx
"use client";

import { Highlight, themes } from "prism-react-renderer";

export type CodeSnippetProps = {
  code: string;
  language: string;
  caption?: string;
};

export function CodeSnippet({ code, language, caption }: CodeSnippetProps) {
  return (
    <figure data-language={language} className="my-2">
      <div className="block dark:hidden">
        <Highlight theme={themes.github} code={code} language={language}>
          {({ className, style, tokens, getLineProps, getTokenProps }) => (
            <pre
              className={`${className} rounded-md border border-gray-200 p-4 text-xs overflow-x-auto`}
              style={style}
            >
              {tokens.map((line, i) => (
                <div key={i} {...getLineProps({ line })}>
                  {line.map((token, key) => (
                    <span key={key} {...getTokenProps({ token })} />
                  ))}
                </div>
              ))}
            </pre>
          )}
        </Highlight>
      </div>
      <div className="hidden dark:block">
        <Highlight theme={themes.dracula} code={code} language={language}>
          {({ className, style, tokens, getLineProps, getTokenProps }) => (
            <pre
              className={`${className} rounded-md border border-gray-700 p-4 text-xs overflow-x-auto`}
              style={style}
            >
              {tokens.map((line, i) => (
                <div key={i} {...getLineProps({ line })}>
                  {line.map((token, key) => (
                    <span key={key} {...getTokenProps({ token })} />
                  ))}
                </div>
              ))}
            </pre>
          )}
        </Highlight>
      </div>
      {caption ? (
        <figcaption className="mt-2 text-xs text-gray-500 dark:text-gray-400">
          {caption}
        </figcaption>
      ) : null}
    </figure>
  );
}
```

- [ ] **Step 5: Run tests — expect pass**

```bash
npm run test:run -- components/CodeSnippet.test.tsx
```

Expected: 4 passed.

- [ ] **Step 6: Commit**

```bash
git add package.json package-lock.json components/CodeSnippet.tsx components/CodeSnippet.test.tsx
git commit -m "feat: add CodeSnippet component with dark-mode syntax highlighting"
```

---

### Task 4: LanguagePlaceholder component

**Goal:** A runtime-generated SVG tile shown in the grid for projects with no image. Colors keyed by the project's primary language/tech.

**Files:**
- Create: `components/LanguagePlaceholder.tsx`
- Create: `components/LanguagePlaceholder.test.tsx`

- [ ] **Step 1: Write the failing test at `components/LanguagePlaceholder.test.tsx`**

```tsx
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
```

- [ ] **Step 2: Run the test — expect failure**

```bash
npm run test:run -- components/LanguagePlaceholder.test.tsx
```

Expected: FAIL (`Cannot find module '@/components/LanguagePlaceholder'`).

- [ ] **Step 3: Create `components/LanguagePlaceholder.tsx`**

```tsx
"use client";

const LANG_COLORS: Record<string, string> = {
  Go: "#00ADD8",
  TypeScript: "#3178c6",
  JavaScript: "#f1e05a",
  Python: "#3572A5",
  Shell: "#89e051",
  Rust: "#dea584",
  HCL: "#844FBA",
  "Next.js": "#111111",
};

const DEFAULT_COLOR = "#4b5563"; // gray-600

export type LanguagePlaceholderProps = {
  name: string;
  language: string;
};

export function LanguagePlaceholder({ name, language }: LanguagePlaceholderProps) {
  const fill = LANG_COLORS[language] ?? DEFAULT_COLOR;
  return (
    <svg
      viewBox="0 0 320 160"
      xmlns="http://www.w3.org/2000/svg"
      className="w-full h-32 rounded-md"
      role="img"
      aria-label={`${name} (${language})`}
    >
      <rect width="320" height="160" fill={fill} />
      <text
        x="50%"
        y="45%"
        textAnchor="middle"
        fontFamily="ui-sans-serif, system-ui, -apple-system"
        fontSize="22"
        fontWeight="700"
        fill="#ffffff"
      >
        {name}
      </text>
      <text
        x="50%"
        y="68%"
        textAnchor="middle"
        fontFamily="ui-sans-serif, system-ui, -apple-system"
        fontSize="12"
        fill="#ffffff"
        opacity="0.85"
      >
        {language}
      </text>
    </svg>
  );
}
```

- [ ] **Step 4: Run tests — expect pass**

```bash
npm run test:run -- components/LanguagePlaceholder.test.tsx
```

Expected: 4 passed.

- [ ] **Step 5: Commit**

```bash
git add components/LanguagePlaceholder.tsx components/LanguagePlaceholder.test.tsx
git commit -m "feat: add LanguagePlaceholder SVG tile for grid projects"
```

---

### Task 5: FeaturedProject component

**Goal:** Rich card for featured projects. Media on one side, content on the other, stacked on mobile. Supports image or code media, and "Source private" note when the repo isn't linkable.

**Files:**
- Create: `components/FeaturedProject.tsx`
- Create: `components/FeaturedProject.test.tsx`

- [ ] **Step 1: Write the failing test at `components/FeaturedProject.test.tsx`**

```tsx
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
```

- [ ] **Step 2: Run the test — expect failure**

```bash
npm run test:run -- components/FeaturedProject.test.tsx
```

Expected: FAIL (`Cannot find module '@/components/FeaturedProject'`).

- [ ] **Step 3: Create `components/FeaturedProject.tsx`**

```tsx
"use client";

import type { Project } from "@/lib/projects";
import { Badge } from "@/components/Badge";
import { CodeSnippet } from "@/components/CodeSnippet";
import { SPACING } from "@/lib/constants";

export type FeaturedProjectProps = {
  project: Project;
};

export function FeaturedProject({ project }: FeaturedProjectProps) {
  return (
    <article className="flex flex-col md:flex-row md:gap-8 gap-4 rounded-lg border border-gray-200 dark:border-gray-700 p-4 md:p-6">
      <div className="md:w-1/2 min-w-0">
        {project.media?.kind === "image" ? (
          <figure>
            <img
              src={project.media.src}
              alt={project.media.alt}
              className="w-full h-auto rounded-md border border-gray-200 dark:border-gray-700"
            />
            {project.media.caption ? (
              <figcaption className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                {project.media.caption}
              </figcaption>
            ) : null}
          </figure>
        ) : null}
        {project.media?.kind === "code" ? (
          <CodeSnippet
            code={project.media.code}
            language={project.media.language}
            caption={project.media.caption}
          />
        ) : null}
      </div>

      <div className={`md:w-1/2 ${SPACING.sm.spaceY}`}>
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            {project.name}
          </h3>
          <div className="text-sm text-gray-600 dark:text-gray-400">
            {project.tagline}
          </div>
        </div>

        {project.description ? (
          <p className="text-sm text-gray-700 dark:text-gray-300">
            {project.description}
          </p>
        ) : null}

        <div className={`flex flex-wrap ${SPACING.xs.gap}`}>
          {project.tech.map((t) => (
            <Badge key={t}>{t}</Badge>
          ))}
        </div>

        <div className={`flex flex-wrap ${SPACING.sm.gap} text-sm`}>
          {project.repo ? (
            <a
              href={project.repo}
              target="_blank"
              rel="noopener noreferrer"
              className="underline decoration-gray-300 underline-offset-4 hover:decoration-gray-500 dark:decoration-gray-600 dark:hover:decoration-gray-400"
            >
              Source
            </a>
          ) : null}
          {project.repoPrivate ? (
            <span className="text-gray-500 dark:text-gray-400">Source private</span>
          ) : null}
          {project.demo ? (
            <a
              href={project.demo}
              target="_blank"
              rel="noopener noreferrer"
              className="underline decoration-gray-300 underline-offset-4 hover:decoration-gray-500 dark:decoration-gray-600 dark:hover:decoration-gray-400"
            >
              Live
            </a>
          ) : null}
        </div>
      </div>
    </article>
  );
}
```

- [ ] **Step 4: Note: Badge is exported as a named export**

Check that `components/Badge.tsx` exports `Badge` as a named export (it does — verified in the spec research). The import above `{ Badge }` is correct.

- [ ] **Step 5: Run tests — expect pass**

```bash
npm run test:run -- components/FeaturedProject.test.tsx
```

Expected: 6 passed.

- [ ] **Step 6: Commit**

```bash
git add components/FeaturedProject.tsx components/FeaturedProject.test.tsx
git commit -m "feat: add FeaturedProject rich card component"
```

---

### Task 6: ProjectTile component

**Goal:** Compact grid tile with thumbnail (or LanguagePlaceholder fallback), title, tagline, tech badges, and links.

**Files:**
- Create: `components/ProjectTile.tsx`
- Create: `components/ProjectTile.test.tsx`

- [ ] **Step 1: Write the failing test at `components/ProjectTile.test.tsx`**

```tsx
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
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
    expect(screen.getByText("Demo")).toBeInTheDocument();
    expect(screen.getByText("A demo project")).toBeInTheDocument();
    expect(screen.getByText("Go")).toBeInTheDocument();
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
});
```

- [ ] **Step 2: Run the test — expect failure**

```bash
npm run test:run -- components/ProjectTile.test.tsx
```

Expected: FAIL.

- [ ] **Step 3: Create `components/ProjectTile.tsx`**

```tsx
"use client";

import type { Project } from "@/lib/projects";
import { Badge } from "@/components/Badge";
import { LanguagePlaceholder } from "@/components/LanguagePlaceholder";
import { SPACING } from "@/lib/constants";

export type ProjectTileProps = {
  project: Project;
};

export function ProjectTile({ project }: ProjectTileProps) {
  return (
    <article className="flex flex-col gap-3 rounded-lg border border-gray-200 dark:border-gray-700 p-4 hover:border-gray-300 dark:hover:border-gray-600 transition-colors">
      <div>
        {project.media?.kind === "image" ? (
          <img
            src={project.media.src}
            alt={project.media.alt}
            className="w-full h-32 object-cover rounded-md"
          />
        ) : (
          <LanguagePlaceholder
            name={project.name}
            language={project.tech[0] ?? "Code"}
          />
        )}
      </div>

      <div>
        <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100">
          {project.name}
        </h3>
        <div className="text-sm text-gray-600 dark:text-gray-400">
          {project.tagline}
        </div>
      </div>

      <div className={`flex flex-wrap ${SPACING.xs.gap}`}>
        {project.tech.map((t) => (
          <Badge key={t}>{t}</Badge>
        ))}
      </div>

      <div className={`flex flex-wrap ${SPACING.sm.gap} text-sm mt-auto`}>
        {project.repo ? (
          <a
            href={project.repo}
            target="_blank"
            rel="noopener noreferrer"
            className="underline decoration-gray-300 underline-offset-4 hover:decoration-gray-500 dark:decoration-gray-600 dark:hover:decoration-gray-400"
          >
            Source
          </a>
        ) : null}
        {project.repoPrivate ? (
          <span className="text-gray-500 dark:text-gray-400">Source private</span>
        ) : null}
        {project.demo ? (
          <a
            href={project.demo}
            target="_blank"
            rel="noopener noreferrer"
            className="underline decoration-gray-300 underline-offset-4 hover:decoration-gray-500 dark:decoration-gray-600 dark:hover:decoration-gray-400"
          >
            Live
          </a>
        ) : null}
      </div>
    </article>
  );
}
```

- [ ] **Step 4: Run tests — expect pass**

```bash
npm run test:run -- components/ProjectTile.test.tsx
```

Expected: 5 passed.

- [ ] **Step 5: Commit**

```bash
git add components/ProjectTile.tsx components/ProjectTile.test.tsx
git commit -m "feat: add ProjectTile grid component with SVG placeholder fallback"
```

---

### Task 7: Projects page shell

**Goal:** The `/projects` route, rendering the header (name + headline + links — duplicated from `app/page.tsx` for now; extraction is a deliberate non-goal, see spec) followed by a "Featured" section and a "More projects" grid.

**Files:**
- Create: `app/projects/page.tsx`
- Create: `app/projects/page.test.tsx`

- [ ] **Step 1: Write the failing test at `app/projects/page.test.tsx`**

```tsx
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
    expect(screen.getByText("budget-mgmt")).toBeInTheDocument();
    expect(screen.getByText("InternetMonitor")).toBeInTheDocument();
    expect(screen.getByText("advent-of-code-2025")).toBeInTheDocument();
    expect(screen.getByText("OTP")).toBeInTheDocument();
    expect(screen.getByText("find-dupes")).toBeInTheDocument();
    expect(screen.getByText("portfolio")).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run the test — expect failure**

```bash
npm run test:run -- app/projects/page.test.tsx
```

Expected: FAIL.

- [ ] **Step 3: Create `app/projects/page.tsx`**

```tsx
"use client";

import { useMemo } from "react";
import { getProfile } from "@/lib/profile";
import { getProjects } from "@/lib/projects";
import { FeaturedProject } from "@/components/FeaturedProject";
import { ProjectTile } from "@/components/ProjectTile";
import { LAYOUT, SPACING } from "@/lib/constants";

export default function ProjectsPage() {
  const profile = useMemo(() => getProfile(), []);
  const { projects } = useMemo(() => getProjects(), []);

  const featured = projects.filter((p) => p.featured);
  const grid = projects.filter((p) => !p.featured);

  return (
    <main className={`mx-auto ${LAYOUT.MAX_WIDTH} ${LAYOUT.PAGE_PADDING_X} ${LAYOUT.PAGE_PADDING_Y}`}>
      <header className={SPACING.sm.spaceY}>
        <div>
          <a href="/" className="inline-block">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              {profile.name}
            </h1>
          </a>
          <div className="text-sm text-gray-600 dark:text-gray-400">
            {profile.headline}
          </div>
        </div>

        {profile.links?.length ? (
          <div className={`flex flex-wrap ${SPACING.sm.gap} text-sm`}>
            {profile.links.map((l) => {
              const isCurrent = l.href === "/projects";
              return (
                <a
                  key={l.href}
                  href={l.href}
                  target={l.target}
                  rel={l.rel}
                  aria-current={isCurrent ? "page" : undefined}
                  className={
                    isCurrent
                      ? "underline decoration-gray-700 underline-offset-4 text-gray-900 dark:decoration-gray-300 dark:text-gray-100"
                      : "underline decoration-gray-300 underline-offset-4 hover:decoration-gray-500 dark:decoration-gray-600 dark:hover:decoration-gray-400"
                  }
                >
                  {l.label}
                </a>
              );
            })}
          </div>
        ) : null}
      </header>

      <section className={`${SPACING.xl.mt} ${SPACING.lg.spaceY}`}>
        <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
          Featured
        </h2>
        <div className={SPACING.lg.spaceY}>
          {featured.map((p) => (
            <FeaturedProject key={p.id} project={p} />
          ))}
        </div>
      </section>

      <section className={`${SPACING.xl.mt} ${SPACING.lg.spaceY}`}>
        <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
          More projects
        </h2>
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {grid.map((p) => (
            <ProjectTile key={p.id} project={p} />
          ))}
        </div>
      </section>
    </main>
  );
}
```

- [ ] **Step 4: Run tests — expect pass**

```bash
npm run test:run -- app/projects/page.test.tsx
```

Expected: 5 passed.

- [ ] **Step 5: Commit**

```bash
git add app/projects/page.tsx app/projects/page.test.tsx
git commit -m "feat: add /projects page with Featured + More projects sections"
```

---

### Task 8: Add Projects nav link

**Goal:** Add a `Projects` entry to `profile.links` so it renders in the header on the home page (and is styled active on the projects page via Task 7's `aria-current` logic).

**Files:**
- Modify: `data/profile.json`

- [ ] **Step 1: Modify `data/profile.json`**

Find the `links` array:

```json
"links": [
    { "label": "Email", "href": "mailto:izz@linux.com" },
    { "label": "LinkedIn", "target": "_blank", "rel": "noopener noreferrer", "href": "https://www.linkedin.com/in/izznoland/" },
    { "label": "GitHub", "target": "_blank", "rel": "noopener noreferrer", "href": "https://github.com/izz-linux" },
    { "label": "Personal Site", "target": "_blank", "rel": "noopener noreferrer", "href": "https://izznoland.dev" }
  ],
```

Insert a `Projects` entry as the second link (right after Email), so the most-related internal link is prominent:

```json
"links": [
    { "label": "Email", "href": "mailto:izz@linux.com" },
    { "label": "Projects", "href": "/projects" },
    { "label": "LinkedIn", "target": "_blank", "rel": "noopener noreferrer", "href": "https://www.linkedin.com/in/izznoland/" },
    { "label": "GitHub", "target": "_blank", "rel": "noopener noreferrer", "href": "https://github.com/izz-linux" },
    { "label": "Personal Site", "target": "_blank", "rel": "noopener noreferrer", "href": "https://izznoland.dev" }
  ],
```

- [ ] **Step 2: Re-run the projects page test — confirm it still passes**

```bash
npm run test:run -- app/projects/page.test.tsx
```

Expected: 5 passed. (The new Projects link in the header is rendered via `profile.links`.)

- [ ] **Step 3: Commit**

```bash
git add data/profile.json
git commit -m "feat: add Projects nav link to profile"
```

---

### Task 9: Asset gathering (manual — user-assisted)

**Goal:** Capture real screenshots for the two private featured projects (local-wiki and addressable) and place them at the paths referenced in `projects.json`.

**Notes:**
- `terraform-modules` uses a code snippet, not an image.
- Grid projects use runtime `LanguagePlaceholder` — no files to commit.
- `portfolio` tile uses `LanguagePlaceholder` (it's in the grid, not featured).
- Screenshots should target ~1200×750 or similar 16:10-ish aspect. PNG format.

**Files:**
- Create: `public/projects/local-wiki.png`
- Create: `public/projects/addressable.png`

- [ ] **Step 1: Ensure `public/projects/` exists**

```bash
mkdir -p public/projects
```

- [ ] **Step 2: Capture local-wiki screenshot**

Ask the user to:
1. Run `pnpm tauri dev` in `~/Dropbox/develop/tools/src/github.com/izz-linux/local-wiki/`
2. Open a wiki, navigate to a page with the TipTap editor active and a wiki-link suggestion visible if possible
3. Capture the app window with `⌘⇧4 Space` then click the window
4. Save to `~/develop/tools/src/github.com/izz-linux/portfolio/public/projects/local-wiki.png`

Alternatively, Claude can capture via Bash:
```bash
# With the app focused, capture the frontmost window
screencapture -o -w ~/develop/tools/src/github.com/izz-linux/portfolio/public/projects/local-wiki.png
```

- [ ] **Step 3: Capture addressable screenshot**

Ask the user to:
1. `cd ~/develop/tools/src/github.com/izz-linux/addressable`
2. `bun run report:problems -- --html` (or an equivalent HTML report command)
3. Open the generated HTML in a browser, capture a clean view showing the treemap or problems list
4. Save to `~/develop/tools/src/github.com/izz-linux/portfolio/public/projects/addressable.png`

- [ ] **Step 4: Visual check**

```bash
npm run dev
```

Open http://localhost:3000/projects in a browser. Verify:
- Both featured screenshots load (no broken images)
- Code snippet for terraform-modules renders with highlighting in both light and dark mode
- Grid tiles show SVG placeholders with language colors
- Mobile layout stacks correctly (resize browser to <768px)
- Dark mode: flip OS setting or browser devtools → all backgrounds/borders/text adapt

- [ ] **Step 5: Commit**

```bash
git add public/projects/local-wiki.png public/projects/addressable.png
git commit -m "feat: add screenshots for local-wiki and addressable featured projects"
```

---

### Task 10: Final verification and PR

**Goal:** Run the full verification gate and open a PR.

- [ ] **Step 1: Run the full test suite**

```bash
npm run test:run
```

Expected: all tests pass (5 files, ~29 tests).

- [ ] **Step 2: Run lint**

```bash
npm run lint
```

Expected: no errors.

- [ ] **Step 3: Run production build**

```bash
npm run build
```

Expected: build succeeds. The new `/projects` route appears in the Next.js route summary.

- [ ] **Step 4: Smoke test production build**

```bash
npm start
```

Visit http://localhost:3000/projects — verify render.

- [ ] **Step 5: Push the branch and open PR**

```bash
git push -u origin feature/projects-page
gh pr create --title "feat: add /projects showcase page" --body "$(cat <<'EOF'
## Summary
- New `/projects` route with 3 featured project cards (local-wiki, addressable, terraform-modules) and 6 grid tiles
- Adds Vitest + @testing-library/react + happy-dom as the test stack (first tests in the repo)
- Adds `prism-react-renderer` for code-snippet syntax highlighting

## Test plan
- [ ] `npm run test:run` — all unit tests pass
- [ ] `npm run lint` — clean
- [ ] `npm run build` — succeeds
- [ ] Visit `/` — Projects link visible in header
- [ ] Visit `/projects` — featured section + grid render, screenshots load
- [ ] Resize below 768px — layout stacks
- [ ] Toggle OS dark mode — colors adapt

🤖 Generated with [Claude Code](https://claude.com/claude-code)
EOF
)"
```

- [ ] **Step 6: Confirm PR URL with user**

---

## Self-review checklist (done while writing this plan)

- **Spec coverage:** All spec sections are covered — routing (Task 7), nav (Task 8), data model (Task 2), components (Tasks 3-6), assets (Task 9), testing (Task 1 + every component task), dependencies (Tasks 1 + 3).
- **Placeholder scan:** No `TBD`, `TODO`, or "implement later" placeholders. All code steps include complete code.
- **Type consistency:** `Project`, `ProjectMedia`, `ProjectsData` types are defined in Task 2 and used consistently by every component. Named exports (`Badge`, `CodeSnippet`, `LanguagePlaceholder`, `FeaturedProject`, `ProjectTile`) align across tasks.
- **Known limitation surfaced:** HCL highlighted via `bash` token grammar — called out in Task 3.

---

## Resume State (2026-04-18)

Work was paused here and is being handed off to a fresh Claude session launched from the portfolio repo directly. To continue:

> *Continue executing `docs/superpowers/plans/2026-04-17-projects-page.md` using the superpowers:subagent-driven-development skill. Start at Task 3.*

**Branch:** `feature/projects-page` off `main`

**Completed tasks (all committed to `feature/projects-page`):**

| Task | Status | Commit | Notes |
|------|--------|--------|-------|
| 1. Test infrastructure (Vitest + Testing Library + happy-dom) | ✅ Done | `1ec6e5f` | Spec + code quality reviews passed |
| — Pre-existing lint fix (3 React Compiler errors) | ✅ Done | `c42f19d` | Out-of-plan but necessary; `npm run lint` now clean |
| 2. Projects data model, loader, seed data (9 projects) | ✅ Done | `ee67b17` | Spec + code quality reviews passed; 5 tests green |

**Current state:**
- Working tree clean
- All tests passing: `npm run test:run`
- Lint clean: `npm run lint`
- Build succeeds: `npm run build`

**Next task:** Task 3 — CodeSnippet component (installs `prism-react-renderer`, creates component + tests). See Task 3 in this plan for exact steps.

**Remaining:** Tasks 3 through 10.

**Known carryover items:**
- Two minor code-review suggestions from Task 2 are noted but deliberately not addressed (low value, not required to proceed): empty-string `description` on grid projects could be omitted entirely, and `terraform-modules` media could set `language: "hcl"` instead of `"bash"` with the fallback in `CodeSnippet`. Leave unless the pattern becomes a real problem.
