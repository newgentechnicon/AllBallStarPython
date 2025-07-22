'use client';

import { useState, ChangeEvent, FormEvent, useEffect, useMemo } from 'react';
// 1. Import useParams hook
import { useRouter, useParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import { useAuth } from '@/context/AuthContext';
import Toastify from 'toastify-js';
import "toastify-js/src/toastify.css";

// --- Type Definitions ---
type Morph = { id: number; name: string; };
type MorphSubCategory = { id: number; name: string; color_hex: string; morphs: Morph[]; };
type MorphCategory = { id: number; name: string; color_hex: string | null; morphs: Morph[]; sub_categories: MorphSubCategory[]; };
type SelectedMorph = Morph & { color_hex?: string };

// --- SVG Icons ---
const PlusIcon = () => ( <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg> );
const CloseIcon = ({ ...props }) => ( <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"> <line x1="18" y1="6" x2="6" y2="18"></line> <line x1="6" y1="6" x2="18" y2="18"></line> </svg> );
const SpinnerIcon = () => ( <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"> <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle> <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path> </svg> );

// 2. ลบ params ออกจาก props ของ Component
export default function EditProductPage() {
    const router = useRouter();
    const params = useParams(); // 3. เรียกใช้ useParams hook
    const supabase = createClient();
    const { user } = useAuth();
    // 4. ดึงค่า productId จาก params ที่ได้จาก hook
    const productId = Number(params.productId);

    // Form state
    const [farmId, setFarmId] = useState<number | null>(null);
    const [productName, setProductName] = useState('');
    const [selectedMorphs, setSelectedMorphs] = useState<SelectedMorph[]>([]);
    const [sex, setSex] = useState('');
    const [year, setYear] = useState('');
    const [description, setDescription] = useState('');
    const [pictures, setPictures] = useState<File[]>([]);
    const [picturePreviews, setPicturePreviews] = useState<string[]>([]);
    const [priceRaw, setPriceRaw] = useState('');
    const [priceFormatted, setPriceFormatted] = useState('');
    
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
                
                setFarmId(productData.farm_id);
                setProductName(productData.name);
                setSex(productData.sex || '');
                setYear(productData.year || '');
                setDescription(productData.description || '');
                setPriceRaw(String(productData.price || ''));
                setPriceFormatted(formatPrice(String(productData.price || '')));
                setPicturePreviews(productData.image_urls || []);

                const populatedMorphs = productData.product_morphs.map(pm => {
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
    const handlePictureChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const files = Array.from(e.target.files);
            if (picturePreviews.length + files.length > 3) {
                setErrors({...errors, pictures: "You can only upload a maximum of 3 pictures."});
                return;
            }
            setPictures(prev => [...prev, ...files]);
            const newPreviews = files.map(file => URL.createObjectURL(file));
            setPicturePreviews(prev => [...prev, ...newPreviews]);
        }
    };
    const handleRemovePicture = (index: number) => {
        const removedPreview = picturePreviews[index];
        setPicturePreviews(prev => prev.filter((_, i) => i !== index));
        if (removedPreview.startsWith('blob:')) {
            const fileIndex = picturePreviews.slice(0, index).filter(p => p.startsWith('blob:')).length;
            setPictures(prev => prev.filter((_, i) => i !== fileIndex));
        }
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        if (!user || !farmId) return;
        
        setIsLoading(true);
        setErrors({});

        try {
            const newImageFiles = pictures;
            const existingImageUrls = picturePreviews.filter(p => !p.startsWith('blob:'));
            const uploadedImageUrls: string[] = [];

            for (const picture of newImageFiles) {
                const filePath = `${user.id}/${farmId}/${Date.now()}_${picture.name}`;
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
                    <div>
                        <label htmlFor="productName" className="block text-sm font-medium text-gray-700 mb-1">Product Name*</label>
                        <input type="text" id="productName" value={productName} onChange={e => setProductName(e.target.value)} className="w-full rounded-lg border-gray-300" placeholder="Put product name here" required />
                    </div>
                    <div>
                        <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">Product Price*</label>
                        <input type="text" id="price" value={priceFormatted} onChange={handlePriceChange} className="w-full rounded-lg border-gray-300" placeholder="Put product price here" required inputMode="numeric" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Morph*</label>
                        <div className="flex flex-wrap gap-2 rounded-lg border border-gray-300 p-2 min-h-[4rem]">
                            {selectedMorphs.map(morph => (
                                <div key={morph.id} className="flex items-center gap-2 bg-white border border-gray-300 rounded-full px-3 py-1 text-sm font-medium text-gray-700">
                                    <span className="h-2 w-2 rounded-full" style={{ backgroundColor: morph.color_hex ?? '#9CA3AF' }}></span>
                                    <span>{morph.name}</span>
                                    <button type="button" onClick={() => handleRemoveMorph(morph)}>
                                        <CloseIcon className="h-3 w-3 text-gray-500 hover:text-gray-800" />
                                    </button>
                                </div>
                            ))}
                        </div>
                        <div className="relative w-full mt-2">
                             <input type="text" placeholder="Search Morph..." value={searchText} onChange={e => setSearchText(e.target.value)} onFocus={() => setIsInputFocused(true)} onBlur={() => setTimeout(() => setIsInputFocused(false), 150)} className="py-2.5 ps-4 pe-10 block w-full border-gray-300 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500" />
                            <div className="absolute top-1/2 right-3 -translate-y-1/2 pointer-events-none text-gray-400"><PlusIcon /></div>
                            {isInputFocused && (
                                <div className="absolute z-50 w-full max-h-72 mt-1 p-1 bg-white border border-gray-200 rounded-lg overflow-y-auto shadow">
                                    {filteredCategories.length === 0 && <div className="px-4 py-2 text-sm text-gray-500">No results found.</div>}
                                    {filteredCategories.map(category => (
                                        <div key={category.id}>
                                            <div className="px-3 py-2 font-semibold text-sm" style={{ color: category.color_hex ?? '#1F2937' }}>{category.name}</div>
                                            {(category.morphs ?? []).map(morph => (<button type="button" key={morph.id} onClick={() => { handleAddMorph(morph); setSearchText(''); }} className="block w-full text-left text-sm px-4 py-2 hover:bg-gray-100 rounded-md">{morph.name}</button>))}
                                            {(category.sub_categories ?? []).map(sub => (
                                                <div key={sub.id} className="pl-3">
                                                    <div className="px-3 py-1 text-xs font-medium" style={{ color: sub.color_hex }}>{sub.name}</div>
                                                    {(sub.morphs ?? []).map(morph => (<button type="button" key={morph.id} onClick={() => { handleAddMorph(morph); setSearchText(''); }} className="block w-full text-left text-sm px-4 py-2 hover:bg-gray-100 rounded-md">{morph.name}</button>))}
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
                            <select id="sex" value={sex} onChange={e => setSex(e.target.value)} className="w-full rounded-lg border-gray-300" required>
                                <option value="">Select</option>
                                <option value="Male">Male</option>
                                <option value="Female">Female</option>
                            </select>
                        </div>
                        <div>
                            <label htmlFor="year" className="block text-sm font-medium text-gray-700 mb-1">Year*</label>
                            <select id="year" value={year} onChange={e => setYear(e.target.value)} className="w-full rounded-lg border-gray-300" required>
                                <option value="">Select</option>
                                {generateYearOptions().map(y => <option key={y} value={y}>{y}</option>)}
                            </select>
                        </div>
                    </div>
                    <div>
                        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">Product Description*</label>
                        <textarea id="description" value={description} onChange={e => setDescription(e.target.value)} rows={4} maxLength={100} className="w-full rounded-lg border-gray-300" placeholder="Put product description here"></textarea>
                        <p className="text-right text-xs text-gray-500">{description.length}/100</p>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Product Picture* ({picturePreviews.length}/3)</label>
                        <div className="mt-1 flex justify-center rounded-md border-2 border-dashed border-gray-300 px-6 pt-5 pb-6">
                            <div className="space-y-1 text-center">
                                <label htmlFor="picture-upload" className="cursor-pointer"><p className="text-blue-600 hover:underline">Upload your files here</p></label>
                                <input id="picture-upload" type="file" className="sr-only" multiple onChange={handlePictureChange} accept="image/*" disabled={picturePreviews.length >= 3} />
                                <p className="text-xs text-gray-500">Maximum size: 50MB</p>
                            </div>
                        </div>
                        <div className="mt-2 grid grid-cols-3 gap-2">
                            {picturePreviews.map((preview, index) => (
                                <div key={preview} className="relative aspect-square">
                                    <Image src={preview} alt={`preview ${index}`} layout="fill" className="object-cover rounded-lg" />
                                    <button type="button" onClick={() => handleRemovePicture(index)} className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-0.5"><CloseIcon className="h-3 w-3" /></button>
                                </div>
                            ))}
                        </div>
                    </div>
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
