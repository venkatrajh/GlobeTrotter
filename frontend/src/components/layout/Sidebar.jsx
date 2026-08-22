import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  Compass,
  Calendar,
  Sparkles,
  User,
  Settings,
  ChevronLeft,
  ChevronRight,
  Plane,
  LayoutDashboard
} from 'lucide-react';
import { clsx } from 'clsx';
import { Tooltip } from '../common/Tooltip';

export const Sidebar = ({ isCollapsed, onToggleCollapse }) => {
  const location = useLocation();

  const mainNavItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'My Trips', path: '/trips', icon: Plane },
    { name: 'AI Planner', path: '/ai-planner', icon: Sparkles, badge: '✦ AI' },
    { name: 'Explore', path: '/explore', icon: Compass },
    { name: 'Calendar', path: '/calendar', icon: Calendar }
  ];

  const bottomNavItems = [
    { name: 'Profile', path: '/profile', icon: User },
    { name: 'Settings', path: '/settings', icon: Settings }
  ];

  return (
    <aside
      className={clsx(
        'glass-primary relative flex flex-col justify-between h-screen transition-all duration-300 z-30 shrink-0 select-none border-r',
        isCollapsed ? 'w-20' : 'w-64'
      )}
    >
      {/* Top Header / Logo */}
      <div className="p-4 border-b border-zinc-200/50 dark:border-zinc-800/50 flex items-center justify-between">
        {!isCollapsed ? (
          <NavLink to="/" className="flex items-center gap-2.5 overflow-hidden group">
            <div className="w-9 h-9 rounded-xl bg-zinc-950 dark:bg-zinc-100 flex items-center justify-center text-white dark:text-zinc-950 font-black text-base shadow-sm shrink-0 group-hover:scale-105 transition-transform">
              G
            </div>
            <div className="flex flex-col">
              <span className="font-bold tracking-tight text-sm text-zinc-950 dark:text-zinc-50 uppercase">
                GLOBETROTTER
              </span>
              <span className="text-[10px] text-zinc-600 dark:text-zinc-400 font-medium tracking-wider uppercase">
                Intelligent Travel
              </span>
            </div>
          </NavLink>
        ) : (
          <NavLink to="/" className="mx-auto">
            <Tooltip text="GlobeTrotter Home" position="right">
              <div className="w-9 h-9 rounded-xl bg-zinc-950 dark:bg-zinc-100 flex items-center justify-center text-white dark:text-zinc-950 font-black text-base shadow-sm hover:scale-105 transition-transform">
                G
              </div>
            </Tooltip>
          </NavLink>
        )}

        <button
          type="button"
          onClick={onToggleCollapse}
          className={clsx(
            'p-1.5 rounded-lg text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-white/40 dark:hover:bg-zinc-800/60 transition-colors',
            isCollapsed && 'hidden'
          )}
          title={isCollapsed ? 'Expand sidebar' : 'Minimize sidebar'}
          aria-label={isCollapsed ? 'Expand sidebar' : 'Minimize sidebar'}
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
      </div>

      {/* When collapsed, display the toggle button right below header */}
      {isCollapsed && (
        <div className="px-3 pt-3 flex justify-center">
          <Tooltip text="Expand sidebar" position="right">
            <button
              type="button"
              onClick={onToggleCollapse}
              className="p-2 rounded-xl text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-white/40 dark:hover:bg-zinc-800/60 transition-colors"
              aria-label="Expand sidebar"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </Tooltip>
        </div>
      )}

      {/* Main Navigation Items */}
      <div className="flex-1 py-4 px-3 flex flex-col gap-1 overflow-y-auto">
        <div className={clsx('px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-zinc-600 dark:text-zinc-400', isCollapsed && 'hidden')}>
          Menu
        </div>
        {mainNavItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path || (item.path !== '/' && location.pathname.startsWith(item.path));

          const navButton = (
            <NavLink
              to={item.path}
              className={clsx(
                'flex items-center gap-3 px-3 py-2.5 rounded-2xl text-sm font-medium transition-all duration-150 relative group',
                isActive
                  ? 'bg-zinc-950 text-white dark:bg-zinc-100 dark:text-zinc-950 font-semibold shadow-md'
                  : 'text-zinc-600 dark:text-zinc-400 hover:bg-white/60 dark:hover:bg-zinc-800/60 hover:text-zinc-950 dark:hover:text-zinc-100',
                isCollapsed && 'justify-center px-0 h-11 w-11 mx-auto'
              )}
            >
              <Icon className={clsx('shrink-0', isCollapsed ? 'w-5 h-5' : 'w-4 h-4')} />
              {!isCollapsed && (
                <span className="truncate flex-1">{item.name}</span>
              )}
              {!isCollapsed && item.badge && (
                <span
                  className={clsx(
                    'text-[10px] font-bold px-1.5 py-0.5 rounded-md uppercase tracking-wider',
                    isActive
                      ? 'bg-zinc-800 text-zinc-200 dark:bg-zinc-200 dark:text-zinc-900'
                      : 'bg-zinc-200/70 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100'
                  )}
                >
                  {item.badge}
                </span>
              )}
            </NavLink>
          );

          return isCollapsed ? (
            <Tooltip key={item.name} text={item.name} position="right">
              {navButton}
            </Tooltip>
          ) : (
            <div key={item.name}>{navButton}</div>
          );
        })}
      </div>

      {/* Bottom Profile & Settings */}
      <div className="p-3 border-t border-zinc-200/50 dark:border-zinc-800/50 flex flex-col gap-1">
        <div className={clsx('px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-zinc-600 dark:text-zinc-400', isCollapsed && 'hidden')}>
          Account
        </div>
        {bottomNavItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;

          const navButton = (
            <NavLink
              to={item.path}
              className={clsx(
                'flex items-center gap-3 px-3 py-2.5 rounded-2xl text-sm font-medium transition-all duration-150',
                isActive
                  ? 'bg-zinc-950 text-white dark:bg-zinc-100 dark:text-zinc-950 font-semibold shadow-md'
                  : 'text-zinc-600 dark:text-zinc-400 hover:bg-white/60 dark:hover:bg-zinc-800/60 hover:text-zinc-950 dark:hover:text-zinc-100',
                isCollapsed && 'justify-center px-0 h-11 w-11 mx-auto'
              )}
            >
              <Icon className={clsx('shrink-0', isCollapsed ? 'w-5 h-5' : 'w-4 h-4')} />
              {!isCollapsed && <span className="truncate">{item.name}</span>}
            </NavLink>
          );

          return isCollapsed ? (
            <Tooltip key={item.name} text={item.name} position="right">
              {navButton}
            </Tooltip>
          ) : (
            <div key={item.name}>{navButton}</div>
          );
        })}
      </div>
    </aside>
  );
};
