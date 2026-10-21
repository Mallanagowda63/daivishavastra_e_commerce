import React from 'react';
import { ArrowRight } from 'lucide-react';
import { LotusMark } from '../layout/BrandEmblem';
import { ARCH_PATH, archMaskStyle } from '../common/TempleArch';

interface HeroSectionProps {
  onExploreCollections: () => void;
}

/** Arched brand card: logo, tagline, intro line and the main call to action. */
const BrandCard: React.FC<{ onExplore: () => void; className?: string }> = ({ onExplore, className = '' }) => (
  <div className={`relative ${className}`}>
    <div
      className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_35%,#fffaf0_0%,#fbf0de_60%,#f5e3c6_100%)]"
      style={archMaskStyle}
    />
    <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 w-full h-full pointer-events-none" aria-hidden="true">
      <path d={ARCH_PATH} fill="none" stroke="#c5a059" strokeWidth="2" vectorEffect="non-scaling-stroke" />
    </svg>
    <div className="relative h-full flex flex-col items-center justify-center text-center px-6 sm:px-10 pt-[16%] pb-8">
      {/* The logo carries the name and tagline */}
      <img
        src="/images/daivisha-logo.webp?v=2"
        alt="Daivisha Vastra — Elegant attire rooted in Indian heritage"
        className="w-[62%] max-w-[260px] aspect-square rounded-full drop-shadow-md"
      />
      <h2 className="sr-only">Daivisha Vastra — Elegant attire rooted in Indian heritage</h2>
      <div className="flex items-center justify-center gap-2 my-3 text-gold-600" aria-hidden="true">
        <span className="h-px w-14 bg-gradient-to-r from-transparent to-gold-500" />
        <LotusMark className="w-4 h-4" />
        <span className="h-px w-14 bg-gradient-to-l from-transparent to-gold-500" />
      </div>
      <p className="font-serif text-[clamp(15px,1.2vw,18px)] leading-relaxed text-stone-700 max-w-sm">
        A celebration of India&apos;s rich textile traditions, where timeless craftsmanship meets modern elegance.
      </p>
      <button
        onClick={onExplore}
        className="mt-5 inline-flex items-center gap-3 px-6 py-3 bg-burgundy-800 hover:bg-burgundy-900 text-ivory font-serif text-sm sm:text-[15px] tracking-[0.12em] uppercase shadow-md transition-colors cursor-pointer"
      >
        Explore our collections
        <ArrowRight className="w-4 h-4" />
      </button>
    </div>
  </div>
);

export const HeroSection: React.FC<HeroSectionProps> = ({ onExploreCollections }) => {
  return (
    <section aria-label="Welcome" className="relative bg-[#f6e6cf] border-b border-gold-500/40">
      {/* Large screens: full scene with the arched card over its right side (matches the design proportions) */}
      <div className="hidden lg:block relative w-full aspect-[1024/480] max-h-[820px] overflow-hidden">
        <img
          src="/images/home_hero.jpg"
          alt="Woman in a maroon and gold silk saree seated beside brass lamps and jasmine garlands"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <BrandCard onExplore={onExploreCollections} className="absolute left-[53.2%] top-[5.5%] w-[39.8%] h-[90%]" />
      </div>

      {/* Phones & tablets: photo of the woman, then the card below */}
      <div className="lg:hidden">
        <div className="relative w-full aspect-[4/5] sm:aspect-[16/11] overflow-hidden">
          <img
            src="/images/home_hero.jpg"
            alt="Woman in a maroon and gold silk saree seated beside brass lamps and jasmine garlands"
            className="absolute inset-0 w-full h-full object-cover object-[16%_center] sm:object-[8%_center]"
          />
          <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[#f6e6cf] to-transparent" />
        </div>
        <div className="px-4 -mt-16 pb-10 relative">
          <BrandCard onExplore={onExploreCollections} className="mx-auto max-w-md aspect-[4/5] min-h-[460px]" />
        </div>
      </div>
    </section>
  );
};
