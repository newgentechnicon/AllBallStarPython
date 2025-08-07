import { Montserrat } from 'next/font/google';
import { LandingView } from '@/features/landing/components/landing-view';
import { getAllFarms } from '@/features/farm/farm.services'; // 👈 1. Import service ใหม่

// Setup the font for the page
const montserrat = Montserrat({
  subsets: ['latin'],
  weight: ['400', '700', '900'],
  variable: '--font-montserrat',
});

// 2. เปลี่ยน Page ให้เป็น async
export default async function HomePage() {
  // 3. ดึงข้อมูลฟาร์ม
  const farms = await getAllFarms();

  return (
    <div className={montserrat.variable}>
      {/* 4. ส่งข้อมูลฟาร์มไปเป็น props */}
      <LandingView farms={farms} />
    </div>
  );
}