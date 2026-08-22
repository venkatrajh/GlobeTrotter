import React, { useState, useMemo } from 'react';
import { ACTIVITIES_DATA, CATEGORIES_DATA } from '../../data/activitiesData';
import { CITIES_DATA, COUNTRIES_DATA } from '../../data/citiesData';
import { ActivityCard } from '../../components/activities/ActivityCard';
import { ActivityDetailModal } from '../../components/activities/ActivityDetailModal';
import { Input } from '../../components/common/Input';
import { Select } from '../../components/common/Select';
import { EmptyState } from '../../components/common/EmptyState';
import { Search } from 'lucide-react';

export const ActivitiesPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCountry, setSelectedCountry] = useState('All');
  const [selectedCity, setSelectedCity] = useState('All');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedActivity, setSelectedActivity] = useState(null);

  // Dynamically compute available cities based on selected country
  const availableCities = useMemo(() => {
    if (selectedCountry === 'All') {
      return CITIES_DATA;
    }
    return CITIES_DATA.filter((c) => c.country.toLowerCase() === selectedCountry.toLowerCase());
  }, [selectedCountry]);

  // Handle country change: reset city if not valid for new country
  const handleCountryChange = (newCountry) => {
    setSelectedCountry(newCountry);
    setSelectedCity('All');
  };

  // Filter activities
  const filteredActivities = useMemo(() => {
    return ACTIVITIES_DATA.filter((act) => {
      const matchesSearch =
        searchQuery === '' ||
        act.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        act.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        act.cityName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (act.countryName && act.countryName.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (act.tags && act.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase())));

      const matchesCountry =
        selectedCountry === 'All' ||
        (act.countryName && act.countryName.toLowerCase() === selectedCountry.toLowerCase());

      const matchesCity =
        selectedCity === 'All' ||
        act.cityName.toLowerCase() === selectedCity.toLowerCase() ||
        act.cityId === selectedCity.toLowerCase();

      const matchesCategory =
        selectedCategory === 'All' ||
        act.category.toLowerCase() === selectedCategory.toLowerCase();

      return matchesSearch && matchesCountry && matchesCity && matchesCategory;
    });
  }, [searchQuery, selectedCountry, selectedCity, selectedCategory]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-8 space-y-8 text-left relative z-10">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <span className="text-[11px] font-mono uppercase font-bold tracking-widest text-zinc-600 dark:text-zinc-400">
            GLOBAL EXPERIENCE CATALOG
          </span>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-zinc-950 dark:text-zinc-50 uppercase mt-1">
            DISCOVER ACTIVITIES
          </h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 font-medium mt-1">
            Explore curated sights, culinary walks, cultural monuments, and adventures across 10+ countries.
          </p>
        </div>
      </div>

      {/* Global Search & Dynamic Filter Bar with Liquid Glass */}
      <div className="glass-secondary rounded-3xl p-6 shadow-lg space-y-5 border">
        {/* Search input */}
        <Input
          icon={Search}
          placeholder="Search activities, landmarks, or culinary experiences..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="bg-white/70 dark:bg-zinc-800/70 text-sm font-medium"
        />

        {/* 3 Dropdown Selects: Country, Dynamic City, Category */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-1">
          {/* Country Select */}
          <Select
            label="Country"
            value={selectedCountry}
            onChange={(e) => handleCountryChange(e.target.value)}
            options={[
              { value: 'All', label: '🌍 All Countries' },
              ...COUNTRIES_DATA.map((c) => ({ value: c, label: c }))
            ]}
          />

          {/* Dynamic City Select */}
          <Select
            label="City"
            value={selectedCity}
            onChange={(e) => setSelectedCity(e.target.value)}
            options={[
              { value: 'All', label: selectedCountry === 'All' ? '📍 All Cities' : `📍 All in ${selectedCountry}` },
              ...availableCities.map((c) => ({ value: c.name, label: `${c.name} (${c.country})` }))
            ]}
          />

          {/* Category Select */}
          <Select
            label="Category"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            options={CATEGORIES_DATA.map((cat) => ({
              value: cat,
              label: cat === 'All' ? '✨ All Categories' : cat
            }))}
          />
        </div>

        {/* Active Filters Summary */}
        <div className="flex items-center justify-between text-xs text-zinc-600 dark:text-zinc-400 pt-2 border-t border-zinc-200/50 dark:border-zinc-800/50 font-medium">
          <span>
            Showing <strong className="text-zinc-950 dark:text-zinc-50">{filteredActivities.length}</strong> experiences
            {selectedCountry !== 'All' && ` in ${selectedCountry}`}
            {selectedCity !== 'All' && ` (${selectedCity})`}
          </span>

          {(selectedCountry !== 'All' || selectedCity !== 'All' || selectedCategory !== 'All' || searchQuery) && (
            <button
              type="button"
              onClick={() => {
                setSelectedCountry('All');
                setSelectedCity('All');
                setSelectedCategory('All');
                setSearchQuery('');
              }}
              className="text-zinc-950 dark:text-zinc-50 font-bold hover:underline"
            >
              Reset Filters
            </button>
          )}
        </div>
      </div>

      {/* Exactly 3 Activity Cards per row on large desktop screens */}
      {filteredActivities.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredActivities.map((activity) => (
            <ActivityCard
              key={activity.id}
              activity={activity}
              onViewDetails={(act) => setSelectedActivity(act)}
            />
          ))}
        </div>
      ) : (
        <EmptyState
          title="No activities matched your search"
          description="Try broadening your country or category filters to discover global experiences."
          actionLabel="Clear Filters"
          onAction={() => {
            setSelectedCountry('All');
            setSelectedCity('All');
            setSelectedCategory('All');
            setSearchQuery('');
          }}
        />
      )}

      {/* Activity Detail Flashcard Modal */}
      <ActivityDetailModal
        activity={selectedActivity}
        isOpen={Boolean(selectedActivity)}
        onClose={() => setSelectedActivity(null)}
      />
    </div>
  );
};
