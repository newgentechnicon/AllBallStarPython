import Link from "next/link";
import Image from "next/image";
import type { ProductWithMorphs } from "@/features/product/product.types";

interface ProductCardProps {
  product: ProductWithMorphs;
}

export function ProductCard({ product }: ProductCardProps) {
  return (
    <Link href={`/products/${product.id}`} className="group block">
      <div className="rounded-xl border border-gray-200 bg-white p-2 shadow-sm transition-shadow hover:shadow-lg">
        <div className="relative aspect-square w-full overflow-hidden rounded-lg">
          <Image
            src={
              product.image_urls?.[0] ||
              "https://placehold.co/300x300/e2e8f0/e2e8f0?text=No+Image"
            }
            alt={product.name}
            layout="fill"
            className="object-cover transition-transform group-hover:scale-105"
          />
        </div>
        <div className="mt-3 px-1 pb-1">
          <h3 className="font-bold text-gray-900 text-sm uppercase truncate">
            {product.name}
          </h3>
          {/* <p className="text-xs text-gray-500 truncate">{morphNames}</p> */}
          <div className="mt-2 flex items-center gap-3 text-xs text-gray-600">
            <div className="flex items-center gap-1">
              {product.sex === "Male" && (
                <Image
                  src="/images/male-icon.png"
                  alt="upload"
                  width={13}
                  height={13}
                  quality={100}
                  className="mx-auto"
                />
              )}
              {product.sex === "Female" && (
                <Image
                  src="/images/female-icon.png"
                  alt="upload"
                  width={10}
                  height={16}
                  quality={100}
                  className="mx-auto"
                />
              )}
              <span>{product.sex}</span>
            </div>
            <span>{product.year}</span>
          </div>
          <div className="mt-2 flex items-center gap-1 truncate text-xs text-gray-600">
            <Image
              src={
                product.farms?.logo_url ||
                "https://placehold.co/100x100/333/fff?text=Logo"
              }
              alt={`${product.farms?.name} Logo`}
              width={100}
              height={100}
              className="w-4 h-4 rounded-full"
            />
            <span className="truncate">{product.farms?.name}</span>
          </div>
          <p className="mt-2 font-semibold text-gray-800 text-sm">
            ฿{product.price?.toLocaleString() || "N/A"}
          </p>
        </div>
      </div>
    </Link>
  );
}
