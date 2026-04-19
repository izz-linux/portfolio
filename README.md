# Interactive Portfolio & Resume

An interactive portfolio and resume website featuring searchable professional experience, visual timeline navigation, and real-time keyword filtering. Built with modern web technologies to provide an engaging way to explore professional history and skills.

## Features

- **Visual Timeline**: Interactive timeline showing career progression with clickable entries
- **Searchable Experience**: Full-text search across job titles, companies, descriptions, and skills
- **Real-time Filtering**: Instantly filter experience by keywords with highlighted matches
- **Expandable Cards**: Detailed view of each position with responsibilities, achievements, and skills used
- **Skills Showcase**: Organized skill categories with visual badges
- **Keyword Navigation**: Quick-search via clickable keyword tags
- **Projects Page** (`/projects`): Dedicated showcase with featured projects (image or syntax-highlighted code snippet) and a grid of secondary tiles with SVG language placeholders
- **Responsive Design**: Optimized layout for desktop and mobile devices
- **Dark Mode Support**: Automatically adapts to system color scheme preferences

## Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org) with App Router
- **UI Library**: [React 19](https://react.dev) with React Compiler
- **Language**: [TypeScript 5](https://www.typescriptlang.org) (strict mode)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com) with PostCSS
- **Fonts**: [Geist Sans & Mono](https://vercel.com/font) via `next/font`
- **Syntax Highlighting**: [prism-react-renderer](https://github.com/FormidableLabs/prism-react-renderer) for project code snippets
- **Testing**: [Vitest](https://vitest.dev) + [Testing Library](https://testing-library.com/react) on [happy-dom](https://github.com/capricorn86/happy-dom)
- **Package Manager**: [pnpm](https://pnpm.io) (pinned via `packageManager` field)
- **Build Tool**: [Turbopack](https://turbo.build/pack)
- **CI/CD**: GitHub Actions with [semantic-release](https://semantic-release.gitbook.io), publishing to Docker Hub and GCP Artifact Registry, deploying to Google Cloud Run

## Getting Started

This project uses [pnpm](https://pnpm.io). Enable it with `corepack enable` if not already active.

### Development

Install dependencies:

```bash
pnpm install
```

Run the development server:

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

### Production Build

Build for production:

```bash
pnpm build
```

Start the production server:

```bash
pnpm start
```

### Docker

Build and run with Docker:

```bash
docker build -t portfolio .
docker run -p 3000:3000 portfolio
```

### Linting and Tests

```bash
pnpm lint         # ESLint
pnpm test:run     # Vitest, single run
pnpm test         # Vitest, watch mode
```

## Project Structure

```
portfolio/
├── app/                       # Next.js App Router
│   ├── layout.tsx             # Root layout with metadata
│   ├── page.tsx               # Main portfolio / resume page
│   ├── projects/
│   │   ├── page.tsx           # /projects showcase page
│   │   └── page.test.tsx      # Route-level rendering tests
│   ├── sitemap.xml/           # Dynamic sitemap route
│   └── globals.css            # Global styles & Tailwind theme
├── components/                # React components (all client)
│   ├── Badge.tsx              # Reusable badge component
│   ├── Certifications.tsx     # Certifications list
│   ├── CodeSnippet.tsx        # Syntax-highlighted code block (light/dark themes)
│   ├── ExperienceCard.tsx     # Expandable experience card
│   ├── FeaturedProject.tsx    # Two-column featured project with image or code
│   ├── Keywords.tsx           # Clickable keyword filters
│   ├── LanguagePlaceholder.tsx# SVG color swatch keyed by project language
│   ├── ProjectTile.tsx        # Grid tile for secondary projects
│   ├── SearchBar.tsx          # Search input with clear
│   ├── Skills.tsx             # Skills grouped by category
│   ├── Timeline.tsx           # Visual timeline component
│   └── *.test.tsx             # Component tests (Vitest + Testing Library)
├── lib/                       # Utilities and types
│   ├── constants.ts           # Centralized spacing and layout tokens
│   ├── profile.ts             # Profile data types & loader
│   ├── projects.ts            # Project data types & loader
│   ├── projects.test.ts       # Projects loader tests
│   └── search.ts              # Search & highlight utilities
├── data/                      # Static JSON content
│   ├── profile.json           # Resume data (editable)
│   └── projects.json          # Projects data (editable)
├── public/
│   └── projects/              # Project screenshots and thumbnails
├── .github/workflows/
│   ├── ci.yml                 # Lint + test + build on PRs and main
│   ├── release.yml            # semantic-release → Docker Hub + GCP AR → Cloud Run
│   └── deploy.yml             # Manual Cloud Run redeploy (workflow_dispatch)
├── Dockerfile                 # Multi-stage build using pnpm
├── .releaserc.json            # semantic-release config
└── test-setup.ts              # Vitest setup (jest-dom, cleanup)
```

## Customization

### Update Resume Content

Edit `data/profile.json` to update:

- Personal information (name, headline, links)
- Professional summary
- Work experience (with dates in `YYYY-MM` format; `endDate` is `null` for current positions)
- Skills grouped by category
- Searchable keywords
- Header links (e.g. the `/projects` link)

### Update Projects Content

Edit `data/projects.json` to update the `/projects` page:

- `featured: true` promotes a project into the two-column featured section
- `media.kind: "image"` renders a screenshot from `public/projects/...`
- `media.kind: "code"` renders a syntax-highlighted snippet via `CodeSnippet`
- Omit `media` to fall back to a `LanguagePlaceholder` SVG keyed off the project's primary language
- `repo` and `demo` become external links; `repoPrivate: true` swaps the repo link for a "Source private" label

### Modify Styling

- **Global Configuration**: Edit `lib/constants.ts` for spacing and layout tokens
- **Component Styles**: Update individual component files in `components/`
- **Theme Colors**: Modify CSS variables in `app/globals.css`

### Add New Features

- **Components**: Add new React components in `components/`, co-locate `*.test.tsx`
- **Pages**: Create new routes in `app/` directory
- **Utilities**: Add helper functions in `lib/`
- **Data**: Add typed JSON files in `data/` and matching loaders in `lib/`

## Architecture Highlights

- **Client-Side Rendering**: All interactivity handled client-side with React state
- **Static Data**: Resume and project content loaded at build time from JSON
- **No Backend**: Fully static site with no API routes or database
- **Type-Safe**: Full TypeScript coverage with strict type checking, including discriminated unions for `ProjectMedia`
- **Memoization**: Optimized rendering with `useMemo` and React Compiler
- **Accessibility**: Semantic HTML, ARIA labels, and keyboard navigation support
- **Theme-Aware Syntax Highlighting**: `CodeSnippet` renders both light and dark code blocks and toggles via Tailwind's `dark:` variants — no runtime theme state

## Deployment

The `release.yml` workflow runs on every push to `main`:

1. **release** — semantic-release analyzes conventional commits and cuts a GitHub release
2. **docker** — builds the image once and pushes versioned tags to both Docker Hub (`izznoland/izzportfolio`) and GCP Artifact Registry (`us-central1-docker.pkg.dev/logical-river-432714-d3/portfolio/izzportfolio`)
3. **publish** — deploys the new image to the `portfolio` Cloud Run service in `us-central1`

`deploy.yml` provides a manual `workflow_dispatch` entry point for redeploying an existing Artifact Registry tag without cutting a new release.

## Performance

- **Static Generation**: Pre-rendered at build time for fast initial load
- **React Compiler**: Automatic memoization and optimization
- **Turbopack**: Fast bundling and hot module replacement
- **Font Optimization**: Automatic font loading and optimization with `next/font`

## Browser Support

Modern browsers with ES2017+ support:
- Chrome/Edge 90+
- Firefox 88+
- Safari 14+

## License

This project is open source and available for personal and commercial use.
