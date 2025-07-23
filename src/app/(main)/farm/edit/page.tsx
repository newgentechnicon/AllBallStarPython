import { redirect } from 'next/navigation';
import { getFarmData } from '@/features/farm/farm.services';
import { EditFarmView } from '@/features/farm/components/edit-farm-view';

export default async function EditFarmPage() {
  const farm = await getFarmData();

  if (!farm) {
    redirect('/farm/create');
  }
  
  return <EditFarmView farm={farm} />;
}