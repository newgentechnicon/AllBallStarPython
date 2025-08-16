'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { createClient } from '@/lib/supabase/client';
import { User, Session } from '@supabase/supabase-js';

const AuthContext = createContext<{ user: User | null; isLoading: boolean }>({
  user: null,
  isLoading: true,
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const supabase = createClient();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // onAuthStateChange จะทำงานทันทีเมื่อโหลดเสร็จ พร้อมกับ session ปัจจุบัน
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session: Session | null) => {
        setUser(session?.user ?? null);
        setIsLoading(false);
      }
    );

    // Cleanup subscription on unmount
    return () => {
      subscription.unsubscribe();
    };
  }, [supabase.auth]);

  return (
    <AuthContext.Provider value={{ user, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
