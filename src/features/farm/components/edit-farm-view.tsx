'use client';

import { useActionState, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { updateFarmAction } from '@/features/farm/farm.actions';
import type { EditFarmState, Farm } from '@/features/farm/farm.types';
import { ImagePicker } from '@/components/ui/ImagePicker';
import { useAppToast } from '@/hooks/useAppToast';
import { Button, SecondaryButton } from "@/components/ui/Button";

export function EditFarmView({ farm }: { farm: Farm }) {
  const router = useRouter();
  const { showSuccessToast, showErrorToast } = useAppToast();
  
  const initialState: EditFarmState = { errors: {}, fields: farm };
  const [state, formAction] = useActionState(updateFarmAction, initialState);
  
  // State for the character counter
  const [information, setInformation] = useState(farm.information || '');

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
        <h1 className="text-lg font-semibold mb-4 text-[#1F2937] dark:text-white">Edit Farm</h1>
      </div>
      <form action={formAction} className="space-y-8 rounded-lg bg-white p-8 dark:bg-gray-800" noValidate>
        <div>
          <label htmlFor="name" className="block text-sm font-semibold text-[#1F2937] dark:text-gray-300 mb-2">Farm Name*</label>
          <input type="text" id="name" name="name" className={inputClassName(!!state.errors.name)} defaultValue={state.fields?.name} />
          {state.errors.name && <p className="mt-1 text-sm text-red-600">{state.errors.name[0]}</p>}
        </div>

        <ImagePicker error={state.errors.logo?.[0]} initialPreview={farm.logo_url} />

        <div>
          <label htmlFor="breeder_name" className="block text-sm font-semibold text-[#1F2937] dark:text-gray-300 mb-2">Breeder&apos;s Name*</label>
          <input type="text" id="breeder_name" name="breeder_name" className={inputClassName(!!state.errors.breeder_name)} defaultValue={state.fields?.breeder_name ?? ''} />
          {state.errors.breeder_name && <p className="mt-1 text-sm text-red-600">{state.errors.breeder_name[0]}</p>}
        </div>

        <div>
          <div className="flex justify-between items-center mb-2">
            <label htmlFor="information" className="block text-sm font-semibold text-[#1F2937] dark:text-gray-300">Farm Information*</label>
            <span className="text-sm font-medium text-[#6B7280] dark:text-gray-400">
              {information.length} / 500
            </span>
          </div>
          <textarea
            id="information"
            name="information"
            rows={4}
            maxLength={500}
            className={inputClassName(!!state.errors.information)}
            placeholder="Put farm information here"
            value={information}
            onChange={(e) => setInformation(e.target.value)}
          />
          {state.errors.information && <p className="mt-1 text-sm text-red-600">{state.errors.information[0]}</p>}
        </div>

        <div className="space-y-2">
          <h3 className="text-sm font-semibold text-[#1F2937] dark:text-gray-300">Your Contact (Optional)</h3>
          
          <div className="flex items-center gap-2">
            <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-md bg-neutral-500 dark:bg-neutral-700">
              <Image src="/images/instagram-icon.png" alt="instagram" width={25} height={25} quality={100} />
            </div>
            <input type="text" name="contact_instagram" className={inputClassName(false)} placeholder="Put instagram id here" defaultValue={state.fields?.contact_instagram || ''} />
          </div>

          <div className="flex items-center gap-2">
            <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-md bg-neutral-500 dark:bg-neutral-700">
              <Image src="/images/facebook-icon.png" alt="facebook" width={14} height={26} quality={100} />
            </div>
            <input type="text" name="contact_facebook" className={inputClassName(false)} placeholder="Put facebook profile here" defaultValue={state.fields?.contact_facebook || ''} />
          </div>

          <div className="flex items-center gap-2">
            <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-md bg-neutral-500 dark:bg-neutral-700">
              <Image src="/images/line-icon.png" alt="line" width={25} height={25} quality={100} />
            </div>
            <input type="text" name="contact_line" className={inputClassName(false)} placeholder="Put line id here" defaultValue={state.fields?.contact_line || ''} />
          </div>

          <div className="flex items-center gap-2">
            <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-md bg-neutral-500 dark:bg-neutral-700">
              <Image src="/images/whatsapp-icon.png" alt="whatsapp" width={25} height={25} quality={100} />
            </div>
            <input type="text" name="contact_whatsapp" className={inputClassName(false)} placeholder="Put whatsapp number here" defaultValue={state.fields?.contact_whatsapp || ''} />
          </div>
          
          <div className="flex items-center gap-2">
            <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-md bg-neutral-500 dark:bg-neutral-700">
              <Image src="/images/wechat-icon.png" alt="wechat" width={25} height={25} quality={100} />
            </div>
            <input type="text" name="contact_wechat" className={inputClassName(false)} placeholder="Put wechat id here" defaultValue={state.fields?.contact_wechat || ''} />
          </div>
        </div>

        <div className="flex justify-center gap-4 pt-4">
          <SecondaryButton href="/farm" className="min-w-[145.5px]">Cancel</SecondaryButton>
          <Button className="min-w-[145.5px]">Save Changes</Button>
        </div>
      </form>
    </div>
  );
}
