import type { SkillGroup } from "@/lib/profile";
import { Badge } from "@/components/Badge";
import { highlightParts } from "@/lib/search";
import { SPACING, TEXT } from "@/lib/constants";

type Props = {
  groups: SkillGroup[];
  query?: string;
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

export default function Skills({ groups, query }: Props) {
  const q = (query ?? "").trim().toLowerCase();

  // Filter groups to only show those with matching skills
  const filteredGroups = q
    ? groups
        .map((g) => ({
          ...g,
          items: g.items.filter(
            (s) => s.toLowerCase().includes(q) || g.group.toLowerCase().includes(q)
          ),
        }))
        .filter((g) => g.items.length > 0)
    : groups;

  if (!filteredGroups.length) return null;

  return (
    <div className={SPACING.md.spaceY}>
      <h2 className="text-sm font-semibold text-gray-900 dark:text-gray-100">{TEXT.SKILLS_TITLE}</h2>
      {filteredGroups.map((g) => (
        <div key={g.group}>
          <div className="text-xs font-semibold text-gray-700 dark:text-gray-300">
            <Highlight text={g.group} query={query} />
          </div>
          <div className={`${SPACING.xs.mt} flex flex-wrap ${SPACING.xs.gap}`}>
            {g.items.map((s) => (
              <Badge key={s} className="bg-white dark:bg-gray-800">
                <Highlight text={s} query={query} />
              </Badge>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

