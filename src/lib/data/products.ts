import 'server-only';
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import type { Farm } from './farm';
import type { Product } from '@/types/Product'; // แก้ไข path ตามที่คุณเก็บ type

export interface ProductsPageData {
  farm: Farm;
  products: Product[];
  totalCount: number;
  statusCounts: { All: number; Available: number; 'On Hold': number };
}

export async function getProductsPageData(
  searchParams: { [key: string]: string | string[] | undefined }
): Promise<ProductsPageData> {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) { redirect('/login'); }

  const { data: farm, error: farmError } = await supabase.from('farms').select('*').eq('user_id', user.id).single();
  if (farmError || !farm) { redirect('/farm/create'); }

  const getFirstParam = (param: string | string[] | undefined): string => {
    if (Array.isArray(param)) {
      return param[0] || '';
    }
    return param || '';
  };

  const currentPage = Number(getFirstParam(searchParams.page)) || 1;
  const currentQuery = getFirstParam(searchParams.q);
  const currentStatus = getFirstParam(searchParams.status) || 'All';
  const ITEMS_PER_PAGE = 10;
  const from = (currentPage - 1) * ITEMS_PER_PAGE;
  const to = from + ITEMS_PER_PAGE - 1;

  // Base query for reuse
  const baseCountQuery = (status?: string) => {
    let query = supabase.from('products')
      .select('id', { count: 'exact', head: true })
      .eq('farm_id', farm.id)
      .is('deleted_at', null);
    if (status) {
      query = query.eq('status', status);
    }
    return query;
  };
  
  // Main products query
  let productsDataQuery = supabase
    .from('products')
    .select(`*, product_morphs(morphs(name))`, { count: 'exact' })
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
    baseCountQuery(),
    baseCountQuery('Available'),
    baseCountQuery('On Hold'),
    productsDataQuery.order('created_at', { ascending: false }).range(from, to)
  ]);

  const statusCounts = {
    All: allResult.count || 0,
    Available: availableResult.count || 0,
    'On Hold': onHoldResult.count || 0,
  };

  const products = (productsResult.data as Product[]) || [];
  const totalCount = productsResult.count || 0;

  return { farm, products, totalCount, statusCounts };
}