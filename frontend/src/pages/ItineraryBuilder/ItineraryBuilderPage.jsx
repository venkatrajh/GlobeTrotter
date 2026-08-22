import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTrips } from '../../context/TripContext';
import { usePreferences } from '../../context/PreferencesContext';
import { TimeSlotSection } from '../../components/itinerary/TimeSlotSection';
import { AddActivityModal } from '../../components/itinerary/AddActivityModal';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import {
  ArrowLeft,
  ArrowRight,
  Sparkles
} from 'lucide-react';

export const ItineraryBuilderPage = () => {
  const { tripId } = useParams();
  const navigate = useNavigate();
  const {
    trips,
    activeTrip,
    activeDay,
    setActiveDay,
    addActivityToItinerary,
    removeActivityFromItinerary
  } = useTrips();
  const { fmtCurrency } = usePreferences();

  const currentTrip = trips.find((t) => t.id === tripId) || activeTrip || trips[0];
  const itinerary = currentTrip?.itinerary || {};
  const currentDayData = itinerary[activeDay] || {
    dayNumber: activeDay,
    date: `DAY ${String(activeDay).padStart(2, '0')}`,
    city: currentTrip?.stops?.[0]?.cityName?.toUpperCase() || 'TOKYO',
    morning: [],
    afternoon: [],
    evening: [],
    dayTotalHours: 0,
    dayTotalCost: 0
  };

  const [modalOpen, setModalOpen] = useState(false);
  const [activeSlotForAdd, setActiveSlotForAdd] = useState('morning');

  const maxDays = currentTrip?.durationDays || 12;

  const handleOpenAddModal = (slot) => {
    setActiveSlotForAdd(slot);
    setModalOpen(true);
  };

  const handleAddActivity = (activity) => {
    addActivityToItinerary(activeDay, activeSlotForAdd, activity);
  };

  const handleDeleteActivity = (slot, activityId) => {
    removeActivityFromItinerary(activeDay, slot, activityId);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-8 py-8 space-y-8 text-left relative z-10">
      {/* Top Header: Back Link + Day Indicator + AI Assist */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-zinc-200/60 dark:border-zinc-800">
        <div>
          <button
            type="button"
            onClick={() => navigate(`/trips/${currentTrip.id}`)}
            className="text-xs font-bold uppercase tracking-wider text-zinc-500 hover:text-zinc-950 dark:hover:text-zinc-100 flex items-center gap-1 mb-2 hover:underline"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to {currentTrip.title}
          </button>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl sm:text-4xl font-black uppercase tracking-tight text-zinc-950 dark:text-zinc-50">
              DAY {String(activeDay).padStart(2, '0')}
            </h1>
            <span className="text-xl sm:text-2xl font-black text-zinc-400 uppercase">
              • {currentDayData.city}
            </span>
            {currentDayData.date && (
              <Badge variant="outline" size="sm" className="font-mono font-bold">
                {currentDayData.date}
              </Badge>
            )}
          </div>
        </div>

        {/* Top-Right AI Action */}
        <div className="flex items-center gap-3">
          <Button
            variant="primary"
            size="sm"
            icon={Sparkles}
            onClick={() => navigate(`/trips/${currentTrip.id}/copilot`)}
            className="font-black text-xs uppercase shadow-md"
          >
            ✦ AI ASSIST
          </Button>
        </div>
      </div>

      {/* Day Selector Pills Bar with Liquid Glass */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
        {Array.from({ length: maxDays }).map((_, i) => {
          const dayNum = i + 1;
          const isSelected = activeDay === dayNum;

          return (
            <button
              key={dayNum}
              type="button"
              onClick={() => setActiveDay(dayNum)}
              className={`px-4 py-2 rounded-2xl text-xs font-bold uppercase tracking-wider whitespace-nowrap transition-all border ${
                isSelected
                  ? 'bg-zinc-950 text-white dark:bg-zinc-100 dark:text-zinc-950 border-zinc-950 dark:border-zinc-100 shadow-md'
                  : 'glass-secondary text-zinc-700 dark:text-zinc-300 hover:border-zinc-400'
              }`}
            >
              Day {String(dayNum).padStart(2, '0')}
            </button>
          );
        })}
      </div>

      {/* 3 Emoji Time Slot Sections: Morning, Afternoon, Evening */}
      <div className="space-y-8">
        <TimeSlotSection
          title="☀️ MORNING"
          slotKey="morning"
          activities={currentDayData.morning || []}
          dayNumber={activeDay}
          onAddActivity={handleOpenAddModal}
          onDeleteActivity={handleDeleteActivity}
        />

        <TimeSlotSection
          title="🌤️ AFTERNOON"
          slotKey="afternoon"
          activities={currentDayData.afternoon || []}
          dayNumber={activeDay}
          onAddActivity={handleOpenAddModal}
          onDeleteActivity={handleDeleteActivity}
        />

        <TimeSlotSection
          title="🌙 EVENING"
          slotKey="evening"
          activities={currentDayData.evening || []}
          dayNumber={activeDay}
          onAddActivity={handleOpenAddModal}
          onDeleteActivity={handleDeleteActivity}
        />
      </div>

      {/* Day Total Summary with Liquid Glass */}
      <div className="p-5 rounded-3xl glass-secondary border flex items-center justify-between text-xs font-bold text-zinc-900 dark:text-zinc-100 shadow-xs">
        <span className="font-mono">DAY {String(activeDay).padStart(2, '0')} PLANNED SCOPE</span>
        <div className="flex items-center gap-4 font-mono font-bold text-zinc-950 dark:text-zinc-50">
          <span>⏱ {currentDayData.dayTotalHours || 7} Hours</span>
          <span>•</span>
          <span>{fmtCurrency(currentDayData.dayTotalCost || 2900, currentTrip.destination)}</span>
        </div>
      </div>

      {/* Bottom Navigation: Previous Day / Next Day */}
      <div className="flex items-center justify-between pt-6 border-t border-zinc-200/50 dark:border-zinc-800">
        <Button
          variant="outline"
          size="md"
          icon={ArrowLeft}
          disabled={activeDay <= 1}
          onClick={() => setActiveDay(activeDay - 1)}
          className="font-bold text-xs"
        >
          ← PREVIOUS DAY
        </Button>

        <Button
          variant="primary"
          size="md"
          icon={ArrowRight}
          iconPosition="right"
          disabled={activeDay >= maxDays}
          onClick={() => setActiveDay(activeDay + 1)}
          className="font-bold text-xs uppercase px-6 shadow-md"
        >
          NEXT DAY →
        </Button>
      </div>

      {/* Add Activity Modal */}
      <AddActivityModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        slot={activeSlotForAdd}
        dayNumber={activeDay}
        cityName={currentDayData.city}
        onAdd={handleAddActivity}
      />
    </div>
  );
};
