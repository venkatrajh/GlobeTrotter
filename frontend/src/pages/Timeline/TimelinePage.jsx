import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTrips } from '../../context/TripContext';
import { usePreferences } from '../../context/PreferencesContext';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { ArrowLeft, Clock } from 'lucide-react';

export const TimelinePage = () => {
  const { tripId } = useParams();
  const navigate = useNavigate();
  const { trips, activeTrip, activeDay, setActiveDay } = useTrips();
  const { fmtCurrency, fmtTime } = usePreferences();

  const currentTrip = trips.find((t) => t.id === tripId) || activeTrip || trips[0];
  const itinerary = currentTrip?.itinerary || {};
  const dayData = itinerary[activeDay] || itinerary[1] || {
    dayNumber: 1,
    date: 'MAR 12',
    city: 'TOKYO',
    morning: [],
    afternoon: [],
    evening: [],
    dayTotalHours: 7,
    dayTotalCost: 2900
  };

  const timelineItems = [
    ...(dayData.morning || []).map((a) => ({ ...a, slotIcon: '☀️', timeLabel: a.time || '09:00 AM' })),
    ...(dayData.afternoon || []).map((a) => ({ ...a, slotIcon: '🌤️', timeLabel: a.time || '01:00 PM' })),
    ...(dayData.evening || []).map((a) => ({ ...a, slotIcon: '🌙', timeLabel: a.time || '07:00 PM' }))
  ];

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-8 py-8 space-y-8 text-left relative z-10">
      {/* Header */}
      <div className="flex items-center justify-between pb-6 border-b border-zinc-200/60 dark:border-zinc-800">
        <div>
          <button
            type="button"
            onClick={() => navigate(`/trips/${currentTrip.id}`)}
            className="text-xs font-bold uppercase tracking-wider text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-zinc-100 flex items-center gap-1 mb-2 hover:underline"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Overview
          </button>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl sm:text-4xl font-black uppercase tracking-tight text-zinc-950 dark:text-zinc-50">
              DAY {String(activeDay).padStart(2, '0')} — {dayData.city}
            </h1>
          </div>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={() => navigate(`/trips/${currentTrip.id}/builder`)}
          className="font-bold text-xs"
        >
          Open Builder →
        </Button>
      </div>

      {/* Day Selector Ribbon with Liquid Glass */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
        {[1, 2, 3].map((d) => (
          <button
            key={d}
            type="button"
            onClick={() => setActiveDay(d)}
            className={`px-4 py-2 rounded-2xl text-xs font-bold uppercase tracking-wider whitespace-nowrap transition-all border ${
              activeDay === d
                ? 'bg-zinc-950 text-white dark:bg-zinc-100 dark:text-zinc-950 border-zinc-950 dark:border-zinc-100 shadow-sm'
                : 'glass-secondary text-zinc-700 dark:text-zinc-300 hover:border-zinc-400'
            }`}
          >
            Day 0{d}
          </button>
        ))}
      </div>

      {/* Vertical Connected Timeline Graphic with Liquid Glass */}
      <div className="glass-primary rounded-3xl p-6 sm:p-10 shadow-2xl border">
        <div className="relative pl-6 sm:pl-10 space-y-8 before:absolute before:left-3 sm:before:left-5 before:top-3 before:bottom-3 before:w-0.5 before:bg-zinc-300 dark:before:bg-zinc-700">
          {timelineItems.map((item, idx) => (
            <div key={item.id || idx} className="relative group">
              {/* Node Icon on vertical line */}
              <div className="absolute -left-6 sm:-left-10 top-0 w-6 h-6 rounded-full bg-white dark:bg-zinc-900 border-2 border-zinc-950 dark:border-zinc-100 flex items-center justify-center text-[10px] font-bold text-zinc-950 dark:text-zinc-100 shadow-xs">
                ●
              </div>

              {/* Timeline Content Flashcard */}
              <div className="p-5 rounded-2xl glass-secondary border space-y-2 hover:border-zinc-400 transition-colors shadow-xs">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 font-mono text-xs font-bold text-zinc-700 dark:text-zinc-300">
                    <span>{item.slotIcon}</span>
                    <span>{fmtTime(item.timeLabel)}</span>
                  </div>
                  <Badge variant="outline" size="sm">
                    {item.category}
                  </Badge>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xl">{item.icon || '📍'}</span>
                  <h3 className="text-base sm:text-lg font-black text-zinc-950 dark:text-zinc-50 uppercase">
                    {item.title || item.name}
                  </h3>
                </div>

                {item.description && (
                  <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed font-medium">
                    {item.description}
                  </p>
                )}

                <div className="pt-2 flex items-center justify-between text-xs font-semibold text-zinc-600 dark:text-zinc-400 border-t border-zinc-200/50 dark:border-zinc-700/60">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" /> {item.duration}
                  </span>
                  <span className="font-black text-zinc-950 dark:text-zinc-50">
                    {fmtCurrency(item.cost, currentTrip.destination)}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Day Total Divider & Summary */}
        <div className="mt-10 pt-6 border-t-2 border-dashed border-zinc-200/70 dark:border-zinc-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div>
            <span className="text-[10px] font-mono uppercase font-bold tracking-widest text-zinc-600 dark:text-zinc-400">
              DAY TOTAL METRICS
            </span>
            <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-0.5 font-medium">Calculated from scheduled itinerary slots</p>
          </div>

          <div className="flex items-center gap-6 font-mono font-black text-sm sm:text-base text-zinc-950 dark:text-zinc-50">
            <span>⏱ {dayData.dayTotalHours || 7} Hours</span>
            <span>•</span>
            <span>{fmtCurrency(dayData.dayTotalCost || 2900, currentTrip.destination)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
