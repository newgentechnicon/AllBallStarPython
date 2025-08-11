import {
  getAllProducts,
  getShopFilterData,
  getStructuredMorphs,
} from "@/features/product/product.services";
import { ShopView } from "@/features/product/components/shop-view";
import { Suspense } from "react";

type ShopPageProps = {
  searchParams: { [key: string]: string | string[] | undefined };
};

export const dynamic = "force-dynamic";

export default async function ShopPage({ searchParams }: ShopPageProps) {

  const filters = {
    q: searchParams.q as string,
    sex: Array.isArray(searchParams.sex)
      ? searchParams.sex
      : searchParams.sex
      ? [searchParams.sex]
      : [],
    breeders: Array.isArray(searchParams.breeders)
      ? searchParams.breeders
      : searchParams.breeders
      ? [searchParams.breeders]
      : [],
    years: Array.isArray(searchParams.years)
      ? searchParams.years
      : searchParams.years
      ? [searchParams.years]
      : [],
    productStatus: Array.isArray(searchParams.productStatus)
      ? searchParams.productStatus
      : searchParams.productStatus
      ? [searchParams.productStatus]
      : [],
    morphs: Array.isArray(searchParams.morphs)
      ? searchParams.morphs
      : searchParams.morphs
      ? [searchParams.morphs]
      : [],
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
