'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

// --- ฟังก์ชันเดิม (updateProductStatus) ---
export async function updateProductStatus(productId: number, newStatus: string) {
  // FIX: เพิ่ม await
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return { success: false, error: 'Unauthorized' };
  }
  const { data, error } = await supabase
    .from('products')
    .update({ status: newStatus })
    .eq('id', productId)
    .eq('user_id', user.id)
    .select()
    .single();
  if (error) {
    console.error('Error updating product status:', error);
    return { success: false, error: error.message };
  }
  revalidatePath('/farm/products');
  return { success: true, data };
}


// --- ฟังก์ชันสำหรับ Soft Delete ---
export async function softDeleteProduct(productId: number) {
  // FIX: เพิ่ม await
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return { success: false, error: 'Unauthorized' };
  }

  const { error } = await supabase
    .from('products')
    .update({ deleted_at: new Date().toISOString() })
    .eq('id', productId)
    .eq('user_id', user.id);

  if (error) {
    console.error('Error soft deleting product:', error);
    return { success: false, error: error.message };
  }

  revalidatePath('/farm/products');
  return { success: true };
}
