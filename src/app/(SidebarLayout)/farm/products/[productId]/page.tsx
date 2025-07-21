import { createClient } from '@/lib/supabase/server';
import { notFound } from 'next/navigation';
import ProductDetailView from './ProductDetailView'; 

export const dynamic = 'force-dynamic';

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ productId: string }>; // หรือถ้าใช้ type ที่ Next.js กำหนด
}) {
  const resolvedParams = await params; // await ที่นี่
  const productId = Number(resolvedParams.productId);

  if (isNaN(productId)) {
    notFound();
  }

  // สร้าง client supabase
  const supabase = await createClient();

  // โหลดข้อมูลสินค้าโดยใช้ productId
  const { data: product, error } = await supabase
    .from('products')
    .select(`*,
      farms (name, logo_url),
      product_morphs (
        morphs (
          name,
          morph_categories (name, color_hex),
          morph_sub_categories (name, color_hex)
        )
      )
    `)
    .eq('id', productId)
    .single();

  if (error || !product) {
    notFound();
  }

  return <ProductDetailView product={product} />;
}
