import { apiClient } from './client';
import { AI_MOCK_DATA } from '../data/aiMockData'; // For AI fallback until Phase E

export const citiesApi = {
  getCities: async (params = {}) => {
    // Backend supports: GET /cities?search=xyz&page=1&limit=20
    const res = await apiClient.get('/cities', params);
    // Normalize to mock structure if necessary, though backend should return id, name, country
    return res.data.map(c => ({
      id: c.id,
      name: c.name,
      country: c.country,
      description: c.description || '',
      image: c.image || 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=800&q=80'
    }));
  },
  getCityById: async (id) => {
    // If backend doesn't have getCityById, we can try fetching list and filtering,
    // or just return a dummy wrapper if it's rarely used.
    // Let's fetch all and find it just in case
    const res = await apiClient.get('/cities', { limit: 100 });
    const c = res.data.find(city => city.id === id);
    if (!c) return null;
    return {
      id: c.id,
      name: c.name,
      country: c.country,
      description: c.description || '',
      image: c.image || 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=800&q=80'
    };
  }
};

export const activitiesApi = {
  getActivities: async (filters = {}) => {
    // Backend supports GET /activities?search=...&cityId=...&page=1&limit=20
    const params = {};
    if (filters.search) params.search = filters.search;
    if (filters.cityId) params.cityId = filters.cityId;
    // Category mapping could be passed, backend might not support it natively if not in DB schema,
    // but let's pass it anyway

    const res = await apiClient.get('/activities', params);

    let data = res.data;
    if (filters.category && filters.category !== 'All') {
      data = data.filter(a => a.category?.toLowerCase() === filters.category.toLowerCase());
    }

    return data.map(a => ({
      id: a.id,
      name: a.name,
      category: a.category || 'Activity',
      description: a.description || '',
      duration: a.duration || '2 hours',
      estimatedCost: a.estimatedCost || 0,
      image: 'https://images.unsplash.com/photo-1533929736458-ca588d08c8be?w=800&q=80',
      cityName: 'City',
      cityId: a.cityId
    }));
  },
  getActivityById: async (id) => {
    try {
      const res = await apiClient.get(`/activities/${id}`);
      const a = res.data;
      return {
        id: a.id,
        name: a.name,
        category: a.category || 'Activity',
        description: a.description || '',
        duration: a.duration ? `${Math.round(a.duration / 60 * 10) / 10} Hours` : '2 Hours',
        estimatedCost: a.estimatedCost || 0,
        image: 'https://images.unsplash.com/photo-1533929736458-ca588d08c8be?w=800&q=80',
        cityName: a.city?.name || 'City',
        cityId: a.cityId
      };
    } catch (err) {
      return {
        id,
        name: 'Activity',
        category: 'General',
        duration: '2 Hours',
        estimatedCost: 50
      };
    }
  }
};

export const budgetApi = {
  getBudgetBreakdown: async (tripId) => {
    // Backend supports GET /trips/:id/budget
    const res = await apiClient.get(`/trips/${tripId}/budget`);
    // Backend returns: { success: true, data: { budget, spent, remaining, ... } }
    // Frontend expects: { total, spent, remaining, predictedTotal }
    return {
      total: res.data.budget || 0,
      spent: res.data.spent || 0,
      remaining: res.data.remaining || 0,
      predictedTotal: res.data.spent || 0 // Default predicted to spent
    };
  }
};

// We will implement itineraryApi to map to stops and stop-activities
export const itineraryApi = {
  getDayItinerary: async (tripId, dayNumber) => {
    const res = await apiClient.get(`/trips/${tripId}/timeline`);
    return res.data;
  },

  addActivityToDay: async (stopId, activityId, scheduledDate, order) => {
    // Backend: POST /api/stops/:stopId/activities
    const payload = {
      activityId,
      scheduledDate,
      order
    };
    const res = await apiClient.post(`/stops/${stopId}/activities`, payload);
    return res.data;
  },

  removeActivity: async (stopActivityId) => {
    // Backend: DELETE /api/stop-activities/:id
    const res = await apiClient.delete(`/stop-activities/${stopActivityId}`);
    return res.data;
  }
};

export const aiApi = {
  generateTrip: async (payload) => {
    // payload from AIGeneratorSentenceForm: { destination, days, budget, pace, interests }
    // Backend TripGeneratorRequestSchema: { destination (string), days (number), budget (number), currency (string) }

    // Map frontend payload to backend schema
    const budgetNumber = Number((payload.budget || '150000').replace(/,/g, ''));
    const daysNumber = Number(payload.days) || 12;

    const requestPayload = {
      destination: payload.destination || 'Japan',
      days: daysNumber,
      budget: budgetNumber,
      currency: 'USD' // Defaulting to USD or parse from UI if needed
    };

    const res = await apiClient.post('/ai/trip-generator', requestPayload);
    const aiData = res.data;

    // Map backend AI output to what AIPlannerPage expects (sampleGeneratedTrip shape)
    const routeNames = Array.from(new Set((aiData.itinerary || []).map(day => day.city))).filter(Boolean);
    const routeSummaryText = routeNames.join(' ➔ ') || payload.destination;

    const dayBreakdown = (aiData.itinerary || []).map((day, idx) => ({
      day: idx + 1,
      title: day.date || `Day ${idx + 1}`,
      city: day.city || payload.destination,
      dots: Math.min(4, Math.max(2, (day.activities || []).length)),
      tags: (day.activities || []).map(a => a.name).slice(0, 3)
    }));

    return {
      title: aiData.title || `${payload.destination} Journey`,
      destination: payload.destination,
      flag: '🗺️',
      durationDays: daysNumber,
      totalBudget: aiData.totalEstimatedCost || budgetNumber,
      activitiesCount: (aiData.itinerary || []).reduce((acc, day) => acc + (day.activities || []).length, 0),
      route: routeNames,
      routeSummary: routeSummaryText,
      confidenceScore: 92,
      dayBreakdown: dayBreakdown.length > 0 ? dayBreakdown : [{ day: 1, title: 'Explore', city: payload.destination, dots: 2, tags: ['Sightseeing'] }]
    };
  },

  optimizeBudget: async (trip) => {
    // Extract itinerary conforming to BudgetOptimizerRequestSchema and DaySchema
    const budgetReq = {
      budget: Number(trip.totalBudget) || 150000,
      currency: 'USD',
      itinerary: {
        destination: trip.destination || (trip.stops && trip.stops[0]?.cityName) || 'Travel Destination',
        days: []
      }
    };

    const daysList = trip.itinerary ? Object.values(trip.itinerary) : [];
    if (daysList.length > 0) {
      daysList.forEach((day, idx) => {
        const rawActivities = [
          ...(day.morning || []).map((a, i) => ({ ...a, timeSlot: '09:00', duration: 60 })),
          ...(day.afternoon || []).map((a, i) => ({ ...a, timeSlot: '14:00', duration: 90 })),
          ...(day.evening || []).map((a, i) => ({ ...a, timeSlot: '19:00', duration: 120 }))
        ];

        const formattedActivities = rawActivities.map((a, aIdx) => ({
          name: a.title || a.name || 'Activity',
          category: a.category || 'Sightseeing',
          suggested_time: a.timeSlot || '10:00',
          duration_minutes: Number(a.duration) || 60,
          estimated_cost: Number(a.cost) || 0
        }));

        budgetReq.itinerary.days.push({
          day: Number(day.dayNumber) || (idx + 1),
          city: day.city || trip.destination || 'City',
          date: day.date || `Day ${idx + 1}`,
          activities: formattedActivities,
          estimated_daily_cost: formattedActivities.reduce((acc, curr) => acc + curr.estimated_cost, 0)
        });
      });
    } else if (trip.stops && trip.stops.length > 0) {
      trip.stops.forEach((stop, idx) => {
        budgetReq.itinerary.days.push({
          day: idx + 1,
          city: stop.cityName || trip.destination || 'City',
          activities: [
            {
              name: 'City Exploration',
              category: 'Sightseeing',
              suggested_time: '10:00',
              duration_minutes: 120,
              estimated_cost: 1500
            }
          ],
          estimated_daily_cost: 1500
        });
      });
    } else {
      budgetReq.itinerary.days.push({
        day: 1,
        city: trip.destination || 'City',
        activities: [
          {
            name: 'Welcome Tour',
            category: 'Sightseeing',
            suggested_time: '10:00',
            duration_minutes: 90,
            estimated_cost: 1000
          }
        ],
        estimated_daily_cost: 1000
      });
    }

    const res = await apiClient.post('/ai/budget-optimizer', budgetReq);
    const aiData = res.data;

    // Member 3 AI returns { summary, potential_savings, suggestions: [ { id, type, reason, estimated_savings, suggested_replacement, tradeoffs } ] }
    if (!aiData) return [];

    const suggestions = aiData.suggestions || [];
    if (suggestions.length > 0) {
      return suggestions.map((sug, idx) => ({
        id: sug.id || `ai-opt-${idx}`,
        title: sug.type ? sug.type.replace(/_/g, ' ').toUpperCase() : 'Budget Optimization',
        description: sug.reason || 'Smart saving suggestion for your itinerary.',
        potentialSaving: sug.estimated_savings || sug.savings || 0,
        type: 'savings'
      }));
    }

    if (aiData.summary || aiData.potential_savings) {
      return [
        {
          id: 'ai-opt-summary',
          title: 'AI Budget Allocation',
          description: aiData.summary || 'Your itinerary budget is balanced.',
          potentialSaving: aiData.potential_savings || 0,
          type: 'savings'
        }
      ];
    }

    return [];
  },

  askCopilot: async (tripId, userMessage) => {
    await new Promise((r) => setTimeout(r, 600));
    return { type: 'normal', text: `This is a Phase D AI mock.` };
  },

  getReplannerScenario: async () => {
    await new Promise((r) => setTimeout(r, 200));
    return AI_MOCK_DATA.replannerScenario;
  },

  getRouteOptimization: async () => {
    await new Promise((r) => setTimeout(r, 200));
    return AI_MOCK_DATA.routeOptimizerScenario;
  }
};
