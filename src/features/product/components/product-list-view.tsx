"use client";

import Image from "next/image";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useCallback } from "react";
import type { ProductsPageData } from "@/features/product/product.types";
import { ProductTable } from "./product-table";
import { SearchBox } from "./search-box";
import { Tabs } from "./tabs";
import type { IStaticMethods } from "preline/preline";
import { PrimaryButton } from "@/components/ui/Button";
import { Breadcrumb } from "@/components/ui/Breadcrumb";

declare global {
  interface Window {
    HSStaticMethods: IStaticMethods;
  }
}

export function ProductListView({ data }: { data: ProductsPageData }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const currentStatus = searchParams.get("productStatus") || "All";
  const currentPage = Number(searchParams.get("page")) || 1;
  const ITEMS_PER_PAGE = 10;

  const { farm, products, totalCount, statusCounts } = data;
  const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE);

  const createURL = useCallback(
    (newParams: Record<string, string>) => {
      const params = new URLSearchParams(searchParams.toString());
      for (const [key, value] of Object.entries(newParams)) {
        if (value) {
          params.set(key, value);
        } else {
          params.delete(key);
        }
      }
      return `${pathname}?${params.toString()}`;
    },
    [pathname, searchParams]
  );

  const handleTabSelect = (key: string) => {
    const newStatus = key === "All" ? "" : key;
    router.push(createURL({ productStatus: newStatus, page: "1" }));
  };

  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages) return;
    router.push(createURL({ page: page.toString() }));
  };

  const tabs = [
    { label: "All", count: statusCounts.All, key: "All" },
    { label: "Available", count: statusCounts.Available, key: "Available" },
    { label: "On Hold", count: statusCounts["On Hold"], key: "On Hold" },
  ];

  const breadcrumbPaths = [{ name: "Home", href: "/farm" }, { name: "Farm" }];

  return (
    <div className="bg-neutral-100 min-h-screen">
      <div className="container mx-auto max-w-4xl pb-6">
        <div className="bg-white py-2">
          <Breadcrumb paths={breadcrumbPaths} className="px-4" />
          <div className="mt-4 flex items-center gap-4 border-b border-gray-200 pb-6 px-4">
            <div className="relative h-16 w-16 flex-shrink-0">
              <Image
                src={farm.logo_url || "/images/logo-placeholder.png"}
                alt="Farm Logo"
                layout="fill"
                className="rounded-full object-cover"
              />
            </div>
            <div>
              <h1 className="text-base font-semibold text-gray-800">
                {farm.name}
              </h1>
              <div className="mt-2 flex items-center gap-1.5 text-gray-500">
                <Image
                  src="/images/snake-icon.png"
                  alt="An illustration of a barn"
                  width={20}
                  height={20}
                  quality={100}
                  style={{ objectFit: "contain" }}
                />
                <span className="text-sm font-medium">{totalCount}</span>
              </div>
            </div>
          </div>
          <div className="mt-5 mb-3 flex items-center justify-between px-4">
            <h2 className="text-lg font-bold text-gray-800">
              All Product ({totalCount})
            </h2>
            <PrimaryButton
              href="/farm/products/create"
              className="w-[110px] h-[33px]"
            >
              Add Product
            </PrimaryButton>
          </div>
        </div>

        <div className="px-4">
          <div className="mt-4 rounded-lg bg-white p-4 shadow">
            <div>
              <Tabs
                tabs={tabs}
                selectedTab={currentStatus}
                onSelect={handleTabSelect}
              />
            </div>
            <div className="mt-4">
              <SearchBox />
            </div>
            <div className="mt-2">
              {products.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <Image
                    src="/images/snake-table.png"
                    alt="An illustration of a barn"
                    width={125}
                    height={125}
                    quality={100}
                    style={{ objectFit: "contain" }}
                  />
                  <p className="mt-4 font-medium text-gray-500">
                    No products found.
                  </p>
                </div>
              ) : (
                <ProductTable
                  products={products}
                  pagination={{
                    currentPage,
                    totalPages,
                    totalCount,
                    itemsPerPage: ITEMS_PER_PAGE,
                    onPageChange: handlePageChange,
                  }}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}