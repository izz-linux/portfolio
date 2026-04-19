# Interactive Portfolio & Resume

An interactive portfolio and resume website featuring searchable professional experience, visual timeline navigation, and real-time keyword filtering. Built with modern web technologies to provide an engaging way to explore professional history and skills.

## Features

- **Visual Timeline**: Interactive timeline showing career progression with clickable entries
- **Searchable Experience**: Full-text search across job titles, companies, descriptions, and skills
- **Real-time Filtering**: Instantly filter experience by keywords with highlighted matches
- **Expandable Cards**: Detailed view of each position with responsibilities, achievements, and skills used
- **Skills Showcase**: Organized skill categories with visual badges
- **Keyword Navigation**: Quick-search via clickable keyword tags
- **Responsive Design**: Optimized layout for desktop and mobile devices
- **Dark Mode Support**: Automatically adapts to system color scheme preferences

## Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org) with App Router
- **UI Library**: [React 19](https://react.dev) with React Compiler
- **Language**: [TypeScript 5](https://www.typescriptlang.org) (strict mode)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com) with PostCSS
- **Fonts**: [Geist Sans & Mono](https://vercel.com/font) via `next/font`
- **Build Tool**: [Turbopack](https://turbo.build/pack)

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
├── app/                    # Next.js App Router
│   ├── layout.tsx         # Root layout with metadata
│   ├── page.tsx           # Main portfolio page
│   └── globals.css        # Global styles & Tailwind
├── components/            # React components
│   ├── Badge.tsx          # Reusable badge component
│   ├── ExperienceCard.tsx # Expandable experience card
│   ├── Keywords.tsx       # Clickable keyword filters
│   ├── SearchBar.tsx      # Search input with clear
│   ├── Skills.tsx         # Skills grouped by category
│   └── Timeline.tsx       # Visual timeline component
├── lib/                   # Utilities and configuration
│   ├── constants.ts       # Centralized constants
│   ├── profile.ts         # Profile data types & loader
│   └── search.ts          # Search & highlight utilities
├── data/                  # Static data
│   └── profile.json       # Resume data (editable)
└── public/                # Static assets
```

## Customization

### Update Resume Content

Edit `data/profile.json` to update:

- Personal information (name, headline, links)
- Professional summary
- Work experience (with dates in `YYYY-MM` format)
- Skills grouped by category
- Searchable keywords

### Modify Styling

- **Global Configuration**: Edit `lib/constants.ts` for spacing, colors, and layout values
- **Component Styles**: Update individual component files in `components/`
- **Theme Colors**: Modify CSS variables in `app/globals.css`

### Add New Features

- **Components**: Add new React components in `components/`
- **Pages**: Create new routes in `app/` directory
- **Utilities**: Add helper functions in `lib/`

## Architecture Highlights

- **Client-Side Rendering**: All interactivity handled client-side with React state
- **Static Data**: Resume content loaded at build time from JSON
- **No Backend**: Fully static site with no API routes or database
- **Type-Safe**: Full TypeScript coverage with strict type checking
- **Memoization**: Optimized rendering with `useMemo` and React Compiler
- **Accessibility**: Semantic HTML, ARIA labels, and keyboard navigation support

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
