import Image from 'next/image';
import Link from 'next/link';
import { UserIcon } from '@/components/ui/icons';
import type { Farm } from '@/features/farm/farm.types'; // 👈 อัปเดต path การ import

interface FarmDisplayProps {
  farm: Farm;
}

export function FarmDisplay({ farm }: FarmDisplayProps) {
  return (
    <div className="w-full max-w-sm overflow-hidden rounded-lg bg-white shadow-lg dark:bg-gray-800">
      <div className="relative w-full" style={{ aspectRatio: '1 / 1' }}>
        {farm.logo_url ? (
          <Image src={farm.logo_url} alt={`${farm.name} logo`} layout="fill" className="object-cover" priority />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gray-200">
            <span className="text-gray-500">No Logo</span>
          </div>
        )}
      </div>

      <div className="p-6 text-center">
        <h2 className="text-2xl font-bold uppercase text-gray-800 dark:text-white">{farm.name}</h2>
        <p className="mt-1 text-gray-600 dark:text-gray-400">{farm.breeder_name}</p>
        
        <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-gray-100 px-3 py-1 text-gray-500 dark:bg-gray-700 dark:text-gray-400">
          <UserIcon className="h-4 w-4" />
          <span className="text-sm font-medium">0</span>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-4">
          <Link href="/farm/edit" className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700">
            Edit Farm
          </Link>
          <Link href="/farm/products" className="rounded-lg bg-gray-600 px-4 py-2 text-sm font-medium text-white hover:bg-gray-700 dark:bg-gray-500 dark:hover:bg-gray-600">
            See Product
          </Link>
        </div>
      </div>
    </div>
  );
}