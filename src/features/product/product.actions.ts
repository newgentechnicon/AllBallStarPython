'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import type { TablesInsert } from '@/types/database.types';

/**
 * Action สำหรับสร้างสินค้าใหม่
 * @param formData - ข้อมูลจากฟอร์ม
 */
export async function createProductAction(formData: FormData) {
  const supabase = await createClient();
  
  const { data: { user } } = await supabase.auth.getUser();
  if(!user) return { success: false, message: 'ไม่ได้รับอนุญาต' };

  // ใช้ TablesInsert<'products'> เพื่อให้ได้ Type ที่ถูกต้องสำหรับการสร้างข้อมูล
  const productData: TablesInsert<'products'> = {
    farm_id: Number(formData.get('farm_id')),
    user_id: user.id, // เพิ่ม user_id ที่ขาดไปตาม schema
    name: formData.get('name') as string,
    price: Number(formData.get('price')) || null,
    sex: formData.get('sex') as string || null,
    status: 'Available',
    year: formData.get('year') as string,
    description: formData.get('description') as string,
  };

  const { data: newProduct, error } = await supabase.from('products').insert(productData).select().single();

  if (error) {
    console.error('Error creating product:', error);
    return { success: false, message: 'ไม่สามารถสร้างสินค้าได้' };
  }

  revalidatePath('/products');
  return { success: true, message: 'สร้างสินค้าสำเร็จ', product: newProduct };
}

/**
 * Action สำหรับลบสินค้า (Soft Delete)
 * @param productId - ID ของสินค้าที่จะลบ
 */
export async function deleteProductAction(productId: number) {
  const supabase = await createClient();

  const { error } = await supabase
    .from('products')
    .update({ deleted_at: new Date().toISOString() })
    .eq('id', productId);

  if (error) {
    console.error('Error deleting product:', error);
    return { success: false, message: 'ไม่สามารถลบสินค้าได้' };
  }

  revalidatePath('/products');
  return { success: true, message: 'ลบสินค้าสำเร็จ' };
}