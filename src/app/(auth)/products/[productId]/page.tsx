// src/app/(auth)/products/[productId]/page.tsx

import { notFound } from 'next/navigation';
import { getProductById } from '@/features/product/product.services';
import { ProductShopDetailView } from '@/features/product/components/product-shop-detail-view';
import { getFarmById } from '@/features/farm/farm.services';

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

  const farm = await getFarmById(product.farm_id ?? 0);

  if (!farm) {
    notFound();
  }

  return <ProductShopDetailView product={product} farm={farm} />;
}