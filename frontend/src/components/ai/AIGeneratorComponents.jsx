import React, { useState, useEffect } from 'react';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';
import { Sparkles, CheckCircle2, Circle, ArrowRight, RefreshCw, Check } from 'lucide-react';
import { clsx } from 'clsx';

export const AIGeneratorSentenceForm = ({ onGenerate }) => {
  const [destination, setDestination] = useState('Japan');
  const [days, setDays] = useState('12');
  const [budget, setBudget] = useState('1,80,000');
  const [pace, setPace] = useState('Balanced'); // 'Relaxed', 'Balanced', 'Fast-Paced'
  const [selectedInterests, setSelectedInterests] = useState(['Food', 'Culture', 'Nature']);

  const interestsList = [
    { label: '🍜 Food', id: 'Food' },
    { label: '⛩ Culture', id: 'Culture' },
    { label: '🌿 Nature', id: 'Nature' },
    { label: '🎉 Nightlife', id: 'Nightlife' },
    { label: '🏔 Adventure', id: 'Adventure' }
  ];

  const toggleInterest = (id) => {
    if (selectedInterests.includes(id)) {
      setSelectedInterests(selectedInterests.filter((i) => i !== id));
    } else {
      setSelectedInterests([...selectedInterests, id]);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onGenerate({
      destination,
      days,
      budget,
      pace,
      interests: selectedInterests
    });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full max-w-3xl mx-auto glass-primary rounded-3xl p-6 sm:p-12 shadow-2xl text-left border"
    >
      <div className="flex items-center gap-2 text-zinc-500 dark:text-zinc-400 text-xs font-mono font-bold tracking-widest uppercase mb-2">
        <Sparkles className="w-4 h-4 text-zinc-950 dark:text-zinc-100" /> PLAN WITH AI
      </div>
      <h2 className="text-2xl sm:text-4xl font-black tracking-tight text-zinc-950 dark:text-zinc-50 mb-3 uppercase">
        Tell us about your dream journey.
      </h2>
      <p className="text-sm sm:text-base text-zinc-600 dark:text-zinc-400 mb-8 leading-relaxed font-medium">
        Our multi-agent travel intelligence will compose an optimized, day-by-day journey tailored to your rhythm.
      </p>

      {/* Natural Interactive Sentence Form */}
      <div className="p-6 sm:p-8 rounded-2xl glass-secondary border text-lg sm:text-2xl font-bold leading-relaxed text-zinc-950 dark:text-zinc-50 space-y-4 shadow-sm">
        <div className="flex flex-wrap items-center gap-2.5">
          <span>I want to explore</span>
          <input
            type="text"
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            className="border-b-2 border-zinc-950 dark:border-zinc-100 bg-transparent px-2 py-0.5 text-zinc-950 dark:text-zinc-50 font-black focus:outline-none focus:bg-white/60 dark:focus:bg-zinc-800 rounded-t-md max-w-[200px]"
            required
          />
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <span>for</span>
          <input
            type="number"
            value={days}
            onChange={(e) => setDays(e.target.value)}
            className="border-b-2 border-zinc-950 dark:border-zinc-100 bg-transparent px-2 py-0.5 text-zinc-950 dark:text-zinc-50 font-black focus:outline-none focus:bg-white/60 dark:focus:bg-zinc-800 rounded-t-md w-20 text-center"
            required
          />
          <span>days with a budget of</span>
          <div className="inline-flex items-center">
            <span>₹</span>
            <input
              type="text"
              value={budget}
              onChange={(e) => setBudget(e.target.value)}
              className="border-b-2 border-zinc-950 dark:border-zinc-100 bg-transparent px-2 py-0.5 text-zinc-950 dark:text-zinc-50 font-black focus:outline-none focus:bg-white/60 dark:focus:bg-zinc-800 rounded-t-md max-w-[160px]"
              required
            />
            <span>.</span>
          </div>
        </div>
      </div>

      {/* Interests Chips */}
      <div className="mt-8 space-y-3">
        <span className="text-xs font-mono uppercase font-bold tracking-wider text-zinc-600 dark:text-zinc-400">
          I ENJOY:
        </span>
        <div className="flex flex-wrap gap-2.5">
          {interestsList.map((item) => {
            const isSelected = selectedInterests.includes(item.id);
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => toggleInterest(item.id)}
                className={clsx(
                  'px-4 py-2.5 rounded-2xl text-sm font-bold transition-all duration-150 flex items-center gap-1.5 border',
                  isSelected
                    ? 'bg-zinc-950 text-white dark:bg-zinc-100 dark:text-zinc-950 shadow-md scale-105 border-zinc-950 dark:border-zinc-100'
                    : 'glass-secondary text-zinc-800 dark:text-zinc-200 hover:border-zinc-400'
                )}
              >
                <span>{item.label}</span>
                {isSelected && <Check className="w-3.5 h-3.5 ml-1 shrink-0" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* Travel Pace Selector */}
      <div className="mt-8 space-y-3">
        <span className="text-xs font-mono uppercase font-bold tracking-wider text-zinc-600 dark:text-zinc-400">
          MY PACE:
        </span>
        <div className="grid grid-cols-3 gap-3">
          {['Relaxed', 'Balanced', 'Fast-Paced'].map((option) => {
            const isSelected = pace === option;
            return (
              <div
                key={option}
                onClick={() => setPace(option)}
                className={clsx(
                  'p-3.5 rounded-2xl border cursor-pointer text-center font-bold text-xs sm:text-sm transition-all duration-150',
                  isSelected
                    ? 'border-zinc-950 dark:border-zinc-100 bg-zinc-950 text-white dark:bg-zinc-100 dark:text-zinc-950 shadow-md'
                    : 'glass-secondary text-zinc-800 dark:text-zinc-200 hover:border-zinc-400'
                )}
              >
                <div className="flex items-center justify-center gap-1.5">
                  <span className="text-xs">{isSelected ? '◉' : '○'}</span>
                  <span>{option}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Submit Button */}
      <div className="mt-10 pt-6 border-t border-zinc-200/50 dark:border-zinc-800 flex justify-end">
        <Button
          type="submit"
          variant="primary"
          size="lg"
          icon={Sparkles}
          className="w-full sm:w-auto font-black text-sm tracking-wider uppercase px-8 shadow-xl"
        >
          ✦ GENERATE MY TRIP
        </Button>
      </div>
    </form>
  );
};

export const AIProgressVisualizer = ({ onComplete }) => {
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    { label: 'Understanding your travel style', icon: '✓' },
    { label: 'Finding ideal destinations & optimal stopovers', icon: '✓' },
    { label: 'Balancing your budget & stay tiers', icon: '✓' },
    { label: 'Building curated daily morning/evening slots', icon: '✓' },
    { label: 'Optimizing transport routes between cities', icon: '✓' }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentStep((prev) => {
        if (prev < steps.length - 1) {
          return prev + 1;
        } else {
          clearInterval(timer);
          setTimeout(() => {
            onComplete();
          }, 800);
          return prev;
        }
      });
    }, 900);

    return () => clearInterval(timer);
  }, [onComplete, steps.length]);

  return (
    <div className="w-full max-w-2xl mx-auto glass-primary rounded-3xl p-8 sm:p-12 shadow-2xl text-left animate-in fade-in border">
      <div className="flex items-center gap-2 text-zinc-600 dark:text-zinc-400 text-xs font-mono font-bold tracking-widest uppercase mb-2">
        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" /> AI GENERATOR ACTIVE
      </div>
      <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-zinc-950 dark:text-zinc-50 mb-8 uppercase">
        BUILDING YOUR JOURNEY
      </h2>

      {/* Simulated Route Construction visual */}
      <div className="p-6 rounded-2xl glass-secondary border mb-8 shadow-xs">
        <div className="flex flex-col gap-3 font-mono text-xs">
          <div className="flex items-center gap-3">
            <span className="w-3 h-3 rounded-full bg-zinc-950 dark:bg-zinc-100" />
            <span className="font-bold text-zinc-950 dark:text-zinc-50 uppercase">Tokyo</span>
          </div>

          <div className="pl-1.5 flex items-center gap-3 text-zinc-500 dark:text-zinc-400 font-semibold animate-pulse">
            <div className="w-0.5 h-6 bg-zinc-300 dark:bg-zinc-700" />
            <span>✈ Finding the best route...</span>
          </div>

          <div className="flex items-center gap-3">
            <span className="w-3 h-3 rounded-full bg-zinc-950 dark:bg-zinc-100" />
            <span className="font-bold text-zinc-950 dark:text-zinc-50 uppercase">Kyoto</span>
          </div>

          <div className="pl-1.5 flex items-center gap-3 text-zinc-500 dark:text-zinc-400 font-semibold animate-pulse">
            <div className="w-0.5 h-6 bg-zinc-300 dark:bg-zinc-700" />
            <span>🚅 Optimizing transit connection...</span>
          </div>

          <div className="flex items-center gap-3">
            <span className="w-3 h-3 rounded-full bg-zinc-950 dark:bg-zinc-100" />
            <span className="font-bold text-zinc-950 dark:text-zinc-50 uppercase">Osaka</span>
          </div>
        </div>
      </div>

      {/* Checklist */}
      <div className="space-y-3.5">
        {steps.map((step, idx) => {
          const isDone = idx < currentStep;
          const isCurrent = idx === currentStep;
          const isPending = idx > currentStep;

          return (
            <div
              key={step.label}
              className={clsx(
                'flex items-center gap-3 text-sm font-semibold transition-all duration-300',
                isDone && 'text-zinc-950 dark:text-zinc-50',
                isCurrent && 'text-zinc-950 dark:text-zinc-50 font-bold',
                isPending && 'text-zinc-400 dark:text-zinc-600'
              )}
            >
              <div className="w-5 h-5 flex items-center justify-center shrink-0">
                {isDone && <CheckCircle2 className="w-5 h-5 text-zinc-950 dark:text-zinc-100" />}
                {isCurrent && (
                  <span className="w-4 h-4 rounded-full border-2 border-zinc-950 dark:border-zinc-100 border-t-transparent animate-spin" />
                )}
                {isPending && <Circle className="w-4 h-4 text-zinc-300 dark:text-zinc-700" />}
              </div>
              <span>{step.label}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export const AIResultView = ({ generatedTrip, onAccept, onCustomize, onRegenerate }) => {
  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col gap-8 text-left animate-in fade-in zoom-in-95 duration-300">
      {/* Result Hero */}
      <div className="glass-primary rounded-3xl p-6 sm:p-10 shadow-2xl border">
        <div className="flex items-center gap-2 text-zinc-600 dark:text-zinc-400 text-xs font-mono font-bold tracking-widest uppercase mb-2">
          <Sparkles className="w-4 h-4 text-zinc-950 dark:text-zinc-100" /> AI PLANNING COMPLETE
        </div>
        <h2 className="text-2xl sm:text-4xl font-black tracking-tight text-zinc-950 dark:text-zinc-50 mb-6 uppercase">
          YOUR AI-GENERATED JOURNEY
        </h2>

        {/* Route Banner with Liquid Glass */}
        <div className="p-6 rounded-2xl glass-secondary border mb-8 shadow-xs">
          <div className="text-center font-mono font-black text-lg sm:text-2xl tracking-widest uppercase text-zinc-950 dark:text-zinc-50">
            {generatedTrip.routeSummary}
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-3 gap-4 p-5 rounded-2xl glass-secondary border mb-8 text-center shadow-xs">
          <div>
            <span className="text-[10px] font-mono uppercase font-bold text-zinc-600 dark:text-zinc-400">DURATION</span>
            <p className="text-lg sm:text-2xl font-black text-zinc-950 dark:text-zinc-50 mt-1">
              {generatedTrip.durationDays} DAYS
            </p>
          </div>

          <div>
            <span className="text-[10px] font-mono uppercase font-bold text-zinc-600 dark:text-zinc-400">OPTIMIZED BUDGET</span>
            <p className="text-lg sm:text-2xl font-black text-zinc-950 dark:text-zinc-50 mt-1">
              ₹{generatedTrip.totalBudget.toLocaleString()}
            </p>
          </div>

          <div>
            <span className="text-[10px] font-mono uppercase font-bold text-zinc-600 dark:text-zinc-400">ACTIVITIES</span>
            <p className="text-lg sm:text-2xl font-black text-zinc-950 dark:text-zinc-50 mt-1">
              {generatedTrip.activitiesCount} CURATED
            </p>
          </div>
        </div>

        {/* Visual Day Breakdown */}
        <div className="space-y-3 mb-8">
          <span className="text-xs font-mono uppercase font-bold tracking-wider text-zinc-600 dark:text-zinc-400 block mb-4">
            ITINERARY PACING MAP:
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {generatedTrip.dayBreakdown.map((day) => (
              <div
                key={day.day}
                className="p-4 rounded-2xl glass-secondary border flex flex-col justify-between gap-3 shadow-xs"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-zinc-950 dark:text-zinc-50">
                    DAY {String(day.day).padStart(2, '0')}
                  </span>
                  <div className="flex items-center gap-1">
                    {Array.from({ length: day.dots }).map((_, i) => (
                      <span key={i} className="w-2 h-2 rounded-full bg-zinc-900 dark:bg-zinc-100" />
                    ))}
                  </div>
                </div>
                <h4 className="text-xs font-bold text-zinc-900 dark:text-zinc-100 truncate">
                  {day.title}
                </h4>
                <div className="flex flex-wrap gap-1">
                  {day.tags.slice(0, 2).map((t) => (
                    <span key={t} className="text-[10px] glass-secondary border px-1.5 py-0.5 rounded text-zinc-700 dark:text-zinc-300 font-semibold">
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Actions CTA */}
        <div className="pt-6 border-t border-zinc-200/50 dark:border-zinc-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <Button
            variant="ghost"
            icon={RefreshCw}
            onClick={onRegenerate}
            className="w-full sm:w-auto font-bold text-xs"
          >
            REGENERATE ✦
          </Button>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <Button
              variant="outline"
              onClick={onCustomize}
              className="flex-1 sm:flex-initial font-bold text-xs"
            >
              CUSTOMIZE
            </Button>
            <Button
              variant="primary"
              size="lg"
              icon={ArrowRight}
              iconPosition="right"
              onClick={onAccept}
              className="flex-1 sm:flex-initial font-black text-sm uppercase px-8 shadow-xl"
            >
              ACCEPT JOURNEY
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
