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
  /** When true, suppresses the SVG text labels (use when surrounding UI already shows these values). */
  hideText?: boolean;
};

export function LanguagePlaceholder({ name, language, hideText = false }: LanguagePlaceholderProps) {
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
      {!hideText && (
        <>
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
        </>
      )}
    </svg>
  );
}
