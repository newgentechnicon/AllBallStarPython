"use client";

import { useState } from "react";
import { FilterSheet } from "./FilterSheet";
import { MorphCategory } from "./morph-selector";
import Link from "next/link";
import { SearchBox } from "./search-box";

const FilterIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    fill="currentColor"
    viewBox="0 0 16 16"
    className="h-4 w-4"
  >
    <path d="M6 10.5a.5.5 0 0 1 .5-.5h3a.5.5 0 0 1 0 1h-3a.5.5 0 0 1-.5-.5zm-2-3a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1-.5-.5zm-2-3a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-11a.5.5 0 0 1-.5-.5z" />
  </svg>
);

interface FilterData {
  breeders: { id: number; name: string }[];
  years: string[];
}

interface ShopHeaderProps {
  totalItems: number;
  filterData: FilterData;
  allMorphs: MorphCategory[];
}

export function ShopHeader({ totalItems, filterData, allMorphs }: ShopHeaderProps) {
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  return (
    <>
      <div>
        <h1 className="text-center text-xl font-bold tracking-wider text-black uppercase mb-8">
          All Pythons
        </h1>

        {/* Search and Filter */}
        <SearchBox />

        <div className="flex justify-between items-center mt-4">
          <p className="text-sm text-gray-600">
            {totalItems.toLocaleString()} items
          </p>
          <Link
            className="items-center gap-x-2 rounded-lg border border-gray-300 bg-[#1F2937] px-4 py-2 shadow-sm"
            onClick={() => setIsFilterOpen(true)} href={""}>
            
            <p className="inline-flex text-sm font-medium text-white gap-x-2 ">
              <FilterIcon /> Filter
            </p>
            
            <span className="ml-1.5 rounded-full bg-gray-200 px-2 py-0.5 text-xs font-semibold text-gray-700">
              0
            </span>
          </Link>
        </div>
      </div>
      <FilterSheet
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        filterData={filterData}
        allMorphs={allMorphs}
      />
    </>
  );
}
