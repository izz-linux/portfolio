import type { ExperienceItem } from "@/lib/profile";
import { TIMELINE, SELECTION, SPACING, TEXT } from "@/lib/constants";

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
  const {
    TOP_PAD,
    BOTTOM_PAD,
    MIN_HEIGHT,
    HEIGHT_PER_YEAR,
    AXIS_X,
    BAR_X,
    BAR_W,
    LABEL_X,
    YEAR_LABEL_OFFSET,
    YEAR_LABEL_TOP_OFFSET,
    LABEL_VERTICAL_OFFSET,
    LABEL_WIDTH_OFFSET,
    DATE_PADDING_MONTHS,
  } = TIMELINE;

  const now = new Date();
  const nowYm = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
  const currentMonthNumber = ymToNumber(nowYm);

  const starts = items.map((e) => ymToNumber(e.startDate));
  const ends = items.map((e) => ymToNumber(e.endDate ?? nowYm));

  const minM = Math.min(...starts) - DATE_PADDING_MONTHS;
  // Cap maxM at current month to prevent showing future years
  const maxM = Math.min(Math.max(...ends) + DATE_PADDING_MONTHS, currentMonthNumber);

  const span = Math.max(1, maxM - minM);
  const yearsSpan = Math.ceil(span / 12);

  // Calculate dynamic height based on years of experience
  const HEIGHT = Math.max(MIN_HEIGHT, yearsSpan * HEIGHT_PER_YEAR);
  const innerH = HEIGHT - TOP_PAD - BOTTOM_PAD;

  const yForMonth = (m: number) => {
    const t = (m - minM) / span;        // 0..1 (old..new)
    return TOP_PAD + (1 - t) * innerH;  // invert so new is near TOP
  };


  const minYear = Math.floor(minM / 12);
  const maxYear = Math.floor(maxM / 12);

  const sorted = [...items].sort((a, b) => (a.startDate < b.startDate ? 1 : -1));

  return (
    <div className="relative w-full overflow-hidden rounded-lg border border-gray-200 bg-white p-4">
      <div className={`${SPACING.sm.mb} text-lg font-semibold text-gray-900`}>{TEXT.TIMELINE_TITLE}</div>

      <div className="relative overflow-hidden" style={{ height: HEIGHT }}>
        <div className="absolute top-0 bottom-0 w-px bg-gray-300" style={{ left: AXIS_X }} />

        {Array.from({ length: maxYear - minYear + 1 }).map((_, i) => {
          const year = minYear + i;
          const y = yForMonth(year * 12);
          return (
            <div key={year} className="absolute left-0" style={{ top: y }}>
              <div
                className="absolute h-2 w-2 rounded-full bg-gray-400"
                style={{ left: AXIS_X - YEAR_LABEL_OFFSET, top: -YEAR_LABEL_OFFSET }}
              />
              <div
                className="absolute text-xs text-gray-500"
                style={{
                  left: 0,
                  top: YEAR_LABEL_TOP_OFFSET,
                  width: AXIS_X - 10,
                  textAlign: "right",
                }}
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
                  isSelected ? SELECTION.TIMELINE_BAR_SELECTED : SELECTION.TIMELINE_BAR_DEFAULT
                }`}
                style={{ left: BAR_X, top, width: BAR_W, height: h }}
              />

              {/* connector */}
              <div
                className={`absolute h-px ${
                  isSelected ? SELECTION.TIMELINE_BAR_SELECTED : SELECTION.TIMELINE_BAR_DEFAULT
                }`}
                style={{ left: BAR_X + BAR_W, top: midY, width: LABEL_X - (BAR_X + BAR_W) }}
              />

              {/* label */}
              <div
                className={`absolute rounded-md px-2 py-1 overflow-hidden ${
                  isSelected ? "bg-blue-50" : ""
                }`}
                style={{
                  left: LABEL_X,
                  top: midY - LABEL_VERTICAL_OFFSET,
                  width: `calc(100% - ${LABEL_WIDTH_OFFSET}px)`,
                }}
              >
                <div className="text-sm font-semibold text-gray-900 leading-tight truncate">{e.title}</div>
                <div className="text-xs uppercase tracking-wide text-gray-500 truncate">{e.company}</div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

