// src/app/(main)/farm/create/page.tsx
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { CreateFarmForm } from './_components/CreateFarmForm';

export default async function CreateFarmPage() {
  const supabase = await createClient();

  // 1. ตรวจสอบผู้ใช้
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    redirect('/login');
  }

  // 2. ตรวจสอบว่ามีฟาร์มแล้วหรือยังบน Server
  const { data: existingFarm } = await supabase
    .from('farms')
    .select('id')
    .eq('user_id', user.id)
    .maybeSingle();
  
  // 3. ถ้ามี ให้ redirect ทันที
  if (existingFarm) {
    redirect('/farm');
  }

  // 4. ถ้าไม่มี ก็แสดงฟอร์ม
  return (
    <div className="container mx-auto max-w-2xl py-4 bg-white dark:bg-gray-900">
      <div className="px-4 sm:px-8 border-b border-gray-300 dark:border-gray-700">
        <h1 className="text-2xl font-bold mb-4 text-[#1F2937] dark:text-white">
          Add Farm
        </h1>
      </div>
      <CreateFarmForm />
    </div>
  );
}