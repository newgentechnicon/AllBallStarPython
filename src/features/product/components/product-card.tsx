import Link from "next/link";
import Image from "next/image";
import type { ProductWithMorphs } from "@/features/product/product.types";

// SVG Icons
const MaleIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="h-3 w-3 text-blue-500"
  >
    <circle cx="12" cy="10" r="4"></circle>
    <path d="M12 14v7m-3-3h6"></path>
  </svg>
);
const FemaleIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="h-3 w-3 text-pink-500"
  >
    <circle cx="10" cy="7" r="4"></circle>
    <path d="M10 11v10m-3-3h6"></path>
  </svg>
);
const BreederIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="h-3 w-3 text-gray-500"
  >
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
    <circle cx="12" cy="7" r="4"></circle>
  </svg>
);

interface ProductCardProps {
  product: ProductWithMorphs;
}

export function ProductCard({ product }: ProductCardProps) {

  return (
    <Link
      href={`/farm/products/${product.id}`}
      className="group block"
    >
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
              {product.sex === "Male" && <MaleIcon />}
              {product.sex === "Female" && <FemaleIcon />}
              <span>{product.sex}</span>
            </div>
            <span>{product.year}</span>
          </div>
          <div className="mt-2 flex items-center gap-1 truncate text-xs text-gray-600">
            <BreederIcon />
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
