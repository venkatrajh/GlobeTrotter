import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export const Input = ({
  label,
  error,
  icon: Icon,
  type = 'text',
  className = '',
  id,
  placeholder,
  value,
  onChange,
  disabled = false,
  required = false,
  rightElement,
  ...props
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === 'password';
  const inputType = isPassword ? (showPassword ? 'text' : 'password') : type;

  return (
    <div className="w-full flex flex-col gap-1.5 text-left">
      {label && (
        <label htmlFor={id} className="text-xs font-bold uppercase tracking-wider text-zinc-700 dark:text-zinc-300">
          {label} {required && <span className="text-rose-500">*</span>}
        </label>
      )}
      <div className="relative flex items-center">
        {Icon && (
          <div className="absolute left-3.5 text-zinc-500 dark:text-zinc-400 pointer-events-none">
            <Icon className="w-4 h-4" />
          </div>
        )}
        <input
          id={id}
          type={inputType}
          value={value}
          onChange={onChange}
          disabled={disabled}
          placeholder={placeholder}
          className={twMerge(
            clsx(
              'w-full bg-white/70 dark:bg-zinc-900/80 text-zinc-950 dark:text-zinc-50 placeholder-zinc-400 dark:placeholder-zinc-500',
              'border border-zinc-300 dark:border-zinc-700 rounded-2xl px-4 py-2.5 text-sm font-medium transition-all duration-150',
              'focus:outline-none focus:ring-2 focus:ring-zinc-950 dark:focus:ring-zinc-100 focus:border-transparent',
              'disabled:bg-zinc-100 dark:disabled:bg-zinc-800 disabled:cursor-not-allowed shadow-xs',
              Icon && 'pl-10',
              (isPassword || rightElement) && 'pr-11',
              error && 'border-rose-500 focus:ring-rose-500',
              className
            )
          )}
          {...props}
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3.5 text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors p-1"
            tabIndex={-1}
            aria-label={showPassword ? 'Hide password' : 'Show password'}
          >
            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        )}
        {!isPassword && rightElement && (
          <div className="absolute right-3.5">{rightElement}</div>
        )}
      </div>
      {error && <span className="text-xs text-rose-500 font-medium mt-0.5">{error}</span>}
    </div>
  );
};
