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
    <nav className="-mb-px flex space-x-6" aria-label="Tabs">
      {tabs.map((tab) => (
        <button
          key={tab.key}
          onClick={() => onSelect(tab.key)}
          className={`shrink-0 border-b-2 px-1 pb-4 text-sm font-medium ${
            selectedTab === tab.key
              ? 'border-sky-500 text-sky-600'
              : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
          }`}
        >
          {tab.label}
          {tab.count > 0 && (
            <span className={`ml-1.5 rounded-full px-2 py-0.5 text-xs font-semibold text-white ${
                selectedTab === tab.key ? 'bg-sky-600' : 'bg-gray-400'
            }`}>
              {tab.count}
            </span>
          )}
        </button>
      ))}
    </nav>
  );
}