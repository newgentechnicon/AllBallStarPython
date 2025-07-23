import { notFound } from 'next/navigation';
import { getProductById } from '@/features/product/product.services';
import { ProductDetailView } from '@/features/product/components/product-detail-view';

type ProductDetailPageProps = {
  params: Promise<{ productId: string }>;
};

export const dynamic = 'force-dynamic';

export default async function ProductDetailPage({ params }: ProductDetailPageProps) {
  const productId = Number((await params).productId);

  if (isNaN(productId)) {
    notFound();
  }
  
  const product = await getProductById(productId);

  if (!product) {
    notFound();
  }

  return <ProductDetailView product={product} />;
}