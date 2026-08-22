import React, { useEffect, useState, useRef, useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';

export const AmbientBackground = () => {
  const { resolvedTheme } = useTheme();
  const location = useLocation();
  const [scrollY, setScrollY] = useState(0);
  const [isReducedMotion, setIsReducedMotion] = useState(false);
  const rafRef = useRef(null);

  // Check reduced motion
  useEffect(() => {
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setIsReducedMotion(motionQuery.matches);
    const handleMotionChange = (e) => setIsReducedMotion(e.matches);
    motionQuery.addEventListener('change', handleMotionChange);

    return () => {
      motionQuery.removeEventListener('change', handleMotionChange);
    };
  }, []);

  // Optimized passive scroll listener using requestAnimationFrame
  useEffect(() => {
    if (isReducedMotion) return;

    const handleScroll = () => {
      if (rafRef.current) return;
      rafRef.current = requestAnimationFrame(() => {
        const mainContainer = document.querySelector('main');
        const currentScroll = mainContainer ? mainContainer.scrollTop : window.scrollY;
        setScrollY(currentScroll);
        rafRef.current = null;
      });
    };

    const mainContainer = document.querySelector('main');
    if (mainContainer) {
      mainContainer.addEventListener('scroll', handleScroll, { passive: true });
    }
    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      if (mainContainer) {
        mainContainer.removeEventListener('scroll', handleScroll);
      }
      window.removeEventListener('scroll', handleScroll);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [isReducedMotion, location.pathname]);

  // Determine current page variant for route-specific travel accents (ordered specific-to-generic)
  const pageVariant = useMemo(() => {
    const path = location.pathname;
    if (path.includes('explore') || path.includes('activities')) return 'explore';
    if (path.includes('ai-planner') || path.includes('copilot')) return 'ai';
    if (path.includes('collaborate')) return 'collaboration';
    if (path.includes('replanner') || path.includes('optimizer')) return 'ai';
    if (path.includes('budget')) return 'budget';
    if (path.includes('profile')) return 'profile';
    if (path.includes('settings')) return 'settings';
    if (path.includes('timeline')) return 'timeline';
    if (path.includes('calendar')) return 'calendar';
    if (path.includes('trips') && !path.includes('/builder')) return 'mytrips';
    return 'dashboard';
  }, [location.pathname]);

  // Standard 2D parallax transform helper (for base spheres)
  const getTransform = (speedY = 0.1, driftX = 0, rotateSpeed = 0, scaleBase = 1) => {
    if (isReducedMotion) return `scale(${scaleBase})`;
    const translateY = scrollY * speedY;
    const translateX = scrollY * driftX;
    const rotate = scrollY * rotateSpeed;
    return `translate3d(${translateX}px, ${translateY}px, 0px) rotate(${rotate}deg) scale(${scaleBase})`;
  };

  // True 3D depth tilt transform helper (rotateX / rotateY / translateZ clamped to ±8deg)
  const get3DTransform = (speedY = 0.12, driftX = 0.02, rotateZSpeed = 0.01, tiltXSpeed = 0.015, tiltYSpeed = -0.015, depthZ = 0.05, scaleBase = 1) => {
    if (isReducedMotion) return `scale(${scaleBase})`;
    const translateY = scrollY * speedY;
    const translateX = scrollY * driftX;
    const rotateZ = scrollY * rotateZSpeed;
    const rotX = Math.max(-8, Math.min(8, scrollY * tiltXSpeed));
    const rotY = Math.max(-8, Math.min(8, scrollY * tiltYSpeed));
    const transZ = Math.max(-40, Math.min(40, scrollY * depthZ));
    return `translate3d(${translateX}px, ${translateY}px, ${transZ}px) rotateX(${rotX}deg) rotateY(${rotY}deg) rotateZ(${rotateZ}deg) scale(${scaleBase})`;
  };

  const isLight = resolvedTheme === 'light';

  // Dynamic stroke-dashoffset for flight paths driven by scroll
  const flightDashOffset = isReducedMotion ? 0 : -((scrollY * 0.45) % 120);

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 overflow-hidden -z-10 select-none transition-opacity duration-500"
    >
      {/* =========================================================================
          LIGHT THEME: VISIBLE DAYLIGHT / CHROME & ARCHITECTURAL 3D GLASS WORLD
          ========================================================================= */}
      {isLight ? (
        <div className="absolute inset-0 transition-all duration-700 ease-out">
          {/* Subtle Ambient Daylight Base Neutral */}
          <div className="absolute inset-0 bg-[#eff2f6]" />

          {/* OBJECT 1: Large Frosted Globe (Top-Right) */}
          <div
            className="absolute -top-20 -right-20 sm:-top-28 sm:-right-28 w-[360px] sm:w-[540px] h-[360px] sm:h-[540px] rounded-full will-change-transform animate-ambient-1"
            style={{
              transform: getTransform(-0.09, -0.02, 0.015, 1),
              background: 'radial-gradient(circle at 35% 30%, #ffffff 0%, #dde3ec 45%, #b9c3d4 80%, #9ba8bc 100%)',
              boxShadow: '0 35px 90px -15px rgba(100, 120, 150, 0.35), inset 0 2px 4px rgba(255, 255, 255, 1), inset 0 -12px 24px rgba(90, 110, 140, 0.4)'
            }}
          >
            {/* Slate Latitude/Longitude wireframe contours */}
            <svg className="w-full h-full p-8" viewBox="0 0 200 200">
              <ellipse cx="100" cy="100" rx="90" ry="90" fill="none" stroke="#475569" strokeWidth="1.25" opacity="0.4" />
              <ellipse cx="100" cy="100" rx="90" ry="45" fill="none" stroke="#475569" strokeWidth="1.25" opacity="0.35" />
              <ellipse cx="100" cy="100" rx="45" ry="90" fill="none" stroke="#475569" strokeWidth="1.25" opacity="0.35" />
              <line x1="10" y1="100" x2="190" y2="100" stroke="#475569" strokeWidth="1.25" opacity="0.4" />
              <line x1="100" y1="10" x2="100" y2="190" stroke="#475569" strokeWidth="1.25" opacity="0.4" />
            </svg>
          </div>

          {/* OBJECT 2: Metallic Chrome / Silver 3D Sphere (Mid-Left Edge) */}
          <div
            className="absolute top-[40%] -left-16 sm:-left-24 w-48 sm:w-72 h-48 sm:h-72 rounded-full will-change-transform animate-ambient-2"
            style={{
              transform: getTransform(0.16, 0.03, -0.02, 1),
              background: 'radial-gradient(circle at 28% 25%, #ffffff 0%, #e2e8f0 30%, #a0aec0 65%, #4a5568 100%)',
              boxShadow: '0 30px 70px -10px rgba(50, 65, 85, 0.4), inset 0 -10px 20px rgba(30, 41, 59, 0.6), inset 0 8px 16px rgba(255, 255, 255, 1)'
            }}
          />

          {/* OBJECT 3: Floating Translucent Architectural Ring (Bottom-Right) */}
          <div
            className="absolute top-[68%] right-[8%] sm:right-[15%] w-56 sm:w-80 h-56 sm:h-80 rounded-full will-change-transform animate-ambient-orbit"
            style={{
              transform: getTransform(-0.14, 0.04, 0.05, 1),
              border: '22px solid rgba(200, 212, 228, 0.85)',
              boxShadow: '0 25px 60px rgba(80, 100, 130, 0.3), inset 0 3px 6px rgba(255, 255, 255, 0.95), inset 0 -3px 6px rgba(100, 120, 150, 0.4)'
            }}
          />

          {/* OBJECT 4: Paper Airplane / Jet Silhouette with 3D Tilt */}
          <div
            className="absolute top-[18%] left-[12%] sm:left-[22%] w-32 sm:w-44 h-32 sm:h-44 will-change-transform pointer-events-none"
            style={{ perspective: '1000px' }}
          >
            <div
              className="w-full h-full will-change-transform animate-plane-drift"
              style={{
                transform: get3DTransform(0.22, 0.08, -0.02, 0.015, -0.02, 0.08, 1)
              }}
            >
              <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md">
                <path
                  d="M 15 50 L 85 20 L 55 85 L 45 55 Z"
                  fill="url(#light-plane-grad)"
                  stroke="#475569"
                  strokeWidth="1"
                />
                <path
                  d="M 85 20 L 45 55 L 48 42 Z"
                  fill="rgba(255, 255, 255, 0.7)"
                />
                <path
                  d="M 45 55 L 55 85 L 50 62 Z"
                  fill="rgba(100, 116, 139, 0.4)"
                />
                <defs>
                  <linearGradient id="light-plane-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#ffffff" />
                    <stop offset="60%" stopColor="#e2e8f0" />
                    <stop offset="100%" stopColor="#94a3b8" />
                  </linearGradient>
                </defs>
              </svg>
            </div>
          </div>

          {/* OBJECT 5: Compass Rose with Rotating Needle & 3D Tilt */}
          <div
            className="absolute top-[75%] left-[6%] sm:left-[10%] w-36 sm:w-48 h-36 sm:h-48 will-change-transform pointer-events-none"
            style={{ perspective: '1000px' }}
          >
            <div
              className="w-full h-full rounded-full will-change-transform p-3 relative flex items-center justify-center"
              style={{
                transform: get3DTransform(-0.18, 0.03, 0.015, -0.018, 0.015, -0.06, 1),
                background: 'radial-gradient(circle, rgba(255,255,255,0.85) 0%, rgba(226,232,240,0.7) 100%)',
                border: '2px solid rgba(148, 163, 184, 0.5)',
                boxShadow: '0 20px 45px -10px rgba(71, 85, 105, 0.25), inset 0 2px 4px rgba(255,255,255,0.9)'
              }}
            >
              <svg viewBox="0 0 100 100" className="w-full h-full absolute inset-0 p-2">
                <circle cx="50" cy="50" r="42" fill="none" stroke="#64748b" strokeWidth="0.75" strokeDasharray="2 6" />
                <text x="50" y="16" fill="#1e293b" fontSize="8" fontWeight="bold" fontFamily="monospace" textAnchor="middle">N</text>
                <text x="86" y="53" fill="#64748b" fontSize="7" fontWeight="bold" fontFamily="monospace" textAnchor="middle">E</text>
                <text x="50" y="90" fill="#64748b" fontSize="7" fontWeight="bold" fontFamily="monospace" textAnchor="middle">S</text>
                <text x="14" y="53" fill="#64748b" fontSize="7" fontWeight="bold" fontFamily="monospace" textAnchor="middle">W</text>
              </svg>
              <div className="w-6 h-28 will-change-transform animate-compass-needle relative flex flex-col items-center justify-center">
                <div className="w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-b-[38px] border-b-rose-600 drop-shadow-xs" />
                <div className="w-2.5 h-2.5 rounded-full bg-zinc-800 border-2 border-white shadow-xs z-10 -my-1" />
                <div className="w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[38px] border-t-zinc-700 drop-shadow-xs" />
              </div>
            </div>
          </div>

          {/* PAGE-SPECIFIC ACCENT 1: Flight Path Arc (Dashboard, MyTrips, Calendar, Timeline) */}
          {(pageVariant === 'dashboard' || pageVariant === 'mytrips' || pageVariant === 'calendar' || pageVariant === 'timeline') && (
            <svg
              className="absolute top-[28%] left-[18%] w-[520px] h-[300px] will-change-transform"
              style={{ transform: getTransform(0.06, 0, 0) }}
              viewBox="0 0 500 300"
            >
              <path
                d="M 30 220 C 150 30, 340 50, 480 180"
                fill="none"
                stroke="#18181b"
                strokeWidth="2"
                strokeDasharray="8 8"
                strokeDashoffset={flightDashOffset}
                opacity="0.45"
              />
              <circle cx="30" cy="220" r="5" fill="#09090b" className="animate-pulse-subtle" opacity="0.75" />
              <circle cx="245" cy="85" r="6" fill="#09090b" className="animate-pulse-subtle" opacity="0.85" />
              <circle cx="480" cy="180" r="5" fill="#09090b" className="animate-pulse-subtle" opacity="0.75" />
            </svg>
          )}

          {/* PAGE-SPECIFIC ACCENT 2: Boarding Pass / Ticket 3D Card (MyTrips, Settings) */}
          {(pageVariant === 'mytrips' || pageVariant === 'settings') && (
            <div
              className="absolute top-[52%] right-[16%] w-48 sm:w-64 h-28 sm:h-36 rounded-2xl will-change-transform pointer-events-none"
              style={{ perspective: '1000px' }}
            >
              <div
                className="w-full h-full p-4 rounded-2xl border flex items-center justify-between shadow-xl"
                style={{
                  transform: get3DTransform(-0.16, -0.04, 0.03, 0.02, -0.015, 0.08, 1),
                  background: 'linear-gradient(135deg, rgba(255,255,255,0.92) 0%, rgba(226,232,240,0.75) 100%)',
                  borderColor: 'rgba(255,255,255,0.95)',
                  boxShadow: '0 25px 60px -10px rgba(80,100,130,0.3), inset 0 2px 4px rgba(255,255,255,1)'
                }}
              >
                <div className="flex flex-col justify-between h-full text-left">
                  <div>
                    <span className="text-[8px] font-mono uppercase font-bold text-zinc-500 tracking-wider block">BOARDING PASS</span>
                    <span className="text-xs font-black font-mono text-zinc-950">NRT → KYO</span>
                  </div>
                  <div className="text-[8px] font-mono text-zinc-500 font-bold">GATE 14B • SEAT 08A</div>
                </div>
                <div className="h-full border-r border-dashed border-zinc-400 mx-2" />
                <div className="flex gap-0.5 h-10 items-center opacity-60">
                  <div className="w-1 h-8 bg-zinc-900" />
                  <div className="w-0.5 h-6 bg-zinc-900" />
                  <div className="w-1.5 h-10 bg-zinc-900" />
                  <div className="w-0.5 h-7 bg-zinc-900" />
                  <div className="w-1 h-9 bg-zinc-900" />
                  <div className="w-1.5 h-8 bg-zinc-900" />
                </div>
              </div>
            </div>
          )}

          {/* PAGE-SPECIFIC ACCENT 3: 3D Luggage / Suitcase (Budget, Profile) */}
          {(pageVariant === 'budget' || pageVariant === 'profile') && (
            <div
              className="absolute top-[48%] right-[14%] w-40 sm:w-52 h-44 sm:h-56 rounded-3xl will-change-transform pointer-events-none"
              style={{ perspective: '1000px' }}
            >
              <div
                className="w-full h-full rounded-3xl border flex flex-col items-center justify-between p-4 shadow-xl"
                style={{
                  transform: get3DTransform(-0.15, -0.03, -0.02, 0.018, 0.02, 0.06, 1),
                  background: 'linear-gradient(145deg, rgba(255,255,255,0.95) 0%, rgba(203,213,225,0.8) 100%)',
                  borderColor: 'rgba(255,255,255,0.95)',
                  boxShadow: '0 30px 70px -15px rgba(71,85,105,0.3), inset 0 2px 4px white'
                }}
              >
                <div className="w-14 h-6 border-2 border-zinc-700 rounded-t-lg -mt-7 bg-slate-200 shadow-xs" />
                <div className="w-full flex-1 flex flex-col justify-evenly py-2 px-1">
                  <div className="w-full h-1 bg-zinc-300/80 rounded-full" />
                  <div className="w-full h-1 bg-zinc-300/80 rounded-full" />
                  <div className="w-full h-1 bg-zinc-300/80 rounded-full" />
                </div>
                <div className="w-full flex justify-between px-3 -mb-5">
                  <div className="w-3.5 h-3.5 rounded-full bg-zinc-800 border-2 border-white shadow-xs" />
                  <div className="w-3.5 h-3.5 rounded-full bg-zinc-800 border-2 border-white shadow-xs" />
                </div>
              </div>
            </div>
          )}

          {/* PAGE-SPECIFIC ACCENT 4: Collaboration Connected Node Ring */}
          {pageVariant === 'collaboration' && (
            <div
              className="absolute top-[28%] left-[28%] w-80 h-80 rounded-full will-change-transform pointer-events-none"
              style={{ perspective: '1000px' }}
            >
              <div
                className="w-full h-full rounded-full border-2 border-dashed border-slate-400/60 p-4 relative flex items-center justify-center shadow-lg"
                style={{
                  transform: get3DTransform(0.14, -0.03, 0.02, 0.015, -0.015, 0.05, 1),
                  background: 'radial-gradient(circle, rgba(255,255,255,0.6) 0%, rgba(226,232,240,0.3) 100%)'
                }}
              >
                {/* 4 Connected Member Nodes */}
                <div className="absolute top-2 left-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-white border border-slate-400 flex items-center justify-center text-xs shadow-xs animate-pulse-subtle">
                  👨‍💻
                </div>
                <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-white border border-slate-400 flex items-center justify-center text-xs shadow-xs animate-pulse-subtle">
                  👩‍🎨
                </div>
                <div className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white border border-slate-400 flex items-center justify-center text-xs shadow-xs animate-pulse-subtle">
                  🧗
                </div>
                <div className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white border border-slate-400 flex items-center justify-center text-xs shadow-xs animate-pulse-subtle">
                  📸
                </div>
                <div className="w-14 h-14 rounded-2xl bg-zinc-950 text-white flex items-center justify-center text-[10px] font-mono font-bold shadow-md">
                  CREW
                </div>
              </div>
            </div>
          )}

          {/* PAGE-SPECIFIC ACCENT 5: Explore Prism Card */}
          {pageVariant === 'explore' && (
            <div
              className="absolute top-[22%] right-[20%] w-48 h-48 rounded-3xl will-change-transform"
              style={{
                transform: getTransform(-0.18, -0.03, 0.04),
                background: 'linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(186,200,222,0.7) 100%)',
                border: '1.5px solid rgba(255, 255, 255, 0.9)',
                boxShadow: '0 20px 50px rgba(100,120,150,0.3), inset 0 2px 4px white'
              }}
            />
          )}

          {/* PAGE-SPECIFIC ACCENT 6: AI Radar Orb */}
          {pageVariant === 'ai' && (
            <div
              className="absolute top-[32%] left-[34%] w-72 h-72 rounded-full will-change-transform"
              style={{
                transform: getTransform(0.12, 0.05, 0.08),
                border: '2.5px dashed #64748b',
                opacity: 0.5
              }}
            />
          )}
        </div>
      ) : (
        /* =========================================================================
           DARK THEME: MIDNIGHT / SPACE / DEEP SPATIAL GLASS WORLD
           ========================================================================= */
        <div className="absolute inset-0 transition-all duration-700 ease-out">
          {/* Deep Space Midnight Ambient Radial Vignette */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-10%,rgba(20,24,36,0.9),rgba(7,8,10,1))]" />

          {/* OBJECT 1: Dark Obsidian Orb with Specular Chrome Edge */}
          <div
            className="absolute -top-28 -right-28 w-[400px] sm:w-[560px] h-[400px] sm:h-[560px] rounded-full opacity-75 will-change-transform animate-ambient-1"
            style={{
              transform: getTransform(-0.09, -0.03, 0.02, 1),
              background: 'radial-gradient(circle at 35% 28%, #282c38 0%, #151821 45%, #0d0f15 80%, #06070a 100%)',
              boxShadow: '0 40px 100px -20px rgba(0, 0, 0, 0.95), inset 0 2px 3px rgba(255, 255, 255, 0.35), inset 0 -12px 28px rgba(0, 0, 0, 0.8)'
            }}
          >
            <svg className="w-full h-full opacity-20 p-10" viewBox="0 0 200 200">
              <circle cx="100" cy="100" r="88" fill="none" stroke="#f4f4f6" strokeWidth="0.75" />
              <ellipse cx="100" cy="100" rx="88" ry="40" fill="none" stroke="#f4f4f6" strokeWidth="0.75" />
              <ellipse cx="100" cy="100" rx="40" ry="88" fill="none" stroke="#f4f4f6" strokeWidth="0.75" />
              <line x1="12" y1="100" x2="188" y2="100" stroke="#f4f4f6" strokeWidth="0.75" strokeDasharray="4 4" />
            </svg>
          </div>

          {/* OBJECT 2: Metallic Chrome Sphere with Luminous Rim */}
          <div
            className="absolute top-[46%] -left-20 w-52 sm:w-72 h-52 sm:h-72 rounded-full opacity-65 will-change-transform animate-ambient-2"
            style={{
              transform: getTransform(0.18, 0.04, -0.03, 1),
              background: 'radial-gradient(circle at 30% 25%, #4a5266 0%, #20242f 45%, #101218 80%, #07080b 100%)',
              boxShadow: '0 30px 80px -15px rgba(0, 0, 0, 0.9), inset 0 2px 2px rgba(255, 255, 255, 0.4), inset 0 -6px 16px rgba(0, 0, 0, 0.7)'
            }}
          />

          {/* OBJECT 3: Luminous Golden Orbit Ring */}
          <div
            className="absolute top-[60%] right-[12%] w-64 sm:w-88 h-64 sm:h-88 rounded-full opacity-25 will-change-transform animate-ambient-orbit"
            style={{
              transform: getTransform(-0.16, 0.04, 0.06, 1),
              border: '2px solid rgba(245, 158, 11, 0.5)',
              boxShadow: '0 0 35px rgba(245, 158, 11, 0.15), inset 0 0 20px rgba(245, 158, 11, 0.1)'
            }}
          />

          {/* OBJECT 4: Dark Midnight Jet Silhouette with 3D Tilt */}
          <div
            className="absolute top-[18%] left-[12%] sm:left-[22%] w-32 sm:w-44 h-32 sm:h-44 will-change-transform pointer-events-none"
            style={{ perspective: '1000px' }}
          >
            <div
              className="w-full h-full will-change-transform animate-plane-drift opacity-60"
              style={{
                transform: get3DTransform(0.22, 0.08, -0.02, 0.015, -0.02, 0.08, 1)
              }}
            >
              <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-[0_10px_20px_rgba(0,0,0,0.8)]">
                <path
                  d="M 15 50 L 85 20 L 55 85 L 45 55 Z"
                  fill="url(#dark-plane-grad)"
                  stroke="rgba(255,255,255,0.3)"
                  strokeWidth="1"
                />
                <path
                  d="M 85 20 L 45 55 L 48 42 Z"
                  fill="rgba(255, 255, 255, 0.25)"
                />
                <path
                  d="M 45 55 L 55 85 L 50 62 Z"
                  fill="rgba(0, 0, 0, 0.6)"
                />
                <defs>
                  <linearGradient id="dark-plane-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#334155" />
                    <stop offset="50%" stopColor="#1e293b" />
                    <stop offset="100%" stopColor="#0f172a" />
                  </linearGradient>
                </defs>
              </svg>
            </div>
          </div>

          {/* OBJECT 5: Dark Spatial Compass Rose with 3D Tilt */}
          <div
            className="absolute top-[75%] left-[6%] sm:left-[10%] w-36 sm:w-48 h-36 sm:h-48 will-change-transform pointer-events-none opacity-50"
            style={{ perspective: '1000px' }}
          >
            <div
              className="w-full h-full rounded-full will-change-transform p-3 relative flex items-center justify-center"
              style={{
                transform: get3DTransform(-0.18, 0.03, 0.015, -0.018, 0.015, -0.06, 1),
                background: 'radial-gradient(circle, rgba(30,41,59,0.7) 0%, rgba(15,23,42,0.85) 100%)',
                border: '1.5px solid rgba(255, 255, 255, 0.15)',
                boxShadow: '0 25px 60px rgba(0,0,0,0.8), inset 0 1px 2px rgba(255,255,255,0.2)'
              }}
            >
              <svg viewBox="0 0 100 100" className="w-full h-full absolute inset-0 p-2">
                <circle cx="50" cy="50" r="42" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="0.75" strokeDasharray="2 6" />
                <text x="50" y="16" fill="#38bdf8" fontSize="8" fontWeight="bold" fontFamily="monospace" textAnchor="middle">N</text>
                <text x="86" y="53" fill="rgba(255,255,255,0.5)" fontSize="7" fontWeight="bold" fontFamily="monospace" textAnchor="middle">E</text>
                <text x="50" y="90" fill="rgba(255,255,255,0.5)" fontSize="7" fontWeight="bold" fontFamily="monospace" textAnchor="middle">S</text>
                <text x="14" y="53" fill="rgba(255,255,255,0.5)" fontSize="7" fontWeight="bold" fontFamily="monospace" textAnchor="middle">W</text>
              </svg>
              <div className="w-6 h-28 will-change-transform animate-compass-needle relative flex flex-col items-center justify-center">
                <div className="w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-b-[38px] border-b-cyan-500 drop-shadow-[0_0_8px_rgba(6,182,212,0.6)]" />
                <div className="w-2.5 h-2.5 rounded-full bg-white border-2 border-zinc-900 shadow-xs z-10 -my-1" />
                <div className="w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[38px] border-t-zinc-600 drop-shadow-xs" />
              </div>
            </div>
          </div>

          {/* PAGE-SPECIFIC ACCENT 1: Dark Flight Path Arc (Dashboard, MyTrips, Calendar, Timeline) */}
          {(pageVariant === 'dashboard' || pageVariant === 'mytrips' || pageVariant === 'calendar' || pageVariant === 'timeline') && (
            <svg
              className="absolute top-[26%] left-[22%] w-[520px] h-[320px] opacity-35 will-change-transform"
              style={{ transform: getTransform(0.08, 0, 0) }}
              viewBox="0 0 520 320"
            >
              <path
                d="M 30 240 Q 240 20, 480 200"
                fill="none"
                stroke="#f4f4f6"
                strokeWidth="1.5"
                strokeDasharray="8 8"
                strokeDashoffset={flightDashOffset}
              />
              <circle cx="30" cy="240" r="4.5" fill="#f4f4f6" className="animate-pulse-subtle" />
              <circle cx="240" cy="98" r="5" fill="#38bdf8" className="animate-pulse-subtle" />
              <circle cx="480" cy="200" r="4.5" fill="#f4f4f6" className="animate-pulse-subtle" />
            </svg>
          )}

          {/* PAGE-SPECIFIC ACCENT 2: Dark Boarding Pass (MyTrips, Settings) */}
          {(pageVariant === 'mytrips' || pageVariant === 'settings') && (
            <div
              className="absolute top-[52%] right-[16%] w-48 sm:w-64 h-28 sm:h-36 rounded-2xl will-change-transform pointer-events-none opacity-40"
              style={{ perspective: '1000px' }}
            >
              <div
                className="w-full h-full p-4 rounded-2xl border flex items-center justify-between shadow-2xl"
                style={{
                  transform: get3DTransform(-0.16, -0.04, 0.03, 0.02, -0.015, 0.08, 1),
                  background: 'linear-gradient(135deg, rgba(30,41,59,0.8) 0%, rgba(15,23,42,0.9) 100%)',
                  borderColor: 'rgba(255,255,255,0.15)',
                  boxShadow: '0 25px 60px rgba(0,0,0,0.9), inset 0 1px 2px rgba(255,255,255,0.2)'
                }}
              >
                <div className="flex flex-col justify-between h-full text-left">
                  <div>
                    <span className="text-[8px] font-mono uppercase font-bold text-zinc-400 tracking-wider block">VOYAGE PASS</span>
                    <span className="text-xs font-black font-mono text-zinc-100">NRT → KYO</span>
                  </div>
                  <div className="text-[8px] font-mono text-zinc-400 font-bold">GATE 14B • SEAT 08A</div>
                </div>
                <div className="h-full border-r border-dashed border-zinc-600 mx-2" />
                <div className="flex gap-0.5 h-10 items-center opacity-50">
                  <div className="w-1 h-8 bg-zinc-300" />
                  <div className="w-0.5 h-6 bg-zinc-300" />
                  <div className="w-1.5 h-10 bg-zinc-300" />
                  <div className="w-0.5 h-7 bg-zinc-300" />
                  <div className="w-1 h-9 bg-zinc-300" />
                  <div className="w-1.5 h-8 bg-zinc-300" />
                </div>
              </div>
            </div>
          )}

          {/* PAGE-SPECIFIC ACCENT 3: Dark 3D Luggage (Budget, Profile) */}
          {(pageVariant === 'budget' || pageVariant === 'profile') && (
            <div
              className="absolute top-[48%] right-[14%] w-40 sm:w-52 h-44 sm:h-56 rounded-3xl will-change-transform pointer-events-none opacity-40"
              style={{ perspective: '1000px' }}
            >
              <div
                className="w-full h-full rounded-3xl border flex flex-col items-center justify-between p-4 shadow-2xl"
                style={{
                  transform: get3DTransform(-0.15, -0.03, -0.02, 0.018, 0.02, 0.06, 1),
                  background: 'linear-gradient(145deg, rgba(30,41,59,0.85) 0%, rgba(15,23,42,0.95) 100%)',
                  borderColor: 'rgba(255,255,255,0.15)',
                  boxShadow: '0 30px 70px rgba(0,0,0,0.9), inset 0 1px 2px rgba(255,255,255,0.2)'
                }}
              >
                <div className="w-14 h-6 border-2 border-zinc-500 rounded-t-lg -mt-7 bg-zinc-800" />
                <div className="w-full flex-1 flex flex-col justify-evenly py-2 px-1">
                  <div className="w-full h-1 bg-zinc-700/80 rounded-full" />
                  <div className="w-full h-1 bg-zinc-700/80 rounded-full" />
                  <div className="w-full h-1 bg-zinc-700/80 rounded-full" />
                </div>
                <div className="w-full flex justify-between px-3 -mb-5">
                  <div className="w-3.5 h-3.5 rounded-full bg-zinc-950 border border-zinc-600" />
                  <div className="w-3.5 h-3.5 rounded-full bg-zinc-950 border border-zinc-600" />
                </div>
              </div>
            </div>
          )}

          {/* PAGE-SPECIFIC ACCENT 4: Dark Collaboration Connected Node Ring */}
          {pageVariant === 'collaboration' && (
            <div
              className="absolute top-[28%] left-[28%] w-80 h-80 rounded-full will-change-transform pointer-events-none opacity-40"
              style={{ perspective: '1000px' }}
            >
              <div
                className="w-full h-full rounded-full border-2 border-dashed border-cyan-500/50 p-4 relative flex items-center justify-center shadow-[0_0_50px_rgba(6,182,212,0.2)]"
                style={{
                  transform: get3DTransform(0.14, -0.03, 0.02, 0.015, -0.015, 0.05, 1),
                  background: 'radial-gradient(circle, rgba(15,23,42,0.8) 0%, rgba(7,10,18,0.4) 100%)'
                }}
              >
                <div className="absolute top-2 left-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-zinc-900 border border-cyan-400 flex items-center justify-center text-xs shadow-xs animate-pulse-subtle">
                  👨‍💻
                </div>
                <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-zinc-900 border border-cyan-400 flex items-center justify-center text-xs shadow-xs animate-pulse-subtle">
                  👩‍🎨
                </div>
                <div className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-zinc-900 border border-cyan-400 flex items-center justify-center text-xs shadow-xs animate-pulse-subtle">
                  🧗
                </div>
                <div className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-zinc-900 border border-cyan-400 flex items-center justify-center text-xs shadow-xs animate-pulse-subtle">
                  📸
                </div>
                <div className="w-14 h-14 rounded-2xl bg-cyan-950 border border-cyan-400 text-cyan-200 flex items-center justify-center text-[10px] font-mono font-bold shadow-md">
                  CREW
                </div>
              </div>
            </div>
          )}

          {/* PAGE-SPECIFIC ACCENT 5: Explore Spatial Prism */}
          {pageVariant === 'explore' && (
            <div
              className="absolute top-[22%] right-[24%] w-48 h-48 rounded-3xl opacity-20 will-change-transform"
              style={{
                transform: getTransform(-0.2, -0.04, 0.05),
                background: 'linear-gradient(135deg, rgba(56, 189, 248, 0.2) 0%, rgba(20, 24, 36, 0.8) 100%)',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                boxShadow: '0 20px 60px rgba(0,0,0,0.8)'
              }}
            />
          )}

          {/* PAGE-SPECIFIC ACCENT 6: AI Purple Radar */}
          {pageVariant === 'ai' && (
            <div
              className="absolute top-[32%] left-[36%] w-72 h-72 rounded-full opacity-20 will-change-transform"
              style={{
                transform: getTransform(0.14, 0.06, 0.1),
                border: '2px dashed rgba(168, 85, 247, 0.6)',
                boxShadow: '0 0 40px rgba(168, 85, 247, 0.15)'
              }}
            />
          )}
        </div>
      )}
    </div>
  );
};
