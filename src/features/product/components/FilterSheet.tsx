"use client";

import { useEffect, useState } from "react";
import {
  MorphSelector,
  SelectedMorph as SingleSelectedMorph,
  MorphCategory,
  Morph,
} from "./morph-selector";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import Image from "next/image";

interface FilterData {
  breeders: { id: number; name: string }[];
  years: string[];
}

interface FilterSheetProps {
  isOpen: boolean;
  onClose: () => void;
  filterData: FilterData;
  allMorphs: MorphCategory[];
}

export function FilterSheet({
  isOpen,
  onClose,
  filterData,
  allMorphs,
}: FilterSheetProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [filters, setFilters] = useState({
    sex: [] as string[],
    breeders: [] as string[],
    years: [] as string[],
    productStatus: [] as string[],
    morphs: [] as string[],
  });

  useEffect(() => {
    const initialFilters = {
      sex: searchParams.getAll("sex"),
      breeders: searchParams.getAll("breeders"),
      years: searchParams.getAll("years"),
      productStatus: searchParams.getAll("productStatus"),
      morphs: searchParams.getAll("morphs"),
    };
    setFilters(initialFilters);

    const initialMorphs = initialFilters.morphs
      .map((morph) => {
        for (const cat of allMorphs) {
          // หาใน morphs ของ category
          const found =
            cat.morphs?.find(
              (m: Morph) =>
                m.id === Number(morph) ||
                m.name.toLowerCase() === String(morph).toLowerCase()
            ) ?? null;
          if (found) return { ...found, color_hex: cat.color_hex ?? "#ccc" };

          // หาใน sub-categories
          for (const sub of cat.sub_categories ?? []) {
            const foundInSub =
              sub.morphs?.find(
                (m: Morph) =>
                  m.id === Number(morph) ||
                  m.name.toLowerCase() === String(morph).toLowerCase()
              ) ?? null;
            if (foundInSub)
              return { ...foundInSub, color_hex: sub.color_hex ?? "#ccc" };
          }
        }
        return null;
      })
      .filter((m): m is SingleSelectedMorph => m !== null);

    setSelectedMorphsUI(initialMorphs);
  }, [searchParams, allMorphs]);

  const handleApplyFilters = () => {
    const params = new URLSearchParams(searchParams);
    Object.keys(filters).forEach((key) => {
      params.delete(key);
      const values = filters[key as keyof typeof filters];
      values.forEach((value) => params.append(key, value));
    });

    router.push(`${pathname}?${params.toString()}`);
    onClose();
  };

  const [selectedMorphsUI, setSelectedMorphsUI] = useState<
    SingleSelectedMorph[]
  >([]);

  const handleAddMorph = (morph: Morph) => {
    if (!selectedMorphsUI.find((m) => m.id === morph.id)) {
      let color_hex: string = "#9CA3AF";
      for (const cat of allMorphs) {
        if (cat.morphs?.some((m: Morph) => m.id === morph.id)) {
          color_hex = cat.color_hex ?? "#9CA3AF";
          break;
        }

        for (const sub of cat.sub_categories ?? []) {
          if (sub.morphs?.some((m: Morph) => m.id === morph.id)) {
            color_hex = sub.color_hex ?? "#9CA3AF";
            break;
          }
        }
      }
      setSelectedMorphsUI((prev) => [...prev, { ...morph, color_hex }]);
      setFilters((prev) => ({
        ...prev,
        morphs: [...prev.morphs, String(morph.name)],
      }));
    }
  };

  const handleRemoveMorph = (morphToRemove: SingleSelectedMorph) => {
    setSelectedMorphsUI((prev) =>
      prev.filter((m) => m.id !== morphToRemove.id)
    );
    setFilters((prev) => ({
      ...prev,
      morphs: prev.morphs.filter((name) => name !== morphToRemove.name),
    }));
  };

  if (!isOpen) return null;

  return (
    // Overlay
    <div className="fixed inset-0 bg-black/50 z-99" onClick={onClose}>
      {/* Slide-over Panel */}
      <div
        className="fixed top-0 right-0 h-full w-full max-w-sm bg-white shadow-lg z-50 p-6 flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-xl font-bold text-center text-black uppercase mb-8">
          Select Filter
        </h2>

        <form className="space-y-6 flex-grow overflow-y-auto pr-4 pl-2">
          {/* Price Range */}
          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-2">
              Price Range
            </label>
            <div className="flex items-center gap-4">
              <input
                type="text"
                placeholder="Min amount"
                className="w-full rounded-lg border-gray-300 text-sm"
              />
              <span className="text-gray-400">-</span>
              <input
                type="text"
                placeholder="Max amount"
                className="w-full rounded-lg border-gray-300 text-sm"
              />
            </div>
          </div>

          {/* Sex */}
          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-2">
              Sex
            </label>
            <div className="space-y-3">
              <div className="flex items-center">
                <input
                  id="sex-male"
                  type="checkbox"
                  className="h-4 w-4 rounded border-gray-300 text-neutral-500 focus:text-neutral-600 focus:outline-2 focus:outline-offset-2 focus:outline-neutral-500"
                  checked={filters.sex.includes("Male")}
                  onChange={(e) => {
                    setFilters((prev) => ({
                      ...prev,
                      sex: e.target.checked
                        ? [...prev.sex, "Male"]
                        : prev.sex.filter((s) => s !== "Male"),
                    }));
                  }}
                />
                <div className="ml-3 flex items-center gap-2">
                  <Image
                    src="/images/male-icon.png"
                    alt="upload"
                    width={13}
                    height={13}
                    quality={100}
                    className="mx-auto"
                  />
                  <label htmlFor="sex-male" className="text-sm text-gray-800">
                    Male
                  </label>
                </div>
              </div>
              <div className="flex items-center">
                <input
                  id="sex-female"
                  type="checkbox"
                  className="h-4 w-4 rounded border-gray-300 text-neutral-500 focus:text-neutral-600 focus:outline-2 focus:outline-offset-2 focus:outline-neutral-500"
                  checked={filters.sex.includes("Female")}
                  onChange={(e) => {
                    setFilters((prev) => ({
                      ...prev,
                      sex: e.target.checked
                        ? [...prev.sex, "Female"]
                        : prev.sex.filter((s) => s !== "Female"),
                    }));
                  }}
                />
                <div className="ml-3 flex items-center gap-2">
                  <Image
                    src="/images/female-icon.png"
                    alt="upload"
                    width={10}
                    height={16}
                    quality={100}
                    className="mx-auto"
                  />
                  <label htmlFor="sex-female" className="text-sm text-gray-800">
                    Female
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Breeder */}
          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-2">
              Breeder
            </label>
            <div className="space-y-3">
              {filterData.breeders.map((breeder) => (
                <div key={breeder.id} className="flex items-center">
                  {/* <input id={`breeder-${breeder.id}`} type="checkbox" className="h-4 w-4 rounded border-gray-300" /> */}
                  <input
                    id={`breeder-${breeder.id}`}
                    type="checkbox"
                    className="h-4 w-4 rounded border-gray-300 text-neutral-500 focus:text-neutral-600 focus:outline-2 focus:outline-offset-2 focus:outline-neutral-500"
                    checked={filters.breeders.includes(`${breeder.id}`)}
                    onChange={(e) => {
                      setFilters((prev) => ({
                        ...prev,
                        breeders: e.target.checked
                          ? [...prev.breeders, `${breeder.id}`]
                          : prev.breeders.filter((s) => s !== `${breeder.id}`),
                      }));
                    }}
                  />

                  <label
                    htmlFor={`breeder-${breeder.id}`}
                    className="ml-3 text-sm text-gray-800"
                  >
                    {breeder.name}
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* Year */}
          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-2">
              Year
            </label>
            <div className="space-y-3">
              {filterData.years.map((year) => (
                <div key={year} className="flex items-center">
                  <input
                    id={`year-${year}`}
                    type="checkbox"
                    className="h-4 w-4 rounded border-gray-300 text-neutral-500 focus:text-neutral-600 focus:outline-2 focus:outline-offset-2 focus:outline-neutral-500"
                    checked={filters.years.includes(`${year}`)}
                    onChange={(e) => {
                      setFilters((prev) => ({
                        ...prev,
                        years: e.target.checked
                          ? [...prev.years, `${year}`]
                          : prev.years.filter((s) => s !== `${year}`),
                      }));
                    }}
                  />
                  <label
                    htmlFor={`year-${year}`}
                    className="ml-3 text-sm text-gray-800"
                  >
                    {year}
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* Morph Section */}
          <div>
            <p className="text-sm font-semibold text-gray-800 mb-2">
              Morph (Single Add)
            </p>
            <MorphSelector
              allMorphs={allMorphs}
              selectedMorphs={selectedMorphsUI}
              onAddMorph={handleAddMorph}
              onRemoveMorph={handleRemoveMorph}
            />
          </div>

          {/* Status */}
          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-2">
              Status
            </label>
            <div className="space-y-3">
              <div className="flex items-center">
                {/* <input id="status-available" type="checkbox" className="h-4 w-4 rounded border-gray-300" /> */}
                <input
                  id="status-available"
                  type="checkbox"
                  className="h-4 w-4 rounded border-gray-300 text-neutral-500 focus:text-neutral-600 focus:outline-2 focus:outline-offset-2 focus:outline-neutral-500"
                  checked={filters.productStatus.includes("Available")}
                  onChange={(e) => {
                    setFilters((prev) => ({
                      ...prev,
                      productStatus: e.target.checked
                        ? [...prev.productStatus, "Available"]
                        : prev.productStatus.filter((s) => s !== "Available"),
                    }));
                  }}
                />
                <label
                  htmlFor="status-available"
                  className="ml-3 flex items-center gap-2 text-sm text-gray-800"
                >
                  <span className="h-3 w-3 bg-green-500 rounded-full"></span>
                  Available
                </label>
              </div>
              <div className="flex items-center">
                {/* <input id="status-onhold" type="checkbox" className="h-4 w-4 rounded border-gray-300" /> */}
                <input
                  id="status-onhold"
                  type="checkbox"
                  className="h-4 w-4 rounded border-gray-300 text-neutral-500 focus:text-neutral-600 focus:outline-2 focus:outline-offset-2 focus:outline-neutral-500"
                  checked={filters.productStatus.includes("On Hold")}
                  onChange={(e) => {
                    setFilters((prev) => ({
                      ...prev,
                      productStatus: e.target.checked
                        ? [...prev.productStatus, "On Hold"]
                        : prev.productStatus.filter((s) => s !== "On Hold"),
                    }));
                  }}
                />
                <label
                  htmlFor="status-onhold"
                  className="ml-3 flex items-center gap-2 text-sm text-gray-800"
                >
                  <span className="h-3 w-3 bg-yellow-500 rounded-full"></span>
                  On Hold
                </label>
              </div>
            </div>
          </div>
        </form>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-4 mt-auto pt-6">
          <button className="cursor-pointer py-3 px-4 min-w-[160px] inline-flex justify-center items-center gap-x-2 text-sm font-medium rounded-lg border border-neutral-500 !text-neutral-500 hover:border-neutral-800 hover:text-neutral-800 focus:outline-none focus:border-neutral-800 focus:text-neutral-800 disabled:opacity-50 disabled:pointer-events-none dark:border-neutral-400 dark:!text-neutral-400 dark:hover:text-neutral-300 dark:hover:border-neutral-300">
            Reset
          </button>
          <button
            className="cursor-pointer py-3 px-4 min-w-[160px] inline-flex justify-center items-center gap-x-2 text-sm font-medium rounded-lg border border-transparent bg-neutral-500 !text-white hover:bg-neutral-600 focus:outline-none focus:bg-neutral-600 disabled:opacity-50 disabled:pointer-events-none dark:!text-white"
            onClick={handleApplyFilters}
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
