"use client"; // เพิ่มบรรทัดนี้

import React from "react";

interface TabProps {
  tabs: { label: string; count?: number; key: string }[];
  selectedTab: string;
  onSelect: (key: string) => void;
}

export default function Tabs({ tabs, selectedTab, onSelect }: TabProps) {
  return (
    <nav className="flex gap-x-1" role="tablist" aria-orientation="horizontal">
      {" "}
      {tabs.map(({ label, count, key }) => (
        <button
          key={key}
          type="button"
          onClick={() => onSelect(key)}
          className={`py-4 px-1 inline-flex items-center gap-x-2 border-b-2 text-sm whitespace-nowrap focus:outline-none ${
            selectedTab === key
              ? "border-blue-600 text-blue-600 font-semibold"
              : "border-transparent text-gray-500 hover:text-blue-600"
          }`}
          role="tab"
          aria-selected={selectedTab === key}
        >
          {label}{" "}
          {count !== undefined && (
            <span className="ms-1 py-0.5 px-1.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
              {count}
            </span>
          )}{" "}
        </button>
      ))}{" "}
    </nav>
  );
}
