import 'server-only'; // ป้องกันไม่ให้โค้ดนี้ถูก import ไปใช้ในฝั่ง Client โดยบังเอิญ
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';

// 1. กำหนด Type สำหรับ Farm
export interface Farm {
  id: number;
  user_id: string;
  created_at: string;
  name: string;
  breeder_name: string;
  logo_url: string | null;
  information: string | null; // 👈 เพิ่ม
  contact_instagram: string | null; // 👈 เพิ่ม
  contact_facebook: string | null; // 👈 เพิ่ม
  contact_line: string | null; // 👈 เพิ่ม
  contact_whatsapp: string | null; // 👈 เพิ่ม
}

// 2. สร้างฟังก์ชันสำหรับดึงข้อมูลฟาร์ม
export async function getFarmData(): Promise<Farm | null> {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    redirect('/login');
  }

  const { data: farm } = await supabase
    .from('farms')
    .select('*')
    .eq('user_id', user.id)
    .maybeSingle(); // ใช้ .maybeSingle() จะคืนค่า null ถ้าไม่เจอข้อมูล (ดีกว่า .single() ที่จะ throw error)

  return farm;
}