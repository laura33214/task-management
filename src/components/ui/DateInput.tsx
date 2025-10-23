'use client';

import { forwardRef, useCallback, useRef, useImperativeHandle } from 'react';
import type { InputHTMLAttributes } from 'react';
import { cn } from './Button';

export type DateInputProps = InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
};

type HTMLDateInput = HTMLInputElement & { showPicker?: () => void };

export const DateInput = forwardRef<HTMLInputElement, DateInputProps>(
  ({ className, label, onClick, onFocus, onMouseDown, ...props }, ref) => {
    const localRef = useRef<HTMLInputElement | null>(null);
    useImperativeHandle(ref, () => localRef.current as HTMLInputElement, []);

    const openPicker = useCallback(() => {
      const el = localRef.current as HTMLDateInput | null;
      if (!el) return;
      try {
        if (typeof el.showPicker === 'function') {
          el.showPicker();
        } else {
          el.focus();
        }
      } catch {
        el.focus();
      }
    }, []);

    const handleMouseDown: React.MouseEventHandler<HTMLDivElement> = e => {
      e.preventDefault();
      openPicker();
    };

    return (
      <div className="relative" onMouseDown={handleMouseDown}>
        {label ? (
          <label className="mb-1 block text-xs font-medium text-gray-700">
            {label}
          </label>
        ) : null}
        <input
          ref={localRef}
          type="date"
          onClick={e => {
            onClick?.(e);
            openPicker();
          }}
          onFocus={e => {
            onFocus?.(e);
          }}
          onMouseDown={e => {
            onMouseDown?.(e);
          }}
          className={cn(
            'block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder-gray-400 shadow-sm transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none',
            className
          )}
          {...props}
        />
      </div>
    );
  }
);

DateInput.displayName = 'DateInput';
