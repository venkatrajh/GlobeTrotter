import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTrips } from '../../context/TripContext';
import { useAuth } from '../../context/AuthContext';
import { usePreferences } from '../../context/PreferencesContext';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { TransitCorridor } from '../../components/travel/TransitCorridor';
import { TripCard } from '../../components/travel/TripCard';
import { CITIES_DATA } from '../../data/citiesData';
import {
  Sparkles,
  Plane,
  MapPin,
  Globe,
  IndianRupee,
  ArrowRight,
  Compass,
  Calendar,
  Clock,
  Plus
} from 'lucide-react';

export const DashboardPage = () => {
  const { trips, activeTrip } = useTrips();
  const { user } = useAuth();
  const { fmtCurrency, fmtDate } = usePreferences();
  const navigate = useNavigate();

  const upcomingTrip = activeTrip || trips[0];

  const corridorStops = upcomingTrip?.stops || [
    { cityName: 'Tokyo', country: 'Japan', transportToNext: { mode: 'flight', duration: '2h 15m' } },
    { cityName: 'Kyoto', country: 'Japan', transportToNext: { mode: 'train', duration: '45m' } },
    { cityName: 'Osaka', country: 'Japan', transportToNext: null }
  ];

  const formattedStartDate = upcomingTrip?.startDate ? fmtDate(upcomingTrip.startDate) : '12/03/2026';
  const formattedEndDate = upcomingTrip?.endDate ? fmtDate(upcomingTrip.endDate) : '24/03/2026';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-8 space-y-12 text-left relative z-10">
      {/* Top Greeting Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <span className="text-[11px] font-mono uppercase font-bold tracking-widest text-zinc-600 dark:text-zinc-400">
            TRAVEL COMMAND CENTER
          </span>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-zinc-950 dark:text-zinc-50 uppercase mt-1">
            GOOD MORNING, {user?.name?.split(' ')[0]?.toUpperCase() || 'TRAVELER'}
          </h1>
          <p className="text-sm sm:text-base text-zinc-500 dark:text-zinc-400 font-medium mt-2">
            Ready for your next adventure?
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="md"
            icon={Sparkles}
            onClick={() => navigate('/ai-planner')}
            className="font-bold text-xs shadow-sm"
          >
            ✦ Generate with AI
          </Button>
          <Button
            variant="primary"
            size="md"
            icon={Plus}
            onClick={() => navigate('/create-trip')}
            className="font-bold text-xs shadow-md"
          >
            New Trip
          </Button>
        </div>
      </div>

      {/* Prominent UPCOMING TRIP Card with Level 1 Liquid Glass */}
      {upcomingTrip && (
        <div className="relative glass-primary rounded-3xl p-6 sm:p-10 shadow-2xl border overflow-hidden group">
          <div className="relative z-10 flex flex-col justify-between gap-8">
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2 text-xs font-mono font-bold tracking-widest uppercase mb-1 text-zinc-500 dark:text-zinc-400">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" /> UPCOMING EXPEDITION
                </div>
                <h2 className="text-2xl sm:text-4xl font-black uppercase tracking-tight text-zinc-950 dark:text-zinc-50">
                  {upcomingTrip.title}
                </h2>
              </div>
              <Badge variant="dark" size="sm">
                {upcomingTrip.status}
              </Badge>
            </div>

            {/* TRANSIT CORRIDOR inside Secondary Liquid Glass */}
            <div className="p-6 rounded-2xl glass-secondary border shadow-xs">
              <span className="text-[10px] font-mono uppercase tracking-widest text-zinc-600 dark:text-zinc-400 block mb-2 font-bold">
                TRANSIT CORRIDOR
              </span>
              <TransitCorridor stops={corridorStops} orientation="horizontal" />
            </div>

            {/* Dates & Actions */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2 border-t border-zinc-200/50 dark:border-zinc-800/50">
              <div className="flex flex-wrap items-center gap-6 text-xs font-mono font-bold text-zinc-700 dark:text-zinc-300">
                <span className="flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-zinc-600 dark:text-zinc-400" /> {formattedStartDate} – {formattedEndDate}
                </span>
                <span className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-zinc-600 dark:text-zinc-400" /> {upcomingTrip.durationDays} DAYS
                </span>
                <span className="flex items-center gap-1.5">
                  <IndianRupee className="w-4 h-4 text-zinc-600 dark:text-zinc-400" /> {fmtCurrency(upcomingTrip.totalBudget, upcomingTrip.destination)}
                </span>
              </div>

              <Button
                variant="primary"
                size="md"
                icon={ArrowRight}
                iconPosition="right"
                onClick={() => navigate(`/trips/${upcomingTrip.id}`)}
                className="font-black text-xs uppercase px-6 shadow-md"
              >
                OPEN TRIP
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* YOUR JOURNEY - Large Visual Stat Cards */}
      <div>
        <span className="text-xs font-mono uppercase font-bold tracking-wider text-zinc-600 dark:text-zinc-400 block mb-4">
          YOUR JOURNEY LIFETIME METRICS
        </span>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <Card padding="md" className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-2xl">✈</span>
              <span className="text-[10px] font-mono uppercase font-bold text-zinc-600 dark:text-zinc-400">Total</span>
            </div>
            <p className="text-3xl sm:text-4xl font-black text-zinc-950 dark:text-zinc-50">
              08
            </p>
            <span className="text-xs font-bold text-zinc-600 dark:text-zinc-400 uppercase tracking-wider block">
              Trips Planned
            </span>
          </Card>

          <Card padding="md" className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-2xl">📍</span>
              <span className="text-[10px] font-mono uppercase font-bold text-zinc-600 dark:text-zinc-400">Visited</span>
            </div>
            <p className="text-3xl sm:text-4xl font-black text-zinc-950 dark:text-zinc-50">
              15
            </p>
            <span className="text-xs font-bold text-zinc-600 dark:text-zinc-400 uppercase tracking-wider block">
              Cities Visited
            </span>
          </Card>

          <Card padding="md" className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-2xl">🌍</span>
              <span className="text-[10px] font-mono uppercase font-bold text-zinc-600 dark:text-zinc-400">Passports</span>
            </div>
            <p className="text-3xl sm:text-4xl font-black text-zinc-950 dark:text-zinc-50">
              06
            </p>
            <span className="text-xs font-bold text-zinc-600 dark:text-zinc-400 uppercase tracking-wider block">
              Countries
            </span>
          </Card>

          <Card padding="md" className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-2xl">💰</span>
              <span className="text-[10px] font-mono uppercase font-bold text-zinc-600 dark:text-zinc-400">Invested</span>
            </div>
            <p className="text-3xl sm:text-4xl font-black text-zinc-950 dark:text-zinc-50">
              {fmtCurrency(420000, '', { compact: true })}
            </p>
            <span className="text-xs font-bold text-zinc-600 dark:text-zinc-400 uppercase tracking-wider block">
              Travel Budget
            </span>
          </Card>
        </div>
      </div>

      {/* RECENT JOURNEYS */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <span className="text-xs font-mono uppercase font-bold tracking-wider text-zinc-600 dark:text-zinc-400">
            RECENT JOURNEYS
          </span>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/trips')}
            className="text-xs font-bold"
          >
            View All ({trips.length}) →
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {trips.slice(0, 3).map((trip) => (
            <TripCard key={trip.id} trip={trip} />
          ))}
        </div>
      </div>

      {/* Suggested Destinations with Liquid Glass */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <span className="text-xs font-mono uppercase font-bold tracking-wider text-zinc-600 dark:text-zinc-400 block">
              CURATED DESTINATIONS
            </span>
            <h3 className="text-xl font-bold tracking-tight text-zinc-950 dark:text-zinc-50 mt-0.5">
              Suggested for your travel style
            </h3>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate('/explore')}
            className="text-xs font-bold"
          >
            Explore All
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {CITIES_DATA.slice(0, 3).map((city) => (
            <div
              key={city.id}
              onClick={() => navigate('/explore')}
              className="group p-5 rounded-3xl glass-secondary hover:border-zinc-400 dark:hover:border-zinc-500 shadow-md cursor-pointer transition-all duration-300 flex items-center gap-4 border"
            >
              <div className="w-14 h-14 rounded-2xl bg-white/60 dark:bg-zinc-800/80 border border-zinc-200/80 dark:border-zinc-700 flex items-center justify-center font-mono font-bold text-base text-zinc-900 dark:text-zinc-100 shrink-0 shadow-xs">
                {city.code}
              </div>
              <div className="flex-1 truncate">
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="text-xs font-mono font-bold text-zinc-600 dark:text-zinc-400 uppercase">{city.country}</span>
                </div>
                <h4 className="text-base font-bold text-zinc-950 dark:text-zinc-50 group-hover:underline truncate">
                  {city.name}
                </h4>
                <p className="text-xs text-zinc-600 dark:text-zinc-400 truncate mt-0.5">{city.tagline}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
