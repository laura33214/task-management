'use client';

import type { SelectHTMLAttributes } from 'react';
import { cn } from './Button';

export type SelectProps = SelectHTMLAttributes<HTMLSelectElement>;

const Select = ({ className, children, ...props }: SelectProps) => {
  return (
    <select
      className={cn(
        'block w-full appearance-none rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none',
        "bg-[url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke-width='2' stroke='%236b7280'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' d='M19.5 8.25l-7.5 7.5-7.5-7.5' /%3E%3C/svg%3E%22)] bg-no-repeat",
        'bg-[length:18px_18px] bg-[right_0.5rem_center] pr-9',
        className
      )}
      {...props}
    >
      {children}
    </select>
  );
};

export { Select };
