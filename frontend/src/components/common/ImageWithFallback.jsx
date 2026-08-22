import React, { useState } from 'react';
import { Compass, ImageOff } from 'lucide-react';
import { clsx } from 'clsx';

export const ImageWithFallback = ({
  src,
  alt = 'Image',
  className = '',
  fallbackCategory = 'Experience',
  ...props
}) => {
  const [hasError, setHasError] = useState(!src);

  if (hasError || !src) {
    return (
      <div
        className={clsx(
          'w-full h-full bg-zinc-100 dark:bg-zinc-800 flex flex-col items-center justify-center text-zinc-600 dark:text-zinc-400 p-4 select-none',
          className
        )}
      >
        <Compass className="w-8 h-8 text-zinc-400 dark:text-zinc-500 mb-1 animate-pulse-subtle" />
        <span className="text-[10px] font-mono uppercase font-bold tracking-wider text-zinc-600 dark:text-zinc-400">
          {fallbackCategory}
        </span>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      className={className}
      onError={() => setHasError(true)}
      loading="lazy"
      {...props}
    />
  );
};
