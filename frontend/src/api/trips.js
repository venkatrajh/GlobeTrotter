import { TRIPS_DATA } from '../data/tripsData';

let storedTrips = [...TRIPS_DATA];

export const tripsApi = {
  getAllTrips: async () => {
    await new Promise((res) => setTimeout(res, 200));
    return [...storedTrips];
  },

  getTripById: async (id) => {
    await new Promise((res) => setTimeout(res, 150));
    return storedTrips.find((t) => t.id === id) || storedTrips[0];
  },

  createTrip: async (tripData) => {
    await new Promise((res) => setTimeout(res, 350));
    const newTrip = {
      id: `trip-${Date.now()}`,
      title: tripData.title || 'My New Adventure',
      destination: tripData.destination || 'Selected Destinations',
      countryCode: 'GLOBAL',
      flag: '✈️',
      startDate: tripData.startDate || '2026-04-01',
      endDate: tripData.endDate || '2026-04-12',
      dateRange: `${tripData.startDate || 'APR 01'} – ${tripData.endDate || 'APR 12, 2026'}`,
      durationDays: tripData.durationDays || 12,
      totalBudget: tripData.totalBudget || 150000,
      spentBudget: 0,
      status: 'Planning',
      currency: '₹',
      coverImage: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=1200&q=80',
      description: tripData.description || 'Custom handcrafted multi-city trip.',
      travelStyle: tripData.travelStyle || 'Balanced',
      budgetTier: tripData.budgetTier || 'Moderate',
      interests: tripData.interests || ['Sightseeing', 'Food'],
      stops: tripData.stops || [],
      itinerary: tripData.itinerary || { 1: { dayNumber: 1, date: 'DAY 01', city: 'START', morning: [], afternoon: [], evening: [], dayTotalHours: 0, dayTotalCost: 0 } },
      budgetBreakdown: [
        { category: 'Stay', icon: '🏨', percentage: 40, planned: (tripData.totalBudget || 150000) * 0.4, spent: 0, color: 'bg-zinc-900' },
        { category: 'Transport', icon: '🚆', percentage: 25, planned: (tripData.totalBudget || 150000) * 0.25, spent: 0, color: 'bg-zinc-700' },
        { category: 'Activities', icon: '🎟', percentage: 20, planned: (tripData.totalBudget || 150000) * 0.2, spent: 0, color: 'bg-zinc-500' },
        { category: 'Meals', icon: '🍜', percentage: 15, planned: (tripData.totalBudget || 150000) * 0.15, spent: 0, color: 'bg-zinc-400' }
      ],
      smartInsights: [
        { id: 'ins-new', title: 'Smart Budget Allocation Active', description: 'AI has balanced your daily allowance across selected stops.', potentialSaving: 2000, type: 'savings' }
      ],
      crew: [
        { id: 'usr-1', name: 'Nakul (You)', role: 'Owner', avatar: '👨‍💻', email: 'nakul@globetrotter.io', status: 'online' }
      ],
      groupVotes: [],
      activityFeed: [
        { id: `feed-${Date.now()}`, user: 'Nakul (You)', action: 'created', target: 'this journey', time: 'Just now' }
      ]
    };

    storedTrips = [newTrip, ...storedTrips];
    return newTrip;
  },

  updateTrip: async (id, updates) => {
    await new Promise((res) => setTimeout(res, 200));
    storedTrips = storedTrips.map((t) => (t.id === id ? { ...t, ...updates } : t));
    return storedTrips.find((t) => t.id === id);
  },

  deleteTrip: async (id) => {
    await new Promise((res) => setTimeout(res, 200));
    storedTrips = storedTrips.filter((t) => t.id !== id);
    return { success: true };
  }
};
