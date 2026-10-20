import React from 'react';
import { ArrowRight, Sparkles, Award, Shield, Heart } from 'lucide-react';
import { ImageWithFallback } from '../common/ImageWithFallback';

interface BrandStorySectionProps {
  onLearnMore: () => void;
}

export const BrandStorySection: React.FC<BrandStorySectionProps> = ({ onLearnMore }) => {
  return (
    <section className="py-12 bg-[#f8f3eb] border-t border-b border-sand overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Left Column: Visual Story Mosaic */}
          <div className="lg:col-span-6 relative">
            <div className="relative aspect-[4/5] max-w-md mx-auto lg:max-w-none bg-white p-3 shadow-xl border border-sand">
              <ImageWithFallback
                src="/images/hero_saree_model_1791372718962.jpg"
                alt="Daivisha Vastra Artisan Weaving Lineage"
                className="w-full h-full object-cover"
              />
            </div>
            {/* Overlapping Floating Inset Card */}
            <div className="hidden sm:block absolute -bottom-6 -right-6 w-56 bg-burgundy-950 text-ivory p-5 shadow-2xl border border-gold-500/30">
              <span className="text-gold-400 font-serif text-2xl font-bold block">400+ Years</span>
              <p className="text-[11px] text-cream/80 font-sans uppercase tracking-widest mt-1">
                Handloom Lineage Preserved
              </p>
            </div>
          </div>

          {/* Right Column: Story Copy */}
          <div className="lg:col-span-6 space-y-6">
            <div className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-gold-700 font-semibold">
              <Sparkles className="w-3.5 h-3.5 text-gold-600" />
              <span>Our Artisanal Origin</span>
            </div>

            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-burgundy-950 leading-tight">
              Where Tradition Meets Timeless Beauty
            </h2>

            <div className="space-y-4 text-sm sm:text-base text-stone-700 font-sans leading-relaxed">
              <p>
                At <strong>Daivisha Vastra</strong>, every saree is more than a garment. It is an enduring celebration of Indian craftsmanship, culture, and sovereign individuality.
              </p>
              <p>
                We thoughtfully curate handloom sarees that preserve centuries of traditional artistry while embracing contemporary silhouettes. From the sacred temple borders of Kanchipuram to the ethereal Kadwa brocades of Varanasi, our master karigars spend weeks hand-weaving every single piece with real tested metallic zari.
              </p>
            </div>

            {/* Three Pillar Values */}
            <div className="grid grid-cols-3 gap-4 pt-4 border-t border-sand/70 text-center sm:text-left">
              <div>
                <span className="font-serif text-lg font-bold text-burgundy-950 block">100% Pure</span>
                <span className="text-[11px] text-stone-500 uppercase tracking-wider">Natural Silk</span>
              </div>
              <div>
                <span className="font-serif text-lg font-bold text-burgundy-950 block">Master Pit Looms</span>
                <span className="text-[11px] text-stone-500 uppercase tracking-wider">Korvai Weave</span>
              </div>
              <div>
                <span className="font-serif text-lg font-bold text-burgundy-950 block">Direct Fair Trade</span>
                <span className="text-[11px] text-stone-500 uppercase tracking-wider">Artisan Families</span>
              </div>
            </div>

            <div className="pt-2">
              <button
                onClick={onLearnMore}
                className="px-8 py-3.5 bg-burgundy-950 hover:bg-burgundy-900 text-gold-300 font-semibold text-xs tracking-widest uppercase transition-all duration-200 shadow-md inline-flex items-center gap-2"
              >
                <span>Read Our Heritage Story</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
