'use server';

import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import type { LoginFormState } from './auth.types'
import { revalidatePath } from 'next/cache'

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
  
  // สำเร็จแล้ว redirect ไปหน้า farm
  revalidatePath('/', 'layout')
  redirect('/farm')
}