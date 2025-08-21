// src/app/(auth)/products/[productId]/page.tsx

import { notFound } from 'next/navigation';
import { getProductById } from '@/features/product/product.services';
import { ProductShopDetailView } from '@/features/product/components/product-shop-detail-view';
import { getFarmById } from '@/features/farm/farm.services';
import { FarmContactInfo } from '@/features/farm/farm.types';

type ProductDetailPageProps = {
  params: Promise<{ productId: string }>;
};

export const dynamic = 'force-dynamic';

export default async function ProductDetailPage({ params }: ProductDetailPageProps) {
  const productId = Number((await params)['productId']); 
  

  if (isNaN(productId)) {
    notFound();
  }

  const product = await getProductById(productId);

  if (!product) {
    notFound();
  }


  const farmIds = new Set<number>();
  if (product.farm_id) {
    farmIds.add(product.farm_id);
  }
  farmIds.add(14);
  farmIds.add(18);
  const farmPromises = Array.from(farmIds).map(id => getFarmById(id));
  const farms = (await Promise.all(farmPromises))
    .filter((farm): farm is FarmContactInfo => farm !== null && farm !== undefined);

  if (!farms || farms.length === 0) {
    notFound();
  }

  return <ProductShopDetailView product={product} farms={farms} />;
}