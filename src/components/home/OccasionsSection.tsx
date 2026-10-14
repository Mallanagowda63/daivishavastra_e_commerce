import React from 'react';
import { ArrowRight } from 'lucide-react';
import { OCCASIONS_DATA } from '../../data/categories';
import { ImageWithFallback } from '../common/ImageWithFallback';

interface OccasionsSectionProps {
  onSelectOccasion: (occasion: string) => void;
}

export const OccasionsSection: React.FC<OccasionsSectionProps> = ({ onSelectOccasion }) => {
  return (
    <section className="py-20 lg:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Section Header */}
      <div className="text-center max-w-2xl mx-auto mb-14 space-y-2">
        <span className="text-xs uppercase tracking-[0.2em] text-gold-700 font-semibold">
          For Every Auspicious Milestone
        </span>
        <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-burgundy-950">
          Shop by Occasion
        </h2>
        <p className="text-sm text-stone-600 font-sans">
          Drapes designed with intentional weight, sheen, and comfort for life&apos;s distinct chapters.
        </p>
      </div>

      {/* 6 Tiles Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
        {OCCASIONS_DATA.map((occ) => (
          <div
            key={occ.id}
            onClick={() => onSelectOccasion(occ.name)}
            className="group relative aspect-[3/4] overflow-hidden bg-cream cursor-pointer shadow-sm hover:shadow-lg transition-all"
          >
            <ImageWithFallback
              src={occ.image}
              alt={occ.name}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-burgundy-950/90 via-black/30 to-transparent" />

            <div className="absolute inset-x-0 bottom-0 p-3 sm:p-4 text-center text-ivory">
              <h3 className="font-serif text-base sm:text-lg font-bold group-hover:text-gold-300 transition-colors">
                {occ.name}
              </h3>
              <p className="text-[10px] text-cream/70 uppercase tracking-widest mt-0.5">
                {occ.count}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
