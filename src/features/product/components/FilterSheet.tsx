'use client';

import { PrimaryButton, SecondaryButton } from "@/components/ui/Button";

// Define the shape of the data needed for filters
interface FilterData {
    breeders: { id: number; name: string }[];
    years: string[];
}

interface FilterSheetProps {
    isOpen: boolean;
    onClose: () => void;
    filterData: FilterData;
}

// SVG Icons for checkboxes
const MaleIcon = () => ( <svg xmlns="http://www.w.3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 text-blue-500"><circle cx="12" cy="10" r="4"></circle><path d="M12 14v7m-3-3h6"></path></svg> );
const FemaleIcon = () => ( <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 text-pink-500"><circle cx="10" cy="7" r="4"></circle><path d="M10 11v10m-3-3h6"></path></svg> );
const PlusIcon = () => ( <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5 text-gray-400"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg> );
const CloseIcon = () => ( <svg className="shrink-0 size-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"></path><path d="m6 6 12 12"></path></svg> );


export function FilterSheet({ isOpen, onClose, filterData }: FilterSheetProps) {
    if (!isOpen) return null;

    return (
        // Overlay
        <div className="fixed inset-0 bg-black/50 z-99" onClick={onClose}>
            {/* Slide-over Panel */}
            <div 
                className="fixed top-0 right-0 h-full w-full max-w-sm bg-white shadow-lg z-50 p-6 flex flex-col"
                onClick={(e) => e.stopPropagation()}
            >
                <h2 className="text-xl font-bold text-center text-black uppercase mb-8">Select Filter</h2>

                <form className="space-y-6 flex-grow">
                    {/* Price Range */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-800 mb-2">Price Range</label>
                        <div className="flex items-center gap-4">
                            <input type="text" placeholder="Min amount" className="w-full rounded-lg border-gray-300 text-sm" />
                            <span className="text-gray-400">-</span>
                            <input type="text" placeholder="Max amount" className="w-full rounded-lg border-gray-300 text-sm" />
                        </div>
                    </div>

                    {/* Sex */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-800 mb-2">Sex</label>
                        <div className="space-y-3">
                            <div className="flex items-center">
                                <input id="sex-male" type="checkbox" className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                                <label htmlFor="sex-male" className="ml-3 flex items-center gap-2 text-sm text-gray-800"><MaleIcon /> Male</label>
                            </div>
                            <div className="flex items-center">
                                <input id="sex-female" type="checkbox" className="h-4 w-4 rounded border-gray-300 text-pink-600 focus:ring-pink-500" />
                                <label htmlFor="sex-female" className="ml-3 flex items-center gap-2 text-sm text-gray-800"><FemaleIcon /> Female</label>
                            </div>
                        </div>
                    </div>

                    {/* Breeder */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-800 mb-2">Breeder</label>
                        <div className="space-y-3">
                            {filterData.breeders.map(breeder => (
                                <div key={breeder.id} className="flex items-center">
                                    <input id={`breeder-${breeder.id}`} type="checkbox" className="h-4 w-4 rounded border-gray-300" />
                                    <label htmlFor={`breeder-${breeder.id}`} className="ml-3 text-sm text-gray-800">{breeder.name}</label>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Year */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-800 mb-2">Year</label>
                        <div className="space-y-3">
                             {filterData.years.map(year => (
                                <div key={year} className="flex items-center">
                                    <input id={`year-${year}`} type="checkbox" className="h-4 w-4 rounded border-gray-300" />
                                    <label htmlFor={`year-${year}`} className="ml-3 text-sm text-gray-800">{year}</label>
                                </div>
                            ))}
                        </div>
                    </div>
                    
                    {/* Morph */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-800 mb-2">Morph</label>
                        <div className="relative">
                            <input type="text" placeholder="Add" className="w-full rounded-lg border-gray-300 text-sm pr-10" />
                            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                                <PlusIcon />
                            </div>
                        </div>
                    </div>

                    {/* Status */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-800 mb-2">Status</label>
                        <div className="space-y-3">
                            <div className="flex items-center">
                                <input id="status-available" type="checkbox" className="h-4 w-4 rounded border-gray-300" />
                                <label htmlFor="status-available" className="ml-3 flex items-center gap-2 text-sm text-gray-800">
                                    <span className="h-3 w-3 bg-green-500 rounded-full"></span>
                                    Available
                                </label>
                            </div>
                            <div className="flex items-center">
                                <input id="status-onhold" type="checkbox" className="h-4 w-4 rounded border-gray-300" />
                                <label htmlFor="status-onhold" className="ml-3 flex items-center gap-2 text-sm text-gray-800">
                                    <span className="h-3 w-3 bg-yellow-500 rounded-full"></span>
                                    On Hold
                                </label>
                            </div>
                        </div>
                    </div>
                </form>
                
                {/* Action Buttons */}
                <div className="grid grid-cols-2 gap-4 mt-auto pt-6">
                    <SecondaryButton href="#" onClick={(e) => { e.preventDefault(); /* Logic การ Reset filter */ }}>Reset</SecondaryButton>
                    <PrimaryButton href="#" onClick={(e) => { e.preventDefault(); onClose(); }}>Done</PrimaryButton>
                </div>
            </div>
        </div>
    );
}
