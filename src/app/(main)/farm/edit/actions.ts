'use server';

import { z } from 'zod';
import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import type { Farm } from '@/lib/data/farm';

const MAX_FILE_SIZE = 5 * 1024 * 1024;
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

const editFarmSchema = z.object({
  name: z.string().min(1, 'Farm name is required.'),
  breeder_name: z.string().min(1, "Breeder's name is required."),
  information: z.string().min(1, 'Farm information is required.'),
  logo: z
    .any()
    .optional()
    .refine((file) => !file || file.size === 0 || file.size <= MAX_FILE_SIZE, `Max file size is 5MB.`)
    .refine(
      (file) => !file || file.size === 0 || ACCEPTED_IMAGE_TYPES.includes(file.type),
      '.jpg, .jpeg, .png and .webp files are accepted.'
    ),
  contact_instagram: z.string().optional(),
  contact_facebook: z.string().optional(),
  contact_line: z.string().optional(),
  contact_whatsapp: z.string().optional(),
});

export interface EditFarmState {
  success?: boolean;
  message?: string;
  errors: {
    name?: string[];
    breeder_name?: string[];
    information?: string[];
    logo?: string[];
    _form?: string; 
  };
  fields?: Partial<Farm>;
}

export async function updateFarm(
  prevState: EditFarmState,
  formData: FormData
): Promise<EditFarmState> {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return { errors: { _form: "Authentication required." } };
  }

  const validatedFields = editFarmSchema.safeParse(Object.fromEntries(formData.entries()));

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      fields: Object.fromEntries(formData.entries()) as Partial<Farm>,
    };
  }
  
  const { logo, ...farmData } = validatedFields.data;
  
  try {
    const { data: currentFarm } = await supabase.from('farms').select('logo_url').eq('user_id', user.id).single();
    if (!currentFarm) {
      return { errors: { _form: "Farm not found." } };
    }

    let logoUrlToUpdate = currentFarm.logo_url;

    if (logo && logo.size > 0) {
      const filePath = `${user.id}/${Date.now()}_${logo.name}`;
      const { error: uploadError } = await supabase.storage.from('farm-logos').upload(filePath, logo, { upsert: true });
      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage.from('farm-logos').getPublicUrl(filePath);
      if (!publicUrl) throw new Error('Could not get public URL for the new logo.');
      logoUrlToUpdate = publicUrl;
    }

    const { error: updateError } = await supabase
      .from('farms')
      .update({ ...farmData, logo_url: logoUrlToUpdate })
      .eq('user_id', user.id);

    if (updateError) throw updateError;

  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'An unexpected error occurred.';
    return { errors: { _form: message } };
  }

  revalidatePath('/farm');
  return { success: true, message: 'Update farm successfully', errors: {} };
}