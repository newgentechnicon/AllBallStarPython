import { getProductsPageData } from '@/features/product/product.services';
import { ProductListView } from '@/features/product/components/product-list-view';
import { Suspense } from 'react';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

type FarmProductsPageProps = {
  searchParams: { [key: string]: string | string[] | undefined };
};

export default async function FarmProductsPage({ searchParams }: FarmProductsPageProps) {
  
  const currentPage = searchParams['page'] ?? '1';
  const currentQuery = searchParams['q'] ?? '';
  const currentStatus = searchParams['productStatus'] ?? 'All';

  console.log('currentStatus:', currentStatus);

  const pageData = await getProductsPageData({
    page: currentPage,
    q: currentQuery,
    status: currentStatus,
  });

  return (
    <Suspense fallback={<div>Loading page...</div>}>
      <ProductListView data={pageData} />
    </Suspense>
  );
}