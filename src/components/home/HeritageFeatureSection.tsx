import React from 'react';
import { ArrowRight, Sparkles } from 'lucide-react';
import { ImageWithFallback } from '../common/ImageWithFallback';

interface HeritageFeatureSectionProps {
  onShopCollection: () => void;
}

export const HeritageFeatureSection: React.FC<HeritageFeatureSectionProps> = ({ onShopCollection }) => {
  return (
    <section className="py-10 lg:py-14 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
        {/* Left Side: Large Editorial Product Image */}
        <div className="relative aspect-[3/4] overflow-hidden bg-[#e8ded3] shadow-2xl">
          <ImageWithFallback
            src="/images/banarasi_heritage_saree_1791372753729.jpg"
            alt="The Heritage Collection by Daivisha Vastra"
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-1000 ease-out"
          />
          <div className="absolute top-4 left-4 bg-burgundy-950 text-gold-300 text-xs font-semibold uppercase tracking-widest px-3 py-1.5 shadow-md">
            Limited Loom Edition
          </div>
        </div>

        {/* Right Side: Editorial Content */}
        <div className="space-y-6">
          <div className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-gold-700 font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-gold-600" />
            <span>Featured Editorial Series</span>
          </div>

          <h2 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold text-burgundy-950 leading-tight">
            The Heritage Collection
          </h2>

          <p className="font-serif text-xl sm:text-2xl text-stone-700 italic">
            &ldquo;Traditional weaves reimagined for the modern woman.&rdquo;
          </p>

          <p className="text-sm sm:text-base text-stone-600 font-sans leading-relaxed">
            A tribute to timeless Indian sartorial grace. We collaborated with master weavers across Varanasi to produce genuine heavy Katan brocades featuring Shikargah and meenakari motifs dating back to the 18th century, tailored with modern lightweight fall and soft drapes.
          </p>

          <div className="pt-2">
            <button
              onClick={onShopCollection}
              className="px-9 py-4 bg-burgundy-950 text-gold-300 hover:bg-burgundy-900 font-bold text-xs tracking-widest uppercase transition-all duration-300 shadow-xl inline-flex items-center gap-2.5"
            >
              <span>Shop Heritage Collection</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
