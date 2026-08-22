import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTrips } from '../../context/TripContext';
import { Input } from '../../components/common/Input';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { InteractiveMap } from '../../components/travel/InteractiveMap';
import { RouteVisualizer } from '../../components/travel/RouteVisualizer';
import { CITIES_DATA } from '../../data/citiesData';
import {
  ArrowRight,
  ArrowLeft,
  Plus,
  Trash2,
  MoveUp,
  MoveDown,
  CheckCircle2,
  Check
} from 'lucide-react';
import { clsx } from 'clsx';

export const CreateTripPage = () => {
  const navigate = useNavigate();
  const { createTrip, loading } = useTrips();
  const [currentStep, setCurrentStep] = useState(1);

  // Step 1: Basics
  const [tripName, setTripName] = useState('Japanese Golden Route');
  const [tripDescription, setTripDescription] = useState('A curated multi-city journey between Tokyo, Kyoto, and Osaka.');
  const [startDate, setStartDate] = useState('2026-04-10');
  const [endDate, setEndDate] = useState('2026-04-22');

  // Step 2: Stops
  const [stops, setStops] = useState([
    { id: 'st-1', cityId: 'tokyo', cityName: 'Tokyo', code: 'NRT', nights: 4, transportToNext: { mode: 'flight', icon: '✈', duration: '2h 15m' } },
    { id: 'st-2', cityId: 'kyoto', cityName: 'Kyoto', code: 'KYO', nights: 4, transportToNext: { mode: 'train', icon: '🚅', duration: '45m' } },
    { id: 'st-3', cityId: 'osaka', cityName: 'Osaka', code: 'OSA', nights: 4, transportToNext: null }
  ]);
  const [newCitySelect, setNewCitySelect] = useState('paris');

  // Step 3: Preferences
  const [budgetTier, setBudgetTier] = useState('Moderate');
  const [travelStyle, setTravelStyle] = useState('Balanced');
  const [selectedInterests, setSelectedInterests] = useState(['Food', 'Culture', 'Nature']);
  const [customBudget, setCustomBudget] = useState('180000');

  const interestsList = [
    { label: '🍜 Food', id: 'Food' },
    { label: '⛩ Culture', id: 'Culture' },
    { label: '🌿 Nature', id: 'Nature' },
    { label: '🎉 Nightlife', id: 'Nightlife' },
    { label: '🏔 Adventure', id: 'Adventure' }
  ];

  // Stop handlers
  const handleAddStop = () => {
    const cityObj = CITIES_DATA.find((c) => c.id === newCitySelect) || CITIES_DATA[0];
    const newStop = {
      id: `st-${Date.now()}`,
      cityId: cityObj.id,
      cityName: cityObj.name,
      code: cityObj.code,
      nights: 3,
      transportToNext: { mode: 'train', icon: '🚅', duration: '1h 30m' }
    };
    setStops([...stops, newStop]);
  };

  const handleRemoveStop = (index) => {
    if (stops.length <= 2) return;
    const updated = stops.filter((_, i) => i !== index);
    setStops(updated);
  };

  const handleMoveStop = (index, direction) => {
    const newIndex = index + direction;
    if (newIndex < 0 || newIndex >= stops.length) return;
    const updated = [...stops];
    const temp = updated[index];
    updated[index] = updated[newIndex];
    updated[newIndex] = temp;
    setStops(updated);
  };

  const toggleInterest = (id) => {
    if (selectedInterests.includes(id)) {
      setSelectedInterests(selectedInterests.filter((i) => i !== id));
    } else {
      setSelectedInterests([...selectedInterests, id]);
    }
  };

  const handleFinishCreate = async () => {
    const created = await createTrip({
      title: tripName,
      description: tripDescription,
      startDate,
      endDate,
      durationDays: 12,
      totalBudget: Number(customBudget) || 180000,
      stops,
      travelStyle,
      budgetTier,
      interests: selectedInterests
    });
    navigate(`/trips/${created.id}`);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-8 py-8 text-left space-y-8 relative z-10">
      {/* Top Wizard Steps Header with Liquid Glass */}
      <div className="glass-primary rounded-3xl p-6 sm:p-8 shadow-xl border">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-[10px] font-mono uppercase font-bold tracking-widest text-zinc-400">
              STEP {currentStep} OF 4
            </span>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-zinc-950 dark:text-zinc-50 uppercase mt-0.5">
              {currentStep === 1 && 'WHERE DOES YOUR JOURNEY BEGIN?'}
              {currentStep === 2 && 'BUILD YOUR ROUTE'}
              {currentStep === 3 && 'TRAVEL PREFERENCES'}
              {currentStep === 4 && 'REVIEW YOUR JOURNEY'}
            </h1>
          </div>

          {/* Stepper Dots */}
          <div className="flex items-center gap-2 font-mono text-xs font-bold text-zinc-400">
            {[1, 2, 3, 4].map((step) => (
              <div key={step} className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setCurrentStep(step)}
                  className={clsx(
                    'w-8 h-8 rounded-xl font-bold flex items-center justify-center transition-all border',
                    currentStep === step
                      ? 'bg-zinc-950 text-white dark:bg-zinc-100 dark:text-zinc-950 shadow-md border-zinc-950 dark:border-zinc-100'
                      : currentStep > step
                      ? 'glass-secondary text-zinc-900 dark:text-zinc-100'
                      : 'glass-secondary text-zinc-400 opacity-60'
                  )}
                >
                  {step}
                </button>
                {step < 4 && <div className="w-4 h-0.5 bg-zinc-300 dark:bg-zinc-700" />}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* STEP 1: TRIP BASICS */}
      {currentStep === 1 && (
        <div className="glass-secondary rounded-3xl p-6 sm:p-12 shadow-lg space-y-6 animate-in fade-in border">
          <Input
            label="Trip Name"
            placeholder="e.g. Japanese Autumn Odyssey"
            value={tripName}
            onChange={(e) => setTripName(e.target.value)}
            className="text-lg font-bold py-3"
            required
          />

          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-zinc-700 dark:text-zinc-300">
              Short Description / Trip Purpose
            </label>
            <textarea
              rows={3}
              value={tripDescription}
              onChange={(e) => setTripDescription(e.target.value)}
              placeholder="e.g. Exploring ancient shrines, modern architecture, and local street cuisine."
              className="w-full glass-secondary border rounded-2xl p-4 text-sm font-medium text-zinc-950 dark:text-zinc-50 placeholder-zinc-400 dark:placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-zinc-950 dark:focus:ring-zinc-100 shadow-xs"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <Input
              label="Start Date"
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              required
            />
            <Input
              label="End Date"
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              required
            />
          </div>
        </div>
      )}

      {/* STEP 2: BUILD YOUR ROUTE (Split Left: Stops, Right: Interactive Map) */}
      {currentStep === 2 && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start animate-in fade-in">
          {/* Left: Stops Builder */}
          <div className="lg:col-span-6 glass-secondary rounded-3xl p-6 sm:p-8 shadow-lg space-y-6 border">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono uppercase font-bold tracking-wider text-zinc-400">
                YOUR STOPS ({stops.length})
              </span>
              <span className="text-xs text-zinc-500 dark:text-zinc-400 font-semibold">Reorder with arrows</span>
            </div>

            <div className="space-y-3">
              {stops.map((stop, idx) => (
                <div
                  key={stop.id}
                  className="p-4 rounded-2xl glass-secondary border flex items-center justify-between gap-3 shadow-xs"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-8 h-8 rounded-xl bg-zinc-950 dark:bg-zinc-100 text-white dark:text-zinc-950 flex items-center justify-center font-mono font-bold text-xs shadow-xs">
                      0{idx + 1}
                    </span>
                    <div>
                      <h4 className="text-base font-black text-zinc-950 dark:text-zinc-50 uppercase">
                        {stop.cityName}
                      </h4>
                      <span className="text-xs text-zinc-500 dark:text-zinc-400 font-mono font-bold">
                        {stop.nights} Nights • {stop.code}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      disabled={idx === 0}
                      onClick={() => handleMoveStop(idx, -1)}
                      className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-950 dark:hover:text-zinc-100 disabled:opacity-30"
                      title="Move up"
                    >
                      <MoveUp className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      disabled={idx === stops.length - 1}
                      onClick={() => handleMoveStop(idx, 1)}
                      className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-950 dark:hover:text-zinc-100 disabled:opacity-30"
                      title="Move down"
                    >
                      <MoveDown className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      disabled={stops.length <= 2}
                      onClick={() => handleRemoveStop(idx)}
                      className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 disabled:opacity-30"
                      title="Remove stop"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Add Stop Dropdown */}
            <div className="pt-4 border-t border-zinc-200/50 dark:border-zinc-800 flex items-center gap-3">
              <select
                value={newCitySelect}
                onChange={(e) => setNewCitySelect(e.target.value)}
                className="flex-1 glass-secondary border rounded-2xl px-4 py-2.5 text-xs font-bold text-zinc-950 dark:text-zinc-50 focus:outline-none shadow-xs"
              >
                {CITIES_DATA.map((c) => (
                  <option key={c.id} value={c.id} className="bg-white dark:bg-zinc-900 text-zinc-950 dark:text-zinc-50">
                    {c.flag} {c.name} ({c.country})
                  </option>
                ))}
              </select>

              <Button
                variant="primary"
                size="sm"
                icon={Plus}
                onClick={handleAddStop}
                className="text-xs font-bold shadow-md"
              >
                + Add Stop
              </Button>
            </div>
          </div>

          {/* Right: Interactive Map */}
          <div className="lg:col-span-6 space-y-4">
            <span className="text-xs font-mono uppercase font-bold tracking-wider text-zinc-400 block">
              LIVE ROUTE VISUALIZER
            </span>
            <InteractiveMap stops={stops} />
          </div>
        </div>
      )}

      {/* STEP 3: PREFERENCES */}
      {currentStep === 3 && (
        <div className="glass-secondary rounded-3xl p-6 sm:p-12 shadow-lg space-y-8 animate-in fade-in border">
          {/* Budget tier */}
          <div className="space-y-3">
            <span className="text-xs font-mono uppercase font-bold tracking-wider text-zinc-400">
              BUDGET TIER:
            </span>
            <div className="grid grid-cols-3 gap-4">
              {['Budget', 'Moderate', 'Premium'].map((tier) => (
                <div
                  key={tier}
                  onClick={() => setBudgetTier(tier)}
                  className={clsx(
                    'p-4 rounded-2xl border cursor-pointer text-center font-bold text-sm transition-all shadow-xs',
                    budgetTier === tier
                      ? 'border-zinc-950 dark:border-zinc-100 bg-zinc-950 text-white dark:bg-zinc-100 dark:text-zinc-950 shadow-md'
                      : 'glass-secondary text-zinc-800 dark:text-zinc-200 hover:border-zinc-400'
                  )}
                >
                  {tier}
                </div>
              ))}
            </div>
          </div>

          {/* Travel style */}
          <div className="space-y-3">
            <span className="text-xs font-mono uppercase font-bold tracking-wider text-zinc-400">
              TRAVEL STYLE & PACE:
            </span>
            <div className="grid grid-cols-3 gap-4">
              {['Relaxed', 'Balanced', 'Fast-Paced'].map((st) => (
                <div
                  key={st}
                  onClick={() => setTravelStyle(st)}
                  className={clsx(
                    'p-4 rounded-2xl border cursor-pointer text-center font-bold text-sm transition-all shadow-xs',
                    travelStyle === st
                      ? 'border-zinc-950 dark:border-zinc-100 bg-zinc-950 text-white dark:bg-zinc-100 dark:text-zinc-950 shadow-md'
                      : 'glass-secondary text-zinc-800 dark:text-zinc-200 hover:border-zinc-400'
                  )}
                >
                  {st}
                </div>
              ))}
            </div>
          </div>

          {/* Interests */}
          <div className="space-y-3">
            <span className="text-xs font-mono uppercase font-bold tracking-wider text-zinc-400">
              INTERESTS:
            </span>
            <div className="flex flex-wrap gap-3">
              {interestsList.map((item) => {
                const isSelected = selectedInterests.includes(item.id);
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => toggleInterest(item.id)}
                    className={clsx(
                      'px-4 py-2.5 rounded-2xl text-sm font-bold transition-all flex items-center gap-1.5 border shadow-xs',
                      isSelected
                        ? 'bg-zinc-950 text-white dark:bg-zinc-100 dark:text-zinc-950 border-zinc-950 dark:border-zinc-100 shadow-md'
                        : 'glass-secondary text-zinc-800 dark:text-zinc-200 hover:border-zinc-400'
                    )}
                  >
                    <span>{item.label}</span>
                    {isSelected && <Check className="w-3.5 h-3.5 ml-1" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Budget Input */}
          <Input
            label="Custom Budget Target (₹)"
            type="number"
            value={customBudget}
            onChange={(e) => setCustomBudget(e.target.value)}
            className="text-lg font-bold"
          />
        </div>
      )}

      {/* STEP 4: REVIEW YOUR JOURNEY */}
      {currentStep === 4 && (
        <div className="glass-secondary rounded-3xl p-6 sm:p-12 shadow-lg space-y-8 animate-in fade-in border">
          <div className="flex items-center justify-between pb-6 border-b border-zinc-200/50 dark:border-zinc-800">
            <div>
              <span className="text-[10px] font-mono uppercase font-bold text-zinc-400">
                SUMMARY
              </span>
              <h2 className="text-2xl sm:text-3xl font-black uppercase text-zinc-950 dark:text-zinc-50 mt-0.5">
                {tripName}
              </h2>
              <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-1 font-medium">{tripDescription}</p>
            </div>
            <Badge variant="dark" size="lg">
              ₹{Number(customBudget).toLocaleString()}
            </Badge>
          </div>

          {/* Route Summary */}
          <div className="p-6 rounded-2xl glass-secondary border shadow-xs">
            <span className="text-[10px] font-mono uppercase font-bold text-zinc-400 block mb-3">
              TRANSIT ROUTE
            </span>
            <RouteVisualizer stops={stops} />
          </div>

          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="p-4 rounded-2xl glass-secondary border shadow-xs">
              <span className="text-[10px] uppercase font-bold text-zinc-400">Pace</span>
              <p className="text-base font-black text-zinc-950 dark:text-zinc-50 mt-1">{travelStyle}</p>
            </div>
            <div className="p-4 rounded-2xl glass-secondary border shadow-xs">
              <span className="text-[10px] uppercase font-bold text-zinc-400">Tier</span>
              <p className="text-base font-black text-zinc-950 dark:text-zinc-50 mt-1">{budgetTier}</p>
            </div>
            <div className="p-4 rounded-2xl glass-secondary border shadow-xs">
              <span className="text-[10px] uppercase font-bold text-zinc-400">Stops</span>
              <p className="text-base font-black text-zinc-950 dark:text-zinc-50 mt-1">{stops.length} Cities</p>
            </div>
          </div>
        </div>
      )}

      {/* Bottom Navigation Wizard Bar */}
      <div className="flex items-center justify-between pt-4 border-t border-zinc-200/50 dark:border-zinc-800">
        <Button
          variant="outline"
          size="md"
          icon={ArrowLeft}
          disabled={currentStep === 1}
          onClick={() => setCurrentStep((s) => s - 1)}
          className="font-bold text-xs"
        >
          Previous Step
        </Button>

        {currentStep < 4 ? (
          <Button
            variant="primary"
            size="md"
            icon={ArrowRight}
            iconPosition="right"
            onClick={() => setCurrentStep((s) => s + 1)}
            className="font-black text-xs uppercase px-8 shadow-md"
          >
            Continue
          </Button>
        ) : (
          <Button
            variant="primary"
            size="lg"
            icon={CheckCircle2}
            loading={loading}
            onClick={handleFinishCreate}
            className="font-black text-xs uppercase px-8 shadow-xl"
          >
            CREATE MY TRIP
          </Button>
        )}
      </div>
    </div>
  );
};
