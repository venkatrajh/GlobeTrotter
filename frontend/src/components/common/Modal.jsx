import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { AppSurface } from './AppSurface';

export const Modal = ({
  isOpen,
  onClose,
  title,
  subtitle,
  children,
  maxWidth = 'max-w-xl', // 'max-w-md', 'max-w-lg', 'max-w-xl', 'max-w-2xl', 'max-w-3xl'
  className = '',
  showCloseButton = true
}) => {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-zinc-950/60 backdrop-blur-sm transition-opacity animate-in fade-in"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Dialog Container with Level 3 Floating Liquid Glass */}
      <AppSurface
        tier="floating"
        className={twMerge(
          clsx(
            'relative w-full z-10 rounded-3xl p-6 sm:p-8 shadow-2xl border',
            'transition-all transform scale-100 animate-in zoom-in-95 max-h-[90vh] flex flex-col',
            maxWidth,
            className
          )
        )}
      >
        {(title || showCloseButton) && (
          <div className="flex items-start justify-between gap-4 mb-6 shrink-0 text-left">
            <div>
              {title && (
                <h3 className="text-xl sm:text-2xl font-black tracking-tight text-zinc-950 dark:text-zinc-50 uppercase">
                  {title}
                </h3>
              )}
              {subtitle && (
                <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1 font-medium">
                  {subtitle}
                </p>
              )}
            </div>
            {showCloseButton && (
              <button
                type="button"
                onClick={onClose}
                className="p-2 rounded-xl text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-white/40 dark:hover:bg-zinc-800/60 transition-colors"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
        )}

        <div className="overflow-y-auto pr-1 flex-1">{children}</div>
      </AppSurface>
    </div>
  );
};
