import 'server-only';
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import type { ProductsPageData, ProductWithMorphs } from './product.types';

/**
 * ดึงข้อมูลทั้งหมดที่จำเป็นสำหรับหน้าแสดงรายการสินค้า
 * @param searchParams - Object ของ search parameters จาก URL
 * @returns Promise<ProductsPageData> ข้อมูลสำหรับแสดงผล
 */
export async function getProductsPageData(
  searchParams: { [key: string]: string | string[] | undefined }
): Promise<ProductsPageData> {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  const { data: farm, error: farmError } = await supabase.from('farms').select('*').eq('user_id', user.id).single();
  if (farmError || !farm) redirect('/farm/create');

  const getFirstParam = (param: string | string[] | undefined): string =>
    Array.isArray(param) ? param[0] || '' : param || '';

  const currentPage = Number(getFirstParam(searchParams.page)) || 1;
  const currentQuery = getFirstParam(searchParams.q);
  const currentStatus = getFirstParam(searchParams.status) || 'All';
  const ITEMS_PER_PAGE = 10;
  const from = (currentPage - 1) * ITEMS_PER_PAGE;
  const to = from + ITEMS_PER_PAGE - 1;

  const baseCountQuery = (status?: string) => {
    let query = supabase.from('products')
      .select('id', { count: 'exact', head: true })
      .eq('farm_id', farm.id)
      .is('deleted_at', null);
    if (status && status !== 'All') { // ปรับเงื่อนไข
      query = query.eq('status', status);
    }
    return query;
  };
  
  let productsDataQuery = supabase
    .from('products')
    .select(`*, product_morphs(morphs(*))`) // Query morphs ทั้งหมด
    .eq('farm_id', farm.id)
    .is('deleted_at', null);

  if (currentQuery) productsDataQuery = productsDataQuery.ilike('name', `%${currentQuery}%`);
  if (currentStatus !== 'All') productsDataQuery = productsDataQuery.eq('status', currentStatus);

  const [
    allResult,
    availableResult,
    onHoldResult,
    productsResult
  ] = await Promise.all([
    baseCountQuery('All'),
    baseCountQuery('Available'),
    baseCountQuery('On Hold'),
    productsDataQuery.order('created_at', { ascending: false }).range(from, to)
  ]);

  return {
    farm,
    products: (productsResult.data as ProductWithMorphs[]) || [],
    totalCount: productsResult.count || 0,
    statusCounts: {
      All: allResult.count || 0,
      Available: availableResult.count || 0,
      'On Hold': onHoldResult.count || 0,
    },
  };
}