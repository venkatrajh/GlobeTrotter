import React, { useState } from 'react';
import { Outlet, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { MobileNavigation } from './MobileNavigation';
import { useAuth } from '../../context/AuthContext';
import { useTrips } from '../../context/TripContext';
import { Button } from '../common/Button';
import { ImageWithFallback } from '../common/ImageWithFallback';
import { AmbientBackground } from '../common/AmbientBackground';
import { Plus, Sparkles, CheckCircle2, AlertCircle, Info, ChevronRight } from 'lucide-react';
import { clsx } from 'clsx';

export const AppLayout = () => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const { user } = useAuth();
  const { activeTrip, notification } = useTrips();
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <div className="relative flex h-screen w-full overflow-hidden text-zinc-900 dark:text-zinc-100 selection:bg-zinc-950 selection:text-white">
      {/* Theme-Aware 3D Ambient Background Environment with Scroll Parallax */}
      <AmbientBackground />

      {/* Left Sidebar (Desktop/Tablet) with Liquid Glass */}
      <div className="hidden md:block shrink-0 z-30">
        <Sidebar
          isCollapsed={isSidebarCollapsed}
          onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        />
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden min-w-0 z-10">
        {/* Top Header Bar with Tier 1 Primary Liquid Glass */}
        <header className="h-16 glass-primary px-4 sm:px-8 flex items-center justify-between shrink-0 z-20 border-b">
          <div className="flex items-center gap-3">
            {/* Mobile Brand */}
            <div className="md:hidden flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-zinc-950 dark:bg-zinc-100 text-white dark:text-zinc-950 flex items-center justify-center font-bold text-sm shadow-xs">
                G
              </div>
              <span className="font-bold tracking-tight text-sm uppercase">GLOBETROTTER</span>
            </div>

            {/* Breadcrumb / Active Trip Context */}
            {activeTrip && (
              <div className="hidden sm:flex items-center gap-2 text-xs font-semibold text-zinc-400">
                <NavLink to="/trips" className="hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors">
                  Trips
                </NavLink>
                <ChevronRight className="w-3.5 h-3.5" />
                <NavLink
                  to={`/trips/${activeTrip.id}`}
                  className="text-zinc-900 dark:text-zinc-100 flex items-center gap-1.5 font-bold hover:underline"
                >
                  <span>{activeTrip.flag}</span>
                  <span>{activeTrip.title}</span>
                </NavLink>
              </div>
            )}
          </div>

          {/* Right Header Actions */}
          <div className="flex items-center gap-2.5">
            <Button
              variant="outline"
              size="sm"
              icon={Sparkles}
              onClick={() => navigate('/ai-planner')}
              className="font-bold text-xs"
            >
              ✦ Plan AI
            </Button>

            <Button
              variant="primary"
              size="sm"
              icon={Plus}
              onClick={() => navigate('/create-trip')}
              className="text-xs font-bold"
            >
              New Journey
            </Button>

            {/* Profile Avatar / Quick Link */}
            <NavLink
              to="/profile"
              className="ml-2 flex items-center gap-2 p-0.5 rounded-full hover:ring-2 hover:ring-zinc-400 dark:hover:ring-zinc-600 transition-all"
            >
              <div className="w-8 h-8 rounded-full overflow-hidden border border-zinc-200 dark:border-zinc-700 shadow-xs">
                <ImageWithFallback
                  src={user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'}
                  alt={user?.name || 'User'}
                  fallbackCategory="User"
                  className="w-full h-full object-cover"
                />
              </div>
            </NavLink>
          </div>
        </header>

        {/* Global Floating Toast Notification with Tier 3 Floating Glass */}
        {notification && (
          <div className="fixed top-20 right-6 z-50 animate-in slide-in-from-top-4 fade-in duration-200">
            <div
              className={clsx(
                'glass-floating flex items-center gap-3 px-5 py-3.5 rounded-2xl shadow-2xl text-sm font-semibold',
                notification.type === 'success' && 'border-emerald-500/30 text-emerald-950 dark:text-emerald-100',
                notification.type === 'info' && 'border-sky-500/30 text-zinc-950 dark:text-zinc-50',
                notification.type === 'warning' && 'border-amber-500/30 text-amber-950 dark:text-amber-100'
              )}
            >
              {notification.type === 'success' && <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />}
              {notification.type === 'info' && <Info className="w-4 h-4 text-sky-500 shrink-0" />}
              {notification.type === 'warning' && <AlertCircle className="w-4 h-4 text-amber-500 shrink-0" />}
              <span>{notification.message}</span>
            </div>
          </div>
        )}

        {/* Main Scrollable Page Container */}
        <main className="flex-1 overflow-y-auto pb-20 md:pb-8 relative">
          <Outlet />
        </main>
      </div>

      {/* Mobile Navigation Bar with Liquid Glass */}
      <MobileNavigation />
    </div>
  );
};
