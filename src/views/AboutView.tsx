import React from 'react';
import { Sparkles, ShieldCheck, Award, Heart, ArrowRight } from 'lucide-react';
import { ImageWithFallback } from '../components/common/ImageWithFallback';

interface AboutViewProps {
  onExploreCatalog: () => void;
}

export const AboutView: React.FC<AboutViewProps> = ({ onExploreCatalog }) => {
  return (
    <div className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-20">
      {/* Editorial Hero */}
      <div className="max-w-3xl mx-auto text-center space-y-4">
        <span className="text-xs uppercase tracking-[0.25em] text-gold-700 font-semibold">
          The Daivisha Vastra Legacy
        </span>
        <h1 className="font-serif text-4xl sm:text-6xl font-bold text-burgundy-950 leading-tight">
          Where Generational Mastery Meets Contemporary Grace
        </h1>
        <p className="text-base text-stone-600 font-sans leading-relaxed">
          Founded with a reverent devotion to Indian textile craft, Daivisha Vastra bridges authentic handloom lineages with the refined aesthetics of the modern woman.
        </p>
      </div>

      {/* Flagship Image & Story Split */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div className="relative aspect-[4/3] bg-cream overflow-hidden shadow-2xl">
          <ImageWithFallback
            src="/src/assets/images/wedding_edit_banner_1791372730952.jpg"
            alt="Handloom pit loom weaving process"
            className="w-full h-full object-cover"
          />
        </div>

        <div className="space-y-5 text-sm sm:text-base text-stone-700 font-sans leading-relaxed">
          <h2 className="font-serif text-3xl font-bold text-burgundy-950">
            The Living Heritage of the Loom
          </h2>
          <p>
            In an era of mass commercial fast fashion, we champion the deliberate, meditative rhythm of slow handloom weaving. A single Daivisha Vastra Kanjivaram or Banarasi bridal drape can take anywhere from 14 to 35 days of continuous work on wooden pit looms.
          </p>
          <p>
            Two master weavers sit side by side, synchronizing their shuttles in the ancient <em>Korvai</em> interlocking method. Every motif—whether a temple gopuram, peacock, or sacred rudraksha bead—is individually counted in the warp and weft, giving each saree a distinct soul and weight.
          </p>
        </div>
      </div>

      {/* The 3 Guarantees */}
      <div className="bg-[#f8f3eb] p-8 md:p-14 border border-sand space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <h3 className="font-serif text-3xl font-bold text-burgundy-950">
            Our Uncompromising Curation Standards
          </h3>
          <p className="text-xs text-stone-600 uppercase tracking-wider font-semibold">
            Certified Purity · Direct Weaver Support · Archival Longevity
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-6 bg-white border border-sand space-y-3">
            <ShieldCheck className="w-8 h-8 text-gold-600" />
            <h4 className="font-serif text-xl font-bold text-charcoal">Silk Mark Certification</h4>
            <p className="text-xs text-stone-600 font-sans leading-relaxed">
              Every silk filament is 100% pure Mulberry or Tussar silk verified by the Silk Mark Organization of India. Never synthetic or blended substitutes.
            </p>
          </div>

          <div className="p-6 bg-white border border-sand space-y-3">
            <Award className="w-8 h-8 text-gold-600" />
            <h4 className="font-serif text-xl font-bold text-charcoal">Tested Real Zari</h4>
            <p className="text-xs text-stone-600 font-sans leading-relaxed">
              Our bridal and heirloom pieces use certified silver electroplated with 24k gold, ensuring the lustre does not blacken with proper muslin storage.
            </p>
          </div>

          <div className="p-6 bg-white border border-sand space-y-3">
            <Heart className="w-8 h-8 text-gold-600" />
            <h4 className="font-serif text-xl font-bold text-charcoal">Direct Fair Trade Guilds</h4>
            <p className="text-xs text-stone-600 font-sans leading-relaxed">
              By working directly with master weaving families in Kanchipuram, Varanasi, Chanderi, and Jaipur, we preserve ancestral livelihoods with fair wages.
            </p>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="text-center space-y-4">
        <h3 className="font-serif text-2xl font-bold text-burgundy-950">
          Ready to Discover Your Heirloom?
        </h3>
        <button
          onClick={onExploreCatalog}
          className="px-8 py-3.5 bg-burgundy-950 text-gold-300 font-semibold text-xs tracking-widest uppercase hover:bg-burgundy-900 transition-colors shadow-lg inline-flex items-center gap-2"
        >
          <span>Explore Saree Collection</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
