// src/app/(FullPageLayout)/login/actions.ts
'use server';

import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server'; // 👈 ใช้ client ของ server

export interface LoginFormState {
  errors: {
    email?: string;
    password?: string;
    _form?: string; // สำหรับ error ทั่วไป
  };
}

export async function login(
  formState: LoginFormState,
  formData: FormData
): Promise<LoginFormState> {
  const supabase = await createClient();

  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  // --- Validation ---
  if (!email) {
    return { errors: { email: 'Email is required.' } };
  }
  if (!password) {
    return { errors: { password: 'Password is required.' } };
  }

  // --- Supabase Authentication ---
  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return {
      errors: {
        // เปลี่ยน error message ให้ user-friendly
        _form: 'Invalid email or password. Please try again.',
      },
    };
  }
  
  // --- Success ---
  redirect('/farm');
}