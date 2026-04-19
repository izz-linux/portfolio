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
| 2 | **addressable** | `izz-linux/addressable` (private) | Screenshot of the interactive HTML problems/treemap viewer or ASCII subnet map; "Source private" note |
| 3 | **terraform-modules** | `izz-linux/terraform-modules` (public) | HCL code snippet (representative module usage) rather than screenshot |

### Grid projects (minimal tiles)

1. **budget-mgmt** — Node + Go personal finance app
2. **InternetMonitor** — Shell scripts for connectivity monitoring
3. **advent-of-code-2025** — Go algorithmic puzzles
4. **OTP** — Go one-time-password generator
5. **find-dupes** — Python duplicate-file finder
6. **portfolio** — This site (Next.js 16 / React 19 / Tailwind v4)

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
| addressable | `public/projects/addressable.png` | Screenshot of the generated HTML problems viewer or treemap (`bun run report:problems -- --html`); or a terminal capture of the ASCII subnet map |
| terraform-modules | No image — inline HCL snippet | Pulled from a representative module in the repo |
| budget-mgmt, InternetMonitor, advent-of-code-2025, OTP, find-dupes, portfolio | SVG placeholders | Generated: repo language color + name centered. Committed as `public/projects/<id>.svg` |

## Testing

The existing project has no test infrastructure. This feature introduces it.

**Stack:**
- **Vitest** — fast, Vite-native, no Jest config drag
- **@testing-library/react** + **@testing-library/jest-dom**
- **happy-dom** as the test environment (lighter than jsdom, sufficient for these components)

**Config:**
- `vitest.config.ts` at repo root, setting `environment: "happy-dom"` and `setupFiles: ["./test-setup.ts"]`
- `test-setup.ts` imports `@testing-library/jest-dom/vitest`
- `package.json` adds `"test": "vitest"` and `"test:run": "vitest run"` scripts
- TypeScript `tsconfig.json` updated to include Vitest globals via `types: ["vitest/globals"]` if we opt into globals (otherwise import `describe`/`it`/`expect` per-file — preference: explicit imports)

**Tests to write:**

1. **`lib/projects.test.ts`** (loader)
   - `getProjects()` returns a non-empty `projects` array
   - Each project has the required fields (`id`, `name`, `tagline`, `tech`, `featured`)
   - Featured projects have `media` defined
   - Projects marked `repoPrivate: true` do not expose a `repo` URL

2. **`components/FeaturedProject.test.tsx`**
   - Renders name, tagline, description, and all `tech` badges
   - Image media: renders `<img>` with correct `src` and `alt`
   - Code media: renders the code block with the correct language label
   - Private repo: shows "Source private" and does NOT render a repo `<a>`
   - Public repo: renders repo `<a>` with the correct `href`

3. **`components/ProjectTile.test.tsx`**
   - Renders name, tagline, and tech badges
   - Renders SVG placeholder when no `media` is provided
   - Private repo: no repo link rendered; public repo: link rendered

4. **`components/CodeSnippet.test.tsx`** (thin)
   - Renders the provided code inside a `<pre>` / `<code>`
   - Applies the language to the root element as a `data-language` attribute (for targeted testing without coupling to highlighter internals)

**Verification gates before PR:**
- `npm run test:run` — all tests pass
- `npm run lint` — passes
- `npm run build` — succeeds
- Manual browser check: `npm run dev`, visit `/` and `/projects`, verify dark mode + mobile layout

## Out of scope for this spec

- Per-project detail pages (`/projects/[slug]`) — could be added later; not needed for the lighter "personal showcase" angle
- RSS / Atom feed of projects
- Tagging/filtering UI
- Analytics events on project clicks

## Dependencies to add

**Runtime:**
- `prism-react-renderer` — syntax highlighting for the terraform-modules code snippet. ~40KB gzipped, MIT-licensed, React-native, no runtime DOM mutation.

**Dev:**
- `vitest`
- `@testing-library/react`
- `@testing-library/jest-dom`
- `happy-dom`
- `@vitejs/plugin-react` (required by Vitest to transform TSX)

## Implementation ordering (for the follow-up plan)

1. Test infrastructure (Vitest + @testing-library/react + happy-dom; config; scripts)
2. Data model + loader with tests (`data/projects.json`, `lib/projects.ts`, `lib/projects.test.ts`)
3. `CodeSnippet` + tests
4. `FeaturedProject` + tests
5. `ProjectTile` + tests
6. `app/projects/page.tsx` page shell
7. Asset generation (SVG placeholders + real screenshots for local-wiki and addressable)
8. Nav link in `profile.json`
9. `npm run test:run` + `npm run lint` + `npm run build` verification
10. PR against `main`
