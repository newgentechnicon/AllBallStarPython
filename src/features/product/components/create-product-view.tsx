"use client";

import { useActionState, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createProductAction } from "@/features/product/product.actions";
import type { CreateProductState } from "@/features/product/product.types";
import type { Tables } from "@/types/database.types";
import { useAppToast } from "@/hooks/useAppToast";
import { ImageUploader } from "@/components/ui/ImageUploader";
import { Button } from "@/components/ui/Button";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { MorphSelector, type SelectedMorph } from "./morph-selector";

// --- Type Definitions ---
type Morph = Tables<"morphs">;
type MorphSubCategory = Tables<"morph_sub_categories"> & { morphs: Morph[] };
type MorphCategory = Tables<"morph_categories"> & {
  morphs: Morph[];
  sub_categories: MorphSubCategory[];
};

interface CreateProductViewProps {
  allMorphs: MorphCategory[];
}

export function CreateProductView({ allMorphs }: CreateProductViewProps) {
  const router = useRouter();
  const { showErrorToast } = useAppToast();

  const initialState: CreateProductState = { errors: {}, fields: {} };
  const [state, formAction] = useActionState(createProductAction, initialState);

  const [description, setDescription] = useState(
    (state.fields?.description as string) || ""
  );

  // State for managing UI that isn't part of the form submission
  const [selectedMorphs, setSelectedMorphs] = useState<SelectedMorph[]>([]);
  const [pictures, setPictures] = useState<File[]>([]);
  const [picturePreviews, setPicturePreviews] = useState<string[]>([]);

  useEffect(() => {
    if (!state.success && state.errors._form) {
      showErrorToast(state.errors._form);
    }
  }, [state, showErrorToast]);

  const handleAddMorph = (morph: Morph) => {
    if (!selectedMorphs.find((m: SelectedMorph) => m.id === morph.id)) {
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

      setSelectedMorphs([
        ...selectedMorphs,
        {
          id: morph.id,
          name: morph.name,
          color_hex,
          category_id: morph.category_id ?? null,
          sub_category_id: morph.sub_category_id ?? null,
        },
      ]);
    }
  };

  const handleRemoveMorph = (morphToRemove: SelectedMorph) => {
    setSelectedMorphs(selectedMorphs.filter((m) => m.id !== morphToRemove.id));
  };

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
    pictures
      .filter((file) => file.size > 0) // ตัด empty file ออก
      .forEach((file) => {
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

        <MorphSelector
          allMorphs={allMorphs}
          selectedMorphs={selectedMorphs}
          onAddMorph={handleAddMorph}
          onRemoveMorph={handleRemoveMorph}
          error={state.errors.morphs?.[0]}
        />

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
