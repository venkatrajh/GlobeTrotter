import { CITIES_DATA } from '../data/citiesData';
import { ACTIVITIES_DATA } from '../data/activitiesData';
import { AI_MOCK_DATA } from '../data/aiMockData';

export const citiesApi = {
  getCities: async () => {
    await new Promise((r) => setTimeout(r, 100));
    return CITIES_DATA;
  },
  getCityById: async (id) => {
    await new Promise((r) => setTimeout(r, 100));
    return CITIES_DATA.find((c) => c.id === id);
  }
};

export const activitiesApi = {
  getActivities: async (filters = {}) => {
    await new Promise((r) => setTimeout(r, 150));
    let filtered = [...ACTIVITIES_DATA];
    if (filters.category && filters.category !== 'All') {
      filtered = filtered.filter((a) => a.category.toLowerCase() === filters.category.toLowerCase());
    }
    if (filters.search) {
      const q = filters.search.toLowerCase();
      filtered = filtered.filter((a) => a.name.toLowerCase().includes(q) || a.cityName.toLowerCase().includes(q) || a.description.toLowerCase().includes(q));
    }
    if (filters.cityId) {
      filtered = filtered.filter((a) => a.cityId === filters.cityId);
    }
    return filtered;
  },
  getActivityById: async (id) => {
    await new Promise((r) => setTimeout(r, 100));
    return ACTIVITIES_DATA.find((a) => a.id === id);
  }
};

export const budgetApi = {
  getBudgetBreakdown: async (tripId) => {
    await new Promise((r) => setTimeout(r, 100));
    return {
      total: 180000,
      spent: 120000,
      remaining: 60000,
      predictedTotal: 174000
    };
  }
};

export const itineraryApi = {
  getDayItinerary: async (tripId, dayNumber) => {
    await new Promise((r) => setTimeout(r, 100));
    return { success: true, tripId, dayNumber };
  },
  addActivityToDay: async (tripId, dayNumber, slot, activity) => {
    await new Promise((r) => setTimeout(r, 200));
    return { success: true, activity };
  }
};

export const aiApi = {
  generateTrip: async (payload) => {
    // Simulated multi-stage generation delay handled by UI visualizer
    await new Promise((r) => setTimeout(r, 600));
    return AI_MOCK_DATA.sampleGeneratedTrip;
  },

  askCopilot: async (tripId, userMessage) => {
    await new Promise((r) => setTimeout(r, 600));
    const msg = userMessage.toLowerCase();
    
    if (msg.includes('cheap') || msg.includes('budget') || msg.includes('cost')) {
      return {
        type: 'budget_suggestion',
        text: 'I analyzed Day 3 in Tokyo. Here is a way to trim ₹1,800 while maintaining great experiences:',
        card: {
          title: 'Budget Optimization for Day 3',
          savings: '₹1,800 saved',
          changes: [
            'Swap private taxi for Tokyo Metro 24h Pass (Save ₹1,100)',
            'Visit Roppongi Observation deck during happy hour pricing (Save ₹700)'
          ],
          actionLabel: 'Apply Budget Fix'
        }
      };
    }
    
    if (msg.includes('rain') || msg.includes('weather')) {
      return {
        type: 'warning',
        text: 'I spotted rain probability rising tomorrow afternoon. Here is an optimized weatherproof replacement:',
        card: {
          title: 'Rain Shield Substitution',
          original: 'Outdoor Sculpture Garden (2:00 PM)',
          replacement: 'Mori Art Museum & Indoor Planetarium (2:00 PM)',
          note: 'Equal walking distance & fully sheltered.',
          actionLabel: 'Swap for Indoor Plan'
        }
      };
    }

    if (msg.includes('4 hour') || msg.includes('short') || msg.includes('quick')) {
      return {
        type: 'itinerary_mod',
        text: 'Here is an ultra-curated 4-hour express loop in Tokyo:',
        card: {
          title: '4-Hour Shibuya Express Loop',
          items: [
            '13:00 - Shibuya Crossing & Hachiko Statue (30m)',
            '13:45 - Miyashita Park rooftop walk & coffee (45m)',
            '14:45 - Harajuku Takeshita & Meiji Jingu entrance (1h 45m)',
            '16:30 - Wrap up with Matcha Soft Serve (30m)'
          ],
          actionLabel: 'Add Express Loop'
        }
      };
    }

    if (msg.includes('food') || msg.includes('ramen') || msg.includes('eat')) {
      return {
        type: 'recommendation',
        text: 'Here are 3 exceptional food spots tailored to your route with great reviews:',
        card: {
          title: 'Curated Food Spots',
          items: [
            '🍜 Fuunji (Shinjuku) — Famous dipping Tsukemen ramen',
            '🍢 Omoide Yokocho Stall #4 — Charcoal yakitori skewers',
            '🍵 Cha Cha No Ma — Single origin green tea tasting in Omotesando'
          ],
          actionLabel: 'Add to Evening Plan'
        }
      };
    }

    return {
      type: 'normal',
      text: `I've reviewed your Japan itinerary. Everything is well balanced with reasonable transit times between Tokyo, Kyoto, and Osaka. Would you like me to check hotel rates or suggest evening izakayas?`
    };
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
