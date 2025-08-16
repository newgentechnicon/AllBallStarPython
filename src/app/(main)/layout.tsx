import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { AuthProvider } from '@/context/AuthContext';
import Header from '@/components/common/Header';

export default async function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  // ถ้าไม่มี user ให้ redirect ไปหน้า login ทันที
  // โค้ดนี้ทำงานที่ Server ทำให้ปลอดภัยและไม่มี Race Condition
  if (!user) {
    redirect('/login');
  }

  // ถ้ามี user, ก็ render Layout และ children ต่อไป
  // เรายังคงต้องใช้ AuthProvider เพื่อให้ Client Components อื่นๆ
  // สามารถเข้าถึงข้อมูล user ได้ผ่าน useAuth()
  return (
    <AuthProvider>
        <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
          <Header />
          <main>
            {children}
          </main>
        </div>
    </AuthProvider>
  );
}
