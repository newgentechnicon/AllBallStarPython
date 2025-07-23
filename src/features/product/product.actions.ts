'use server';

import { z } from 'zod';
import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { getProductsPageData } from './product.services';
import type { CreateProductState, EditProductState } from './product.types';

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

// ✅ 1. สร้าง Zod Schema ที่สมบูรณ์ขึ้น
const productSchema = z.object({
  name: z.string().min(1, 'Product name is required.'),
  price: z.coerce.number().refine(val => typeof val === 'number' && !isNaN(val), { message: 'Price must be a number.' }).positive('Price must be positive.'),
  sex: z.string().min(1, 'Sex is required.'),
  year: z.string().min(1, 'Year is required.'),
  description: z.string().min(1, 'Description is required.'),
  morphs: z.preprocess((val) => (Array.isArray(val) ? val : [val]), z.array(z.string()).min(1, "At least one morph is required.")),
  // ✅ 2. เพิ่ม Validation สำหรับรูปภาพ
  images: z.preprocess((val) => (Array.isArray(val) ? val : [val]), 
    z.array(z.instanceof(File))
     .min(1, "At least one image is required.")
     .refine((files) => files.every(file => file.size <= MAX_FILE_SIZE), `Max file size is 5MB.`)
     .refine((files) => files.every(file => ACCEPTED_IMAGE_TYPES.includes(file.type)), '.jpg, .jpeg, .png and .webp files are accepted.')
  ),
});

const editProductSchema = z.object({
  id: z.coerce.number(),
  name: z.string().min(1, 'Name is required.'),
  price: z.preprocess((val) => (val === "" ? null : Number(val)), z.number({ error: "Price must be a number." }).positive("Price must be positive.").nullable()),
  sex: z.string().min(1, 'Sex is required.'),
  year: z.string().min(1, 'Year is required.'),
  description: z.string().min(1, 'Description is required.'),
  morphs: z.preprocess((val) => (Array.isArray(val) ? val : [val]), z.array(z.string()).min(1, "At least one morph is required.")),
  existingImageUrls: z.preprocess((val) => (typeof val === 'string' && val ? val.split(',') : []), z.array(z.string()).optional())
});


/**
 * Fetches product data for client components.
 */
export async function getProductsAction(filters: {
  page: string | string[];
  q: string | string[];
  status: string | string[];
}) {
  const productData = await getProductsPageData(filters);
  return productData;
}

/**
 * Updates the status of a single product.
 */
export async function updateProductStatus(productId: number, newStatus: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return { success: false, error: 'Unauthorized' };
  }

  const { error } = await supabase
    .from('products')
    .update({ status: newStatus })
    .eq('id', productId)
    .eq('user_id', user.id);
    
  if (error) {
    return { success: false, error: error.message };
  }

  revalidatePath('/farm/products');
  return { success: true, message: 'Status updated successfully.' };
}

/**
 * Soft deletes a single product.
 */
export async function softDeleteProduct(productId: number) {
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
    return { success: false, error: error.message };
  }

  revalidatePath('/farm/products');
  return { success: true, message: 'Product deleted successfully.' };
}

/**
 * Creates a new product.
 */
export async function createProductAction(prevState: CreateProductState, formData: FormData): Promise<CreateProductState> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { errors: { _form: "Authentication required." } };

  const { data: farm } = await supabase.from('farms').select('id').eq('user_id', user.id).single();
  if (!farm) return { errors: { _form: "Farm not found." } };

  // ✅ 3. ใช้ .getAll() เพื่อรับค่าทั้งหมดจาก field ที่มีหลายค่า
  const validatedFields = productSchema.safeParse({
    name: formData.get('name'),
    price: formData.get('price'),
    sex: formData.get('sex'),
    year: formData.get('year'),
    description: formData.get('description'),
    morphs: formData.getAll('morphs'),
    images: formData.getAll('images'), // 👈 ใช้ .getAll() ที่นี่
  });

  if (!validatedFields.success) {
    return { errors: validatedFields.error.flatten().fieldErrors, fields: Object.fromEntries(formData.entries()) };
  }

  const imageFile = formData.get('images') as File;
  if (!imageFile || imageFile.size === 0) {
    return { errors: { images: ['Image is required.'] }, fields: Object.fromEntries(formData.entries()) };
  }

  const { images: imageFiles, morphs, ...productData } = validatedFields.data;

  try {
    // ✅ 4. อัปโหลดรูปภาพทั้งหมด
    const imageUrls: string[] = [];
    for (const imageFile of imageFiles) {
        const filePath = `${user.id}/${farm.id}/${Date.now()}_${imageFile.name}`;
        const { error: uploadError } = await supabase.storage.from('product-images').upload(filePath, imageFile);
        if (uploadError) throw new Error(`Image upload failed: ${uploadError.message}`);
        
        const { data: { publicUrl } } = supabase.storage.from('product-images').getPublicUrl(filePath);
        imageUrls.push(publicUrl);
    }
    
    const { data: newProduct, error: insertError } = await supabase.from('products').insert({
      ...productData,
      farm_id: farm.id,
      user_id: user.id,
      image_urls: imageUrls,
      status: 'Available'
    }).select('id').single();

    if (insertError) throw insertError;

    const newMorphLinks = morphs.map(morphId => ({ product_id: newProduct.id, morph_id: Number(morphId) }));
    const { error: morphsInsertError } = await supabase.from('product_morphs').insert(newMorphLinks);
    if (morphsInsertError) throw morphsInsertError;
    
  } catch (error: any) {
    // ✅ 5. ตรวจสอบให้แน่ใจว่าส่ง _form error กลับไปเสมอ
    return { errors: { _form: error.message }, fields: Object.fromEntries(formData.entries()) };
  }
  
  revalidatePath('/farm/products');
  redirect('/farm/products');
}

export async function updateProductAction(prevState: EditProductState, formData: FormData): Promise<EditProductState> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { errors: { _form: "Authentication required." } };

  const validatedFields = editProductSchema.safeParse({
    id: formData.get('id'),
    name: formData.get('name'),
    price: formData.get('price'),
    sex: formData.get('sex'),
    year: formData.get('year'),
    description: formData.get('description'),
    morphs: formData.getAll('morphs'),
    existingImageUrls: formData.get('existingImageUrls'),
  });

  if (!validatedFields.success) {
    return { errors: validatedFields.error.flatten().fieldErrors, fields: Object.fromEntries(formData.entries()) };
  }

  const { id, morphs, existingImageUrls, ...productData } = validatedFields.data;
  const newImageFiles = formData.getAll('newImages') as File[];

  try {
    const uploadedImageUrls: string[] = [];
    for (const imageFile of newImageFiles) {
      if (imageFile.size > 0) {
        const filePath = `${user.id}/${id}/${Date.now()}_${imageFile.name}`;
        const { error: uploadError } = await supabase.storage.from('product-images').upload(filePath, imageFile);
        if (uploadError) throw new Error(`Image upload failed: ${uploadError.message}`);
        const { data: { publicUrl } } = supabase.storage.from('product-images').getPublicUrl(filePath);
        uploadedImageUrls.push(publicUrl);
      }
    }
    
    const finalImageUrls = [...(existingImageUrls || []), ...uploadedImageUrls];
    
    const { error: productUpdateError } = await supabase
      .from('products')
      .update({ ...productData, image_urls: finalImageUrls })
      .eq('id', id);
    if (productUpdateError) throw productUpdateError;

    const { error: deleteError } = await supabase.from('product_morphs').delete().eq('product_id', id);
    if (deleteError) throw deleteError;

    const newMorphLinks = morphs.map(morphId => ({ product_id: id, morph_id: Number(morphId) }));
    const { error: insertError } = await supabase.from('product_morphs').insert(newMorphLinks);
    if (insertError) throw insertError;

  } catch (error: any) {
    return { errors: { _form: error.message }, fields: Object.fromEntries(formData.entries()) };
  }

  revalidatePath(`/farm/products/${id}`);
  redirect(`/farm/products/${id}`);
}