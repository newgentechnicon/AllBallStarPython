// src/components/ui/SubmitButton.tsx
'use client';

import { useFormStatus } from 'react-dom';
import { SpinnerIcon } from './icons';

type SubmitButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  children: React.ReactNode;
};

export function SubmitButton({ children, ...props }: SubmitButtonProps) {
  const { pending } = useFormStatus();

  return (
    <button
      {...props}
      type="submit"
      disabled={pending}
      className="group relative flex w-full justify-center rounded-lg border border-transparent bg-[#888684] px-4 py-3 text-[15px] font-medium text-white hover:bg-neutral-700 focus:outline-none focus:ring-2 focus:ring-neutral-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:bg-neutral-400 dark:bg-neutral-500 dark:hover:bg-neutral-600"
    >
      {pending ? <SpinnerIcon /> : children}
    </button>
  );
}