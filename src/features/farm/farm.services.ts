import 'server-only';
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import type { Farm, FarmContactInfo } from './farm.types';

/**
 * ดึงข้อมูลฟาร์มของผู้ใช้ที่ล็อกอินอยู่
 * @returns Promise<Farm | null> ข้อมูลฟาร์ม หรือ null ถ้าไม่พบ
 */
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
    .maybeSingle();

  return farm;
}

export async function getAllFarms(): Promise<Pick<Farm, 'id' | 'name' | 'logo_url' | 'information' | 'breeder_name' | 'contact_instagram' | 'contact_facebook' | 'contact_line' | 'contact_whatsapp' | 'contact_wechat'>[]> {
  const supabase = await createClient();
  
  const { data: farms, error } = await supabase
    .from('farms')
    .select('id, name, logo_url, information, breeder_name, contact_instagram, contact_facebook, contact_line, contact_whatsapp, contact_wechat')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching all farms:', error);
    return [];
  }
  
  return farms;
}

export async function getFarmById(id: number): Promise<FarmContactInfo | null> {
  const supabase = await createClient();

  // ป้องกันการ query โดยไม่จำเป็นถ้าไม่มี farm_id
  if (id === 0) return null;

  const { data: farm, error } = await supabase
    .from('farms')
    .select(
      'name, logo_url, breeder_name, contact_instagram, contact_facebook, contact_line, contact_whatsapp, contact_wechat'
    )
    .eq('id', id)
    .maybeSingle(); // ใช้ .maybeSingle() เพื่อให้ได้ผลลัพธ์เป็น object เดียว หรือ null

  if (error) {
    console.error(`Error fetching farm by ID (${id}):`, error);
    return null;
  }

  return farm;
}

export async function checkIfUserHasFarm(): Promise<boolean> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return false;

  const { data, error } = await supabase
    .from('farms')
    .select('id')
    .eq('user_id', user.id)
    .maybeSingle();

  return !!data && !error;
}