import Image from "next/image";
import type { FarmWithProductCount } from "@/features/farm/farm.types";
import { PrimaryButton, SecondaryButton } from "@/components/ui/Button";

interface FarmDisplayProps {
  farm: FarmWithProductCount;
}

export function FarmDisplay({ farm }: FarmDisplayProps) {

  const productCount = farm.products?.[0]?.count ?? 0;

  return (
    <div className="w-full max-w-sm overflow-hidden rounded-lg bg-white shadow-lg dark:bg-gray-800">
      <div className="relative w-full" style={{ aspectRatio: "1 / 1" }}>
        {farm.logo_url ? (
          <Image
            src={farm.logo_url}
            alt={`${farm.name} logo`}
            layout="fill"
            className="object-cover"
            priority
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gray-200">
            <span className="text-gray-500">No Logo</span>
          </div>
        )}
      </div>

      <div className="p-4 text-center">
        <h2 className="text-lg font-bold uppercase text-[#1F2937] dark:text-white">
          {farm.name}
        </h2>
        <p className="text-sm font-semibold mt-1 text-[#6B7280] dark:text-gray-400">
          {farm.breeder_name}
        </p>

        <div className="mt-4 inline-flex items-center gap-2 rounded-lg bg-gray-100 px-3 py-2 text-gray-500 dark:bg-gray-700 dark:text-gray-400">
          <Image
            src="/images/snake-icon.png"
            alt="An illustration of a barn"
            width={24}
            height={24}
            quality={100}
            style={{ objectFit: "contain" }}
          />
          <span className="text-sm font-medium">{productCount}</span>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-4">
          <SecondaryButton href="/farm/edit" className="text-white">Edit Farm</SecondaryButton>

          <PrimaryButton href="/farm/products">See Product</PrimaryButton>
        </div>
      </div>
    </div>
  );
}
