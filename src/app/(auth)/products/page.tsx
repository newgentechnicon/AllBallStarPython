import { getAllProducts, getShopFilterData } from '@/features/product/product.services';
import { ShopView } from '@/features/product/components/shop-view';
import { Suspense } from 'react';

export const dynamic = 'force-dynamic';

export default async function ShopPage() {
  const [products, filterData] = await Promise.all([
    getAllProducts(),
    getShopFilterData()
  ]);

  return (
    <Suspense fallback={<div className="bg-white text-black text-center p-10">Loading Products...</div>}>
      <ShopView products={products} filterData={filterData} />
    </Suspense>
  );
}
