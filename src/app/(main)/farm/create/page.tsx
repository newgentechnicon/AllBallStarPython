import { redirect } from 'next/navigation';
import { checkIfUserHasFarm } from '@/features/farm/farm.services';
import { CreateFarmView } from '@/features/farm/components/create-farm-view';

export default async function CreateFarmPage() {
  const hasFarm = await checkIfUserHasFarm();
  
  if (hasFarm) {
    redirect('/farm');
  }

  return <CreateFarmView />;
}