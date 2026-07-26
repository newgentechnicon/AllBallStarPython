import "server-only";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/server";
import { getSupabaseEnv } from "@/lib/supabase/env";
import type { Database } from "@/lib/database.types";
import { unstable_cache } from "next/cache";
import { redirect } from "next/navigation";
import type { ProductsPageData, ProductWithMorphs, PublicProductsPageData } from "./product.types";
import type { ProductDetail } from "./product.types";
import type { MorphCategory } from "./components/morph-selector";

interface ProductFilters {
  q?: string;
  sex?: string[];
  breeders?: string[];
  years?: string[];
  productStatus?: string[];
  morphs?: string[];
  minPrice?: string;
  maxPrice?: string;
  page?: string | string[];
}

export const PUBLIC_PRODUCTS_PER_PAGE = 24;
const SHOP_FILTER_DATA_TAG = "shop-filter-data";
const MORPH_FILTER_DATA_TAG = "morph-filter-data";

function createCachedPublicClient() {
  const { supabaseUrl, supabaseKey } = getSupabaseEnv();

  return createSupabaseClient<Database>(supabaseUrl, supabaseKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}

/**
 * ดึงข้อมูลทั้งหมดที่จำเป็นสำหรับหน้าแสดงรายการสินค้า
 * @param searchParams - Object ของ search parameters จาก URL
 * @returns Promise<ProductsPageData> ข้อมูลสำหรับแสดงผล
 */
export async function getProductsPageData(params: {
  page: string | string[];
  q: string | string[];
  status: string | string[];
}): Promise<ProductsPageData> {
  const supabase = await createClient();

  // 1. ตรวจสอบ User และ Farm
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: farm, error: farmError } = await supabase
    .from("farms")
    .select("*")
    .eq("user_id", user.id)
    .single();
  if (farmError || !farm) redirect("/farm/create");

  // 2. จัดการ Search Parameters
  const currentPage = Number(
    Array.isArray(params.page) ? params.page[0] : params.page
  );
  const currentQuery = Array.isArray(params.q) ? params.q[0] : params.q;
  const currentStatus = Array.isArray(params.status)
    ? params.status[0]
    : params.status;
  const ITEMS_PER_PAGE = 10;
  const from = (currentPage - 1) * ITEMS_PER_PAGE;
  const to = from + ITEMS_PER_PAGE - 1;

  const { data: statusCountRows, error: statusCountError } = await supabase.rpc(
    "get_product_status_counts",
    { p_farm_id: farm.id }
  );
  if (statusCountError) {
    console.error("Product status count fetch error:", statusCountError);
  }
  const statusCounts = {
    All: 0,
    Available: 0,
    "On Hold": 0,
  };
  for (const row of statusCountRows ?? []) {
    if (row.status === "All" || row.status === "Available" || row.status === "On Hold") {
      statusCounts[row.status] = Number(row.total);
    }
  }

  // ✅ 4. [แก้ไข] สร้าง Query สำหรับดึง "ข้อมูลหลัก" ใหม่ทั้งหมด

  // เริ่มจาก base query
  let query = supabase
    .from("products")
    .select("id, name, status, product_id, sex, price, image_urls", { count: "exact" });

  // ใส่ Filter ที่ต้องมีเสมอ
  query = query.eq("farm_id", farm.id);
  query = query.is("deleted_at", null);

  // ใส่ Filter ตามเงื่อนไข (Search)
  if (currentQuery) {
    query = query.ilike("name", `%${currentQuery}%`);
  }

  // ใส่ Filter ตามเงื่อนไข (Status) - จุดสำคัญ
  if (currentStatus !== "All") {
    query = query.eq("status", currentStatus);
  }

  // สั่งเรียงข้อมูล, แบ่งหน้า, และดึงข้อมูลสุดท้าย
  const {
    data,
    error,
    count: totalCount,
  } = await query.order("created_at", { ascending: false }).range(from, to);

  if (error) {
    console.error("Product data fetch error:", error);
  }

  return {
    farm,
    products: (data ?? []) as unknown as ProductWithMorphs[],
    // totalCount นี้จะเปลี่ยนไปตาม filter (status/search) ซึ่งถูกต้องแล้วสำหรับการคำนวณ totalPages
    totalCount: totalCount || 0,
    // statusCounts ใช้สำหรับแสดงตัวเลขบนป้าย Tab แต่ละอัน
    statusCounts,
  };
}

/**
 * Fetches a single product's detailed information by its ID.
 * @param productId - The ID of the product.
 * @returns {Promise<ProductDetail | null>} The product data or null if not found.
 */
export async function getProductById(
  productId: number
): Promise<ProductDetail | null> {
  const supabase = await createClient();

  const { data: product, error } = await supabase
    .from("products")
    .select(
      `*,
      farms (id, name, logo_url),
      product_morphs (
        morphs (
          id,
          name,
          morph_categories (name, color_hex),
          morph_sub_categories (name, color_hex)
        )
      )
    `
    )
    .eq("id", productId)
    .is("deleted_at", null)
    .single();

  if (error) {
    console.error("Error fetching product by ID:", error);
    return null;
  }

  return product as ProductDetail;
}

/**
 * Fetches all morphs, structured by category and sub-category.
 * @returns {Promise<any>} Structured morph data.
 */
const getCachedStructuredMorphs = unstable_cache(
  async (): Promise<MorphCategory[]> => {
  const supabase = createCachedPublicClient();
  const { data, error } = await supabase.rpc("get_morphs_structured");
  if (error) {
    console.error("Error fetching structured morphs:", error);
    return [];
  }
  return (data ?? []) as MorphCategory[];
  },
  ["structured-morphs"],
  { revalidate: 3600, tags: [MORPH_FILTER_DATA_TAG] }
);

export async function getStructuredMorphs(): Promise<MorphCategory[]> {
  return getCachedStructuredMorphs();
}

export async function getAllProducts(
  filters: ProductFilters = {}
): Promise<ProductWithMorphs[]> {
  const { products } = await getAllProductsPageData(filters);
  return products;
}

export async function getAllProductsPageData(
  filters: ProductFilters = {}
): Promise<PublicProductsPageData> {
  const supabase = await createClient();
  const currentPage = Math.max(
    1,
    Number(Array.isArray(filters.page) ? filters.page[0] : filters.page) || 1
  );
  const from = (currentPage - 1) * PUBLIC_PRODUCTS_PER_PAGE;
  const to = from + PUBLIC_PRODUCTS_PER_PAGE - 1;

  const needsMorphJoin = !!filters.morphs?.length;
  const selectColumns = needsMorphJoin
    ? `
      id,
      name,
      price,
      sex,
      year,
      image_urls,
      farms ( name, logo_url ),
      product_morphs!inner (
        morph_id,
        morphs!inner ( id, name )
      )
    `
    : `
      id,
      name,
      price,
      sex,
      year,
      image_urls,
      farms ( name, logo_url )
    `;

  let query = supabase
    .from("products")
    .select(selectColumns, { count: "exact" })
    .is("deleted_at", null)
    .neq("status", "Inactive")
    .neq("status", "Sold Out")
    .order("created_at", { ascending: false });

  if (filters.q) {
    query = query.ilike("name", `%${filters.q}%`);
  }
  if (filters.sex?.length) {
    query = query.in("sex", filters.sex);
  }
  if (filters.breeders?.length) {
    const breederIds = filters.breeders.map(Number).filter((id) => !isNaN(id));
    if (breederIds.length) {
      query = query.in("farm_id", breederIds);
    }
  }
  if (filters.years?.length) {
    query = query.in("year", filters.years);
  }
  if (filters.productStatus?.length) {
    query = query.in("status", filters.productStatus);
  }
  if (filters.morphs?.length) {
    const morphIds = filters.morphs
      .map((m) => Number(m))
      .filter((id) => !isNaN(id));

    const morphNames = filters.morphs
      .map((m) => (isNaN(Number(m)) ? String(m) : null))
      .filter((name): name is string => name !== null);

    if (morphIds.length) {
      query = query.in("product_morphs.morph_id", morphIds);
    }

    if (morphNames.length) {
      query = query.or(
        morphNames.map((name) => `name.ilike.%${name}%`).join(","),
        { foreignTable: "product_morphs.morphs" }
      );
    }
  }

  if (filters.minPrice) {
    const minPrice = Number(filters.minPrice);
    if (!isNaN(minPrice)) {
      query = query.gte('price', minPrice); // gte = Greater Than or Equal To
    }
  }
  if (filters.maxPrice) {
    const maxPrice = Number(filters.maxPrice);
    if (!isNaN(maxPrice)) {
      query = query.lte('price', maxPrice); // lte = Less Than or Equal To
    }
  }

  const { data: products, error, count } = await query.range(from, to);

  if (error) {
    console.error("Error fetching filtered products:", error);
    return { products: [], totalCount: 0 };
  }

  return {
    products: (products ?? []) as unknown as ProductWithMorphs[],
    totalCount: count ?? 0,
  };
}

/**
 * Fetches data required for the shop filter options.
 */
const getCachedShopFilterData = unstable_cache(
  async () => {
  const supabase = createCachedPublicClient();

  // Fetch distinct breeders (farms)
  const { data: breeders, error: breedersError } = await supabase
    .from("farms")
    .select("id, name");

  // Fetch distinct years from products
  const { data: yearsData, error: yearsError } = await supabase
    .from("products")
    .select("year")
    .is("deleted_at", null);

  if (breedersError || yearsError) {
    console.error("Error fetching filter data:", breedersError || yearsError);
    return { breeders: [], years: [] };
  }

  // Get unique, non-null years and sort them
  const years = [...new Set(yearsData.map((p) => p.year).filter((year): year is string => !!year))].sort(
    (a, b) => b.localeCompare(a)
  );

  return { breeders: breeders || [], years };
  },
  ["shop-filter-data"],
  { revalidate: 300, tags: [SHOP_FILTER_DATA_TAG] }
);

export async function getShopFilterData() {
  return getCachedShopFilterData();
}

export const shopFilterDataTag = SHOP_FILTER_DATA_TAG;
export const morphFilterDataTag = MORPH_FILTER_DATA_TAG;
