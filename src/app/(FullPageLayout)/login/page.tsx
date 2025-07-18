'use client';

import { useState, FormEvent } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

// --- SVG Icons (ไม่เปลี่ยนแปลง) ---
const EyeIcon = ({ ...props }) => ( <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"> <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" /> <circle cx="12" cy="12" r="3" /> </svg> );
const EyeOffIcon = ({ ...props }) => ( <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"> <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24" /> <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68" /> <path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61" /> <line x1="2" x2="22" y1="2" y2="22" /> </svg> );
const SpinnerIcon = () => ( <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"> <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle> <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path> </svg> );


export default function LoginPage() {
  const router = useRouter();
  const supabase = createClient();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string; api?: string }>({});
  const [isLoading, setIsLoading] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const validateForm = () => {
    const newErrors: { email?: string; password?: string } = {};
    if (!email) {
      newErrors.email = 'Email is required.';
    }
    if (!password) {
      newErrors.password = 'Password is required.';
    }
    return newErrors;
  };

  const handleLogin = async (event: FormEvent) => {
    event.preventDefault();
    setErrors({});
    setIsLoading(true);

    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setIsLoading(false);
      return;
    }

    const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
    });

    if (error) {
        // --- ส่วนที่แก้ไข Logic ---
        let displayError = error.message;
        // 1. ตรวจสอบข้อความ error จาก Supabase
        if (error.message === 'Invalid login credentials') {
            // 2. เปลี่ยนเป็นข้อความที่เราต้องการ
            displayError = 'Email or Password is incorrect.';
        }

        // 3. ตั้งค่า error เพื่อให้แสดงผลใต้ช่อง password และทำให้ขอบเป็นสีแดง
        setErrors({
            email: ' ', // ทำให้ขอบ email เป็นสีแดง
            password: displayError, // แสดงข้อความนี้ใต้ช่อง password
        });
        // --- จบส่วนที่แก้ไข ---
    } else {
        router.push('/farm');
        router.refresh();
    }
    
    setIsLoading(false);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-900 px-4">
      <div className="w-full max-w-md space-y-8">
        <div className="rounded-2xl bg-white p-8 shadow-lg dark:bg-gray-800">
          <div className="mb-6 flex justify-center">
            <Image
              src="/images/logo-white.png"
              alt="Company Logo"
              width={48} 
              height={48}
              quality={100}
              priority
            />
          </div>

          <h2 className="text-center text-2xl font-bold tracking-tight text-[#1f2937] dark:text-white">
            Sign in
          </h2>

          <form className="mt-8 space-y-6" onSubmit={handleLogin} noValidate>
            <div className="space-y-4">
              {/* Email Input */}
              <div>
                <label htmlFor="email-address" className="sr-only">Email</label>
                <input
                  id="email-address"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (errors.email || errors.api) setErrors({});
                  }}
                  className={`relative block w-full appearance-none rounded-lg border px-3 py-3 text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 ${
                    errors.email ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                  }`}
                  placeholder="Email"
                />
                {errors.email && errors.email.trim() && <p className="mt-2 text-sm text-red-600">{errors.email}</p>}
              </div>

              {/* Password Input */}
              <div>
                <label htmlFor="password" className="sr-only">Password</label>
                <div className="relative">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="current-password"
                    required
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      if (errors.password || errors.api) setErrors({});
                    }}
                    className={`relative block w-full appearance-none rounded-lg border px-3 py-3 text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 ${
                      errors.password ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                    }`}
                    placeholder="Password"
                  />
                  <button
                    type="button"
                    onClick={togglePasswordVisibility}
                    className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                  >
                    {showPassword ? <EyeOffIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
                  </button>
                </div>
                {/* จุดนี้จะแสดงทั้ง "Password is required." และ "Email or Password is incorrect." */}
                {errors.password && errors.password.trim() && <p className="mt-2 text-sm text-red-600">{errors.password}</p>}
              </div>
            </div>

            {/* 4. ลบส่วนแสดง error.api ออกไป */}
            {/* {errors.api && ( ... )} */}

            <div className="pt-2">
              <button
                type="submit"
                disabled={isLoading}
                className="group relative flex w-full justify-center rounded-lg border border-transparent bg-[#888684] px-4 py-3 text-[15px] font-medium text-white hover:bg-neutral-700 focus:outline-none focus:neutral-2 focus:ring-neutral-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:bg-neutral-400 dark:bg-neutral-500 dark:hover:bg-neutral-600"
              >
                {isLoading ? <SpinnerIcon /> : 'Sign in'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
