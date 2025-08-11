import {
  getAllProducts,
  getShopFilterData,
  getStructuredMorphs,
} from "@/features/product/product.services";
import { ShopView } from "@/features/product/components/shop-view";
import { Suspense } from "react";

type ShopPageProps = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
};

export const dynamic = "force-dynamic";

export default async function ShopPage({ searchParams }: ShopPageProps) {

  const rawSearchParams = await searchParams;

  const filters = {
    q: Array.isArray(rawSearchParams.q) ? rawSearchParams.q[0] : rawSearchParams.q ?? '',
    sex: Array.isArray(rawSearchParams.sex) ? rawSearchParams.sex : rawSearchParams.sex ? [rawSearchParams.sex] : [],
    breeders: Array.isArray(rawSearchParams.breeders) ? rawSearchParams.breeders : rawSearchParams.breeders ? [rawSearchParams.breeders] : [],
    years: Array.isArray(rawSearchParams.years) ? rawSearchParams.years : rawSearchParams.years ? [rawSearchParams.years] : [],
    productStatus: Array.isArray(rawSearchParams.productStatus) ? rawSearchParams.productStatus : rawSearchParams.productStatus ? [rawSearchParams.productStatus] : [],
    morphs: Array.isArray(rawSearchParams.morphs) ? rawSearchParams.morphs : rawSearchParams.morphs ? [rawSearchParams.morphs] : [],
  };

  const [products, filterData, allMorphs] = await Promise.all([
    getAllProducts(filters),
    getShopFilterData(),
    getStructuredMorphs(),
  ]);

  return (
    <Suspense
      fallback={
        <div className="bg-white text-black text-center p-10">
          Loading Products...
        </div>
      }
    >
      <ShopView
        products={products}
        filterData={filterData}
        allMorphs={allMorphs}
      />
    </Suspense>
  );
}
