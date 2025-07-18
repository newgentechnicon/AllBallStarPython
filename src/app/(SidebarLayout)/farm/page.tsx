import Image from 'next/image';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';

// --- SVG Icon for Followers ---
const UserIcon = ({ ...props }) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
        <circle cx="12" cy="7" r="4" />
    </svg>
);


export default async function FarmPage() {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return redirect('/login');
  }

  // ดึงข้อมูลฟาร์มทั้งหมดของ user คนปัจจุบัน
  const { data: farm } = await supabase
    .from('farms')
    .select('*') // ดึงข้อมูลทุกคอลัมน์
    .eq('user_id', user.id)
    .single();

  // --- กรณีมีฟาร์มอยู่แล้ว ---
  if (farm) {
    return (
      <div 
        className="flex flex-col items-center justify-center p-4" 
        style={{ minHeight: 'calc(100vh - 4rem)' }}
      >
        <div className="w-full max-w-sm overflow-hidden rounded-lg bg-white shadow-lg dark:bg-gray-800">
          {/* Farm Logo */}
          <div className="relative w-full" style={{ aspectRatio: '1 / 1' }}>
            {farm.logo_url ? (
              <Image 
                src={farm.logo_url} 
                alt={`${farm.name} logo`} 
                layout="fill" 
                className="object-cover"
                priority
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-gray-200">
                <span className="text-gray-500">No Logo</span>
              </div>
            )}
          </div>

          {/* Farm Details */}
          <div className="p-6 text-center">
            <h2 className="text-2xl font-bold uppercase text-gray-800 dark:text-white">{farm.name}</h2>
            <p className="mt-1 text-gray-600 dark:text-gray-400">{farm.breeder_name}</p>
            
            <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-gray-100 px-3 py-1 text-gray-500 dark:bg-gray-700 dark:text-gray-400">
                <UserIcon className="h-4 w-4" />
                <span className="text-sm font-medium">0</span>
            </div>

            {/* Action Buttons */}
            <div className="mt-6 grid grid-cols-2 gap-4">
              <Link 
                href="/farm/edit" // สร้างหน้านี้ในอนาคต
                className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
              >
                Edit Farm
              </Link>
              <button 
                type="button"
                className="rounded-lg bg-gray-600 px-4 py-2 text-sm font-medium text-white hover:bg-gray-700 dark:bg-gray-500 dark:hover:bg-gray-600"
              >
                See Product
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // --- กรณีที่ยังไม่มีฟาร์ม ---
  return (
    <div 
      className="flex flex-col items-center justify-center px-4" 
      style={{ minHeight: 'calc(100vh - 4rem)' }}
    >
      <div className="flex w-full max-w-sm flex-col items-center rounded-lg bg-white p-8 text-center shadow-md dark:bg-gray-800">
        <Image
          src="/images/farm-1.png"
          alt="An illustration of a barn"
          width={232}
          height={118}
          quality={100}
          style={{ objectFit: 'contain' }}
        />
        <p className="mt-4 font-medium text-[#6B7280] dark:text-gray-400">
          You haven&apos;t added any farm yet. Add one to continue.
        </p>
        <Link 
          href="/farm/create"
          className="mt-5 flex w-full justify-center rounded-lg border border-transparent bg-[#888684] px-4 py-3 text-[15px] font-medium text-white hover:bg-neutral-700 focus:outline-none focus:neutral-2 focus:ring-neutral-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:bg-neutral-400 dark:bg-neutral-500 dark:hover:bg-neutral-600"
        >
          Add Farm
        </Link>
      </div>
    </div>
  );
}
