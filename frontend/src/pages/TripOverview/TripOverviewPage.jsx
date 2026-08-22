import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTrips } from '../../context/TripContext';
import { usePreferences } from '../../context/PreferencesContext';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { Card } from '../../components/common/Card';
import { TransitCorridor } from '../../components/travel/TransitCorridor';
import { InteractiveMap } from '../../components/travel/InteractiveMap';
import { ImageWithFallback } from '../../components/common/ImageWithFallback';
import {
  Calendar,
  IndianRupee,
  Clock,
  Sparkles,
  Users,
  Compass,
  Zap,
  RotateCcw,
  Share2,
  Edit3
} from 'lucide-react';

export const TripOverviewPage = () => {
  const { tripId } = useParams();
  const navigate = useNavigate();
  const { trips, activeTrip } = useTrips();
  const { fmtCurrency, fmtDate } = usePreferences();

  const currentTrip = trips.find((t) => t.id === tripId) || activeTrip || trips[0];

  if (!currentTrip) {
    return (
      <div className="p-8 text-center">
        <h2 className="text-xl font-bold">Trip not found</h2>
        <Button onClick={() => navigate('/trips')} className="mt-4">Back to Trips</Button>
      </div>
    );
  }

  const formattedStart = currentTrip.startDate ? fmtDate(currentTrip.startDate) : '12/03/2026';
  const formattedEnd = currentTrip.endDate ? fmtDate(currentTrip.endDate) : '24/03/2026';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-8 space-y-10 text-left relative z-10">
      {/* Top Hero Banner with Liquid Glass */}
      <div className="relative rounded-3xl overflow-hidden min-h-[300px] flex flex-col justify-end p-6 sm:p-10 glass-primary shadow-2xl border">
        <ImageWithFallback
          src={currentTrip.coverImage}
          alt={currentTrip.title}
          fallbackCategory={currentTrip.destination}
          className="absolute inset-0 w-full h-full object-cover opacity-20 mix-blend-luminosity"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-white/90 via-white/40 to-transparent dark:from-zinc-950 dark:via-zinc-950/60 dark:to-transparent" />

        <div className="relative z-10 flex flex-col sm:flex-row sm:items-end justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold uppercase tracking-widest text-zinc-600 dark:text-zinc-400">
                {currentTrip.destination}
              </span>
              <Badge variant="dark" size="sm">
                {currentTrip.status}
              </Badge>
            </div>

            <h1 className="text-3xl sm:text-5xl font-black tracking-tight uppercase text-zinc-950 dark:text-zinc-50">
              {currentTrip.title}
            </h1>

            <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-300 font-medium max-w-xl">
              {currentTrip.description || 'Seamless multi-city itinerary curated with intelligent transit corridor mapping.'}
            </p>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center gap-3">
            <Button
              variant="outline"
              size="md"
              icon={Share2}
              onClick={() => navigate(`/trips/${currentTrip.id}/ticket`)}
              className="text-xs font-bold"
            >
              Public Ticket
            </Button>
            <Button
              variant="primary"
              size="md"
              icon={Edit3}
              onClick={() => navigate(`/trips/${currentTrip.id}/builder`)}
              className="font-black text-xs uppercase shadow-lg"
            >
              Open Builder
            </Button>
          </div>
        </div>
      </div>

      {/* Transit Corridor Section with Liquid Glass */}
      <div className="glass-secondary rounded-3xl p-6 sm:p-8 shadow-lg border">
        <span className="text-[10px] font-mono uppercase font-bold tracking-widest text-zinc-600 dark:text-zinc-400 block mb-2">
          JOURNEY TRANSIT CORRIDOR
        </span>
        <TransitCorridor stops={currentTrip.stops} orientation="horizontal" />
      </div>

      {/* Quick Nav Tools Strip with Liquid Glass */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div
          onClick={() => navigate(`/trips/${currentTrip.id}/builder`)}
          className="p-5 rounded-2xl glass-secondary hover:border-zinc-400 dark:hover:border-zinc-500 cursor-pointer transition-all shadow-sm border"
        >
          <Compass className="w-5 h-5 text-zinc-950 dark:text-zinc-50 mb-2" />
          <h4 className="text-sm font-bold text-zinc-950 dark:text-zinc-50">Itinerary Builder</h4>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5 font-medium">Day flashcards</p>
        </div>

        <div
          onClick={() => navigate(`/trips/${currentTrip.id}/optimizer`)}
          className="p-5 rounded-2xl glass-secondary hover:border-zinc-400 dark:hover:border-zinc-500 cursor-pointer transition-all shadow-sm border"
        >
          <Zap className="w-5 h-5 text-amber-500 mb-2" />
          <h4 className="text-sm font-bold text-zinc-950 dark:text-zinc-50">Route Optimizer</h4>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5 font-medium">Save transit time</p>
        </div>

        <div
          onClick={() => navigate(`/trips/${currentTrip.id}/budget`)}
          className="p-5 rounded-2xl glass-secondary hover:border-zinc-400 dark:hover:border-zinc-500 cursor-pointer transition-all shadow-sm border"
        >
          <span className="text-lg block mb-1">💰</span>
          <h4 className="text-sm font-bold text-zinc-950 dark:text-zinc-50">Budget & Insights</h4>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5 font-medium">{fmtCurrency(currentTrip.totalBudget, currentTrip.destination)} planned</p>
        </div>

        <div
          onClick={() => navigate(`/trips/${currentTrip.id}/replanner`)}
          className="p-5 rounded-2xl glass-secondary hover:border-zinc-400 dark:hover:border-zinc-500 cursor-pointer transition-all shadow-sm border"
        >
          <RotateCcw className="w-5 h-5 text-indigo-500 mb-2" />
          <h4 className="text-sm font-bold text-zinc-950 dark:text-zinc-50">Auto-Replanner</h4>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5 font-medium">Weather & delays</p>
        </div>
      </div>

      {/* Interactive Map */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <span className="text-xs font-mono uppercase font-bold tracking-wider text-zinc-600 dark:text-zinc-400">
            GEOGRAPHIC MAP VISUALIZATION
          </span>
          <span className="text-xs font-semibold text-zinc-600 dark:text-zinc-400">{currentTrip.stops?.length || 3} Destinations</span>
        </div>
        <InteractiveMap stops={currentTrip.stops} />
      </div>

      {/* Trip Meta Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card padding="md" className="space-y-1">
          <span className="text-[10px] font-mono font-bold uppercase text-zinc-600 dark:text-zinc-400 flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5" /> Date Schedule
          </span>
          <p className="text-lg font-black text-zinc-950 dark:text-zinc-50">
            {formattedStart} – {formattedEnd}
          </p>
          <span className="text-xs text-zinc-600 dark:text-zinc-400 font-semibold">{currentTrip.durationDays} Full Days of Exploration</span>
        </Card>

        <Card padding="md" className="space-y-1">
          <span className="text-[10px] font-mono font-bold uppercase text-zinc-600 dark:text-zinc-400 flex items-center gap-1.5">
            <span>💰</span> Total Budget
          </span>
          <p className="text-lg font-black text-zinc-950 dark:text-zinc-50">
            {fmtCurrency(currentTrip.totalBudget, currentTrip.destination)}
          </p>
          <span className="text-xs text-zinc-600 dark:text-zinc-400 font-semibold">Includes Stay, Rail & Activities</span>
        </Card>

        <Card padding="md" className="space-y-1">
          <span className="text-[10px] font-mono font-bold uppercase text-zinc-600 dark:text-zinc-400 flex items-center gap-1.5">
            <Users className="w-3.5 h-3.5" /> Traveling Crew
          </span>
          <p className="text-lg font-black text-zinc-950 dark:text-zinc-50">
            {currentTrip.crew?.length || 4} Active Travelers
          </p>
          <span className="text-xs text-zinc-600 dark:text-zinc-400 font-semibold">Shared voting & cost splitting active</span>
        </Card>
      </div>
    </div>
  );
};
