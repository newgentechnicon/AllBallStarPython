'use client';

import Toastify from 'toastify-js';
import "toastify-js/src/toastify.css";

type ToastifyInstance = ReturnType<typeof Toastify>;

/**
 * Creates a toast notification node using Preline UI classes.
 * @param message The message to display.
 * @param type The type of toast ('success' or 'error').
 * @param toast The Toastify instance to control the node.
 * @returns The generated HTMLDivElement for the toast.
 */
const createToastNode = (message: string, type: 'success' | 'error', toast: ToastifyInstance) => {
    const toastNode = document.createElement('div');
    
    const iconSrc = type === 'success' ? '/images/check-icon.png' : '/images/farm-7.svg';

    // ✅ ใช้ Markup และคลาสจาก Preline UI
    toastNode.className = "max-w-xs bg-teal-500 rounded-xl shadow-lg dark:bg-neutral-800 dark:border-neutral-700";
    toastNode.setAttribute('role', 'alert');

    toastNode.innerHTML = `
      <div class="flex p-4">
        <div class="flex items-center mr-3">
          <img src="${iconSrc}" class="h-5 w-5 mr-3" alt="Toast Icon" />
          <p class="text-sm text-white dark:text-neutral-400">
            ${message}
          </p>
        </div>
        <div class="flex items-center">
          <button type="button" class="toast-close-custom inline-flex shrink-0 justify-center items-center size-5 rounded-lg text-gray-800 opacity-50 hover:opacity-100 focus:outline-none focus:opacity-100 dark:text-white" aria-label="Close">
            <span class="sr-only">Close</span>
            <img src="/images/x-icon.png" class="h-5 w-5 mr-3" alt="Toast Icon" />
          </button>
        </div>
      </div>
    `;

    const closeButton = toastNode.querySelector('.toast-close-custom');
    if (closeButton) {
        closeButton.addEventListener('click', () => {
            toast.hideToast();
        });
    }
    
    return toastNode;
};

export function useAppToast() {
    const showSuccessToast = (message: string) => {
        const toast = Toastify({
            duration: 3000,
            close: false,
            gravity: "top",
            position: "right",
            style: {
                background: "transparent",
                boxShadow: "none",
                padding: "0", // ลบ padding ของ container หลัก
            }
        });
        toast.options.node = createToastNode(message, 'success', toast);
        toast.showToast();
    };

    const showErrorToast = (message: string) => {
        const toast = Toastify({
            duration: 3000,
            close: false,
            gravity: "top",
            position: "right",
            style: {
                background: "transparent",
                boxShadow: "none",
                padding: "0",
            }
        });
        toast.options.node = createToastNode(message, 'error', toast);
        toast.showToast();
    };

    return { showSuccessToast, showErrorToast };
}
