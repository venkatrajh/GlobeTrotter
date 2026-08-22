import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export const AppSurface = ({
  children,
  className = '',
  elevation = 'base', // 'none', 'base', 'elevated', 'card', 'ticket'
  tier = 'secondary', // 'primary', 'secondary', 'floating', 'none'
  border = true,
  hoverEffect = false,
  as: Component = 'div',
  ...props
}) => {
  const tierClasses = {
    primary: 'glass-primary',
    secondary: 'glass-secondary',
    floating: 'glass-floating',
    none: 'bg-slate-50/90 dark:bg-zinc-900/80'
  };

  const classes = twMerge(
    clsx(
      'transition-all duration-300 rounded-3xl',
      tierClasses[tier] || tierClasses.secondary,
      hoverEffect && 'hover:border-zinc-400 dark:hover:border-zinc-500 hover:shadow-xl hover:translate-y-[-2px] cursor-pointer',
      className
    )
  );

  return (
    <Component className={classes} {...props}>
      {children}
    </Component>
  );
};
