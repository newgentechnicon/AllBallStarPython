'use client';

import { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { useAppToast } from '@/hooks/useAppToast';

export function ClientToastHandler() {
  const searchParams = useSearchParams();
  const { showSuccessToast } = useAppToast();

  useEffect(() => {
    const status = searchParams.get('status');
    
    // ตรวจสอบสถานะจากหน้า Create Farm
    if (status === 'success') {
      showSuccessToast('Add farm successfully');
    } 
    // เพิ่ม: ตรวจสอบสถานะจากหน้า Edit Farm
    else if (status === 'updated') {
      showSuccessToast('Update farm successfully');
    }

  }, [searchParams, showSuccessToast]);

  return null; // Component นี้ไม่ต้องแสดงผลอะไร
}