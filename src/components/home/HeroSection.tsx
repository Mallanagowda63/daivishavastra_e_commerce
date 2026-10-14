import React, { useCallback, useEffect, useRef, useState } from 'react';
import { ArrowRight, ChevronLeft, ChevronRight, MessageCircle, Sun, Truck } from 'lucide-react';
import { LotusMark } from '../layout/BrandEmblem';
import { openWhatsApp } from '../common/WhatsAppGate';

interface HeroSectionProps {
  onShopNewArrivals: () => void;
  onExploreCollections: () => void;
  onExploreStory: () => void;
}

type Slide = {
  image: string;
  /** Finished banner artwork (text included) shown on large screens instead of the photo + HTML text. */
  banner?: string;
  alt: string;
  position: string;
  title: React.ReactNode;
  text: string;
  cta: string;
  action: 'story' | 'new' | 'collections';
};

const SLIDES: Slide[] = [
  {
    image: '/images/hero_temple_saree.jpg',
    banner: '/images/hero_banner_tradition.jpg',
    alt: 'Woman in a maroon and gold silk saree holding jasmine at a temple',
    position: 'object-[30%_25%]',
    title: (
      <>
        Tradition
        <br />
        Woven <em className="font-serif italic font-normal">for</em>
        <br />
        Today
      </>
    ),
    text: "At Daivisha Vastra, we celebrate India's rich textile heritage through sarees that blend timeless craftsmanship with contemporary elegance.",
    cta: 'Explore our story',
    action: 'story',
  },
  {
    image: '/images/hero_saree_model_1791372718962.jpg',
    alt: 'Model in a maroon Kanjivaram silk saree with heirloom jewellery',
    position: 'object-[50%_15%]',
    title: (
      <>
        Timeless
        <br />
        Elegance, Woven
        <br />
        <em className="font-serif italic font-normal">for</em> You
      </>
    ),
    text: 'Handwoven pure Kanjivaram and Banarasi heirlooms, crafted with tradition and artistry to be treasured for generations.',
    cta: 'Shop new arrivals',
    action: 'new',
  },
  {
    image: '/images/wedding_edit_banner_1791372730952.jpg',
    alt: 'Bride in a red zardozi saree in a candle-lit palace courtyard',
    position: 'object-[50%_35%]',
    title: (
      <>
        The Royal
        <br />
        Wedding <em className="font-serif italic font-normal">Edit</em>
      </>
    ),
    text: 'Bridal silks woven with real gold and silver zari for the most auspicious days of your life.',
    cta: 'Explore collections',
    action: 'collections',
  },
];

const FEATURES = [
  { icon: LotusMark, title: 'Authentic Collections', text: 'Handpicked with care' },
  { icon: Sun, title: 'Rooted in Heritage', text: 'Inspired by Indian traditions' },
  { icon: Truck, title: 'Pan India Shipping', text: 'Safe & reliable delivery' },
  { icon: MessageCircle, title: 'Order via WhatsApp', text: 'Quick & personal support', whatsapp: true },
];

const AUTOPLAY_MS = 7000;

export const HeroSection: React.FC<HeroSectionProps> = ({ onShopNewArrivals, onExploreCollections, onExploreStory }) => {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const touchX = useRef<number | null>(null);

  const go = useCallback((i: number) => setIndex((i + SLIDES.length) % SLIDES.length), []);

  useEffect(() => {
    if (paused || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const t = setTimeout(() => go(index + 1), AUTOPLAY_MS);
    return () => clearTimeout(t);
  }, [index, paused, go]);

  const runAction = (a: Slide['action']) => (a === 'story' ? onExploreStory() : a === 'new' ? onShopNewArrivals() : onExploreCollections());

  return (
    <>
      <section
        className="relative w-full h-[560px] sm:h-[600px] lg:h-[620px] xl:h-[max(480px,calc(100vw/3.03))] overflow-hidden bg-[#2a140b] text-ivory"
        aria-roledescription="carousel"
        aria-label="Featured collections"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        // Swipe between slides on touch screens
        onTouchStart={(e) => (touchX.current = e.touches[0].clientX)}
        onTouchEnd={(e) => {
          if (touchX.current === null) return;
          const dx = e.changedTouches[0].clientX - touchX.current;
          if (Math.abs(dx) > 45) go(index + (dx < 0 ? 1 : -1));
          touchX.current = null;
        }}
      >
        {/* Warm temple-light backdrop for the text side */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_30%_40%,#5a3418_0%,#3a1d0e_45%,#24110a_100%)]" />

        {/* Slide photos, right side, faded into the backdrop */}
        {SLIDES.map((s, i) => (
          <div
            key={s.image}
            className={`absolute inset-y-0 right-0 w-full md:w-[62%] ${s.banner ? 'xl:w-full' : ''} overflow-hidden transition-opacity duration-[1600ms] ease-in-out motion-reduce:transition-none ${
              i === index ? 'opacity-100' : 'opacity-0'
            }`}
            aria-hidden={i !== index}
          >
            {/* Slow zoom while the slide is showing */}
            <img
              src={s.image}
              alt={s.alt}
              className={`w-full h-full object-cover ${s.position} ${s.banner ? 'xl:hidden' : ''} [mask-image:linear-gradient(to_right,transparent,black_28%)] max-md:[mask-image:none] max-md:opacity-45 will-change-transform motion-reduce:transition-none ${
                i === index ? 'scale-100 transition-transform duration-[8000ms] ease-out' : 'scale-[1.06] transition-transform duration-[1600ms]'
              }`}
            />
            {s.banner && (
              <>
                <img
                  src={s.banner}
                  alt=""
                  className={`hidden xl:block w-full h-full object-cover object-center will-change-transform motion-reduce:transition-none ${
                    i === index ? 'scale-100 transition-transform duration-[8000ms] ease-out' : 'scale-[1.03] transition-transform duration-[1600ms]'
                  }`}
                />
                {/* The banner's button is part of the artwork, so the whole banner acts as the link */}
                <button
                  onClick={() => runAction(s.action)}
                  tabIndex={i === index ? 0 : -1}
                  className={`hidden xl:block absolute inset-0 z-10 cursor-pointer ${i === index ? '' : 'pointer-events-none'}`}
                  aria-label={s.cta}
                />
              </>
            )}
          </div>
        ))}
        <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/40 to-transparent pointer-events-none" />

        {/* Slide copy */}
        <div className="relative z-10 h-full px-6 sm:px-16 lg:px-20 flex items-center pointer-events-none">
          {/* All slides share one grid cell, so text cross-fades in place without the layout jumping */}
          <div className="w-full md:w-[46%] lg:w-[44%] text-center grid">
            {SLIDES.map((s, i) => (
              <div
                key={s.cta}
                className={`[grid-area:1/1] self-center transition-all ease-out motion-reduce:transition-none ${s.banner ? 'xl:hidden' : ''} ${
                  i === index
                    ? 'opacity-100 translate-y-0 duration-[1000ms] delay-300 pointer-events-auto'
                    : 'opacity-0 translate-y-5 duration-500 pointer-events-none'
                }`}
                aria-hidden={i !== index}
                aria-live={i === index ? 'polite' : undefined}
              >
                <h1 className="font-serif text-5xl sm:text-6xl 2xl:text-7xl font-medium leading-[1.02] text-[#f3dfae] drop-shadow-[0_2px_12px_rgba(0,0,0,0.35)]">
                  {s.title}
                </h1>
                <div className="flex items-center justify-center gap-3 my-6 text-gold-400" aria-hidden="true">
                  <span className="h-px w-20 bg-gradient-to-r from-transparent to-gold-400" />
                  <LotusMark className="w-5 h-5" />
                  <span className="h-px w-20 bg-gradient-to-l from-transparent to-gold-400" />
                </div>
                <p className="font-serif text-lg sm:text-xl leading-relaxed text-cream/95 max-w-md mx-auto">{s.text}</p>
                <button
                  onClick={() => runAction(s.action)}
                  tabIndex={i === index ? 0 : -1}
                  className="mt-8 inline-flex items-center gap-3 px-7 py-3.5 bg-burgundy-800/90 hover:bg-burgundy-700 border border-gold-500/70 text-ivory font-serif text-base tracking-[0.12em] uppercase shadow-lg transition-colors cursor-pointer"
                >
                  {s.cta}
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Arrows */}
        <button
          onClick={() => go(index - 1)}
          className="hidden md:grid absolute left-3 sm:left-5 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full border border-ivory/70 text-ivory grid place-items-center hover:bg-white/15 transition-colors cursor-pointer"
          aria-label="Previous slide"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <button
          onClick={() => go(index + 1)}
          className="hidden md:grid absolute right-3 sm:right-5 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-ivory/70 text-charcoal grid place-items-center hover:bg-ivory transition-colors cursor-pointer"
          aria-label="Next slide"
        >
          <ChevronRight className="w-5 h-5" />
        </button>

        {/* Dots */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex gap-2.5">
          {SLIDES.map((s, i) => (
            <button
              key={s.cta}
              onClick={() => go(i)}
              className={`h-2.5 rounded-full transition-all duration-500 cursor-pointer ${i === index ? 'w-7 bg-ivory' : 'w-2.5 bg-ivory/50 hover:bg-ivory/80'}`}
              aria-label={`Show slide ${i + 1}`}
              aria-current={i === index}
            />
          ))}
        </div>
      </section>

      {/* Feature strip */}
      <section className="bg-[#faf3e8] border-b border-gold-500/30">
        <ul className="max-w-[1440px] mx-auto px-2 sm:px-6 lg:px-24 py-5 sm:py-6 grid grid-cols-2 lg:grid-cols-4 gap-y-5 sm:gap-y-6">
          {FEATURES.map(({ icon: Icon, title, text, whatsapp }, i) => {
            const body = (
              <>
                <span className="shrink-0 w-10 h-10 sm:w-12 sm:h-12 rounded-full border border-gold-500/60 text-gold-700 grid place-items-center">
                  <Icon className="w-5 h-5 sm:w-6 sm:h-6" />
                </span>
                <span className="text-left">
                  <span className="block font-serif text-[15px] sm:text-lg text-charcoal leading-tight">{title}</span>
                  <span className="block font-serif text-xs sm:text-sm text-stone-600">{text}</span>
                </span>
              </>
            );
            return (
              <li key={title} className={`flex justify-center ${i > 0 ? 'lg:border-l lg:border-gold-500/40' : ''} ${i % 2 === 1 ? 'max-lg:border-l max-lg:border-gold-500/40' : ''}`}>
                {whatsapp ? (
                  <button onClick={() => openWhatsApp()} className="flex items-center gap-2.5 sm:gap-4 px-2 cursor-pointer hover:opacity-80 transition-opacity">
                    {body}
                  </button>
                ) : (
                  <div className="flex items-center gap-2.5 sm:gap-4 px-2">{body}</div>
                )}
              </li>
            );
          })}
        </ul>
      </section>
    </>
  );
};
