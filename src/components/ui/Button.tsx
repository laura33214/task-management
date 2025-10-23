'use client';

import type { ButtonHTMLAttributes, PropsWithChildren } from 'react';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  fullWidth?: boolean;
}

export function Button({
  children,
  className,
  variant = 'primary',
  fullWidth,
  ...props
}: PropsWithChildren<ButtonProps>) {
  const base =
    'inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none h-9 px-4 py-2 shadow-sm';

  const variants: Record<NonNullable<ButtonProps['variant']>, string> = {
    primary:
      'bg-blue-600 text-white hover:bg-blue-700 focus-visible:ring-blue-600 shadow-blue-600/10',
    secondary:
      'bg-gray-100 text-gray-900 hover:bg-gray-200 focus-visible:ring-gray-400 shadow-gray-400/10',
    danger:
      'bg-red-600 text-white hover:bg-red-700 focus-visible:ring-red-600 shadow-red-600/10',
    ghost:
      'bg-transparent hover:bg-gray-100 text-gray-900 focus-visible:ring-gray-400 shadow-none',
  };

  return (
    <button
      className={cn(
        base,
        variants[variant],
        fullWidth ? 'w-full' : '',
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}

function clsx(...parts: Array<string | undefined | false>) {
  return parts.filter(Boolean).join(' ');
}

export function cn(...parts: Array<string | undefined | false>) {
  return clsx(...parts);
}
