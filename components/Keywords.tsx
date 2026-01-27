import { Badge } from "@/components/Badge";
import { highlightParts } from "@/lib/search";
import { SPACING, TEXT } from "@/lib/constants";

type Props = {
  keywords: string[];
  query: string;
  onPick: (kw: string) => void;
};

function Highlight({ text, query }: { text: string; query?: string }) {
  const parts = highlightParts(text, query ?? "");
  return (
    <>
      {parts.map((p, i) =>
        p.hit ? (
          <mark key={i} className="bg-yellow-200 dark:bg-yellow-900">
            {p.text}
          </mark>
        ) : (
          <span key={i}>{p.text}</span>
        )
      )}
    </>
  );
}

export default function Keywords({ keywords, query, onPick }: Props) {
  const q = query.trim().toLowerCase();
  const filtered = q ? keywords.filter((k) => k.toLowerCase().includes(q)) : keywords;

  if (!filtered.length) return null;

  return (
    <div className={SPACING.sm.spaceY}>
      <div className="flex items-baseline justify-between">
        <h2 className="text-sm font-semibold text-gray-900 dark:text-gray-100">{TEXT.KEYWORDS_TITLE}</h2>
        <div className="text-xs text-gray-500 dark:text-gray-400">
          {filtered.length} {TEXT.KEYWORDS_COUNT_SUFFIX}
        </div>
      </div>

      <div className={`flex flex-wrap ${SPACING.xs.gap}`}>
        {filtered.map((k) => (
          <Badge key={k} onClick={() => onPick(k)}>
            <Highlight text={k} query={query} />
          </Badge>
        ))}
      </div>
    </div>
  );
}

