'use client';

import { useActionState, useEffect, useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { updateProductAction } from '@/features/product/product.actions';
import type { EditProductState, ProductDetail } from '@/features/product/product.types';
import { useAppToast } from '@/hooks/useAppToast';
import { ImageUploader } from '@/components/ui/ImageUploader';
import { Button } from "@/components/ui/Button";
import type { Tables } from '@/types/database.types';

// --- Type Definitions ---
type Morph = Tables<'morphs'>;
type MorphSubCategory = {
  id: number;
  name: string;
  color_hex?: string | null;
  morphs?: Morph[];
};
type MorphCategory = {
  id: number;
  name: string;
  color_hex: string | null;
  morphs: Morph[];
  sub_categories: MorphSubCategory[];
};

type SelectedMorph = {
  id: number;
  name: string;
  color_hex: string; // ✅ ต้องเป็น string เท่านั้น
};

// --- SVG Icons ---
const PlusIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="5" x2="12" y2="19"></line>
    <line x1="5" y1="12" x2="19" y2="12"></line>
  </svg>
);

const CloseIcon = ({ ...props }) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18"></line>
    <line x1="6" y1="6" x2="18" y2="18"></line>
  </svg>
);

interface EditProductViewProps {
  product: ProductDetail;
  allMorphs: MorphCategory[];
}

export function EditProductView({ product, allMorphs }: EditProductViewProps) {
  const router = useRouter();
  const { showErrorToast } = useAppToast();

  const initialState: EditProductState = { errors: {}, fields: {} };
  const [state, formAction] = useActionState(updateProductAction, initialState);

  const [selectedMorphs, setSelectedMorphs] = useState<SelectedMorph[]>([]);
  const [newPictures, setNewPictures] = useState<File[]>([]);
  const [picturePreviews, setPicturePreviews] = useState<string[]>([]);
  const [searchText, setSearchText] = useState('');
  const [isInputFocused, setIsInputFocused] = useState(false);

  useEffect(() => {
    setPicturePreviews(product.image_urls || []);

    const initialMorphs = product.product_morphs
      .map(pm => {
        const morph = pm.morphs;
        if (!morph) return null;

        const color: string =
          morph.morph_sub_categories?.color_hex ??
          morph.morph_categories?.color_hex ??
          '#9CA3AF';

        return {
          id: morph.id,
          name: morph.name,
          color_hex: color,
        };
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
    if (removedPreview.startsWith('blob:')) {
      const blobIndexToRemove = picturePreviews.slice(0, indexToRemove).filter(p => p.startsWith('blob:')).length;
      setNewPictures(currentFiles => currentFiles.filter((_, i) => i !== blobIndexToRemove));
    }
  };

  const formActionWithFiles = (formData: FormData) => {
    newPictures.forEach(file => formData.append('newImages', file));
    const existingUrls = picturePreviews.filter(p => !p.startsWith('blob:'));
    formData.append('existingImageUrls', existingUrls.join(','));
    formAction(formData);
  };

  const handleAddMorph = (morph: Morph) => {
    if (!selectedMorphs.find((m: SelectedMorph) => m.id === morph.id)) {
      let color_hex: string = '#9CA3AF';

      for (const cat of allMorphs) {
        if (cat.morphs?.some((m: Morph) => m.id === morph.id)) {
          color_hex = cat.color_hex ?? '#9CA3AF';
          break;
        }

        for (const sub of cat.sub_categories ?? []) {
          if (sub.morphs?.some((m: Morph) => m.id === morph.id)) {
            color_hex = sub.color_hex ?? '#9CA3AF';
            break;
          }
        }
      }

      setSelectedMorphs([...selectedMorphs, { id: morph.id, name: morph.name, color_hex }]);
    }
  };

  const handleRemoveMorph = (morphToRemove: SelectedMorph) => {
    setSelectedMorphs(selectedMorphs.filter(m => m.id !== morphToRemove.id));
  };

  const filteredCategories = useMemo(() => {
    const text = searchText.toLowerCase();
    const selectedIds = new Set(selectedMorphs.map(m => m.id));
    const result: MorphCategory[] = [];

    for (const cat of allMorphs) {
      const matchedMorphs = (cat.morphs ?? []).filter((m: Morph) => (!text || m.name.toLowerCase().includes(text)) && !selectedIds.has(m.id));
      const matchedSubs = (cat.sub_categories ?? [])
        .map((sub: MorphSubCategory) => ({
          ...sub,
          morphs: (sub.morphs ?? []).filter((m: Morph) => (!text || m.name.toLowerCase().includes(text)) && !selectedIds.has(m.id)),
        }))
        .filter(sub => sub.morphs && sub.morphs.length > 0);

      if (matchedMorphs.length > 0 || matchedSubs.length > 0) {
        result.push({ ...cat, morphs: matchedMorphs, sub_categories: matchedSubs });
      }
    }

    return result;
  }, [searchText, allMorphs, selectedMorphs]);

  const generateYearOptions = () => {
    const currentYear = new Date().getFullYear();
    return Array.from({ length: 10 }, (_, i) => currentYear - i);
  };

  const inputClassName = (hasError: boolean) =>
    `py-2.5 sm:py-3 px-4 block w-full rounded-lg sm:text-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-neutral-900 ${
      hasError ? 'border-red-500' : 'border-gray-200 dark:border-neutral-700'
    }`;

  return (
    <div className="bg-white min-h-screen">
      <div className="container mx-auto max-w-lg py-4">
        <nav className="flex px-4 text-sm text-gray-500">
          <Link href="/farm" className="hover:underline">Home</Link>
          <span className="mx-2">/</span>
          <Link href="/farm/products" className="hover:underline">Products</Link>
          <span className="mx-2">/</span>
          <span className="font-medium text-gray-700">Edit Product</span>
        </nav>

        <div className="px-4 mt-4 pb-4 border-b border-gray-200">
          <h1 className="text-2xl font-bold text-[#1F2937]">Edit Product</h1>
        </div>

        <form action={formActionWithFiles} className="p-4 space-y-6" noValidate>
          <input type="hidden" name="id" value={product.id} />

          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Product Name*</label>
            <input type="text" id="name" name="name" className={inputClassName(!!state.errors.name)} defaultValue={product.name} />
            {state.errors.name && <p className="mt-1 text-sm text-red-600">{state.errors.name[0]}</p>}
          </div>

          <ImageUploader
            name="images"
            previews={picturePreviews}
            onPreviewsChange={setPicturePreviews}
            onFilesAdded={(files) => setNewPictures(prev => [...prev, ...files])}
            onFileRemoved={handleFileRemoved}
            maxFiles={3}
            error={state.errors.images?.[0]}
          />

          <div>
            <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">Product Price*</label>
            <input type="number" id="price" name="price" className={inputClassName(!!state.errors.price)} defaultValue={product.price ?? ''} />
            {state.errors.price && <p className="mt-1 text-sm text-red-600">{state.errors.price[0]}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Genetics (Morphs)*</label>
            <div className={`flex flex-wrap gap-2 rounded-lg border p-2 min-h-[4rem] ${state.errors.morphs ? 'border-red-500' : 'border-gray-300'}`}>
              {selectedMorphs.map(morph => (
                <div key={morph.id} className="flex items-center gap-2 bg-white border border-gray-300 rounded-full px-3 py-1 text-sm font-medium text-gray-700">
                  <input type="hidden" name="morphs" value={morph.id} />
                  <span className="h-2 w-2 rounded-full" style={{ backgroundColor: morph.color_hex }}></span>
                  <span>{morph.name}</span>
                  <button type="button" onClick={() => handleRemoveMorph(morph)}>
                    <CloseIcon className="h-3 w-3 text-gray-500 hover:text-gray-800" />
                  </button>
                </div>
              ))}
            </div>
            {state.errors.morphs && <p className="mt-1 text-sm text-red-600">{state.errors.morphs[0]}</p>}
            <div className="relative w-full mt-2">
              <input type="text" placeholder="Search Morph..." value={searchText} onChange={e => setSearchText(e.target.value)} onFocus={() => setIsInputFocused(true)} onBlur={() => setTimeout(() => setIsInputFocused(false), 150)} className="py-2.5 ps-4 pe-10 block w-full border-gray-300 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500" />
              <div className="absolute top-1/2 right-3 -translate-y-1/2 pointer-events-none text-gray-400"><PlusIcon /></div>
              {isInputFocused && (
                <div className="absolute z-50 w-full max-h-72 mt-1 p-1 bg-white border border-gray-200 rounded-lg overflow-y-auto shadow">
                  {filteredCategories.map((category: MorphCategory) => (
                    <div key={category.id}>
                      <div className="px-3 py-2 font-semibold text-sm" style={{ color: category.color_hex ?? '#1F2937' }}>{category.name}</div>
                      {category.morphs.map((morph: Morph) => (
                        <button type="button" key={morph.id} onClick={() => { handleAddMorph(morph); setSearchText(''); }} className="block w-full text-left text-sm px-4 py-2 hover:bg-gray-100 rounded-md">{morph.name}</button>
                      ))}
                      {category.sub_categories.map((sub: MorphSubCategory) => (
                        <div key={sub.id} className="pl-3">
                          <div className="px-3 py-1 text-xs font-medium" style={{ color: sub.color_hex ?? '#6B7280' }}>{sub.name}</div>
                          {(sub.morphs ?? []).map((morph: Morph) => (
                            <button type="button" key={morph.id} onClick={() => { handleAddMorph(morph); setSearchText(''); }} className="block w-full text-left text-sm px-4 py-2 hover:bg-gray-100 rounded-md">{morph.name}</button>
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
              <label htmlFor="sex" className="block text-sm font-medium text-gray-700 mb-1">Sex*</label>
              <select id="sex" name="sex" className={inputClassName(!!state.errors.sex)} defaultValue={product.sex ?? ''}>
                <option value="">Select</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Unknown">Unknown</option>
              </select>
              {state.errors.sex && <p className="mt-1 text-sm text-red-600">{state.errors.sex[0]}</p>}
            </div>
            <div>
              <label htmlFor="year" className="block text-sm font-medium text-gray-700 mb-1">Year*</label>
              <select id="year" name="year" className={inputClassName(!!state.errors.year)} defaultValue={product.year ?? ''}>
                <option value="">Select</option>
                {generateYearOptions().map(year => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>
              {state.errors.year && <p className="mt-1 text-sm text-red-600">{state.errors.year[0]}</p>}
            </div>
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">Product Description*</label>
            <textarea id="description" name="description" rows={4} className={inputClassName(!!state.errors.description)} defaultValue={product.description ?? ''}></textarea>
            {state.errors.description && <p className="mt-1 text-sm text-red-600">{state.errors.description[0]}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4 pt-4">
            <button type="button" onClick={() => router.back()} className="rounded-lg border border-gray-300 py-2.5">Cancel</button>
            <Button>Save Changes</Button>
          </div>
        </form>
      </div>
    </div>
  );
}
