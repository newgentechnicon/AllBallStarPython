'use client';

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Pagination } from "./pagination";

interface ShopPaginationProps {
  currentPage: number;
  totalCount: number;
  itemsPerPage: number;
}

export function ShopPagination({
  currentPage,
  totalCount,
  itemsPerPage,
}: ShopPaginationProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const totalPages = Math.ceil(totalCount / itemsPerPage);

  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages) return;

    const params = new URLSearchParams(searchParams.toString());
    params.set("page", page.toString());
    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <Pagination
      currentPage={currentPage}
      totalPages={totalPages}
      totalCount={totalCount}
      itemsPerPage={itemsPerPage}
      onPageChange={handlePageChange}
    />
  );
}
