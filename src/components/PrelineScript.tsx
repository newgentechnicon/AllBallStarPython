'use client';

import { usePathname } from 'next/navigation';
import { useEffect } from 'react';
import type { IStaticMethods } from 'preline/preline';

declare global {
  interface Window {
    HSStaticMethods: IStaticMethods;
  }
}

export function PrelineScript() {
  const path = usePathname();

  useEffect(() => {
    // Import Preline on the client side
    import('preline/preline');
  }, []);

  useEffect(() => {
    // Re-initialize Preline every time the path changes
    setTimeout(() => {
      if (window.HSStaticMethods) {
        window.HSStaticMethods.autoInit();
      }
    }, 100);
  }, [path]);

  return null;
}