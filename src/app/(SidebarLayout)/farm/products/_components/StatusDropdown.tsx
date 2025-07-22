'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import Toastify from 'toastify-js';
import "toastify-js/src/toastify.css";

const statusOptions = ['Available', 'On Hold', 'Sold Out', 'Inactive'];

const statusStyles: { [key: string]: string } = {
  Available: 'bg-green-100 text-green-800',
  'On Hold': 'bg-yellow-100 text-yellow-800',
  'Sold Out': 'bg-gray-600 text-white',
  Inactive: 'bg-gray-200 text-gray-800',
};

interface StatusDropdownProps {
  productId: number;
  currentStatus: string | null;
  onStatusUpdated?: () => void; // ✅ ประกาศที่นี่
}

export const StatusDropdown = ({
  productId,
  currentStatus,
  onStatusUpdated, // ✅ รับ prop
}: StatusDropdownProps) => {
  const router = useRouter();
  const [status, setStatus] = useState(currentStatus || 'Inactive');
  const [loading, setLoading] = useState(false);

  const handleStatusChange = async (newStatus: string) => {
    setStatus(newStatus);
    setLoading(true);

    const supabase = createClient();
    const { error } = await supabase
      .from('products')
      .update({ status: newStatus })
      .eq('id', productId);

    if (error) {
      console.error('Failed to update status:', error.message);
      Toastify({
        text: "Failed to update status.",
        duration: 3000,
        close: true,
        gravity: "top",
        position: "right",
        style: {
          background: "#EF4444",
          borderRadius: "8px",
        },
      }).showToast();
    } else {
      Toastify({
        text: "Status updated successfully",
        duration: 3000,
        close: true,
        gravity: "top",
        position: "right",
        style: {
          background: "#14B8A6",
          borderRadius: "8px",
        },
      }).showToast();

      onStatusUpdated?.(); // ✅ เรียกเมื่ออัปเดตสำเร็จ
      router.refresh();
    }

    setLoading(false);
  };

  const colorClass = statusStyles[status] || statusStyles['Inactive'];

  return (
    <div className="hs-dropdown relative inline-flex">
      <button
        id={`hs-dropdown-${productId}`}
        type="button"
        className={`hs-dropdown-toggle inline-flex items-center gap-x-2 text-xs font-semibold rounded-full px-2.5 py-1 border border-gray-200 shadow-sm bg-white hover:bg-gray-50 focus:outline-none ${colorClass}`}
        aria-haspopup="true"
        aria-expanded="false"
        aria-label="Dropdown"
        disabled={loading}
      >
        {status}
        <svg
          className="hs-dropdown-open:rotate-180 size-4 transition-transform"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 9l6 6 6-6" />
        </svg>
      </button>

      <div
        className="hs-dropdown-menu transition-[opacity,margin] duration hs-dropdown-open:opacity-100 opacity-0 hidden min-w-[120px] bg-white shadow-md rounded-lg mt-2 dark:bg-neutral-800 dark:border dark:border-neutral-700 dark:divide-neutral-700 after:h-4 after:absolute after:-bottom-4 after:start-0 after:w-[120px] before:h-4 before:absolute before:-top-4 before:start-0 before:w-[120px] z-50"
        role="menu"
        aria-orientation="vertical"
        aria-labelledby={`hs-dropdown-${productId}`}
        data-hs-dropdown-strategy="static"
        data-hs-dropdown-offset="0"
      >
        <div className="p-1 space-y-0.5">
          {statusOptions.map((option) => (
            <button
              key={option}
              type="button"
              disabled={loading}
              onClick={() => handleStatusChange(option)}
              className="flex w-full items-center gap-x-3.5 py-2 px-3 rounded-lg text-sm text-gray-800 hover:bg-gray-100 focus:outline-hidden focus:bg-gray-100 dark:text-neutral-400 dark:hover:bg-neutral-700 dark:hover:text-neutral-300 dark:focus:bg-neutral-700"
            >
              {option}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};