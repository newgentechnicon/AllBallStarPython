import "server-only";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import type { ProductsPageData, ProductWithMorphs } from "./product.types";
import type { ProductDetail } from "./product.types";

interface ProductFilters {
  q?: string;
  sex?: string[];
  breeders?: string[];
  years?: string[];
  productStatus?: string[];
  morphs?: string[];
  minPrice?: string;
  maxPrice?: string;
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

  // 3. ดึงข้อมูล "จำนวน" สำหรับ Tabs (ส่วนนี้ทำงานถูกต้องอยู่แล้ว)
  const fetchCount = async (status?: "Available" | "On Hold") => {
    let query = supabase
      .from("products")
      .select("id", { count: "exact", head: true })
      .eq("farm_id", farm.id)
      .is("deleted_at", null);
    if (status) query = query.eq("status", status);
    const { count } = await query;
    return count || 0;
  };
  const [allCount, availableCount, onHoldCount] = await Promise.all([
    fetchCount(),
    fetchCount("Available"),
    fetchCount("On Hold"),
  ]);
  const statusCounts = {
    All: allCount,
    Available: availableCount,
    "On Hold": onHoldCount,
  };

  // ✅ 4. [แก้ไข] สร้าง Query สำหรับดึง "ข้อมูลหลัก" ใหม่ทั้งหมด

  // เริ่มจาก base query
  let query = supabase
    .from("products")
    .select("*, product_morphs(morphs(*))", { count: "exact" });

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
    products: (data as ProductWithMorphs[]) || [],
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
export async function getStructuredMorphs() {
  const supabase = await createClient();
  const { data, error } = await supabase.rpc("get_morphs_structured");
  console.log('get_morphs_structured : ' + data)
  if (error) {
    console.error("Error fetching structured morphs:", error);
    return [];
  }
  return data;
}

export async function getAllProducts(
  filters: ProductFilters = {}
): Promise<ProductWithMorphs[]> {
  const supabase = await createClient();

  let query = supabase
    .from("products")
    .select(
      `
      *,
      farms ( name, logo_url ),
      product_morphs!inner (
        morphs!inner ( id, name )
      )
    `
    )
    .is("deleted_at", null)
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

  const { data: products, error } = await query;

  if (error) {
    console.error("Error fetching filtered products:", error);
    return [];
  }

  return products as ProductWithMorphs[];
}

/**
 * Fetches data required for the shop filter options.
 */
export async function getShopFilterData() {
  const supabase = await createClient();

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
  const years = [...new Set(yearsData.map((p) => p.year).filter(Boolean))].sort(
    (a, b) => b.localeCompare(a)
  );

  return { breeders: breeders || [], years };
}
