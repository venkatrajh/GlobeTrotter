import React, { createContext, useContext, useState, useEffect } from 'react';
import { TRIPS_DATA } from '../data/tripsData';
import { tripsApi } from '../api/trips';

const TripContext = createContext(null);

export const TripProvider = ({ children }) => {
  const [trips, setTrips] = useState(TRIPS_DATA);
  const [activeTripId, setActiveTripId] = useState('japan-adventure');
  const [activeDay, setActiveDay] = useState(1);
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState(null);

  const activeTrip = trips.find((t) => t.id === activeTripId) || trips[0];

  const showNotification = (message, type = 'info') => {
    setNotification({ message, type, id: Date.now() });
    setTimeout(() => {
      setNotification(null);
    }, 4000);
  };

  const createTrip = async (tripData) => {
    setLoading(true);
    try {
      const newTrip = await tripsApi.createTrip(tripData);
      setTrips((prev) => [newTrip, ...prev]);
      setActiveTripId(newTrip.id);
      showNotification(`Trip "${newTrip.title}" created successfully!`, 'success');
      return newTrip;
    } finally {
      setLoading(false);
    }
  };

  const updateTrip = (tripId, updates) => {
    setTrips((prev) =>
      prev.map((t) => (t.id === tripId ? { ...t, ...updates } : t))
    );
  };

  const addActivityToItinerary = (dayNum, slot, activity) => {
    if (!activeTrip) return;
    const currentItinerary = { ...(activeTrip.itinerary || {}) };
    const dayData = currentItinerary[dayNum] || {
      dayNumber: dayNum,
      date: `DAY ${String(dayNum).padStart(2, '0')}`,
      city: activeTrip.stops?.[0]?.cityName?.toUpperCase() || 'DESTINATION',
      morning: [],
      afternoon: [],
      evening: [],
      dayTotalHours: 0,
      dayTotalCost: 0
    };

    const targetSlot = slot.toLowerCase(); // 'morning', 'afternoon', 'evening'
    const updatedSlotList = [...(dayData[targetSlot] || []), {
      id: `act-custom-${Date.now()}`,
      title: activity.name || activity.title,
      category: activity.category || 'Sightseeing',
      time: targetSlot === 'morning' ? '10:00 AM' : targetSlot === 'afternoon' ? '02:30 PM' : '07:00 PM',
      duration: activity.duration || '2 Hours',
      cost: activity.cost || 500,
      icon: activity.categoryIcon || activity.icon || '📍',
      location: activity.location || 'City Center',
      description: activity.description || 'Added to custom itinerary.'
    }];

    const allActs = [
      ...(targetSlot === 'morning' ? updatedSlotList : (dayData.morning || [])),
      ...(targetSlot === 'afternoon' ? updatedSlotList : (dayData.afternoon || [])),
      ...(targetSlot === 'evening' ? updatedSlotList : (dayData.evening || []))
    ];

    const totalHours = allActs.reduce((acc, curr) => {
      const parsed = parseFloat(curr.duration) || 2;
      return acc + parsed;
    }, 0);

    const totalCost = allActs.reduce((acc, curr) => {
      return acc + (Number(curr.cost) || 0);
    }, 0);

    const updatedDayData = {
      ...dayData,
      [targetSlot]: updatedSlotList,
      dayTotalHours: totalHours,
      dayTotalCost: totalCost
    };

    currentItinerary[dayNum] = updatedDayData;

    updateTrip(activeTrip.id, {
      itinerary: currentItinerary,
      spentBudget: (activeTrip.spentBudget || 0) + (Number(activity.cost) || 500),
      activityFeed: [
        {
          id: `feed-${Date.now()}`,
          user: 'Nakul (You)',
          action: 'added',
          target: `${activity.name || activity.title} to Day ${dayNum}`,
          time: 'Just now'
        },
        ...(activeTrip.activityFeed || [])
      ]
    });

    showNotification(`Added ${activity.name || activity.title} to Day ${dayNum} (${slot})!`, 'success');
  };

  const removeActivityFromItinerary = (dayNum, slot, activityId) => {
    if (!activeTrip || !activeTrip.itinerary || !activeTrip.itinerary[dayNum]) return;
    const dayData = { ...activeTrip.itinerary[dayNum] };
    const targetSlot = slot.toLowerCase();
    
    dayData[targetSlot] = (dayData[targetSlot] || []).filter((a) => a.id !== activityId);
    
    const allActs = [
      ...(dayData.morning || []),
      ...(dayData.afternoon || []),
      ...(dayData.evening || [])
    ];

    dayData.dayTotalHours = allActs.reduce((acc, curr) => acc + (parseFloat(curr.duration) || 2), 0);
    dayData.dayTotalCost = allActs.reduce((acc, curr) => acc + (Number(curr.cost) || 0), 0);

    const updatedItinerary = {
      ...activeTrip.itinerary,
      [dayNum]: dayData
    };

    updateTrip(activeTrip.id, { itinerary: updatedItinerary });
    showNotification('Activity removed from itinerary', 'info');
  };

  const voteOnGroupActivity = (voteId, direction) => {
    if (!activeTrip || !activeTrip.groupVotes) return;
    const updatedVotes = activeTrip.groupVotes.map((v) => {
      if (v.id === voteId) {
        const wasUp = v.userVoted === 'up';
        const wasDown = v.userVoted === 'down';
        
        let newUp = v.upvotes;
        let newDown = v.downvotes;
        let newUserVoted = direction;

        if (direction === 'up') {
          if (wasUp) {
            newUp -= 1;
            newUserVoted = null;
          } else {
            newUp += 1;
            if (wasDown) newDown -= 1;
          }
        } else if (direction === 'down') {
          if (wasDown) {
            newDown -= 1;
            newUserVoted = null;
          } else {
            newDown += 1;
            if (wasUp) newUp -= 1;
          }
        }

        return {
          ...v,
          upvotes: newUp,
          downvotes: newDown,
          userVoted: newUserVoted,
          isPopular: newUp >= 5
        };
      }
      return v;
    });

    updateTrip(activeTrip.id, {
      groupVotes: updatedVotes,
      activityFeed: [
        {
          id: `feed-${Date.now()}`,
          user: 'Nakul (You)',
          action: 'voted on',
          target: activeTrip.groupVotes.find((v) => v.id === voteId)?.activityName || 'activity',
          time: 'Just now'
        },
        ...(activeTrip.activityFeed || [])
      ]
    });
  };

  const applyReplannerSuggestion = () => {
    if (!activeTrip) return;
    showNotification('Weather-optimized replan applied! Your Day 3 has been adjusted.', 'success');
  };

  const applyRouteOptimization = () => {
    if (!activeTrip) return;
    showNotification('Smarter Route Applied! Saved 2h 20m and ₹3,400 transit.', 'success');
  };

  return (
    <TripContext.Provider
      value={{
        trips,
        activeTrip,
        activeTripId,
        setActiveTripId,
        activeDay,
        setActiveDay,
        loading,
        notification,
        showNotification,
        createTrip,
        updateTrip,
        addActivityToItinerary,
        removeActivityFromItinerary,
        voteOnGroupActivity,
        applyReplannerSuggestion,
        applyRouteOptimization
      }}
    >
      {children}
    </TripContext.Provider>
  );
};

export const useTrips = () => {
  const context = useContext(TripContext);
  if (!context) {
    throw new Error('useTrips must be used within TripProvider');
  }
  return context;
};
