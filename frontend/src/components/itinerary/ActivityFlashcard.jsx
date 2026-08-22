import React, { useState } from 'react';
import { usePreferences } from '../../context/PreferencesContext';
import { MoreVertical, Clock, Trash2, MapPin } from 'lucide-react';
import { clsx } from 'clsx';

export const ActivityFlashcard = ({
  activity,
  slot,
  dayNumber,
  onDelete
}) => {
  const { fmtCurrency, fmtTime } = usePreferences();
  const [showMenu, setShowMenu] = useState(false);

  return (
    <div className="glass-secondary relative group hover:border-zinc-400 dark:hover:border-zinc-600 rounded-3xl p-5 shadow-sm transition-all duration-200 text-left border">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-2xl bg-white/60 dark:bg-zinc-800/80 border flex items-center justify-center text-2xl shrink-0 shadow-xs">
            {activity.icon || '📍'}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="text-base sm:text-lg font-black tracking-tight text-zinc-950 dark:text-zinc-50 uppercase">
                {activity.title || activity.name}
              </h4>
              {activity.time && (
                <span className="text-[11px] font-mono font-bold px-2 py-0.5 rounded-lg glass-secondary text-zinc-700 dark:text-zinc-300 border">
                  {fmtTime(activity.time)}
                </span>
              )}
            </div>

            <div className="flex items-center flex-wrap gap-2 text-xs font-bold text-zinc-600 dark:text-zinc-400 mt-1">
              <span>{activity.category}</span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-zinc-400" /> {activity.duration}
              </span>
              <span>•</span>
              <span className="text-zinc-950 dark:text-zinc-50 font-black">
                {fmtCurrency(activity.cost)}
              </span>
            </div>
            {activity.description && (
              <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-2 line-clamp-2 max-w-xl font-medium">
                {activity.description}
              </p>
            )}
          </div>
        </div>

        {/* Action Menu button */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setShowMenu(!showMenu)}
            className="p-2 rounded-xl text-zinc-400 hover:text-zinc-950 dark:hover:text-zinc-100 hover:bg-white/50 dark:hover:bg-zinc-800/60 transition-colors"
            aria-label="Activity options"
          >
            <MoreVertical className="w-4 h-4" />
          </button>

          {showMenu && (
            <div className="glass-floating absolute right-0 top-10 z-20 w-36 rounded-2xl shadow-2xl py-1 text-xs border">
              <button
                type="button"
                onClick={() => {
                  setShowMenu(false);
                  if (onDelete) onDelete(activity.id);
                }}
                className="w-full px-3 py-2 text-left text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 flex items-center gap-2 font-bold"
              >
                <Trash2 className="w-3.5 h-3.5" /> Remove
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
