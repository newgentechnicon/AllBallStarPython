'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    totalCount: number;
    itemsPerPage: number;
}

export function Pagination({ currentPage, totalPages, totalCount, itemsPerPage }: PaginationProps) {
    const startItem = totalCount > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0;
    const endItem = Math.min(currentPage * itemsPerPage, totalCount);
    const searchParams = useSearchParams();

    const createPageURL = (pageNumber: number) => {
        const params = new URLSearchParams(searchParams);
        params.set('page', pageNumber.toString());
        return `?${params.toString()}`;
    };

    // if (totalPages <= 1) return null;

    return (
        <div className="flex items-center justify-between border-t border-gray-200 pt-4">
            <div>
                <p className="text-sm text-gray-700">
                    Showing <span className="font-medium">{startItem}</span> to <span className="font-medium">{endItem}</span> of{' '}
                    <span className="font-medium">{totalCount}</span> results
                </p>
            </div>
            <div className="flex items-center gap-2">
                <Link 
                    href={createPageURL(currentPage - 1)} 
                    className={`rounded border p-1.5 ${currentPage <= 1 ? 'pointer-events-none text-gray-300' : 'text-gray-600 hover:bg-gray-100'}`}
                    scroll={false}
                >
                    &lt;
                </Link>
                <span className="rounded border bg-gray-200 px-3 py-1.5 text-sm font-semibold">{currentPage}</span>
                <span className="text-sm text-gray-600">of {totalPages}</span>
                <Link 
                    href={createPageURL(currentPage + 1)} 
                    className={`rounded border p-1.5 ${currentPage >= totalPages ? 'pointer-events-none text-gray-300' : 'text-gray-600 hover:bg-gray-100'}`}
                    scroll={false}
                >
                    &gt;
                </Link>
            </div>
        </div>
    );
};