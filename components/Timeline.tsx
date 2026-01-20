import type { ExperienceItem } from "@/lib/profile";
import ExperienceCard from "./ExperienceCard";

type Props = {
  items: ExperienceItem[];
  query: string;
};

export default function Timeline({ items, query }: Props) {
  return (
    <div className="relative">
      <div className="absolute left-3 top-0 h-full w-px bg-gray-200" />
      <div className="space-y-6">
        {items.map((item, idx) => (
          <div key={item.id} className="relative pl-10">
            <div className="absolute left-[6px] top-4 h-3 w-3 rounded-full border border-gray-300 bg-white" />
            <ExperienceCard item={item} query={query} defaultOpen={idx === 0} />
          </div>
        ))}
      </div>
    </div>
  );
}

