import React from 'react';
import { Card } from '../common/Card';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';
import { ImageWithFallback } from '../common/ImageWithFallback';
import { usePreferences } from '../../context/PreferencesContext';
import { Clock, Star, MapPin } from 'lucide-react';

export const ActivityCard = ({
  activity,
  onViewDetails
}) => {
  const { fmtCurrency } = usePreferences();
  const locationText = activity.location || `${activity.cityName}, ${activity.countryName || 'Global'}`;

  return (
    <Card
      hoverable
      padding="none"
      tier="secondary"
      className="flex flex-col group rounded-3xl overflow-hidden transition-all duration-300 hover:shadow-2xl hover:translate-y-[-3px] text-left h-full justify-between border"
      onClick={() => onViewDetails(activity)}
    >
      {/* Visual Header with Image Fallback */}
      <div>
        <div className="relative h-48 w-full overflow-hidden bg-zinc-100 dark:bg-zinc-800">
          <ImageWithFallback
            src={activity.image}
            alt={activity.name}
            fallbackCategory={activity.category}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/70 via-transparent to-transparent pointer-events-none" />

          {/* Category Badge */}
          <div className="absolute top-4 left-4 z-10">
            <Badge variant="dark" size="sm" className="bg-zinc-950/80 backdrop-blur-md">
              {activity.category}
            </Badge>
          </div>

          {/* Rating */}
          {activity.rating && (
            <div className="absolute top-4 right-4 z-10 bg-zinc-950/80 backdrop-blur-md px-2.5 py-1 rounded-full text-white text-xs font-bold flex items-center gap-1">
              <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
              <span>{activity.rating}</span>
            </div>
          )}
        </div>

        {/* Card Body with Clear Location and Meta */}
        <div className="p-6 space-y-3">
          <h3 className="text-base sm:text-lg font-black tracking-tight text-zinc-950 dark:text-zinc-50 group-hover:underline line-clamp-1 uppercase">
            {activity.name}
          </h3>

          {/* Explicit Location Text */}
          <div className="flex items-center gap-1.5 text-xs font-bold text-zinc-600 dark:text-zinc-400">
            <MapPin className="w-3.5 h-3.5 text-zinc-500 shrink-0" />
            <span className="truncate">{locationText}</span>
          </div>

          <p className="text-xs text-zinc-600 dark:text-zinc-400 line-clamp-2 leading-relaxed font-medium">
            {activity.description}
          </p>
        </div>
      </div>

      {/* Footer Meta Row: Duration, Cost, View Details */}
      <div className="px-6 pb-6 pt-3 border-t border-zinc-200/50 dark:border-zinc-800/80 flex items-center justify-between">
        <div className="flex items-center gap-3 text-xs font-bold text-zinc-700 dark:text-zinc-300">
          <span className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-zinc-500" /> {activity.duration}
          </span>
          <span>•</span>
          <span className="text-zinc-950 dark:text-zinc-50 font-black">
            {fmtCurrency(activity.cost, activity.countryName)}
          </span>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={(e) => {
            e.stopPropagation();
            onViewDetails(activity);
          }}
          className="text-xs font-bold rounded-xl"
        >
          View Details
        </Button>
      </div>
    </Card>
  );
};
