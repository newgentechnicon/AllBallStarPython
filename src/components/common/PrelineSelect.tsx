'use client';

import { useEffect, useRef } from 'react';
import type { IStaticMethods } from 'preline/dist/preline';

// ประกาศ type สำหรับ window object
declare global {
  interface Window {
    HSStaticMethods: IStaticMethods;
  }
}

// สร้างคอมโพเนนต์สำหรับ Preline Select โดยเฉพาะ
export default function PrelineSelect() {
  // 1. สร้าง ref เพื่ออ้างอิงถึง div ที่ครอบ select ของเรา
  const selectWrapperRef = useRef<HTMLDivElement>(null);

  // 2. ใช้ useEffect เพื่อให้โค้ดทำงานหลังจากที่คอมโพเนนต์นี้แสดงผลบนหน้าเว็บแล้วเท่านั้น
  useEffect(() => {
    const timer = setTimeout(() => {
      // 3. ตรวจสอบว่า ref และ Preline พร้อมใช้งาน
      if (selectWrapperRef.current && window.HSStaticMethods) {
        // 4. สั่งให้ Preline ทำงานกับ "เฉพาะส่วนนี้" เท่านั้น
        // นี่คือส่วนที่สำคัญที่สุด เพราะเป็นการสั่งงานที่เจาะจงและแม่นยำ
        window.HSStaticMethods.autoInit('#preline-select-wrapper');
      }
    }, 100); // หน่วงเวลาเล็กน้อยเพื่อให้แน่ใจว่า DOM พร้อม 100%

    // ฟังก์ชันสำหรับล้าง timer เมื่อคอมโพเนนต์ถูกทำลาย
    return () => clearTimeout(timer);
  }, []); // dependency array ว่าง [] หมายถึงให้ทำงานแค่ครั้งเดียวตอนเริ่มต้น

  return (
    // 5. ผูก ref เข้ากับ div ที่ครอบ <select>
    <div ref={selectWrapperRef} id="preline-select-wrapper">
      <label
        htmlFor="team-select"
        className="block text-sm font-medium text-gray-700 mb-2"
      >
        เลือกทีม (ทำงานแล้ว)
      </label>
      <select
        id="team-select"
        multiple
        defaultValue={['1']}
        data-hs-select='{
          "placeholder": "Select multiple options...",
          "toggleTag": "<button type=\"button\" aria-expanded=\"false\"></button>",
          "toggleClasses": "hs-select-disabled:pointer-events-none hs-select-disabled:opacity-50 relative py-3 ps-4 pe-9 flex gap-x-2 text-nowrap w-full cursor-pointer bg-white border border-gray-200 rounded-lg text-start text-sm focus:outline-none focus:ring-2 focus:ring-blue-500",
          "dropdownClasses": "mt-2 z-50 w-full max-h-72 p-1 space-y-0.5 bg-white border border-gray-200 rounded-lg overflow-hidden overflow-y-auto",
          "optionClasses": "py-2 px-4 w-full text-sm text-gray-800 cursor-pointer hover:bg-gray-100 rounded-lg focus:outline-none focus:bg-gray-100",
          "optionTemplate": "<div class=\"flex items-center\"><div class=\"me-2\" data-icon></div><div><div class=\"hs-selected:font-semibold text-sm text-gray-800\" data-title></div></div><div class=\"ms-auto\"><span class=\"hidden hs-selected:block\"><svg class=\"shrink-0 size-4 text-blue-600\" xmlns=\"http://www.w3.org/2000/svg\" width=\"16\" height=\"16\" fill=\"currentColor\" viewBox=\"0 0 16 16\"><path d=\"M12.736 3.97a.733.733 0 0 1 1.047 0c.286.289.29.756.01 1.05L7.88 12.01a.733.733 0 0 1-1.065.02L3.217 8.384a.757.757 0 0 1 0-1.06.733.733 0 0 1 1.047 0l3.052 3.093 5.4-6.425a.247.247 0 0 1 .02-.022Z\"/></svg></span></div></div>",
          "extraMarkup": "<div class=\"absolute top-1/2 end-3 -translate-y-1/2\"><svg class=\"shrink-0 size-3.5 text-gray-500\" xmlns=\"http://www.w3.org/2000/svg\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"m7 15 5 5 5-5\"/><path d=\"m7 9 5-5 5 5\"/></svg></div>",
          "optgroupClasses": "text-xs text-gray-500 ps-4 pt-2 pb-1 uppercase font-semibold"
        }'
        className="hidden"
      >
        <option value="">Choose</option>
          <option
            value="1"
            data-hs-select-option='{"icon": "<img class=\"shrink-0 size-5 rounded-full\" src=\"https://images.unsplash.com/photo-1659482633369-9fe69af50bfb?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=facearea&facepad=3&w=320&h=320&q=80\" alt=\"James Collins\" />"}'
          >
            James Collins
          </option>
          <option
            value="2"
            data-hs-select-option='{"icon": "<img class=\"shrink-0 size-5 rounded-full\" src=\"https://images.unsplash.com/photo-1541101767792-f9b2b1c4f127?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=facearea&facepad=3&w=320&h=320&q=80\" alt=\"Amanda Harvey\" />"}'
          >
            Amanda Harvey
          </option>
          <option
            value="3"
            data-hs-select-option='{"icon": "<img class=\"shrink-0 size-5 rounded-full\" src=\"https://images.unsplash.com/photo-1601935111741-ae98b2b230b0?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=facearea&facepad=2.5&w=320&h=320&q=80\" alt=\"Costa Quinn\" />"}'
          >
            Costa Quinn
          </option>
      </select>
    </div>
  );
}
