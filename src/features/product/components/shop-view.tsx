'use client';

import type { ProductWithMorphs } from "@/features/product/product.types";
import { Navbar } from "@/components/ui/Navbar-white";
import { Footer } from "@/components/ui/Footer";
import { ProductCard } from "./product-card";
import { ShopHeader } from "./shop-header";
import { MorphCategory } from "./morph-selector";

interface FilterData {
    breeders: { id: number; name: string }[];
    years: string[];
}

interface ShopViewProps {
  products: ProductWithMorphs[];
  filterData: FilterData;
  allMorphs: MorphCategory[];
}

export function ShopView({ products, filterData, allMorphs }: ShopViewProps) {
  return (
    <div className=" text-black bg-white ">
      <Navbar />
      <main className="pt-24 container mx-auto px-4 pb-16 max-w-7xl">
        <ShopHeader totalItems={products.length} filterData={filterData} allMorphs={allMorphs} />

        {/* Products Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4 mt-6 ">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
}
