import React from 'react';
import { ArrowRight, Sparkles } from 'lucide-react';
import { ImageWithFallback } from '../common/ImageWithFallback';

interface WeddingBannerSectionProps {
  onExploreWedding: () => void;
}

export const WeddingBannerSection: React.FC<WeddingBannerSectionProps> = ({ onExploreWedding }) => {
  return (
    <section className="relative w-full py-28 lg:py-36 bg-burgundy-950 text-ivory overflow-hidden my-12">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <ImageWithFallback
          src="/src/assets/images/wedding_edit_banner_1791372730952.jpg"
          alt="The Royal Wedding Edit by Daivisha Vastra"
          className="w-full h-full object-cover object-center opacity-45 scale-100 hover:scale-105 transition-transform duration-1000 ease-out"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-burgundy-950 via-burgundy-950/70 to-burgundy-950/50" />
      </div>

      {/* Editorial Content */}
      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 text-center space-y-6">
        <div className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.3em] text-gold-400 font-semibold border-b border-gold-500/40 pb-1">
          <Sparkles className="w-3.5 h-3.5 text-gold-400" />
          <span>The Bridal Couturier</span>
        </div>

        <h2 className="font-serif text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-white leading-tight">
          Crafted for Your Most Beautiful Moments
        </h2>

        <p className="text-base sm:text-lg text-cream/90 font-sans font-light max-w-2xl mx-auto leading-relaxed">
          The Wedding Edit presents our most opulent weaves—heavy bridal Kanjivarams with real gold zari and authentic Varanasi Katan silks blessed for sacred vows.
        </p>

        <div className="pt-4">
          <button
            onClick={onExploreWedding}
            className="px-9 py-4.5 bg-gold-500 hover:bg-gold-400 text-burgundy-950 font-bold text-xs tracking-widest uppercase transition-all duration-300 shadow-2xl inline-flex items-center gap-2.5 hover:scale-105"
          >
            <span>Explore Wedding Collection</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </section>
  );
};
