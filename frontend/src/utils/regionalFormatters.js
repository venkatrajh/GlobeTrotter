// Centralized Regional Conversion & Formatting Utilities

export const EXCHANGE_RATES = {
  INR: 1,
  USD: 0.012,    // 1 INR = $0.012 (e.g. ₹180,000 = $2,160)
  EUR: 0.011,    // 1 INR = €0.011 (e.g. ₹180,000 = €1,980)
  GBP: 0.0094,   // 1 INR = £0.0094 (e.g. ₹180,000 = £1,692)
  JPY: 1.82      // 1 INR = ¥1.82 (e.g. ₹180,000 = ¥327,600)
};

export const CURRENCY_SYMBOLS = {
  INR: '₹',
  USD: '$',
  EUR: '€',
  GBP: '£',
  JPY: '¥'
};

export const LOCAL_CURRENCIES_BY_COUNTRY = {
  Japan: 'JPY',
  France: 'EUR',
  Italy: 'EUR',
  Spain: 'EUR',
  'United Kingdom': 'GBP',
  Thailand: 'USD',
  Singapore: 'USD',
  'United Arab Emirates': 'USD',
  Australia: 'USD',
  India: 'INR'
};

/**
 * Convert numeric distance in KM to target unit (km or mi)
 */
export const convertDistance = (km, unit = 'km') => {
  if (km == null || isNaN(Number(km))) return 0;
  const numKm = Number(km);
  if (unit === 'mi' || unit === 'miles') {
    return numKm * 0.621371;
  }
  return numKm;
};

/**
 * Format distance value with appropriate unit label
 */
export const formatDistance = (km, unit = 'km', precision = 1) => {
  const converted = convertDistance(km, unit);
  const formatted = precision === 0 ? Math.round(converted) : Number(converted.toFixed(precision));
  const label = unit === 'mi' || unit === 'miles' ? 'mi' : 'km';
  return `${formatted.toLocaleString()} ${label}`;
};

/**
 * Convert Celsius temperature to target unit (celsius or fahrenheit)
 */
export const convertTemperature = (celsius, unit = 'celsius') => {
  if (celsius == null || isNaN(Number(celsius))) return 0;
  const numC = Number(celsius);
  if (unit === 'fahrenheit' || unit === 'f') {
    return (numC * 9) / 5 + 32;
  }
  return numC;
};

/**
 * Format temperature with unit label
 */
export const formatTemperature = (celsius, unit = 'celsius') => {
  const converted = convertTemperature(celsius, unit);
  const formatted = Math.round(converted);
  const label = unit === 'fahrenheit' || unit === 'f' ? '°F' : '°C';
  return `${formatted}${label}`;
};

/**
 * Convert INR amount to target currency
 */
export const convertCurrency = (inrAmount, targetCurrency = 'INR', destinationCountry = '') => {
  if (inrAmount == null || isNaN(Number(inrAmount))) return 0;
  const amount = Number(inrAmount);

  let activeCurrency = targetCurrency;
  if (activeCurrency === 'local' || activeCurrency === 'Local currency') {
    activeCurrency = LOCAL_CURRENCIES_BY_COUNTRY[destinationCountry] || 'INR';
  }

  const rate = EXCHANGE_RATES[activeCurrency] || 1;
  return amount * rate;
};

/**
 * Format currency with correct symbol and localized number formatting
 */
export const formatCurrency = (
  inrAmount,
  currency = 'INR',
  destinationCountry = '',
  options = {}
) => {
  if (inrAmount == null || isNaN(Number(inrAmount))) return '0';
  const { compact = false } = options;

  let activeCurrency = currency;
  if (activeCurrency === 'local' || activeCurrency === 'Local currency') {
    activeCurrency = LOCAL_CURRENCIES_BY_COUNTRY[destinationCountry] || 'INR';
  }

  const converted = convertCurrency(inrAmount, activeCurrency, destinationCountry);
  const symbol = CURRENCY_SYMBOLS[activeCurrency] || '₹';

  if (compact && converted >= 100000 && activeCurrency === 'INR') {
    return `${symbol}${(converted / 100000).toFixed(1)}L`;
  }
  if (compact && converted >= 1000) {
    return `${symbol}${(converted / 1000).toFixed(0)}k`;
  }

  const formattedNum = Math.round(converted).toLocaleString();
  return `${symbol}${formattedNum}`;
};

/**
 * Format date string or object to DD/MM/YYYY, MM/DD/YYYY, or YYYY-MM-DD
 */
export const formatDate = (dateInput, dateFormat = 'DD/MM/YYYY') => {
  if (!dateInput) return '';

  let dateObj;
  if (dateInput instanceof Date) {
    dateObj = dateInput;
  } else if (typeof dateInput === 'string') {
    // If it's already in format like '2026-03-12'
    const parts = dateInput.match(/^(\d{4})-(\d{2})-(\d{2})/);
    if (parts) {
      const year = parts[1];
      const month = parts[2];
      const day = parts[3];

      if (dateFormat === 'MM/DD/YYYY') return `${month}/${day}/${year}`;
      if (dateFormat === 'YYYY-MM-DD') return `${year}-${month}-${day}`;
      return `${day}/${month}/${year}`; // Default DD/MM/YYYY
    }

    // Try normal Date parse
    dateObj = new Date(dateInput);
  }

  if (!dateObj || isNaN(dateObj.getTime())) {
    return String(dateInput);
  }

  const day = String(dateObj.getDate()).padStart(2, '0');
  const month = String(dateObj.getMonth() + 1).padStart(2, '0');
  const year = dateObj.getFullYear();

  if (dateFormat === 'MM/DD/YYYY') return `${month}/${day}/${year}`;
  if (dateFormat === 'YYYY-MM-DD') return `${year}-${month}-${day}`;
  return `${day}/${month}/${year}`;
};

/**
 * Format time string (e.g. '09:00 AM', '14:30', '2:00 PM') to 12h or 24h
 */
export const formatTime = (timeInput, timeFormat = '12h') => {
  if (!timeInput) return '';
  const str = String(timeInput).trim();

  // Parse hours and minutes
  let hours = 0;
  let minutes = 0;

  const match12 = str.match(/(\d{1,2}):(\d{2})\s*(AM|PM)?/i);
  if (match12) {
    hours = parseInt(match12[1], 10);
    minutes = parseInt(match12[2], 10);
    const meridiem = match12[3] ? match12[3].toUpperCase() : null;

    if (meridiem === 'PM' && hours < 12) hours += 12;
    if (meridiem === 'AM' && hours === 12) hours = 0;
  } else {
    return str;
  }

  const is24h = timeFormat === '24h' || timeFormat === '24-hour';

  if (is24h) {
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
  } else {
    const period = hours >= 12 ? 'PM' : 'AM';
    const displayHours = hours % 12 || 12;
    return `${displayHours}:${String(minutes).padStart(2, '0')} ${period}`;
  }
};
