import { createBrowserClient } from '@supabase/ssr'

// สร้าง Supabase client สำหรับฝั่ง Client (Browser)
export function createClient() {
  // ใช้ createBrowserClient สำหรับ Client Components
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}