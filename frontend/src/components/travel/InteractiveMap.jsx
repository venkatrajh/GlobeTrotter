import React, { useState } from 'react';
import { Navigation, ZoomIn, ZoomOut } from 'lucide-react';
import { usePreferences } from '../../context/PreferencesContext';
import { useTheme } from '../../context/ThemeContext';
import { clsx } from 'clsx';

export const InteractiveMap = ({
  stops = [],
  highlightedIndex = null,
  onStopClick,
  className = ''
}) => {
  const [zoomLevel, setZoomLevel] = useState(1);
  const { fmtDistance } = usePreferences();
  const { theme } = useTheme();

  const isLight = theme === 'light';

  // Fallback default coordinates if not present
  const defaultCoords = [
    { x: 120, y: 80, name: 'Tokyo' },
    { x: 260, y: 160, name: 'Kyoto' },
    { x: 380, y: 240, name: 'Osaka' },
    { x: 480, y: 180, name: 'Hiroshima' }
  ];

  const renderedStops = stops.length > 0 ? stops : defaultCoords;

  return (
    <div
      className={clsx(
        'glass-primary relative w-full h-80 sm:h-96 rounded-3xl overflow-hidden shadow-xl flex flex-col justify-between p-4 select-none border',
        className
      )}
    >
      {/* Background Map Grid & Ambient Texture */}
      <div className="absolute inset-0 opacity-15 pointer-events-none">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="0.75" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      {/* Top Map Controls */}
      <div className="relative z-10 flex items-center justify-between">
        <div className="flex items-center gap-2 glass-secondary px-3.5 py-1.5 rounded-2xl border text-xs font-mono">
          <Navigation className="w-3.5 h-3.5 text-zinc-700 dark:text-zinc-300" />
          <span className="text-zinc-900 dark:text-zinc-100 font-bold uppercase tracking-wider">
            {stops.length} Stops Active • Route Live
          </span>
        </div>

        <div className="flex items-center gap-1.5 glass-secondary p-1 rounded-2xl border">
          <button
            type="button"
            onClick={() => setZoomLevel((z) => Math.min(z + 0.2, 1.6))}
            className="p-1.5 rounded-xl text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white hover:bg-white/50 dark:hover:bg-zinc-800 transition-colors"
            title="Zoom In"
          >
            <ZoomIn className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => setZoomLevel((z) => Math.max(z - 0.2, 0.8))}
            className="p-1.5 rounded-xl text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white hover:bg-white/50 dark:hover:bg-zinc-800 transition-colors"
            title="Zoom Out"
          >
            <ZoomOut className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Dynamic Interactive SVG Journey Nodes & Connectors */}
      <div className="absolute inset-0 flex items-center justify-center p-8">
        <svg
          viewBox="0 0 500 300"
          className="w-full h-full"
          style={{ transform: `scale(${zoomLevel})`, transition: 'transform 0.3s ease-out' }}
        >
          {/* Animated Curved Paths between nodes */}
          {renderedStops.map((stop, idx) => {
            if (idx === renderedStops.length - 1) return null;

            const x1 = 70 + (idx * 340) / Math.max(1, renderedStops.length - 1);
            const y1 = 70 + (idx % 2 === 0 ? 30 : 130);
            const x2 = 70 + ((idx + 1) * 340) / Math.max(1, renderedStops.length - 1);
            const y2 = 70 + ((idx + 1) * 340) % 2 === 0 ? 130 : 70;

            const midX = (x1 + x2) / 2;
            const midY = (y1 + y2) / 2 - 25;

            const strokeGlow = isLight ? 'rgba(0, 0, 0, 0.15)' : 'rgba(255, 255, 255, 0.2)';
            const strokeDash = isLight ? '#09090b' : '#ffffff';
            const badgeBg = isLight ? '#ffffff' : '#18181b';
            const badgeText = isLight ? '#09090b' : '#ffffff';

            return (
              <g key={`path-${idx}`}>
                {/* Glow route line */}
                <path
                  d={`M ${x1} ${y1} Q ${midX} ${midY} ${x2} ${y2}`}
                  fill="none"
                  stroke={strokeGlow}
                  strokeWidth="6"
                  strokeLinecap="round"
                />
                {/* Animated dash line */}
                <path
                  d={`M ${x1} ${y1} Q ${midX} ${midY} ${x2} ${y2}`}
                  fill="none"
                  stroke={strokeDash}
                  strokeWidth="2"
                  strokeDasharray="6,6"
                  className="animate-dash-move"
                />
                {/* Midpoint Transport badge */}
                <circle cx={midX} cy={midY} r="10" fill={badgeBg} stroke={strokeDash} strokeWidth="1.5" />
                <text
                  x={midX}
                  y={midY + 3.5}
                  fill={badgeText}
                  fontSize="10"
                  textAnchor="middle"
                  fontFamily="sans-serif"
                >
                  ✈
                </text>
              </g>
            );
          })}

          {/* Destination Nodes */}
          {renderedStops.map((stop, idx) => {
            const x = 70 + (idx * 340) / Math.max(1, renderedStops.length - 1);
            const y = 70 + (idx % 2 === 0 ? 30 : 130);
            const isHighlighted = highlightedIndex === idx;
            const name = stop.cityName || stop.name || `Stop ${idx + 1}`;

            const nodeFill = isHighlighted
              ? isLight ? '#09090b' : '#ffffff'
              : isLight ? '#ffffff' : '#09090b';
            const nodeStroke = isLight ? '#09090b' : '#ffffff';
            const textFill = isLight ? '#09090b' : '#ffffff';

            return (
              <g
                key={`node-${idx}`}
                className="cursor-pointer group"
                onClick={() => onStopClick && onStopClick(idx)}
              >
                {/* Outer ripple ring */}
                <circle
                  cx={x}
                  cy={y}
                  r="16"
                  fill={isLight ? 'rgba(0,0,0,0.06)' : 'rgba(255, 255, 255, 0.1)'}
                  className="animate-pulse-subtle"
                />
                {/* Main node pin */}
                <circle
                  cx={x}
                  cy={y}
                  r={isHighlighted ? 9 : 7}
                  fill={nodeFill}
                  stroke={nodeStroke}
                  strokeWidth="2.5"
                  className="transition-all duration-200"
                />
                {/* City Index Marker */}
                <text
                  x={x}
                  y={y - 14}
                  fill={textFill}
                  fontSize="10"
                  fontWeight="bold"
                  letterSpacing="1"
                  textAnchor="middle"
                  className="uppercase font-mono drop-shadow-xs"
                >
                  {name}
                </text>
                <text
                  x={x}
                  y={y + 22}
                  fill={isLight ? '#64748b' : 'rgba(255,255,255,0.7)'}
                  fontSize="8"
                  fontFamily="monospace"
                  textAnchor="middle"
                >
                  STOP 0{idx + 1}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      {/* Bottom Info Ribbon with Liquid Glass */}
      <div className="relative z-10 flex items-center justify-between text-xs text-zinc-700 dark:text-zinc-300 glass-secondary px-4 py-2.5 rounded-2xl border">
        <div>
          <span className="text-zinc-950 dark:text-zinc-50 font-bold">Estimated Distance:</span> ~{fmtDistance(610, 0)}
        </div>
        <div>
          <span className="text-zinc-950 dark:text-zinc-50 font-bold">Transit Time:</span> ~3h 00m
        </div>
        <div className="hidden sm:block">
          <span className="text-emerald-600 dark:text-emerald-400 font-bold">✓ 100% Scenic Corridor</span>
        </div>
      </div>
    </div>
  );
};
