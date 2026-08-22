import React, { useState, useEffect } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { useTrips } from '../../context/TripContext';
import { usePreferences } from '../../context/PreferencesContext';
import { Button } from '../../components/common/Button';
import { Select } from '../../components/common/Select';
import { Sun, Moon, Monitor, Bell, Globe, Check, Sparkles, Plane, Users, Lock } from 'lucide-react';
import { clsx } from 'clsx';

export const SettingsPage = () => {
  const { theme, toggleTheme } = useTheme();
  const { showNotification } = useTrips();
  const { preferences, updatePreferences } = usePreferences();

  // Local state initialized from global preferences
  const [distanceUnit, setDistanceUnit] = useState(preferences.distanceUnit || 'km');
  const [tempUnit, setTempUnit] = useState(preferences.temperatureUnit || 'celsius');
  const [currencyDisplay, setCurrencyDisplay] = useState(preferences.currency || 'INR');
  const [dateFormat, setDateFormat] = useState(preferences.dateFormat || 'DD/MM/YYYY');
  const [timeFormat, setTimeFormat] = useState(preferences.timeFormat || '12h');

  // Synchronize if global preferences change externally
  useEffect(() => {
    setDistanceUnit(preferences.distanceUnit || 'km');
    setTempUnit(preferences.temperatureUnit || 'celsius');
    setCurrencyDisplay(preferences.currency || 'INR');
    setDateFormat(preferences.dateFormat || 'DD/MM/YYYY');
    setTimeFormat(preferences.timeFormat || '12h');
  }, [preferences]);

  // Grouped Notifications State
  const [notifications, setNotifications] = useState({
    tripReminders: true,
    departureReminders: true,
    itineraryChanges: true,
    activityReminders: true,
    travelTimeReminders: true,
    bookingStatusUpdates: true,
    aiTripSuggestions: true,
    budgetAlerts: true,
    routeOptimizationSuggestions: true,
    weatherAlerts: true,
    autoReplannerRecommendations: true,
    newComments: true,
    newVotes: true,
    tripMemberChanges: true,
    activitySuggestions: true,
    mentionNotifications: true,
    accountSecurityAlerts: true,
    productUpdates: false,
    inAppNotifications: true,
    emailNotifications: true
  });

  const toggleNotification = (key) => {
    setNotifications((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSaveRegionalUnits = (e) => {
    e.preventDefault();
    updatePreferences({
      distanceUnit,
      temperatureUnit: tempUnit,
      currency: currencyDisplay,
      dateFormat,
      timeFormat
    });
    showNotification('✓ Regional preferences updated', 'success');
  };

  const handleSaveNotifications = () => {
    showNotification('Notification preferences updated!', 'success');
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-8 py-8 space-y-10 text-left">
      {/* Header */}
      <div>
        <span className="text-[11px] font-mono uppercase font-bold tracking-widest text-zinc-600 dark:text-zinc-400">
          PREFERENCES & CONFIGURATION
        </span>
        <h1 className="text-3xl sm:text-4xl font-black uppercase tracking-tight text-zinc-950 dark:text-zinc-50 mt-1">
          SETTINGS
        </h1>
        <p className="text-sm text-zinc-600 dark:text-zinc-400 font-medium mt-1">
          Manage your theme, regional units, and multi-tier notification streams across the entire app.
        </p>
      </div>

      {/* Theme Selection with Liquid Glass Tiers */}
      <div className="glass-secondary rounded-3xl p-6 sm:p-8 shadow-lg space-y-6 border">
        <div>
          <h3 className="text-lg font-bold tracking-tight text-zinc-950 dark:text-zinc-50">
            Interface Theme Environment
          </h3>
          <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-1">
            Choose between Daylight Liquid Glass, Midnight Space Glass, or System appearance.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* Light Theme Option */}
          <div
            onClick={() => toggleTheme('light')}
            className={clsx(
              'p-5 rounded-2xl border cursor-pointer transition-all flex flex-col justify-between gap-3 shadow-xs',
              theme === 'light'
                ? 'bg-white/90 dark:bg-zinc-800/90 border-zinc-950 dark:border-zinc-100 ring-2 ring-zinc-950 dark:ring-zinc-100'
                : 'glass-secondary hover:border-zinc-400'
            )}
          >
            <div className="flex items-center justify-between">
              <div className="w-8 h-8 rounded-xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center">
                <Sun className="w-4 h-4 text-zinc-900 dark:text-zinc-100" />
              </div>
              {theme === 'light' && <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">Active World</span>}
            </div>
            <div>
              <h4 className="text-sm font-bold text-zinc-950 dark:text-zinc-50">Daylight Liquid Glass</h4>
              <p className="text-[11px] text-zinc-600 dark:text-zinc-400 mt-0.5">Bright frosted architectural world & ambient globes</p>
            </div>
          </div>

          {/* Dark Theme Option */}
          <div
            onClick={() => toggleTheme('dark')}
            className={clsx(
              'p-5 rounded-2xl border cursor-pointer transition-all flex flex-col justify-between gap-3 shadow-xs',
              theme === 'dark'
                ? 'bg-white/90 dark:bg-zinc-800/90 border-zinc-950 dark:border-zinc-100 ring-2 ring-zinc-950 dark:ring-zinc-100'
                : 'glass-secondary hover:border-zinc-400'
            )}
          >
            <div className="flex items-center justify-between">
              <div className="w-8 h-8 rounded-xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center">
                <Moon className="w-4 h-4 text-zinc-900 dark:text-zinc-100" />
              </div>
              {theme === 'dark' && <span className="text-xs font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950 px-2 py-0.5 rounded-md">Active World</span>}
            </div>
            <div>
              <h4 className="text-sm font-bold text-zinc-950 dark:text-zinc-50">Midnight Space Glass</h4>
              <p className="text-[11px] text-zinc-600 dark:text-zinc-400 mt-0.5">Deep obsidian glass & luminous planetary trajectories</p>
            </div>
          </div>

          {/* System Theme Option */}
          <div
            onClick={() => toggleTheme('system')}
            className={clsx(
              'p-5 rounded-2xl border cursor-pointer transition-all flex flex-col justify-between gap-3 shadow-xs',
              theme === 'system'
                ? 'bg-white/90 dark:bg-zinc-800/90 border-zinc-950 dark:border-zinc-100 ring-2 ring-zinc-950 dark:ring-zinc-100'
                : 'glass-secondary hover:border-zinc-400'
            )}
          >
            <div className="flex items-center justify-between">
              <div className="w-8 h-8 rounded-xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center">
                <Monitor className="w-4 h-4 text-zinc-900 dark:text-zinc-100" />
              </div>
              {theme === 'system' && <span className="text-xs font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950 px-2 py-0.5 rounded-md">Active World</span>}
            </div>
            <div>
              <h4 className="text-sm font-bold text-zinc-950 dark:text-zinc-50">System</h4>
              <p className="text-[11px] text-zinc-600 dark:text-zinc-400 mt-0.5">Match your device's appearance automatically</p>
            </div>
          </div>
        </div>
      </div>

      {/* Editable Regional Units Section with Liquid Glass */}
      <div className="glass-secondary rounded-3xl p-6 sm:p-8 shadow-lg space-y-6 border">
        <div>
          <h3 className="text-lg font-bold tracking-tight text-zinc-950 dark:text-zinc-50 flex items-center gap-2">
            <Globe className="w-5 h-5" /> Regional Units & Currency
          </h3>
          <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-1">
            Updates distances, temperatures, currencies, dates, and times globally across all pages.
          </p>
        </div>

        <form onSubmit={handleSaveRegionalUnits} className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <Select
              label="Distance Unit"
              value={distanceUnit}
              onChange={(e) => setDistanceUnit(e.target.value)}
              options={[
                { value: 'km', label: 'Kilometers (km)' },
                { value: 'mi', label: 'Miles (mi)' }
              ]}
            />

            <Select
              label="Temperature Unit"
              value={tempUnit}
              onChange={(e) => setTempUnit(e.target.value)}
              options={[
                { value: 'celsius', label: 'Celsius (°C)' },
                { value: 'fahrenheit', label: 'Fahrenheit (°F)' }
              ]}
            />

            <Select
              label="Currency Display"
              value={currencyDisplay}
              onChange={(e) => setCurrencyDisplay(e.target.value)}
              options={[
                { value: 'INR', label: 'INR (₹) Indian Rupee' },
                { value: 'USD', label: 'USD ($) US Dollar' },
                { value: 'EUR', label: 'EUR (€) Euro' },
                { value: 'GBP', label: 'GBP (£) British Pound' },
                { value: 'JPY', label: 'JPY (¥) Japanese Yen' },
                { value: 'local', label: 'Local Destination Currency' }
              ]}
            />

            <Select
              label="Date Format"
              value={dateFormat}
              onChange={(e) => setDateFormat(e.target.value)}
              options={[
                { value: 'DD/MM/YYYY', label: 'DD/MM/YYYY (e.g. 12/03/2026)' },
                { value: 'MM/DD/YYYY', label: 'MM/DD/YYYY (e.g. 03/12/2026)' },
                { value: 'YYYY-MM-DD', label: 'YYYY-MM-DD (e.g. 2026-03-12)' }
              ]}
            />

            <Select
              label="Time Format"
              value={timeFormat}
              onChange={(e) => setTimeFormat(e.target.value)}
              options={[
                { value: '12h', label: '12-hour (e.g. 9:00 AM, 2:30 PM)' },
                { value: '24h', label: '24-hour (e.g. 09:00, 14:30)' }
              ]}
            />
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-zinc-200/50 dark:border-zinc-800/50">
            <span className="text-xs text-zinc-600 dark:text-zinc-400 font-medium">
              Active: {currencyDisplay} • {distanceUnit} • {tempUnit} • {dateFormat} • {timeFormat}
            </span>

            <Button type="submit" variant="primary" size="md" icon={Check} className="font-bold text-xs">
              Save Regional Preferences
            </Button>
          </div>
        </form>
      </div>

      {/* Expanded Grouped Notifications Section */}
      <div className="glass-secondary rounded-3xl p-6 sm:p-8 shadow-lg space-y-8 border">
        <div>
          <h3 className="text-lg font-bold tracking-tight text-zinc-950 dark:text-zinc-50 flex items-center gap-2">
            <Bell className="w-5 h-5" /> Notification Preferences
          </h3>
          <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-1">
            Choose which alerts you receive across trips, AI co-planning, and collaboration.
          </p>
        </div>

        {/* Group 1: Trip Updates */}
        <div className="space-y-3">
          <span className="text-xs font-mono uppercase font-bold tracking-wider text-zinc-600 dark:text-zinc-400 block flex items-center gap-2">
            <Plane className="w-3.5 h-3.5" /> TRIP UPDATES
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              { key: 'tripReminders', label: 'Trip Reminders', desc: 'Pre-trip checklists and preparation' },
              { key: 'departureReminders', label: 'Upcoming Departure Reminders', desc: 'Transit & flight departure alerts' },
              { key: 'itineraryChanges', label: 'Itinerary Changes', desc: 'Schedule and timing modifications' },
              { key: 'activityReminders', label: 'Activity Reminders', desc: 'Upcoming scheduled activity notifications' },
              { key: 'travelTimeReminders', label: 'Travel Time Reminders', desc: 'Transit warnings before next stop' },
              { key: 'bookingStatusUpdates', label: 'Booking & Status Updates', desc: 'Confirmation and ticket notifications' }
            ].map((item) => (
              <div
                key={item.key}
                onClick={() => toggleNotification(item.key)}
                className="p-3.5 rounded-2xl glass-secondary border flex items-center justify-between cursor-pointer hover:border-zinc-400 transition-colors"
              >
                <div>
                  <h5 className="text-xs font-bold text-zinc-900 dark:text-zinc-100">{item.label}</h5>
                  <p className="text-[10px] text-zinc-600 dark:text-zinc-400 mt-0.5">{item.desc}</p>
                </div>
                <input
                  type="checkbox"
                  checked={notifications[item.key]}
                  onChange={() => {}}
                  className="w-4 h-4 rounded text-zinc-950 focus:ring-0 cursor-pointer"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Group 2: AI & Smart Planning */}
        <div className="space-y-3">
          <span className="text-xs font-mono uppercase font-bold tracking-wider text-zinc-600 dark:text-zinc-400 block flex items-center gap-2">
            <Sparkles className="w-3.5 h-3.5" /> AI & SMART PLANNING
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              { key: 'aiTripSuggestions', label: 'AI Trip Suggestions', desc: 'Personalized spot recommendations' },
              { key: 'budgetAlerts', label: 'Budget Alerts', desc: 'Money-saving insight notifications' },
              { key: 'routeOptimizationSuggestions', label: 'Route Optimization', desc: 'Faster connection alerts' },
              { key: 'weatherAlerts', label: 'Weather & Disruption Alerts', desc: 'Live precipitation & delay warnings' },
              { key: 'autoReplannerRecommendations', label: 'Auto-Replanner Recommendations', desc: 'Reassuring weather/schedule replans' }
            ].map((item) => (
              <div
                key={item.key}
                onClick={() => toggleNotification(item.key)}
                className="p-3.5 rounded-2xl glass-secondary border flex items-center justify-between cursor-pointer hover:border-zinc-400 transition-colors"
              >
                <div>
                  <h5 className="text-xs font-bold text-zinc-900 dark:text-zinc-100">{item.label}</h5>
                  <p className="text-[10px] text-zinc-600 dark:text-zinc-400 mt-0.5">{item.desc}</p>
                </div>
                <input
                  type="checkbox"
                  checked={notifications[item.key]}
                  onChange={() => {}}
                  className="w-4 h-4 rounded text-zinc-950 focus:ring-0 cursor-pointer"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Group 3: Collaboration */}
        <div className="space-y-3">
          <span className="text-xs font-mono uppercase font-bold tracking-wider text-zinc-600 dark:text-zinc-400 block flex items-center gap-2">
            <Users className="w-3.5 h-3.5" /> COLLABORATION
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              { key: 'newComments', label: 'New Comments', desc: 'Activity and itinerary notes from crew' },
              { key: 'newVotes', label: 'New Votes', desc: 'Votes cast on group activity decisions' },
              { key: 'tripMemberChanges', label: 'Trip Member Changes', desc: 'Invitations and crew join alerts' },
              { key: 'activitySuggestions', label: 'Activity Suggestions', desc: 'Alternative spots proposed by members' },
              { key: 'mentionNotifications', label: 'Mention Notifications', desc: 'Direct @mentions in comments' }
            ].map((item) => (
              <div
                key={item.key}
                onClick={() => toggleNotification(item.key)}
                className="p-3.5 rounded-2xl glass-secondary border flex items-center justify-between cursor-pointer hover:border-zinc-400 transition-colors"
              >
                <div>
                  <h5 className="text-xs font-bold text-zinc-900 dark:text-zinc-100">{item.label}</h5>
                  <p className="text-[10px] text-zinc-600 dark:text-zinc-400 mt-0.5">{item.desc}</p>
                </div>
                <input
                  type="checkbox"
                  checked={notifications[item.key]}
                  onChange={() => {}}
                  className="w-4 h-4 rounded text-zinc-950 focus:ring-0 cursor-pointer"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Group 4: Account & Delivery Channels */}
        <div className="space-y-3">
          <span className="text-xs font-mono uppercase font-bold tracking-wider text-zinc-600 dark:text-zinc-400 block flex items-center gap-2">
            <Lock className="w-3.5 h-3.5" /> ACCOUNT & DELIVERY CHANNELS
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              { key: 'accountSecurityAlerts', label: 'Account & Security Alerts', desc: 'Login notifications & safety alerts' },
              { key: 'productUpdates', label: 'Product Updates', desc: 'New GlobeTrotter features and release notes' },
              { key: 'inAppNotifications', label: 'In-App Notifications', desc: 'Push toasts and floating notifications' },
              { key: 'emailNotifications', label: 'Email Digest & Alerts', desc: 'Send daily summary and urgent notices to inbox' }
            ].map((item) => (
              <div
                key={item.key}
                onClick={() => toggleNotification(item.key)}
                className="p-3.5 rounded-2xl glass-secondary border flex items-center justify-between cursor-pointer hover:border-zinc-400 transition-colors"
              >
                <div>
                  <h5 className="text-xs font-bold text-zinc-900 dark:text-zinc-100">{item.label}</h5>
                  <p className="text-[10px] text-zinc-600 dark:text-zinc-400 mt-0.5">{item.desc}</p>
                </div>
                <input
                  type="checkbox"
                  checked={notifications[item.key]}
                  onChange={() => {}}
                  className="w-4 h-4 rounded text-zinc-950 focus:ring-0 cursor-pointer"
                />
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-end pt-4 border-t border-zinc-200/50 dark:border-zinc-800/50">
          <Button
            type="button"
            variant="primary"
            size="sm"
            icon={Check}
            onClick={handleSaveNotifications}
            className="font-bold text-xs"
          >
            Save Notification Preferences
          </Button>
        </div>
      </div>
    </div>
  );
};
