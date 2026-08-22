import React from 'react';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';
import { useTrips } from '../../context/TripContext';
import { usePreferences } from '../../context/PreferencesContext';
import { TransportIcon } from '../travel/TransportIcon';
import { Zap, Clock, MapPin, Repeat, Check } from 'lucide-react';

export const RouteOptimizerView = ({ onApply }) => {
  const { applyRouteOptimization } = useTrips();
  const { fmtDistance } = usePreferences();

  const handleApply = () => {
    applyRouteOptimization();
    if (onApply) onApply();
  };

  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col gap-8 text-left animate-in fade-in relative z-10">
      <div className="glass-primary rounded-3xl p-6 sm:p-10 shadow-2xl border">
        <div className="flex items-center gap-2 text-zinc-600 dark:text-zinc-400 text-xs font-mono font-bold tracking-widest uppercase mb-2">
          <Zap className="w-4 h-4 text-amber-500" /> ROUTE INTELLIGENCE ENGINE
        </div>
        <h2 className="text-2xl sm:text-4xl font-black tracking-tight text-zinc-950 dark:text-zinc-50 mb-2 uppercase">
          SMARTER WAY TO TRAVEL
        </h2>
        <p className="text-sm sm:text-base text-zinc-600 dark:text-zinc-400 leading-relaxed max-w-2xl font-medium">
          Your current route works, but our route solver found a significantly faster sequence with less backtracking.
        </p>

        {/* Side-by-Side Comparison with Liquid Glass */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-8">
          {/* CURRENT ROUTE */}
          <div className="p-6 rounded-3xl glass-secondary border flex flex-col justify-between shadow-xs">
            <div>
              <div className="flex items-center justify-between border-b border-zinc-200/60 dark:border-zinc-700/60 pb-3 mb-4">
                <span className="text-xs font-mono font-bold text-zinc-600 dark:text-zinc-400 uppercase">
                  CURRENT ROUTE
                </span>
                <span className="text-xs font-bold text-rose-500">Backtracking detected</span>
              </div>

              {/* Graphic Route nodes */}
              <div className="p-4 rounded-2xl glass-secondary border font-mono text-xs space-y-3">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-zinc-950 dark:bg-zinc-100" />
                  <span className="font-bold text-zinc-950 dark:text-zinc-50">Tokyo</span>
                </div>
                <div className="pl-3 text-zinc-500 dark:text-zinc-400 text-[11px] flex items-center gap-1.5 font-bold">
                  <span>╲</span>
                  <TransportIcon type="flight" className="w-3 h-3" />
                  <span>3h 10m Flight</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-zinc-950 dark:bg-zinc-100" />
                  <span className="font-bold text-zinc-950 dark:text-zinc-50">Osaka</span>
                </div>
                <div className="pl-3 text-zinc-500 dark:text-zinc-400 text-[11px] flex items-center gap-1.5 font-bold">
                  <span>╱</span>
                  <TransportIcon type="train" className="w-3 h-3" />
                  <span>1h 20m Transit (Backtrack)</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-zinc-950 dark:bg-zinc-100" />
                  <span className="font-bold text-zinc-950 dark:text-zinc-50">Kyoto</span>
                </div>
              </div>
            </div>

            <div className="pt-4 mt-4 border-t border-zinc-200/60 dark:border-zinc-700/60 flex items-center justify-between font-mono text-xs font-semibold">
              <span className="text-zinc-600 dark:text-zinc-400">Total Travel:</span>
              <span className="font-bold text-zinc-950 dark:text-zinc-100">4h 30m ({fmtDistance(510, 0)})</span>
            </div>
          </div>

          {/* SMARTER ROUTE */}
          <div className="p-6 rounded-3xl glass-secondary border flex flex-col justify-between shadow-lg">
            <div>
              <div className="flex items-center justify-between border-b border-zinc-200/60 dark:border-zinc-700 pb-3 mb-4">
                <span className="text-xs font-mono font-bold tracking-wider uppercase flex items-center gap-1.5 text-zinc-950 dark:text-zinc-50">
                  <Zap className="w-3.5 h-3.5 text-amber-500 fill-amber-500" /> SMARTER ROUTE
                </span>
                <Badge variant="success" size="sm">
                  Optimal Order
                </Badge>
              </div>

              {/* Graphic Route nodes */}
              <div className="p-4 rounded-2xl glass-primary border font-mono text-xs space-y-3 shadow-xs">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-zinc-950 dark:bg-zinc-100" />
                  <span className="font-bold text-zinc-950 dark:text-zinc-50">Tokyo</span>
                </div>
                <div className="pl-3 text-zinc-500 dark:text-zinc-400 text-[11px] flex items-center gap-1.5 font-bold">
                  <span>│</span>
                  <TransportIcon type="train" className="w-3 h-3" />
                  <span>1h 25m Direct Shinkansen</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-zinc-950 dark:bg-zinc-100" />
                  <span className="font-bold text-zinc-950 dark:text-zinc-50">Kyoto</span>
                </div>
                <div className="pl-3 text-zinc-500 dark:text-zinc-400 text-[11px] flex items-center gap-1.5 font-bold">
                  <span>│</span>
                  <TransportIcon type="train" className="w-3 h-3" />
                  <span>45m Rapid Express</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-zinc-950 dark:bg-zinc-100" />
                  <span className="font-bold text-zinc-950 dark:text-zinc-50">Osaka</span>
                </div>
              </div>
            </div>

            <div className="pt-4 mt-4 border-t border-zinc-200/60 dark:border-zinc-700 flex items-center justify-between font-mono text-xs font-semibold">
              <span className="text-zinc-600 dark:text-zinc-400">Optimized Travel:</span>
              <span className="font-bold text-zinc-950 dark:text-zinc-50">2h 10m ({fmtDistance(468, 0)})</span>
            </div>
          </div>
        </div>

        {/* YOU SAVE Stats */}
        <div className="p-6 rounded-3xl glass-secondary border shadow-xs">
          <span className="text-[10px] font-mono uppercase font-bold tracking-wider text-zinc-600 dark:text-zinc-400 block mb-4">
            YOU SAVE:
          </span>
          <div className="grid grid-cols-3 gap-4 text-left">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl glass-secondary border flex items-center justify-center text-zinc-950 dark:text-zinc-50 shadow-xs">
                <Clock className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              </div>
              <div>
                <p className="text-base sm:text-xl font-black text-zinc-950 dark:text-zinc-50">
                  ⏱ 2h 20m
                </p>
                <span className="text-[10px] uppercase font-bold text-zinc-500 dark:text-zinc-400">Transit Saved</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl glass-secondary border flex items-center justify-center text-zinc-950 dark:text-zinc-50 shadow-xs">
                <MapPin className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              </div>
              <div>
                <p className="text-base sm:text-xl font-black text-zinc-950 dark:text-zinc-50">
                  📍 {fmtDistance(42, 0)}
                </p>
                <span className="text-[10px] uppercase font-bold text-zinc-500 dark:text-zinc-400">Distance Avoided</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl glass-secondary border flex items-center justify-center text-zinc-950 dark:text-zinc-50 shadow-xs">
                <Repeat className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              </div>
              <div>
                <p className="text-base sm:text-xl font-black text-zinc-950 dark:text-zinc-50">
                  🔄 3 changes
                </p>
                <span className="text-[10px] uppercase font-bold text-zinc-500 dark:text-zinc-400">Fewer Transfers</span>
              </div>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="mt-8 pt-6 border-t border-zinc-200/50 dark:border-zinc-800 flex justify-end">
          <Button
            type="submit"
            variant="primary"
            size="lg"
            icon={Check}
            onClick={handleApply}
            className="w-full sm:w-auto font-black text-sm uppercase px-8 shadow-xl"
          >
            APPLY SMARTER ROUTE
          </Button>
        </div>
      </div>
    </div>
  );
};
