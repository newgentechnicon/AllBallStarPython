// src/components/ui/PasswordInput.tsx
'use client';

import { useState } from 'react';
import { EyeIcon, EyeOffIcon } from './icons';

type PasswordInputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  hasError?: boolean;
};

// 👈 แก้ไขตรงนี้: ตรวจสอบให้แน่ใจว่า props ทั้งหมดถูกส่งต่อไปยัง <input>
export function PasswordInput({ hasError, className, ...props }: PasswordInputProps) {
  const [showPassword, setShowPassword] = useState(false);
  const toggleVisibility = () => setShowPassword(!showPassword);

  const defaultClassName = `relative block w-full appearance-none rounded-lg border px-3 py-3 text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 ${
    hasError ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
  }`;

  return (
    <div className="relative">
      <input
        // 👈 จุดสำคัญ: ส่ง props ทั้งหมด (รวมถึง name, id, etc.) มาที่นี่
        {...props} 
        type={showPassword ? 'text' : 'password'}
        // รวม className ที่อาจถูกส่งมากับ default
        className={className ? `${defaultClassName} ${className}` : defaultClassName}
      />
      <button
        type="button"
        onClick={toggleVisibility}
        className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
        aria-label={showPassword ? "Hide password" : "Show password"}
      >
        {showPassword ? (
          <EyeOffIcon className="h-5 w-5" />
        ) : (
          <EyeIcon className="h-5 w-5" />
        )}
      </button>
    </div>
  );
}