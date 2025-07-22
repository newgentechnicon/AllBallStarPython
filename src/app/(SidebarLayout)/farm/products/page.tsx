'use client';

import { useState, useEffect} from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { ProductTable } from './_components/ProductTable';
import type { Product } from '@/types/Product';
import SearchBox from './_components/SearchBox';
import Tabs from './_components/Tab'; // 1. Import Tabs component
import type { IStaticMethods } from 'preline/preline'; // 1. Import type ของ Preline
import type { Farm } from '@/lib/data/farm'; // 1. Import Farm type

// 2. ประกาศ global type สำหรับ window
declare global {
  interface Window {
    HSStaticMethods: IStaticMethods;
  }
}

// --- SVG Icons ---
const UserIcon = ({ ...props }) => ( <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg> );
const SnakeIcon = ({ ...props }) => ( <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" fill="none"><path stroke="#E5E7EB" strokeLinecap="round" strokeLinejoin="round" strokeWidth="8" d="M141.12 153.96S171.25 128.6 171.25 99.3s-26.24-55.2-59.9-55.2c-33.67 0-63.8 28.14-63.8 57.44s24.38 52.93 56.18 52.93c31.8 0 54.5-27.06 54.5-27.06" opacity="0.5"></path><path stroke="#E5E7EB" strokeLinecap="round" strokeLinejoin="round" strokeWidth="8" d="M149.86 126.9c-2.4-5.2-7.2-11.6-14.4-12.4-7.2-.8-12 4.4-12.8 10.8s2.4 13.2 9.6 14c7.2.8 12.8-2.8 14.4-9.2Z" opacity="0.5"></path></svg> );

const Pagination = ({ currentPage, totalPages, totalCount, itemsPerPage }: { currentPage: number; totalPages: number; totalCount: number; itemsPerPage: number; }) => {
    const startItem = totalCount > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0;
    const endItem = Math.min(currentPage * itemsPerPage, totalCount);
    const searchParams = useSearchParams();

    const createPageURL = (pageNumber: number) => {
        const params = new URLSearchParams(searchParams);
        params.set('page', pageNumber.toString());
        return `/farm/products?${params.toString()}`;
    };

    return (
        <div className="flex items-center justify-between border-t border-gray-200 pt-4">
            <div><p className="text-sm text-gray-700">{startItem} - {endItem} from {totalCount}</p></div>
            <div className="flex items-center gap-2">
                <Link href={createPageURL(currentPage - 1)} className={`rounded border p-1.5 ${currentPage <= 1 ? 'pointer-events-none text-gray-300' : 'text-gray-600 hover:bg-gray-100'}`}>&lt;</Link>
                <span className="rounded border bg-gray-200 px-3 py-1.5 text-sm font-semibold">{currentPage}</span>
                <span className="text-sm text-gray-600">of {totalPages}</span>
                <Link href={createPageURL(currentPage + 1)} className={`rounded border p-1.5 ${currentPage >= totalPages ? 'pointer-events-none text-gray-300' : 'text-gray-600 hover:bg-gray-100'}`}>&gt;</Link>
            </div>
        </div>
    );
};

export default function ProductsPage() {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const supabase = createClient();
    const { user } = useAuth();

    const [farm, setFarm] = useState<Farm | null>(null);
    const [products, setProducts] = useState<Product[]>([]);
    const [totalCount, setTotalCount] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const [statusCounts, setStatusCounts] = useState({ All: 0, Available: 0, 'On Hold': 0 });

    const currentPage = Number(searchParams.get('page')) || 1;
    const currentQuery = searchParams.get('q') || '';
    const currentStatus = searchParams.get('status') || 'All';
    const ITEMS_PER_PAGE = 10;

    useEffect(() => {
        const fetchData = async () => {
            if (user) {
                setIsLoading(true);
                
                const { data: farmData, error: farmError } = await supabase.from('farms').select('*').eq('user_id', user.id).single();
                if (farmError || !farmData) {
                    router.push('/farm/create');
                    return;
                }
                setFarm(farmData);

                // --- Fetch Counts for Tabs ---
                const { count: allCount } = await supabase.from('products').select('*', { count: 'exact', head: true }).eq('farm_id', farmData.id);
                const { count: availableCount } = await supabase.from('products').select('*', { count: 'exact', head: true }).eq('farm_id', farmData.id).eq('status', 'Available');
                const { count: onHoldCount } = await supabase.from('products').select('*', { count: 'exact', head: true }).eq('farm_id', farmData.id).eq('status', 'On Hold');
                setStatusCounts({ All: allCount || 0, Available: availableCount || 0, 'On Hold': onHoldCount || 0});

                // --- Fetch Products Data ---
                const from = (currentPage - 1) * ITEMS_PER_PAGE;
                const to = from + ITEMS_PER_PAGE - 1;

                let query = supabase.from('products').select(`*, product_morphs(morphs(name))`, { count: 'exact' }).eq('farm_id', farmData.id);
                if (currentQuery) query = query.ilike('name', `%${currentQuery}%`);
                if (currentStatus !== 'All') query = query.eq('status', currentStatus);
                
                const { data: productsData, count, error } = await query.order('created_at', { ascending: false }).range(from, to);

                if(error) console.error("Error fetching products:", error);
                setTotalCount(count || 0);
                setProducts(productsData as Product[] || []);
                
                setIsLoading(false);
            }
        };
        fetchData();
    }, [user, currentPage, searchParams, router, supabase, currentQuery, currentStatus]);

    // 3. เพิ่ม useEffect เพื่อ re-initialize Preline
    useEffect(() => {
        // ใช้ setTimeout เพื่อให้แน่ใจว่า DOM ได้ render เสร็จเรียบร้อยแล้ว
        setTimeout(() => {
            if (window.HSStaticMethods) {
                window.HSStaticMethods.autoInit();
            }
        }, 100);
    }, [products, isLoading]); // ทำงานทุกครั้งที่ข้อมูลสินค้าเปลี่ยน หรือโหลดเสร็จ

    const handleTabSelect = (key: string) => {
        const params = new URLSearchParams(searchParams);
        params.set('page', '1');
        if (key === 'All') {
            params.delete('status');
        } else {
            params.set('status', key);
        }
        router.push(`${pathname}?${params.toString()}`);
    };
    
    const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE);
    
    const tabs = [
        { label: 'All', count: statusCounts.All, key: 'All' },
        { label: 'Available', count: statusCounts.Available, key: 'Available' },
        { label: 'On Hold', count: statusCounts['On Hold'], key: 'On Hold' },
    ];

    if (isLoading && !farm) {
        return <div className="flex h-screen items-center justify-center">Loading...</div>;
    }
    
    if (!farm) {
        return null;
    }

    const fetchStatusCounts = async (farmId: number) => {
    const { count: allCount } = await supabase
        .from('products')
        .select('*', { count: 'exact', head: true })
        .eq('farm_id', farmId);

    const { count: availableCount } = await supabase
        .from('products')
        .select('*', { count: 'exact', head: true })
        .eq('farm_id', farmId)
        .eq('status', 'Available');

    const { count: onHoldCount } = await supabase
        .from('products')
        .select('*', { count: 'exact', head: true })
        .eq('farm_id', farmId)
        .eq('status', 'On Hold');

    setStatusCounts({
        All: allCount || 0,
        Available: availableCount || 0,
        'On Hold': onHoldCount || 0,
    });
    };

    return (
        <div className="bg-neutral-100 min-h-screen">
            <div className="container mx-auto max-w-4xl pb-6">
                <div className="bg-white pt-6">
                    <nav className="flex text-sm text-gray-500 px-4">
                        <Link href="/farm" className="hover:underline">Home</Link>
                        <span className="mx-2">/</span>
                        <span className="font-medium text-gray-700">Farm</span>
                    </nav>
                    <div className="mt-4 flex items-center gap-4 border-b border-gray-200 pb-6 px-4">
                        <div className="relative h-16 w-16 flex-shrink-0">
                            <Image src={farm.logo_url || '/images/logo-placeholder.png'} alt="Farm Logo" layout="fill" className="rounded-full object-cover" />
                        </div>
                        <div>
                            <h1 className="text-xl font-bold text-gray-800">{farm.name}</h1>
                            <div className="mt-1 flex items-center gap-1.5 text-gray-500"><UserIcon className="h-4 w-4" /><span className="text-sm font-medium">0</span></div>
                        </div>
                    </div>
                    <div className="mt-6 flex items-center justify-between px-4">
                        <h2 className="text-lg font-bold text-gray-800">All Product ({totalCount})</h2>
                        <Link href="/farm/products/create" className="rounded-lg bg-gray-700 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800">Add Product</Link>
                    </div>
                </div>
                
                <div className="px-4">
                    <div className="mt-4 rounded-lg bg-white p-4 shadow">
                        {/* 2. เรียกใช้ Tabs component ที่นี่ */}
                        <div className="border-b border-gray-200">
                            <Tabs tabs={tabs} selectedTab={currentStatus} onSelect={handleTabSelect} />
                        </div>
                        <div className="mt-4">
                            <SearchBox/>
                        </div>
                        <div className="mt-2">
                            {isLoading ? (
                                <div className="flex justify-center py-12">Loading products...</div>
                            ) : totalCount === 0 ? (
                                <div className="flex flex-col items-center justify-center py-12 text-center">
                                    <SnakeIcon className="h-24 w-24" />
                                    <p className="mt-4 font-medium text-gray-500">
                                        {searchParams.get('q') || searchParams.get('status') ? 'No products found.' : "You haven't added any product yet."}
                                    </p>
                                </div>
                            ) : (
                                <>
                                    <ProductTable products={products as Product[] || []} farm={farm} onStatusUpdated={() => fetchStatusCounts(farm.id)}/>
                                    <div className="p-4">
                                        <Pagination currentPage={currentPage} totalPages={totalPages} totalCount={totalCount} itemsPerPage={ITEMS_PER_PAGE} />
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}