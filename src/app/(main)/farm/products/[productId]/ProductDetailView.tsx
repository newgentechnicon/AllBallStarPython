"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import type { Product } from '@/types/Product';
import Link from "next/link";

type MorphProp = {
  morphs: {
    name: string;
    morph_categories: {
      name: string;
      color_hex: string | null;
    } | null;
    morph_sub_categories: {
      name: string;
      color_hex: string;
    } | null;
  };
};

// --- SVG Icons ---
const BackIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="m15 18-6-6 6-6" />
  </svg>
);
const MaleIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="h-5 w-5 text-blue-500"
  >
    <circle cx="12" cy="10" r="4" />
    <path d="M12 14v7m-3-3h6" />
  </svg>
);
const FemaleIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="h-5 w-5 text-pink-500"
  >
    <circle cx="10" cy="7" r="4" />
    <path d="M10 11v10m-3-3h6" />
  </svg>
);

// --- Helper Components ---
const MorphTag = ({ morph }: { morph: MorphProp }) => {
  const category = morph.morphs.morph_categories;
  const subCategory = morph.morphs.morph_sub_categories;
  const color = subCategory?.color_hex || category?.color_hex || "#6B7280"; // Default to gray-500
  const textColor = ["#65A30D", "#D97706"].includes(color)
    ? "#FFFFFF"
    : "#000000"; // White text for dark backgrounds

  return (
    <span
      className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-sm font-medium"
      style={{ backgroundColor: color, color: textColor }}
    >
      {morph.morphs.name}
    </span>
  );
};

// --- Main View Component ---
export default function ProductDetailView({
  product,
}: {
  product: Product;
}) {
  const router = useRouter();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const images = product.image_urls || [];

  const [startX, setStartX] = useState<number | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleTouchStart = (e: React.TouchEvent) => {
    setStartX(e.touches[0].clientX);
  };


  const handleTouchEnd = (e: React.TouchEvent) => {
    if (startX === null) return;
    const endX = e.changedTouches[0].clientX;
    const diffX = startX - endX;

    if (Math.abs(diffX) > 50) {
      if (diffX > 0) {
        // Swipe left → Next
        setCurrentImageIndex((prev) =>
          prev === images.length - 1 ? 0 : prev + 1
        );
      } else {
        // Swipe right → Prev
        setCurrentImageIndex((prev) =>
          prev === 0 ? images.length - 1 : prev - 1
        );
      }
    }

    setStartX(null);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
  setStartX(e.clientX);
  setIsDragging(true);
};

const handleMouseMove = () => {
  if (!isDragging || startX === null) return;
};

const handleMouseUp = (e: React.MouseEvent) => {
  if (!isDragging || startX === null) return;

  const diffX = startX - e.clientX;
  if (Math.abs(diffX) > 50) {
    if (diffX > 0) {
      // Drag left = Next
      setCurrentImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
    } else {
      // Drag right = Prev
      setCurrentImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
    }
  }

  setIsDragging(false);
  setStartX(null);
};

  return (
    <div className="bg-white min-h-screen relative">
      <div className="container mx-auto max-w-md pb-18">
        <div className="bg-white pt-6">
          <nav className="flex px-4 text-sm text-gray-500 mb-4">
            <Link href="/farm" className="hover:underline">
              Home
            </Link>
            <span className="mx-2">/</span>
            <Link href="/farm/products" className="hover:underline">
              Farm
            </Link>
            <span className="mx-2">/</span>
            <span className="font-medium text-gray-700 truncate">
              {product.name}
            </span>
          </nav>
        </div>

        {/* Header */}
        <div className="flex items-center justify-between p-4">
          <button
            onClick={() => router.push('/farm/products/')}
            className="flex items-center gap-1 text-gray-700 font-semibold"
          >
            <BackIcon />
            Back
          </button>
          <div className="flex items-center gap-2">
            {images.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentImageIndex(index)}
                className={`h-2 w-2 rounded-full ${
                  currentImageIndex === index ? "bg-gray-800" : "bg-gray-300"
                }`}
              />
            ))}
          </div>
        </div>

        {/* Image Slider */}
        <div
          className="relative mx-4 aspect-square overflow-hidden rounded-lg shadow-lg select-none"
          onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        >
          {images.length > 0 ? (
            images.map((imgUrl, index) => (
              <Image
                key={index}
                src={imgUrl}
                alt={`${product.name} image ${index + 1}`}
                layout="fill"
                className={`object-cover transition-opacity duration-300 ${
                  currentImageIndex === index ? "opacity-100" : "opacity-0"
                }`}
                priority={index === 0}
              />
            ))
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-gray-100">
              <span className="text-gray-500">No Image</span>
            </div>
          )}

          {/* ปุ่มซ้าย */}
          {images.length > 1 && (
            <button
              onClick={() =>
                setCurrentImageIndex((prev) =>
                  prev === 0 ? images.length - 1 : prev - 1
                )
              }
              className="absolute top-1/2 left-2 -translate-y-1/2 bg-white bg-opacity-70 hover:bg-opacity-100 rounded-full p-1 shadow"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-gray-700"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>
          )}

          {/* ปุ่มขวา */}
          {images.length > 1 && (
            <button
              onClick={() =>
                setCurrentImageIndex((prev) =>
                  prev === images.length - 1 ? 0 : prev + 1
                )
              }
              className="absolute top-1/2 right-2 -translate-y-1/2 bg-white bg-opacity-70 hover:bg-opacity-100 rounded-full p-1 shadow"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-gray-700"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
          )}
        </div>

        {/* Content */}
        <div className="p-4 space-y-6 mb-4">
          <div className="text-left">
            <h1 className="text-2xl font-bold uppercase text-gray-900">
              {product.name}
            </h1>
            <p className="text-xl font-semibold text-gray-700 mt-1">
              ฿{product.price?.toLocaleString() || "Contact for price"}
            </p>
          </div>

          <div className="bg-gray-100 p-4 rounded-lg">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-500">ID :</p>
                <p className="font-semibold text-gray-800">{`GK-${product.farm_id}-${product.id}`}</p>
              </div>
              <div>
                <p className="text-gray-500">Status :</p>
                <div className="flex items-center gap-2">
                  <span
                    className={`h-2 w-2 rounded-full ${
                      product.status === "Available"
                        ? "bg-green-500"
                        : "bg-gray-400"
                    }`}
                  ></span>
                  <p className="font-semibold text-gray-800">
                    {product.status}
                  </p>
                </div>
              </div>
              <div>
                <p className="text-gray-500">Year :</p>
                <p className="font-semibold text-gray-800">{product.year}</p>
              </div>
              <div>
                <p className="text-gray-500">Sex :</p>
                <div className="flex items-center gap-1 font-semibold text-gray-800">
                  {product.sex === "Male" && <MaleIcon />}
                  {product.sex === "Female" && <FemaleIcon />}
                  <span>{product.sex}</span>
                </div>
              </div>
              <div className="col-span-2">
                <p className="text-gray-500">Breeder :</p>
                <div className="flex items-center gap-2 mt-1">
                  <Image
                    src={
                      product.farms?.logo_url || "/images/logo-placeholder.png"
                    }
                    alt="Breeder Logo"
                    width={24}
                    height={24}
                    className="rounded-full"
                  />
                  <p className="font-semibold text-gray-800">
                    {product.farms?.name}
                  </p>
                </div>
              </div>
              <div className="col-span-2">
                <p className="text-gray-500">Genetic :</p>
                <div className="flex flex-wrap gap-2 mt-1">
                  {product.product_morphs.map((pm, index) => (
                    <MorphTag key={index} morph={pm} />
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="text-gray-700 text-sm whitespace-pre-line break-words">
            <p>{product.description}</p>
          </div>
        </div>
      </div>

      <footer className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200">
        <div className="container mx-auto max-w-md p-4">
          <Link
            href={`/farm/products/edit/${product.id}`} // ลิงก์ไปยังหน้า Edit ในอนาคต
            className="block w-full rounded-lg bg-gray-800 py-3 text-center text-sm font-semibold text-white hover:bg-gray-700"
          >
            Edit
          </Link>
        </div>
      </footer>
    </div>
  );
}
