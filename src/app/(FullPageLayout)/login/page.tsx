// src/app/(FullPageLayout)/login/page.tsx
import Image from 'next/image';
import { LoginForm } from './_components/LoginForm';

export default function LoginPage() {
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

          <LoginForm />
          
        </div>
      </div>
    </div>
  );
}