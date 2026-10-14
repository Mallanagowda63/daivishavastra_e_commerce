import React from 'react';
import { ArrowRight, Handshake } from 'lucide-react';
import { LotusMark } from '../layout/BrandEmblem';
import { ARCH_PATH, archMaskStyle } from '../common/TempleArch';

interface CategoryCardsProps {
  onSelectCategory: (categoryName: string) => void;
  onSelectCollection: (collectionName: string) => void;
  onLearnMore: () => void;
}

const IMG = '/src/assets/images';

const COLLECTION_CARDS: { title: string; image: string; category?: string; collection?: string }[] = [
  { title: 'Silk Sarees', image: `${IMG}/swatch_silk.jpg`, category: 'Silk Sarees' },
  { title: 'Cotton Sarees', image: `${IMG}/swatch_cotton.jpg`, category: 'Cotton Sarees' },
  { title: 'Tussar Sarees', image: `${IMG}/swatch_tussar.jpg`, category: 'Handloom Sarees' },
  { title: 'Linen Sarees', image: `${IMG}/swatch_linen.jpg`, category: 'Linen Sarees' },
  { title: 'Festive Sarees', image: `${IMG}/swatch_festive.jpg`, collection: 'Festive Collection' },
];

const STORY_PILLARS = [
  { icon: LotusMark, label: ['Traditional', 'Craftsmanship'] },
  { icon: Handshake, label: ['Supporting', 'Indian Artisans'] },
  { icon: LotusMark, label: ['Timeless Pieces', 'for Every You'] },
];

const OrnamentDivider: React.FC<{ className?: string }> = ({ className = '' }) => (
  <div className={`flex items-center justify-center gap-2 text-gold-600 ${className}`} aria-hidden="true">
    <span className="h-px w-16 sm:w-24 bg-gradient-to-r from-transparent to-gold-500" />
    <LotusMark className="w-5 h-5" />
    <span className="h-px w-16 sm:w-24 bg-gradient-to-l from-transparent to-gold-500" />
  </div>
);

export const CategoryCards: React.FC<CategoryCardsProps> = ({ onSelectCategory, onSelectCollection, onLearnMore }) => {
  return (
    <>
      {/* ── Our Story band ── */}
      <section className="relative overflow-hidden bg-gradient-to-r from-[#fbefdf] via-[#fbf1e3] to-[#f6e6cf] border-b border-gold-500/40">
        <div className="max-w-[1440px] mx-auto grid grid-cols-1 lg:grid-cols-[minmax(0,34%)_minmax(0,1fr)] xl:grid-cols-[minmax(0,34%)_minmax(0,31%)_minmax(0,1fr)_150px] items-end">
          {/* Loom photograph in temple arch */}
          <img
            src={`${IMG}/story_loom.jpg`}
            alt="Artisan weaving a silk saree on a handloom"
            className="w-full max-w-xl mx-auto lg:mx-0 h-auto block [mask-image:linear-gradient(to_right,transparent,black_10%)]"
          />

          {/* Story copy */}
          <div className="px-6 py-12 lg:py-10 text-center self-center">
            <p className="font-serif text-sm sm:text-base tracking-[0.25em] uppercase text-burgundy-900">Our Story</p>
            <OrnamentDivider className="mt-2 mb-4" />
            <h2 className="font-serif text-4xl sm:text-5xl font-medium text-burgundy-800 leading-[1.1]">
              A Celebration
              <br />
              of Indian Heritage
            </h2>
            <p className="mt-5 font-serif text-base sm:text-[17px] leading-relaxed text-stone-700 max-w-md mx-auto">
              Daivisha Vastra was born from a deep love for India's textile traditions — the weaves, the stories, the
              artisans and the timeless beauty of sarees. We bring together heritage and modern elegance, curating
              pieces that make you feel connected to your roots, wherever you are.
            </p>
            <button
              onClick={onLearnMore}
              className="mt-7 inline-flex items-center gap-3 px-7 py-3 bg-burgundy-800 hover:bg-burgundy-900 text-ivory font-serif text-base tracking-[0.12em] uppercase shadow-md transition-colors cursor-pointer"
            >
              Read Our Story
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Temple & elephant sketch */}
          <img
            src={`${IMG}/story_temple.jpg`}
            alt=""
            className="hidden xl:block w-full h-auto mix-blend-multiply opacity-90 [mask-image:radial-gradient(ellipse_at_center,black_60%,transparent_85%)]"
          />

          {/* Pillars */}
          <ul className="flex lg:col-span-2 xl:col-span-1 xl:flex-col justify-center gap-8 xl:gap-10 px-4 pb-10 xl:pb-0 self-center text-center">
            {STORY_PILLARS.map(({ icon: Icon, label }) => (
              <li key={label[0]} className="flex flex-col items-center gap-2">
                <Icon className="w-7 h-7 text-gold-600" />
                <span className="font-serif text-xs tracking-[0.12em] uppercase text-stone-800 leading-snug">
                  {label[0]}
                  <br />
                  {label[1]}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ── Explore Our Collections ── */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#fdf4ea] to-[#fbefe0] py-14 lg:py-16">

        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 min-[1400px]:px-24">
          <h2 className="text-center font-serif text-3xl sm:text-4xl font-semibold tracking-[0.04em] uppercase text-burgundy-800">
            Explore Our Collections
          </h2>
          <OrnamentDivider className="mt-3 mb-10" />

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-6">
            {COLLECTION_CARDS.map((card) => (
              <button
                key={card.title}
                onClick={() =>
                  card.collection ? onSelectCollection(card.collection) : onSelectCategory(card.category!)
                }
                className="group relative text-left cursor-pointer drop-shadow-sm hover:drop-shadow-lg transition-[filter]"
              >
                {/* One arch mask shapes the whole card, so photo top and gold outline always line up */}
                <div className="relative aspect-[5/7] bg-[#fffaf3] flex flex-col" style={archMaskStyle}>
                  <div className="h-[68%] overflow-hidden">
                    <img
                      src={card.image}
                      alt={card.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                  </div>
                  <div className="flex-1 flex flex-col items-center justify-center text-center border-t border-gold-500/50">
                    <h3 className="font-serif text-base sm:text-lg font-semibold tracking-[0.06em] uppercase text-burgundy-950">
                      {card.title}
                    </h3>
                    <ArrowRight className="w-4 h-4 mx-auto mt-1.5 text-burgundy-900 transition-transform group-hover:translate-x-1" />
                  </div>
                </div>
                {/* Gold arch outline */}
                <svg
                  viewBox="0 0 100 100"
                  preserveAspectRatio="none"
                  className="absolute inset-0 w-full h-full pointer-events-none"
                  aria-hidden="true"
                >
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
