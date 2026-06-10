import { cn } from '@/lib/utils';
import { forwardRef, type TextareaHTMLAttributes } from 'react';

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, className, ...props }, ref) => (
    <div className="flex flex-col gap-1">
      {label && <label className="text-sm font-medium text-gray-700">{label}</label>}
      <textarea
        ref={ref}
        rows={3}
        {...props}
        className={cn(
          'resize-none rounded-lg border px-3 py-2 text-sm text-gray-900 placeholder-gray-400 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500',
          error ? 'border-red-400' : 'border-gray-300',
          className
        )}
      />
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  )
);
Textarea.displayName = 'Textarea';
