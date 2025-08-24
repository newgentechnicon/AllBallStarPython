"use client";

import { useActionState, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { updateProductAction } from "@/features/product/product.actions";
import type {
  EditProductState,
  ProductDetail,
} from "@/features/product/product.types";
import { useAppToast } from "@/hooks/useAppToast";
import { ImageUploader } from "@/components/ui/ImageUploader";
import { Button } from "@/components/ui/Button";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import {
  MorphSelector,
  type SelectedMorph,
  type Morph,
  type MorphCategory,
} from "./morph-selector";

interface EditProductViewProps {
  product: ProductDetail;
  allMorphs: MorphCategory[];
}

export function EditProductView({ product, allMorphs }: EditProductViewProps) {
  const router = useRouter();
  const { showErrorToast } = useAppToast();

  const initialState: EditProductState = { errors: {}, fields: {} };
  const [state, formAction] = useActionState(updateProductAction, initialState);

  const [newPictures, setNewPictures] = useState<File[]>([]);
  const [picturePreviews, setPicturePreviews] = useState<string[]>([]);

  const [description, setDescription] = useState(
    product.description ?? ''
  );

  const [selectedMorphs, setSelectedMorphs] = useState<SelectedMorph[]>([]);

  useEffect(() => {
    setPicturePreviews(product.image_urls || []);

    const initialMorphs = product.product_morphs
      .map((pm) => {
        const morph = pm.morphs;
        if (!morph) return null;

        const color: string =
          morph.morph_sub_categories?.color_hex ??
          morph.morph_categories?.color_hex ??
          "#9CA3AF";

        return {
          id: morph.id,
          name: morph.name,
          color_hex: color as string,
        } as SelectedMorph;
      })
      .filter((item): item is SelectedMorph => item !== null);

    setSelectedMorphs(initialMorphs);
  }, [product]);

  useEffect(() => {
    if (!state.success && state.errors._form) {
      showErrorToast(state.errors._form);
    }
  }, [state, showErrorToast]);

  const handleFileRemoved = (indexToRemove: number) => {
    const removedPreview = picturePreviews[indexToRemove];
    if (removedPreview.startsWith("blob:")) {
      const blobIndexToRemove = picturePreviews
        .slice(0, indexToRemove)
        .filter((p) => p.startsWith("blob:")).length;
      setNewPictures((currentFiles) =>
        currentFiles.filter((_, i) => i !== blobIndexToRemove)
      );
    }
  };

  const formActionWithFiles = (formData: FormData) => {
    newPictures.forEach((file) => formData.append("newImages", file));
    const existingUrls = picturePreviews.filter((p) => !p.startsWith("blob:"));
    formData.append("existingImageUrls", existingUrls.join(","));
    formData.delete("morphs");
    selectedMorphs.forEach((morph) => {
      if (morph && morph.id) {
        formData.append("morphs", morph.id.toString());
      }
    });
    formAction(formData);
  };

  const handleAddMorph = (morph: Morph) => {
    if (!selectedMorphs.find((m) => m.id === morph.id)) {
      let color_hex: string = "#9CA3AF";
      let colorFound = false;

      for (const cat of allMorphs) {
        if (cat.morphs?.some((m: Morph) => m.id === morph.id)) {
          color_hex = cat.color_hex ?? "#9CA3AF";
          colorFound = true;
        }

        if (!colorFound) {
          for (const sub of cat.sub_categories ?? []) {
            if (sub.morphs?.some((m: Morph) => m.id === morph.id)) {
              color_hex = sub.color_hex ?? "#9CA3AF";
              colorFound = true;
              break;
            }

            if (!colorFound) {
              for (const subSub of sub.sub_sub_categories ?? []) {
                if (subSub.morphs?.some((m: Morph) => m.id === morph.id)) {
                  color_hex = subSub.color_hex ?? sub.color_hex ?? "#9CA3AF";
                  colorFound = true;
                  break;
                }
              }
            }
            if (colorFound) break;
          }
        }
        if (colorFound) break;
      }

      setSelectedMorphs((prev) => [...prev, { ...morph, color_hex }]);
    }
  };

  const handleRemoveMorph = (morphToRemove: SelectedMorph) => {
    setSelectedMorphs(selectedMorphs.filter((m) => m.id !== morphToRemove.id));
  };

  const generateYearOptions = () => {
    const currentYear = new Date().getFullYear();
    return Array.from({ length: 10 }, (_, i) => currentYear - i);
  };

  const inputClassName = (hasError: boolean) =>
    `py-2.5 sm:py-3 px-4 block w-full rounded-lg sm:text-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-neutral-900 ${
      hasError ? "border-red-500" : "border-gray-200 dark:border-neutral-700"
    }`;

  const breadcrumbPaths = [
    { name: "Home", href: "/farm" },
    { name: "Products", href: "/farm/products" },
    { name: "Edit Product" },
  ];

  return (
    <div className="bg-white mx-auto max-w-2xl min-h-screen">
      <div className="container py-4">
        <Breadcrumb paths={breadcrumbPaths} className="px-4" />

        <div className="px-4 mt-4 pb-4 border-b border-gray-200">
          <h1 className="text-lg font-bold text-[#1F2937]">Edit Product</h1>
        </div>

        <form action={formActionWithFiles} className="p-4 space-y-6" noValidate>
          <div>
            <input type="hidden" name="id" value={product.id} />

            <label htmlFor="product_id" className="block text-sm font-semibold text-gray-700 mb-1">
              Product ID*
            </label>
            <input
              type="text"
              id="product_id"
              name="product_id"
              className={inputClassName(!!state.errors.product_id)}
              defaultValue={product.product_id ?? ""}
              minLength={5}
              maxLength={15}
            />
            {state.errors.product_id && <p className="mt-1 text-sm text-red-600">{state.errors.product_id[0]}</p>}
          </div>

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
              defaultValue={product.name}
            />
            {state.errors.name && (
              <p className="mt-1 text-sm text-red-600">
                {state.errors.name[0]}
              </p>
            )}
          </div>

          <ImageUploader
            name="images"
            previews={picturePreviews}
            onPreviewsChange={setPicturePreviews}
            onFilesAdded={(files) =>
              setNewPictures((prev) => [...prev, ...files])
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
              defaultValue={product.price ?? ""}
            />
            {state.errors.price && (
              <p className="mt-1 text-sm text-red-600">
                {state.errors.price[0]}
              </p>
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
                defaultValue={product.sex ?? ""}
              >
                <option value="">Select</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
              {state.errors.sex && (
                <p className="mt-1 text-sm text-red-600">
                  {state.errors.sex[0]}
                </p>
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
                defaultValue={product.year ?? ""}
              >
                <option value="">Select</option>
                {generateYearOptions().map((year) => (
                  <option key={year} value={year}>
                    {year}
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
            <Button>Save Changes</Button>
          </div>
        </form>
      </div>
    </div>
  );
}
