'use client';

import type { ProductWithMorphs } from "@/features/product/product.types";
import { Navbar } from "@/components/ui/Navbar";
import { Footer } from "@/components/ui/Footer";
import { ProductCard } from "./product-card";
import { ShopHeader } from "./shop-header";

interface ShopViewProps {
  products: ProductWithMorphs[];
}

export function ShopView({ products }: ShopViewProps) {
  return (
    <div className="bg-white text-black">
      <Navbar />
      <main className="pt-24 container mx-auto px-4 pb-16">
        <ShopHeader totalItems={products.length} />

        {/* Products Grid */}
        <div className="grid grid-cols-2 gap-4 mt-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
}
