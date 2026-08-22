export const CITIES_DATA = [
  // Japan
  {
    id: 'tokyo',
    name: 'Tokyo',
    country: 'Japan',
    countryCode: 'JP',
    code: 'NRT',
    tagline: 'Neon metropolis meets ancient traditions'
  },
  {
    id: 'kyoto',
    name: 'Kyoto',
    country: 'Japan',
    countryCode: 'JP',
    code: 'KYO',
    tagline: 'Historic heart of traditional Japan & shrines'
  },
  {
    id: 'osaka',
    name: 'Osaka',
    country: 'Japan',
    countryCode: 'JP',
    code: 'OSA',
    tagline: 'Street food capital and vibrant canal districts'
  },

  // France
  {
    id: 'paris',
    name: 'Paris',
    country: 'France',
    countryCode: 'FR',
    code: 'CDG',
    tagline: 'City of light, world-class art and gastronomy'
  },
  {
    id: 'nice',
    name: 'Nice',
    country: 'France',
    countryCode: 'FR',
    code: 'NCE',
    tagline: 'Azure coastlines and Mediterranean elegance'
  },
  {
    id: 'lyon',
    name: 'Lyon',
    country: 'France',
    countryCode: 'FR',
    code: 'LYS',
    tagline: 'Culinary capital and Renaissance passageways'
  },

  // Italy
  {
    id: 'rome',
    name: 'Rome',
    country: 'Italy',
    countryCode: 'IT',
    code: 'FCO',
    tagline: 'Eternal city of ancient ruins and espresso'
  },
  {
    id: 'venice',
    name: 'Venice',
    country: 'Italy',
    countryCode: 'IT',
    code: 'VCE',
    tagline: 'Romantic labyrinth of floating canals & gondolas'
  },
  {
    id: 'florence',
    name: 'Florence',
    country: 'Italy',
    countryCode: 'IT',
    code: 'FLR',
    tagline: 'Cradle of Renaissance masterworks and Tuscan vistas'
  },

  // United Kingdom
  {
    id: 'london',
    name: 'London',
    country: 'United Kingdom',
    countryCode: 'GB',
    code: 'LHR',
    tagline: 'Historic landmark monuments and dynamic theater'
  },
  {
    id: 'edinburgh',
    name: 'Edinburgh',
    country: 'United Kingdom',
    countryCode: 'GB',
    code: 'EDI',
    tagline: 'Dramatic hilltop castle and gothic medieval closes'
  },

  // Spain
  {
    id: 'barcelona',
    name: 'Barcelona',
    country: 'Spain',
    countryCode: 'ES',
    code: 'BCN',
    tagline: 'Gaudí architecture, tapas bars and Mediterranean beaches'
  },
  {
    id: 'madrid',
    name: 'Madrid',
    country: 'Spain',
    countryCode: 'ES',
    code: 'MAD',
    tagline: 'Grand royal palaces, art avenues and lively plazas'
  },
  {
    id: 'seville',
    name: 'Seville',
    country: 'Spain',
    countryCode: 'ES',
    code: 'SVQ',
    tagline: 'Flamenco rhythms and sun-drenched Moorish alcazars'
  },

  // Thailand
  {
    id: 'bangkok',
    name: 'Bangkok',
    country: 'Thailand',
    countryCode: 'TH',
    code: 'BKK',
    tagline: 'Glittering temples and legendary street markets'
  },
  {
    id: 'phuket',
    name: 'Phuket',
    country: 'Thailand',
    countryCode: 'TH',
    code: 'HKT',
    tagline: 'Tropical limestone islands and turquoise bays'
  },
  {
    id: 'chiang-mai',
    name: 'Chiang Mai',
    country: 'Thailand',
    countryCode: 'TH',
    code: 'CNX',
    tagline: 'Misty mountain sanctuaries and artisan night bazaars'
  },

  // Singapore
  {
    id: 'singapore',
    name: 'Singapore',
    country: 'Singapore',
    countryCode: 'SG',
    code: 'SIN',
    tagline: 'Futuristic garden city and culinary melting pot'
  },

  // United Arab Emirates
  {
    id: 'dubai',
    name: 'Dubai',
    country: 'United Arab Emirates',
    countryCode: 'AE',
    code: 'DXB',
    tagline: 'Hypermodern skyscrapers, desert safaris and luxury'
  },
  {
    id: 'abu-dhabi',
    name: 'Abu Dhabi',
    country: 'United Arab Emirates',
    countryCode: 'AE',
    code: 'AUH',
    tagline: 'Grand mosques, island oases and cultural museums'
  },

  // Australia
  {
    id: 'sydney',
    name: 'Sydney',
    country: 'Australia',
    countryCode: 'AU',
    code: 'SYD',
    tagline: 'Iconic harbor opera, coastal cliff walks and surfing'
  },
  {
    id: 'melbourne',
    name: 'Melbourne',
    country: 'Australia',
    countryCode: 'AU',
    code: 'MEL',
    tagline: 'Laneway espresso culture, street murals and arts'
  },

  // India
  {
    id: 'chennai',
    name: 'Chennai',
    country: 'India',
    countryCode: 'IN',
    code: 'MAA',
    tagline: 'Cultural gateway of classical Dravidian arts and coastal breeze'
  },
  {
    id: 'delhi',
    name: 'Delhi',
    country: 'India',
    countryCode: 'IN',
    code: 'DEL',
    tagline: 'Monumental Mughal heritage and spicy street lanes'
  },
  {
    id: 'mumbai',
    name: 'Mumbai',
    country: 'India',
    countryCode: 'IN',
    code: 'BOM',
    tagline: 'City of dreams, Marine Drive promenade and Art Deco'
  },
  {
    id: 'jaipur',
    name: 'Jaipur',
    country: 'India',
    countryCode: 'IN',
    code: 'JAI',
    tagline: 'Pink City royal forts, palaces and block-print bazaars'
  },
  {
    id: 'kochi',
    name: 'Kochi',
    country: 'India',
    countryCode: 'IN',
    code: 'COK',
    tagline: 'Historic spice harbor and tranquil coastal backwaters'
  }
];

export const COUNTRIES_DATA = Array.from(
  new Set(CITIES_DATA.map((c) => c.country))
).sort();
