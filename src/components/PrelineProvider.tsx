'use client';

import { usePathname } from 'next/navigation';
import { useEffect, useRef } from 'react';

// Import the necessary types from the Preline UI library
import type { IStaticMethods } from 'preline/dist/preline';

// Define the window object type to include HSStaticMethods for TypeScript
declare global {
  interface Window {
    HSStaticMethods: IStaticMethods;
  }
}

export default function PrelineProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isFirstRender = useRef(true);

  // Effect to import and initialize Preline on the first client-side render
  useEffect(() => {
    const initPreline = async () => {
      // Dynamically import Preline to ensure it runs only on the client
      await import('preline/dist/preline');
      
      // Initialize Preline after a short delay to ensure the script is loaded
      setTimeout(() => {
        if (window.HSStaticMethods) {
          window.HSStaticMethods.autoInit();
        }
      }, 100);
    };

    initPreline();
  }, []);

  // Effect to re-initialize Preline components on route changes
  useEffect(() => {
    // Skip re-initialization on the very first render
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    // A more reliable way than setTimeout to wait for the DOM to be updated
    const reinitTimer = setTimeout(() => {
        if (window.HSStaticMethods) {
            window.HSStaticMethods.autoInit();
        }
    }, 100);

    return () => clearTimeout(reinitTimer);
  }, [pathname]);

  return <>{children}</>;
}
