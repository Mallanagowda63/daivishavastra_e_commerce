import React, { useEffect, useMemo, useRef, useState } from 'react';

const SEEN_KEY = 'daivisha_launch_seen';
const PREVIEW_KEY = 'daivisha_preview';
/** The store opens to the public at this moment (India time). Before it, visitors see the launch countdown. */
const LAUNCH_AT = new Date('2026-10-21T17:45:00+05:30').getTime();
const COUNT_FROM = 3;
const COUNT_START_MS = 900; // after launch: logo and "the wait is almost over" first
const PARTY_HOLD_MS = 4200; // celebration before the store opens by itself

const GOLD = ['#f3dfae', '#e8cf92', '#d4af37', '#b8924a'];
const CONFETTI = [...GOLD, '#8a1538', '#c2185b', '#f48fb1', '#fffaf3', '#2e7d32'];
const BALLOONS = ['#8a1538', '#d4af37', '#c2185b', '#f3dfae', '#6b1a2b', '#e8cf92', '#f06292', '#b8924a'];

const session = {
  get: (k: string) => {
    try {
      return sessionStorage.getItem(k);
    } catch {
      return null; // storage blocked
    }
  },
  set: (k: string) => {
    try {
      sessionStorage.setItem(k, '1');
    } catch {
      // storage blocked: the screen simply shows again next visit
    }
  },
};

/** "?preview" lets the owner see the store before launch (remembered for this visit). */
const isPreview = () => {
  if (new URLSearchParams(window.location.search).has('preview')) session.set(PREVIEW_KEY);
  return !!session.get(PREVIEW_KEY);
};

/**
 * Before launch: always, for everyone but admin and preview. After launch: once per visit,
 * and not for people who ask for reduced motion.
 */
const shouldShow = () => {
  if (typeof window === 'undefined' || window.location.pathname.startsWith('/admin')) return false;
  if (Date.now() < LAUNCH_AT) return !isPreview();
  if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return false;
  if (session.get(SEEN_KEY)) return false;
  session.set(SEEN_KEY);
  return true;
};

const pad = (n: number) => String(n).padStart(2, '0');

/** Seeded random so balloons look the same on every render. */
const rand = (seed: number) => {
  const x = Math.sin(seed * 999) * 10000;
  return x - Math.floor(x);
};

/** Confetti on a canvas: bursts from both bottom corners and the centre, then falls with a flutter. */
const Confetti: React.FC = () => {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = ref.current!;
    const ctx = canvas.getContext('2d')!;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const resize = () => {
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener('resize', resize);
    const W = () => window.innerWidth;
    const H = () => window.innerHeight;
    type P = { x: number; y: number; vx: number; vy: number; r: number; vr: number; w: number; h: number; c: string; round: boolean };
    const parts: P[] = [];
    const burst = (x: number, y: number, n: number, angle: number, spread: number, speed: number) => {
      for (let i = 0; i < n; i++) {
        const a = angle + (Math.random() - 0.5) * spread;
        const s = speed * (0.55 + Math.random() * 0.6);
        parts.push({
          x, y, vx: Math.cos(a) * s, vy: Math.sin(a) * s, r: Math.random() * Math.PI, vr: (Math.random() - 0.5) * 0.3,
          w: 6 + Math.random() * 6, h: 3 + Math.random() * 4, c: CONFETTI[(Math.random() * CONFETTI.length) | 0], round: Math.random() < 0.25,
        });
      }
    };
    const scale = Math.min(1, W() / 900) * 0.4 + 0.6;
    burst(0, H(), 140, -Math.PI / 3, 0.7, 22 * scale);
    burst(W(), H(), 140, (-2 * Math.PI) / 3, 0.7, 22 * scale);
    burst(W() / 2, H() * 0.42, 120, -Math.PI / 2, Math.PI * 2, 13 * scale);
    // a second, softer wave from the top
    const later = setTimeout(() => {
      for (let i = 0; i < 90; i++) burst(Math.random() * W(), -20, 1, Math.PI / 2, 0.4, 3);
    }, 900);

    let raf = 0;
    const tick = () => {
      ctx.clearRect(0, 0, W(), H());
      for (const p of parts) {
        p.vy += 0.32;
        p.vx *= 0.985;
        p.vy *= 0.985;
        p.x += p.vx + Math.sin((p.y + p.r * 40) / 40) * 0.6;
        p.y += p.vy;
        p.r += p.vr;
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.r);
        ctx.fillStyle = p.c;
        if (p.round) {
          ctx.beginPath();
          ctx.arc(0, 0, p.h, 0, Math.PI * 2);
          ctx.fill();
        } else {
          ctx.scale(1, Math.cos(p.r * 2));
          ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
        }
        ctx.restore();
      }
      for (let i = parts.length - 1; i >= 0; i--) if (parts[i].y > H() + 40) parts.splice(i, 1);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(later);
      window.removeEventListener('resize', resize);
    };
  }, []);
  return <canvas ref={ref} className="absolute inset-0 w-full h-full pointer-events-none" />;
};

/** One balloon with a shine, knot and swaying string. */
const Balloon: React.FC<{ color: string; size: number }> = ({ color, size }) => (
  <svg width={size} height={size * 2.1} viewBox="0 0 50 105" aria-hidden="true">
    <defs>
      <radialGradient id={`b${color.slice(1)}`} cx="35%" cy="30%" r="75%">
        <stop offset="0%" stopColor="#ffffff" stopOpacity="0.55" />
        <stop offset="25%" stopColor={color} />
        <stop offset="100%" stopColor={color} stopOpacity="0.85" />
      </radialGradient>
    </defs>
    <path d="M25 2C12 2 3 13 3 26c0 15 12 27 22 31 10-4 22-16 22-31C47 13 38 2 25 2z" fill={`url(#b${color.slice(1)})`} />
    <path d="M22 57l3 5 3-5z" fill={color} />
    <path d="M25 62c-5 8 5 14 0 22s5 14 0 21" fill="none" stroke="#e8cf92" strokeWidth="0.9" />
  </svg>
);

/**
 * Launch party: the logo and "the wait is almost over", a 3-2-1 countdown in a gold ring,
 * then "We are live!" with balloons rising and confetti bursting. The maroon screen then
 * parts like a saree pallu to open the store. Tap "Enter the store" or "Skip" any time.
 */
export const LaunchScreen: React.FC = () => {
  const [show, setShow] = useState(shouldShow);
  const [opening, setOpening] = useState(false);
  // Everything counts down to one moment: the launch time, or (after launch) a few seconds from now.
  const [target] = useState(() => Math.max(LAUNCH_AT, Date.now() + COUNT_START_MS + COUNT_FROM * 1000));
  const [now, setNow] = useState(() => Date.now());
  const left = target - now;
  const party = left <= 0;
  const count = !party && left <= COUNT_FROM * 1000 ? Math.ceil(left / 1000) : null;
  const waiting = !party && count === null && target === LAUNCH_AT;

  const balloons = useMemo(
    () =>
      Array.from({ length: 20 }, (_, i) => ({
        left: 2 + rand(i + 1) * 92,
        size: 46 + rand(i + 7) * 38,
        delay: rand(i + 13) * 0.9,
        duration: 3.8 + rand(i + 21) * 1.8,
        sway: 2.2 + rand(i + 31) * 1.6,
        color: BALLOONS[i % BALLOONS.length],
      })),
    [],
  );

  useEffect(() => {
    if (!show) return;
    document.documentElement.style.overflow = 'hidden';
    const tick = setInterval(() => setNow(Date.now()), 100);
    return () => {
      clearInterval(tick);
      document.documentElement.style.overflow = '';
    };
  }, [show]);

  useEffect(() => {
    if (!party) return;
    session.set(SEEN_KEY);
    const t = setTimeout(() => setOpening(true), PARTY_HOLD_MS);
    return () => clearTimeout(t);
  }, [party]);

  useEffect(() => {
    if (!opening) return;
    const t = setTimeout(() => setShow(false), 1100);
    return () => clearTimeout(t);
  }, [opening]);

  if (!show) return null;

  const enter = () => setOpening(true);

  return (
    <div className="fixed inset-0 z-[9999] select-none overflow-hidden" role="dialog" aria-label="Daivisha Vastra launch">
      <style>{`
        @keyframes dvFade { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: none; } }
        @keyframes dvNum { 0% { opacity: 0; transform: scale(2.2); filter: blur(8px); } 25% { opacity: 1; transform: scale(1); filter: none; }
                           80% { opacity: 1; transform: scale(.92); } 100% { opacity: 0; transform: scale(.6); } }
        @keyframes dvRing { from { stroke-dashoffset: 0; } to { stroke-dashoffset: 1; } }
        @keyframes dvPulse { 0% { transform: scale(.6); opacity: .9; } 100% { transform: scale(2.4); opacity: 0; } }
        @keyframes dvPop { 0% { opacity: 0; transform: scale(.3); } 60% { opacity: 1; transform: scale(1.12); } 100% { transform: scale(1); } }
        @keyframes dvRise { from { transform: translateY(0); } to { transform: translateY(calc(-100vh - 260px)); } }
        @keyframes dvSway { 0%,100% { transform: translateX(-14px) rotate(-5deg); } 50% { transform: translateX(14px) rotate(5deg); } }
        @keyframes dvShine { from { background-position: -200% 0; } to { background-position: 200% 0; } }
        @keyframes dvRays { to { transform: rotate(360deg); } }
      `}</style>

      {/* Curtain halves (maroon silk with a gold zari edge) that part at the end */}
      {(['left', 'right'] as const).map((side) => (
        <div
          key={side}
          className={`absolute top-0 bottom-0 w-1/2 ${side === 'left' ? 'left-0' : 'right-0'}`}
          style={{
            background: `radial-gradient(ellipse at ${side === 'left' ? '100%' : '0%'} 45%, #7a1a30 0%, #4a0f1a 55%, #2a070e 100%)`,
            transform: opening ? `translateX(${side === 'left' ? '-100%' : '100%'})` : 'none',
            transition: 'transform 1.05s cubic-bezier(.77,0,.18,1)',
          }}
        >
          <div className="absolute inset-0 opacity-[0.07]" style={{ background: 'repeating-linear-gradient(100deg,#f3dfae 0 1px,transparent 1px 9px)' }} />
          <div
            className={`absolute top-0 bottom-0 ${side === 'left' ? 'right-0' : 'left-0'} w-5 sm:w-7`}
            style={{
              background: 'linear-gradient(90deg,#8a6428,#e8cf92 18%,#b8924a 32%,#f3dfae 50%,#b8924a 68%,#e8cf92 82%,#8a6428)',
              opacity: opening ? 1 : 0,
              transition: 'opacity .2s',
            }}
          />
        </div>
      ))}

      <div className="absolute inset-0" style={{ opacity: opening ? 0 : 1, transition: 'opacity .4s ease' }}>
        {/* Golden rays behind the celebration */}
        {party && (
          <div
            className="absolute left-1/2 top-[42%] w-[160vmax] h-[160vmax] -translate-x-1/2 -translate-y-1/2 opacity-[0.1] pointer-events-none"
            style={{ animation: 'dvRays 30s linear infinite' }}
          >
            <div className="w-full h-full" style={{ background: 'repeating-conic-gradient(from 0deg,#f3dfae 0deg 6deg,transparent 6deg 18deg)' }} />
          </div>
        )}

        {/* Balloons */}
        {party &&
          balloons.map((b, i) => (
            <div
              key={i}
              className="absolute bottom-[-240px] pointer-events-none"
              style={{ left: `${b.left}%`, animation: `dvRise ${b.duration}s ${b.delay}s cubic-bezier(.35,.1,.6,1) both` }}
            >
              <div style={{ animation: `dvSway ${b.sway}s ease-in-out infinite` }}>
                <Balloon color={b.color} size={b.size} />
              </div>
            </div>
          ))}

        {party && <Confetti />}

        {/* Centre stage */}
        <div className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center">
          <img
            src="/images/daivisha-logo.webp"
            alt="Daivisha Vastra"
            className={`rounded-full shadow-[0_12px_40px_rgba(0,0,0,.5)] ring-2 ring-[#d4af37]/70 transition-all duration-700 ${
              party ? 'w-40 h-40 sm:w-52 sm:h-52' : 'w-24 h-24 sm:w-28 sm:h-28'
            }`}
            style={{ animation: party ? 'dvPop .8s cubic-bezier(.2,.9,.3,1.3) both' : 'dvFade .7s ease-out both' }}
          />

          {!party && (
            <>
              <p
                className="mt-5 font-serif italic text-lg sm:text-2xl text-[#e8cf92]"
                style={{ animation: 'dvFade .7s .25s ease-out both' }}
              >
                {waiting ? 'Something beautiful is about to begin…' : 'The wait is almost over…'}
              </p>
              {waiting && (
                <div className="mt-6" style={{ animation: 'dvFade .7s .45s ease-out both' }}>
                  <p className="font-sans font-semibold uppercase tracking-[0.35em] text-[11px] sm:text-xs text-[#e8cf92]/90">
                    Grand launch today at 5:45 PM
                  </p>
                  <div className="mt-4 flex items-start justify-center gap-3 sm:gap-5" aria-live="polite">
                    {[
                      [Math.floor(left / 3600000), 'Hours'],
                      [Math.floor(left / 60000) % 60, 'Minutes'],
                      [Math.floor(left / 1000) % 60, 'Seconds'],
                    ].map(([v, label], i) => (
                      <React.Fragment key={label}>
                        {i > 0 && <span className="text-4xl sm:text-6xl leading-none text-[#d4af37]/70" style={{ fontFamily: "'Cinzel', serif" }}>:</span>}
                        <div className="w-[4.6rem] sm:w-28">
                          <div
                            className="py-3 sm:py-4 border border-[#d4af37]/60 bg-[#2a070e]/40 shadow-[inset_0_0_20px_rgba(212,175,55,.15)] text-4xl sm:text-6xl leading-none text-[#f3dfae]"
                            style={{ fontFamily: "'Cinzel', serif" }}
                          >
                            {pad(v as number)}
                          </div>
                          <p className="mt-2 font-sans uppercase tracking-[0.25em] text-[10px] sm:text-[11px] text-[#e8cf92]/80">{label}</p>
                        </div>
                      </React.Fragment>
                    ))}
                  </div>
                  <p className="mt-6 font-serif italic text-base sm:text-lg text-[#e8cf92]/90">Stay on this page — the celebration starts right here.</p>
                </div>
              )}
              <div className={`relative mt-6 w-40 h-40 sm:w-52 sm:h-52 place-items-center ${waiting ? 'hidden' : 'grid'}`}>
                {count !== null && (
                  <>
                    <span key={`p${count}`} className="absolute inset-0 rounded-full border-2 border-[#d4af37]" style={{ animation: 'dvPulse 1s ease-out both' }} />
                    <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full -rotate-90">
                      <circle cx="50" cy="50" r="46" fill="none" stroke="rgba(243,223,174,.18)" strokeWidth="2" />
                      <circle
                        key={`r${count}`}
                        cx="50" cy="50" r="46" fill="none" stroke="#d4af37" strokeWidth="2.5" strokeLinecap="round"
                        pathLength={1} strokeDasharray="1" style={{ animation: 'dvRing 1s linear both' }}
                      />
                    </svg>
                    <span
                      key={`n${count}`}
                      className="text-[5.5rem] sm:text-[7.5rem] leading-none text-[#f3dfae] drop-shadow-[0_0_25px_rgba(212,175,55,.6)]"
                      style={{ fontFamily: "'Cinzel', serif", animation: 'dvNum 1s ease-out both' }}
                    >
                      {count}
                    </span>
                  </>
                )}
              </div>
            </>
          )}

          {party && (
            <>
              <p
                className="mt-6 font-sans font-semibold uppercase tracking-[0.4em] text-xs sm:text-sm text-[#e8cf92]"
                style={{ animation: 'dvFade .6s .3s ease-out both' }}
              >
                ✦ We are live ✦
              </p>
              <h1
                className="mt-2 text-[2rem] sm:text-[3.6rem] leading-tight bg-clip-text text-transparent"
                style={{
                  fontFamily: "'Cinzel', serif",
                  backgroundImage: 'linear-gradient(90deg,#b8924a,#f3dfae,#fff7e0,#f3dfae,#b8924a)',
                  backgroundSize: '200% 100%',
                  animation: 'dvFade .7s .45s ease-out both, dvShine 3s 1s linear infinite',
                }}
              >
                Daivisha Vastra is Open!
              </h1>
              <p className="mt-2 font-serif italic text-base sm:text-xl text-[#e8cf92]" style={{ animation: 'dvFade .7s .7s ease-out both' }}>
                Elegant attire rooted in Indian heritage
              </p>
              <button
                onClick={enter}
                className="mt-7 px-8 py-3.5 bg-gradient-to-r from-[#b8924a] via-[#f3dfae] to-[#b8924a] text-[#4a0f1a] font-sans text-xs sm:text-sm font-bold tracking-[0.25em] uppercase shadow-[0_8px_30px_rgba(212,175,55,.45)] hover:scale-105 transition-transform cursor-pointer"
                style={{ animation: 'dvFade .6s 1s ease-out both' }}
              >
                Enter the store
              </button>
            </>
          )}
        </div>

        <button
          onClick={enter}
          hidden={target === LAUNCH_AT && !party}
          className="absolute top-4 right-4 px-3 py-1.5 text-[11px] uppercase tracking-[0.2em] text-[#e8cf92]/80 hover:text-[#f3dfae] border border-[#e8cf92]/30 rounded-full cursor-pointer"
        >
          Skip
        </button>
      </div>
    </div>
  );
};
