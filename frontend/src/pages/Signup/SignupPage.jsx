import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Input } from '../../components/common/Input';
import { Button } from '../../components/common/Button';
import { useAuth } from '../../context/AuthContext';
import { Mail, Lock, User } from 'lucide-react';

export const SignupPage = () => {
  const [name, setName] = useState('Nakul Sharma');
  const [email, setEmail] = useState('nakul@globetrotter.io');
  const [password, setPassword] = useState('password123');
  const { signup, loginWithGoogle, isLoading } = useAuth();
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    await signup({ name, email });
    navigate('/dashboard');
  };

  const handleGoogleSignIn = async () => {
    await loginWithGoogle();
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-12 text-zinc-950 dark:text-zinc-50 relative">
      <div className="lg:col-span-6 flex flex-col justify-between p-8 sm:p-16 lg:p-20 text-left glass-primary z-10 border-r">
        <NavLink to="/" className="flex items-center gap-2.5 group w-fit">
          <div className="w-10 h-10 rounded-2xl bg-zinc-950 dark:bg-zinc-100 text-white dark:text-zinc-950 flex items-center justify-center font-black text-lg shadow-sm group-hover:scale-105 transition-transform">
            G
          </div>
          <span className="font-black text-lg tracking-tight uppercase text-zinc-950 dark:text-zinc-50">GLOBETROTTER</span>
        </NavLink>

        <div className="max-w-md w-full my-auto py-12">
          <div className="mb-8">
            <span className="text-[10px] font-mono uppercase font-bold tracking-widest text-zinc-600 dark:text-zinc-400">
              GET STARTED FREE
            </span>
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight uppercase text-zinc-950 dark:text-zinc-50 mt-1">
              CREATE YOUR ACCOUNT.
            </h1>
            <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-2 font-medium">
              Start crafting seamless multi-destination travel journeys.
            </p>
          </div>

          <form onSubmit={handleSignup} className="space-y-4">
            <Input
              id="name"
              label="Full Name"
              placeholder="Nakul Sharma"
              icon={User}
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />

            <Input
              id="email"
              label="Email"
              type="email"
              placeholder="nakul@globetrotter.io"
              icon={Mail}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <Input
              id="password"
              label="Password"
              type="password"
              placeholder="••••••••"
              icon={Lock}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <Button
              type="submit"
              variant="primary"
              size="lg"
              loading={isLoading}
              className="w-full font-black text-xs uppercase tracking-wider h-12 shadow-md"
            >
              CREATE ACCOUNT
            </Button>
          </form>

          <div className="relative my-8 flex items-center justify-center">
            <div className="w-full border-t border-zinc-200/60 dark:border-zinc-800" />
            <span className="absolute glass-secondary border px-3 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase tracking-widest text-zinc-600 dark:text-zinc-400">
              OR CONTINUE WITH
            </span>
          </div>

          <button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-3 px-4 py-3 border glass-secondary hover:border-zinc-400 rounded-2xl text-xs font-bold text-zinc-900 dark:text-zinc-100 transition-all shadow-xs active:scale-[0.99]"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z" />
              <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z" />
              <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.98 0 12s.45 3.82 1.25 5.42l4.03-3.15z" />
              <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z" />
            </svg>
            <span>Continue with Google</span>
          </button>

          <div className="mt-8 text-center text-xs font-semibold text-zinc-600 dark:text-zinc-400">
            <span>Already have an account? </span>
            <NavLink to="/login" className="text-zinc-950 dark:text-zinc-50 font-bold hover:underline">
              Sign in
            </NavLink>
          </div>
        </div>

        <div className="text-[11px] text-zinc-600 dark:text-zinc-400 font-medium">
          GlobeTrotter Multi-City Platform
        </div>
      </div>

      <div className="hidden lg:flex lg:col-span-6 bg-zinc-950 text-white p-16 flex-col justify-between relative overflow-hidden">
        <div className="relative z-10 text-left">
          <span className="text-xs font-mono font-bold tracking-widest text-zinc-600 dark:text-zinc-400 uppercase">
            GLOBETROTTER VISUAL ENGINE
          </span>
          <h2 className="text-4xl sm:text-5xl font-black uppercase tracking-tight leading-tight mt-2">
            YOUR JOURNEY,
            <br />
            VISUALIZED.
          </h2>
        </div>

        <div className="relative z-10 my-auto py-12 flex items-center justify-center">
          <div className="relative w-full max-w-sm flex flex-col items-center">
            <svg viewBox="0 0 320 260" className="w-full">
              <line x1="60" y1="40" x2="160" y2="130" stroke="white" strokeWidth="2" strokeDasharray="4 4" className="animate-dash-move" />
              <line x1="160" y1="130" x2="260" y2="220" stroke="white" strokeWidth="2" strokeDasharray="4 4" className="animate-dash-move" />
              <circle cx="60" cy="40" r="7" fill="#ffffff" />
              <text x="60" y="18" fill="#ffffff" fontSize="12" fontWeight="bold" textAnchor="middle" fontFamily="monospace">TOKYO</text>
              <circle cx="160" cy="130" r="7" fill="#ffffff" />
              <text x="160" y="108" fill="#ffffff" fontSize="12" fontWeight="bold" textAnchor="middle" fontFamily="monospace">KYOTO</text>
              <circle cx="260" cy="220" r="7" fill="#ffffff" />
              <text x="260" y="248" fill="#ffffff" fontSize="12" fontWeight="bold" textAnchor="middle" fontFamily="monospace">OSAKA</text>
            </svg>
          </div>
        </div>

        <div className="relative z-10 text-left text-xs font-mono text-zinc-600 dark:text-zinc-400">
          Seamless multi-city transit • Real-time AI replanning • High-speed routes
        </div>
      </div>
    </div>
  );
};
