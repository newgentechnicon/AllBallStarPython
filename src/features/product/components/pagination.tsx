'use client';

// ไอคอนสำหรับปุ่ม Previous และ Next
const PrevIcon = () => (
  <svg className="shrink-0 size-3.5" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="m15 18-6-6 6-6"></path>
  </svg>
);
const NextIcon = () => (
  <svg className="shrink-0 size-3.5" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="m9 18 6-6-6-6"></path>
  </svg>
);

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalCount: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
}

export function Pagination({ currentPage, totalPages, totalCount, itemsPerPage, onPageChange }: PaginationProps) {
  const startItem = totalCount > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0;
  const endItem = Math.min(currentPage * itemsPerPage, totalCount);
  
  // Logic สำหรับสร้างหมายเลขหน้าที่จะแสดง (เช่น [1, '...', 4, 5, 6, '...', 10])
  const getPageNumbers = () => {
    const pages = [];
    const siblingCount = 1; // จำนวนหน้าที่แสดงข้างๆ หน้าปัจจุบัน
    const showEllipsisThreshold = 3 + 2 * siblingCount;

    if (totalPages <= showEllipsisThreshold) {
      // ถ้าจำนวนหน้าน้อย ก็แสดงทั้งหมด
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // กรณีมีหน้าเยอะ
      const leftSiblingIndex = Math.max(currentPage - siblingCount, 1);
      const rightSiblingIndex = Math.min(currentPage + siblingCount, totalPages);
      
      const shouldShowLeftEllipsis = leftSiblingIndex > 2;
      const shouldShowRightEllipsis = rightSiblingIndex < totalPages - 1;

      // หน้าแรก
      pages.push(1);
      // ... ด้านซ้าย
      if (shouldShowLeftEllipsis) pages.push('...');

      // หน้าที่อยู่รอบๆ หน้าปัจจุบัน
      for (let i = leftSiblingIndex; i <= rightSiblingIndex; i++) {
        if (i > 1 && i < totalPages) {
          pages.push(i);
        }
      }
      
      // ... ด้านขวา
      if (shouldShowRightEllipsis) pages.push('...');
      // หน้าสุดท้าย
      pages.push(totalPages);
    }
    return pages;
  };
  
  const pageNumbers = getPageNumbers();

  return (
    <div className="flex items-center justify-between">
      {/* ส่วนแสดงผล "Showing x to y of z results" */}
      <div>
        <p className="text-base font-medium text-[#6B7280]">
          <span className="font-medium">{startItem}</span> - <span className="font-medium">{endItem}</span> from{' '}
          <span className="font-medium">{totalCount}</span>
        </p>
      </div>

      {/* ส่วนปุ่ม Navigation */}
      <nav className="flex items-center gap-x-1" aria-label="Pagination">
        <button
          type="button"
          className="min-h-[38px] min-w-[38px] py-2 px-2.5 inline-flex justify-center items-center gap-x-2 text-sm rounded-lg text-gray-800 hover:bg-gray-100 focus:outline-none focus:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage <= 1}
          aria-label="Previous"
        >
          <PrevIcon />
        </button>

        <div className="flex items-center gap-x-1">
          {pageNumbers.map((page, index) => {
            if (page === '...') {
              return (
                <span key={`ellipsis-${index}`} className="min-h-[38px] min-w-[38px] flex justify-center items-center text-gray-500 py-2 px-3 text-sm">
                  •••
                </span>
              );
            }
            
            const isActive = page === currentPage;
            const activeClasses = "bg-gray-200 text-base font-medium text-[#6B7280]";
            const defaultClasses = "text-base font-medium text-[#6B7280] hover:bg-gray-100";

            return (
              <button
                key={page}
                type="button"
                className={`min-h-[38px] min-w-[38px] flex justify-center items-center py-2 px-3 rounded-lg focus:outline-none focus:bg-gray-300 disabled:opacity-50 disabled:pointer-events-none ${isActive ? activeClasses : defaultClasses}`}
                onClick={() => onPageChange(page as number)}
                aria-current={isActive ? 'page' : undefined}
              >
                {page}
              </button>
            );
          })}
        </div>

        <button
          type="button"
          className="min-h-[38px] min-w-[38px] py-2 px-2.5 inline-flex justify-center items-center gap-x-2 text-sm rounded-lg text-gray-800 hover:bg-gray-100 focus:outline-none focus:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage >= totalPages}
          aria-label="Next"
        >
          <NextIcon />
        </button>
      </nav>
    </div>
  );
};