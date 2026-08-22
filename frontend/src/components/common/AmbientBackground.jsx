import React, { useEffect, useState, useRef, useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';

export const AmbientBackground = () => {
  const { theme } = useTheme();
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

  // Determine current page variant for subtle accent curves
  const pageVariant = useMemo(() => {
    const path = location.pathname;
    if (path.includes('explore') || path.includes('activities')) return 'explore';
    if (path.includes('ai-planner') || path.includes('copilot')) return 'ai';
    if (path.includes('budget')) return 'budget';
    if (path.includes('profile')) return 'profile';
    if (path.includes('settings')) return 'settings';
    return 'dashboard';
  }, [location.pathname]);

  // Parallax transform calculation helper
  const getTransform = (speedY = 0.1, driftX = 0, rotateSpeed = 0, scaleBase = 1) => {
    if (isReducedMotion) return `scale(${scaleBase})`;
    const translateY = scrollY * speedY;
    const translateX = scrollY * driftX;
    const rotate = scrollY * rotateSpeed;
    return `translate3d(${translateX}px, ${translateY}px, 0px) rotate(${rotate}deg) scale(${scaleBase})`;
  };

  const isLight = theme === 'light';

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
          <div className="absolute inset-0 bg-[#f0f2f5]" />

          {/* OBJECT 1: Clearly Visible Large Frosted Globe (Top-Right / Edge Placement) */}
          <div
            className="absolute -top-20 -right-20 sm:-top-28 sm:-right-28 w-[360px] sm:w-[540px] h-[360px] sm:h-[540px] rounded-full will-change-transform animate-ambient-1"
            style={{
              transform: getTransform(-0.09, -0.02, 0.015, 1),
              background: 'radial-gradient(circle at 35% 30%, #ffffff 0%, #dde3ec 45%, #b9c3d4 80%, #9ba8bc 100%)',
              boxShadow: '0 35px 90px -15px rgba(100, 120, 150, 0.35), inset 0 2px 4px rgba(255, 255, 255, 1), inset 0 -12px 24px rgba(90, 110, 140, 0.4)'
            }}
          >
            {/* Crisp Slate Latitude/Longitude wireframe contours */}
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

          {/* OBJECT 4: Discrete Route Trajectory Arcs (Layer 3) */}
          {pageVariant === 'dashboard' && (
            <svg
              className="absolute top-[28%] left-[20%] w-[500px] h-[300px] will-change-transform"
              style={{ transform: getTransform(0.06, 0, 0) }}
              viewBox="0 0 500 300"
            >
              <path
                d="M 30 220 C 150 30, 340 50, 480 180"
                fill="none"
                stroke="#18181b"
                strokeWidth="2"
                strokeDasharray="8 8"
                opacity="0.45"
              />
              <circle cx="30" cy="220" r="5" fill="#09090b" opacity="0.6" />
              <circle cx="245" cy="85" r="6" fill="#09090b" opacity="0.7" />
              <circle cx="480" cy="180" r="5" fill="#09090b" opacity="0.6" />
            </svg>
          )}

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

          {/* OBJECT 1: Dark Obsidian Orb with Specular Chrome Edge (Distant Layer 2) */}
          <div
            className="absolute -top-28 -right-28 w-[400px] sm:w-[560px] h-[400px] sm:h-[560px] rounded-full opacity-75 will-change-transform animate-ambient-1"
            style={{
              transform: getTransform(-0.09, -0.03, 0.02, 1),
              background: 'radial-gradient(circle at 35% 28%, #282c38 0%, #151821 45%, #0d0f15 80%, #06070a 100%)',
              boxShadow: '0 40px 100px -20px rgba(0, 0, 0, 0.95), inset 0 2px 3px rgba(255, 255, 255, 0.35), inset 0 -12px 28px rgba(0, 0, 0, 0.8)'
            }}
          >
            {/* Luminous Space Route Wireframe */}
            <svg className="w-full h-full opacity-20 p-10" viewBox="0 0 200 200">
              <circle cx="100" cy="100" r="88" fill="none" stroke="#f4f4f6" strokeWidth="0.75" />
              <ellipse cx="100" cy="100" rx="88" ry="40" fill="none" stroke="#f4f4f6" strokeWidth="0.75" />
              <ellipse cx="100" cy="100" rx="40" ry="88" fill="none" stroke="#f4f4f6" strokeWidth="0.75" />
              <line x1="12" y1="100" x2="188" y2="100" stroke="#f4f4f6" strokeWidth="0.75" strokeDasharray="4 4" />
            </svg>
          </div>

          {/* OBJECT 2: Metallic Chrome Sphere with Luminous Rim (Mid Layer 3) */}
          <div
            className="absolute top-[46%] -left-20 w-52 sm:w-72 h-52 sm:h-72 rounded-full opacity-65 will-change-transform animate-ambient-2"
            style={{
              transform: getTransform(0.18, 0.04, -0.03, 1),
              background: 'radial-gradient(circle at 30% 25%, #4a5266 0%, #20242f 45%, #101218 80%, #07080b 100%)',
              boxShadow: '0 30px 80px -15px rgba(0, 0, 0, 0.9), inset 0 2px 2px rgba(255, 255, 255, 0.4), inset 0 -6px 16px rgba(0, 0, 0, 0.7)'
            }}
          />

          {/* OBJECT 3: Luminous Golden Orbit Ring (Layer 3) */}
          <div
            className="absolute top-[60%] right-[12%] w-64 sm:w-88 h-64 sm:h-88 rounded-full opacity-25 will-change-transform animate-ambient-orbit"
            style={{
              transform: getTransform(-0.16, 0.04, 0.06, 1),
              border: '2px solid rgba(245, 158, 11, 0.5)',
              boxShadow: '0 0 35px rgba(245, 158, 11, 0.15), inset 0 0 20px rgba(245, 158, 11, 0.1)'
            }}
          />

          {/* OBJECT 4: Page-Specific Midnight Accents (Layer 4) */}
          {pageVariant === 'dashboard' && (
            <svg
              className="absolute top-[26%] left-[22%] w-[520px] h-[320px] opacity-30 will-change-transform"
              style={{ transform: getTransform(0.08, 0, 0) }}
              viewBox="0 0 520 320"
            >
              <path
                d="M 30 240 Q 240 20, 480 200"
                fill="none"
                stroke="#f4f4f6"
                strokeWidth="1.5"
                strokeDasharray="8 8"
              />
              <circle cx="30" cy="240" r="4.5" fill="#f4f4f6" />
              <circle cx="240" cy="98" r="5" fill="#38bdf8" />
              <circle cx="480" cy="200" r="4.5" fill="#f4f4f6" />
            </svg>
          )}

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
