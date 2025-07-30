'use client';

interface Tab {
  label: string;
  count: number;
  key: string;
}

interface TabsProps {
  tabs: Tab[];
  selectedTab: string;
  onSelect: (key: string) => void;
}

export function Tabs({ tabs, selectedTab, onSelect }: TabsProps) {
  const baseButtonClasses = "py-4 px-1 inline-flex items-center gap-x-2 border-b-2 border-transparent text-sm whitespace-nowrap text-gray-500 hover:text-blue-600 focus:outline-none focus:text-blue-600 disabled:opacity-50 disabled:pointer-events-none dark:text-neutral-400 dark:hover:text-blue-500";
  const activeButtonClasses = "font-semibold border-blue-600 text-blue-600 dark:text-blue-500";

  const activeTab = selectedTab || 'All';

  return (
    <div className="border-b border-gray-200 dark:border-neutral-700">
      <nav className="flex gap-x-1" aria-label="Tabs" role="tablist">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.key;
          
          // ✅ แก้ไข: ใช้เงื่อนไขเพื่อเลือกชุดคลาสทั้งหมด
          const badgeClasses = isActive
            ? "ms-1 py-0.5 px-1.5 rounded-full text-xs font-medium bg-blue-100 text-blue-600 dark:bg-blue-800 dark:text-white"
            : "ms-1 py-0.5 px-1.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-neutral-700 dark:text-neutral-300";

          return (
            <button
              key={tab.key}
              type="button"
              onClick={() => onSelect(tab.key)}
              className={`${baseButtonClasses} ${isActive ? activeButtonClasses : ''}`}
              role="tab"
              aria-selected={isActive}
            >
              {tab.label}
              <span className={badgeClasses}>
                {tab.count}
              </span>
            </button>
          );
        })}
      </nav>
    </div>
  );
}
