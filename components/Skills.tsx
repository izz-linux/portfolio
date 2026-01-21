import type { SkillGroup } from "@/lib/profile";
import { Badge } from "@/components/Badge";
import { SPACING, TEXT } from "@/lib/constants";

type Props = {
  groups: SkillGroup[];
};

export default function Skills({ groups }: Props) {
  return (
    <div className={SPACING.md.spaceY}>
      <h2 className="text-sm font-semibold text-gray-900 dark:text-gray-100">{TEXT.SKILLS_TITLE}</h2>
      {groups.map((g) => (
        <div key={g.group}>
          <div className="text-xs font-semibold text-gray-700 dark:text-gray-300">{g.group}</div>
          <div className={`${SPACING.xs.mt} flex flex-wrap ${SPACING.xs.gap}`}>
            {g.items.map((s) => (
              <Badge key={s} className="bg-white dark:bg-gray-800">
                {s}
              </Badge>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

