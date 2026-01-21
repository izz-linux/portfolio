import { Badge } from "@/components/Badge";
import { SPACING, TEXT } from "@/lib/constants";

type Props = {
  keywords: string[];
  query: string;
  onPick: (kw: string) => void;
};

export default function Keywords({ keywords, query, onPick }: Props) {
  const q = query.trim().toLowerCase();
  const filtered = q ? keywords.filter((k) => k.toLowerCase().includes(q)) : keywords;

  return (
    <div className={SPACING.sm.spaceY}>
      <div className="flex items-baseline justify-between">
        <h2 className="text-sm font-semibold text-gray-900">{TEXT.KEYWORDS_TITLE}</h2>
        <div className="text-xs text-gray-500">
          {filtered.length} {TEXT.KEYWORDS_COUNT_SUFFIX}
        </div>
      </div>

      <div className={`flex flex-wrap ${SPACING.xs.gap}`}>
        {filtered.map((k) => (
          <Badge key={k} onClick={() => onPick(k)}>
            {k}
          </Badge>
        ))}
      </div>
    </div>
  );
}

