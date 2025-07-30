"use client";

import { useState, useTransition } from "react";
import Image from "next/image";
import Link from "next/link";
import { StatusDropdown } from "./status-dropdown";
import { softDeleteProduct } from "@/features/product/product.actions";
import type { ProductWithMorphs } from "@/features/product/product.types";
import type { Farm } from "@/features/farm/farm.types";
import { useAppToast } from "@/hooks/useAppToast";

declare global {
  interface Window { HSOverlay: { open(el: string | HTMLElement): void; close(el: string | HTMLElement): void; };}
}

// SVG Icons
const MaleIcon = () => ( <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 text-blue-500" > <circle cx="12" cy="10" r="4" /> <path d="M12 14v7m-3-3h6" /> </svg> );
const FemaleIcon = () => ( <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 text-pink-500" > <circle cx="10" cy="7" r="4" /> <path d="M10 11v10m-3-3h6" /> </svg> );
const ViewIcon = () => ( <svg className="size-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" > <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /> <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5s8.268 2.943 9.542 7c-1.274 4.057-5.065 7-9.542 7s-8.268-2.943-9.542-7z" /> </svg> );
const DeleteIcon = () => ( <svg className="size-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" > <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7L5 7M10 11v6M14 11v6M5 7l1 12a2 2 0 002 2h8a2 2 0 002-2l1-12M9 7V4a1 1 0 011-1h4a1 1 0 011 1v3" /> </svg> );
const SexDisplay = ({ sex }: { sex: string | null }) => ( <div className="flex items-center gap-2"> {sex === "Male" && <MaleIcon />} {sex === "Female" && <FemaleIcon />} <span>{sex || "N/A"}</span> </div> );

export function ProductTable({ products, farm }: { products: ProductWithMorphs[]; farm: Farm; }) {
  const [productToDelete, setProductToDelete] = useState<ProductWithMorphs | null>(null);
  const [isPending, startTransition] = useTransition();
  const { showSuccessToast, showErrorToast } = useAppToast();

  const handleConfirmDelete = () => {
    if (!productToDelete) return;
    startTransition(async () => {
      const result = await softDeleteProduct(productToDelete.id);
      if (result.success) {
        showSuccessToast("Product deleted successfully.");
      } else {
        showErrorToast(`Error: ${result.error}`);
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
                  {/* ✅ ส่วนหัวตารางที่เพิ่มเข้ามา */}
                  <tr>
                    <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">NAME</th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Status</th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">ID</th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Sex</th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Price</th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-300 bg-white">
                  {products.map((product) => (
                    <tr key={product.id}>
                      <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm sm:pl-6">
                        <div className="flex items-center">
                          <div className="h-10 w-10 flex-shrink-0">
                            <Image className="h-10 w-10 rounded-full object-cover" src={product.image_urls?.[0] || "/images/image-placeholder.png"} alt={product.name} width={40} height={40} />
                          </div>
                          <div className="ml-4">
                            <div className="font-medium text-gray-900">{product.name}</div>
                            {/* <div className="text-gray-500 text-xs">
                               {product.product_morphs.map((pm) => pm.morphs?.name).filter(Boolean).join(" ")}
                            </div> */}
                          </div>
                        </div>
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        <StatusDropdown productId={product.id} currentStatus={product.status}/>
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{`GK-${farm.id}-${product.id}`}</td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500"><SexDisplay sex={product.sex} /></td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">฿{product.price?.toLocaleString() || "N/A"}</td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        <div className="flex items-center gap-2">
                          <Link href={`/farm/products/${product.id}`} className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-800 shadow-sm hover:bg-gray-50"><ViewIcon /></Link>
                          <button type="button" className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-800 shadow-sm hover:bg-gray-50" data-hs-overlay="#delete-product-modal" onClick={() => setProductToDelete(product)}><DeleteIcon /></button>
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
      
      {/* Preline Modal for Delete Confirmation */}
      <div id="delete-product-modal" className="hs-overlay hidden size-full fixed top-0 start-0 z-[80] overflow-x-hidden overflow-y-auto">
        <div className="hs-overlay-open:mt-7 hs-overlay-open:opacity-100 hs-overlay-open:duration-500 mt-0 opacity-0 ease-out transition-all sm:max-w-lg sm:w-full m-3 sm:mx-auto">
          <div className="bg-white border border-gray-200 rounded-xl shadow-sm">
            <div className="p-4 sm:p-7">
              <div className="text-center">
                <h2 className="block text-xl font-bold text-gray-800">Delete Product</h2>
                <div className="mt-4">
                  <p className="text-gray-600">Are you sure you want to delete <br /><span className="font-semibold">&quot;{productToDelete?.name}&quot;</span> product?</p>
                  <p className="mt-1 text-sm text-gray-500">This action could not be undone.</p>
                </div>
              </div>
              <div className="mt-8 grid grid-cols-2 gap-x-4">
                <button type="button" className="py-2.5 px-4 inline-flex justify-center items-center gap-x-2 text-sm font-medium rounded-lg border border-gray-200 bg-white text-gray-800 shadow-sm hover:bg-gray-50" data-hs-overlay="#delete-product-modal">Cancel</button>
                <button type="button" className="py-2.5 px-4 inline-flex justify-center items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent bg-red-600 text-white hover:bg-red-700 disabled:opacity-50" onClick={handleConfirmDelete} disabled={isPending}>
                  {isPending ? "Deleting..." : "Delete"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};