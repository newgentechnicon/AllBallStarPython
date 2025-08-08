'use client';

import { useTransition } from 'react';
import { updateProductStatus } from '@/features/product/product.actions';
import { useAppToast } from '@/hooks/useAppToast';

const statusOptions = ['Available', 'On Hold', 'Sold Out', 'Inactive'];
const productStatustyles: { [key: string]: string } = {
  Available: 'bg-emerald-500 text-white',
  'On Hold': 'bg-amber-500 text-white',
  'Sold Out': 'bg-neutral-600 text-white',
  Inactive: 'bg-neutral-400 text-white',
};

interface StatusDropdownProps {
  productId: number;
  currentStatus: string;
}

export function StatusDropdown({ productId, currentStatus }: StatusDropdownProps) {
  const [isPending, startTransition] = useTransition();
  const { showSuccessToast, showErrorToast } = useAppToast();

  const handleStatusChange = (newStatus: string) => {
    startTransition(async () => {
      const result = await updateProductStatus(productId, newStatus);
      if (result.success) {
        showSuccessToast(result.message || 'Status updated!');
      } else {
        showErrorToast(result.error || 'Failed to update status.');
      }
    });
  };

  const colorClass = productStatustyles[currentStatus] || productStatustyles['Inactive'];

  return (
    <div className="hs-dropdown relative inline-flex">
      <button
        id={`hs-dropdown-${productId}`}
        type="button"
        className={`hs-dropdown-toggle inline-flex items-center gap-x-2 text-xs rounded-full px-2.5 py-1 ${colorClass}`}
        disabled={isPending}
      >
        {currentStatus}
        <svg className="hs-dropdown-open:rotate-180 size-4 transition-transform" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 9l6 6 6-6" />
        </svg>
      </button>

      <div className="hs-dropdown-menu transition-[opacity,margin] duration hs-dropdown-open:opacity-100 opacity-0 hidden min-w-[120px] bg-white shadow-md rounded-lg p-1 mt-2 z-10">
        {statusOptions.map((option) => (
          <button
            key={option}
            type="button"
            disabled={isPending}
            onClick={() => handleStatusChange(option)}
            className="flex w-full items-center gap-x-3.5 py-2 px-3 rounded-lg text-sm text-gray-800 hover:bg-gray-100"
          >
            {option}
          </button>
        ))}
      </div>
    </div>
  );
};