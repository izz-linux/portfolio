import type { SkillGroup } from "@/lib/profile";

type Props = {
  groups: SkillGroup[];
};

export default function Skills({ groups }: Props) {
  return (
    <div className="space-y-4">
      <h2 className="text-sm font-semibold text-gray-900">Skills</h2>
      {groups.map((g) => (
        <div key={g.group}>
          <div className="text-xs font-semibold text-gray-700">{g.group}</div>
          <div className="mt-2 flex flex-wrap gap-2">
            {g.items.map((s) => (
              <span key={s} className="rounded-full border border-gray-200 bg-white px-2 py-1 text-xs text-gray-700">
                {s}
              </span>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

