import { cn } from '@/lib/utils';
import { forwardRef, type InputHTMLAttributes } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helperText, className, ...props }, ref) => (
    <div className="flex flex-col gap-1">
      {label && (
        <label className="text-sm font-medium text-gray-700">{label}</label>
      )}
      <input
        ref={ref}
        {...props}
        className={cn(
          'rounded-lg border px-3 py-2 text-sm text-gray-900 placeholder-gray-400 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500',
          error
            ? 'border-red-400 focus:ring-red-400'
            : 'border-gray-300 hover:border-gray-400',
          className
        )}
      />
      {error && <p className="text-xs text-red-500">{error}</p>}
      {helperText && !error && <p className="text-xs text-gray-500">{helperText}</p>}
    </div>
  )
);
Input.displayName = 'Input';
