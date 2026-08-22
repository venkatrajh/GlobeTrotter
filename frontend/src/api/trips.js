import { apiClient } from './client';

// Helper to normalize backend Trip to frontend UI expected format
const normalizeTrip = (backendTrip) => {
  if (!backendTrip) return null;

  // Calculate duration
  const start = new Date(backendTrip.startDate);
  const end = new Date(backendTrip.endDate);
  const diffTime = Math.abs(end - start);
  const durationDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1 || 1;

  // Format dates for UI
  const formatOptions = { month: 'short', day: 'numeric' };
  const startDateStr = start.toLocaleDateString('en-US', formatOptions);
  const endDateStr = end.toLocaleDateString('en-US', { ...formatOptions, year: 'numeric' });

  return {
    id: backendTrip.id,
    title: backendTrip.title,
    destination: backendTrip.destination || 'Multiple Destinations',
    description: backendTrip.description || '',
    countryCode: 'GLOBAL', // Optional UI field fallback
    flag: '🌍',
    startDate: start.toISOString().split('T')[0],
    endDate: end.toISOString().split('T')[0],
    dateRange: `${startDateStr} - ${endDateStr}`,
    durationDays,
    status: 'Planning',
    currency: '$',
    coverImage: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=1200&q=80',
    totalBudget: 150000, // Fallback if UI expects it here; budget is real handled via budget API
    spentBudget: 0,
    travelStyle: 'Balanced',
    budgetTier: 'Moderate',
    interests: [],
    stops: backendTrip.stops || [],
    itinerary: {},
    budgetBreakdown: [],
    smartInsights: [],
    crew: [
      { id: backendTrip.ownerId, name: 'Trip Owner', role: 'Owner', email: '', status: 'online' }
    ],
    groupVotes: [],
    activityFeed: []
  };
};

export const normalizeFullTrip = (backendTrip) => {
  if (!backendTrip) return null;
  const uiTrip = normalizeTrip(backendTrip);

  // Process backend stops into UI format
  if (backendTrip.stops && backendTrip.stops.length > 0) {
    uiTrip.stops = backendTrip.stops.map((s, idx) => ({
      id: s.id,
      cityId: s.cityId || (s.city ? s.city.id : undefined),
      cityName: s.city ? s.city.name : (s.cityName || 'Destination'),
      country: s.city ? s.city.country : '',
      startDate: s.startDate,
      endDate: s.endDate,
      nights: s.startDate && s.endDate
        ? Math.max(1, Math.ceil((new Date(s.endDate) - new Date(s.startDate)) / (1000 * 60 * 60 * 24)))
        : 2,
      order: s.order ?? idx
    }));

    // Reconstruct UI itinerary from stop activities
    const itineraryMap = {};
    backendTrip.stops.forEach((stop, stopIndex) => {
      const dayNum = stopIndex + 1;
      if (!itineraryMap[dayNum]) {
        itineraryMap[dayNum] = {
          dayNumber: dayNum,
          date: `DAY ${String(dayNum).padStart(2, '0')}`,
          city: stop.city ? stop.city.name : 'DESTINATION',
          morning: [],
          afternoon: [],
          evening: [],
          dayTotalHours: 0,
          dayTotalCost: 0
        };
      }

      if (stop.activities) {
        stop.activities.forEach((stopAct, actIdx) => {
          const actName = stopAct.activity ? stopAct.activity.name : (stopAct.customName || 'Activity');
          const actCat = stopAct.activity ? stopAct.activity.category : 'General';
          const actCost = (stopAct.activity && stopAct.activity.estimatedCost) || stopAct.estimatedCost || 0;
          const actDuration = (stopAct.activity && stopAct.activity.duration) ? `${Math.round(stopAct.activity.duration / 60 * 10) / 10} Hours` : '2 Hours';

          const slot = actIdx % 3 === 0 ? 'morning' : (actIdx % 3 === 1 ? 'afternoon' : 'evening');
          const uiAct = {
            id: stopAct.id,
            activityId: stopAct.activityId,
            title: actName,
            category: actCat,
            duration: actDuration,
            cost: actCost,
            icon: '📍',
            location: stop.city ? stop.city.name : 'City Center',
            description: (stopAct.activity && stopAct.activity.description) || stopAct.notes || ''
          };

          itineraryMap[dayNum][slot].push(uiAct);
          itineraryMap[dayNum].dayTotalCost += actCost;
        });
      }
    });

    uiTrip.itinerary = itineraryMap;
  }

  if (backendTrip.budgetSummary) {
    uiTrip.totalBudget = backendTrip.budgetSummary.totalBudget || 150000;
    uiTrip.spentBudget = backendTrip.budgetSummary.totalSpent || 0;

    // Map budget breakdown
    if (backendTrip.budgetSummary.categoryBreakdown) {
      const catKeys = Object.keys(backendTrip.budgetSummary.categoryBreakdown);
      uiTrip.budgetBreakdown = catKeys.map(key => ({
        category: key,
        icon: '💰',
        percentage: uiTrip.totalBudget > 0 ? Math.round((backendTrip.budgetSummary.categoryBreakdown[key] / uiTrip.totalBudget) * 100) : 0,
        planned: backendTrip.budgetSummary.categoryBreakdown[key],
        spent: backendTrip.budgetSummary.categoryBreakdown[key],
        color: 'bg-zinc-700'
      }));
    }
  }

  return uiTrip;
};

export const tripsApi = {
  getAllTrips: async () => {
    const res = await apiClient.get('/trips');
    return res.data.map(normalizeTrip);
  },

  getTripById: async (id) => {
    // Call the full itinerary endpoint so we get stops, activities, and budget items
    const res = await apiClient.get(`/trips/${id}/full`);
    return normalizeFullTrip(res.data);
  },

  createTrip: async (tripData) => {
    // 1. Create the trip first
    const payload = {
      title: tripData.title || 'New Trip',
      destination: tripData.destination || (tripData.stops && tripData.stops[0]?.cityName) || 'Multiple Destinations',
      description: tripData.description,
      startDate: tripData.startDate || new Date().toISOString(),
      endDate: tripData.endDate || new Date(Date.now() + 86400000 * 3).toISOString(),
    };

    const res = await apiClient.post('/trips', payload);
    const newTripId = res.data.id;

    // 2. Create the stops if provided (from the frontend wizard)
    if (tripData.stops && tripData.stops.length > 0) {
      let currentStartDate = new Date(payload.startDate);

      // Fetch real cities to map names to UUIDs
      const realCitiesRes = await apiClient.get('/cities');
      const realCities = realCitiesRes.data || [];

      for (let i = 0; i < tripData.stops.length; i++) {
        const stop = tripData.stops[i];

        // Ensure we don't go past trip endDate
        let stopEndDate = new Date(currentStartDate);
        stopEndDate.setDate(stopEndDate.getDate() + (stop.nights || 2));
        const maxEndDate = new Date(payload.endDate);
        if (stopEndDate > maxEndDate) stopEndDate = maxEndDate;

        // Resolve real city UUID by name
        let realCityId = stop.cityId;
        const matchedCity = realCities.find(c => c.name.toLowerCase() === (stop.cityName || '').toLowerCase());
        if (matchedCity) {
          realCityId = matchedCity.id;
        } else if (realCities.length > 0) {
          realCityId = realCities[0].id; // Fallback to first available real city
        }

        await apiClient.post(`/trips/${newTripId}/stops`, {
          cityId: realCityId,
          startDate: currentStartDate.toISOString(),
          endDate: stopEndDate.toISOString(),
          order: i
        });

        currentStartDate = new Date(stopEndDate); // next stop starts when this one ends
      }
    }

    // 3. Fetch the fully assembled trip to return to TripContext
    return await tripsApi.getTripById(newTripId);
  },

  updateTrip: async (id, updates) => {
    // Filter updates to backend-supported fields
    const payload = {};
    if (updates.title) payload.title = updates.title;
    if (updates.description) payload.description = updates.description;
    if (updates.destination) payload.destination = updates.destination;
    if (updates.startDate) payload.startDate = updates.startDate;
    if (updates.endDate) payload.endDate = updates.endDate;

    const res = await apiClient.put(`/trips/${id}`, payload);
    return normalizeTrip(res.data);
  },

  deleteTrip: async (id) => {
    await apiClient.delete(`/trips/${id}`);
    return { success: true };
  },

  getShareStatus: async (tripId) => {
    const res = await apiClient.get(`/trips/${tripId}/share`);
    return res.data;
  },

  createShare: async (tripId) => {
    const res = await apiClient.post(`/trips/${tripId}/share`);
    return res.data;
  },

  disableShare: async (tripId) => {
    const res = await apiClient.delete(`/trips/${tripId}/share`);
    return res.data;
  },

  getPublicTrip: async (slug) => {
    const res = await apiClient.get(`/public/trips/${slug}`);
    return normalizeFullTrip(res.data);
  },

  copyPublicTrip: async (slug) => {
    const res = await apiClient.post(`/public/trips/${slug}/copy`);
    return res.data;
  }
};
