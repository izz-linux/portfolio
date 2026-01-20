"use client";

type Props = {
  query: string;
  onChange: (v: string) => void;
};

export default function SearchBar({ query, onChange }: Props) {
  return (
    <div className="w-full">
      <label className="text-sm text-gray-600">Search experience, skills, keywords</label>
      <div className="mt-2 flex gap-2">
        <input
          value={query}
          onChange={(e) => onChange(e.target.value)}
          placeholder='Try "terraform", "kubernetes", "incident"...'
          className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm outline-none focus:border-gray-400"
        />
        <button
          type="button"
          onClick={() => onChange("")}
          className="rounded-md border border-gray-300 px-3 py-2 text-sm hover:bg-gray-50"
        >
          Clear
        </button>
      </div>
    </div>
  );
}

