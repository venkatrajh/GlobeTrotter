import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';
import { Select } from '../common/Select';
import { ImageWithFallback } from '../common/ImageWithFallback';
import { useTrips } from '../../context/TripContext';
import { usePreferences } from '../../context/PreferencesContext';
import { Clock, MapPin, Star, Plus, Check } from 'lucide-react';

export const ActivityDetailModal = ({
  activity,
  isOpen,
  onClose
}) => {
  const { activeTrip, activeDay, addActivityToItinerary } = useTrips();
  const { fmtCurrency } = usePreferences();
  const [selectedDay, setSelectedDay] = useState(activeDay || 1);
  const [selectedSlot, setSelectedSlot] = useState('morning');
  const [isAdded, setIsAdded] = useState(false);

  if (!activity) return null;

  const handleAddToTrip = () => {
    addActivityToItinerary(Number(selectedDay), selectedSlot, {
      name: activity.name,
      category: activity.category,
      duration: activity.duration,
      cost: activity.cost,
      icon: activity.categoryIcon || '📍',
      location: activity.location || `${activity.cityName}, ${activity.countryName || 'Global'}`,
      description: activity.description
    });
    setIsAdded(true);
    setTimeout(() => {
      setIsAdded(false);
      onClose();
    }, 1200);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      maxWidth="max-w-lg"
    >
      <div className="flex flex-col text-left">
        {/* Flashcard Header Image with Fallback */}
        <div className="relative h-56 -mt-6 -mx-6 sm:-mt-8 sm:-mx-8 mb-6 overflow-hidden bg-zinc-100 dark:bg-zinc-800">
          <ImageWithFallback
            src={activity.image}
            alt={activity.name}
            fallbackCategory={activity.category}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/80 via-zinc-950/20 to-transparent pointer-events-none" />

          <div className="absolute bottom-4 left-6 right-6 text-white z-10">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs uppercase font-mono tracking-widest text-zinc-300 font-bold">
                {activity.category}
              </span>
            </div>
            <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-white drop-shadow-sm">
              {activity.name}
            </h3>
          </div>
        </div>

        {/* Info Grid */}
        <div className="grid grid-cols-2 gap-4 p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200/80 dark:border-zinc-700/80 mb-5">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-white dark:bg-zinc-700 flex items-center justify-center text-zinc-900 dark:text-zinc-100 shadow-xs">
              <Clock className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-zinc-600 dark:text-zinc-400">Duration</span>
              <p className="text-xs font-bold text-zinc-900 dark:text-zinc-100">{activity.duration}</p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-white dark:bg-zinc-700 flex items-center justify-center text-zinc-900 dark:text-zinc-100 shadow-xs">
              <span className="text-xs font-bold">💰</span>
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-zinc-600 dark:text-zinc-400">Estimated Cost</span>
              <p className="text-xs font-bold text-zinc-900 dark:text-zinc-100">
                {fmtCurrency(activity.cost, activity.countryName)}
              </p>
            </div>
          </div>
        </div>

        {/* Short Activity Description */}
        <div className="mb-5">
          <span className="text-xs font-bold uppercase tracking-wider text-zinc-600 dark:text-zinc-400 block mb-1">
            Activity Overview
          </span>
          <p className="text-sm text-zinc-600 dark:text-zinc-300 leading-relaxed">
            {activity.description}
          </p>
        </div>

        {/* Location */}
        <div className="flex items-center gap-2 text-xs font-semibold text-zinc-600 dark:text-zinc-400 mb-6 bg-zinc-100 dark:bg-zinc-800 px-3.5 py-2.5 rounded-xl">
          <MapPin className="w-4 h-4 text-zinc-900 dark:text-zinc-100 shrink-0" />
          <span>{activity.location || `${activity.cityName}, ${activity.countryName || 'Global'}`}</span>
        </div>

        {/* Add to Trip Slot Selector */}
        <div className="pt-4 border-t border-zinc-100 dark:border-zinc-800 flex flex-col gap-4">
          <div className="grid grid-cols-2 gap-3">
            <Select
              label="Select Day"
              value={selectedDay}
              onChange={(e) => setSelectedDay(e.target.value)}
              options={[
                { value: 1, label: 'Day 01 (Tokyo)' },
                { value: 2, label: 'Day 02 (Tokyo)' },
                { value: 3, label: 'Day 03 (Tokyo)' },
                { value: 4, label: 'Day 04 (Kyoto)' },
                { value: 5, label: 'Day 05 (Kyoto)' }
              ]}
            />
            <Select
              label="Time Slot"
              value={selectedSlot}
              onChange={(e) => setSelectedSlot(e.target.value)}
              options={[
                { value: 'morning', label: 'Morning Slot' },
                { value: 'afternoon', label: 'Afternoon Slot' },
                { value: 'evening', label: 'Evening Slot' }
              ]}
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
            <Button
              variant="primary"
              icon={isAdded ? Check : Plus}
              onClick={handleAddToTrip}
              className="font-bold"
            >
              {isAdded ? 'Added to Itinerary!' : '+ Add to Trip'}
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
};
