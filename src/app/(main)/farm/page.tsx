import { getFarmData } from '@/features/farm/farm.services';
import { FarmView } from '@/features/farm/components/farm-view';

export default async function FarmPage() {

  const farm = await getFarmData();

  return <FarmView farm={farm} />;
}