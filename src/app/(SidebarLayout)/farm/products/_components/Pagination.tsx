'use client';

import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';

interface PaginationProps {
    totalCount: number;
    itemsPerPage?: number;
}

export default function Pagination({ totalCount, itemsPerPage = 10 }: PaginationProps) {
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const currentPage = Number(searchParams.get('page')) || 1;
    const totalPages = Math.ceil(totalCount / itemsPerPage);

    const createPageURL = (pageNumber: number) => {
        const params = new URLSearchParams(searchParams);
        params.set('page', pageNumber.toString());
        return `${pathname}?${params.toString()}`;
    };

    // if (totalPages <= 1) {
    //     return null; // ไม่ต้องแสดง Pagination ถ้ามีแค่หน้าเดียว
    // }

    const startItem = (currentPage - 1) * itemsPerPage + 1;
    const endItem = Math.min(currentPage * itemsPerPage, totalCount);

    return (
        <div className="flex items-center justify-between border-t border-gray-200 pt-4">
            <div>
                <p className="text-sm text-gray-700">
                    Showing <span className="font-medium">{startItem}</span> to <span className="font-medium">{endItem}</span> of <span className="font-medium">{totalCount}</span> results
                </p>
            </div>
            <div className="flex items-center gap-2">
                <Link 
                    href={createPageURL(currentPage - 1)} 
                    className={`rounded border p-1.5 ${currentPage <= 1 ? 'pointer-events-none text-gray-300' : 'text-gray-600 hover:bg-gray-100'}`}
                    aria-disabled={currentPage <= 1}
                    tabIndex={currentPage <= 1 ? -1 : undefined}
                >
                    &lt;
                </Link>
                <span className="text-sm text-gray-600">
                    Page {currentPage} of {totalPages}
                </span>
                <Link 
                    href={createPageURL(currentPage + 1)} 
                    className={`rounded border p-1.5 ${currentPage >= totalPages ? 'pointer-events-none text-gray-300' : 'text-gray-600 hover:bg-gray-100'}`}
                    aria-disabled={currentPage >= totalPages}
                    tabIndex={currentPage >= totalPages ? -1 : undefined}
                >
                    &gt;
                </Link>
            </div>
        </div>
    );
};