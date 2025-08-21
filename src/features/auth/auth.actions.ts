'use server';

import { z } from 'zod';
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import type { LoginFormState, ChangePasswordState } from './auth.types';
import { revalidatePath } from 'next/cache'

const passwordSchema = z.object({
  newPassword: z.string().min(6, 'Password must be at least 6 characters.'),
  confirmPassword: z.string(),
}).refine(data => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'], // ระบุ field ที่จะให้แสดง error
});

export async function login(
  formState: LoginFormState,
  formData: FormData
): Promise<LoginFormState> {
  const supabase = await createClient();

  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  if (!email) {
    return { errors: { email: 'Email is required.' } };
  }
  if (!password) {
    return { errors: { password: 'Password is required.' } };
  }

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return {
      errors: { _form: 'Invalid email or password. Please try again.' },
    };
  }
  
  revalidatePath('/', 'layout')
  redirect('/farm')
}

export async function updatePasswordAction(
  prevState: ChangePasswordState,
  formData: FormData
): Promise<ChangePasswordState> {
  const validatedFields = passwordSchema.safeParse(Object.fromEntries(formData.entries()));

  if (!validatedFields.success) {
    return { errors: validatedFields.error.flatten().fieldErrors };
  }

  const { newPassword } = validatedFields.data;
  const supabase = await createClient();

  const { error } = await supabase.auth.updateUser({ password: newPassword });

  if (error) {
    return { errors: { _form: error.message } };
  }

  await supabase.auth.signOut();
  redirect('/login?status=password_updated');
}