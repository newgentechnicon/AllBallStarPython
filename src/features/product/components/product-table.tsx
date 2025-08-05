"use client";

import { useState, useTransition } from "react";
import Image from "next/image";
import Link from "next/link";
import { StatusDropdown } from "./status-dropdown";
import { softDeleteProduct } from "@/features/product/product.actions";
import type { ProductWithMorphs } from "@/features/product/product.types";
import { useAppToast } from "@/hooks/useAppToast";
import { Pagination } from "./pagination";
import { DeleteProductModal } from "./DeleteProductModal";
import {
  ViewIcon,
  DeleteIcon,
  MaleIcon,
  FemaleIcon,
} from "@/components/ui/icons";

// เราไม่จำเป็นต้องประกาศ global type ของ Preline ที่นี่แล้ว
// เพราะ Component ที่เกี่ยวข้องจัดการตัวเองเรียบร้อย
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
    {sex === "Male" && <MaleIcon />}
    {sex === "Female" && <FemaleIcon />}
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
  // farm prop ไม่ได้ถูกใช้งานแล้ว จึงลบออกได้
  // farm: Farm;
  pagination: PaginationProps;
}) {
  const [productToDelete, setProductToDelete] =
    useState<ProductWithMorphs | null>(null);
  const [isPending, startTransition] = useTransition();
  const { showSuccessToast, showErrorToast } = useAppToast();

  // ฟังก์ชันสำหรับยืนยันการลบ (Logic อยู่ที่นี่ที่เดียว)
  const handleConfirmDelete = () => {
    if (!productToDelete) return;

    startTransition(async () => {
      const result = await softDeleteProduct(productToDelete.id);
      if (result.success) {
        showSuccessToast("Product deleted successfully.");
      } else {
        showErrorToast(`Error: ${result.error}`);
      }
      
      // เมื่อลบเสร็จ ให้เคลียร์ state ซึ่งจะทำให้ Modal หายไปโดยอัตโนมัติ
      setProductToDelete(null); 
    });
  };

  // ฟังก์ชันสำหรับ "การเตรียมตัว" ก่อนเปิด Modal
  const handleOpenDeleteModal = (product: ProductWithMorphs) => {
    // 1. ตั้งค่า state ของ React ว่าจะลบ product ตัวไหน
    setProductToDelete(product);

    // 2. สั่งเปิด Modal ของ Preline ด้วย JavaScript โดยตรง
    if (window.HSOverlay) {
      window.HSOverlay.open('#delete-product-modal');
    }
  };

  return (
    <>
      <div className="mt-6 flow-root">
        <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
            <div className="overflow-hidden rounded-lg border border-gray-300">
              <table className="min-w-full divide-y divide-gray-300">
                <thead>
                  <tr>
                    <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-xs font-medium text-[#6B7280] sm:pl-6">
                      NAME
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-xs font-medium text-[#6B7280]">
                      Status
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-xs font-medium text-[#6B7280]">
                      ID
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-xs font-medium text-[#6B7280]">
                      Sex
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-xs font-medium text-[#6B7280]">
                      Price
                    </th>
                    <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6" />
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
                            className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-800 shadow-sm hover:bg-gray-50"
                          >
                            <ViewIcon />
                          </Link>
                          {/* ปุ่มลบจะเรียกใช้ฟังก์ชันใหม่ที่เราสร้างขึ้น */}
                          <button
                            type="button"
                            className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-800 shadow-sm hover:bg-gray-50"
                            onClick={() => handleOpenDeleteModal(product)}
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

      <div className="p-4">
        <Pagination
          currentPage={pagination.currentPage}
          totalPages={pagination.totalPages}
          totalCount={pagination.totalCount}
          itemsPerPage={pagination.itemsPerPage}
          onPageChange={pagination.onPageChange}
        />
      </div>
      
      {/* เรียกใช้ Component Modal ที่แยกออกไปแล้ว */}
      <DeleteProductModal
        product={productToDelete}
        onConfirm={handleConfirmDelete}
        isPending={isPending}
      />
    </>
  );
}