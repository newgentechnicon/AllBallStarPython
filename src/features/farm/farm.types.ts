import type { Database } from '@/types/database.types';

// อ้างอิง Type โดยตรงจากไฟล์ database.types.ts ที่คุณให้มา
// ทำให้มั่นใจได้ว่า Type ถูกต้องตรงกับฐานข้อมูลเสมอ
export type Farm = Database['public']['Tables']['farms']['Row'];