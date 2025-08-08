'use client';

import Link from 'next/link';
import { useFormStatus } from 'react-dom';
import type { LinkProps } from 'next/link';
import type { ReactNode, ComponentProps } from 'react';
import { SpinnerIcon } from './icons'; // Assuming SpinnerIcon is in icons.tsx

// --- Base Styles ---
const primaryClasses = "py-3 px-4 min-w-[160px] inline-flex justify-center items-center gap-x-2 text-sm font-medium rounded-lg border border-transparent bg-neutral-500 !text-white hover:bg-neutral-600 focus:outline-none focus:bg-neutral-600 disabled:opacity-50 disabled:pointer-events-none dark:!text-white";
const secondaryClasses = "py-3 px-4 min-w-[160px] inline-flex justify-center items-center gap-x-2 text-sm font-medium rounded-lg border border-neutral-500 !text-neutral-500 hover:border-neutral-800 hover:text-neutral-800 focus:outline-none focus:border-neutral-800 focus:text-neutral-800 disabled:opacity-50 disabled:pointer-events-none dark:border-neutral-400 dark:!text-neutral-400 dark:hover:text-neutral-300 dark:hover:border-neutral-300";


// --- Link Buttons ---
// Use these when you need a button that acts as a navigation link.

interface ButtonLinkProps extends LinkProps {
  children: ReactNode;
  className?: string;
}

/**
 * A primary-styled navigation link that looks like a button.
 */
export function PrimaryButton({ children, className = '', ...props }: ButtonLinkProps) {
  return (
    <Link {...props} className={`${primaryClasses} ${className}`}>
      {children}
    </Link>
  );
}

/**
 * A secondary-styled navigation link that looks like a button.
 */
export function SecondaryButton({ children, className = '', ...props }: ButtonLinkProps) {
  return (
    <Link {...props} className={`${secondaryClasses} ${className}`}>
      {children}
    </Link>
  );
}


// --- Standard & Submit Buttons ---
// Use these for form submissions or client-side actions.

interface ButtonProps extends ComponentProps<'button'> {
  children: ReactNode;
  variant?: 'primary' | 'secondary';
}

/**
 * A versatile button for form submissions or client-side onClick events.
 * It automatically shows a loading spinner when used inside a <form>.
 */
export function Button({ children, variant = 'primary', className = '', ...props }: ButtonProps) {
  const { pending } = useFormStatus();
  
  const variantClasses = variant === 'primary' ? primaryClasses : secondaryClasses;

  return (
    <button
      {...props}
      type={props.type || 'submit'} // Default to submit, can be overridden
      disabled={props.disabled || pending}
      className={`${variantClasses} ${className}`}
    >
      {pending && props.type !== 'button' ? <SpinnerIcon /> : children}
    </button>
  );
}
