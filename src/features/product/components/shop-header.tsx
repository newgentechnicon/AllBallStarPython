'use client';

// SVG Icons
const SearchIcon = () => ( <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5 text-gray-400"><circle cx="11" cy="11" r="8"></circle><path d="m21 21-4.3-4.3"></path></svg> );
const FilterIcon = () => ( <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16" className="h-4 w-4"><path d="M6 10.5a.5.5 0 0 1 .5-.5h3a.5.5 0 0 1 0 1h-3a.5.5 0 0 1-.5-.5zm-2-3a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1-.5-.5zm-2-3a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-11a.5.5 0 0 1-.5-.5z"/></svg> );

interface ShopHeaderProps {
    totalItems: number;
}

export function ShopHeader({ totalItems }: ShopHeaderProps) {
    return (
        <div>
            <h1 className="text-center text-xl font-bold tracking-wider text-black uppercase mb-8">
                All Pythons
            </h1>

            {/* Search and Filter */}
            <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <SearchIcon />
                </div>
                <input
                    type="text"
                    className="block w-full rounded-lg border-gray-300 py-2.5 pl-10 text-sm"
                    placeholder="Search here"
                />
            </div>

            <div className="flex justify-between items-center mt-4">
                <p className="text-sm text-gray-600">{totalItems.toLocaleString()} items</p>
                <button className="inline-flex items-center gap-x-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-800 shadow-sm hover:bg-gray-50">
                    <FilterIcon />
                    Filter
                    <span className="ml-1.5 rounded-full bg-gray-200 px-2 py-0.5 text-xs font-semibold text-gray-700">0</span>
                </button>
            </div>
        </div>
    );
}
