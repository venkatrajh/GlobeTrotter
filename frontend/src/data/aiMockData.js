export const AI_MOCK_DATA = {
  suggestedPrompts: [
    'I want to explore Japan for 12 days with a budget of ₹1,80,000.',
    'Plan a romantic 8-day trip to Switzerland and Italy under ₹2.5L.',
    'Fast-paced 5-day adventure in Vietnam with street food focus.',
    'Serene wellness retreat in Kerala and Sri Lanka for 10 days.'
  ],

  generationSteps: [
    { id: 1, text: 'Understanding your travel style & pace', duration: 900 },
    { id: 2, text: 'Finding ideal destinations & optimal stopovers', duration: 1200 },
    { id: 3, text: 'Balancing your budget across stays & activities', duration: 1100 },
    { id: 4, text: 'Building day-by-day curated morning/evening slots', duration: 1000 },
    { id: 5, text: 'Optimizing transport routes between cities', duration: 800 }
  ],

  sampleGeneratedTrip: {
    title: 'Japan Golden Route AI Masterpiece',
    destination: 'Japan',
    flag: '🇯🇵',
    durationDays: 12,
    totalBudget: 174500,
    activitiesCount: 26,
    route: ['TOKYO', 'KYOTO', 'OSAKA'],
    routeSummary: 'TOKYO ──✈── KYOTO ──🚅── OSAKA',
    confidenceScore: 98,
    dayBreakdown: [
      { day: 1, title: 'Arrival & Shibuya Energy', city: 'Tokyo', dots: 3, tags: ['Shibuya', 'Ramen', 'Tokyo Tower'] },
      { day: 2, title: 'Old & New Tokyo Contrast', city: 'Tokyo', dots: 4, tags: ['Asakusa', 'Akihabara', 'Sumida Cruise', 'Omoide'] },
      { day: 3, title: 'Art, Greenery & Luxury', city: 'Tokyo', dots: 3, tags: ['Shinjuku Gyoen', 'Mori Art', 'Ginza'] },
      { day: 4, title: 'Fuji Day Excursion & Shinkansen', city: 'Tokyo → Kyoto', dots: 3, tags: ['Hakone Ropeway', 'Lake Ashi', 'Bullet Train'] },
      { day: 5, title: 'Spiritual Kyoto Torii & Tea', city: 'Kyoto', dots: 4, tags: ['Fushimi Inari', 'Gion Machiya', 'Tea Ceremony', 'Kiyomizu-dera'] },
      { day: 6, title: 'Zen Bamboo & Golden Temple', city: 'Kyoto', dots: 3, tags: ['Arashiyama', 'Tenryu-ji', 'Kinkaku-ji'] },
      { day: 7, title: 'Historic Nara & Deer Park', city: 'Kyoto / Nara', dots: 3, tags: ['Nara Park', 'Todai-ji', 'Uji Matcha'] },
      { day: 8, title: 'Transition to Kitchen of Japan', city: 'Osaka', dots: 3, tags: ['Osaka Castle', 'Kuromon Market', 'Umeda Sky'] },
      { day: 9, title: 'Sizzling Dotonbori Feast', city: 'Osaka', dots: 4, tags: ['Shinsekai', 'Takoyaki Class', 'Dotonbori Neon', 'Craft Beer'] },
      { day: 10, title: 'Universal Studios or Minoh Waterfall', city: 'Osaka', dots: 3, tags: ['Theme Park', 'Nature Hike', 'Namba'] },
      { day: 11, title: 'Kobe Port & Wagyu Tasting', city: 'Osaka / Kobe', dots: 3, tags: ['Kobe Harbor', 'Wagyu Beef', 'Ropeway'] },
      { day: 12, title: 'Souvenir Hunt & Departure', city: 'Osaka → Airport', dots: 2, tags: ['Last Minute Bento', 'Departure'] }
    ]
  },

  copilotQuickActions: [
    { id: 'cheaper', label: 'Make today cheaper', prompt: 'How can I make Day 3 in Tokyo more affordable without missing key sights?' },
    { id: 'four_hours', label: 'I only have 4 hours', prompt: 'I have a 4-hour window in Tokyo this afternoon. What are the best compact activities?' },
    { id: 'rain', label: 'What if it rains?', prompt: 'Rain is forecast for tomorrow. Can you replace outdoor activities with indoor equivalents?' },
    { id: 'food', label: 'Add more food experiences', prompt: 'Recommend top local food stops near Shibuya and Shinjuku with vegetarian options.' }
  ],

  replannerScenario: {
    alert: '⚠ Rain is expected during your Outdoor Museum visit at 2:00 PM.',
    situation: 'Weather radar indicates heavy precipitation between 1:30 PM and 4:30 PM in Roppongi / Minato area.',
    before: {
      time: '2:00 PM',
      activity: 'Outdoor Sculpture Museum & Garden',
      duration: '2.5 Hours',
      cost: '₹1,200',
      type: 'Outdoor'
    },
    after: {
      morningSlot: {
        time: '10:00 AM',
        activity: 'Outdoor Sculpture Museum & Garden',
        note: 'Moved to morning (clear weather window)'
      },
      afternoonSlot: {
        time: '2:30 PM',
        activity: 'Mori Art Museum & Indoor Observation Deck',
        note: 'Weatherproof indoor alternative'
      }
    },
    reassurances: [
      'Your trip duration stays exactly the same',
      'No activities are removed or canceled',
      'Your budget remains unchanged (₹0 extra cost)'
    ]
  },

  routeOptimizerScenario: {
    currentRoute: {
      label: 'CURRENT ROUTE',
      totalTravelTime: '4h 30m',
      distance: '510 km',
      stops: ['Tokyo', 'Osaka', 'Kyoto']
    },
    smarterRoute: {
      label: 'SMARTER ROUTE',
      totalTravelTime: '2h 10m',
      distance: '468 km',
      stops: ['Tokyo', 'Kyoto', 'Osaka']
    },
    savings: {
      timeSaved: '2h 20m',
      distanceSaved: '42 km',
      changesSaved: '3 changes'
    }
  }
};
