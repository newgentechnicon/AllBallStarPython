"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";

import { Navbar } from "@/components/ui/Navbar";
import type { Farm } from "@/features/farm/farm.types";
import { useState } from "react";
import { Footer } from "@/components/ui/Footer";
import { ScrollButton } from "@/components/ui/ScrollButton";

// 2. กำหนด props interface
interface LandingViewProps {
  farms: Pick<
    Farm,
    "id" | "name" | "logo_url" | "information" | "breeder_name"
  >[];
}

export function LandingView({ farms }: LandingViewProps) {
  const router = useRouter();

  const [featuredFarm, setFeaturedFarm] = useState(farms[0] || null);

  return (
    <div className="bg-black text-white font-sans">
      {/* Header */}
      <Navbar />

      <main>
        {/* Hero Section */}
        <section
          className="relative flex flex-col items-start justify-end min-h-screen text-start px-8 pb-20"
          style={{
            // --- แก้ไขบรรทัดนี้ ---
            backgroundImage: `linear-gradient(to top, rgba(0, 0, 0, 1), transparent), url('/images/home-bg-1.jpg')`,
            // --- สิ้นสุดส่วนที่แก้ไข ---
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
          }}
        >
          <h1
            className="text-6xl font-medium tracking-widest uppercase text-neutral-300 bg-clip-text"
            style={{ fontFamily: "var(--font-montserrat)" }}
          >
            All <br /> Star <br /> Ball <br /> Python
          </h1>
          <p className="mt-4 text-lg font-light text-white">
            Trusted by breeders <br /> Loved by collectors
          </p>
          <button
            type="button"
            className="py-3 px-4 mt-6 min-w-[107px] min-h-[47px] inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-transparent bg-white text-black hover:bg-gray-200 focus:outline-none focus:bg-gray-400"
            onClick={() => router.push("/products")}
          >
            Shop Now
          </button>
        </section>

        {/* Members Section */}
        <section className="pt-20 pb-10 px-4 bg-white">
          <h3 className="text-center text-sm font-regular tracking-[0.2em] text-black uppercase">
            About Us
          </h3>
          <h2 className="text-center text-xl font-bold tracking-[0.1em] text-black uppercase mb-8">
            All Members
          </h2>
          <div className="flex justify-center space-x-4">
            {farms.map((farm) => {
              const isSelected = featuredFarm?.id === farm.id;
              return (
                <Image
                  key={farm.id}
                  src={
                    farm.logo_url ||
                    "https://placehold.co/100x100/e2e8f0/e2e8f0"
                  }
                  alt={farm.name}
                  width={100}
                  height={100}
                  className={`w-12 h-12 rounded-full object-cover cursor-pointer transition-all duration-300 hover:z-10 ${
                    isSelected
                      ? "border-2 border-black scale-110"
                      : "border-2 border-transparent"
                  }`}
                  onClick={() => setFeaturedFarm(farm)}
                />
              );
            })}
          </div>
        </section>

        {/* Featured Card Section */}
        {featuredFarm && (
          <section className="px-4 pb-5 bg-white">
            <div className="max-w-sm mx-auto bg-white rounded-xl overflow-hidden border border-gray-300">
              {/* Image container */}
              <div className="relative h-96 w-full">
                <Image
                  key={featuredFarm.id}
                  src={
                    featuredFarm.logo_url ||
                    "https://placehold.co/400x300/1a202c/718096?text=No+Image"
                  }
                  alt={`${featuredFarm.name} logo`}
                  layout="fill"
                  className="object-cover"
                />
              </div>
              {/* Content container */}
              <div className="p-6">
                <h3 className="text-xl font-bold text-black uppercase">
                  {featuredFarm.name}
                </h3>
                <p className="mt-2 text-gray-600 text-base">
                  {featuredFarm.information ||
                    "Some quick example text to build on the card title and make up the bulk of the card's content."}
                </p>
                <p className="mt-4 text-gray-500 text-sm">
                  {featuredFarm.breeder_name}
                </p>
              </div>
            </div>
          </section>
        )}

        {/* The Beginning Section */}
        <section className="w-full bg-neutral-950">
          <div className="py-20 px-6 max-w-2xl mx-auto text-center">
            <h3 className="text-center text-sm font-regular tracking-[0.2em] text-white uppercase">
              Our Story
            </h3>
            <h2 className="text-center text-xl font-bold tracking-[0.1em] text-white uppercase mb-8">
              The Beginning
            </h2>
            {/* <div className="flex items-center justify-center">
              <Image
                src="/images/banner.jpg"
                alt="Company Logo"
                width={343}
                height={250}
                quality={100}
                className="rounded-lg mb-8"
              />
            </div> */}
            <div className="flex items-center justify-center">
              <Image
                src="/images/banner-2.png"
                alt="Company Logo"
                width={343}
                height={250}
                quality={100}
                className="rounded-lg mb-8"
              />
            </div>
            <p className="text-[#9CA3AF] text-base font-medium leading-relaxed text-start">
              Founded in 2023, All Star Ball Python is a collective of seven
              passionate and dedicated ball python breeders united by a shared
              mission: to produce high-quality, healthy, and visually stunning
              morph combinations. Each of our individual breeder brings unique
              expertise and creativity to the group, allowing us to offer a wide
              and diverse range of beautiful ball pythons.
              <br />
              <br />
              We, All Star breeders, aren’t just breeders, but enthusiasts
              driven by deep love for these incredible animals. Our team ensures
              high and consistent standards in care, health, and innovation,
              making us a trusted name for ball python lovers, collectors, and
              breeders alike.
            </p>
          </div>
        </section>
      </main>

      <Footer />
      <ScrollButton />
    </div>
  );
}
