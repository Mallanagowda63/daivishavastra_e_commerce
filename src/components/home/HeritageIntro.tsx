import React from 'react';
import { BookOpen, Flower2, Gem } from 'lucide-react';
import { LotusMark } from '../layout/BrandEmblem';

const PILLARS = [
  { icon: Gem, word: 'Elegance', line: 'should feel personal' },
  { icon: Flower2, word: 'Heritage', line: 'should feel alive' },
  { icon: BookOpen, word: 'Every Saree', line: 'should carry a story worth sharing' },
];

/** Gold corner flourish; rotated for each corner of the frame. */
const Corner: React.FC<{ className: string }> = ({ className }) => (
  <svg viewBox="0 0 40 40" className={`absolute w-8 h-8 sm:w-10 sm:h-10 text-gold-500 ${className}`} aria-hidden="true">
    <path d="M2 38V8a6 6 0 0 1 6-6h30" fill="none" stroke="currentColor" strokeWidth="1.5" />
    <path d="M8 38V14a6 6 0 0 1 6-6h24" fill="none" stroke="currentColor" strokeWidth="0.75" opacity="0.7" />
    <circle cx="8" cy="8" r="2.2" fill="currentColor" />
  </svg>
);

/** Home page introduction: framed panel with drop cap and the brand philosophy as three pillars. */
export const HeritageIntro: React.FC = () => (
  <section className="relative bg-[radial-gradient(ellipse_at_top,#fdf3e3_0%,#f8ead6_55%,#f3e0c6_100%)] border-y border-gold-500/30 px-4 sm:px-6 py-14 sm:py-20">
    <div className="relative max-w-4xl mx-auto bg-[#fffaf3] border border-gold-500/60 shadow-[0_20px_50px_-25px_rgba(84,20,36,0.35)]">
      {/* inner hairline frame */}
      <div className="pointer-events-none absolute inset-2.5 sm:inset-3 border border-gold-500/30" aria-hidden="true" />
      <Corner className="top-1 left-1" />
      <Corner className="top-1 right-1 rotate-90" />
      <Corner className="bottom-1 right-1 rotate-180" />
      <Corner className="bottom-1 left-1 -rotate-90" />

      <div className="relative px-6 sm:px-14 lg:px-20 py-12 sm:py-16">
        {/* Heading */}
        <header className="text-center">
          <div className="flex items-center justify-center gap-3 text-gold-700">
            <span className="h-px w-8 sm:w-12 bg-gold-500/70" />
            <p className="font-sans text-xs sm:text-sm font-semibold uppercase tracking-[0.3em]">Introduction</p>
            <span className="h-px w-8 sm:w-12 bg-gold-500/70" />
          </div>
          <h2
            className="mt-4 text-3xl sm:text-5xl font-medium leading-tight text-burgundy-800"
            style={{ fontFamily: "'Cinzel', serif" }}
          >
            A Heritage of Elegance
          </h2>
          <div className="mt-4 flex items-center justify-center gap-3 text-gold-600" aria-hidden="true">
            <span className="h-px w-16 sm:w-28 bg-gradient-to-r from-transparent to-gold-500" />
            <LotusMark className="w-6 h-6" />
            <span className="h-px w-16 sm:w-28 bg-gradient-to-l from-transparent to-gold-500" />
          </div>
          <p className="mt-4 font-serif italic text-xl sm:text-2xl text-gold-700">Timeless drapes. Stories in every weave.</p>
        </header>

        {/* Story */}
        <div className="mt-10 space-y-5 font-serif text-lg sm:text-xl leading-relaxed text-stone-700">
          <p className="first-letter:float-left first-letter:mr-3 first-letter:mt-1 first-letter:text-6xl sm:first-letter:text-7xl first-letter:leading-[0.8] first-letter:font-semibold first-letter:text-burgundy-800 first-letter:[font-family:'Cinzel',serif]">
            Daivisha Vastra is a saree label inspired by the richness of Indian heritage, the beauty of traditional textiles and the
            timeless grace of the saree.
          </p>
          <p>
            We bring together thoughtfully selected drapes for celebrations, meaningful occasions and everyday moments—helping every
            woman express her individuality while staying connected to her roots.
          </p>
        </div>

        {/* Philosophy */}
        <div className="mt-12">
          <p className="text-center font-serif italic text-xl sm:text-2xl text-burgundy-800">Our philosophy is simple:</p>
          <ul className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-5">
            {PILLARS.map(({ icon: Icon, word, line }) => (
              <li
                key={word}
                className="flex flex-col items-center text-center bg-[#f8eedf] border border-gold-500/40 px-5 py-6 transition-shadow hover:shadow-md"
              >
                <span className="w-12 h-12 rounded-full border border-gold-600/70 bg-[#fffaf3] text-gold-700 grid place-items-center">
                  <Icon className="w-5 h-5" strokeWidth={1.5} />
                </span>
                <span className="mt-3 text-lg tracking-[0.06em] text-burgundy-800" style={{ fontFamily: "'Cinzel', serif" }}>
                  {word}
                </span>
                <span className="mt-1 font-serif text-base sm:text-lg leading-snug text-stone-700">{line}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  </section>
);
