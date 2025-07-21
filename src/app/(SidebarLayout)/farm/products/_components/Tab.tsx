"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";

interface TabProps {
  tabs: { label: string; count?: number; key: string }[];
  currentStatus: string; // 👈 แก้จาก `selectedTab` เป็น `currentStatus`
}

export default function Tabs({ tabs, currentStatus, }: TabProps) { // 👈 แก้ไข parameter
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const handleSelect = (key: string) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", "1");
    if (key === "All") {
      params.delete("status");
    } else {
      params.set("status", key);
    }
    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <nav className="flex gap-x-1" role="tablist">
      {tabs.map(({ label, count, key }) => (
        <button
          key={key}
          type="button"
          onClick={() => handleSelect(key)}
          className={`py-4 px-1 inline-flex items-center gap-x-2 border-b-2 text-sm whitespace-nowrap focus:outline-none ${
            // 👈 แก้ไขเงื่อนไข
            currentStatus === key
              ? "border-blue-600 text-blue-600 font-semibold"
              : "border-transparent text-gray-500 hover:text-blue-600"
          }`}
          role="tab"
          aria-selected={currentStatus === key}
        >
          {label}
          {count !== undefined && (
            <span className="ms-1 py-0.5 px-1.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
              {count}
            </span>
          )}
        </button>
      ))}
    </nav>
  );
}