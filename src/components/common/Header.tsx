"use client";

// import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
// import { useAuth } from "@/context/AuthContext";
import { ChangePasswordModal } from "@/features/auth/components/ChangePasswordModal";

// --- SVG Icons ---
const HamburgerIcon = ({ ...props }) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <line x1="3" y1="12" x2="21" y2="12" />
    <line x1="3" y1="6" x2="21" y2="6" />
    <line x1="3" y1="18" x2="21" y2="18" />
  </svg>
);

const KeyIcon = ({ ...props }) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4"/>
    </svg>
);

const SignOutIcon = ({ ...props }) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
    <polyline points="16 17 21 12 16 7" />
    <line x1="21" y1="12" x2="9" y2="12" />
  </svg>
);

export default function AppNavbar() {
  const router = useRouter();
  const supabase = createClient();
  // const { user } = useAuth(); // ดึงข้อมูล user มาใช้ถ้าต้องการ
  // const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.refresh(); // สำคัญมาก: เพื่อให้ AuthContext อัปเดต
    router.push("/login");
  };

  return (
    <>
      <header className="sticky top-0 z-50 w-full bg-neutral-900 shadow-md dark:bg-gray-800">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          {/* Left Side: Logo */}
          <div className="flex items-center">
            <Image
              src="/images/logo-black.png" // แก้ไข path ของโลโก้คุณ
              alt="Company Logo"
              width={40}
              height={40}
              quality={100}
            />
          </div>

          {/* Right Side: Hamburger Menu */}
          <div className="hs-dropdown relative inline-flex">
            <button
              id="hs-dropdown-default"
              type="button"
              className="hs-dropdown-toggle inline-flex h-[38px] w-[38px] items-center justify-center rounded-lg bg-transparent text-white hover:bg-white hover:text-[#1F2937] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-neutral-900 focus:ring-white disabled:opacity-50 disabled:pointer-events-none"
              aria-haspopup="menu"
              aria-expanded="false"
              aria-label="Dropdown"
            >
              <HamburgerIcon className="h-[16px] w-[16px]" />
            </button>

            <div
              className="hs-dropdown-menu transition-[opacity,margin] duration hs-dropdown-open:opacity-100 opacity-0 hidden min-w-[120px] bg-white shadow-md rounded-lg mt-2 dark:bg-neutral-800 dark:border dark:border-neutral-700 dark:divide-neutral-700 after:h-4 after:absolute after:-bottom-4 after:start-0 after:w-[120px] before:h-4 before:absolute before:-top-4 before:start-0 before:w-[120px]"
              role="menu"
              aria-orientation="vertical"
              aria-labelledby="hs-dropdown-default"
            >
              <div className="p-1 space-y-0.5">
                <button
                  type="button"
                  className="flex w-full items-center gap-x-3.5 py-2 px-3 rounded-lg text-sm text-gray-800 hover:bg-gray-100"
                  data-hs-overlay="#change-password-modal"
                >
                  <KeyIcon className="h-5 w-5" /> Change Password
                </button>
                <a
                  className="flex items-center gap-x-3.5 py-2 px-3 rounded-lg text-sm text-gray-800 hover:bg-gray-100 focus:outline-hidden focus:bg-gray-100 dark:text-neutral-400 dark:hover:bg-neutral-700 dark:hover:text-neutral-300 dark:focus:bg-neutral-700"
                  href="#"
                  onClick={handleLogout}
                >
                  <SignOutIcon className="h-5 w-5" />{" "}
                  {/* ใช้ไอคอนตามรูปตัวอย่าง */}
                  Sign out
                </a>
              </div>
            </div>
          </div>
        </div>
      </header>
      <ChangePasswordModal />
    </>
  );
}
