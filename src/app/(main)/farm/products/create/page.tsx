import { getStructuredMorphs } from '@/features/product/product.services';
import { CreateProductView } from '@/features/product/components/create-product-view';

export const dynamic = 'force-dynamic';

export default async function CreateProductPage() {
  // Fetch data needed for the form on the server
  const allMorphs = await getStructuredMorphs();

  return <CreateProductView allMorphs={allMorphs} />;
}