import React, { useState } from 'react';
import { clsx } from 'clsx';

export const Tooltip = ({
  children,
  text,
  position = 'right', // 'top', 'right', 'bottom', 'left'
  className = ''
}) => {
  const [isVisible, setIsVisible] = useState(false);

  if (!text) return children;

  const positions = {
    top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
    right: 'left-full top-1/2 -translate-y-1/2 ml-3',
    bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
    left: 'right-full top-1/2 -translate-y-1/2 mr-3'
  };

  return (
    <div
      className="relative flex items-center"
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
      onFocus={() => setIsVisible(true)}
      onBlur={() => setIsVisible(false)}
    >
      {children}
      {isVisible && (
        <div
          role="tooltip"
          className={clsx(
            'absolute z-50 px-2.5 py-1.5 text-xs font-semibold text-white bg-zinc-900 dark:bg-zinc-100 dark:text-zinc-900 rounded-lg shadow-lg whitespace-nowrap pointer-events-none transition-all duration-150 animate-in fade-in',
            positions[position],
            className
          )}
        >
          {text}
        </div>
      )}
    </div>
  );
};
