import { notFound } from 'next/navigation';
import { getProductById, getStructuredMorphs } from '@/features/product/product.services';
import { EditProductView } from '@/features/product/components/edit-product-view';

type EditProductPageProps = {
  params: Promise<{ productId: string }>;
};

export const dynamic = 'force-dynamic';

export default async function EditProductPage({ params }: EditProductPageProps) {
  const productId = Number((await params).productId);
  if (isNaN(productId)) {
    notFound();
  }
  
  // Fetch both data sets in parallel for efficiency
  const [product, allMorphs] = await Promise.all([
    getProductById(productId),
    getStructuredMorphs()
  ]);

  if (!product) {
    notFound();
  }

  return <EditProductView product={product} allMorphs={allMorphs} />;
}
