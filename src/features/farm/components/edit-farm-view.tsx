'use client';

import { useActionState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { updateFarmAction } from '@/features/farm/farm.actions';
import type { EditFarmState, Farm } from '@/features/farm/farm.types';
import { ImagePicker } from '@/components/ui/ImagePicker';
import { useAppToast } from '@/hooks/useAppToast';
import { SubmitButton } from '@/components/ui/SubmitButton';

export function EditFarmView({ farm }: { farm: Farm }) {
  const router = useRouter();
  const { showSuccessToast, showErrorToast } = useAppToast();
  
  const initialState: EditFarmState = { errors: {}, fields: farm };
  const [state, formAction] = useActionState(updateFarmAction, initialState);

  useEffect(() => {
    if (state.success && state.message) {
      showSuccessToast(state.message);

      const timer = setTimeout(() => {
        router.push('/farm');
      }, 1000);

      return () => clearTimeout(timer);
    }
    if (!state.success && state.errors._form) {
        showErrorToast(state.errors._form);
    }
  }, [state, router, showSuccessToast, showErrorToast]);

  const inputClassName = (hasError: boolean) => 
    `py-2.5 sm:py-3 px-4 block w-full rounded-lg sm:text-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-neutral-900 ${
      hasError ? 'border-red-500' : 'border-gray-200 dark:border-neutral-700'
    }`;
  
  return (
    <div className="container mx-auto max-w-2xl py-4 bg-white dark:bg-gray-900">
      <div className="px-4 sm:px-8 border-b border-gray-300 dark:border-gray-700">
        <h1 className="text-2xl font-bold mb-4 text-[#1F2937] dark:text-white">Edit Farm</h1>
      </div>
      <form action={formAction} className="space-y-8 rounded-lg bg-white p-8 dark:bg-gray-800" noValidate>
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Farm Name*</label>
          <input type="text" id="name" name="name" className={inputClassName(!!state.errors.name)} defaultValue={state.fields?.name} />
          {state.errors.name && <p className="mt-1 text-sm text-red-600">{state.errors.name[0]}</p>}
        </div>

        <ImagePicker error={state.errors.logo?.[0]} initialPreview={farm.logo_url} />

        <div>
          <label htmlFor="breeder_name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Breeder&apos;s Name*</label>
          <input type="text" id="breeder_name" name="breeder_name" className={inputClassName(!!state.errors.breeder_name)} defaultValue={state.fields?.breeder_name ?? ''} />
          {state.errors.breeder_name && <p className="mt-1 text-sm text-red-600">{state.errors.breeder_name[0]}</p>}
        </div>

        <div>
          <label htmlFor="information" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Farm Information*</label>
          <textarea id="information" name="information" rows={4} className={inputClassName(!!state.errors.information)} defaultValue={state.fields?.information || ''}></textarea>
          {state.errors.information && <p className="mt-1 text-sm text-red-600">{state.errors.information[0]}</p>}
        </div>

        <div className="space-y-4">
          <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">Your Contact (Optional)</h3>
          <input type="text" name="contact_instagram" className={inputClassName(false)} placeholder="Instagram ID" defaultValue={state.fields?.contact_instagram || ''} />
          <input type="text" name="contact_facebook" className={inputClassName(false)} placeholder="Facebook Profile URL" defaultValue={state.fields?.contact_facebook || ''} />
          <input type="text" name="contact_line" className={inputClassName(false)} placeholder="Line ID" defaultValue={state.fields?.contact_line || ''} />
          <input type="text" name="contact_whatsapp" className={inputClassName(false)} placeholder="Whatsapp Number" defaultValue={state.fields?.contact_whatsapp || ''} />
        </div>

        <div className="flex justify-center gap-4 pt-4">
          <button type="button" onClick={() => router.back()} className="rounded-md min-w-[145.5px] border border-gray-300 bg-white py-2 px-4 text-sm font-medium text-gray-700 hover:bg-gray-50">Cancel</button>
          <SubmitButton>Save Changes</SubmitButton>
        </div>
      </form>
    </div>
  );
}