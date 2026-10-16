import React from 'react';
import { ArrowRight } from 'lucide-react';
import { LotusMark } from '../layout/BrandEmblem';

interface TraditionBannerProps {
  onViewNewArrivals: () => void;
}

export const TraditionBanner: React.FC<TraditionBannerProps> = ({ onViewNewArrivals }) => (
  <section className="relative overflow-hidden bg-[radial-gradient(ellipse_at_60%_40%,#7a1a2c_0%,#5a1220_55%,#3e0c16_100%)] text-ivory">
    <div className="relative grid grid-cols-1 md:grid-cols-[minmax(0,40%)_minmax(0,1fr)] items-stretch">
      {/* Brass bowl with lotus, fading into the maroon */}
      <img
        src="/images/home_banner_lotus_bowl.jpg"
        alt="Brass bowl with a pink lotus and jasmine flowers"
        className="w-full h-56 sm:h-72 md:h-full object-cover [mask-image:linear-gradient(to_bottom,black_70%,transparent)] md:[mask-image:linear-gradient(to_right,black_70%,transparent)]"
      />

      <div className="relative px-6 sm:px-10 md:pl-6 lg:pl-10 md:pr-[30%] py-12 md:py-16 text-center md:text-left self-center">
        <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl leading-tight uppercase tracking-[0.04em] text-[#f3dfae]">
          Wear Tradition,
          <br />
          Live Elegance.
        </h2>
        <div className="flex items-center justify-center md:justify-start gap-2 my-4 text-gold-400" aria-hidden="true">
          <span className="h-px w-14 bg-gradient-to-r from-transparent to-gold-400 md:from-gold-400" />
          <LotusMark className="w-5 h-5" />
          <span className="h-px w-14 bg-gradient-to-l from-transparent to-gold-400" />
        </div>
        <p className="font-serif text-lg leading-relaxed text-cream/90 max-w-md mx-auto md:mx-0">
          From everyday drapes to festive weaves, discover sarees that celebrate every shade of your story.
        </p>
        <button
          onClick={onViewNewArrivals}
          className="mt-7 inline-flex items-center gap-3 px-7 py-3 bg-[#f8ead2] hover:bg-ivory text-burgundy-900 font-serif text-[15px] tracking-[0.12em] uppercase shadow-lg transition-colors cursor-pointer"
        >
          View new arrivals
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>

    {/* Temple elephant sketch on the right (large screens) */}
    <img
      src="/images/home_banner_elephant.jpg"
      alt=""
      className="hidden md:block absolute right-0 bottom-0 h-full w-auto opacity-90 pointer-events-none mix-blend-screen [mask-image:linear-gradient(to_right,transparent,black_25%)]"
    />
  </section>
);
