import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTrips } from '../../context/TripContext';
import { TripTicket } from '../../components/travel/TripTicket';
import { Button } from '../../components/common/Button';
import { ArrowLeft } from 'lucide-react';

export const PublicTripPage = () => {
  const { tripId } = useParams();
  const navigate = useNavigate();
  const { trips, activeTrip, showNotification } = useTrips();

  const currentTrip = trips.find((t) => t.id === tripId) || activeTrip || trips[0];

  const handleCopy = () => {
    showNotification('Boarding Pass link copied to clipboard!', 'success');
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-8 py-8 space-y-8 text-left">
      <div className="flex items-center justify-between pb-4 border-b border-zinc-200 dark:border-zinc-800">
        <button
          type="button"
          onClick={() => navigate(`/trips/${currentTrip.id}`)}
          className="text-xs font-bold uppercase tracking-wider text-zinc-500 hover:text-zinc-950 dark:hover:text-zinc-100 flex items-center gap-1 hover:underline"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to {currentTrip.title}
        </button>
      </div>

      <TripTicket trip={currentTrip} onCopyTrip={handleCopy} />
    </div>
  );
};
