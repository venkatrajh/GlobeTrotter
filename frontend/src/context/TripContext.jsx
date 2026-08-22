import React, { createContext, useContext, useState, useEffect } from 'react';
import { tripsApi } from '../api/trips';
import { itineraryApi } from '../api/services';

const TripContext = createContext(null);

export const TripProvider = ({ children }) => {
  const [trips, setTrips] = useState([]);
  const [activeTripId, setActiveTripId] = useState(null);
  const [activeDay, setActiveDay] = useState(1);
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState(null);

  const refreshTrips = async () => {
    try {
      setLoading(true);
      const data = await tripsApi.getAllTrips();
      setTrips(data);
      if (data.length > 0 && !activeTripId) {
        setActiveTripId(data[0].id);
      }
      return data;
    } catch (e) {
      console.error('Failed to load trips:', e);
      return [];
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshTrips();
  }, []);

  useEffect(() => {
    const loadFullTrip = async () => {
      if (!activeTripId) return;
      try {
        const fullTrip = await tripsApi.getTripById(activeTripId);
        if (fullTrip) {
          setTrips(prev => prev.map(t => t.id === activeTripId ? fullTrip : t));
        }
      } catch (e) {
        console.error('Failed to load full trip:', e);
      }
    };
    loadFullTrip();
  }, [activeTripId]);

  const activeTrip = trips.find((t) => t.id === activeTripId) || (trips.length > 0 ? trips[0] : null);

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

  const addActivityToItinerary = async (dayNum, slot, activity) => {
    if (!activeTrip || !activeTrip.stops || activeTrip.stops.length === 0) {
      showNotification('Please add a destination/stop to your trip first!', 'error');
      return;
    }

    setLoading(true);
    try {
      // Find the corresponding stop for the day (simplification: day 1 = stop 1)
      const stopIndex = Math.min(dayNum - 1, activeTrip.stops.length - 1);
      const stop = activeTrip.stops[stopIndex];

      if (!stop || !stop.id) {
        throw new Error("No valid stop found to add this activity to.");
      }

      // We need a proper date to schedule it. Use the trip start date + dayNum
      const scheduledDate = new Date(activeTrip.startDate);
      scheduledDate.setDate(scheduledDate.getDate() + (dayNum - 1));

      await itineraryApi.addActivityToDay(stop.id, activity.id, scheduledDate.toISOString(), dayNum);

      showNotification(`Added ${activity.name || activity.title} to Day ${dayNum} (${slot})!`, 'success');

      // Reload the trip to get the fully populated itinerary
      const fullTrip = await tripsApi.getTripById(activeTrip.id);
      setTrips(prev => prev.map(t => t.id === activeTrip.id ? fullTrip : t));

    } catch (e) {
      console.error(e);
      showNotification('Failed to add activity.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const removeActivityFromItinerary = async (dayNum, slot, activityId) => {
    if (!activeTrip) return;

    setLoading(true);
    try {
      await itineraryApi.removeActivity(activityId);

      showNotification('Activity removed from itinerary', 'info');

      // Reload the trip
      const fullTrip = await tripsApi.getTripById(activeTrip.id);
      setTrips(prev => prev.map(t => t.id === activeTrip.id ? fullTrip : t));
    } catch (e) {
      console.error(e);
      showNotification('Failed to remove activity.', 'error');
    } finally {
      setLoading(false);
    }
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
        refreshTrips,
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
