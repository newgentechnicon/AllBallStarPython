"use client";
import type { ProductWithMorphs } from "@/features/product/product.types";

const WarningIcon = () => (
  <svg
    className="size-10 text-red-500 mx-auto"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
    <line x1="12" y1="9" x2="12" y2="13" />
    <line x1="12" y1="17" x2="12.01" y2="17" />
  </svg>
);

interface DeleteProductModalProps {
  product: ProductWithMorphs | null;
  onConfirm: () => void;
  isPending: boolean;
}

export function DeleteProductModal({ product, onConfirm, isPending }: DeleteProductModalProps) {
  return (
    <div
      id="delete-product-modal"
      className="hs-overlay hidden size-full fixed top-0 start-0 z-[80] overflow-x-hidden overflow-y-auto pointer-events-none bg-gray-900/70"
    >
      <div className="hs-overlay-open:mt-7 hs-overlay-open:opacity-100 hs-overlay-open:duration-500 mt-0 opacity-0 ease-out transition-all sm:max-w-lg sm:w-full m-3 sm:mx-auto min-h-[calc(100%-3.5rem)] flex items-center">
        <div className="w-full flex flex-col bg-white border shadow-sm rounded-xl pointer-events-auto">
          <div className="p-4 sm:p-7">
            <div className="text-center">
              <WarningIcon />
              <h2 className="block text-2xl font-bold text-gray-800 mt-4">
                Delete Product
              </h2>
              {product ? (
              <div className="mt-4 px-6">
                <p className="text-gray-600">
                  Are you sure you want to delete this product?
                  <br />
                  <span className="font-semibold text-gray-800">
                    &quot;{product.name}&quot;
                  </span>
                </p>
                <p className="mt-2 text-sm text-red-600 font-semibold">
                  This action cannot be undone.
                </p>
              </div>
            ) : (
              <div className="mt-4 px-6 text-gray-500">Loading product info...</div>
            )}
            </div>
          </div>
          
          <div className="flex justify-center items-center gap-x-2 p-4 border-t">
            <button
              type="button"
              className="py-2 px-4 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-gray-200 bg-white text-gray-800 shadow-sm hover:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none"
              data-hs-overlay="#delete-product-modal"
            >
              Cancel
            </button>
            <button
              type="button"
              className="py-2 px-4 inline-flex items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent bg-red-600 text-white hover:bg-red-700 disabled:opacity-50"
              onClick={onConfirm}
              disabled={isPending}
            >
              {isPending ? "Deleting..." : "Yes, Delete"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}