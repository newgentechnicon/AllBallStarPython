// src/components/PrelineProvider.tsx
"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import type { IStaticMethods } from "preline/dist/preline";


// เราไม่จำเป็นต้อง import type IStaticMethods โดยตรงก็ได้
// การประกาศใน global scope ก็เพียงพอแล้ว
declare global {
  interface Window {
    HSStaticMethods: IStaticMethods; // ใช้ any เพื่อความง่าย หรือจะใช้ IStaticMethods ก็ได้
  }
}

export default function PrelineProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname(); // Effect นี้จะทำงานแค่ "ครั้งเดียว" ตอนที่แอปโหลดขึ้นมาครั้งแรก // เพื่อทำการ import script ของ preline เข้ามาในหน้าเว็บ
  const searchParams = useSearchParams();

  useEffect(() => {
    import("preline/preline");
  }, []); // Effect นี้จะทำงาน "ทุกครั้ง" ที่ URL (pathname) เปลี่ยนแปลง // ซึ่งเป็นหัวใจของการแก้ปัญหานี้

  useEffect(() => {
    // เราหน่วงเวลาเล็กน้อย (100ms) เพื่อให้แน่ใจว่า React ได้ Render DOM ใหม่
    // ของหน้าถัดไปเสร็จเรียบร้อยแล้ว ก่อนที่เราจะสั่งให้ Preline ทำงาน
    const timer = setTimeout(() => {
      if (window.HSStaticMethods) {
        window.HSStaticMethods.autoInit();
      }
    }, 100); // Cleanup function เพื่อยกเลิก timer หากผู้ใช้เปลี่ยนหน้าอีกครั้งเร็วเกินไป

    return () => {
      clearTimeout(timer);
    };
  }, [pathname, searchParams]); // Dependency array ที่สำคัญที่สุด!

  return <>{children}</>;
}
