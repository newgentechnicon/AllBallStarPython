'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import type { TablesUpdate } from '@/types/database.types';

/**
 * Action สำหรับอัปเดตข้อมูลฟาร์ม
 * @param farmId - ID ของฟาร์มที่จะอัปเดต
 * @param formData - ข้อมูลจากฟอร์ม
 */
export async function updateFarmAction(farmId: number, formData: FormData) {
  const supabase = await createClient();

  // ใช้ TablesUpdate<"farms"> เพื่อให้ได้ Type ที่ถูกต้องสำหรับการอัปเดต
  const updatedData: TablesUpdate<'farms'> = {
    name: formData.get('name') as string,
    breeder_name: formData.get('breeder_name') as string,
    information: formData.get('information') as string,
    contact_facebook: formData.get('contact_facebook') as string,
    contact_instagram: formData.get('contact_instagram') as string,
    contact_line: formData.get('contact_line') as string,
    contact_whatsapp: formData.get('contact_whatsapp') as string,
    updated_at: new Date().toISOString(), // อัปเดตเวลาล่าสุด
  };

  const { error } = await supabase
    .from('farms')
    .update(updatedData)
    .eq('id', farmId);

  if (error) {
    console.error('Error updating farm:', error);
    return redirect('/farm?error=update_failed');
  }

  revalidatePath('/farm');
  redirect('/farm?success=updated');
}