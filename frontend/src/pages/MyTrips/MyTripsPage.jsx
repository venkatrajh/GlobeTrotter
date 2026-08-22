import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTrips } from '../../context/TripContext';
import { TripCard } from '../../components/travel/TripCard';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { EmptyState } from '../../components/common/EmptyState';
import { Plus, Search, Filter, Sparkles } from 'lucide-react';

export const MyTripsPage = () => {
  const { trips } = useTrips();
  const navigate = useNavigate();
  const [filter, setFilter] = useState('All'); // 'All', 'Upcoming', 'Planning', 'Completed'
  const [searchQuery, setSearchQuery] = useState('');

  const filteredTrips = trips.filter((trip) => {
    const matchesFilter = filter === 'All' || trip.status === filter;
    const matchesSearch =
      trip.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      trip.destination.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (trip.stops && trip.stops.some((s) => s.cityName?.toLowerCase().includes(searchQuery.toLowerCase())));
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-8 space-y-8 text-left relative z-10">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <span className="text-[11px] font-mono uppercase font-bold tracking-widest text-zinc-600 dark:text-zinc-400">
            EXPEDITIONS REPOSITORY
          </span>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-zinc-950 dark:text-zinc-50 uppercase mt-1">
            MY JOURNEYS
          </h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 font-medium mt-1">
            Manage your multi-city itineraries, planned flights, and co-planned adventures.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="md"
            icon={Sparkles}
            onClick={() => navigate('/ai-planner')}
            className="font-bold text-xs"
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
            Create Trip
          </Button>
        </div>
      </div>

      {/* Filter and Search Bar with Liquid Glass */}
      <div className="glass-secondary rounded-3xl p-4 sm:p-5 shadow-lg flex flex-col sm:flex-row items-center justify-between gap-4 border">
        {/* Status Filter Tabs */}
        <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto no-scrollbar">
          {['All', 'Upcoming', 'Planning', 'Completed'].map((status) => (
            <button
              key={status}
              type="button"
              onClick={() => setFilter(status)}
              className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all whitespace-nowrap ${
                filter === status
                  ? 'bg-zinc-950 text-white dark:bg-zinc-100 dark:text-zinc-950 shadow-sm'
                  : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-zinc-100 hover:bg-white/50 dark:hover:bg-zinc-800/50'
              }`}
            >
              {status}
            </button>
          ))}
        </div>

        {/* Search input */}
        <div className="w-full sm:w-72">
          <Input
            icon={Search}
            placeholder="Search trips, cities..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-white/70 dark:bg-zinc-800/70 text-xs"
          />
        </div>
      </div>

      {/* Trips Grid */}
      {filteredTrips.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTrips.map((trip) => (
            <TripCard key={trip.id} trip={trip} />
          ))}
        </div>
      ) : (
        <EmptyState
          title="No journeys found"
          description="Try changing your search query or start a brand new journey with AI."
          actionLabel="Create New Trip"
          onAction={() => navigate('/create-trip')}
        />
      )}
    </div>
  );
};
