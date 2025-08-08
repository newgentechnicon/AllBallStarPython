import { redirect } from 'next/navigation';
import { getFarmData } from '@/features/farm/farm.services';
import { EditFarmView } from '@/features/farm/components/edit-farm-view';
import { Suspense } from 'react';

export default async function EditFarmPage() {
  const farm = await getFarmData();

  if (!farm) {
    redirect('/farm/create');
  }
  
  return (
      <Suspense fallback={<div>Loading page...</div>}>
        <EditFarmView farm={farm} />;
      </Suspense>
    );
}