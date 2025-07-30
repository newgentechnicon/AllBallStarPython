'use client';

import Image from 'next/image';
import { useActionState } from 'react';
import { login } from '@/features/auth/auth.actions';
import type { LoginFormState } from '@/features/auth/auth.types';
import { Button } from "@/components/ui/Button";
import { PasswordInput } from '@/components/ui/PasswordInput';

export function LoginView() {
  const initialState: LoginFormState = { errors: {} };
  const [formState, formAction] = useActionState(login, initialState);

  const inputClassName = (hasError: boolean) =>
    `relative block w-full appearance-none rounded-lg border px-3 py-3 text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 ${
      hasError ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
    }`;

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-900 px-4">
      <div className="w-full max-w-md space-y-8">
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

          <h2 className="text-center text-2xl font-bold tracking-tight text-[#1f2937] dark:text-white">
            Sign in
          </h2>

          <form action={formAction} className="mt-8 space-y-6" noValidate>
            <div className="space-y-4">
              <div>
                <label htmlFor="email" className="sr-only">Email</label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className={inputClassName(!!formState.errors.email || !!formState.errors._form)}
                  placeholder="Email"
                />
                {formState.errors.email && (
                  <p className="mt-2 text-sm text-red-600">{formState.errors.email}</p>
                )}
              </div>

              <div>
                <label htmlFor="password" className="sr-only">Password</label>
                <PasswordInput
                  id="password"
                  name="password"
                  autoComplete="current-password"
                  required
                  placeholder="Password"
                  hasError={!!formState.errors.password || !!formState.errors._form}
                />
                {formState.errors.password && (
                  <p className="mt-2 text-sm text-red-600">{formState.errors.password}</p>
                )}
              </div>
            </div>
            
            {formState.errors._form && (
              <div className="mt-2 text-sm text-red-600" role="alert">
                {formState.errors._form}
              </div>
            )}

            <div className="pt-2">
              <Button>Sign in</Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}