# My Next.js & Supabase Project

โปรเจกต์นี้เป็นเว็บแอปพลิเคชันที่สร้างด้วย **Next.js (App Router)** และใช้ **Supabase** เป็น Backend แบบครบวงจร (ฐานข้อมูล, Authentication, และ Storage) โดยใช้สถาปัตยกรรมแบบ **Feature-Sliced Design** เพื่อให้โค้ดมีความเป็นระเบียบสูง ง่ายต่อการบำรุงรักษา และรองรับการขยายตัวในอนาคต

## ✨ Key Features

- **Framework**: [Next.js](https://nextjs.org/) 14+ (App Router)
- **Backend & Database**: [Supabase](https://supabase.io/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **UI Components**: [Preline](https://preline.co/)
- **Architecture**: Feature-Sliced Design
- **Data Mutations**: Server Actions
- **Type Safety**: TypeScript และ Type ที่สร้างจากฐานข้อมูลโดยตรง

## 📂 Folder Structure

โครงสร้างของโปรเจกต์ถูกออกแบบมาเพื่อแบ่งแยกหน้าที่ (Separation of Concerns) อย่างชัดเจน:

my-next-supabase-app/
├── .env.local              # 🔑 เก็บข้อมูลลับ, API Keys
├── .env.example            # 📄 ตัวอย่าง .env สำหรับทีม
├── next.config.mjs
├── package.json
├── tsconfig.json
└── /src/
    ├── /app/                   # 📂 ROUTING & CONTROLLERS
    │   ├── /(auth)/            #   กลุ่มหน้าสำหรับผู้ที่ยังไม่ล็อกอิน
    │   │   └── /login/
    │   │       └── page.tsx      #   Controller ของหน้า Login
    │   ├── /(main)/            #   กลุ่มหน้าหลักของแอป
    │   │   ├── /dashboard/
    │   │   │   └── page.tsx
    │   │   ├── /farm/
    │   │   │   └── page.tsx
    │   │   ├── /products/
    │   │   │   └── page.tsx
    │   │   └── layout.tsx        #   Layout สำหรับกลุ่ม (main)
    │   └── layout.tsx            #   Root Layout หลักของทุกหน้า
    │
    ├── /components/            # 📂 SHARED UI
    │   └── /ui/                  #   UI เล็กๆ (Button, Input, icons.tsx)
    │
    ├── /features/              # ⭐ BUSINESS LOGIC
    │   ├── /auth/
    │   │   ├── /components/
    │   │   │   └── login-view.tsx  #   🎨 View: UI ของหน้า Login
    │   │   ├── auth.actions.ts   #   ⚙️ Logic: Server Action (login)
    │   │   └── auth.types.ts     #   📝 Types: Type เฉพาะของ Auth
    │   ├── /farm/
    │   │   ├── farm.actions.ts   #   ⚙️ Logic: Server Action (updateFarm)
    │   │   ├── farm.services.ts  #   📦 Data: ฟังก์ชันคุยกับ DB
    │   │   └── farm.types.ts     #   📝 Types: Type เฉพาะของ Farm
    │   └── /product/
    │       ├── product.actions.ts  #   ⚙️ Logic: Server Action (create, delete)
    │       ├── product.services.ts #   📦 Data: ฟังก์ชันคุยกับ DB
    │       └── product.types.ts    #   📝 Types: Type เฉพาะของ Product
    │
    ├── /lib/                   # 📂 LOW-LEVEL HELPERS
    │   ├── /supabase/            #   จัดการ Supabase Client
    │   │   ├── client.ts
    │   │   ├── server.ts
    │   │   └── middleware.ts
    │   └── /utils.ts             #   ฟังก์ชันช่วยเหลือทั่วไป
    │
    ├── /types/                 # 📂 GLOBAL TYPES
    │   └── database.types.ts     #   🔥 Type อัตโนมัติจาก Supabase
    │
    └── middleware.ts           # 🛡️ MIDDLEWARE (จัดการ Session)

- **`/app`**: จัดการเรื่อง Routing และทำหน้าที่เป็น Controller ที่คอยประสานงานระหว่าง Service และ View
- **`/features`**: หัวใจหลักของแอปพลิเคชัน โค้ดที่เกี่ยวกับ Business Logic ทั้งหมดจะถูกแบ่งตามฟีเจอร์ (เช่น `auth`, `farm`, `product`)
- **`/lib`**: เก็บโค้ดพื้นฐานที่ใช้ร่วมกันทั่วทั้งโปรเจกต์ โดยเฉพาะการตั้งค่า Supabase Client
- **`/components/ui`**: เก็บ UI Components ขนาดเล็กที่ใช้ซ้ำได้ (เช่น Button, Input)
- **`/types`**: เก็บ Type กลาง โดยเฉพาะ `database.types.ts` ที่สร้างจาก Supabase
- **`middleware.ts`**: จัดการเรื่อง Authentication และ Session ของผู้ใช้ในทุก Request