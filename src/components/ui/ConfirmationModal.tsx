'use client';

import type { ReactNode } from 'react';

interface ConfirmationModalProps {
  id: string;
  title: string;
  children: ReactNode;
  onConfirm: () => void;
  confirmText?: string;
  confirmButtonClass?: string;
  isPending?: boolean;
}

export function ConfirmationModal({
  id,
  title,
  children,
  onConfirm,
  confirmText = 'Confirm',
  confirmButtonClass = 'bg-blue-600 hover:bg-blue-700',
  isPending = false,
}: ConfirmationModalProps) {
  return (
    <div id={id} className="hs-overlay hidden size-full fixed top-0 start-0 z-[80] overflow-x-hidden overflow-y-auto">
      <div className="hs-overlay-open:mt-7 hs-overlay-open:opacity-100 hs-overlay-open:duration-500 mt-0 opacity-0 ease-out transition-all sm:max-w-lg sm:w-full m-3 sm:mx-auto">
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm">
          <div className="p-4 sm:p-7">
            <div className="text-center">
              <h2 className="block text-xl font-bold text-gray-800">{title}</h2>
              <div className="mt-4">{children}</div>
            </div>
            <div className="mt-8 grid grid-cols-2 gap-x-4">
              <button
                type="button"
                className="py-2.5 px-4 inline-flex justify-center items-center gap-x-2 text-sm font-medium rounded-lg border border-gray-200 bg-white text-gray-800 shadow-sm hover:bg-gray-50"
                data-hs-overlay={`#${id}`}
              >
                Cancel
              </button>
              <button
                type="button"
                className={`py-2.5 px-4 inline-flex justify-center items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent text-white disabled:opacity-50 ${confirmButtonClass}`}
                onClick={onConfirm}
                disabled={isPending}
              >
                {isPending ? (
                  <>
                    <span className="animate-spin inline-block size-4 border-[3px] border-current border-t-transparent text-white rounded-full" role="status" aria-label="loading"></span>
                    Processing...
                  </>
                ) : (
                  confirmText
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}