import React from 'react';
import { AppSurface } from './AppSurface';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export const Card = ({
  children,
  className = '',
  hoverable = false,
  tier = 'secondary',
  padding = 'md', // 'none', 'sm', 'md', 'lg'
  onClick,
  ...props
}) => {
  const paddings = {
    none: 'p-0',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8'
  };

  return (
    <AppSurface
      tier={tier}
      hoverEffect={hoverable}
      className={twMerge(clsx('rounded-3xl overflow-hidden', paddings[padding], className))}
      onClick={onClick}
      {...props}
    >
      {children}
    </AppSurface>
  );
};

export const Panel = ({
  children,
  className = '',
  tier = 'primary',
  padding = 'md',
  ...props
}) => {
  const paddings = {
    none: 'p-0',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8'
  };

  return (
    <AppSurface
      tier={tier}
      className={twMerge(clsx('rounded-3xl', paddings[padding], className))}
      {...props}
    >
      {children}
    </AppSurface>
  );
};
