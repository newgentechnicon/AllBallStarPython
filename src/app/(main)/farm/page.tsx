import { getFarmData } from '@/features/farm/farm.services'; // 👈 อัปเดต path การ import
import { FarmView } from '@/features/farm/components/farm-view';

export default async function FarmPage() {
  // 1. ดึงข้อมูลจาก Service
  const farm = await getFarmData();

  // 2. ส่งข้อมูลให้ View ไปแสดงผล
  return <FarmView farm={farm} />;
}