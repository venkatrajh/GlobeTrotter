import React from 'react';
import { ActivityFlashcard } from './ActivityFlashcard';
import { Button } from '../common/Button';
import { Plus } from 'lucide-react';

export const TimeSlotSection = ({
  title, // '☀️ MORNING', '🌤️ AFTERNOON', '🌙 EVENING'
  slotKey, // 'morning', 'afternoon', 'evening'
  activities = [],
  dayNumber,
  onAddActivity,
  onDeleteActivity
}) => {
  return (
    <div className="flex flex-col gap-3 text-left">
      <div className="flex items-center justify-between">
        <h3 className="text-sm sm:text-base font-black tracking-wider uppercase text-zinc-950 dark:text-zinc-50 flex items-center gap-2">
          {title}
        </h3>
        <button
          type="button"
          onClick={() => onAddActivity(slotKey)}
          className="text-xs font-bold text-zinc-600 hover:text-zinc-950 dark:text-zinc-400 dark:hover:text-zinc-100 flex items-center gap-1 hover:underline p-1"
        >
          <Plus className="w-3.5 h-3.5" /> Add
        </button>
      </div>

      <div className="flex flex-col gap-3">
        {activities.length > 0 ? (
          activities.map((activity) => (
            <ActivityFlashcard
              key={activity.id}
              activity={activity}
              slot={slotKey}
              dayNumber={dayNumber}
              onDelete={() => onDeleteActivity(slotKey, activity.id)}
            />
          ))
        ) : (
          <div
            onClick={() => onAddActivity(slotKey)}
            className="p-6 rounded-2xl border-2 border-dashed border-zinc-200 dark:border-zinc-800 hover:border-zinc-400 dark:hover:border-zinc-600 bg-zinc-50/50 dark:bg-zinc-900/40 cursor-pointer flex items-center justify-center gap-2 text-xs font-semibold text-zinc-600 dark:text-zinc-400 transition-colors"
          >
            <Plus className="w-4 h-4 text-zinc-600 dark:text-zinc-400" />
            <span>No activity planned yet. Click to add to {title}.</span>
          </div>
        )}
      </div>
    </div>
  );
};
