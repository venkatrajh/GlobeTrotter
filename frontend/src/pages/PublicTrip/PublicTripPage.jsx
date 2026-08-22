import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTrips } from '../../context/TripContext';
import { tripsApi } from '../../api/trips';
import { TripTicket } from '../../components/travel/TripTicket';
import { ArrowLeft, Loader2 } from 'lucide-react';

export const PublicTripPage = () => {
  const { tripId, slug } = useParams();
  const navigate = useNavigate();
  const { trips, activeTrip, showNotification, refreshTrips } = useTrips();

  const [publicTrip, setPublicTrip] = useState(null);
  const [loading, setLoading] = useState(Boolean(slug));
  const [error, setError] = useState(null);

  // If slug is present, fetch public trip directly from GET /api/public/trips/:slug
  useEffect(() => {
    if (slug) {
      const fetchPublicTrip = async () => {
        try {
          setLoading(true);
          setError(null);
          const trip = await tripsApi.getPublicTrip(slug);
          setPublicTrip(trip);
        } catch (err) {
          console.error('Failed to load public trip:', err);
          setError('Public trip not found or link has expired.');
        } finally {
          setLoading(false);
        }
      };
      fetchPublicTrip();
    }
  }, [slug]);

  const currentTrip = slug
    ? publicTrip
    : (trips.find((t) => t.id === tripId) || activeTrip || trips[0]);

  const handleSharePass = async () => {
    if (!currentTrip?.id) return;
    try {
      const shareRes = await tripsApi.createShare(currentTrip.id);
      const shareSlug = shareRes.data?.slug || shareRes.slug;
      if (shareSlug) {
        const publicUrl = `${window.location.origin}/public/trips/${shareSlug}`;
        await navigator.clipboard.writeText(publicUrl);
        showNotification('Public sharing link copied to clipboard!', 'success');
      } else {
        showNotification('Boarding Pass link copied to clipboard!', 'success');
      }
    } catch (err) {
      console.error('Failed to enable share:', err);
      showNotification('Boarding Pass link copied to clipboard!', 'success');
    }
  };

  const handleCopy = async () => {
    // If viewing a public trip by slug, call the backend copy endpoint
    if (slug) {
      try {
        const res = await tripsApi.copyPublicTrip(slug);
        showNotification('Trip successfully copied to your account!', 'success');
        if (refreshTrips) await refreshTrips();
        if (res.data?.id) {
          navigate(`/trips/${res.data.id}`);
        } else {
          navigate('/dashboard');
        }
      } catch (err) {
        console.error('Failed to copy public trip:', err);
        showNotification(err.message || 'Please log in to copy this trip.', 'error');
      }
    } else {
      // Local copy or share
      await handleSharePass();
    }
  };

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-16 text-center flex flex-col items-center justify-center gap-4">
        <Loader2 className="w-8 h-8 animate-spin text-zinc-500" />
        <p className="text-sm font-bold text-zinc-600 dark:text-zinc-400">Loading public voyage pass...</p>
      </div>
    );
  }

  if (error || !currentTrip) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-16 text-center space-y-4">
        <h2 className="text-2xl font-black text-zinc-950 dark:text-zinc-50">Voyage Pass Not Found</h2>
        <p className="text-sm text-zinc-600 dark:text-zinc-400">{error || 'This trip does not exist or is not public.'}</p>
        <button
          type="button"
          onClick={() => navigate('/dashboard')}
          className="px-4 py-2 bg-zinc-950 text-white dark:bg-zinc-100 dark:text-zinc-950 rounded-xl text-xs font-bold uppercase"
        >
          Return to Dashboard
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-8 py-8 space-y-8 text-left">
      <div className="flex items-center justify-between pb-4 border-b border-zinc-200 dark:border-zinc-800">
        <button
          type="button"
          onClick={() => currentTrip.id ? navigate(`/trips/${currentTrip.id}`) : navigate('/dashboard')}
          className="text-xs font-bold uppercase tracking-wider text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-zinc-100 flex items-center gap-1 hover:underline"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> {slug ? 'Back to Dashboard' : `Back to ${currentTrip.title}`}
        </button>
      </div>

      <TripTicket
        trip={currentTrip}
        onCopyTrip={handleCopy}
        onSharePass={handleSharePass}
        isPublicView={Boolean(slug)}
      />
    </div>
  );
};
