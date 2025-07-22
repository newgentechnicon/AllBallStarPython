import { getFarmData } from '@/lib/data/farm';
import { redirect } from 'next/navigation';
import { EditFarmForm } from './_components/EditFarmForm';

export default async function EditFarmPage() {
  const farm = await getFarmData();

  if (!farm) {
    redirect('/farm/create');
  }
  
  return (
    <div className="container mx-auto max-w-2xl py-4 bg-white">
      <div className="px-4 sm:px-8 border-b">
        <h1 className="text-2xl font-bold mb-4">Edit Farm</h1>
      </div>
      <EditFarmForm farm={farm} />
    </div>
  );
}