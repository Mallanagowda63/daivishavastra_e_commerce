import React from 'react';
import { LotusMark } from '../layout/BrandEmblem';

/** Gold rule with a lotus in the middle. */
export const LotusDivider: React.FC<{ className?: string }> = ({ className = '' }) => (
  <div className={`flex items-center justify-center gap-2 text-gold-600 ${className}`} aria-hidden="true">
    <span className="h-px w-16 sm:w-24 bg-gradient-to-r from-transparent to-gold-500" />
    <LotusMark className="w-5 h-5" />
    <span className="h-px w-16 sm:w-24 bg-gradient-to-l from-transparent to-gold-500" />
  </div>
);

/** Small uppercase label, title, lotus rule and italic subtitle, centred. */
export const SectionHeading: React.FC<{ kicker?: string; title: string; subtitle?: string; as?: 'h1' | 'h2' }> = ({
  kicker,
  title,
  subtitle,
  as: Tag = 'h2',
}) => (
  <header className="text-center">
    {kicker && <p className="font-sans text-xs sm:text-sm font-semibold uppercase tracking-[0.25em] text-gold-700">{kicker}</p>}
    <Tag className="mt-2 font-serif text-3xl sm:text-4xl lg:text-[2.75rem] font-medium text-burgundy-800 leading-tight">{title}</Tag>
    <LotusDivider className="mt-3" />
    {subtitle && <p className="mt-3 font-serif italic text-lg sm:text-xl text-gold-700">{subtitle}</p>}
  </header>
);

/** Cream card with a small-caps heading and one line of text. */
export const InfoCard: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <div className="bg-[#f6ead7] border border-gold-500/40 rounded-xl px-5 sm:px-6 py-4 sm:py-5">
    <h3 className="font-serif text-lg sm:text-xl font-semibold uppercase tracking-[0.04em] text-burgundy-800">{title}</h3>
    <p className="mt-1 font-serif text-base sm:text-[17px] leading-relaxed text-stone-700">{children}</p>
  </div>
);

/** Body paragraphs in the site's serif style. */
export const Prose: React.FC<{ paragraphs: string[]; className?: string }> = ({ paragraphs, className = '' }) => (
  <div className={`space-y-4 font-serif text-lg sm:text-xl leading-relaxed text-stone-700 ${className}`}>
    {paragraphs.map((p) => (
      <p key={p}>{p}</p>
    ))}
  </div>
);
