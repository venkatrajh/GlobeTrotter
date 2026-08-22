import React from 'react';
import { TransportIcon } from './TransportIcon';
import { ArrowDown } from 'lucide-react';
import { clsx } from 'clsx';

export const RouteVisualizer = ({
  stops = [],
  orientation = 'horizontal', // 'horizontal', 'vertical', 'compact'
  interactive = false,
  activeStopIndex = null,
  onSelectStop,
  className = ''
}) => {
  if (!stops || stops.length === 0) return null;

  if (orientation === 'compact') {
    return (
      <div className={clsx('flex items-center flex-wrap gap-2 text-xs font-semibold tracking-tight text-zinc-800 dark:text-zinc-200', className)}>
        {stops.map((stop, idx) => {
          const isLast = idx === stops.length - 1;
          const transport = stop.transportToNext;
          const cityName = stop.cityName || stop.name || stop;

          return (
            <React.Fragment key={stop.id || cityName || idx}>
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-zinc-950 dark:bg-zinc-100 shrink-0" />
                <span className="font-bold">{cityName}</span>
              </span>
              {!isLast && (
                <span className="flex items-center gap-1 text-zinc-400 dark:text-zinc-500 px-1 font-mono text-[11px]">
                  <span>──</span>
                  <TransportIcon type={transport?.mode || 'flight'} className="w-3 h-3 text-zinc-700 dark:text-zinc-300" />
                  <span>──</span>
                </span>
              )}
            </React.Fragment>
          );
        })}
      </div>
    );
  }

  if (orientation === 'vertical') {
    return (
      <div className={clsx('flex flex-col py-3 select-none', className)}>
        {stops.map((stop, idx) => {
          const isLast = idx === stops.length - 1;
          const isSelected = activeStopIndex === idx;
          const transport = stop.transportToNext;
          const cityName = stop.cityName || stop.name;
          const countryName = stop.country || stop.countryName || 'Japan';

          return (
            <div key={stop.id || idx} className="flex flex-col">
              {/* City Stop Row */}
              <div
                onClick={() => interactive && onSelectStop && onSelectStop(idx)}
                className={clsx(
                  'flex items-center gap-4 p-3.5 rounded-2xl transition-all duration-200',
                  interactive && 'cursor-pointer hover:bg-zinc-100 dark:hover:bg-zinc-800',
                  isSelected && 'bg-zinc-100 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 shadow-xs'
                )}
              >
                <div className="flex flex-col items-center">
                  <div
                    className={clsx(
                      'w-5 h-5 rounded-full flex items-center justify-center font-bold text-xs shadow-xs',
                      isSelected
                        ? 'bg-zinc-950 text-white dark:bg-zinc-100 dark:text-zinc-950 scale-110'
                        : 'bg-white dark:bg-zinc-900 border-2 border-zinc-950 dark:border-zinc-100'
                    )}
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-current" />
                  </div>
                </div>

                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-base font-bold uppercase tracking-wider text-zinc-950 dark:text-zinc-100">
                      {cityName}
                    </span>
                    {stop.code && (
                      <span className="text-xs font-mono font-bold px-1.5 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400">
                        {stop.code}
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5 font-medium">
                    {countryName} {stop.dateRange ? `• ${stop.dateRange}` : ''}
                  </div>
                </div>

                {interactive && (
                  <span className="text-xs font-semibold text-zinc-400 group-hover:text-zinc-900">
                    {isSelected ? 'Selected' : 'View Plan →'}
                  </span>
                )}
              </div>

              {/* Transit Connector Line */}
              {!isLast && (
                <div className="flex items-center gap-4 my-1.5 pl-5">
                  <div className="w-0.5 h-12 bg-zinc-300 dark:bg-zinc-700 relative">
                    <ArrowDown className="w-3.5 h-3.5 absolute -bottom-1.5 -left-[5.5px] text-zinc-400" />
                  </div>
                  <div className="flex items-center gap-2.5 text-xs font-medium text-zinc-600 dark:text-zinc-400 bg-zinc-100/80 dark:bg-zinc-800/80 px-3 py-1.5 rounded-xl border border-zinc-200/60 dark:border-zinc-700/60 shadow-xs">
                    <TransportIcon type={transport?.mode || 'flight'} className="w-3.5 h-3.5 text-zinc-950 dark:text-zinc-100" />
                    <span className="font-bold text-zinc-800 dark:text-zinc-200">
                      {transport?.label || transport?.mode || 'Direct Transit'}
                    </span>
                    <span>•</span>
                    <span className="font-mono font-bold text-zinc-900 dark:text-zinc-100">
                      {transport?.duration || '2h 15m'}
                    </span>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    );
  }

  // Default: Horizontal Route
  return (
    <div className={clsx('flex items-center overflow-x-auto py-3 gap-2 no-scrollbar', className)}>
      {stops.map((stop, idx) => {
        const isLast = idx === stops.length - 1;
        const transport = stop.transportToNext;
        const cityName = stop.cityName || stop.name || stop;

        return (
          <React.Fragment key={stop.id || idx}>
            <div className="flex items-center gap-2 shrink-0">
              <div className="w-3 h-3 rounded-full bg-zinc-950 dark:bg-zinc-100 ring-4 ring-zinc-100 dark:ring-zinc-800 shrink-0" />
              <div className="flex flex-col text-left">
                <span className="text-sm font-bold uppercase tracking-wider text-zinc-900 dark:text-zinc-100 whitespace-nowrap">
                  {cityName}
                </span>
                <span className="text-[10px] text-zinc-400 font-semibold">
                  {stop.country || stop.countryName || 'Japan'}
                </span>
              </div>
            </div>

            {!isLast && (
              <div className="flex items-center px-2 shrink-0">
                <div className="flex items-center gap-1.5 bg-zinc-100 dark:bg-zinc-800/80 px-2.5 py-1 rounded-full border border-zinc-200 dark:border-zinc-700 text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                  <TransportIcon type={transport?.mode || 'flight'} className="w-3 h-3 text-zinc-950 dark:text-zinc-100" />
                  <span className="text-[11px] font-mono font-bold">{transport?.duration || 'Transit'}</span>
                </div>
                <div className="w-6 h-px bg-zinc-300 dark:bg-zinc-700 ml-1" />
              </div>
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
};
