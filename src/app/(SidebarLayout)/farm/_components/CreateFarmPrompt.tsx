import Image from 'next/image';
import Link from 'next/link';

export function CreateFarmPrompt() {
  return (
    <div className="flex w-full max-w-sm flex-col items-center rounded-lg bg-white p-8 text-center shadow-md dark:bg-gray-800">
      <Image
        src="/images/farm-1.png"
        alt="An illustration of a barn"
        width={232}
        height={118}
        quality={100}
        style={{ objectFit: 'contain' }}
      />
      <p className="mt-4 font-medium text-[#6B7280] dark:text-gray-400">
        You haven&apos;t added any farm yet. Add one to continue.
      </p>
      <Link 
        href="/farm/create"
        className="mt-5 flex w-full justify-center rounded-lg border border-transparent bg-[#888684] px-4 py-3 text-[15px] font-medium text-white hover:bg-neutral-700 focus:outline-none focus:ring-2 focus:ring-neutral-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:bg-neutral-400 dark:bg-neutral-500 dark:hover:bg-neutral-600"
      >
        Add Farm
      </Link>
    </div>
  );
}