"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import type { ProductDetail } from "@/features/product/product.types";
import { MorphTag } from "./morph-tag";
import { Footer } from "@/components/ui/Footer";
import type { FarmContactInfo } from "@/features/farm/farm.types";
import { ContactCard } from "@/features/contact/components/contact-card";
import { Navbar } from "@/components/ui/Navbar-white";

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

interface ProductShopDetailViewProps {
  product: ProductDetail;
  farms: FarmContactInfo[];
}

export function ProductShopDetailView({
  product,
  farms,
}: ProductShopDetailViewProps) {
  const router = useRouter();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const images = product.image_urls || [];

  const [startX, setStartX] = useState<number | null>(null);

  const handleNextImage = () =>
    setCurrentImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  const handlePrevImage = () =>
    setCurrentImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));

  const handleTouchStart = (e: React.TouchEvent) =>
    setStartX(e.touches[0].clientX);
  const handleTouchEnd = (e: React.TouchEvent) => {
    if (startX === null) return;
    const diffX = startX - e.changedTouches[0].clientX;
    if (Math.abs(diffX) > 50) {
      if (diffX > 0) handleNextImage();
      else handlePrevImage();
    }
    setStartX(null);
  };

  const handleMouseDown = (e: React.MouseEvent) => setStartX(e.clientX);
  const handleMouseUp = (e: React.MouseEvent) => {
    if (startX === null) return;
    const diffX = startX - e.clientX;
    if (Math.abs(diffX) > 50) {
      if (diffX > 0) handleNextImage();
      else handlePrevImage();
    }
    setStartX(null);
  };

  return (
    <div className="bg-white mx-auto min-h-screen relative">
      <Navbar />
      <div className="mx-auto max-w-2xl min-h-screen relative mt-18">
        <div className="container mx-auto max-w-md pb-24">
          {/* Header and Breadcrumbs */}
          <div className="p-4">
            <button
              onClick={() => router.push("/products")}
              className="flex items-center gap-1 text-gray-700 font-semibold mb-4"
            >
              <BackIcon />
              Back
            </button>
          </div>

          {/* Image Slider */}
          <div
            className="relative mx-4 aspect-square overflow-hidden rounded-lg shadow-lg select-none"
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
            onMouseDown={handleMouseDown}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp} // End drag if mouse leaves the area
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
            {images.length > 1 && (
              <>
                <button
                  onClick={handlePrevImage}
                  className="absolute top-1/2 left-2 -translate-y-1/2 bg-white bg-opacity-70 hover:bg-opacity-100 rounded-full p-1 shadow"
                  aria-label="Previous image"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-gray-700"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    {" "}
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 19l-7-7 7-7"
                    />{" "}
                  </svg>
                </button>
                <button
                  onClick={handleNextImage}
                  className="absolute top-1/2 right-2 -translate-y-1/2 bg-white bg-opacity-70 hover:bg-opacity-100 rounded-full p-1 shadow"
                  aria-label="Next image"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-gray-700"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    {" "}
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />{" "}
                  </svg>
                </button>
              </>
            )}
            {/* Dots Indicator */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2">
              {images.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentImageIndex(index)}
                  className={`h-2 w-2 rounded-full transition-colors ${
                    currentImageIndex === index ? "bg-gray-800" : "bg-gray-300"
                  }`}
                  aria-label={`Go to image ${index + 1}`}
                />
              ))}
            </div>
          </div>

          {/* Content */}
          <div className="p-4 space-y-6">
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
                  <p className="font-semibold text-gray-800">{`${product.product_id}`}</p>
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
                    {product.sex === "Male" && (
                      <Image
                        src="/images/male-icon.png"
                        alt="upload"
                        width={13}
                        height={13}
                        quality={100}
                        className="mr-1"
                      />
                    )}
                    {product.sex === "Female" && (
                      <Image
                        src="/images/female-icon.png"
                        alt="upload"
                        width={10}
                        height={16}
                        quality={100}
                        className="mr-1"
                      />
                    )}
                    <span>{product.sex}</span>
                  </div>
                </div>
                <div className="col-span-2">
                  <p className="text-gray-500">Breeder :</p>
                  <div className="flex items-center gap-2 mt-1">
                    <Image
                      src={
                        product.farms?.logo_url ||
                        "/images/logo-placeholder.png"
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
                  <p className="text-gray-500">Morphs :</p>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {product.product_morphs.map((pm) => (
                      <MorphTag key={pm.morphs?.id} morph={pm} />
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {product.description && (
              <div className="text-gray-700 text-sm whitespace-pre-line break-words">
                <p className="text-gray-500 mb-1">Description :</p>
                <p>{product.description}</p>
              </div>
            )}
          </div>
        </div>
      </div>
      <div className=" w-full bg-neutral-500">
        <div className="px-4 pb-8 space-y-4 max-w-md mx-auto">
          <h2 className="text-white font-bold text-xl pt-3">FARM CONTACT</h2>
          <p className="text-white font-regular text-sm">
            In case that you interested with this product, you can contact the
            following shop below
          </p>
          {farms.map((farmItem) => (
            <ContactCard key={farmItem.id} farm={farmItem} />
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
}
