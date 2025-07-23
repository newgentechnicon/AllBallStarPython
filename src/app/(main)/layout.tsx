'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import Header from '@/components/common/Header';

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // รอจนกว่าการตรวจสอบ session จะเสร็จสิ้น
    if (!isLoading) {
      // ถ้าไม่มี user ให้ redirect ไปหน้า login
      if (!user) {
        router.push('/login');
      }
    }
  }, [user, isLoading, router]);

  // แสดงหน้า loading ขณะรอตรวจสอบ session
  if (isLoading) {
    return (
        <div className="flex h-screen items-center justify-center bg-gray-100 dark:bg-gray-900">
            <p className="dark:text-white">Loading application...</p>
        </div>
    );
  }
  
  // ถ้ามี user ให้แสดง layout ปกติ
  return user ? (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      <Header />
      <main>
        {children}
      </main>
    </div>
  ) : null; // หรือแสดงหน้าเปล่าๆ ก่อนจะ redirect
}
