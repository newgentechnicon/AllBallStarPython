'use client';

// import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

const Sidebar = () => {
  const router = useRouter();
  const supabase = createClient();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.refresh(); // บังคับให้ refresh เพื่อให้ AuthContext อัปเดต
    router.push('/login');
  };

  return (
    <aside className="absolute left-0 top-0 z-50 flex h-screen w-72 flex-col overflow-y-hidden bg-gray-800 duration-300 ease-linear lg:static lg:translate-x-0 -translate-x-full">
      {/* ... (ส่วนหัวของ Sidebar) ... */}
      <div className="no-scrollbar flex flex-col overflow-y-auto duration-300 ease-linear">
        <nav className="mt-5 py-4 px-4 lg:mt-9 lg:px-6">
          {/* ... (ส่วนเมนู) ... */}
          <div>
            <h3 className="mb-4 ml-4 text-sm font-semibold text-gray-400">Actions</h3>
            <ul className="mb-6 flex flex-col gap-1.5">
               <li>
                  <button
                    onClick={handleLogout}
                    className="group relative flex w-full items-center gap-2.5 rounded-sm px-4 py-2 text-left font-medium text-gray-300 duration-300 ease-in-out hover:bg-gray-700"
                  >
                    Logout
                  </button>
              </li>
            </ul>
          </div>
        </nav>
      </div>
    </aside>
  );
};

export default Sidebar;
