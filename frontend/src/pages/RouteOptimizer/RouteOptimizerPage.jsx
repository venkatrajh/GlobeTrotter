import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTrips } from '../../context/TripContext';
import { RouteOptimizerView } from '../../components/optimizer/RouteOptimizerView';
import { Button } from '../../components/common/Button';
import { ArrowLeft } from 'lucide-react';

export const RouteOptimizerPage = () => {
  const { tripId } = useParams();
  const navigate = useNavigate();
  const { trips, activeTrip } = useTrips();

  const currentTrip = trips.find((t) => t.id === tripId) || activeTrip || trips[0];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-8 py-8 space-y-8 text-left">
      <div className="flex items-center justify-between pb-4 border-b border-zinc-200 dark:border-zinc-800">
        <div>
          <button
            type="button"
            onClick={() => navigate(`/trips/${currentTrip.id}`)}
            className="text-xs font-bold uppercase tracking-wider text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-zinc-100 flex items-center gap-1 mb-1 hover:underline"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to {currentTrip.title}
          </button>
          <h1 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-zinc-950 dark:text-zinc-50">
            TRANSIT OPTIMIZATION
          </h1>
        </div>
      </div>

      <RouteOptimizerView onApply={() => navigate(`/trips/${currentTrip.id}`)} />
    </div>
  );
};
