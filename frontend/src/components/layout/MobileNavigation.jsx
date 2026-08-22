import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { LayoutDashboard, Plane, Sparkles, Compass, User } from 'lucide-react';
import { clsx } from 'clsx';

export const MobileNavigation = () => {
  const location = useLocation();

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Trips', path: '/trips', icon: Plane },
    { name: 'AI Plan', path: '/ai-planner', icon: Sparkles },
    { name: 'Explore', path: '/explore', icon: Compass },
    { name: 'Profile', path: '/profile', icon: User }
  ];

  return (
    <nav className="glass-floating md:hidden fixed bottom-3 left-4 right-4 z-40 rounded-3xl border shadow-2xl px-2 py-1.5 flex items-center justify-around">
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = location.pathname === item.path;

        return (
          <NavLink
            key={item.name}
            to={item.path}
            className={clsx(
              'flex flex-col items-center justify-center py-2 px-3 rounded-2xl transition-all',
              isActive
                ? 'bg-zinc-950 text-white dark:bg-zinc-100 dark:text-zinc-950 font-bold shadow-sm'
                : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-zinc-100'
            )}
          >
            <Icon className="w-5 h-5 mb-0.5" />
            <span className="text-[10px] tracking-tight">{item.name}</span>
          </NavLink>
        );
      })}
    </nav>
  );
};
