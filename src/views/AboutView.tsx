import React from 'react';
import { ArrowRight } from 'lucide-react';
import { LotusMark } from '../components/layout/BrandEmblem';
import { ARCH_PATH, archMaskStyle } from '../components/common/TempleArch';

interface AboutViewProps {
  onExploreCatalog: () => void;
}

const Divider: React.FC<{ className?: string }> = ({ className = '' }) => (
  <div className={`flex items-center justify-center gap-2 text-gold-600 ${className}`} aria-hidden="true">
    <span className="h-px w-16 sm:w-24 bg-gradient-to-r from-transparent to-gold-500" />
    <LotusMark className="w-5 h-5" />
    <span className="h-px w-16 sm:w-24 bg-gradient-to-l from-transparent to-gold-500" />
  </div>
);

export const AboutView: React.FC<AboutViewProps> = ({ onExploreCatalog }) => {
  return (
    <div>
      {/* Banner */}
      <section className="bg-gradient-to-r from-[#fbefdf] via-[#fbf1e3] to-[#f6e6cf] border-b border-gold-500/40">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 sm:py-16 text-center">
          <p className="font-serif text-sm sm:text-base uppercase tracking-[0.3em] text-gold-700">About us</p>
          <h1 className="mt-3 font-serif text-4xl sm:text-6xl font-medium text-burgundy-800 leading-tight">
            Welcome to Daivisha Vastra
          </h1>
          <Divider className="my-5" />
          <p className="font-serif text-lg sm:text-xl italic text-stone-700">Elegant attire rooted in Indian heritage.</p>
        </div>
      </section>

      {/* Story */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-20 grid grid-cols-1 lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)] gap-12 lg:gap-16 items-center">
        {/* Photo in a temple arch */}
        <div className="relative w-full max-w-md mx-auto aspect-[4/5] drop-shadow-xl">
          <div className="absolute inset-0 bg-[#fffaf3] p-2" style={archMaskStyle}>
            <img
              src="/images/hero_temple_clean.jpg"
              alt="Woman in a maroon and gold silk saree holding jasmine in a temple courtyard"
              className="w-full h-full object-cover object-[76%_center]"
              style={archMaskStyle}
            />
          </div>
          <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 w-full h-full pointer-events-none" aria-hidden="true">
            <path d={ARCH_PATH} fill="none" stroke="#b08d46" strokeWidth="4" vectorEffect="non-scaling-stroke" />
          </svg>
        </div>

        <div className="space-y-5 font-serif text-lg sm:text-xl leading-relaxed text-stone-700">
          <p>
            At Daivisha Vastra, we believe every saree has a story to tell — a story woven with tradition, culture, grace, and
            timeless beauty.
          </p>
          <p>
            Rooted in the richness of Indian heritage, we bring you sarees that celebrate the beauty of our traditions while
            embracing the elegance of today. From cherished cultural weaves to exquisite colours, intricate motifs, and
            distinctive borders, every saree holds a charm that goes beyond the fabric itself.
          </p>
          <p>
            We believe a saree is more than something you wear. It becomes a part of your celebrations, your memories, and the
            moments you treasure forever.
          </p>
          <p>
            Through Daivisha Vastra, we invite you to discover the stories behind every saree, appreciate the beauty in every
            detail, and find a piece that feels uniquely yours.
          </p>
        </div>
      </section>

      {/* Pull quote */}
      <section className="bg-[#4c1012] text-center px-4 py-14 sm:py-16 border-y-2 border-gold-500/60">
        <LotusMark className="w-8 h-8 mx-auto text-gold-400" />
        <p className="mt-4 font-serif text-3xl sm:text-5xl text-[#f3dfae] leading-tight">
          More than attire.
          <br />
          <em>A legacy in every thread.</em>
        </p>
      </section>

      {/* Closing */}
      <section className="max-w-3xl mx-auto px-4 sm:px-6 py-14 sm:py-20 text-center">
        <p className="font-serif text-xl sm:text-2xl leading-relaxed text-stone-700">
          Welcome to a world where every saree has a story, and every story deserves to be cherished.
        </p>
        <p className="mt-4 font-serif text-2xl sm:text-3xl text-burgundy-800">Welcome to Daivisha Vastra.</p>
        <Divider className="my-8" />
        <button
          onClick={onExploreCatalog}
          className="inline-flex items-center gap-3 px-8 py-3.5 bg-burgundy-800 hover:bg-burgundy-900 text-ivory font-serif text-base tracking-[0.12em] uppercase shadow-md transition-colors cursor-pointer"
        >
          Explore our sarees
          <ArrowRight className="w-4 h-4" />
        </button>
      </section>
    </div>
  );
};
