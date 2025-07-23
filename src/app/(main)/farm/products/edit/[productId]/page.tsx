'use client';

import { useState, FormEvent, useEffect, useMemo, ChangeEvent } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import { useAuth } from '@/context/AuthContext';
import Toastify from 'toastify-js';
import "toastify-js/src/toastify.css";
import { ImageUploader } from '@/components/ui/ImageUploader';

// --- Type Definitions ---
type Morph = { id: number; name: string; };
type MorphSubCategory = { id: number; name: string; color_hex: string; morphs: Morph[]; };
type MorphCategory = { id: number; name: string; color_hex: string | null; morphs: Morph[]; sub_categories: MorphSubCategory[]; };
type SelectedMorph = Morph & { color_hex?: string };

// --- SVG Icons ---
const PlusIcon = () => ( <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg> );
const CloseIcon = ({ ...props }) => ( <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"> <line x1="18" y1="6" x2="6" y2="18"></line> <line x1="6" y1="6" x2="18" y2="18"></line> </svg> );
const SpinnerIcon = () => ( <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"> <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle> <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path> </svg> );

export default function EditProductPage() {
    const router = useRouter();
    const params = useParams();
    const supabase = createClient();
    const { user } = useAuth();
    const productId = Number(params.productId);

    // Form state
    const [productName, setProductName] = useState('');
    const [selectedMorphs, setSelectedMorphs] = useState<SelectedMorph[]>([]);
    const [sex, setSex] = useState('');
    const [year, setYear] = useState('');
    const [description, setDescription] = useState('');
    const [priceRaw, setPriceRaw] = useState('');
    const [priceFormatted, setPriceFormatted] = useState('');
    
    const [newPictures, setNewPictures] = useState<File[]>([]);
    const [picturePreviews, setPicturePreviews] = useState<string[]>([]);

    // Data state
    const [allMorphs, setAllMorphs] = useState<MorphCategory[]>([]);

    // UI state
    const [isLoading, setIsLoading] = useState(false);
    const [isFetchingData, setIsFetchingData] = useState(true);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [searchText, setSearchText] = useState('');
    const [isInputFocused, setIsInputFocused] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            if (user && productId) {
                const { data: morphData, error: morphError } = await supabase.rpc('get_morphs_structured');
                if (morphError) console.error("Error fetching morphs:", morphError);
                else setAllMorphs(morphData || []);

                const { data: productData, error: productError } = await supabase
                    .from('products')
                    .select('*, product_morphs(morphs(*))')
                    .eq('id', productId)
                    .eq('user_id', user.id)
                    .single();

                if (productError || !productData) {
                    Toastify({ text: "Product not found or you don't have permission to edit it.", duration: 3000, style: { background: "#EF4444" } }).showToast();
                    router.push('/farm/products');
                    return;
                }
                
                setProductName(productData.name);
                setSex(productData.sex || '');
                setYear(productData.year || '');
                setDescription(productData.description || '');
                setPriceRaw(String(productData.price || ''));
                setPriceFormatted(formatPrice(String(productData.price || '')));
                setPicturePreviews(productData.image_urls || []);

                const populatedMorphs = productData.product_morphs.map((pm: { morphs: any; }) => {
                    const morph = pm.morphs;
                    let color_hex: string | undefined;
                    for (const cat of morphData || []) {
                        if (cat.morphs?.some((m: Morph) => m.id === morph.id)) { color_hex = cat.color_hex ?? undefined; break; }
                        for (const sub of cat.sub_categories ?? []) {
                            if (sub.morphs?.some((m: Morph) => m.id === morph.id)) { color_hex = sub.color_hex ?? undefined; break; }
                        }
                        if (color_hex) break;
                    }
                    return { ...morph, color_hex };
                });
                setSelectedMorphs(populatedMorphs);

                setIsFetchingData(false);
            }
        };
        fetchData();
    }, [user, productId, supabase, router]);
    
    const handleAddMorph = (morph: Morph) => {
        if (!selectedMorphs.find(m => m.id === morph.id)) {
            let color_hex: string | undefined;
            for (const cat of allMorphs) {
                if (cat.morphs?.some(m => m.id === morph.id)) { color_hex = cat.color_hex ?? undefined; break; }
                for (const sub of cat.sub_categories ?? []) {
                    if (sub.morphs?.some(m => m.id === morph.id)) { color_hex = sub.color_hex ?? undefined; break; }
                }
                if (color_hex) break;
            }
            setSelectedMorphs([...selectedMorphs, { ...morph, color_hex }]);
        }
    };
    
    const handleRemoveMorph = (morphToRemove: Morph) => { setSelectedMorphs(selectedMorphs.filter(m => m.id !== morphToRemove.id)); };

    const handleFileRemoved = (indexToRemove: number) => {
        const removedPreview = picturePreviews[indexToRemove];
        // If the removed preview was a newly uploaded file (blob), remove it from the file list
        if (removedPreview.startsWith('blob:')) {
            // This logic assumes that blob URLs are added sequentially.
            // We find how many blobs were before the one we removed to find its index in the File array.
            const blobIndexToRemove = picturePreviews.slice(0, indexToRemove).filter(p => p.startsWith('blob:')).length;
            setNewPictures(currentFiles => currentFiles.filter((_, i) => i !== blobIndexToRemove));
        }
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        if (!user) return;
        
        setIsLoading(true);
        setErrors({});

        try {
            const existingImageUrls = picturePreviews.filter(p => !p.startsWith('blob:'));
            const uploadedImageUrls: string[] = [];

            for (const picture of newPictures) {
                const filePath = `${user.id}/${productId}/${Date.now()}_${picture.name}`;
                const { error: uploadError } = await supabase.storage.from('product-images').upload(filePath, picture);
                if (uploadError) throw uploadError;
                const { data: { publicUrl } } = supabase.storage.from('product-images').getPublicUrl(filePath);
                if (publicUrl) uploadedImageUrls.push(publicUrl);
            }
            
            const finalImageUrls = [...existingImageUrls, ...uploadedImageUrls];

            const { error: updateError } = await supabase.from('products').update({
                name: productName,
                price: parseFloat(priceRaw) || null,
                sex,
                year,
                description,
                image_urls: finalImageUrls,
            }).eq('id', productId);

            if (updateError) throw updateError;

            const { error: deleteMorphsError } = await supabase.from('product_morphs').delete().eq('product_id', productId);
            if (deleteMorphsError) throw deleteMorphsError;

            const morphsToInsert = selectedMorphs.map(morph => ({ product_id: productId, morph_id: morph.id }));
            if (morphsToInsert.length > 0) {
                const { error: morphsInsertError } = await supabase.from('product_morphs').insert(morphsToInsert);
                if (morphsInsertError) throw morphsInsertError;
            }

            Toastify({ text: "Product updated successfully!", duration: 2000, style: { background: "#14B8A6", borderRadius: "8px" } }).showToast();
            setTimeout(() => {
                router.push(`/farm/products/${productId}`);
                router.refresh();
            }, 1500);

        } catch (error: unknown) {
            console.error("Error updating product:", error);
            let errorMessage = 'An unexpected error occurred.';
            if (error instanceof Error) {
                errorMessage = error.message;
            }
            setErrors({ api: errorMessage });
        } finally {
            setIsLoading(false);
        }
    };
    
    const filteredCategories = useMemo(() => {
        if (!allMorphs) return [];
        const selectedIds = new Set(selectedMorphs.map(m => m.id));
        const text = searchText.toLowerCase();
        const result: MorphCategory[] = [];
        for (const cat of allMorphs) {
            const matchedMorphs = (cat.morphs ?? []).filter(m => (!text || m.name.toLowerCase().includes(text)) && !selectedIds.has(m.id));
            const matchedSubs = (cat.sub_categories ?? []).map(sub => ({...sub, morphs: (sub.morphs ?? []).filter(m => (!text || m.name.toLowerCase().includes(text)) && !selectedIds.has(m.id))})).filter(sub => sub.morphs.length > 0);
            if (matchedMorphs.length > 0 || matchedSubs.length > 0) {
                result.push({ ...cat, morphs: matchedMorphs, sub_categories: matchedSubs });
            }
        }
        return result;
    }, [searchText, allMorphs, selectedMorphs]);

    const formatPrice = (value: string) => {
        if (!value) return '';
        const cleaned = value.replace(/,/g, '').replace(/[^\d.]/g, '');
        const numberValue = parseFloat(cleaned);
        if (isNaN(numberValue)) return '';
        return numberValue.toLocaleString('en-US');
    };

    const handlePriceChange = (e: ChangeEvent<HTMLInputElement>) => {
        const input = e.target.value;
        const cleaned = input.replace(/,/g, '').replace(/[^\d.]/g, '');
        setPriceRaw(cleaned);
        setPriceFormatted(formatPrice(cleaned));
    };

    const generateYearOptions = () => {
        const currentYear = new Date().getFullYear();
        const years = [];
        for (let i = 0; i < 10; i++) { years.push(currentYear - i); }
        return years;
    };
    
    if (isFetchingData) {
        return <div className="flex h-screen items-center justify-center">Loading form...</div>;
    }

    return (
        <div className="bg-white min-h-screen">
            <div className="container mx-auto max-w-lg py-4">
                <nav className="flex px-4 text-sm text-gray-500">
                    <Link href="/farm" className="hover:underline">Home</Link>
                    <span className="mx-2">/</span>
                    <Link href="/farm/products" className="hover:underline">Farm</Link>
                    <span className="mx-2">/</span>
                    <span className="font-medium text-gray-700">Edit Product</span>
                </nav>

                <div className="px-4 mt-4 pb-4 border-b border-gray-200">
                    <h1 className="text-2xl font-bold text-[#1F2937]">Edit Product</h1>
                </div>

                <form onSubmit={handleSubmit} className="p-4 space-y-6">
                    {/* ... (Form fields for name, price, morphs, etc.) ... */}
                    
                    <ImageUploader
                        previews={picturePreviews}
                        onPreviewsChange={setPicturePreviews}
                        onFilesAdded={(files) => setNewPictures(prev => [...prev, ...files])}
                        onFileRemoved={handleFileRemoved}
                        maxFiles={3}
                        error={errors.pictures}
                    />

                    <div className="grid grid-cols-2 gap-4 pt-4">
                         <button type="button" onClick={() => router.back()} className="rounded-lg border border-gray-300 py-2.5">Cancel</button>
                         <button type="submit" disabled={isLoading} className="rounded-lg bg-gray-800 text-white py-2.5 flex justify-center items-center">
                            {isLoading ? <SpinnerIcon /> : 'Save Changes'}
                         </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
