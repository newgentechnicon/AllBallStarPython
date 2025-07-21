'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

export async function updateProductStatus(productId: number, newStatus: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) { return { success: false, error: 'Unauthorized' }; }

  const { error } = await supabase
    .from('products')
    .update({ status: newStatus })
    .eq('id', productId)
    .eq('user_id', user.id);
    
  if (error) {
    console.error('Error updating product status:', error);
    return { success: false, error: error.message };
  }

  revalidatePath('/farm/products');
  return { success: true, message: 'Status updated successfully.' };
}

export async function softDeleteProduct(productId: number) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) { return { success: false, error: 'Unauthorized' }; }

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
  return { success: true, message: 'Product deleted successfully.' };
}