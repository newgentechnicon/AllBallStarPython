// src/app/(auth)/products/[productId]/page.tsx

import { notFound } from 'next/navigation';
import { getProductById } from '@/features/product/product.services';
import { ProductShopDetailView } from '@/features/product/components/product-shop-detail-view';
import { getFarmById } from '@/features/farm/farm.services'; // [แก้ไข] import ฟังก์ชันใหม่

type ProductDetailPageProps = {
  params: { productId: string }; // [แก้ไข] แก้ไข Type ของ params
};

export const dynamic = 'force-dynamic';

export default async function ProductDetailPage({ params }: ProductDetailPageProps) {
  const productId = Number(params.productId); // [แก้ไข] เข้าถึง productId ได้โดยตรง

  if (isNaN(productId)) {
    notFound();
  }
  
  const product = await getProductById(productId);

  if (!product) {
    notFound();
  }

  // [แก้ไข] ดึงข้อมูลฟาร์มด้วยฟังก์ชันใหม่
  const farm = await getFarmById(product.farm_id ?? 0);

  // ถ้าสินค้ามี farm_id แต่หาฟาร์มไม่เจอ ให้แสดง 404
  if (!farm) {
    notFound();
  }

  // [แก้ไข] ส่ง props เป็น object เดียว
  return <ProductShopDetailView product={product} farm={farm} />;
}