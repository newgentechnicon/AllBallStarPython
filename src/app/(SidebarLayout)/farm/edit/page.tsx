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

type FormErrors = {
    farmName?: string;
    logo?: string;
    breederName?: string;
    farmInfo?: string;
    api?: string;
};

export default function EditFarmPage() {
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
    const [isFetchingData, setIsFetchingData] = useState(true);

    // 1. ดึงข้อมูลฟาร์มเดิมมาแสดง
    useEffect(() => {
        const fetchFarmData = async () => {
            if (user) {
                const { data, error } = await supabase
                    .from('farms')
                    .select('*')
                    .eq('user_id', user.id)
                    .single(); // .single() จะ error ถ้าไม่เจอข้อมูลเลย

                if (error || !data) {
                    console.error("Could not fetch farm data or no farm exists:", error);
                    // ถ้าไม่เจอข้อมูลฟาร์ม ให้ส่งไปหน้าสร้างฟาร์มแทน
                    router.push('/farm/create');
                    return;
                }
                
                // นำข้อมูลที่ได้มาใส่ใน State
                setFarmName(data.name);
                setBreederName(data.breeder_name || '');
                setFarmInfo(data.information || '');
                setLogoPreview(data.logo_url || null);
                setInstagram(data.contact_instagram || '');
                setFacebook(data.contact_facebook || '');
                setLine(data.contact_line || '');
                setWhatsapp(data.contact_whatsapp || '');
                
                setIsFetchingData(false);
            }
        };

        fetchFarmData();
    }, [user, router, supabase]);

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setLogoFile(file);
            setErrors(prev => ({ ...prev, logo: undefined }));
            const reader = new FileReader();
            reader.onloadend = () => { setLogoPreview(reader.result as string); };
            reader.readAsDataURL(file);
        }
    };

    const handleRemoveImage = () => {
        setLogoFile(null);
        setLogoPreview(null);
        const fileInput = document.getElementById('file-upload') as HTMLInputElement;
        if (fileInput) { fileInput.value = ''; }
    };

    // 2. ปรับปรุง Validation สำหรับหน้า Edit
    const validateForm = (): FormErrors => {
        const newErrors: FormErrors = {};
        if (!farmName.trim()) newErrors.farmName = 'Farm name is required.';
        // โลโก้ไม่จำเป็นต้องใส่ใหม่ ถ้ามีของเดิมอยู่แล้ว
        if (!logoFile && !logoPreview) newErrors.logo = 'Farm logo is required.';
        if (!breederName.trim()) newErrors.breederName = "Breeder's name is required.";
        if (!farmInfo.trim()) newErrors.farmInfo = 'Farm information is required.';
        return newErrors;
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        const validationErrors = validateForm();
        setErrors(validationErrors);

        if (Object.keys(validationErrors).length > 0) return;
        if (!user) { setErrors({ api: "You must be logged in to edit a farm." }); return; }
        
        setIsLoading(true);

        try {
            let logoUrlToUpdate = logoPreview;

            if (logoFile) {
                const filePath = `${user.id}/${Date.now()}_${logoFile.name}`;
                const { error: uploadError } = await supabase.storage.from('farm-logos').upload(filePath, logoFile, { upsert: true });
                if (uploadError) throw uploadError;

                const { data: { publicUrl } } = supabase.storage.from('farm-logos').getPublicUrl(filePath);
                if (!publicUrl) throw new Error('Could not get public URL for the new logo.');
                logoUrlToUpdate = publicUrl;
            }

            const updates = {
                name: farmName,
                breeder_name: breederName,
                information: farmInfo,
                logo_url: logoUrlToUpdate,
                contact_instagram: instagram || null,
                contact_facebook: facebook || null,
                contact_line: line || null,
                contact_whatsapp: whatsapp || null,
            };

            const { error: updateError } = await supabase
                .from('farms')
                .update(updates)
                .eq('user_id', user.id);

            if (updateError) throw updateError;

            // --- ส่วนที่แก้ไข ---
            Toastify({
                text: "Update farm successfully",
                duration: 1500, // ลดเวลาลงเล็กน้อย
                close: true, gravity: "top", position: "right", stopOnFocus: true,
                style: { background: "#14B8A6", borderRadius: "8px" },
                // ใช้ callback เพื่อให้ทำงานหลังจาก Toast หายไป
                callback: function() {
                    // router.refresh() คือคำสั่งสำคัญในการบอกให้ Next.js ดึงข้อมูลใหม่
                    router.refresh();
                    router.push('/farm');
                }
              }).showToast();
            
        } catch (error: unknown) {
            console.error('Error updating farm:', error);
            let errorMessage = 'An unexpected error occurred.';
            if (error instanceof Error) {
                errorMessage = error.message;
            }
            setErrors({ api: errorMessage });
        } finally {
            // ใช้ finally เพื่อให้แน่ใจว่า isLoading จะเป็น false เสมอ ไม่ว่าจะสำเร็จหรือล้มเหลว
            setIsLoading(false);
        }
    };

    if (isFetchingData) {
        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-white">
                <ModalSpinner />
            </div>
        );
    }

    return (
        <div className="container mx-auto max-w-2xl py-4 bg-white">
            <div className="px-4 border-b border-gray-300">
                <h1 className="text-2xl font-bold mb-4 text-[#1F2937] dark:text-white ">Edit Farm</h1>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-8 rounded-lg bg-white p-8 dark:bg-gray-800" noValidate>
                {/* ... (JSX for form fields remains the same, but will be populated with data) ... */}
                <div>
                    <label htmlFor="farmName" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Farm Name*</label>
                    <input type="text" id="farmName" value={farmName} onChange={(e) => { setFarmName(e.target.value); setErrors(p => ({...p, farmName: undefined})); }} className={`mt-1 block w-full rounded-md focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white ${errors.farmName ? 'border-red-500' : 'border-gray-300'}`} placeholder="Put farm name here" />
                    {errors.farmName && <p className="mt-1 text-sm text-red-600">{errors.farmName}</p>}
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Farm Logo*</label>
                    <div className={`relative mt-1 w-full overflow-hidden rounded-lg border-1 ${errors.logo ? 'border-red-500' : 'border-gray-300'}`} style={{ aspectRatio: '1 / 1' }} >
                        {logoPreview ? ( <> <Image src={logoPreview} alt="Logo preview" layout="fill" className="object-cover" /> <button type="button" onClick={handleRemoveImage} className="absolute top-2 right-2 z-10 rounded-full bg-black bg-opacity-50 p-1.5 text-white transition-opacity hover:bg-opacity-75" aria-label="Remove image" > <CloseIcon className="h-4 w-4" /> </button> </> ) : ( <div className="flex h-full w-full items-center justify-center border-dashed border-gray-300 bg-gray-50 dark:bg-gray-700"> <div className="space-y-1 text-center"> <Image src="/images/farm-6.svg" alt="UploadIcon" width={70} height={45} quality={100} className="mx-auto" /> <div className="flex text-sm text-gray-600 dark:text-gray-400"> <label htmlFor="file-upload" className="relative cursor-pointer rounded-md bg-transparent font-medium text-slate-900 focus-within:outline-none focus-within:ring-2 focus-within:ring-slate-500 focus-within:ring-offset-2 hover:text-slate-950 dark:text-slate-300"> <span>Upload your files here</span> <input id="file-upload" name="file-upload" type="file" className="sr-only" onChange={handleFileChange} accept="image/*" /> </label> </div> <p className="text-xs text-gray-500 dark:text-gray-500">File size: 1:1,<br />Maximum size: 50MB</p> </div> </div> )}
                    </div>
                    {errors.logo && <p className="mt-1 text-sm text-red-600">{errors.logo}</p>}
                </div>
                <div>
                    <label htmlFor="breederName" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Breeder&#39;s Name*</label>
                    <input type="text" id="breederName" value={breederName} onChange={(e) => { setBreederName(e.target.value); setErrors(p => ({...p, breederName: undefined})); }} className={`mt-1 block w-full rounded-md focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white ${errors.breederName ? 'border-red-500' : 'border-gray-300'}`} placeholder="Put breeder's name here" />
                    {errors.breederName && <p className="mt-1 text-sm text-red-600">{errors.breederName}</p>}
                </div>
                <div>
                    <label htmlFor="farmInfo" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Farm Information*</label>
                    <textarea id="farmInfo" value={farmInfo} onChange={(e) => { setFarmInfo(e.target.value); setErrors(p => ({...p, farmInfo: undefined})); }} rows={4} className={`mt-1 block w-full rounded-md focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white ${errors.farmInfo ? 'border-red-500' : 'border-gray-300'}`} placeholder="Put farm information here"></textarea>
                    {errors.farmInfo && <p className="mt-1 text-sm text-red-600">{errors.farmInfo}</p>}
                </div>
                <div className="space-y-4">
                    <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">Your Contact</h3>
                    <div className="flex items-center gap-3"><div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-md bg-neutral-500 text-neutral-500 dark:bg-neutral-700 dark:text-neutral-400"><Image src="/images/farm-2.svg" alt="InstagramIcon" width={25} height={25} quality={100} className="mx-2 my-2" /></div><input type="text" value={instagram} onChange={(e) => setInstagram(e.target.value)} className="block w-full rounded-md border-gray-300 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white" placeholder="Put instagram id here" /></div>
                    <div className="flex items-center gap-3"><div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-md bg-neutral-500 text-neutral-500 dark:bg-neutral-700 dark:text-neutral-400"><Image src="/images/farm-3.svg" alt="FacebookIcon" width={25} height={25} quality={100} className="mx-6 my-6" /></div><input type="text" value={facebook} onChange={(e) => setFacebook(e.target.value)} className="block w-full rounded-md border-gray-300 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white" placeholder="Put facebook profile here" /></div>
                    <div className="flex items-center gap-3"><div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-md bg-neutral-500 text-neutral-500 dark:bg-neutral-700 dark:text-neutral-400"><Image src="/images/farm-4.svg" alt="LineIcon" width={25} height={25} quality={100} className="mx-2 my-2" /></div><input type="text" value={line} onChange={(e) => setLine(e.target.value)} className="block w-full rounded-md border-gray-300 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white" placeholder="Put line id here" /></div>
                    <div className="flex items-center gap-3"><div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-md bg-neutral-500 text-neutral-500 dark:bg-neutral-700 dark:text-neutral-400"><Image src="/images/farm-5.svg" alt="WhatsappIcon" width={25} height={25} quality={100} className="mx-2 my-2" /></div><input type="text" value={whatsapp} onChange={(e) => setWhatsapp(e.target.value)} className="block w-full rounded-md border-gray-300 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white" placeholder="Put whatsapp number here" /></div>
                </div>

                {errors.api && <p className="text-sm text-red-500 text-center">{errors.api}</p>}

                <div className="flex justify-center gap-4 pt-4">
                    <button type="button" onClick={() => router.back()} className="rounded-md min-w-[145.5px] border border-gray-300 bg-white py-2 px-4 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-600">
                        Cancel
                    </button>
                    <button type="submit" disabled={isLoading} className="inline-flex min-w-[145.5px] justify-center rounded-md border border-transparent bg-neutral-500 py-2 px-4 text-sm font-medium text-white hover:bg-neutral-700 focus:outline-none focus:ring-2 focus:ring-neutral-500 focus:ring-offset-2 disabled:opacity-50 dark:bg-neutral-500 dark:hover:bg-neutral-600">
                        {isLoading ? <SpinnerIcon /> : 'Save Changes'}
                    </button>
                </div>
            </form>
        </div>
    );
}
