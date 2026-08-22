import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  formatCurrency,
  formatDistance,
  formatTemperature,
  formatDate,
  formatTime,
  convertDistance,
  convertTemperature,
  convertCurrency
} from '../utils/regionalFormatters';

const STORAGE_KEY = 'globetrotter_regional_preferences';

const DEFAULT_PREFERENCES = {
  distanceUnit: 'km',            // 'km' | 'mi'
  temperatureUnit: 'celsius',    // 'celsius' | 'fahrenheit'
  currency: 'INR',               // 'INR' | 'USD' | 'EUR' | 'GBP' | 'JPY' | 'local'
  dateFormat: 'DD/MM/YYYY',      // 'DD/MM/YYYY' | 'MM/DD/YYYY' | 'YYYY-MM-DD'
  timeFormat: '12h'              // '12h' | '24h'
};

const PreferencesContext = createContext(null);

export const PreferencesProvider = ({ children }) => {
  const [preferences, setPreferences] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        return { ...DEFAULT_PREFERENCES, ...JSON.parse(stored) };
      }
    } catch (e) {
      console.warn('Could not load preferences from localStorage:', e);
    }
    return DEFAULT_PREFERENCES;
  });

  // Save to localStorage whenever preferences change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(preferences));
    } catch (e) {
      console.warn('Could not persist preferences:', e);
    }
  }, [preferences]);

  const updatePreferences = (newPrefs) => {
    setPreferences((prev) => ({
      ...prev,
      ...newPrefs
    }));
  };

  // Convenient helper functions bound to the current preferences
  const fmtCurrency = (inrAmount, destinationCountry = '', options = {}) =>
    formatCurrency(inrAmount, preferences.currency, destinationCountry, options);

  const fmtDistance = (km, precision = 1) =>
    formatDistance(km, preferences.distanceUnit, precision);

  const fmtTemperature = (celsius) =>
    formatTemperature(celsius, preferences.temperatureUnit);

  const fmtDate = (dateInput) =>
    formatDate(dateInput, preferences.dateFormat);

  const fmtTime = (timeInput) =>
    formatTime(timeInput, preferences.timeFormat);

  return (
    <PreferencesContext.Provider
      value={{
        preferences,
        updatePreferences,
        fmtCurrency,
        fmtDistance,
        fmtTemperature,
        fmtDate,
        fmtTime,
        convertDistance: (km) => convertDistance(km, preferences.distanceUnit),
        convertTemperature: (c) => convertTemperature(c, preferences.temperatureUnit),
        convertCurrency: (amt, country) => convertCurrency(amt, preferences.currency, country)
      }}
    >
      {children}
    </PreferencesContext.Provider>
  );
};

export const usePreferences = () => {
  const context = useContext(PreferencesContext);
  if (!context) {
    throw new Error('usePreferences must be used within PreferencesProvider');
  }
  return context;
};
