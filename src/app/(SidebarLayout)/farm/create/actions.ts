'use server';

import { z } from 'zod';
import { createClient } from '@/lib/supabase/server';

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

const farmSchema = z.object({
  farmName: z.string().min(1, 'Farm name is required.'),
  breederName: z.string().min(1, "Breeder's name is required."),
  farmInfo: z.string().min(1, 'Farm information is required.'),
  logo: z
    .any()
    .refine((file) => file && file.size > 0, 'Farm logo is required.') 
    .refine((file) => file && file.size <= MAX_FILE_SIZE, `Max file size is 5MB.`)
    .refine(
      (file) => file && ACCEPTED_IMAGE_TYPES.includes(file.type),
      '.jpg, .jpeg, .png and .webp files are accepted.'
    ),
  instagram: z.string().optional(),
  facebook: z.string().optional(),
  line: z.string().optional(),
  whatsapp: z.string().optional(),
});

export interface CreateFarmState {
  success?: boolean;
  errors: {
    farmName?: string[];
    breederName?: string[];
    farmInfo?: string[];
    logo?: string[];
    _form?: string; 
  };
  message?: string;
  fields?: {
    farmName: string;
    breederName: string;
    farmInfo: string;
    instagram: string;
    facebook: string;
    line: string;
    whatsapp: string;
  };
}

export async function createFarm(
  prevState: CreateFarmState,
  formData: FormData
): Promise<CreateFarmState> {
  const supabase = await createClient();
  
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return { errors: { _form: "You must be logged in." } };
  }

  const validatedFields = farmSchema.safeParse({
    farmName: formData.get('farmName'),
    breederName: formData.get('breederName'),
    farmInfo: formData.get('farmInfo'),
    logo: formData.get('logo'),
    instagram: formData.get('instagram'),
    facebook: formData.get('facebook'),
    line: formData.get('line'),
    whatsapp: formData.get('whatsapp'),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      fields: {
        farmName: formData.get('farmName')?.toString() || '',
        breederName: formData.get('breederName')?.toString() || '',
        farmInfo: formData.get('farmInfo')?.toString() || '',
        instagram: formData.get('instagram')?.toString() || '',
        facebook: formData.get('facebook')?.toString() || '',
        line: formData.get('line')?.toString() || '',
        whatsapp: formData.get('whatsapp')?.toString() || '',
      }
    };
  }
  
  const { logo, farmName, breederName, farmInfo, ...contacts } = validatedFields.data;

  try {
    const { data: existingFarm } = await supabase.from('farms').select('id').eq('user_id', user.id).maybeSingle();
    if (existingFarm) {
        return { errors: { _form: "You can only create one farm per account." } };
    }

    const filePath = `${user.id}/${Date.now()}_${logo.name}`;
    const { error: uploadError } = await supabase.storage.from('farm-logos').upload(filePath, logo);
    if (uploadError) throw uploadError;

    const { data: { publicUrl } } = supabase.storage.from('farm-logos').getPublicUrl(filePath);
    if (!publicUrl) throw new Error('Could not get public URL for the logo.');

    const { error: insertError } = await supabase.from('farms').insert({
      user_id: user.id,
      name: farmName,
      breeder_name: breederName,
      information: farmInfo,
      logo_url: publicUrl,
      contact_instagram: contacts.instagram || null,
      contact_facebook: contacts.facebook || null,
      contact_line: contacts.line || null,
      contact_whatsapp: contacts.whatsapp || null,
    });
    if (insertError) throw insertError;

  } catch (error: unknown) {
    if (error instanceof Error) {
      return { errors: { _form: error.message } };
    }
    return { errors: { _form: 'An unexpected error occurred.' } };
  }

  return { success: true, message: 'Add farm successfully', errors: {} };
}