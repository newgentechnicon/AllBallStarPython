'use client';

import { useState, ChangeEvent, FormEvent, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { createClient } from '@/lib/supabase/client';
import { useAuth } from '@/context/AuthContext';
import Toastify from 'toastify-js';
import "toastify-js/src/toastify.css";

// --- SVG Icons ---
const SpinnerIcon = () => ( <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"> <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle> <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path> </svg> );
const CloseIcon = ({ ...props }) => ( <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"> <line x1="18" y1="6" x2="6" y2="18"></line> <line x1="6" y1="6" x2="18" y2="18"></line> </svg> );
const ModalSpinner = () => ( <svg className="animate-spin h-10 w-10 text-gray-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"> <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle> <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path> </svg> );

// Define a type for our form errors
type FormErrors = {
    farmName?: string;
    logo?: string;
    breederName?: string;
    farmInfo?: string;
    api?: string; // For errors from Supabase
};

export default function CreateFarmPage() {
    const router = useRouter();
    const supabase = createClient();
    const { user } = useAuth();

    // Form state
    const [farmName, setFarmName] = useState('');
    const [breederName, setBreederName] = useState('');
    const [farmInfo, setFarmInfo] = useState('');
    const [logoFile, setLogoFile] = useState<File | null>(null);
    const [logoPreview, setLogoPreview] = useState<string | null>(null);
    const [instagram, setInstagram] = useState('');
    const [facebook, setFacebook] = useState('');
    const [line, setLine] = useState('');
    const [whatsapp, setWhatsapp] = useState('');
    
    // UI state
    const [isLoading, setIsLoading] = useState(false);
    const [errors, setErrors] = useState<FormErrors>({});
    const [isCheckingFarm, setIsCheckingFarm] = useState(true);

    useEffect(() => {
        const checkExistingFarm = async () => {
            if (user) {
                const { data, error } = await supabase
                    .from('farms')
                    .select('id')
                    .eq('user_id', user.id)
                    .maybeSingle();

                if (error) {
                    console.error("Error checking for existing farm:", error);
                }
                
                if (data) {
                    console.log("Farm already exists. Redirecting...");
                    router.push('/farm');
                } else {
                    setIsCheckingFarm(false);
                }
            } else if (user === null) {
                 setIsCheckingFarm(false);
            }
        };

        checkExistingFarm();
    }, [user, router, supabase]);

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setLogoFile(file);
            setErrors(prev => ({ ...prev, logo: undefined }));
            const reader = new FileReader();
            reader.onloadend = () => {
                setLogoPreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleRemoveImage = () => {
        setLogoFile(null);
        setLogoPreview(null);
        const fileInput = document.getElementById('file-upload') as HTMLInputElement;
        if (fileInput) {
            fileInput.value = '';
        }
    };

    const validateForm = (): FormErrors => {
        const newErrors: FormErrors = {};
        if (!farmName.trim()) newErrors.farmName = 'Farm name is required.';
        if (!logoFile) newErrors.logo = 'Farm logo is required.';
        if (!breederName.trim()) newErrors.breederName = "Breeder's name is required.";
        if (!farmInfo.trim()) newErrors.farmInfo = 'Farm information is required.';
        return newErrors;
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        
        const validationErrors = validateForm();
        setErrors(validationErrors);

        if (Object.keys(validationErrors).length > 0) {
            return;
        }
        
        if (!user) {
            setErrors({ api: "You must be logged in to create a farm." });
            return;
        }
        
        setIsLoading(true);

        try {
            const { data: existingFarm, error: checkError } = await supabase
                .from('farms')
                .select('id')
                .eq('user_id', user.id)
                .maybeSingle();

            if (checkError) throw checkError;

            if (existingFarm) {
                throw new Error("You can only create one farm per account.");
            }

            const filePath = `${user.id}/${Date.now()}_${logoFile!.name}`;
            const { error: uploadError } = await supabase.storage.from('farm-logos').upload(filePath, logoFile!);
            if (uploadError) throw uploadError;

            const { data: { publicUrl } } = supabase.storage.from('farm-logos').getPublicUrl(filePath);
            if (!publicUrl) throw new Error('Could not get public URL for the logo.');

            const { error: insertError } = await supabase.from('farms').insert({
                user_id: user.id,
                name: farmName,
                breeder_name: breederName,
                information: farmInfo,
                logo_url: publicUrl,
                contact_instagram: instagram || null,
                contact_facebook: facebook || null,
                contact_line: line || null,
                contact_whatsapp: whatsapp || null,
            });
            if (insertError) throw insertError;

            const toastNode = document.createElement('div');
            toastNode.className = 'flex items-center justify-between w-full';
            toastNode.innerHTML = `
                <div class="flex items-center">
                    <img src="/images/farm-7.svg" class="h-6 w-6 mr-3" alt="Success" />
                    <span>Add farm successfully</span>
                </div>
            `;

            const closeButton = document.createElement('button');
            closeButton.className = 'ml-4 inline-flex shrink-0 justify-center items-center size-5 rounded-lg text-white opacity-50 hover:opacity-100 focus:outline-none focus:opacity-100';
            closeButton.innerHTML = `<svg class="shrink-0 size-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M18 6 6 18"></path>
            <path d="m6 6 12 12"></path>
          </svg>`;
            toastNode.appendChild(closeButton);
            
            const toastInstance = Toastify({
                node: toastNode,
                duration: 3000,
                close: false, // เราสร้างปุ่มปิดเอง
                gravity: "top",
                position: "right",
                stopOnFocus: true,
                style: {
                  background: "#14B8A6",
                  borderRadius: "8px",
                  padding: "16px",
                  minWidth: "320px",
                },
              });

            toastInstance.showToast();

            closeButton.onclick = () => { toastInstance.hideToast(); };
            
            setTimeout(() => {
                router.push('/farm');
                router.refresh();
            }, 2000);

        } catch (error: unknown) {
            let errorMessage = 'An unexpected error occurred.';
            if (error instanceof Error) {
                errorMessage = error.message;
            } else if (typeof error === 'string') {
                errorMessage = error;
            }
            console.error('Error creating farm:', error);
            setErrors({ api: errorMessage });
            setIsLoading(false);
        }
    };

    return (
        <div className="container mx-auto max-w-2xl py-4 bg-white">
            {isCheckingFarm && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30">
                    <div className="flex flex-col items-center rounded-lg bg-white p-6 shadow-xl">
                        <ModalSpinner />
                        <p className="mt-4 text-sm text-gray-700">Checking your farm status...</p>
                    </div>
                </div>
            )}

            <div className="px-4 border-b border-gray-300">
                <h1 className="text-2xl font-bold mb-4 text-[#1F2937] dark:text-white ">Add Farm</h1>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-8 rounded-lg bg-white p-8 dark:bg-gray-800" noValidate>
                {/* Farm Name */}
                <div>
                    <label htmlFor="farmName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Farm Name*</label>
                    <input type="text" id="farmName" value={farmName} onChange={(e) => { setFarmName(e.target.value); setErrors(p => ({...p, farmName: undefined})); }} className={`py-2.5 sm:py-3 px-4 block w-full rounded-lg sm:text-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-neutral-900 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600 ${errors.farmName ? 'border-red-500' : 'border-gray-200 dark:border-neutral-700'}`} placeholder="Put farm name here" />
                    {errors.farmName && <p className="mt-1 text-sm text-red-600">{errors.farmName}</p>}
                </div>

                {/* Farm Logo */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Farm Logo*</label>
                    <div 
                        className={`relative w-full overflow-hidden rounded-lg border-1 border-dashed ${errors.logo ? 'border-red-500' : 'border-gray-300'}`} 
                        style={{ aspectRatio: '1 / 1' }}
                    >
                        {logoPreview ? (
                            <>
                                <Image src={logoPreview} alt="Logo preview" layout="fill" className="object-cover" />
                                <button
                                    type="button"
                                    onClick={handleRemoveImage}
                                    className="absolute top-2 right-2 z-10 rounded-full bg-gray-300 opacity-80 p-1.5 text-white transition-opacity hover:bg-opacity-75"
                                    aria-label="Remove image"
                                >
                                    <CloseIcon className="h-4 w-4" />
                                </button>
                            </>
                        ) : (
                            <div className="flex h-full w-full items-center justify-center border-dashed border-gray-300 dark:bg-neutral-900">
                                <div className="space-y-1 text-center">
                                    <Image src="/images/farm-6.svg" alt="UploadIcon" width={70} height={45} quality={100} className="mx-auto" />
                                    <div className="flex text-sm text-gray-600 dark:text-gray-400">
                                        <label htmlFor="file-upload" className="relative cursor-pointer rounded-md bg-transparent font-medium text-slate-900 focus-within:outline-none focus-within:ring-2 focus-within:ring-slate-500 focus-within:ring-offset-2 hover:text-slate-950 dark:text-slate-300">
                                            <span>Upload your files here</span>
                                            <input id="file-upload" name="file-upload" type="file" className="sr-only" onChange={handleFileChange} accept="image/*" />
                                        </label>
                                    </div>
                                    <p className="text-xs text-gray-500 dark:text-gray-500">File size: 1:1,<br />Maximum size: 50MB</p>
                                </div>
                            </div>
                        )}
                    </div>
                    {errors.logo && <p className="mt-1 text-sm text-red-600">{errors.logo}</p>}
                </div>
                
                {/* Breeder's Name */}
                <div>
                    <label htmlFor="breederName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Breeder&#39;s Name*</label>
                    <input type="text" id="breederName" value={breederName} onChange={(e) => { setBreederName(e.target.value); setErrors(p => ({...p, breederName: undefined})); }} className={`py-2.5 sm:py-3 px-4 block w-full rounded-lg sm:text-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-neutral-900 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600 ${errors.breederName ? 'border-red-500' : 'border-gray-200 dark:border-neutral-700'}`} placeholder="Put breeder's name here" />
                    {errors.breederName && <p className="mt-1 text-sm text-red-600">{errors.breederName}</p>}
                </div>
                {/* Farm Information */}
                <div>
                    <label htmlFor="farmInfo" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Farm Information*</label>
                    <textarea id="farmInfo" value={farmInfo} onChange={(e) => { setFarmInfo(e.target.value); setErrors(p => ({...p, farmInfo: undefined})); }} rows={4} className={`py-2.5 sm:py-3 px-4 block w-full rounded-lg sm:text-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-neutral-900 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600 ${errors.farmInfo ? 'border-red-500' : 'border-gray-200 dark:border-neutral-700'}`} placeholder="Put farm information here"></textarea>
                    {errors.farmInfo && <p className="mt-1 text-sm text-red-600">{errors.farmInfo}</p>}
                </div>
                
                {/* Your Contact */}
                <div className="space-y-4">
                    <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">Your Contact</h3>
                    <div className="flex items-center gap-3"><div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-md bg-neutral-500 text-neutral-500 dark:bg-neutral-700 dark:text-neutral-400"><Image src="/images/farm-2.svg" alt="InstagramIcon" width={25} height={25} quality={100} className="mx-2 my-2" /></div><input type="text" value={instagram} onChange={(e) => setInstagram(e.target.value)} className="py-2.5 sm:py-3 px-4 block w-full border-gray-200 rounded-lg sm:text-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600" placeholder="Put instagram id here" /></div>
                    <div className="flex items-center gap-3"><div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-md bg-neutral-500 text-neutral-500 dark:bg-neutral-700 dark:text-neutral-400"><Image src="/images/farm-3.svg" alt="FacebookIcon" width={25} height={25} quality={100} className="mx-6 my-6" /></div><input type="text" value={facebook} onChange={(e) => setFacebook(e.target.value)} className="py-2.5 sm:py-3 px-4 block w-full border-gray-200 rounded-lg sm:text-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600" placeholder="Put facebook profile here" /></div>
                    <div className="flex items-center gap-3"><div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-md bg-neutral-500 text-neutral-500 dark:bg-neutral-700 dark:text-neutral-400"><Image src="/images/farm-4.svg" alt="LineIcon" width={25} height={25} quality={100} className="mx-2 my-2" /></div><input type="text" value={line} onChange={(e) => setLine(e.target.value)} className="py-2.5 sm:py-3 px-4 block w-full border-gray-200 rounded-lg sm:text-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600" placeholder="Put line id here" /></div>
                    <div className="flex items-center gap-3"><div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-md bg-neutral-500 text-neutral-500 dark:bg-neutral-700 dark:text-neutral-400"><Image src="/images/farm-5.svg" alt="WhatsappIcon" width={25} height={25} quality={100} className="mx-2 my-2" /></div><input type="text" value={whatsapp} onChange={(e) => setWhatsapp(e.target.value)} className="py-2.5 sm:py-3 px-4 block w-full border-gray-200 rounded-lg sm:text-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600" placeholder="Put whatsapp number here" /></div>
                </div>

                {errors.api && <p className="text-sm text-red-500 text-center">{errors.api}</p>}

                <div className="flex justify-center gap-4 pt-4">
                    <button type="button" onClick={() => router.back()} className="rounded-md min-w-[145.5px] border border-gray-300 bg-white py-2 px-4 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-600">
                        Cancel
                    </button>
                    <button type="submit" disabled={isLoading} className="inline-flex min-w-[145.5px] justify-center rounded-md border border-transparent bg-neutral-500 py-2 px-4 text-sm font-medium text-white hover:bg-neutral-700 focus:outline-none focus:ring-2 focus:ring-neutral-500 focus:ring-offset-2 disabled:opacity-50 dark:bg-neutral-500 dark:hover:bg-neutral-600">
                        {isLoading ? <SpinnerIcon /> : 'Add'}
                    </button>
                </div>
            </form>
        </div>
    );
}
