import React from 'react';
import { Compass } from 'lucide-react';
import { Button } from './Button';

export const EmptyState = ({
  icon: Icon = Compass,
  title = 'No items found',
  description = 'Try adjusting your search filters or create a new entry.',
  actionLabel,
  onAction
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center border-2 border-dashed border-zinc-200 dark:border-zinc-800 rounded-3xl bg-zinc-50/50 dark:bg-zinc-900/30">
      <div className="w-14 h-14 rounded-2xl bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 flex items-center justify-center text-zinc-900 dark:text-zinc-100 shadow-sm mb-4">
        <Icon className="w-7 h-7" />
      </div>
      <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100 tracking-tight">{title}</h3>
      <p className="text-sm text-zinc-500 dark:text-zinc-400 max-w-sm mt-1.5 mb-6">{description}</p>
      {actionLabel && onAction && (
        <Button variant="primary" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
};
