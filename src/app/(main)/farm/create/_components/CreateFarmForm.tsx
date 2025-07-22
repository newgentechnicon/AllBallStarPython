'use client';

import { useActionState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useFormStatus } from 'react-dom';
import { createFarm, type CreateFarmState } from '../actions';
import { ImagePicker } from '@/components/ui/ImagePicker';
import { useAppToast } from '@/hooks/useAppToast';

const SpinnerIcon = () => ( <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"> <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle> <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path> </svg> );

function AddButton() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending} className="inline-flex min-w-[145.5px] justify-center rounded-md border border-transparent bg-neutral-500 py-2 px-4 text-sm font-medium text-white hover:bg-neutral-700 focus:outline-none focus:ring-2 focus:ring-neutral-500 focus:ring-offset-2 disabled:opacity-50 dark:bg-neutral-500 dark:hover:bg-neutral-600">
      {pending ? <SpinnerIcon /> : 'Add'}
    </button>
  );
}

export function CreateFarmForm() {
  const router = useRouter();
  const { showSuccessToast } = useAppToast();
  const initialState: CreateFarmState = { errors: {}, fields: { farmName: '', breederName: '', farmInfo: '', instagram: '', facebook: '', line: '', whatsapp: '' } };
  const [state, formAction] = useActionState(createFarm, initialState);

  useEffect(() => {
    if (state.success && state.message) {
      showSuccessToast(state.message);
    }
  }, [state.success, state.message, showSuccessToast]);

  const inputClassName = (hasError: boolean) => `py-2.5 sm:py-3 px-4 block w-full rounded-lg sm:text-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-neutral-900 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600 ${hasError ? 'border-red-500' : 'border-gray-200 dark:border-neutral-700'}`;
  
  return (
    <form action={formAction} className="space-y-8 rounded-lg bg-white p-8 dark:bg-gray-800" noValidate>
      <div>
        <label htmlFor="farmName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Farm Name*</label>
        <input type="text" id="farmName" name="farmName" className={inputClassName(!!state.errors.farmName)} placeholder="Put farm name here" defaultValue={state.fields?.farmName} />
        {state.errors.farmName && <p className="mt-1 text-sm text-red-600">{state.errors.farmName[0]}</p>}
      </div>

      <ImagePicker error={state.errors.logo?.[0]} />

      <div>
        <label htmlFor="breederName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Breeder&apos;s Name*</label>
        <input type="text" id="breederName" name="breederName" className={inputClassName(!!state.errors.breederName)} placeholder="Put breeder's name here" defaultValue={state.fields?.breederName} />
        {state.errors.breederName && <p className="mt-1 text-sm text-red-600">{state.errors.breederName[0]}</p>}
      </div>

      <div>
        <label htmlFor="farmInfo" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Farm Information*</label>
        <textarea id="farmInfo" name="farmInfo" rows={4} className={inputClassName(!!state.errors.farmInfo)} placeholder="Put farm information here" defaultValue={state.fields?.farmInfo}></textarea>
        {state.errors.farmInfo && <p className="mt-1 text-sm text-red-600">{state.errors.farmInfo[0]}</p>}
      </div>

      <div className="space-y-4">
        <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">Your Contact</h3>
        <input type="text" name="instagram" className={inputClassName(false)} placeholder="Instagram ID" defaultValue={state.fields?.instagram} />
        <input type="text" name="facebook" className={inputClassName(false)} placeholder="Facebook Profile URL" defaultValue={state.fields?.facebook} />
        <input type="text" name="line" className={inputClassName(false)} placeholder="Line ID" defaultValue={state.fields?.line} />
        <input type="text" name="whatsapp" className={inputClassName(false)} placeholder="Whatsapp Number" defaultValue={state.fields?.whatsapp} />
      </div>

      {state.errors._form && <p className="text-sm text-red-500 text-center">{state.errors._form}</p>}

      <div className="flex justify-center gap-4 pt-4">
        <button type="button" onClick={() => router.back()} className="rounded-md min-w-[145.5px] border border-gray-300 bg-white py-2 px-4 text-sm font-medium text-gray-700 hover:bg-gray-50">Cancel</button>
        <AddButton />
      </div>
    </form>
  );
}