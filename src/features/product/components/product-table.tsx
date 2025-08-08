"use client";

import { useEffect, useState, useTransition } from "react";
import Image from "next/image";
import Link from "next/link";
import { StatusDropdown } from "./status-dropdown";
import { softDeleteProduct } from "@/features/product/product.actions";
import type { ProductWithMorphs } from "@/features/product/product.types";
import { useAppToast } from "@/hooks/useAppToast";
import { Pagination } from "./pagination";
import { DeleteProductModal } from "./DeleteProductModal";

declare global {
  interface Window {
    HSOverlay: {
      open(el: string | HTMLElement): void;
      close(el: string | HTMLElement): void;
    };
  }
}

const SexDisplay = ({ sex }: { sex: string | null }) => (
  <div className="flex items-center gap-2">
    {sex === "Male" && (
      <Image
        src="/images/male-icon.png"
        alt="upload"
        width={13}
        height={13}
        quality={100}
        className="mx-auto"
      />
    )}
    {sex === "Female" && (
      <Image
        src="/images/female-icon.png"
        alt="upload"
        width={10}
        height={16}
        quality={100}
        className="mx-auto"
      />
    )}
    <span>{sex || "N/A"}</span>
  </div>
);

type PaginationProps = {
  currentPage: number;
  totalPages: number;
  totalCount: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
};

export function ProductTable({
  products,
  pagination,
}: {
  products: ProductWithMorphs[];
  pagination: PaginationProps;
}) {
  const [productToDelete, setProductToDelete] =
    useState<ProductWithMorphs | null>(null);
  const [isPending, startTransition] = useTransition();
  const { showSuccessToast, showErrorToast } = useAppToast();

  useEffect(() => {
    const modalElement = document.getElementById("delete-product-modal");
    const handleModalClose = () => {
      setProductToDelete(null);
    };

    if (modalElement) {
      modalElement.addEventListener("close.hs.overlay", handleModalClose);
    }
    return () => {
      if (modalElement) {
        modalElement.removeEventListener("close.hs.overlay", handleModalClose);
      }
    };
  }, []);

  useEffect(() => {
    if (productToDelete) {
      if (window.HSOverlay) {
        window.HSOverlay.open("#delete-product-modal");
      } else {
        console.error(
          "CHECKPOINT 4: FAILED. window.HSOverlay is not available!"
        );
      }
    }
  }, [productToDelete]);

  const handleConfirmDelete = () => {
    if (!productToDelete) return;

    startTransition(async () => {
      const result = await softDeleteProduct(productToDelete.id);
      if (result.success) {
        showSuccessToast("Product deleted successfully.");
        // ✅ ปิด modal
        if (window.HSOverlay) {
          window.HSOverlay.close("#delete-product-modal");
        }
      } else {
        showErrorToast(`Error: ${result.error}`);
      }

      setProductToDelete(null);
    });
  };

  return (
    <>
      <div className="mt-6 flow-root">
        <div className="-my-2 overflow-x-auto">
          <div className="inline-block min-w-full py-2 align-middle">
            <div className="overflow-hidden rounded-lg border border-gray-300">
              <table className="min-w-full divide-y divide-gray-300">
                <thead>
                  <tr>
                    <th
                      scope="col"
                      className="py-3.5 pl-4 pr-3 text-left text-xs font-medium text-[#6B7280] sm:pl-6"
                    >
                      NAME
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3.5 text-left text-xs font-medium text-[#6B7280]"
                    >
                      Status
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3.5 text-left text-xs font-medium text-[#6B7280]"
                    >
                      ID
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3.5 text-left text-xs font-medium text-[#6B7280]"
                    >
                      Sex
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3.5 text-left text-xs font-medium text-[#6B7280]"
                    >
                      Price
                    </th>
                    <th
                      scope="col"
                      className="relative py-3.5 pl-3 pr-4 sm:pr-6"
                    />
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
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{`${product.product_id}`}</td>
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
                            className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#D1D5DB] bg-white text-gray-800 hover:bg-gray-50"
                          >
                            <Image
                              src="/images/eye-icon.png"
                              alt="upload"
                              width={16}
                              height={16}
                              quality={100}
                              className="mx-auto"
                            />
                          </Link>
                          <button
                            type="button"
                            className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#FCA5A5] bg-white text-gray-800 hover:bg-gray-50"
                            data-hs-overlay="#delete-product-modal"
                            onClick={() => setProductToDelete(product)}
                          >
                            <Image
                              src="/images/trash-icon.png"
                              alt="upload"
                              width={16}
                              height={16}
                              quality={100}
                              className="mx-auto"
                            />
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

      <div className="pt-4 px-2">
        <Pagination
          currentPage={pagination.currentPage}
          totalPages={pagination.totalPages}
          totalCount={pagination.totalCount}
          itemsPerPage={pagination.itemsPerPage}
          onPageChange={pagination.onPageChange}
        />
      </div>
      <DeleteProductModal
        product={productToDelete}
        onConfirm={handleConfirmDelete}
        isPending={isPending}
      />
    </>
  );
}
