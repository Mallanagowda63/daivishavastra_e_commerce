import React, { useEffect, useState } from 'react';

const SEEN_KEY = 'daivisha_launch_seen';
const NAME = 'DAIVISHA VASTRA';
const TOTAL_MS = 3300;

/** Show once per visit, never in admin, and not for people who ask for reduced motion. */
const shouldShow = () => {
  if (typeof window === 'undefined' || window.location.pathname.startsWith('/admin')) return false;
  if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return false;
  try {
    if (sessionStorage.getItem(SEEN_KEY)) return false;
    sessionStorage.setItem(SEEN_KEY, '1');
  } catch {
    // storage blocked: show it, it simply plays again next visit
  }
  return true;
};

/** Gold zari edge running down the inner side of each curtain half. */
const ZariEdge: React.FC<{ side: 'left' | 'right'; visible: boolean }> = ({ side, visible }) => (
  <div
    className={`absolute top-0 bottom-0 ${side === 'left' ? 'right-0' : 'left-0'} w-5 sm:w-7`}
    style={{
      background:
        'linear-gradient(90deg,#8a6428 0%,#e8cf92 18%,#b8924a 32%,#f3dfae 50%,#b8924a 68%,#e8cf92 82%,#8a6428 100%)',
      boxShadow: '0 0 18px rgba(0,0,0,0.35)',
      opacity: visible ? 1 : 0,
      transition: 'opacity .25s ease',
    }}
  >
    <div
      className="absolute inset-y-0 left-1/2 -translate-x-1/2 w-2.5"
      style={{ background: 'repeating-linear-gradient(180deg,#6b1418 0 6px,transparent 6px 14px)', opacity: 0.55 }}
    />
  </div>
);

/**
 * Launch screen: a gold zari ring draws itself, the round logo unfolds from its lotus centre,
 * the name appears letter by letter with a shimmer, then the maroon screen parts like a pallu
 * to reveal the site. About three seconds; tap anywhere to skip.
 */
export const LaunchScreen: React.FC = () => {
  const [show, setShow] = useState(shouldShow);
  const [opening, setOpening] = useState(false);

  useEffect(() => {
    if (!show) return;
    document.documentElement.style.overflow = 'hidden';
    const open = setTimeout(() => setOpening(true), 2250);
    const done = setTimeout(() => setShow(false), TOTAL_MS);
    return () => {
      clearTimeout(open);
      clearTimeout(done);
      document.documentElement.style.overflow = '';
    };
  }, [show]);

  if (!show) return null;

  const skip = () => {
    setOpening(true);
    setTimeout(() => setShow(false), 700);
  };

  return (
    <div className="fixed inset-0 z-[9999] cursor-pointer select-none" onClick={skip} role="presentation" aria-hidden="true">
      <style>{`
        @keyframes dvRing { from { stroke-dashoffset: 1; } to { stroke-dashoffset: 0; } }
        @keyframes dvLogo { 0% { opacity: 0; transform: scale(.55) rotate(-8deg); clip-path: circle(0% at 50% 52%); }
                            60% { opacity: 1; } 100% { opacity: 1; transform: scale(1) rotate(0); clip-path: circle(75% at 50% 52%); } }
        @keyframes dvLetter { from { opacity: 0; transform: translateY(14px); filter: blur(4px); } to { opacity: 1; transform: none; filter: none; } }
        @keyframes dvFade { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: none; } }
        @keyframes dvShine { from { transform: translateX(-120%) skewX(-20deg); } to { transform: translateX(220%) skewX(-20deg); } }
        @keyframes dvGlow { 0%,100% { opacity: .35; } 50% { opacity: .7; } }
      `}</style>

      {/* Curtain halves (maroon silk with a zari edge), parting at the end */}
      {(['left', 'right'] as const).map((side) => (
        <div
          key={side}
          className={`absolute top-0 bottom-0 w-1/2 ${side === 'left' ? 'left-0' : 'right-0'} overflow-hidden`}
          style={{
            background:
              'radial-gradient(ellipse at ' + (side === 'left' ? '100%' : '0%') + ' 50%, #6b1a2b 0%, #4a0f1a 55%, #2e0810 100%)',
            transform: opening ? `translateX(${side === 'left' ? '-100%' : '100%'})` : 'none',
            transition: 'transform 1s cubic-bezier(.77,0,.18,1)',
          }}
        >
          <div
            className="absolute inset-0 opacity-[0.07]"
            style={{ background: 'repeating-linear-gradient(100deg,#f3dfae 0 1px,transparent 1px 9px)' }}
          />
          <ZariEdge side={side} visible={opening} />
        </div>
      ))}

      {/* Centre: ring, logo, name */}
      <div
        className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center"
        style={{ opacity: opening ? 0 : 1, transform: opening ? 'scale(1.08)' : 'none', transition: 'opacity .45s ease, transform .6s ease' }}
      >
        <div className="relative w-52 h-52 sm:w-64 sm:h-64">
          <div
            className="absolute -inset-10 rounded-full"
            style={{ background: 'radial-gradient(circle, rgba(232,207,146,.45) 0%, transparent 65%)', animation: 'dvGlow 2.4s ease-in-out infinite' }}
          />
          <svg viewBox="0 0 100 100" className="absolute -inset-3 w-[calc(100%+1.5rem)] h-[calc(100%+1.5rem)] -rotate-90">
            <circle cx="50" cy="50" r="48" fill="none" stroke="#d9b878" strokeWidth="0.8" pathLength={1}
              strokeDasharray="1" style={{ animation: 'dvRing .7s ease-out both' }} />
            <circle cx="50" cy="50" r="45.5" fill="none" stroke="#b8924a" strokeWidth="0.4" pathLength={1}
              strokeDasharray="1" style={{ animation: 'dvRing .7s .15s ease-out both' }} />
          </svg>
          <img
            src="/images/daivisha-logo.webp"
            alt=""
            className="relative w-full h-full rounded-full shadow-[0_10px_40px_rgba(0,0,0,.45)]"
            style={{ animation: 'dvLogo .9s .55s cubic-bezier(.2,.8,.2,1) both' }}
          />
        </div>

        <p
          className="relative mt-8 overflow-hidden text-[1.7rem] sm:text-[2.6rem] tracking-[0.14em] text-[#f3dfae] whitespace-nowrap"
          style={{ fontFamily: "'Cinzel', serif" }}
        >
          {NAME.split('').map((ch, i) => (
            <span key={i} className="inline-block" style={{ animation: `dvLetter .45s ${1.1 + i * 0.03}s ease-out both` }}>
              {ch === ' ' ? ' ' : ch}
            </span>
          ))}
          <span
            className="absolute inset-y-0 left-0 w-1/3 bg-gradient-to-r from-transparent via-white/35 to-transparent blur-sm"
            style={{ animation: 'dvShine .8s 1.6s ease-in-out both' }}
          />
        </p>
        <p className="mt-2 font-serif italic text-base sm:text-xl text-[#e8cf92]" style={{ animation: 'dvFade .5s 1.45s ease-out both' }}>
          Elegant attire rooted in Indian heritage
        </p>
      </div>
    </div>
  );
};
