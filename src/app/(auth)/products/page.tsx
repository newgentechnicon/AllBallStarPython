import { getAllProducts } from '@/features/product/product.services';
import { ShopView } from '@/features/product/components/shop-view';
import { Suspense } from 'react';

export const dynamic = 'force-dynamic';

export default async function ShopPage() {
  const products = await getAllProducts();

  return (
    <Suspense fallback={<div className="bg-white text-black text-center p-10">Loading Products...</div>}>
      <ShopView products={products} />
    </Suspense>
  );
}
