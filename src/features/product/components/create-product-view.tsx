"use client";

import { useActionState, useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { createProductAction } from "@/features/product/product.actions";
import type { CreateProductState } from "@/features/product/product.types";
import type { Tables } from "@/types/database.types";
import { useAppToast } from "@/hooks/useAppToast";
import { ImageUploader } from "@/components/ui/ImageUploader";
import { Button } from "@/components/ui/Button";
import { Breadcrumb } from "@/components/ui/Breadcrumb";

// --- Type Definitions ---
type Morph = Tables<"morphs">;
type MorphSubCategory = Tables<"morph_sub_categories"> & { morphs: Morph[] };
type MorphCategory = Tables<"morph_categories"> & {
  morphs: Morph[];
  sub_categories: MorphSubCategory[];
};
type SelectedMorph = Morph & { color_hex?: string };

// --- SVG Icons ---
const PlusIcon = () => (
  <svg
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

interface CreateProductViewProps {
  allMorphs: MorphCategory[];
}

export function CreateProductView({ allMorphs }: CreateProductViewProps) {
  const router = useRouter();
  const { showErrorToast } = useAppToast();

  const initialState: CreateProductState = { errors: {}, fields: {} };
  const [state, formAction] = useActionState(createProductAction, initialState);

  const [description, setDescription] = useState(
    (state.fields?.description as string) || ''
  );

  // State for managing UI that isn't part of the form submission
  const [selectedMorphs, setSelectedMorphs] = useState<SelectedMorph[]>([]);
  const [searchText, setSearchText] = useState("");
  const [isInputFocused, setIsInputFocused] = useState(false);
  const [pictures, setPictures] = useState<File[]>([]);
  const [picturePreviews, setPicturePreviews] = useState<string[]>([]);

  useEffect(() => {
    if (!state.success && state.errors._form) {
      showErrorToast(state.errors._form);
    }
  }, [state, showErrorToast]);

  const handleAddMorph = (morph: Morph) => {
    if (!selectedMorphs.find((m) => m.id === morph.id)) {
      let color_hex: string | undefined;
      for (const cat of allMorphs) {
        if (cat.morphs?.some((m) => m.id === morph.id)) {
          color_hex = cat.color_hex ?? undefined;
          break;
        }
        for (const sub of cat.sub_categories ?? []) {
          if (sub.morphs?.some((m) => m.id === morph.id)) {
            color_hex = sub.color_hex ?? undefined;
            break;
          }
        }
        if (color_hex) break;
      }
      setSelectedMorphs([...selectedMorphs, { ...morph, color_hex }]);
    }
  };

  const handleRemoveMorph = (morphToRemove: Morph) => {
    setSelectedMorphs(selectedMorphs.filter((m) => m.id !== morphToRemove.id));
  };

  const filteredCategories = useMemo(() => {
    const text = searchText.toLowerCase();
    const selectedIds = new Set(selectedMorphs.map((m) => m.id));
    const result: MorphCategory[] = [];
    for (const cat of allMorphs) {
      const matchedMorphs = (cat.morphs ?? []).filter(
        (m) =>
          (!text || m.name.toLowerCase().includes(text)) &&
          !selectedIds.has(m.id)
      );
      const matchedSubs = (cat.sub_categories ?? [])
        .map((sub) => ({
          ...sub,
          morphs: (sub.morphs ?? []).filter(
            (m) =>
              (!text || m.name.toLowerCase().includes(text)) &&
              !selectedIds.has(m.id)
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

  const generateYearOptions = () => {
    const currentYear = new Date().getFullYear();
    const years = [];
    for (let i = 0; i < 10; i++) {
      years.push(currentYear - i);
    }
    return years;
  };

  const inputClassName = (hasError: boolean) =>
    `py-2.5 sm:py-3 px-4 block w-full rounded-lg sm:text-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-neutral-900 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600 ${
      hasError ? "border-red-500" : "border-gray-200 dark:border-neutral-700"
    }`;

  const handleFileRemoved = (indexToRemove: number) => {
    const removedPreview = picturePreviews[indexToRemove];
    if (removedPreview.startsWith("blob:")) {
      const blobIndexToRemove = picturePreviews
        .slice(0, indexToRemove)
        .filter((p) => p.startsWith("blob:")).length;
      setPictures((currentFiles) =>
        currentFiles.filter((_, i) => i !== blobIndexToRemove)
      );
    }
  };

  const formActionWithFiles = (formData: FormData) => {
    pictures.forEach((file) => {
      formData.append("images", file);
    });
    formAction(formData);
  };

  const breadcrumbPaths = [
    { name: "Home", href: "/farm" },
    { name: "Products", href: "/farm/products" },
    { name: "Add Product" },
  ];

  return (
    <div className="container mx-auto max-w-2xl py-4 bg-white dark:bg-gray-900">
      <Breadcrumb paths={breadcrumbPaths} className="px-4" />

      <div className="px-4 mt-4 pb-4 border-b border-gray-200">
        <h1 className="text-lg font-bold text-[#1F2937]">Add Product</h1>
      </div>

      <form action={formActionWithFiles} className="p-4 space-y-6" noValidate>
        <div>
          <label
            htmlFor="name"
            className="block text-sm font-semibold text-gray-700 mb-1"
          >
            Product Name*
          </label>
          <input
            type="text"
            id="name"
            name="name"
            placeholder="Put product name here"
            className={inputClassName(!!state.errors.name)}
            defaultValue={state.fields?.name as string}
          />
          {state.errors.name && (
            <p className="mt-1 text-sm text-red-600">{state.errors.name[0]}</p>
          )}
        </div>

        <ImageUploader
          name="images"
          previews={picturePreviews}
          onPreviewsChange={setPicturePreviews}
          onFilesAdded={(newFiles) =>
            setPictures((prev) => [...prev, ...newFiles])
          }
          onFileRemoved={handleFileRemoved}
          maxFiles={3}
          error={state.errors.images?.[0]}
        />

        <div>
          <label
            htmlFor="price"
            className="block text-sm font-semibold text-gray-700 mb-1"
          >
            Product Price*
          </label>
          <input
            type="number"
            id="price"
            name="price"
            placeholder="Put product price here"
            className={inputClassName(!!state.errors.price)}
            defaultValue={state.fields?.price as string}
            inputMode="numeric"
          />
          {state.errors.price && (
            <p className="mt-1 text-sm text-red-600">{state.errors.price[0]}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            Genetics (Morphs)*
          </label>
          {selectedMorphs.length > 0 && (
            <div
              className={`flex flex-wrap gap-2 rounded-lg border p-2 min-h-[4rem] mb-2 ${
                state.errors.morphs ? "border-red-500" : "border-gray-300"
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
                  <button
                    type="button"
                    onClick={() => handleRemoveMorph(morph)}
                  >
                    <CloseIcon className="h-3 w-3 text-gray-500 hover:text-gray-800" />
                  </button>
                </div>
              ))}
            </div>
          )}
          {state.errors.morphs && (
            <p className="mt-1 text-sm text-red-600">
              {state.errors.morphs[0]}
            </p>
          )}

          <div className="relative w-full mt-2">
            <input
              type="text"
              placeholder="Add"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              onFocus={() => setIsInputFocused(true)}
              onBlur={() => setTimeout(() => setIsInputFocused(false), 150)}
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
                          handleAddMorph(morph);
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
                              handleAddMorph(morph);
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

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="sex"
              className="block text-sm font-semibold text-gray-700 mb-1"
            >
              Sex*
            </label>
            <select
              id="sex"
              name="sex"
              className={inputClassName(!!state.errors.sex)}
              defaultValue={state.fields?.sex as string}
            >
              <option value="">Select</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
            {state.errors.sex && (
              <p className="mt-1 text-sm text-red-600">{state.errors.sex[0]}</p>
            )}
          </div>
          <div>
            <label
              htmlFor="year"
              className="block text-sm font-semibold text-gray-700 mb-1"
            >
              Year*
            </label>
            <select
              id="year"
              name="year"
              className={inputClassName(!!state.errors.year)}
              defaultValue={state.fields?.year as string}
            >
              <option value="">Select</option>
              {generateYearOptions().map((y) => (
                <option key={y} value={y}>
                  {y}
                </option>
              ))}
            </select>
            {state.errors.year && (
              <p className="mt-1 text-sm text-red-600">
                {state.errors.year[0]}
              </p>
            )}
          </div>
        </div>

        <div>
          <div className="flex justify-between items-center mb-1">
            <label
              htmlFor="description"
              className="block text-sm font-semibold text-gray-700"
            >
              Product Description*
            </label>
            <span className="text-sm text-gray-500">
              {description.length} / 500
            </span>
          </div>
          <textarea
            id="description"
            name="description"
            rows={4}
            placeholder="Put product description here"
            maxLength={500}
            className={inputClassName(!!state.errors.description)}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          ></textarea>
          {state.errors.description && (
            <p className="mt-1 text-sm text-red-600">
              {state.errors.description[0]}
            </p>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4 pt-4">
          <button
            type="button"
            onClick={() => router.back()}
            className="rounded-lg border border-gray-300 py-2.5"
          >
            Cancel
          </button>
          <Button>Add Product</Button>
        </div>
      </form>
    </div>
  );
}
