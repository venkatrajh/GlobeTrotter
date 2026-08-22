export const TRIPS_DATA = [
  {
    id: 'japan-adventure',
    title: 'Japan Adventure',
    destination: 'Japan',
    countryCode: 'JP',
    flag: '🇯🇵',
    startDate: '2026-03-12',
    endDate: '2026-03-24',
    dateRange: 'MAR 12 – MAR 24, 2026',
    durationDays: 12,
    totalBudget: 180000,
    spentBudget: 120000,
    status: 'Upcoming',
    currency: '₹',
    coverImage: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=1200&q=80',
    description: 'An immersive 12-day journey spanning neon Tokyo, tranquil Kyoto bamboo forests, and sizzling Osaka street food culture.',
    travelStyle: 'Balanced',
    budgetTier: 'Moderate',
    interests: ['Food', 'Culture', 'Sightseeing', 'Nature'],
    
    stops: [
      {
        id: 'stop-1',
        cityId: 'tokyo',
        cityName: 'Tokyo',
        code: 'NRT',
        nights: 4,
        dateRange: 'Mar 12 – Mar 16',
        transportToNext: {
          mode: 'flight',
          icon: '✈',
          label: 'Domestic Flight',
          duration: '2h 15m',
          distance: '450 km',
          departureTime: '11:00 AM'
        },
        highlights: ['Tokyo Tower', 'Tsukiji Market', 'Shibuya Crossing']
      },
      {
        id: 'stop-2',
        cityId: 'kyoto',
        cityName: 'Kyoto',
        code: 'KYO',
        nights: 4,
        dateRange: 'Mar 16 – Mar 20',
        transportToNext: {
          mode: 'train',
          icon: '🚅',
          label: 'Shinkansen Bullet Train',
          duration: '45m',
          distance: '55 km',
          departureTime: '02:30 PM'
        },
        highlights: ['Fushimi Inari', 'Arashiyama Bamboo', 'Gion District']
      },
      {
        id: 'stop-3',
        cityId: 'osaka',
        cityName: 'Osaka',
        code: 'OSA',
        nights: 4,
        dateRange: 'Mar 20 – Mar 24',
        transportToNext: null,
        highlights: ['Dotonbori', 'Osaka Castle', 'Shinsekai']
      }
    ],

    itinerary: {
      1: {
        dayNumber: 1,
        date: 'MAR 12',
        city: 'TOKYO',
        weather: { temp: '16°C', condition: 'Sunny', icon: '☀️' },
        morning: [
          {
            id: 'act-1-1',
            title: 'TOKYO TOWER',
            category: 'Sightseeing',
            time: '09:00 AM',
            duration: '2 Hours',
            cost: 800,
            icon: '🗼',
            location: 'Minato City, Tokyo',
            description: 'Visit the main observation deck for expansive morning views over Tokyo skyline.'
          }
        ],
        afternoon: [
          {
            id: 'act-1-2',
            title: 'TSUKIJI FOOD TOUR',
            category: 'Food',
            time: '01:00 PM',
            duration: '3 Hours',
            cost: 1500,
            icon: '🍜',
            location: 'Chuo City, Tokyo',
            description: 'Fresh sushi, tamagoyaki tasting, and matcha ice cream through bustling market stalls.'
          }
        ],
        evening: [
          {
            id: 'act-1-3',
            title: 'SHIBUYA NIGHT WALK',
            category: 'Culture',
            time: '07:00 PM',
            duration: '2 Hours',
            cost: 600,
            icon: '🌆',
            location: 'Shibuya Crossing, Tokyo',
            description: 'Walk across the world famous crossing and explore cozy neon alleyways.'
          }
        ],
        dayTotalHours: 7,
        dayTotalCost: 2900
      },
      2: {
        dayNumber: 2,
        date: 'MAR 13',
        city: 'TOKYO',
        weather: { temp: '18°C', condition: 'Clear', icon: '🌤️' },
        morning: [
          {
            id: 'act-2-1',
            title: 'SENSŌ-JI TEMPLE',
            category: 'Culture',
            time: '09:30 AM',
            duration: '2.5 Hours',
            cost: 1200,
            icon: '⛩',
            location: 'Asakusa, Tokyo',
            description: 'Ancient Buddhist temple, five-story pagoda and traditional shopping street.'
          }
        ],
        afternoon: [
          {
            id: 'act-2-2',
            title: 'AKIHABARA TECH & ARCADE',
            category: 'Adventure',
            time: '02:00 PM',
            duration: '3 Hours',
            cost: 950,
            icon: '👾',
            location: 'Akihabara, Tokyo',
            description: 'Explore multi-level retro gaming, anime figurines, and electronics.'
          }
        ],
        evening: [
          {
            id: 'act-2-3',
            title: 'SHINJUKU OMOIDE YOKOCHO',
            category: 'Food',
            time: '07:30 PM',
            duration: '2.5 Hours',
            cost: 1800,
            icon: '🍢',
            location: 'Shinjuku, Tokyo',
            description: 'Intimate yakitori skewers and draft beer in nostalgic lantern-lit alley.'
          }
        ],
        dayTotalHours: 8,
        dayTotalCost: 3950
      },
      3: {
        dayNumber: 3,
        date: 'MAR 14',
        city: 'TOKYO',
        weather: { temp: '15°C', condition: 'Showers expected', icon: '🌧️' },
        morning: [
          {
            id: 'act-3-1',
            title: 'SHINJUKU GYOEN GARDEN',
            category: 'Nature',
            time: '09:00 AM',
            duration: '2 Hours',
            cost: 500,
            icon: '🌿',
            location: 'Shinjuku, Tokyo',
            description: 'Peaceful stroll across landscaped lakes, greenhouses, and bonsai trees.'
          }
        ],
        afternoon: [
          {
            id: 'act-3-2',
            title: 'MORI ART MUSEUM & ROPPONGI',
            category: 'Culture',
            time: '02:00 PM',
            duration: '3 Hours',
            cost: 1600,
            icon: '🏛️',
            location: 'Roppongi Hills, Tokyo',
            description: 'Contemporary modern art exhibitions with high-rise observation deck.'
          }
        ],
        evening: [
          {
            id: 'act-3-3',
            title: 'GINZA ARCHITECTURE & DINING',
            category: 'Sightseeing',
            time: '06:30 PM',
            duration: '2.5 Hours',
            cost: 2200,
            icon: '✨',
            location: 'Ginza, Tokyo',
            description: 'Luxury architecture promenade and authentic ramen dinner.'
          }
        ],
        dayTotalHours: 7.5,
        dayTotalCost: 4300
      }
    },

    budgetBreakdown: [
      { category: 'Stay', icon: '🏨', percentage: 40, planned: 72000, spent: 52000, color: 'bg-zinc-900' },
      { category: 'Transport', icon: '🚆', percentage: 25, planned: 45000, spent: 33000, color: 'bg-zinc-700' },
      { category: 'Activities', icon: '🎟', percentage: 20, planned: 36000, spent: 21000, color: 'bg-zinc-500' },
      { category: 'Meals', icon: '🍜', percentage: 15, planned: 27000, spent: 14000, color: 'bg-zinc-400' }
    ],

    smartInsights: [
      {
        id: 'ins-1',
        title: 'Save ₹4,500 with 3 small changes',
        description: 'Swapping express taxi for regional bullet train pass on Day 5 and booking Tokyo Tower tickets in advance.',
        potentialSaving: 4500,
        type: 'savings'
      },
      {
        id: 'ins-2',
        title: 'Kyoto Hotel Price Alert',
        description: 'Your selected hotel in Gion has 12% lower rates if booked before Feb 28.',
        potentialSaving: 3200,
        type: 'alert'
      }
    ],

    crew: [
      { id: 'usr-1', name: 'Nakul (You)', role: 'Owner', avatar: '👨‍💻', email: 'nakul@globetrotter.io', status: 'online' },
      { id: 'usr-2', name: 'Sarah Chen', role: 'Editor', avatar: '👩‍🎨', email: 'sarah.c@globetrotter.io', status: 'online' },
      { id: 'usr-3', name: 'Alex Rivera', role: 'Editor', avatar: '🧗', email: 'alex.r@globetrotter.io', status: 'idle' },
      { id: 'usr-4', name: 'Maya Patel', role: 'Viewer', avatar: '📸', email: 'maya.p@globetrotter.io', status: 'offline' }
    ],

    groupVotes: [
      {
        id: 'vote-1',
        activityName: 'TOKYO STREET FOOD TOUR',
        category: 'Food Experience',
        location: 'Tsukiji & Shinjuku',
        upvotes: 7,
        downvotes: 2,
        isPopular: true,
        userVoted: 'up',
        commentsCount: 5,
        status: 'Accepted'
      },
      {
        id: 'vote-2',
        activityName: 'KYOTO SUNSET HELICOPTER FLIGHT',
        category: 'Adventure',
        location: 'Kyoto Sky Area',
        upvotes: 2,
        downvotes: 6,
        isPopular: false,
        userVoted: 'down',
        commentsCount: 8,
        status: 'Rejected'
      },
      {
        id: 'vote-3',
        activityName: 'ARASHIYAMA BAMBOO MORNING HIKE',
        category: 'Nature',
        location: 'Arashiyama, Kyoto',
        upvotes: 6,
        downvotes: 1,
        isPopular: true,
        userVoted: null,
        commentsCount: 3,
        status: 'Pending'
      }
    ],

    activityFeed: [
      { id: 'feed-1', user: 'Sarah Chen', action: 'suggested', target: 'Sunset Cruise in Tokyo Bay', time: '10m ago' },
      { id: 'feed-2', user: 'Alex Rivera', action: 'added', target: 'Kyoto Food Tour to Day 4', time: '42m ago' },
      { id: 'feed-3', user: 'Maya Patel', action: 'voted for', target: 'Shibuya Night Walk', time: '2h ago' },
      { id: 'feed-4', user: 'Nakul (You)', action: 'optimized', target: 'Route from Tokyo to Osaka', time: '5h ago' }
    ]
  },
  {
    id: 'european-summer',
    title: 'European Summer',
    destination: 'Europe',
    countryCode: 'EU',
    flag: '🇪🇺',
    startDate: '2026-06-10',
    endDate: '2026-06-24',
    dateRange: 'JUN 10 – JUN 24, 2026',
    durationDays: 14,
    totalBudget: 320000,
    spentBudget: 215000,
    status: 'Planning',
    currency: '₹',
    coverImage: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=1200&q=80',
    description: 'A classic grand European voyage through Parisian boulevards, Swiss alpine passes, and historic Italian piazzas.',
    travelStyle: 'Relaxed',
    budgetTier: 'Premium',
    interests: ['Culture', 'Food', 'Sightseeing', 'Nature'],
    stops: [
      { id: 'e-stop-1', cityId: 'paris', cityName: 'Paris', code: 'CDG', nights: 5, dateRange: 'Jun 10 – Jun 15', transportToNext: { mode: 'train', icon: '🚅', label: 'TGV Lyria', duration: '3h 10m', distance: '490 km' } },
      { id: 'e-stop-2', cityId: 'rome', cityName: 'Rome', code: 'FCO', nights: 5, dateRange: 'Jun 15 – Jun 20', transportToNext: { mode: 'train', icon: '🚅', label: 'Frecciarossa', duration: '1h 30m', distance: '270 km' } },
      { id: 'e-stop-3', cityId: 'florence', cityName: 'Florence', code: 'FLR', nights: 4, dateRange: 'Jun 20 – Jun 24', transportToNext: null }
    ]
  },
  {
    id: 'kerala-escape',
    title: 'Kerala Escape',
    destination: 'India',
    countryCode: 'IN',
    flag: '🇮🇳',
    startDate: '2026-10-05',
    endDate: '2026-10-12',
    dateRange: 'OCT 05 – OCT 12, 2026',
    durationDays: 7,
    totalBudget: 65000,
    spentBudget: 42000,
    status: 'Completed',
    currency: '₹',
    coverImage: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=1200&q=80',
    description: 'Serene coastal lagoons, spice plantations in misty Munnar hills, and overnight luxury houseboat in Alleppey.',
    travelStyle: 'Relaxed',
    budgetTier: 'Budget',
    interests: ['Nature', 'Food', 'Culture'],
    stops: [
      { id: 'k-stop-1', cityId: 'kochi', cityName: 'Kochi', code: 'COK', nights: 2, dateRange: 'Oct 05 – Oct 07', transportToNext: { mode: 'car', icon: '🚗', label: 'Scenic Drive', duration: '3h 45m', distance: '130 km' } },
      { id: 'k-stop-2', cityId: 'munnar', cityName: 'Munnar', code: 'MNR', nights: 3, dateRange: 'Oct 07 – Oct 10', transportToNext: { mode: 'car', icon: '🚗', label: 'Hill Highway', duration: '4h 00m', distance: '160 km' } },
      { id: 'k-stop-3', cityId: 'alleppey', cityName: 'Alleppey', code: 'ALP', nights: 2, dateRange: 'Oct 10 – Oct 12', transportToNext: null }
    ]
  }
];
