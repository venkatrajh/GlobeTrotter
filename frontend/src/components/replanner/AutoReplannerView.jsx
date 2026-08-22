import React from 'react';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';
import { useTrips } from '../../context/TripContext';
import { CheckCircle2, AlertTriangle, ShieldCheck, Sparkles } from 'lucide-react';

export const AutoReplannerView = ({ onApply, onDismiss }) => {
  const { applyReplannerSuggestion } = useTrips();

  const handleApply = () => {
    applyReplannerSuggestion();
    if (onApply) onApply();
  };

  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col gap-8 text-left animate-in fade-in relative z-10">
      {/* Calm & Reassuring Hero with Liquid Glass */}
      <div className="glass-primary rounded-3xl p-6 sm:p-10 shadow-2xl border">
        <div className="flex items-center gap-2 text-zinc-400 text-xs font-mono font-bold tracking-widest uppercase mb-2">
          <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" /> CALM ASSIST • AUTO-REPLANNER
        </div>
        <h2 className="text-2xl sm:text-4xl font-black tracking-tight text-zinc-950 dark:text-zinc-50 mb-2 uppercase">
          WE'VE GOT THIS.
        </h2>
        <p className="text-sm sm:text-base text-zinc-600 dark:text-zinc-400 leading-relaxed max-w-2xl font-medium">
          Something changed with your trip schedule, but we already found a smoother, weatherproof plan for you.
        </p>

        {/* What Happened Section */}
        <div className="mt-8 p-5 rounded-2xl glass-secondary border border-amber-300 dark:border-amber-800 text-amber-950 dark:text-amber-200 flex items-start gap-3.5 shadow-xs">
          <AlertTriangle className="w-5 h-5 shrink-0 text-amber-600 dark:text-amber-400 mt-0.5" />
          <div>
            <span className="text-[10px] uppercase font-bold tracking-wider opacity-80 block mb-0.5">
              WHAT HAPPENED
            </span>
            <p className="text-sm font-bold">
              ⚠ Rain is expected during your Outdoor Museum visit at 2:00 PM.
            </p>
          </div>
        </div>

        {/* Side-by-Side Comparison: Before vs After */}
        <div className="mt-8">
          <span className="text-xs font-mono uppercase font-bold tracking-wider text-zinc-400 block mb-4">
            HERE'S WHAT WE RECOMMEND:
          </span>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* BEFORE */}
            <div className="p-6 rounded-2xl glass-secondary border space-y-4 shadow-xs">
              <div className="flex items-center justify-between border-b border-zinc-200/60 dark:border-zinc-700/60 pb-3">
                <span className="text-xs font-mono font-bold text-zinc-500 uppercase">
                  BEFORE (ORIGINAL PLAN)
                </span>
                <Badge variant="outline" size="sm">
                  Sub-optimal
                </Badge>
              </div>

              <div className="p-4 rounded-xl glass-secondary border opacity-80">
                <span className="text-xs font-mono font-bold text-zinc-500">2:00 PM</span>
                <h4 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 line-through mt-0.5">
                  Outdoor Museum & Garden
                </h4>
                <span className="text-[11px] text-rose-600 dark:text-rose-400 font-semibold block mt-1">
                  ⚠️ Heavy rain forecasted (80% chance)
                </span>
              </div>
            </div>

            {/* AFTER */}
            <div className="p-6 rounded-2xl glass-secondary border border-emerald-300/80 dark:border-emerald-800 space-y-4 shadow-sm">
              <div className="flex items-center justify-between border-b border-emerald-200 dark:border-emerald-800 pb-3">
                <span className="text-xs font-mono font-bold text-emerald-800 dark:text-emerald-300 uppercase flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" /> AFTER (OPTIMIZED PLAN)
                </span>
                <Badge variant="success" size="sm">
                  Recommended
                </Badge>
              </div>

              <div className="space-y-3">
                <div className="p-4 rounded-xl glass-primary border border-emerald-300/70 dark:border-emerald-800 shadow-xs">
                  <span className="text-xs font-mono font-bold text-zinc-500">10:00 AM</span>
                  <h4 className="text-sm font-bold text-zinc-950 dark:text-zinc-50 mt-0.5">
                    Outdoor Museum & Garden
                  </h4>
                  <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold block mt-1">
                    ✓ Moved to clear morning window
                  </span>
                </div>

                <div className="p-4 rounded-xl glass-primary border border-emerald-300/70 dark:border-emerald-800 shadow-xs">
                  <span className="text-xs font-mono font-bold text-zinc-500">2:30 PM</span>
                  <h4 className="text-sm font-bold text-zinc-950 dark:text-zinc-50 mt-0.5">
                    Indoor Modern Art Museum
                  </h4>
                  <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold block mt-1">
                    ✓ 100% sheltered & included in pass
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Clear Reassurance Points */}
        <div className="mt-8 p-5 rounded-2xl glass-secondary border space-y-2.5 shadow-xs">
          <div className="flex items-center gap-2.5 text-xs sm:text-sm font-bold text-zinc-950 dark:text-zinc-50">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
            <span>Your trip duration stays exactly the same</span>
          </div>
          <div className="flex items-center gap-2.5 text-xs sm:text-sm font-bold text-zinc-950 dark:text-zinc-50">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
            <span>No activities are removed or forgotten</span>
          </div>
          <div className="flex items-center gap-2.5 text-xs sm:text-sm font-bold text-zinc-950 dark:text-zinc-50">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
            <span>Your budget is completely unchanged</span>
          </div>
        </div>

        {/* Actions CTA */}
        <div className="mt-8 pt-6 border-t border-zinc-200/50 dark:border-zinc-800 flex flex-col sm:flex-row items-center justify-end gap-3">
          <Button
            variant="outline"
            size="md"
            onClick={onDismiss}
            className="w-full sm:w-auto font-bold text-xs"
          >
            Keep Current Plan
          </Button>
          <Button
            variant="primary"
            size="md"
            icon={CheckCircle2}
            onClick={handleApply}
            className="w-full sm:w-auto font-black text-xs uppercase px-6 shadow-md"
          >
            ✓ Apply Better Plan
          </Button>
        </div>
      </div>
    </div>
  );
};
