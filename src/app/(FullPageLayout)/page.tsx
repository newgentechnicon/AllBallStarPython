"use client";

// 1. Import คอมโพเนนต์ PrelineSelect ที่เราสร้างขึ้น
// เราไม่จำเป็นต้องใช้ useEffect หรือ usePathname ในหน้านี้อีกต่อไป
import PrelineSelect from '@/components/common/PrelineSelect';

export default function Home() {
  return (
    <div className="bg-slate-900 flex items-center justify-center min-h-screen p-4">
      
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8 space-y-6">
        
        {/* หัวข้อ */}
        <h1 className="text-2xl font-bold text-gray-800 text-center">
          ฟอร์มตัวอย่าง
        </h1>
        <PrelineSelect />
        
      </div>
    </div>
  );
}
