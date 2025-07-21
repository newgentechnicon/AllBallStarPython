// src/app/(FullPageLayout)/login/_components/LoginForm.tsx
'use client';

import { useActionState } from 'react';
import { login, type LoginFormState } from '@/app/(FullPageLayout)/login/actions';
import { SubmitButton } from '@/components/ui/SubmitButton';
import { PasswordInput } from '@/components/ui/PasswordInput'; // 👈 1. Import Component ใหม่

export function LoginForm() {
  const initialState: LoginFormState = { errors: {} };
  const [formState, formAction] = useActionState(login, initialState);

  const inputClassName = (hasError: boolean) =>
    `relative block w-full appearance-none rounded-lg border px-3 py-3 text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 ${
      hasError ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
    }`;

  return (
    <form action={formAction} className="mt-8 space-y-6" noValidate>
      <div className="space-y-4">
        {/* Email Input */}
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

        {/* 👈 2. เปลี่ยนมาใช้ PasswordInput Component */}
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
      
      {/* General Form Error */}
      {formState.errors._form && (
        <div className="mt-2 text-sm text-red-600" role="alert">
          {formState.errors._form}
        </div>
      )}

      <div className="pt-2">
        <SubmitButton>Sign in</SubmitButton>
      </div>
    </form>
  );
}