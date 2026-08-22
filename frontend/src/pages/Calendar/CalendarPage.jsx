import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export const CalendarPage = () => {
  const navigate = useNavigate();
  const [currentMonth, setCurrentMonth] = useState('March 2026');

  // Days in month mock representation
  const daysInMonth = Array.from({ length: 31 }, (_, i) => i + 1);

  // Trips scheduled days map
  const tripDaysMap = {
    12: { tripTitle: 'Tokyo Arrival', flag: '🇯🇵', color: 'bg-zinc-950 text-white dark:bg-zinc-100 dark:text-zinc-950' },
    13: { tripTitle: 'Tokyo Sights', flag: '🗼', color: 'bg-zinc-900 text-white dark:bg-zinc-200 dark:text-zinc-900' },
    14: { tripTitle: 'Tokyo Museums', flag: '🏛️', color: 'bg-zinc-800 text-white dark:bg-zinc-300 dark:text-zinc-900' },
    15: { tripTitle: 'Tokyo Shopping', flag: '🛍️', color: 'bg-zinc-800 text-white dark:bg-zinc-300 dark:text-zinc-900' },
    16: { tripTitle: 'Shinkansen to Kyoto', flag: '🚅', color: 'bg-zinc-950 text-white dark:bg-zinc-100 dark:text-zinc-950' },
    17: { tripTitle: 'Kyoto Shrines', flag: '⛩', color: 'bg-zinc-900 text-white dark:bg-zinc-200 dark:text-zinc-900' },
    18: { tripTitle: 'Kyoto Bamboo', flag: '🌿', color: 'bg-zinc-800 text-white dark:bg-zinc-300 dark:text-zinc-900' },
    19: { tripTitle: 'Kyoto Gion Walk', flag: '🏮', color: 'bg-zinc-800 text-white dark:bg-zinc-300 dark:text-zinc-900' },
    20: { tripTitle: 'Transit to Osaka', flag: '🚅', color: 'bg-zinc-950 text-white dark:bg-zinc-100 dark:text-zinc-950' },
    21: { tripTitle: 'Osaka Castle', flag: '🏯', color: 'bg-zinc-900 text-white dark:bg-zinc-200 dark:text-zinc-900' },
    22: { tripTitle: 'Dotonbori Feast', flag: '🍜', color: 'bg-zinc-800 text-white dark:bg-zinc-300 dark:text-zinc-900' },
    23: { tripTitle: 'Universal / Minoh', flag: '🎢', color: 'bg-zinc-800 text-white dark:bg-zinc-300 dark:text-zinc-900' },
    24: { tripTitle: 'Departure NRT', flag: '✈️', color: 'bg-zinc-950 text-white dark:bg-zinc-100 dark:text-zinc-950' }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-8 py-8 space-y-8 text-left relative z-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <span className="text-[11px] font-mono uppercase font-bold tracking-widest text-zinc-400">
            EXPEDITION SCHEDULE
          </span>
          <h1 className="text-3xl sm:text-4xl font-black uppercase tracking-tight text-zinc-950 dark:text-zinc-50 mt-1">
            TRAVEL CALENDAR
          </h1>
          <p className="text-sm text-zinc-600 dark:text-zinc-400 font-medium mt-1">
            View upcoming itineraries, city check-ins, and departures on your schedule.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 glass-secondary border rounded-2xl p-1.5 shadow-xs">
            <button
              type="button"
              className="p-1.5 rounded-lg text-zinc-500 hover:text-zinc-950 dark:hover:text-zinc-100"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="text-xs font-mono font-bold px-2 text-zinc-950 dark:text-zinc-50">{currentMonth}</span>
            <button
              type="button"
              className="p-1.5 rounded-lg text-zinc-500 hover:text-zinc-950 dark:hover:text-zinc-100"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Calendar Grid Container with Liquid Glass */}
      <div className="glass-primary rounded-3xl p-6 sm:p-8 shadow-2xl border">
        {/* Days of week */}
        <div className="grid grid-cols-7 gap-2 text-center text-xs font-mono font-bold uppercase text-zinc-500 dark:text-zinc-400 pb-4 border-b border-zinc-200/60 dark:border-zinc-800">
          <div>Sun</div>
          <div>Mon</div>
          <div>Tue</div>
          <div>Wed</div>
          <div>Thu</div>
          <div>Fri</div>
          <div>Sat</div>
        </div>

        {/* Days grid */}
        <div className="grid grid-cols-7 gap-2 pt-4">
          {daysInMonth.map((day) => {
            const event = tripDaysMap[day];

            return (
              <div
                key={day}
                onClick={() => event && navigate('/trips/japan-adventure/builder')}
                className={`min-h-[90px] p-2 rounded-2xl border transition-all flex flex-col justify-between ${
                  event
                    ? 'border-zinc-400 dark:border-zinc-600 glass-secondary cursor-pointer hover:shadow-lg hover:scale-102'
                    : 'border-zinc-200/40 dark:border-zinc-800/40 bg-transparent text-zinc-400'
                }`}
              >
                <span className="text-xs font-mono font-bold text-zinc-950 dark:text-zinc-50">{day}</span>

                {event && (
                  <div className={`p-1.5 rounded-xl text-[10px] font-bold truncate leading-tight shadow-xs ${event.color}`}>
                    <span>{event.flag} </span>
                    <span className="hidden sm:inline">{event.tripTitle}</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
