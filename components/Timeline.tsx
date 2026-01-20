import type { ExperienceItem } from "@/lib/profile";

type Props = {
  items: ExperienceItem[];
  selectedId: string | null;
  onSelect: (id: string) => void;
};

function ymToNumber(ym: string): number {
  const [y, m] = ym.split("-").map((n) => Number(n));
  return y * 12 + ((m || 1) - 1);
}

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

function shortYear(y: number) {
  return `'${String(y).slice(-2)}`;
}

export default function Timeline({ items, selectedId, onSelect }: Props) {
  const TOP_PAD = 16;
  const BOTTOM_PAD = 16;
  const HEIGHT = 760;
  const AXIS_X = 28;
  const BAR_X = 56;
  const BAR_W = 14;
  const LABEL_X = 140;

  const now = new Date();
  const nowYm = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;

  const starts = items.map((e) => ymToNumber(e.startDate));
  const ends = items.map((e) => ymToNumber(e.endDate ?? nowYm));

  let minM = Math.min(...starts) - 12;
  let maxM = Math.max(...ends) + 12;

  const span = Math.max(1, maxM - minM);
  const innerH = HEIGHT - TOP_PAD - BOTTOM_PAD;

  const yForMonth = (m: number) => {
    const t = (m - minM) / span;        // 0..1 (old..new)
    return TOP_PAD + (1 - t) * innerH;  // invert so new is near TOP
  };
 

  const minYear = Math.floor(minM / 12);
  const maxYear = Math.ceil(maxM / 12);

  const sorted = [...items].sort((a, b) => (a.startDate < b.startDate ? 1 : -1));

  return (
    <div className="relative w-full overflow-visible rounded-lg border border-gray-200 bg-white p-4">
      <div className="mb-3 text-lg font-semibold text-gray-900">Timeline</div>

      <div className="relative" style={{ height: HEIGHT }}>
        <div className="absolute top-0 bottom-0 w-px bg-gray-300" style={{ left: AXIS_X }} />

        {Array.from({ length: maxYear - minYear + 1 }).map((_, i) => {
          const year = minYear + i;
          const y = yForMonth(year * 12);
          return (
            <div key={year} className="absolute left-0" style={{ top: y }}>
              <div className="absolute h-2 w-2 rounded-full bg-gray-400" style={{ left: AXIS_X - 4, top: -4 }} />
              <div
                className="absolute text-xs text-gray-500"
                style={{ left: 0, top: -8, width: AXIS_X - 10, textAlign: "right" }}
              >
                {shortYear(year)}
              </div>
            </div>
          );
        })}

        {sorted.map((e) => {
          const startM = ymToNumber(e.startDate);
          const endM = ymToNumber(e.endDate ?? nowYm);

          const y1 = yForMonth(startM);
          const y2 = yForMonth(endM);
          const top = clamp(Math.min(y1, y2), TOP_PAD, TOP_PAD + innerH);
          const bottom = clamp(Math.max(y1, y2), TOP_PAD, TOP_PAD + innerH);
          const h = Math.max(12, bottom - top);
          const midY = top + h / 2;

          const isSelected = selectedId === e.id;

          return (
            <button
              key={e.id}
              type="button"
              onClick={() => onSelect(e.id)}
              className="absolute left-0 right-0 text-left"
              style={{ top: 0 }}
              aria-label={`Select ${e.title} at ${e.company}`}
            >
              {/* bar */}
              <div
                className={`absolute rounded-full ${
                  isSelected ? "bg-blue-700" : "bg-blue-900"
                }`}
                style={{ left: BAR_X, top, width: BAR_W, height: h }}
              />

              {/* connector */}
              <div
                className={`absolute h-px ${isSelected ? "bg-blue-700" : "bg-blue-900"}`}
                style={{ left: BAR_X + BAR_W, top: midY, width: LABEL_X - (BAR_X + BAR_W) }}
              />

              {/* label */}
              <div
                className={`absolute rounded-md px-2 py-1 ${
                  isSelected ? "bg-blue-50" : ""
                }`}
                style={{ left: LABEL_X, top: midY - 16, width: "calc(100% - 160px)" }}
              >
                <div className="text-sm font-semibold text-gray-900 leading-tight">{e.title}</div>
                <div className="text-xs uppercase tracking-wide text-gray-500">{e.company}</div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

