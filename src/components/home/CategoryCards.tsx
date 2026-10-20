import React from 'react';
import { ArrowRight } from 'lucide-react';
import { LotusMark } from '../layout/BrandEmblem';
import { ARCH_PATH, archMaskStyle } from '../common/TempleArch';
import { Prose, SectionHeading } from '../common/ContentBlocks';
import { VisionMission } from './VisionMission';
import { COLLECTIONS, collectionImage } from '../../data/collections';
import { useBanners } from '../../data/bannerStore';
import { SareeCategory, SareeProduct } from '../../types';

interface CategoryCardsProps {
  products: SareeProduct[];
  onOpenCollection: (key: SareeCategory) => void;
  onLearnMore: () => void;
}

const OrnamentDivider: React.FC<{ className?: string; align?: 'center' | 'start' }> = ({ className = '', align = 'center' }) => (
  <div className={`flex items-center gap-2 text-gold-600 ${align === 'center' ? 'justify-center' : 'justify-center md:justify-start'} ${className}`} aria-hidden="true">
    <span className="h-px w-16 sm:w-24 bg-gradient-to-r from-transparent to-gold-500" />
    <LotusMark className="w-5 h-5" />
    <span className="h-px w-16 sm:w-24 bg-gradient-to-l from-transparent to-gold-500" />
  </div>
);

export const CategoryCards: React.FC<CategoryCardsProps> = ({ products, onOpenCollection, onLearnMore }) => {
  const banners = useBanners();
  return (
    <>
      {/* ── Our Story ── */}
      <section className="relative overflow-hidden bg-gradient-to-r from-[#fbf1e3] via-[#fbefdf] to-[#f3e1c6]">
        {/* Lotus sketch on the left */}
        <img
          src="/images/home_story_lotus.jpg"
          alt=""
          className="hidden md:block absolute left-0 top-1/2 -translate-y-1/2 h-[95%] w-auto mix-blend-multiply opacity-80 pointer-events-none [mask-image:linear-gradient(to_right,black_60%,transparent)]"
        />
        <div className="relative grid grid-cols-1 md:grid-cols-[minmax(0,1fr)_minmax(0,42%)] items-stretch">
          <div className="px-6 sm:px-10 md:pl-[220px] lg:pl-[290px] md:pr-8 py-12 md:py-14 text-center md:text-left self-center">
            <h2 className="font-serif text-3xl sm:text-4xl uppercase tracking-[0.06em] text-burgundy-800">Our Story</h2>
            <OrnamentDivider align="start" className="mt-2 mb-5" />
            <p className="font-serif text-lg leading-relaxed text-stone-700 max-w-xl mx-auto md:mx-0">
              Daivisha Vastra was born from a deep love for India&apos;s textile traditions — the weaves, the stories, the artisans
              and the timeless beauty of sarees. We bring together heritage and modern elegance, curating pieces that make you
              feel connected to your roots, wherever you are.
            </p>
            <button
              onClick={onLearnMore}
              className="mt-7 inline-flex items-center gap-3 px-7 py-3 bg-burgundy-800 hover:bg-burgundy-900 text-ivory font-serif text-[15px] tracking-[0.12em] uppercase shadow-md transition-colors cursor-pointer"
            >
              Read our story
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
          {/* Folded sarees, fading into the band */}
          <img
            src="/images/home_story_sarees.jpg"
            alt="Folded silk sarees in maroon, green and gold on a brass plate with jasmine"
            className="w-full h-64 sm:h-80 md:h-full object-cover object-right md:[mask-image:linear-gradient(to_right,transparent,black_30%)]"
          />
        </div>
      </section>

      {/* ── Introduction ── */}
      <section className="bg-[#fbf6ee] border-y border-gold-500/30">
        <div className="max-w-3xl mx-auto px-5 sm:px-8 py-14 sm:py-16">
          <SectionHeading kicker="Introduction" title="A Heritage of Elegance" subtitle="Timeless drapes. Stories in every weave." />
          <Prose
            className="mt-8 text-center"
            paragraphs={[
              'Daivisha Vastra is a saree label inspired by the richness of Indian heritage, the beauty of traditional textiles and the timeless grace of the saree.',
              'We bring together thoughtfully selected drapes for celebrations, meaningful occasions and everyday moments—helping every woman express her individuality while staying connected to her roots.',
              'Our philosophy is simple: elegance should feel personal, heritage should feel alive, and every saree should carry a story worth sharing.',
            ]}
          />
        </div>
      </section>

      {/* ── Vision & Mission ── */}
      <VisionMission />

      {/* ── Explore Our Collections ── */}
      <section id="collections" className="relative overflow-hidden bg-gradient-to-b from-[#fdf4ea] to-[#fbefe0] py-14 lg:py-16 scroll-mt-36">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-center font-serif text-3xl sm:text-4xl font-semibold tracking-[0.04em] uppercase text-burgundy-800">
            Explore Our Collections
          </h2>
          <OrnamentDivider className="mt-3 mb-10" />

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-5">
            {COLLECTIONS.map((c) => (
              <button
                key={c.key}
                onClick={() => onOpenCollection(c.key)}
                className="group relative text-left cursor-pointer drop-shadow-sm hover:drop-shadow-lg transition-[filter]"
              >
                {/* One arch mask shapes the whole card, so photo top and gold outline always line up */}
                <div className="relative aspect-[5/7] bg-[#fffaf3] flex flex-col" style={archMaskStyle}>
                  <div className="h-[68%] overflow-hidden">
                    {collectionImage(c, banners, products, 'card') ? (
                      <img
                        src={collectionImage(c, banners, products, 'card')}
                        alt={`${c.title} saree`}
                        loading="lazy"
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                    ) : (
                      <div className="w-full h-full grid place-items-center bg-gradient-to-b from-[#f6e6cf] to-[#efd9b8]">
                        <LotusMark className="w-12 h-12 text-gold-600/70" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 flex flex-col items-center justify-center text-center border-t border-gold-500/50 px-2">
                    <h3 className="font-serif text-[13px] sm:text-[15px] font-semibold tracking-[0.05em] uppercase text-burgundy-950 leading-tight">
                      {c.title}
                    </h3>
                    <ArrowRight className="w-4 h-4 mx-auto mt-1.5 text-burgundy-900 transition-transform group-hover:translate-x-1" />
                  </div>
                </div>
                {/* Gold arch outline */}
                <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 w-full h-full pointer-events-none" aria-hidden="true">
                  <path d={ARCH_PATH} fill="none" stroke="#b08d46" strokeWidth="4" vectorEffect="non-scaling-stroke" />
                </svg>
              </button>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};
