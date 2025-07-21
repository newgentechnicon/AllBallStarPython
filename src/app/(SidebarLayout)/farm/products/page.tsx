import Link from 'next/link';
import Image from 'next/image';
import { Suspense } from 'react';
import { getProductsPageData } from '@/lib/data/products';

import SearchBox from './_components/SearchBox';
import Tabs from './_components/Tab';
import { ProductTable } from './_components/ProductTable';
import Pagination from './_components/Pagination';
import { PrelineScript } from '@/components/PrelineScript';

const UserIcon = ({ ...props }) => ( <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg> );
const SnakeIcon = ({ ...props }) => ( <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" fill="none"><path stroke="#E5E7EB" strokeLinecap="round" strokeLinejoin="round" strokeWidth="8" d="M141.12 153.96S171.25 128.6 171.25 99.3s-26.24-55.2-59.9-55.2c-33.67 0-63.8 28.14-63.8 57.44s24.38 52.93 56.18 52.93c31.8 0 54.5-27.06 54.5-27.06" opacity="0.5"></path><path stroke="#E5E7EB" strokeLinecap="round" strokeLinejoin="round" strokeWidth="8" d="M149.86 126.9c-2.4-5.2-7.2-11.6-14.4-12.4-7.2-.8-12 4.4-12.8 10.8s2.4 13.2 9.6 14c7.2.8 12.8-2.8 14.4-9.2Z" opacity="0.5"></path></svg> );

export default async function ProductsPage({ searchParams }: { searchParams: { [key: string]: string | string[] | undefined }}) {
  const { farm, products, totalCount, statusCounts } = await getProductsPageData(searchParams);

  const rawStatus = searchParams.status;

  const currentStatus = Array.isArray(rawStatus) ? rawStatus[0] : rawStatus || 'All';
  const tabs = [
    { label: 'All', count: statusCounts.All, key: 'All' },
    { label: 'Available', count: statusCounts.Available, key: 'Available' },
    { label: 'On Hold', count: statusCounts['On Hold'], key: 'On Hold' },
  ];

  return (
    <>
      <div className="bg-neutral-100 min-h-screen">
        <div className="container mx-auto max-w-4xl pb-6">
          <div className="bg-white pt-6">
            {/* Header Section */}
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
              <h2 className="text-lg font-bold text-gray-800">All Products ({totalCount})</h2>
              <Link href="/farm/products/create" className="rounded-lg bg-gray-700 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800">Add Product</Link>
            </div>
          </div>
          
          <div className="px-4">
            <div className="mt-4 rounded-lg bg-white p-4 shadow">
              <div className="border-b border-gray-200">
                <Tabs tabs={tabs} currentStatus={currentStatus} />
              </div>
              <div className="mt-4">
                <Suspense>
                  <SearchBox placeholder="Search by name..." />
                </Suspense>
              </div>
              <div className="mt-2">
                {products.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <SnakeIcon className="h-24 w-24" />
                    <p className="mt-4 font-medium text-gray-500">
                      {searchParams.q || searchParams.status ? 'No products found.' : "You haven't added any product yet."}
                    </p>
                  </div>
                ) : (
                  <>
                    <ProductTable products={products} farm={farm} />
                    <div className="p-4">
                      <Pagination totalCount={totalCount} />
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      <PrelineScript />
    </>
  );
}