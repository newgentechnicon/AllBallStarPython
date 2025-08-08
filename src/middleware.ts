import { type NextRequest } from 'next/server'
import { createClient } from '@/lib/supabase/middleware'

export async function middleware(request: NextRequest) {
  // สร้าง client และ response จาก helper ที่เราสร้างไว้
  const { supabase, response } = createClient(request)

  // คำสั่งนี้สำคัญมาก: ทำหน้าที่ refresh session ของ user
  // เพื่อให้ Server Components และ Server Actions รู้จัก user ที่ล็อกอินอยู่เสมอ
  await supabase.auth.getSession()

  return response
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
}