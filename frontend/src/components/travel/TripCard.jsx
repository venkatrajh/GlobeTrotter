import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../common/Card';
import { Badge } from '../common/Badge';
import { Button } from '../common/Button';
import { RouteVisualizer } from './RouteVisualizer';
import { ImageWithFallback } from '../common/ImageWithFallback';
import { usePreferences } from '../../context/PreferencesContext';
import { Calendar, ArrowRight, Clock } from 'lucide-react';

export const TripCard = ({ trip }) => {
  const navigate = useNavigate();
  const { fmtCurrency, fmtDate } = usePreferences();

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Upcoming':
        return <Badge variant="dark">{status}</Badge>;
      case 'Planning':
        return <Badge variant="warning">{status}</Badge>;
      case 'Completed':
        return <Badge variant="outline">{status}</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const formattedStartDate = trip.startDate ? fmtDate(trip.startDate) : '12/03/2026';

  return (
    <Card
      hoverable
      padding="none"
      tier="secondary"
      className="flex flex-col group rounded-3xl overflow-hidden transition-all duration-300 hover:shadow-2xl hover:translate-y-[-3px] text-left border"
      onClick={() => navigate(`/trips/${trip.id}`)}
    >
      {/* Cover Image Header with Fallback */}
      <div className="relative h-48 w-full overflow-hidden bg-zinc-100 dark:bg-zinc-800">
        <ImageWithFallback
          src={trip.coverImage}
          alt={trip.title}
          fallbackCategory={trip.destination}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/80 via-zinc-950/20 to-transparent pointer-events-none" />

        {/* Status Badge */}
        <div className="absolute top-4 right-4 z-10">
          {getStatusBadge(trip.status)}
        </div>

        {/* Destination Info */}
        <div className="absolute bottom-4 left-4 right-4 text-white z-10">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs uppercase font-mono tracking-widest text-zinc-300 font-bold">
              {trip.destination}
            </span>
          </div>
          <h3 className="text-xl font-black tracking-tight text-white drop-shadow-sm truncate uppercase">
            {trip.title}
          </h3>
        </div>
      </div>

      {/* Card Body */}
      <div className="p-6 flex-1 flex flex-col justify-between gap-5">
        {/* Route Visualizer Compact with Liquid Glass */}
        <div className="glass-secondary p-3.5 rounded-2xl border">
          <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-600 dark:text-zinc-400 font-bold block mb-1.5">
            JOURNEY ROUTE
          </span>
          <RouteVisualizer stops={trip.stops} orientation="compact" />
        </div>

        {/* Meta Stats Row */}
        <div className="grid grid-cols-3 gap-3 text-left py-2 border-t border-b border-zinc-200/50 dark:border-zinc-800/80">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-600 dark:text-zinc-400 flex items-center gap-1">
              <Calendar className="w-3 h-3" /> Dates
            </span>
            <p className="text-xs font-bold text-zinc-900 dark:text-zinc-100 mt-1 truncate">
              {formattedStartDate}
            </p>
          </div>

          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-600 dark:text-zinc-400 flex items-center gap-1">
              <Clock className="w-3 h-3" /> Duration
            </span>
            <p className="text-xs font-bold text-zinc-900 dark:text-zinc-100 mt-1">
              {trip.durationDays} Days
            </p>
          </div>

          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-600 dark:text-zinc-400 flex items-center gap-1">
              <span>💰</span> Budget
            </span>
            <p className="text-xs font-bold text-zinc-900 dark:text-zinc-100 mt-1">
              {fmtCurrency(trip.totalBudget, trip.destination, { compact: true })}
            </p>
          </div>
        </div>

        {/* Card Footer CTA */}
        <div className="flex items-center justify-between pt-1">
          <span className="text-xs font-bold text-zinc-600 dark:text-zinc-400 group-hover:text-zinc-950 dark:group-hover:text-zinc-100 transition-colors">
            {trip.stops?.length || 3} Cities • {trip.crew?.length || 1} Travelers
          </span>
          <Button
            variant="outline"
            size="sm"
            icon={ArrowRight}
            iconPosition="right"
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/trips/${trip.id}`);
            }}
            className="rounded-xl font-bold text-xs"
          >
            View Journey
          </Button>
        </div>
      </div>
    </Card>
  );
};
