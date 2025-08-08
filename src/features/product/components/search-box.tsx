'use client';

import { useEffect, useState, useTransition } from 'react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { useDebounce } from 'use-debounce';

const SearchIcon = ({ ...props }) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8" />
    <path d="m21 21-4.3-4.3" />
  </svg>
);

export function SearchBox() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get('q') || '';
  const [inputValue, setInputValue] = useState(initialQuery);
  // ใช้ useDebounce เพื่อรอ 500ms หลังจาก user หยุดพิมพ์
  const [debouncedValue] = useDebounce(inputValue, 500);
  const [, startTransition] = useTransition();

  useEffect(() => {
    if (initialQuery) {
      setInputValue(initialQuery);
    }
  }, [initialQuery]);

  useEffect(() => {
    // Effect นี้จะทำงานเมื่อ debouncedValue (ค่าที่หน่วงเวลาแล้ว) เปลี่ยนแปลงเท่านั้น
    const params = new URLSearchParams(searchParams.toString());

    // ถ้าค่าที่ค้นหาไม่ตรงกับใน URL ปัจจุบัน ให้ทำการ update
    if (debouncedValue) {
      params.set('q', debouncedValue);
    } else {
      params.delete('q');
    }

    // ถ้ามีการเปลี่ยนแปลงค่าค้นหา ให้กลับไปหน้า 1 เสมอ
    // ถ้าไม่มีการเปลี่ยนแปลง (debouncedValue === initialQuery) ก็ไม่ต้องเปลี่ยนหน้า
    if (debouncedValue !== initialQuery) {
        params.set('page', '1');
    }

    startTransition(() => {
        router.replace(`${pathname}?${params.toString()}`);
    });

  }, [debouncedValue, initialQuery, pathname, router, searchParams]); // Dependency ที่ถูกต้อง

  return (
    <div className="relative">
      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
        <SearchIcon className="h-5 w-5 text-gray-400" />
      </div>
      <input
        type="text"
        name="q"
        className="block w-full rounded-lg border-gray-300 py-2 pl-10 sm:text-sm"
        placeholder="Search here"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
      />
    </div>
  );
}
