# Projects Page — Design Spec

**Date:** 2026-04-17
**Status:** Draft — awaiting user review
**Target site:** https://portfolio.izznoland.dev

## Goal

Add a `/projects` page to the portfolio site showcasing personal and open-source work. Purpose is a **personal showcase** — broader collection of projects the user is proud of, lighter treatment per project, scannable. Not a hiring-funnel case-study page.

## Non-goals

- Deep case studies or long-form writeups (deferred; not needed for this page's purpose)
- Blog posts or project retrospectives
- Live demos or interactive embeds
- Client-side search/filter on projects (experience page has this; projects list is short enough to omit)

## Scope

One new route, two new components, one new data file, one new loader, a small number of image assets. One-line addition to existing header links. No changes to existing experience/timeline/skills behavior.

## Page treatment

**Mixed layout:** 3 featured projects with rich treatment, followed by a grid of 5 minimal project tiles. Matches the existing site aesthetic (clean, dark-mode aware, `Badge` component for tech tags, underline-on-hover links).

### Featured projects (rich cards)

| # | Project | Repo | Media |
|---|---------|------|-------|
| 1 | **local-wiki** | `izz-linux/local-wiki` (private) | 1-2 screenshots of the running Mac app; "Source private" note in lieu of repo link |
| 2 | **terraform-modules** | `izz-linux/terraform-modules` (public) | HCL code snippet (representative module usage) rather than screenshot |
| 3 | **portfolio** (this site) | `izz-linux/portfolio` (public) | Screenshot of the landing page |

### Grid projects (minimal tiles)

1. **budget-mgmt** — Node + Go personal finance app
2. **InternetMonitor** — Shell scripts for connectivity monitoring
3. **advent-of-code-2025** — Go algorithmic puzzles
4. **OTP** — Go one-time-password generator
5. **find-dupes** — Python duplicate-file finder

Grid tiles use generated SVG placeholders (repo language + name on colored background) rather than screenshots — keeps visual weight proportional to content importance.

## Routing & navigation

- **Route:** `app/projects/page.tsx` (Next.js App Router, `"use client"` per repo convention)
- **Nav integration:** add a `Projects` entry to `profile.links` in `data/profile.json`. Renders in the existing header links row on the home page. The projects page itself renders the same header (name, headline, links) so users can navigate back.
- **Back-link:** the `name` and `headline` in the page header are wrapped in a `Link` to `/`, matching common portfolio convention. No separate "Home" link needed. On `/projects`, the `Projects` link in the header links row is styled active (underline permanent, slightly darker).

## Data model

New file: `data/projects.json`. Keeps `profile.json` focused on resume data.

```ts
// lib/projects.ts
export type ProjectMedia =
  | { kind: "image"; src: string; alt: string; caption?: string }
  | { kind: "code"; code: string; language: string; caption?: string };

export type Project = {
  id: string;              // slug, e.g. "local-wiki"
  name: string;            // display name
  tagline: string;         // 1-line, for grid + card subtitle
  description: string;     // 2-3 sentences, featured only
  tech: string[];          // rendered as Badge components
  repo?: string;           // omitted when private
  repoPrivate?: boolean;   // drives "Source private" note
  demo?: string;           // live link if any
  featured: boolean;
  media?: ProjectMedia;    // required for featured, optional for grid
};

export type ProjectsData = {
  projects: Project[];
};

export function getProjects(): ProjectsData;
```

Loader mirrors `lib/profile.ts`: JSON import, typed, memoized at module scope.

## Components

Two new components in `components/`, both client components matching repo convention:

### `components/FeaturedProject.tsx`

Renders a single featured project.
- **Layout:** media on one side, content on the other; stacks on mobile (`flex-col md:flex-row`)
- **Media area:**
  - `media.kind === "image"` — `<img>` with `alt`, rounded corners, optional caption below
  - `media.kind === "code"` — syntax-highlighted code block (see Code rendering below)
- **Content area:** name (h2), tagline (subdued), description, tech `Badge` row, links row (repo/demo, or "Source private" note)
- Uses existing `Badge` component and `SPACING`, `LAYOUT`, `TEXT` constants from `lib/constants.ts`

### `components/ProjectTile.tsx`

Compact grid tile.
- **Layout:** small thumbnail (or SVG placeholder), title, tagline, tech badges, links row
- **Grid wrapper in page:** `grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3`
- Hover: subtle border/background change matching existing `ExperienceCard` treatment

### `components/CodeSnippet.tsx` (internal helper)

Thin wrapper around a syntax highlighter. Use `prism-react-renderer` (small, React-native, works with Tailwind, supports HCL). No copy button, no line numbers — can add later if desired. Dark/light-mode aware via Tailwind classes.

## Page shell (`app/projects/page.tsx`)

Mirrors `app/page.tsx` structure:
- Same `LAYOUT.MAX_WIDTH` / `LAYOUT.PAGE_PADDING_X` / `LAYOUT.PAGE_PADDING_Y` wrapper
- Header: name, headline, links (same treatment)
- Section 1: `<h2>Featured</h2>` followed by each `FeaturedProject` stacked vertically with generous spacing
- Section 2: `<h2>More projects</h2>` followed by the grid of `ProjectTile`s

## Asset pipeline

Images live under `public/projects/`. Naming: `<project-id>.png` (or `.svg`).

| Project | Asset | Source |
|---------|-------|--------|
| local-wiki | `public/projects/local-wiki.png` (1-2 shots) | Screenshot of the running Tauri app via `pnpm tauri dev` in the `local-wiki` repo; capture with macOS `screencapture` or ⌘⇧4 |
| terraform-modules | No image — inline HCL snippet | Pulled from a representative module in the repo |
| portfolio | `public/projects/portfolio.png` | Browser screenshot at a nice viewport of the deployed site (or local `npm run dev`) |
| budget-mgmt, InternetMonitor, advent-of-code-2025, OTP, find-dupes | SVG placeholders | Generated: repo language color + name centered. Committed as `public/projects/<id>.svg` |

## Testing

The existing project has no test infrastructure. Scope testing conservatively:
- `lib/projects.ts` loader tested by importing in Node and checking shape — skipped unless user wants to add Vitest. (Default: skip.)
- Visual verification in the browser via `npm run dev` is the verification gate (per repo conventions, no automated UI tests).
- `npm run lint` must pass.
- `npm run build` must succeed.

## Out of scope for this spec

- Per-project detail pages (`/projects/[slug]`) — could be added later; not needed for the lighter "personal showcase" angle
- RSS / Atom feed of projects
- Tagging/filtering UI
- Analytics events on project clicks

## Dependencies to add

- `prism-react-renderer` — syntax highlighting for the terraform-modules code snippet. ~40KB gzipped, MIT-licensed, React-native, no runtime DOM mutation.

## Implementation ordering (for the follow-up plan)

1. Data model + loader (`data/projects.json`, `lib/projects.ts`)
2. `CodeSnippet` + `FeaturedProject` + `ProjectTile` components
3. `app/projects/page.tsx` page shell
4. Asset generation (SVG placeholders + real screenshots)
5. Nav link in `profile.json`
6. `npm run lint` + `npm run build` verification
7. PR against `main`
