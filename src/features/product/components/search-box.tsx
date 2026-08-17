'use client';

import { useEffect, useRef, useState, useTransition } from 'react';
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
  const submittedQueryRef = useRef(initialQuery);
  // ใช้ useDebounce เพื่อรอ 500ms หลังจาก user หยุดพิมพ์
  const [debouncedValue] = useDebounce(inputValue, 500);
  const [isPending, startTransition] = useTransition();
  const isSearching = inputValue !== initialQuery || isPending;

  useEffect(() => {
    setInputValue((currentValue) => {
      // Keep newer text that was typed while the previous search was loading.
      if (
        initialQuery === submittedQueryRef.current &&
        currentValue !== submittedQueryRef.current
      ) {
        return currentValue;
      }

      submittedQueryRef.current = initialQuery;
      return initialQuery;
    });
  }, [initialQuery]);

  useEffect(() => {
    if (debouncedValue === initialQuery) return;

    const params = new URLSearchParams(searchParams.toString());

    if (debouncedValue) {
      params.set('q', debouncedValue);
    } else {
      params.delete('q');
    }

    params.set('page', '1');
    submittedQueryRef.current = debouncedValue;

    startTransition(() => {
        router.replace(`${pathname}?${params.toString()}`);
    });

  }, [debouncedValue, initialQuery, pathname, router, searchParams]);

  return (
    <div className="relative">
      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
        <SearchIcon className="h-5 w-5 text-gray-400" />
      </div>
      <input
        type="text"
        name="q"
        className="block w-full rounded-lg border-gray-300 py-2 pl-10 pr-10 sm:text-sm"
        placeholder="Search here"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        aria-busy={isSearching}
      />
      {isSearching && (
        <div
          className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3"
          role="status"
          aria-label="Searching"
        >
          <span className="size-4 animate-spin rounded-full border-2 border-gray-300 border-t-gray-700" />
        </div>
      )}
    </div>
  );
}
