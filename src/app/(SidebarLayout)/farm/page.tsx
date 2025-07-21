import { getFarmData } from '@/lib/data/farm';
import { FarmDisplay } from './_components/FarmDisplay';
import { CreateFarmPrompt } from './_components/CreateFarmPrompt';

export default async function FarmPage() {
  const farm = await getFarmData();

  return (
    <main 
      className="flex flex-col items-center justify-center p-4" 
      style={{ minHeight: 'calc(100vh - 4rem)' }}
    >
      {farm ? <FarmDisplay farm={farm} /> : <CreateFarmPrompt />}
    </main>
  );
}