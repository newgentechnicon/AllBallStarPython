'use client';
import Toastify from 'toastify-js';
import "toastify-js/src/toastify.css";

// ฟังก์ชันสร้าง Node กลาง (ลดโค้ดซ้ำ)
const createToastNode = (message: string, iconSrc: string) => {
    const toastNode = document.createElement('div');
    toastNode.className = 'flex items-center justify-between w-full';
    toastNode.innerHTML = `
      <div class="flex items-center">
        <img src="${iconSrc}" class="h-6 w-6 mr-3" alt="Toast Icon" />
        <span>${message}</span>
      </div>
    `;
    return toastNode;
};

export function useAppToast() {
  const showSuccessToast = (message: string) => {
    Toastify({
      node: createToastNode(message, "/images/farm-7.svg"),
      duration: 3000,
      close: true,
      gravity: "top",
      position: "right",
      style: { background: "#14B8A6", borderRadius: "8px", padding: "16px" },
    }).showToast();
  };

  const showErrorToast = (message: string) => {
    Toastify({
      node: createToastNode(message, "/images/error-icon.svg"), // สร้าง error icon ของคุณ
      duration: 3000,
      close: true,
      gravity: "top",
      position: "right",
      style: { background: "#EF4444", borderRadius: "8px", padding: "16px" },
    }).showToast();
  };

  return { showSuccessToast, showErrorToast };
}