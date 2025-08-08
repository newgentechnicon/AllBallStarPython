import Image from 'next/image';
import { PrimaryButton } from "@/components/ui/Button";

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
      <PrimaryButton href="/farm/create" className='mt-5 w-full'>Add Farm</PrimaryButton>
    </div>
  );
}