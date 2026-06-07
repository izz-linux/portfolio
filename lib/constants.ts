// UI Configuration Constants

// Spacing Classes - Full Tailwind classes for proper JIT compilation
export const SPACING = {
  xs: {
    gap: "gap-2",
    mt: "mt-2",
    mb: "mb-2",
    pt: "pt-2",
    pb: "pb-2",
    spaceY: "space-y-2",
  },
  sm: {
    gap: "gap-3",
    mt: "mt-3",
    mb: "mb-3",
    pt: "pt-3",
    pb: "pb-3",
    spaceY: "space-y-3",
  },
  md: {
    gap: "gap-4",
    mt: "mt-4",
    mb: "mb-4",
    pt: "pt-4",
    pb: "pb-4",
    spaceY: "space-y-4",
  },
  lg: {
    gap: "gap-6",
    mt: "mt-6",
    mb: "mb-6",
    pt: "pt-6",
    pb: "pb-6",
    spaceY: "space-y-6",
  },
  xl: {
    gap: "gap-8",
    mt: "mt-8",
    mb: "mb-8",
    pt: "pt-8",
    pb: "pb-8",
    spaceY: "space-y-8",
  },
  "2xl": {
    gap: "gap-10",
    mt: "mt-10",
    mb: "mb-10",
    pt: "pt-10",
    pb: "pb-10",
    spaceY: "space-y-10",
  },
} as const;

// Timeline Component Configuration
export const TIMELINE = {
  // Layout dimensions
  MIN_HEIGHT: 400,           // Minimum height for timeline
  HEIGHT_PER_YEAR: 80,       // Height allocated per year of experience
  TOP_PAD: 16,
  BOTTOM_PAD: 16,
  AXIS_X: 28,
  BAR_X: 56,
  BAR_W: 14,
  LABEL_X: 140,

  // Spacing and offsets
  YEAR_LABEL_OFFSET: 4,
  YEAR_LABEL_TOP_OFFSET: -8,
  LABEL_VERTICAL_OFFSET: 16,
  LABEL_WIDTH_OFFSET: 160,

  // Date range padding (in months). The top headroom holds the upcoming-year
  // tick and the moving "Present" marker, so it stays under a full year to keep
  // the gap intentional rather than cavernous.
  DATE_PADDING_MONTHS: 9,
} as const;

// Animation & Interaction
export const ANIMATION = {
  CARD_SCROLL_DELAY_MS: 250,
  CARD_SELECTED_SCALE: "1.01",
} as const;

// Layout Constraints
export const LAYOUT = {
  MAX_WIDTH: "max-w-5xl",
  PAGE_PADDING_X: "px-4",
  PAGE_PADDING_Y: "py-10",
} as const;

// Text Content
export const TEXT = {
  SEARCH_PLACEHOLDER: 'Try "terraform", "kubernetes", "incident"...',
  NO_MATCHES: "No matches. Try a different search term.",
  TIMELINE_TITLE: "Timeline",
  EXPERIENCE_TITLE: "Experience Details",
  SKILLS_TITLE: "Skills",
  CERTIFICATIONS_TITLE: "Certifications",
  KEYWORDS_TITLE: "Keywords",
  KEYWORDS_COUNT_SUFFIX: "shown",
} as const;

// Color Variants for Selection States
export const SELECTION = {
  CARD_BORDER_SELECTED: "border-blue-300 dark:border-blue-600",
  CARD_BORDER_DEFAULT: "border-gray-200 dark:border-gray-700",
  CARD_SHADOW_SELECTED: "shadow-lg",
  CARD_SHADOW_DEFAULT: "shadow-sm",
  CARD_RING_SELECTED: "ring-2 ring-blue-200 dark:ring-blue-800",

  BADGE_SELECTED: "border-blue-200 bg-blue-50 text-blue-900 dark:border-blue-700 dark:bg-blue-950 dark:text-blue-100",
  BADGE_DEFAULT: "border-gray-200 bg-gray-50 text-gray-700 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300",

  TIMELINE_BAR_SELECTED: "bg-blue-700 dark:bg-blue-500",
  TIMELINE_BAR_DEFAULT: "bg-blue-900 dark:bg-blue-700",
} as const;
