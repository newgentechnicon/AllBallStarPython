"use client";

import { useState, useTransition } from "react";
import Image from "next/image";
import Link from "next/link";
import { StatusDropdown } from "./StatusDropdown";
import { softDeleteProduct } from "@/app/(SidebarLayout)/farm/products/actions";
import { useAppToast } from "@/hooks/useAppToast";
import { ConfirmationModal } from "@/components/ui/ConfirmationModal";
import type { Product } from "@/types/Product"; // แก้ไข path ตามที่คุณเก็บ type
import type { Farm } from "@/lib/data/farm";

// ประกาศ global type สำหรับ Preline (HSOverlay)
declare global {
  interface Window {
    HSOverlay: HSOverlay;
  }
}

interface HSOverlay {
  open(el: string | HTMLElement): void;
  close(el: string | HTMLElement): void;
}

// --- SVG Icons ---
const MaleIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="h-4 w-4 text-blue-500"
  >
    {" "}
    <circle cx="12" cy="10" r="4" /> <path d="M12 14v7m-3-3h6" />{" "}
  </svg>
);
const FemaleIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="h-4 w-4 text-pink-500"
  >
    {" "}
    <circle cx="10" cy="7" r="4" /> <path d="M10 11v10m-3-3h6" />{" "}
  </svg>
);
const ViewIcon = () => (
  <svg
    className="size-4"
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    {" "}
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
    />{" "}
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M2.458 12C3.732 7.943 7.523 5 12 5s8.268 2.943 9.542 7c-1.274 4.057-5.065 7-9.542 7s-8.268-2.943-9.542-7z"
    />{" "}
  </svg>
);
const DeleteIcon = () => (
  <svg
    className="size-4"
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    {" "}
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M19 7L5 7M10 11v6M14 11v6M5 7l1 12a2 2 0 002 2h8a2 2 0 002-2l1-12M9 7V4a1 1 0 011-1h4a1 1 0 011 1v3"
    />{" "}
  </svg>
);

const SexDisplay = ({ sex }: { sex: string | null }) => {
  return (
    <div className="flex items-center gap-2">
      {sex === "Male" && <MaleIcon />}
      {sex === "Female" && <FemaleIcon />}
      <span>{sex || "N/A"}</span>
    </div>
  );
};

export const ProductTable = ({
  products,
  farm,
}: {
  products: Product[];
  farm: Farm;
}) => {
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);
  const [isPending, startTransition] = useTransition();
  const { showSuccessToast, showErrorToast } = useAppToast();

  const handleConfirmDelete = () => {
    if (!productToDelete) return;

    startTransition(async () => {
      const result = await softDeleteProduct(productToDelete.id);

      if (result.success && result.message) {
        showSuccessToast(result.message);
      } else if (result.error) {
        showErrorToast(result.error);
      }

      if (window.HSOverlay) {
        window.HSOverlay.close("#delete-product-modal");
      }
      setProductToDelete(null);
    });
  };

  return (
    <>
      <div className="mt-6 flow-root">
        <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
            <div className="overflow-hidden rounded-lg border border-gray-300">
              <table className="min-w-full divide-y divide-gray-300">
                <thead className="bg-gray-50">
                  <tr>
                    <th
                      scope="col"
                      className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6"
                    >
                      NAME
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                    >
                      Status
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                    >
                      ID
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                    >
                      Sex
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                    >
                      Price
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                    >
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-300 bg-white">
                  {products.map((product) => (
                    <tr key={product.id}>
                      <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm sm:pl-6">
                        <div className="flex items-center">
                          <div className="h-10 w-10 flex-shrink-0">
                            <Image
                              className="h-10 w-10 rounded-full object-cover"
                              src={
                                product.image_urls?.[0] ||
                                "/images/image-placeholder.png"
                              }
                              alt={product.name}
                              width={40}
                              height={40}
                            />
                          </div>
                          <div className="ml-4">
                            <div className="font-medium text-gray-900">
                              {product.name}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        <StatusDropdown
                          productId={product.id}
                          currentStatus={product.status}
                        />
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{`GK-${farm.id}-${product.id}`}</td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        <SexDisplay sex={product.sex} />
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        ฿{product.price?.toLocaleString() || "N/A"}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        <div className="flex items-center gap-2">
                          <Link
                            href={`/farm/products/${product.id}`}
                            className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-800 shadow-sm hover:bg-gray-50"
                          >
                            <ViewIcon />
                          </Link>
                          <button
                            type="button"
                            className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-800 shadow-sm hover:bg-gray-50"
                            data-hs-overlay="#delete-product-modal"
                            onClick={() => setProductToDelete(product)}
                          >
                            <DeleteIcon />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      <ConfirmationModal
        id="delete-product-modal"
        title="Delete Product"
        onConfirm={handleConfirmDelete}
        confirmText="Delete"
        confirmButtonClass="bg-red-600 hover:bg-red-700"
        isPending={isPending}
      >
        <p className="text-gray-600">
          Are you sure you want to delete <br />
          <span className="font-semibold">
            &quot;{productToDelete?.name}&quot;
          </span>{" "}
          product?
        </p>
        <p className="mt-1 text-sm text-gray-500">
          This action could not be undone.
        </p>
      </ConfirmationModal>
    </>
  );
};
