'use server';

import { z } from 'zod';
import { redirect } from 'next/navigation'
import { headers } from 'next/headers'
import { createClient } from '@/lib/supabase/server'
import type { LoginFormState, ChangePasswordState, ForgotPasswordState } from './auth.types';
import { revalidatePath } from 'next/cache'

const passwordSchema = z.object({
  newPassword: z.string().min(6, 'Password must be at least 6 characters.'),
  confirmPassword: z.string(),
}).refine(data => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'], // ระบุ field ที่จะให้แสดง error
});

const forgotPasswordSchema = z.object({
  email: z.email('Please enter a valid email address.'),
});

export async function login(
  formState: LoginFormState,
  formData: FormData
): Promise<LoginFormState> {
  const supabase = await createClient();

  const email = formData.get('email') as string;
  const password = formData.get('password') as string;
  const next = formData.get('next') as string | null;

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
  redirect(next?.startsWith('/') && !next.startsWith('//') ? next : '/farm')
}

export async function requestPasswordResetAction(
  prevState: ForgotPasswordState,
  formData: FormData
): Promise<ForgotPasswordState> {
  const validatedFields = forgotPasswordSchema.safeParse({
    email: formData.get('email'),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      email: String(formData.get('email') ?? ''),
    };
  }

  const requestHeaders = await headers();
  const origin = requestHeaders.get('origin');

  if (!origin) {
    return {
      errors: { _form: 'Unable to create a password reset link. Please try again.' },
      email: validatedFields.data.email,
    };
  }

  const callbackUrl = new URL('/auth/callback', origin);
  callbackUrl.searchParams.set('next', '/reset-password');

  const supabase = await createClient();
  const { error } = await supabase.auth.resetPasswordForEmail(
    validatedFields.data.email,
    { redirectTo: callbackUrl.toString() }
  );

  if (error) {
    return {
      errors: { _form: 'Unable to send the password reset email. Please try again later.' },
      email: validatedFields.data.email,
    };
  }

  return {
    errors: {},
    success: true,
    message: 'If an account exists for this email, a password reset link has been sent.',
  };
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
