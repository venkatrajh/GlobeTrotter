import React from 'react';
import { TransportIcon } from './TransportIcon';
import { clsx } from 'clsx';

export const getTransportLabel = (mode) => {
  if (!mode) return 'TRANSIT';
  const m = String(mode).toLowerCase();
  if (m.includes('flight') || m.includes('air') || m.includes('plane')) return 'AIRPLANE';
  if (m.includes('train') || m.includes('shinkansen') || m.includes('rail')) return 'TRAIN';
  if (m.includes('bus') || m.includes('coach')) return 'BUS';
  if (m.includes('car') || m.includes('drive') || m.includes('taxi')) return 'CAR';
  if (m.includes('walk') || m.includes('foot') || m.includes('hike')) return 'WALKING';
  if (m.includes('ferry') || m.includes('boat') || m.includes('ship') || m.includes('cruise')) return 'FERRY';
  return m.toUpperCase();
};

export const TransitCorridor = ({
  stops = [],
  orientation = 'horizontal', // 'horizontal' | 'vertical'
  className = ''
}) => {
  if (!stops || stops.length === 0) return null;

  if (orientation === 'vertical') {
    return (
      <div className={clsx('flex flex-col py-2 select-none text-left', className)}>
        {stops.map((stop, idx) => {
          const isLast = idx === stops.length - 1;
          const transport = stop.transportToNext;
          const cityName = stop.cityName || stop.name || stop;
          const countryName = stop.country || stop.countryName || 'Japan';
          const transportName = getTransportLabel(transport?.mode || transport?.label || 'flight');

          return (
            <div key={stop.id || idx} className="flex flex-col">
              {/* Destination Node */}
              <div className="flex items-start gap-4">
                <div className="flex flex-col items-center pt-1">
                  <div className="w-6 h-6 rounded-full bg-zinc-950 dark:bg-zinc-100 flex items-center justify-center shadow-xs">
                    <span className="w-2 h-2 rounded-full bg-white dark:bg-zinc-950" />
                  </div>
                </div>

                <div className="flex-1 pb-1">
                  <h4 className="text-base sm:text-lg font-black uppercase tracking-tight text-zinc-950 dark:text-zinc-50">
                    {cityName}
                  </h4>
                  <p className="text-xs font-semibold text-zinc-600 dark:text-zinc-400">
                    {countryName}
                  </p>
                </div>
              </div>

              {/* Connected Line & SVG Transport Method */}
              {!isLast && (
                <div className="flex items-center gap-4 my-2 pl-2.5">
                  <div className="w-0.5 h-16 bg-zinc-300 dark:bg-zinc-700 relative" />

                  <div className="flex items-center gap-3 px-4 py-2.5 rounded-2xl glass-secondary border shadow-xs">
                    <div className="w-8 h-8 rounded-xl bg-zinc-950 text-white dark:bg-zinc-100 dark:text-zinc-950 flex items-center justify-center shadow-xs">
                      <TransportIcon type={transport?.mode || 'flight'} className="w-4 h-4" />
                    </div>
                    <div className="flex flex-col text-left">
                      <span className="text-[11px] font-black text-zinc-950 dark:text-zinc-50 uppercase tracking-wider">
                        {transportName}
                      </span>
                      <span className="text-[10px] font-mono text-zinc-600 dark:text-zinc-400 font-bold">
                        {transport?.duration || 'Direct Transit'}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    );
  }

  // Default: Horizontal Transit Corridor
  return (
    <div className={clsx('w-full flex items-center justify-between overflow-x-auto py-5 px-3 no-scrollbar select-none', className)}>
      {stops.map((stop, idx) => {
        const isLast = idx === stops.length - 1;
        const transport = stop.transportToNext;
        const cityName = stop.cityName || stop.name || stop;
        const countryName = stop.country || stop.countryName || 'Japan';
        const transportName = getTransportLabel(transport?.mode || transport?.label || 'flight');

        return (
          <React.Fragment key={stop.id || idx}>
            {/* Destination Node */}
            <div className="flex flex-col items-center text-center shrink-0 min-w-[90px]">
              <h4 className="text-base sm:text-xl font-black uppercase tracking-tight text-zinc-950 dark:text-zinc-50 leading-tight">
                {cityName}
              </h4>
              <p className="text-xs font-semibold text-zinc-600 dark:text-zinc-400 mt-0.5">
                {countryName}
              </p>

              {/* Visual Node dot */}
              <div className="w-6 h-6 rounded-full bg-zinc-950 dark:bg-zinc-100 flex items-center justify-center mt-2.5 shadow-xs ring-4 ring-zinc-200/60 dark:ring-zinc-800">
                <span className="w-2 h-2 rounded-full bg-white dark:bg-zinc-950" />
              </div>
            </div>

            {/* Connecting Route Line with Transport SVG, Name, and Duration */}
            {!isLast && (
              <div className="flex-1 flex flex-col items-center justify-center px-3 sm:px-6 min-w-[140px] max-w-[260px]">
                {/* Transport Graphic Badge with Liquid Glass */}
                <div className="flex flex-col items-center gap-0.5 px-3.5 py-1.5 rounded-2xl glass-secondary border shadow-xs mb-1.5">
                  <div className="flex items-center gap-1.5 text-zinc-950 dark:text-zinc-100">
                    <TransportIcon
                      type={transport?.mode || 'flight'}
                      className="w-3.5 h-3.5 text-zinc-950 dark:text-zinc-100"
                    />
                    <span className="text-[10px] font-black tracking-widest uppercase">
                      {transportName}
                    </span>
                  </div>
                  <span className="text-[10px] font-mono font-bold text-zinc-600 dark:text-zinc-400">
                    {transport?.duration || '2h 15m'}
                  </span>
                </div>

                {/* Animated Connecting Line */}
                <div className="w-full h-0.5 bg-zinc-300 dark:bg-zinc-700 relative flex items-center justify-center">
                  <div className="absolute inset-0 bg-zinc-950 dark:bg-zinc-100 opacity-25" />
                </div>
              </div>
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
};
