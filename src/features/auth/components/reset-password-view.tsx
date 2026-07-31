'use client';

import Image from 'next/image';
import { useActionState } from 'react';
import { updatePasswordAction } from '@/features/auth/auth.actions';
import type { ChangePasswordState } from '@/features/auth/auth.types';
import { Button } from '@/components/ui/Button';
import { PasswordInput } from '@/components/ui/PasswordInput';

export function ResetPasswordView() {
  const initialState: ChangePasswordState = { errors: {} };
  const [state, formAction] = useActionState(updatePasswordAction, initialState);

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
            Set new password
          </h1>
          <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-300">
            Choose a new password for your account.
          </p>

          <form action={formAction} className="mt-8 space-y-6" noValidate>
            <div className="space-y-4">
              <div>
                <label htmlFor="newPassword" className="sr-only">New password</label>
                <PasswordInput
                  id="newPassword"
                  name="newPassword"
                  autoComplete="new-password"
                  required
                  placeholder="New password"
                  hasError={!!state.errors.newPassword || !!state.errors._form}
                />
                {state.errors.newPassword && (
                  <p className="mt-2 text-sm text-red-600">{state.errors.newPassword[0]}</p>
                )}
              </div>

              <div>
                <label htmlFor="confirmPassword" className="sr-only">Confirm new password</label>
                <PasswordInput
                  id="confirmPassword"
                  name="confirmPassword"
                  autoComplete="new-password"
                  required
                  placeholder="Confirm new password"
                  hasError={!!state.errors.confirmPassword || !!state.errors._form}
                />
                {state.errors.confirmPassword && (
                  <p className="mt-2 text-sm text-red-600">{state.errors.confirmPassword[0]}</p>
                )}
              </div>
            </div>

            {state.errors._form && (
              <div className="text-sm text-red-600" role="alert">
                {state.errors._form}
              </div>
            )}

            <Button className="w-full">Update password</Button>
          </form>
        </div>
      </div>
    </div>
  );
}
