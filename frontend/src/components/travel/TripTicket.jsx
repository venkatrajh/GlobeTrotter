import React, { useState } from 'react';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';
import { TransportIcon } from './TransportIcon';
import { usePreferences } from '../../context/PreferencesContext';
import { Copy, Check, Share2, QrCode, ChevronDown, ChevronUp } from 'lucide-react';
import { clsx } from 'clsx';

export const TripTicket = ({ trip, onCopyTrip, onSharePass, isPublicView }) => {
  const [copied, setCopied] = useState(false);
  const [showFullItinerary, setShowFullItinerary] = useState(false);
  const { fmtDate, fmtCurrency } = usePreferences();

  const handleShareClick = () => {
    setCopied(true);
    if (onSharePass) {
      onSharePass(trip);
    } else if (onCopyTrip) {
      onCopyTrip(trip);
    }
    setTimeout(() => setCopied(false), 3000);
  };

  const handleCopyClick = () => {
    if (onCopyTrip) {
      onCopyTrip(trip);
    }
  };

  const stops = trip?.stops || [];
  const startStop = stops[0] || { cityName: trip?.destination || 'TOKYO', code: 'NRT' };
  const midStop = stops[1] || { cityName: stops.length > 2 ? stops[1].cityName : 'TRANSIT', code: 'KYO' };
  const endStop = stops[stops.length - 1] || { cityName: stops[0]?.cityName || 'OSAKA', code: 'OSA' };

  const formattedStart = trip?.startDate ? fmtDate(trip.startDate) : '12/03/2026';
  const formattedEnd = trip?.endDate ? fmtDate(trip.endDate) : '24/03/2026';

  // Dynamic days calculation from itinerary map or stops
  const itineraryDays = trip?.itinerary ? Object.values(trip.itinerary) : [];

  return (
    <div className="w-full max-w-3xl mx-auto flex flex-col gap-8 relative z-10">
      {/* Boarding Pass Ticket Container with Liquid Glass */}
      <div className="relative glass-primary rounded-3xl shadow-2xl overflow-hidden border">
        {/* Ticket Header Banner */}
        <div className="glass-secondary p-6 sm:p-8 flex items-center justify-between border-b">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-zinc-950 dark:bg-zinc-100 text-white dark:text-zinc-950 flex items-center justify-center font-bold shadow-xs">
              <TransportIcon type="flight" className="w-5 h-5" />
            </div>
            <div className="text-left">
              <span className="text-[10px] font-mono font-bold tracking-widest uppercase text-zinc-600 dark:text-zinc-400">
                GLOBETROTTER VOYAGE PASS
              </span>
              <h2 className="text-xl sm:text-2xl font-black tracking-tight uppercase text-zinc-950 dark:text-zinc-50">
                {trip?.title || 'JAPAN ADVENTURE'}
              </h2>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-mono font-bold text-sm uppercase tracking-wider text-zinc-600 dark:text-zinc-400">
              {trip?.destination || 'JAPAN'}
            </span>
          </div>
        </div>

        {/* Airport Route Header */}
        <div className="p-6 sm:p-8 border-b">
          <div className="flex items-center justify-between text-center gap-2">
            {/* City 1 */}
            <div className="flex-1 text-left">
              <span className="text-2xl sm:text-4xl font-black tracking-tight font-mono text-zinc-950 dark:text-zinc-50">
                {startStop.code || 'DEP'}
              </span>
              <p className="text-xs sm:text-sm font-bold uppercase text-zinc-600 dark:text-zinc-400 mt-0.5">
                {startStop.cityName || 'ORIGIN'}
              </p>
            </div>

            {/* Middle Transit */}
            <div className="flex flex-col items-center px-2">
              <div className="flex items-center gap-1 text-xs font-mono text-zinc-600 dark:text-zinc-400 font-bold">
                <TransportIcon type="flight" className="w-3 h-3" />
                <span>{stops.length > 1 ? `${stops.length} STOPS` : 'DIRECT'}</span>
              </div>
              <div className="w-16 sm:w-28 h-0.5 bg-zinc-300 dark:bg-zinc-700 my-1 relative flex items-center justify-center">
                <span className="w-2 h-2 rounded-full bg-zinc-950 dark:bg-zinc-100" />
              </div>
              <span className="text-[10px] font-bold text-zinc-600 dark:text-zinc-400 uppercase">{midStop.cityName || 'TRANSIT'}</span>
            </div>

            {/* City 2 (End) */}
            <div className="flex-1 text-right">
              <span className="text-2xl sm:text-4xl font-black tracking-tight font-mono text-zinc-950 dark:text-zinc-50">
                {endStop.code || 'ARR'}
              </span>
              <p className="text-xs sm:text-sm font-bold uppercase text-zinc-600 dark:text-zinc-400 mt-0.5">
                {endStop.cityName || trip?.destination || 'DESTINATION'}
              </p>
            </div>
          </div>
        </div>

        {/* Perforated Divider Line */}
        <div className="relative py-2 flex items-center">
          <div className="absolute -left-4 w-8 h-8 rounded-full bg-[#f0f2f5] dark:bg-[#07080a] border" />
          <div className="w-full border-t-2 border-dashed border-zinc-300 dark:border-zinc-700 mx-6" />
          <div className="absolute -right-4 w-8 h-8 rounded-full bg-[#f0f2f5] dark:bg-[#07080a] border" />
        </div>

        {/* Ticket Details & Tear section */}
        <div className="p-6 sm:p-8 grid grid-cols-2 sm:grid-cols-4 gap-6 text-left">
          <div>
            <span className="text-[10px] font-mono uppercase font-bold text-zinc-600 dark:text-zinc-400">DEPARTURE</span>
            <p className="text-sm font-black text-zinc-950 dark:text-zinc-50 mt-0.5">
              {formattedStart}
            </p>
          </div>

          <div>
            <span className="text-[10px] font-mono uppercase font-bold text-zinc-600 dark:text-zinc-400">RETURN</span>
            <p className="text-sm font-black text-zinc-950 dark:text-zinc-50 mt-0.5">
              {formattedEnd}
            </p>
          </div>

          <div>
            <span className="text-[10px] font-mono uppercase font-bold text-zinc-600 dark:text-zinc-400">JOURNEY SCOPE</span>
            <p className="text-sm font-black text-zinc-950 dark:text-zinc-50 mt-0.5">
              {trip?.durationDays || 12} DAYS • {stops.length || 1} CITIES
            </p>
          </div>

          <div>
            <span className="text-[10px] font-mono uppercase font-bold text-zinc-600 dark:text-zinc-400">TOTAL BUDGET</span>
            <p className="text-sm font-black text-zinc-950 dark:text-zinc-50 mt-0.5">
              {fmtCurrency(trip?.totalBudget || 180000, trip?.destination)}
            </p>
          </div>
        </div>

        {/* Bottom Bar with CTA and QR code mock */}
        <div className="p-6 sm:p-8 glass-secondary border-t flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <div className="w-12 h-12 bg-white/80 dark:bg-zinc-800 border rounded-2xl flex items-center justify-center p-1 shrink-0 shadow-xs">
              <QrCode className="w-8 h-8 text-zinc-950 dark:text-zinc-100" />
            </div>
            <div className="text-left">
              <span className="text-[10px] font-mono text-zinc-600 dark:text-zinc-400 font-bold uppercase">SECURE PASS ID</span>
              <p className="text-xs font-mono font-bold text-zinc-900 dark:text-zinc-100">
                GT-{trip?.id ? trip.id.substring(0, 8).toUpperCase() : 'PASS-2026'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            {!isPublicView && (
              <Button
                variant="outline"
                size="md"
                icon={copied ? Check : Share2}
                onClick={handleShareClick}
                className="flex-1 sm:flex-initial text-xs font-bold"
              >
                {copied ? 'Link Copied!' : 'Share Pass'}
              </Button>
            )}
            <Button
              variant="primary"
              size="md"
              icon={Copy}
              onClick={handleCopyClick}
              className="flex-1 sm:flex-initial shadow-md font-bold text-xs"
            >
              COPY THIS TRIP
            </Button>
          </div>
        </div>
      </div>

      {/* Accordion / Full Journey Section */}
      <div className="glass-secondary rounded-3xl p-6 sm:p-8 shadow-lg text-left border">
        <div className="flex items-center justify-between mb-6">
          <div>
            <span className="text-[10px] font-mono uppercase tracking-widest text-zinc-600 dark:text-zinc-400 font-bold">
              THE FULL ITINERARY
            </span>
            <h3 className="text-xl font-black tracking-tight text-zinc-950 dark:text-zinc-50 uppercase mt-0.5">
              Day-by-Day Journey Breakdown
            </h3>
          </div>
          <Button
            variant="ghost"
            size="sm"
            icon={showFullItinerary ? ChevronUp : ChevronDown}
            onClick={() => setShowFullItinerary(!showFullItinerary)}
            className="text-xs font-bold"
          >
            {showFullItinerary ? 'Collapse' : 'Explore Full Itinerary'}
          </Button>
        </div>

        {/* Day previews */}
        <div className="flex flex-col gap-4">
          {itineraryDays.length > 0 ? (
            (showFullItinerary ? itineraryDays : itineraryDays.slice(0, 2)).map((day, idx) => {
              const allActs = [
                ...(day.morning || []),
                ...(day.afternoon || []),
                ...(day.evening || [])
              ];
              const actTitles = allActs.map(a => a.title).filter(Boolean);

              return (
                <div key={day.dayNumber || idx} className="p-4 rounded-2xl glass-secondary border flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <span className="text-sm font-mono font-bold text-zinc-950 dark:text-zinc-100">
                      DAY {String(day.dayNumber || idx + 1).padStart(2, '0')} — {day.city || trip?.destination || 'CITY'}
                    </span>
                    <div className="flex items-center gap-2 text-sm text-zinc-700 dark:text-zinc-300 font-medium">
                      {actTitles.length > 0 ? (
                        actTitles.slice(0, 3).map((title, i) => (
                          <React.Fragment key={i}>
                            {i > 0 && <span>•</span>}
                            <span>{title}</span>
                          </React.Fragment>
                        ))
                      ) : (
                        <span>Exploration & Leisure</span>
                      )}
                    </div>
                  </div>
                  <Badge variant="default">{allActs.length} Activities</Badge>
                </div>
              );
            })
          ) : (
            <>
              <div className="p-4 rounded-2xl glass-secondary border flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <span className="text-sm font-mono font-bold text-zinc-950 dark:text-zinc-100">
                    DAY 01 — {startStop.cityName || 'TOKYO'}
                  </span>
                  <div className="flex items-center gap-2 text-sm text-zinc-700 dark:text-zinc-300 font-medium">
                    <span>Arrival & City Center</span>
                    <span>•</span>
                    <span>Local Dining</span>
                  </div>
                </div>
                <Badge variant="default">{stops.length > 0 ? '1 Stop' : 'Planned'}</Badge>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
