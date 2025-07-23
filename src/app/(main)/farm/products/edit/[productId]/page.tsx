import { notFound } from 'next/navigation';
import { getProductById, getStructuredMorphs } from '@/features/product/product.services';
import { EditProductView } from '@/features/product/components/edit-product-view';

type EditProductPageProps = {
  params: { productId: string };
  searchParams: { [key: string]: string | string[] | undefined };
};

export const dynamic = 'force-dynamic';

export default async function EditProductPage({ params }: EditProductPageProps) {
  const productId = Number(params.productId);
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
