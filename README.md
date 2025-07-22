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

```
my-next-supabase-app/
├── .env.local              # 🔑 เก็บข้อมูลลับ, API Keys
├── .env.example            # 📄 ตัวอย่าง .env สำหรับทีม
├── next.config.mjs
├── package.json
├── tsconfig.json
└── /src
    └── ├── /app/           # 📂 ROUTING & CONTROLLERS
    │   ├── /(auth)/
    │   │   └── /login/
    │   │       └── page.tsx
    │   ├── /(main)/
    │   │   ├── /dashboard/
    │   │   │   └── page.tsx
    │   │   ├── /farm/
    │   │   │   ├── /create/
    │   │   │   │   └── page.tsx
    │   │   │   ├── /edit/
    │   │   │   │   └── page.tsx
    │   │   │   └── page.tsx
    │   │   ├── /products/
    │   │   │   └── page.tsx
    │   │   └── layout.tsx
    │   └── layout.tsx
    │
    ├── /components/    # 📂 SHARED UI
    │   └── /ui/
    │
    ├── /features/      # ⭐ BUSINESS LOGIC
    │   ├── /auth/
    │   │   ├── components/
    │   │   ├── auth.actions.ts
    │   │   └── auth.types.ts
    │   ├── /farm/
    │   │   ├── components/
    │   │   │   ├── create-farm-view.tsx
    │   │   │   ├── edit-farm-view.tsx
    │   │   │   ├── farm-display.tsx
    │   │   │   ├── farm-toast-handler.tsx
    │   │   │   └── farm-view.tsx
    │   │   ├── farm.actions.ts
    │   │   ├── farm.services.ts
    │   │   └── farm.types.ts
    │   └── /product/
    │       ├── product.actions.ts
    │       ├── product.services.ts
    │       └── product.types.ts
    │
    ├── /hooks/         # 📂 GLOBAL HOOKS
    │   └── useAppToast.ts
    │
    ├── /lib/           # 📂 LOW-LEVEL HELPERS
    │   └── /supabase/
    │
    ├── /types/         # 📂 GLOBAL TYPES
    │   └── database.types.ts
    │
    └── middleware.ts   # 🛡️ MIDDLEWARE
```

- **`/app`**: จัดการเรื่อง Routing และทำหน้าที่เป็น Controller ที่คอยประสานงานระหว่าง Service และ View
- **`/features`**: หัวใจหลักของแอปพลิเคชัน โค้ดที่เกี่ยวกับ Business Logic ทั้งหมดจะถูกแบ่งตามฟีเจอร์ (เช่น `auth`, `farm`, `product`)
- **`/lib`**: เก็บโค้ดพื้นฐานที่ใช้ร่วมกันทั่วทั้งโปรเจกต์ โดยเฉพาะการตั้งค่า Supabase Client
- **`/components/ui`**: เก็บ UI Components ขนาดเล็กที่ใช้ซ้ำได้ (เช่น Button, Input)
- **`/types`**: เก็บ Type กลาง โดยเฉพาะ `database.types.ts` ที่สร้างจาก Supabase
- **`middleware.ts`**: จัดการเรื่อง Authentication และ Session ของผู้ใช้ในทุก Request