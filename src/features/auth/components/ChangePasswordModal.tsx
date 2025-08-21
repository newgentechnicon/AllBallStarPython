'use client';

import { useActionState, useEffect, useRef } from 'react';
import { updatePasswordAction } from '@/features/auth/auth.actions';
import type { ChangePasswordState } from '@/features/auth/auth.types';
import { Button } from '@/components/ui/Button';
import { PasswordInput } from '@/components/ui/PasswordInput';
import { useAppToast } from '@/hooks/useAppToast';

// SVG Icon
const CloseIcon = () => ( <svg className="shrink-0 size-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"></path><path d="m6 6 12 12"></path></svg> );

export function ChangePasswordModal() {
    const initialState: ChangePasswordState = { errors: {} };
    const [state, formAction] = useActionState(updatePasswordAction, initialState);
    const { showSuccessToast, showErrorToast } = useAppToast();
    const formRef = useRef<HTMLFormElement>(null);

    useEffect(() => {
        if (state.success && state.message) {
            showSuccessToast(state.message);
            formRef.current?.reset(); // Reset form fields
            if (window.HSOverlay) {
                window.HSOverlay.close('#change-password-modal');
            }
        }
        if (!state.success && state.errors._form) {
            showErrorToast(state.errors._form);
        }
    }, [state, showSuccessToast, showErrorToast]);

    return (
        <div id="change-password-modal" className="hs-overlay hidden size-full fixed top-0 start-0 z-[80] overflow-x-hidden overflow-y-auto">
            <div className="hs-overlay-backdrop bg-gray-900/70 fixed inset-0 z-[-1]"></div>
            <div className="hs-overlay-open:mt-7 hs-overlay-open:opacity-100 hs-overlay-open:duration-500 mt-0 opacity-0 ease-out transition-all sm:max-w-lg sm:w-full m-3 sm:mx-auto">
                <div className="bg-white border border-gray-200 rounded-xl shadow-sm dark:bg-neutral-800 dark:border-neutral-700">
                    <div className="flex justify-between items-center py-3 px-4 border-b dark:border-neutral-700">
                        <h3 className="font-bold text-gray-800 dark:text-white">
                            Change Password
                        </h3>
                        <button type="button" className="size-8 inline-flex justify-center items-center gap-x-2 rounded-full border border-transparent bg-gray-100 text-gray-800 hover:bg-gray-200" aria-label="Close" data-hs-overlay="#change-password-modal">
                            <span className="sr-only">Close</span>
                            <CloseIcon />
                        </button>
                    </div>
                    <form ref={formRef} action={formAction}>
                        <div className="p-4 sm:p-7 space-y-4">
                            <div>
                                <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">New Password</label>
                                <PasswordInput
                                    id="newPassword"
                                    name="newPassword"
                                    required
                                    placeholder="Enter new password"
                                    hasError={!!state.errors.newPassword}
                                />
                                {state.errors.newPassword && <p className="mt-1 text-sm text-red-600">{state.errors.newPassword[0]}</p>}
                            </div>
                            <div>
                                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Confirm New Password</label>
                                <PasswordInput
                                    id="confirmPassword"
                                    name="confirmPassword"
                                    required
                                    placeholder="Confirm new password"
                                    hasError={!!state.errors.confirmPassword}
                                />
                                {state.errors.confirmPassword && <p className="mt-1 text-sm text-red-600">{state.errors.confirmPassword[0]}</p>}
                            </div>
                            {state.errors._form && <p className="text-sm text-red-600 text-center">{state.errors._form}</p>}
                        </div>
                        <div className="flex justify-center items-center gap-x-2 py-3 px-4 border-t dark:border-neutral-700">
                            <Button type="button" variant="secondary" className="!py-2 !px-3" data-hs-overlay="#change-password-modal">
                                Cancel
                            </Button>
                            <Button type="submit" variant="primary" className="!py-2 !px-3">
                                Save Changes
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
