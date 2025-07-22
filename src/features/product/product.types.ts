import type { Tables } from '@/types/database.types';
import type { Farm } from '@/features/farm/farm.types';

// สร้าง Type ของ Product จาก `Tables<'products'>`
// และเพิ่มความสัมพันธ์ของ morphs ที่เราต้องการ query
export type ProductWithMorphs = Tables<'products'> & {
  product_morphs: Array<{
    morphs: Tables<'morphs'> | null;
  }>;
};

// Type สำหรับข้อมูลทั้งหมดที่จำเป็นในหน้าแสดงรายการสินค้า
export interface ProductsPageData {
  farm: Farm;
  products: ProductWithMorphs[];
  totalCount: number;
  statusCounts: { All: number; Available: number; 'On Hold': number };
}