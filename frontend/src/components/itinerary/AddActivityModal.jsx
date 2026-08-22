import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { Input } from '../common/Input';
import { Button } from '../common/Button';
import { Select } from '../common/Select';
import { ACTIVITIES_DATA } from '../../data/activitiesData';
import { Search, Plus } from 'lucide-react';

export const AddActivityModal = ({
  isOpen,
  onClose,
  slot,
  dayNumber,
  cityName = 'Tokyo',
  onAdd
}) => {
  const [activeTab, setActiveTab] = useState('catalog'); // 'catalog', 'custom'
  const [searchQuery, setSearchQuery] = useState('');

  // Custom form state
  const [customTitle, setCustomTitle] = useState('');
  const [customCategory, setCustomCategory] = useState('Sightseeing');
  const [customDuration, setCustomDuration] = useState('2 Hours');
  const [customCost, setCustomCost] = useState('800');
  const [customIcon, setCustomIcon] = useState('📍');

  const filteredCatalog = ACTIVITIES_DATA.filter((a) =>
    a.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    a.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddCustom = (e) => {
    e.preventDefault();
    if (!customTitle.trim()) return;
    onAdd({
      title: customTitle,
      category: customCategory,
      duration: customDuration,
      cost: Number(customCost) || 0,
      icon: customIcon,
      location: cityName,
      description: 'Custom activity planned for day.'
    });
    setCustomTitle('');
    onClose();
  };

  const handleSelectCatalog = (act) => {
    onAdd({
      title: act.name,
      category: act.category,
      duration: act.duration,
      cost: act.cost,
      icon: act.categoryIcon || '📍',
      location: act.location,
      description: act.description
    });
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Add Activity • Day ${dayNumber}`}
      subtitle={`Adding to ${slot?.toUpperCase()} slot`}
      maxWidth="max-w-2xl"
    >
      {/* Tabs */}
      <div className="flex border-b border-zinc-200/60 dark:border-zinc-800/60 mb-6">
        <button
          type="button"
          onClick={() => setActiveTab('catalog')}
          className={`pb-3 px-4 text-xs font-bold uppercase tracking-wider border-b-2 transition-colors ${
            activeTab === 'catalog'
              ? 'border-zinc-950 dark:border-zinc-100 text-zinc-950 dark:text-zinc-50'
              : 'border-transparent text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200'
          }`}
        >
          Discover Catalog
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('custom')}
          className={`pb-3 px-4 text-xs font-bold uppercase tracking-wider border-b-2 transition-colors ${
            activeTab === 'custom'
              ? 'border-zinc-950 dark:border-zinc-100 text-zinc-950 dark:text-zinc-50'
              : 'border-transparent text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200'
          }`}
        >
          + Custom Activity
        </button>
      </div>

      {activeTab === 'catalog' ? (
        <div className="flex flex-col gap-4">
          <Input
            icon={Search}
            placeholder="Search activities in catalog..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />

          <div className="max-h-80 overflow-y-auto pr-1 flex flex-col gap-2.5">
            {filteredCatalog.map((act) => (
              <div
                key={act.id}
                onClick={() => handleSelectCatalog(act)}
                className="p-3.5 rounded-2xl glass-secondary border hover:border-zinc-400 dark:hover:border-zinc-500 cursor-pointer flex items-center justify-between gap-4 transition-all group shadow-xs"
              >
                <div className="flex items-center gap-3.5">
                  <span className="text-2xl">{act.categoryIcon || '📍'}</span>
                  <div className="text-left">
                    <h5 className="text-sm font-bold text-zinc-950 dark:text-zinc-50 group-hover:underline">
                      {act.name}
                    </h5>
                    <span className="text-xs text-zinc-600 dark:text-zinc-400 flex items-center gap-2 mt-0.5 font-medium">
                      <span>{act.category}</span>
                      <span>•</span>
                      <span>⏱ {act.duration}</span>
                      <span>•</span>
                      <span>₹{act.cost}</span>
                    </span>
                  </div>
                </div>
                <Button size="sm" variant="outline" icon={Plus} className="text-xs font-bold">
                  Select
                </Button>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <form onSubmit={handleAddCustom} className="flex flex-col gap-4 text-left">
          <Input
            label="Activity Name"
            placeholder="e.g. Traditional Tea Ceremony at Uji"
            value={customTitle}
            onChange={(e) => setCustomTitle(e.target.value)}
            required
          />

          <div className="grid grid-cols-2 gap-4">
            <Select
              label="Category"
              value={customCategory}
              onChange={(e) => setCustomCategory(e.target.value)}
              options={['Sightseeing', 'Food', 'Culture', 'Nature', 'Adventure', 'Nightlife']}
            />
            <Select
              label="Emoji Icon"
              value={customIcon}
              onChange={(e) => setCustomIcon(e.target.value)}
              options={['📍 Pin', '⛩ Temple', '🍜 Food', '🌿 Nature', '🗼 Landmark', '👾 Arcade', '☕ Cafe']}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Duration"
              placeholder="e.g. 2 Hours"
              value={customDuration}
              onChange={(e) => setCustomDuration(e.target.value)}
            />
            <Input
              label="Cost (₹)"
              type="number"
              placeholder="800"
              value={customCost}
              onChange={(e) => setCustomCost(e.target.value)}
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-zinc-200/50 dark:border-zinc-800/50">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              Add to Itinerary
            </Button>
          </div>
        </form>
      )}
    </Modal>
  );
};
