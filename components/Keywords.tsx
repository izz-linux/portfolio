type Props = {
  keywords: string[];
  query: string;
  onPick: (kw: string) => void;
};

export default function Keywords({ keywords, query, onPick }: Props) {
  const q = query.trim().toLowerCase();
  const filtered = q ? keywords.filter((k) => k.toLowerCase().includes(q)) : keywords;

  return (
    <div className="space-y-3">
      <div className="flex items-baseline justify-between">
        <h2 className="text-sm font-semibold text-gray-900">Keywords</h2>
        <div className="text-xs text-gray-500">{filtered.length} shown</div>
      </div>

      <div className="flex flex-wrap gap-2">
        {filtered.map((k) => (
          <button
            key={k}
            type="button"
            onClick={() => onPick(k)}
            className="rounded-full border border-gray-200 bg-gray-50 px-2 py-1 text-xs text-gray-700 hover:bg-gray-100"
            title="Click to search"
          >
            {k}
          </button>
        ))}
      </div>
    </div>
  );
}

