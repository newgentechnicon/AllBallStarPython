import type { Tables } from '@/types/database.types';
import type { Farm } from '@/features/farm/farm.types';

// สร้าง Type ของ Product จาก `Tables<'products'>`
// และเพิ่มความสัมพันธ์ของ morphs ที่เราต้องการ query
export type ProductWithMorphs = Tables<'products'> & {
  farms: {
    name: string;
    logo_url: string;
  } | null;
  product_morphs: Array<{
    morphs: {
      name: string;
    } | null;
  }>;
};

// Type สำหรับข้อมูลทั้งหมดที่จำเป็นในหน้าแสดงรายการสินค้า
export interface ProductsPageData {
  farm: Farm;
  products: ProductWithMorphs[];
  totalCount: number;
  statusCounts: { All: number; Available: number; 'On Hold': number };
}

// Type for detailed product data
export type ProductDetail = Tables<'products'> & {
  farms: Pick<Tables<'farms'>, 'name' | 'logo_url'> | null;
  product_morphs: Array<{
    morphs: (Tables<'morphs'> & {
      morph_categories: Pick<Tables<'morph_categories'>, 'name' | 'color_hex'> | null;
      morph_sub_categories: Pick<Tables<'morph_sub_categories'>, 'name' | 'color_hex'> | null;
    }) | null;
  }>;
};

// Type for the create product form state
export interface CreateProductState {
  success?: boolean;
  message?: string;
  errors: {
    product_id?: string[];
    name?: string[];
    price?: string[];
    sex?: string[];
    year?: string[];
    description?: string[];
    morphs?: string[];
    images?: string[];
    _form?: string; 
  };
  fields?: { [key: string]: FormDataEntryValue | string[] };
}

// Type for the edit product form state
export interface EditProductState {
  success?: boolean;
  message?: string;
  errors: {
    name?: string[];
    price?: string[];
    sex?: string[];
    year?: string[];
    description?: string[];
    morphs?: string[];
    images?: string[];
    _form?: string; 
  };
  fields?: Partial<ProductDetail> & {
      morphs?: string[];
  };
}