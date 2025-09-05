import type { FarmWithProductCount } from "@/features/farm/farm.types";
import { FarmDisplay } from './farm-display';
import { CreateFarmPrompt } from './create-farm-prompt';

interface FarmViewProps {
  farm: FarmWithProductCount | null;
}

export function FarmView({ farm }: FarmViewProps) {
  return (
    <main 
      className="flex flex-col items-center justify-center p-4" 
      style={{ minHeight: 'calc(100vh - 4rem)' }}
    >
      {farm ? <FarmDisplay farm={farm} /> : <CreateFarmPrompt />}
    </main>
  );
}