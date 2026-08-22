import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { TransportIcon } from '../../components/travel/TransportIcon';
import { AmbientBackground } from '../../components/common/AmbientBackground';
import {
  Sparkles,
  Compass,
  ArrowRight
} from 'lucide-react';

export const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen relative flex flex-col justify-between overflow-x-hidden text-zinc-950 dark:text-zinc-50 selection:bg-zinc-950 selection:text-white">
      {/* 3D Ambient World */}
      <AmbientBackground />

      {/* Top Navigation with Liquid Glass */}
      <header className="max-w-7xl w-full mx-auto px-6 sm:px-12 py-6 flex items-center justify-between z-20">
        <NavLink to="/" className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-2xl bg-zinc-950 dark:bg-zinc-100 text-white dark:text-zinc-950 flex items-center justify-center font-black text-lg shadow-sm">
            G
          </div>
          <span className="font-black text-lg tracking-tight uppercase text-zinc-950 dark:text-zinc-50">GLOBETROTTER</span>
        </NavLink>

        <div className="flex items-center gap-4">
          <NavLink
            to="/login"
            className="text-xs sm:text-sm font-bold text-zinc-700 dark:text-zinc-300 hover:text-zinc-950 dark:hover:text-zinc-50 transition-colors"
          >
            Sign In
          </NavLink>
          <Button
            variant="primary"
            size="sm"
            onClick={() => navigate('/dashboard')}
            className="font-bold text-xs shadow-md"
          >
            Open Dashboard
          </Button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative max-w-7xl mx-auto px-6 sm:px-12 pt-12 pb-24 text-center flex flex-col items-center z-10">
        {/* AI Pill Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-secondary border text-xs font-bold text-zinc-900 dark:text-zinc-100 mb-8 shadow-xs animate-in fade-in">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Next-Gen Multi-City Intelligence</span>
        </div>

        {/* Big Hero Typography */}
        <h1 className="text-4xl sm:text-7xl lg:text-8xl font-black tracking-tight uppercase leading-[0.95] max-w-4xl text-zinc-950 dark:text-zinc-50">
          PLAN SMARTER.
          <br />
          TRAVEL BETTER.
        </h1>

        <p className="text-base sm:text-xl text-zinc-600 dark:text-zinc-400 max-w-2xl mt-8 mb-10 leading-relaxed font-medium">
          GlobeTrotter transforms complex multi-city journeys into effortless, beautifully visualized itineraries with AI-powered route optimization and real-time co-planning.
        </p>

        {/* Hero CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
          <Button
            variant="primary"
            size="lg"
            icon={Sparkles}
            onClick={() => navigate('/ai-planner')}
            className="w-full sm:w-auto font-black text-sm uppercase px-8 h-14 shadow-xl"
          >
            Start Planning With AI
          </Button>

          <Button
            variant="outline"
            size="lg"
            icon={Compass}
            onClick={() => navigate('/trips')}
            className="w-full sm:w-auto font-bold text-sm h-14 px-8"
          >
            Explore Trips
          </Button>
        </div>

        {/* Interactive Travel Journey Route Graphic with Liquid Glass */}
        <div className="w-full max-w-4xl mt-16 p-6 sm:p-8 rounded-3xl glass-primary shadow-2xl border">
          <div className="flex items-center justify-between pb-4 border-b border-zinc-200/60 dark:border-zinc-800 text-xs font-mono font-bold text-zinc-500 dark:text-zinc-400">
            <span>ROUTE PREVIEW: TOKYO → KYOTO → OSAKA</span>
            <span className="text-emerald-600 dark:text-emerald-400">OPTIMAL TRANSIT</span>
          </div>

          <div className="py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-zinc-950 text-white dark:bg-zinc-100 dark:text-zinc-950 flex items-center justify-center font-bold text-xs shadow-xs">
                NRT
              </div>
              <div className="text-left">
                <span className="text-sm font-black uppercase text-zinc-950 dark:text-zinc-50">TOKYO</span>
                <p className="text-xs text-zinc-500 dark:text-zinc-400">Japan • 4 Nights</p>
              </div>
            </div>

            <div className="flex items-center gap-2 text-xs font-mono text-zinc-700 dark:text-zinc-300 font-bold glass-secondary px-3.5 py-1.5 rounded-full border shadow-xs">
              <TransportIcon type="flight" className="w-3.5 h-3.5" />
              <span>2h 15m Flight</span>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-zinc-950 text-white dark:bg-zinc-100 dark:text-zinc-950 flex items-center justify-center font-bold text-xs shadow-xs">
                KYO
              </div>
              <div className="text-left">
                <span className="text-sm font-black uppercase text-zinc-950 dark:text-zinc-50">KYOTO</span>
                <p className="text-xs text-zinc-500 dark:text-zinc-400">Japan • 4 Nights</p>
              </div>
            </div>

            <div className="flex items-center gap-2 text-xs font-mono text-zinc-700 dark:text-zinc-300 font-bold glass-secondary px-3.5 py-1.5 rounded-full border shadow-xs">
              <TransportIcon type="train" className="w-3.5 h-3.5" />
              <span>45m Shinkansen</span>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-zinc-950 text-white dark:bg-zinc-100 dark:text-zinc-950 flex items-center justify-center font-bold text-xs shadow-xs">
                OSA
              </div>
              <div className="text-left">
                <span className="text-sm font-black uppercase text-zinc-950 dark:text-zinc-50">OSAKA</span>
                <p className="text-xs text-zinc-500 dark:text-zinc-400">Japan • 4 Nights</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5 Core Feature Pillars with Liquid Glass */}
      <section className="max-w-7xl mx-auto px-6 sm:px-12 py-16 w-full border-t border-zinc-200/50 dark:border-zinc-800 z-10">
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 text-left">
          <div className="p-6 rounded-3xl glass-secondary border shadow-sm space-y-3">
            <span className="text-2xl">🗺️</span>
            <h3 className="text-sm font-black uppercase tracking-wider text-zinc-950 dark:text-zinc-50">
              SMART PLANNING
            </h3>
            <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed font-medium">
              Day-by-day morning, afternoon and evening flashcards that organize your rhythm without clutter.
            </p>
          </div>

          <div className="p-6 rounded-3xl glass-secondary border shadow-sm space-y-3">
            <span className="text-2xl">🚆</span>
            <h3 className="text-sm font-black uppercase tracking-wider text-zinc-950 dark:text-zinc-50">
              MULTI-CITY JOURNEYS
            </h3>
            <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed font-medium">
              Connect cities, flights, bullet trains and scenic drives into a single unified visual timeline.
            </p>
          </div>

          <div className="p-6 rounded-3xl glass-secondary border shadow-sm space-y-3">
            <span className="text-2xl">✦</span>
            <h3 className="text-sm font-black uppercase tracking-wider text-zinc-950 dark:text-zinc-50">
              AI ASSISTANCE
            </h3>
            <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed font-medium">
              Generate entire custom itineraries from natural sentences and converse with a trip-aware Copilot.
            </p>
          </div>

          <div className="p-6 rounded-3xl glass-secondary border shadow-sm space-y-3">
            <span className="text-2xl">₹</span>
            <h3 className="text-sm font-black uppercase tracking-wider text-zinc-950 dark:text-zinc-50">
              SMART BUDGETING
            </h3>
            <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed font-medium">
              Donut breakdowns and money-saving insights that keep you informed on stay, food and transport.
            </p>
          </div>

          <div className="p-6 rounded-3xl glass-secondary border shadow-sm space-y-3">
            <span className="text-2xl">👥</span>
            <h3 className="text-sm font-black uppercase tracking-wider text-zinc-950 dark:text-zinc-50">
              COLLABORATION
            </h3>
            <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed font-medium">
              Invite your travel crew to vote on dining, propose alternatives, and share printable digital tickets.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="max-w-7xl mx-auto px-6 sm:px-12 py-8 w-full border-t border-zinc-200/60 dark:border-zinc-800 flex flex-col sm:flex-row items-center justify-between text-xs text-zinc-600 dark:text-zinc-400 gap-4 z-10">
        <div className="flex items-center gap-2">
          <span className="font-black text-zinc-950 dark:text-zinc-100 uppercase">GLOBETROTTER</span>
          <span>•</span>
          <span className="font-semibold">Intelligent Multi-City Travel Planner</span>
        </div>
        <div className="flex items-center gap-6 font-semibold">
          <NavLink to="/dashboard" className="hover:underline">Dashboard</NavLink>
          <NavLink to="/ai-planner" className="hover:underline">AI Generator</NavLink>
          <NavLink to="/explore" className="hover:underline">Discover</NavLink>
          <NavLink to="/login" className="hover:underline">Sign In</NavLink>
        </div>
      </footer>
    </div>
  );
};
