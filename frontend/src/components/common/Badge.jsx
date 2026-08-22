import React from 'react';
import { ChevronDown } from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export const Select = ({
  label,
  options = [],
  value,
  onChange,
  className = '',
  id,
  ...props
}) => {
  return (
    <div className="w-full flex flex-col gap-1.5 text-left">
      {label && (
        <label htmlFor={id} className="text-xs font-bold uppercase tracking-wider text-zinc-700 dark:text-zinc-300">
          {label}
        </label>
      )}
      <div className="relative flex items-center">
        <select
          id={id}
          value={value}
          onChange={onChange}
          className={twMerge(
            clsx(
              'w-full appearance-none bg-white/70 dark:bg-zinc-900/80 text-zinc-950 dark:text-zinc-50',
              'border border-zinc-300 dark:border-zinc-700 rounded-2xl px-4 py-2.5 pr-10 text-sm font-medium transition-all duration-150',
              'focus:outline-none focus:ring-2 focus:ring-zinc-950 dark:focus:ring-zinc-100 focus:border-transparent cursor-pointer shadow-xs',
              className
            )
          )}
          {...props}
        >
          {options.map((opt) => (
            <option key={opt.value ?? opt} value={opt.value ?? opt} className="bg-white dark:bg-zinc-900 text-zinc-950 dark:text-zinc-50">
              {opt.label ?? opt}
            </option>
          ))}
        </select>
        <div className="absolute right-3.5 text-zinc-500 pointer-events-none">
          <ChevronDown className="w-4 h-4" />
        </div>
      </div>
    </div>
  );
};

export const Badge = ({
  children,
  variant = 'default', // 'default', 'dark', 'outline', 'success', 'warning', 'info'
  size = 'md', // 'sm', 'md', 'lg'
  className = '',
  icon: Icon
}) => {
  const variants = {
    default: 'bg-white/70 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 border border-zinc-300/80 dark:border-zinc-700',
    dark: 'bg-zinc-950 dark:bg-zinc-100 text-white dark:text-zinc-950 border border-zinc-950 dark:border-zinc-100 shadow-xs',
    outline: 'bg-white/40 dark:bg-transparent border border-zinc-300 dark:border-zinc-700 text-zinc-800 dark:text-zinc-200',
    success: 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800',
    warning: 'bg-amber-50 dark:bg-amber-950/50 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-800',
    info: 'bg-sky-50 dark:bg-sky-950/50 text-sky-800 dark:text-sky-300 border border-sky-300 dark:border-sky-800'
  };

  const sizes = {
    sm: 'text-[11px] px-2 py-0.5 rounded-md gap-1 font-semibold',
    md: 'text-xs px-2.5 py-1 rounded-xl gap-1.5 font-bold',
    lg: 'text-sm px-3.5 py-1.5 rounded-xl gap-2 font-bold'
  };

  return (
    <span className={twMerge(clsx('inline-flex items-center tracking-tight', variants[variant], sizes[size], className))}>
      {Icon && <Icon className="w-3.5 h-3.5 shrink-0" />}
      {children}
    </span>
  );
};
