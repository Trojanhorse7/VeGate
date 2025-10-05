import * as React from 'react';
import { cn } from '@/lib/utils';

const Select = React.forwardRef<
  HTMLSelectElement,
  React.SelectHTMLAttributes<HTMLSelectElement>
>(({ className, children, ...props }, ref) => (
  <select
    ref={ref}
    className={cn(
      'flex h-10 w-full items-center justify-between rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:cursor-not-allowed disabled:opacity-50',
      className
    )}
    {...props}
  >
    {children}
  </select>
));
Select.displayName = 'Select';

const SelectValue = ({ children }: { children: React.ReactNode }) => (
  <span>{children}</span>
);

const SelectTrigger = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, children, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      'flex h-10 w-full items-center justify-between rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500',
      className
    )}
    {...props}
  >
    {children}
  </div>
));
SelectTrigger.displayName = 'SelectTrigger';

const SelectContent = ({ children }: { children: React.ReactNode }) => (
  <div className="relative z-50 min-w-[8rem] overflow-hidden rounded-md border bg-white shadow-md">
    {children}
  </div>
);

const SelectItem = React.forwardRef<
  HTMLOptionElement,
  React.OptionHTMLAttributes<HTMLOptionElement>
>(({ className, children, ...props }, ref) => (
  <option
    ref={ref}
    className={cn(
      'relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 px-2 text-sm outline-none hover:bg-gray-100',
      className
    )}
    {...props}
  >
    {children}
  </option>
));
SelectItem.displayName = 'SelectItem';

export { Select, SelectValue, SelectTrigger, SelectContent, SelectItem };
