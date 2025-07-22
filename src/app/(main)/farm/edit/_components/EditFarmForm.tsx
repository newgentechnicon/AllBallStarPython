'use client';

import { useActionState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useFormStatus } from 'react-dom';
import { updateFarm, type EditFarmState } from '../actions';
import { ImagePicker } from '@/components/ui/ImagePicker';
import type { Farm } from '@/lib/data/farm';
import { useAppToast } from '@/hooks/useAppToast';

const SpinnerIcon = () => ( <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"> <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle> <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path> </svg> );

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending} className="inline-flex min-w-[145.5px] justify-center rounded-md border border-transparent bg-neutral-500 py-2 px-4 text-sm font-medium text-white hover:bg-neutral-700 disabled:opacity-50">
      {pending ? <SpinnerIcon /> : 'Save Changes'}
    </button>
  );
}

export function EditFarmForm({ farm }: { farm: Farm }) {
  const router = useRouter();
  const { showSuccessToast } = useAppToast();
  
  const initialState: EditFarmState = { errors: {}, fields: farm };
  const [state, formAction] = useActionState(updateFarm, initialState);

  useEffect(() => {
    if (state.success && state.message) {
      showSuccessToast(state.message);
    }
  }, [state.success, state.message, showSuccessToast]);

  const inputClassName = (hasError: boolean) => `py-2.5 sm:py-3 px-4 block w-full rounded-lg sm:text-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-neutral-900 ${hasError ? 'border-red-500' : 'border-gray-200 dark:border-neutral-700'}`;
  
  return (
    <form action={formAction} className="space-y-8 rounded-lg bg-white p-8" noValidate>
      <div>
        <label htmlFor="name" className="block text-sm font-medium mb-2">Farm Name*</label>
        <input type="text" id="name" name="name" className={inputClassName(!!state.errors.name)} defaultValue={state.fields?.name} />
        {state.errors.name && <p className="mt-1 text-sm text-red-600">{state.errors.name[0]}</p>}
      </div>

      <ImagePicker error={state.errors.logo?.[0]} initialPreview={farm.logo_url} />

      <div>
        <label htmlFor="breeder_name" className="block text-sm font-medium mb-2">Breeder&apos;s Name*</label>
        <input type="text" id="breeder_name" name="breeder_name" className={inputClassName(!!state.errors.breeder_name)} defaultValue={state.fields?.breeder_name} />
        {state.errors.breeder_name && <p className="mt-1 text-sm text-red-600">{state.errors.breeder_name[0]}</p>}
      </div>

      <div>
        <label htmlFor="information" className="block text-sm font-medium mb-2">Farm Information*</label>
        <textarea id="information" name="information" rows={4} className={inputClassName(!!state.errors.information)} defaultValue={state.fields?.information || ''}></textarea>
        {state.errors.information && <p className="mt-1 text-sm text-red-600">{state.errors.information[0]}</p>}
      </div>

      <div className="space-y-4">
        <h3 className="text-sm font-medium">Your Contact</h3>
        <input type="text" name="contact_instagram" className={inputClassName(false)} placeholder="Instagram ID" defaultValue={state.fields?.contact_instagram || ''} />
        <input type="text" name="contact_facebook" className={inputClassName(false)} placeholder="Facebook Profile URL" defaultValue={state.fields?.contact_facebook || ''} />
        <input type="text" name="contact_line" className={inputClassName(false)} placeholder="Line ID" defaultValue={state.fields?.contact_line || ''} />
        <input type="text" name="contact_whatsapp" className={inputClassName(false)} placeholder="Whatsapp Number" defaultValue={state.fields?.contact_whatsapp || ''} />
      </div>

      {state.errors._form && <p className="text-sm text-red-500 text-center">{state.errors._form}</p>}

      <div className="flex justify-center gap-4 pt-4">
        <button type="button" onClick={() => router.back()} className="rounded-md min-w-[145.5px] border bg-white py-2 px-4 text-sm font-medium hover:bg-gray-50">Cancel</button>
        <SubmitButton />
      </div>
    </form>
  );
}