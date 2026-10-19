import React from 'react';
import { MapPin } from 'lucide-react';
import { SareeType } from '../../data/sareeTypes';

const Label: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <p className="font-sans text-[11px] sm:text-xs font-semibold uppercase tracking-[0.2em] text-gold-700">{children}</p>
);

/** "Origin & Heritage" and "Regional Roots" note for one saree type. */
export const SareeHeritage: React.FC<{ type: SareeType; heading?: string; className?: string }> = ({ type, heading, className = '' }) => (
  <div className={`bg-[#fbf3e6] border border-gold-500/40 rounded-xl px-5 sm:px-7 py-5 sm:py-6 ${className}`}>
    {heading && <h3 className="font-serif text-xl sm:text-2xl font-semibold text-burgundy-800 mb-3">{heading}</h3>}
    <Label>Origin &amp; Heritage</Label>
    <p className="mt-1.5 font-serif text-[17px] sm:text-lg leading-relaxed text-stone-700">{type.origin}</p>
    <div className="mt-4">
      <Label>Regional Roots</Label>
      <p className="mt-1.5 flex items-start gap-2 font-serif italic text-[17px] sm:text-lg text-burgundy-800">
        <MapPin className="w-4 h-4 mt-1.5 shrink-0 text-gold-600" strokeWidth={1.75} />
        {type.roots}
      </p>
    </div>
  </div>
);
