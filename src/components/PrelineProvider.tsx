// src/components/PrelineProvider.tsx
"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import type { IStaticMethods } from "preline/dist/preline";


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
  const searchParams = useSearchParams();

  useEffect(() => {
    import("preline/preline");
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (window.HSStaticMethods) {
        window.HSStaticMethods.autoInit();
      }
    }, 100);

    return () => {
      clearTimeout(timer);
    };
  }, [pathname, searchParams]);

  return <>{children}</>;
}
