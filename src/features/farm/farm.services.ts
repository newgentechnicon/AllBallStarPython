import 'server-only';
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import type { Farm } from './farm.types';

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