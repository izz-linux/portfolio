# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Interactive portfolio/resume website for Izz Noland built with Next.js 16 (App Router), React 19, TypeScript, and Tailwind CSS v4. Features searchable professional experience with visual timeline, interactive cards, and real-time keyword filtering.

## Development Commands

### Core Development
```bash
pnpm dev            # Start development server at http://localhost:3000
pnpm build          # Build for production
pnpm start          # Start production server
pnpm lint           # Run ESLint
pnpm test           # Run Vitest in watch mode
pnpm test:run       # Run Vitest once
```

This project uses pnpm (pinned via `packageManager` in package.json). Enable it with `corepack enable` if not already active.

### Docker
```bash
docker build -t portfolio .                    # Build container
docker run -p 3000:3000 portfolio             # Run container
```

## Architecture

### Directory Structure
- `app/` - Next.js App Router pages and layouts
- `components/` - Reusable React components (all client components)
- `lib/` - Utility functions and type definitions
- `data/` - Static data files (profile.json)
- `public/` - Static assets

### Client vs Server Components
- **Server Components**: `app/layout.tsx` only
- **Client Components**: All other components (`page.tsx`, `components/*`)
  - All use `"use client"` directive
  - Main page manages all interactivity state

### Data Flow
1. Profile data sourced from `data/profile.json`
2. Loaded via `getProfile()` in `lib/profile.ts` at build time
3. Filtered in-memory using `matchesExperience()` from `lib/search.ts`
4. No API routes or server-side data fetching

### State Management
All state lives in `app/page.tsx` using React hooks:
- `query` - Current search term
- `selectedId` - Which timeline entry is selected
- `focusKey` - Trigger for card open animation
- `filteredExperience` - Memoized filtered results

### Key Patterns
- **Memoization**: `useMemo` for profile loading and filtered experience
- **Refs**: `useRef` for DOM element tracking and scroll behavior
- **Text Highlighting**: Safe implementation via `highlightParts()` returns structured parts, no `dangerouslySetInnerHTML`
- **Path Alias**: `@/*` resolves to project root (configured in `tsconfig.json`)

## Key Files

### Type Definitions (`lib/profile.ts`)
Core types: `Profile`, `ExperienceItem`, `SkillGroup`, `LinkItem`
- Experience dates use `YYYY-MM` format
- `endDate` is `null` for current positions

### Search Utilities (`lib/search.ts`)
- `matchesExperience(e, query)` - Full-text search across experience fields
- `highlightParts(text, query)` - Splits text into highlighted parts
- `formatDateRange(start, end)` - Formats dates as "MMM YYYY — MMM YYYY"

### Main Page (`app/page.tsx`)
- Manages filtering, selection, and scroll behavior
- Uses smooth scrolling to cards when timeline entry clicked
- Implements keyboard focus management

## Configuration Notes

### React Compiler
Enabled via `next.config.ts` with `reactCompiler: true`. This provides automatic memoization optimizations.

### Tailwind CSS v4
- Uses PostCSS plugin approach (`@tailwindcss/postcss`)
- Theme defined inline in `app/globals.css` with CSS variables
- Dark mode via `prefers-color-scheme` media query

### TypeScript
- Strict mode enabled
- Target: ES2017
- Path alias: `@/*` → `./*`

## Modifying Content

To update resume data, edit `data/profile.json`:
- Add experience entries with `id`, `company`, `title`, dates, `bullets`, `skillsUsed`
- Dates must be `YYYY-MM` format
- Skills are grouped by category
- Keywords array used for filtering

## Component Structure

### Interactive Components
- `SearchBar` - Controlled input with clear button
- `Timeline` - Visual date markers, clickable to select experience
- `ExperienceCard` - Expandable cards with details, bullets, skills
- `Skills` - Grouped skill badges
- `Keywords` - Clickable keyword filters

### Component Communication
- Parent (`page.tsx`) passes props down
- Child components call handler props for state updates
- No global state management library
