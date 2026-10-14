import React from 'react';

const GOLD = '#c5a059';
const GOLD_DARK = '#8f6e2b';
const MAROON = '#8c1d2c';

// Small outline lotus used as an icon.
export const LotusMark: React.FC<{ className?: string }> = ({ className }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" className={className} aria-hidden="true">
    <path d="M12 5c-2 2.5-2 6 0 9 2-3 2-6.5 0-9Z" />
    <path d="M12 14c-1.5-3-4-4.5-7-4.5.3 3 2.8 4.8 7 4.5Z" />
    <path d="M12 14c1.5-3 4-4.5 7-4.5-.3 3-2.8 4.8-7 4.5Z" />
    <path d="M4 15.5c2.5 1.5 5.2 2 8 2s5.5-.5 8-2" />
    <path d="M7 18.5h10" />
  </svg>
);

// Brass temple lamp hanging from a chain, for the header edges.
export const HangingLamp: React.FC<{ className?: string }> = ({ className }) => (
  <svg viewBox="0 0 40 150" className={className} aria-hidden="true">
    {/* chain */}
    {Array.from({ length: 9 }).map((_, i) => (
      <ellipse key={i} cx="20" cy={4 + i * 8} rx="2.4" ry="4" fill="none" stroke={GOLD} strokeWidth="1.5" />
    ))}
    <circle cx="20" cy="30" r="2.8" fill={MAROON} />
    <circle cx="20" cy="62" r="2.8" fill={MAROON} />
    {/* bell-shaped canopy */}
    <path d="M13 86 Q14 74 20 72 Q26 74 27 86 Z" fill={GOLD} stroke={GOLD_DARK} strokeWidth="0.9" />
    <rect x="11" y="85" width="18" height="3.5" rx="1.5" fill={GOLD_DARK} />
    <circle cx="20" cy="71" r="2" fill={GOLD_DARK} />
    {/* flame */}
    <path d="M20 106 Q14 98 20 89 Q26 98 20 106 Z" fill="#f2a33a" />
    <path d="M20 104 Q17.5 99 20 94 Q22.5 99 20 104 Z" fill="#ffe08a" />
    {/* diya bowl */}
    <path d="M3 106 H37 Q35 121 20 123 Q5 121 3 106 Z" fill={GOLD} stroke={GOLD_DARK} strokeWidth="0.9" />
    <path d="M6 110 Q20 115 34 110" stroke={GOLD_DARK} strokeWidth="0.8" fill="none" />
    {/* stem + base */}
    <path d="M16 123 H24 L22.5 130 H17.5 Z" fill={GOLD_DARK} />
    <path d="M10 130 H30 Q28 137 20 137 Q12 137 10 130 Z" fill={GOLD} stroke={GOLD_DARK} strokeWidth="0.9" />
    {/* drop bead */}
    <path d="M20 137 V141" stroke={GOLD} strokeWidth="1.2" />
    <circle cx="20" cy="144.5" r="3.2" fill={MAROON} stroke={GOLD} strokeWidth="0.8" />
  </svg>
);
