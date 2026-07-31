'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useActionState } from 'react';
import { requestPasswordResetAction } from '@/features/auth/auth.actions';
import type { ForgotPasswordState } from '@/features/auth/auth.types';
import { Button } from '@/components/ui/Button';

export function ForgotPasswordView() {
  const initialState: ForgotPasswordState = { errors: {} };
  const [state, formAction] = useActionState(requestPasswordResetAction, initialState);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-900 px-4">
      <div className="w-full max-w-md">
        <div className="rounded-2xl bg-white p-8 shadow-lg dark:bg-gray-800">
          <div className="mb-6 flex justify-center">
            <Image
              src="/images/logo-white.png"
              alt="Company Logo"
              width={48}
              height={48}
              quality={100}
              priority
            />
          </div>

          <h1 className="text-center text-2xl font-bold text-[#1f2937] dark:text-white">
            Forgot password
          </h1>
          <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-300">
            Enter your email and we will send you a link to reset your password.
          </p>

          {state.success ? (
            <div className="mt-8 space-y-6">
              <div className="rounded-lg bg-green-50 p-4 text-sm text-green-700" role="status">
                {state.message}
              </div>
              <Link
                href="/login"
                className="block text-center text-sm font-medium text-neutral-600 hover:text-neutral-800 dark:text-neutral-300 dark:hover:text-white"
              >
                Back to sign in
              </Link>
            </div>
          ) : (
            <form action={formAction} className="mt-8 space-y-6" noValidate>
              <div>
                <label htmlFor="email" className="sr-only">Email</label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  defaultValue={state.email}
                  className={`relative block w-full appearance-none rounded-lg border px-3 py-3 text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 ${
                    state.errors.email || state.errors._form
                      ? 'border-red-500'
                      : 'border-gray-300 dark:border-gray-600'
                  }`}
                  placeholder="Email"
                />
                {state.errors.email && (
                  <p className="mt-2 text-sm text-red-600">{state.errors.email[0]}</p>
                )}
              </div>

              {state.errors._form && (
                <div className="text-sm text-red-600" role="alert">
                  {state.errors._form}
                </div>
              )}

              <Button className="w-full">Send reset link</Button>

              <Link
                href="/login"
                className="block text-center text-sm font-medium text-neutral-600 hover:text-neutral-800 dark:text-neutral-300 dark:hover:text-white"
              >
                Back to sign in
              </Link>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
