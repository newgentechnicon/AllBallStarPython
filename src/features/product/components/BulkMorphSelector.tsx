"use client";

import { useState, useMemo, KeyboardEvent } from "react";
import type { Tables } from "@/types/database.types";

// --- Type Definitions ---
export type Morph = Tables<"morphs">;
type MorphSubCategory = Tables<"morph_sub_categories"> & { morphs: Morph[] };
type MorphCategory = Tables<"morph_categories"> & {
  morphs: Morph[];
  sub_categories: MorphSubCategory[];
};
export type SelectedMorph = Morph & { id: number, name: string, color_hex: string };

// --- SVG Icons ---
const PlusIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <line x1="12" y1="5" x2="12" y2="19"></line>
    <line x1="5" y1="12" x2="19" y2="12"></line>
  </svg>
);
const CloseIcon = ({ ...props }) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    {" "}
    <line x1="18" y1="6" x2="6" y2="18"></line>{" "}
    <line x1="6" y1="6" x2="18" y2="18"></line>{" "}
  </svg>
);

interface MorphSelectorProps {
  allMorphs: MorphCategory[];
  selectedMorphs: SelectedMorph[];
  onAddMorph: (morph: Morph) => void;
  onAddMultipleMorphs: (morphs: Morph[]) => void;
  onRemoveMorph: (morph: SelectedMorph) => void;
  error?: string;
}

export function BulkMorphSelector({
  allMorphs,
  selectedMorphs,
  onAddMorph,
  onAddMultipleMorphs,
  onRemoveMorph,
  error,
}: MorphSelectorProps) {
  const [searchText, setSearchText] = useState("");
  const [isInputFocused, setIsInputFocused] = useState(false);

  const filteredCategories = useMemo(() => {
    const text = searchText.toLowerCase();
    const selectedIds = new Set(selectedMorphs.map((m) => m.id));
    const result: MorphCategory[] = [];
    for (const cat of allMorphs) {
      const matchedMorphs = (cat.morphs ?? []).filter(
        (m) => m.name.toLowerCase().includes(text) && !selectedIds.has(m.id)
      );
      const matchedSubs = (cat.sub_categories ?? [])
        .map((sub) => ({
          ...sub,
          morphs: (sub.morphs ?? []).filter(
            (m) => m.name.toLowerCase().includes(text) && !selectedIds.has(m.id)
          ),
        }))
        .filter((sub) => sub.morphs.length > 0);
      if (matchedMorphs.length > 0 || matchedSubs.length > 0) {
        result.push({
          ...cat,
          morphs: matchedMorphs,
          sub_categories: matchedSubs,
        });
      }
    }
    return result;
  }, [searchText, allMorphs, selectedMorphs]);

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && searchText.trim() !== "") {
      e.preventDefault();

      const allFilteredMorphs = filteredCategories.flatMap((cat) => [
        ...cat.morphs,
        ...cat.sub_categories.flatMap((sub) => sub.morphs),
      ]);

      if (allFilteredMorphs.length > 0) {
        onAddMultipleMorphs(allFilteredMorphs);
      }

      setSearchText("");
      e.currentTarget.blur();
    }
  };

  return (
    <div>
      <label className="block text-sm font-semibold text-gray-700 mb-1">
        Genetics (Morphs)*
      </label>
      {selectedMorphs.length > 0 && (
        <div
          className={`flex flex-wrap gap-2 rounded-lg border p-2 min-h-[4rem] mb-2 ${
            error ? "border-red-500" : "border-gray-300"
          }`}
        >
          {selectedMorphs.map((morph) => (
            <div
              key={morph.id}
              className="flex items-center gap-2 bg-white border border-gray-300 rounded-full px-3 py-1 text-sm font-medium text-gray-700"
            >
              <input type="hidden" name="morphs" value={morph.id} />
              <span
                className="h-2 w-2 rounded-full"
                style={{ backgroundColor: morph.color_hex ?? "#9CA3AF" }}
              ></span>
              <span>{morph.name}</span>
              <button type="button" onClick={() => onRemoveMorph(morph)}>
                <CloseIcon className="h-4 w-4 text-gray-500 hover:text-gray-800" />
              </button>
            </div>
          ))}
        </div>
      )}
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}

      <div className="relative w-full">
        <input
          type="text"
          placeholder="Add"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          onFocus={() => setIsInputFocused(true)}
          onBlur={() => setTimeout(() => setIsInputFocused(false), 150)}
          onKeyDown={handleKeyDown}
          className="py-2.5 ps-4 pe-10 block w-full border-gray-300 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500"
        />
        <div className="absolute top-1/2 right-3 -translate-y-1/2 pointer-events-none text-gray-400">
          <PlusIcon />
        </div>
        {isInputFocused && (
          <div className="absolute z-50 w-full max-h-72 mt-1 p-1 bg-white border border-gray-200 rounded-lg overflow-y-auto shadow">
            {filteredCategories.length === 0 && (
              <div className="px-4 py-2 text-sm text-gray-500">
                No results found.
              </div>
            )}
            {filteredCategories.map((category) => (
              <div key={category.id}>
                <div className="flex items-center gap-x-2 px-3 py-2">
                  <span
                    className="font-semibold text-sm"
                    style={{ color: "#9CA3AF" }}
                  >
                    {category.name}
                  </span>
                  <span className="flex-grow border-t border-dashed border-gray-300 dark:border-neutral-700"></span>
                </div>
                {(category.morphs ?? []).map((morph) => (
                  <button
                    type="button"
                    key={morph.id}
                    onClick={() => {
                      onAddMorph(morph);
                      setSearchText("");
                    }}
                    className="flex items-center gap-x-2 w-full text-left text-sm px-4 py-2 hover:bg-gray-100 rounded-md"
                  >
                    <span
                      className="h-2 w-2 rounded-full"
                      style={{
                        backgroundColor: category.color_hex ?? "#9CA3AF",
                      }}
                    ></span>
                    <span>{morph.name}</span>
                  </button>
                ))}
                {(category.sub_categories ?? []).map((sub) => (
                  <div key={sub.id} className="pl-3">
                    <div className="flex items-center gap-x-2 px-3 py-1">
                      <span
                        className="text-xs font-medium"
                        style={{ color: "#9CA3AF" }}
                      >
                        {sub.name}
                      </span>
                      <span className="flex-grow border-t border-dashed border-gray-300 dark:border-neutral-700"></span>
                    </div>
                    {(sub.morphs ?? []).map((morph) => (
                      <button
                        type="button"
                        key={morph.id}
                        onClick={() => {
                          onAddMorph(morph);
                          setSearchText("");
                        }}
                        className="flex items-center gap-x-2 w-full text-left text-sm px-4 py-2 hover:bg-gray-100 rounded-md"
                      >
                        <span
                          className="h-2 w-2 rounded-full"
                          style={{
                            backgroundColor: sub.color_hex ?? "#9CA3AF",
                          }}
                        ></span>
                        <span>{morph.name}</span>
                      </button>
                    ))}
                  </div>
                ))}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
