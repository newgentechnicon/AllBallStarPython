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
  return (
    <div className="border-b border-gray-200 dark:border-neutral-700">
      <nav className="flex gap-x-1" aria-label="Tabs">
        {tabs.map((tab) => {
          const isActive = selectedTab === tab.key;

          return (
            <button
              key={tab.key}
              type="button"
              onClick={() => onSelect(tab.key)}
              className={`py-4 px-1 inline-flex items-center gap-x-2 border-b-2 text-sm whitespace-nowrap
                ${isActive
                  ? 'font-semibold border-neutral-600 text-neutral-600 dark:text-neutral-500'
                  : 'border-transparent text-gray-500 hover:text-neutral-600 focus:outline-none dark:text-neutral-400 dark:hover:text-nuetral-500'
                }`}
            >
              {tab.label}
              <span
                className={`ms-1 py-0.5 px-1.5 rounded-full text-xs font-medium
                  ${isActive
                    ? 'bg-neutral-600 text-white dark:bg-neutral-800 dark:text-white'
                    : 'bg-gray-100 text-gray-800 dark:bg-neutral-700 dark:text-neutral-300'
                  }`}
              >
                {tab.count}
              </span>
            </button>
          );
        })}
      </nav>
    </div>
  );
}
