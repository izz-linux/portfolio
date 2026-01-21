"use client";

import { SPACING, TEXT } from "@/lib/constants";

type Props = {
  query: string;
  onChange: (v: string) => void;
};

export default function SearchBar({ query, onChange }: Props) {
  return (
    <div className="w-full">
      <label className="text-sm text-gray-600 dark:text-gray-400">Search experience, skills, keywords</label>
      <div className={`${SPACING.xs.mt} flex ${SPACING.xs.gap}`}>
        <input
          value={query}
          onChange={(e) => onChange(e.target.value)}
          placeholder={TEXT.SEARCH_PLACEHOLDER}
          className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm outline-none focus:border-gray-400 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 dark:placeholder-gray-500 dark:focus:border-gray-500"
        />
        <button
          type="button"
          onClick={() => onChange("")}
          className="rounded-md border border-gray-300 px-3 py-2 text-sm hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800"
        >
          Clear
        </button>
      </div>
    </div>
  );
}

