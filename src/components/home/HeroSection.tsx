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
  alt: string;
  /** Full-width photo with the text over its dark left side (otherwise photo sits on the right). */
  fullBleed?: boolean;
  /** object-position per breakpoint, so the subject stays in frame on phones. */
  position: string;
  /** Width / offset of this slide's text block. */
  textPlacement: string;
  title: React.ReactNode;
  text: string;
  cta: string;
  action: 'story' | 'new' | 'collections';
  /** Small vertical tagline on the left (large screens). */
  tagline?: boolean;
  /** Small gold label above the headline. */
  kicker: string;
};

const SLIDES: Slide[] = [
  {
    image: '/images/hero_temple_clean.jpg',
    alt: 'Woman in a maroon and gold silk saree holding jasmine in a temple courtyard lit by brass lamps',
    fullBleed: true,
    position: 'object-[73%_20%] md:object-[62%_center] lg:object-center',
    kicker: 'Rooted in tradition',
    textPlacement: 'w-full md:w-[52%] lg:w-[36%] lg:ml-[13%] xl:ml-[15%]',
    title: (
      <>
        Tradition
        <br />
        Woven <em className="italic font-normal">for</em>
        <br />
        Today
      </>
    ),
    text: "At Daivisha Vastra, we celebrate India's rich textile heritage through sarees that blend timeless craftsmanship with contemporary elegance.",
    cta: 'Explore our story',
    action: 'story',
    tagline: true,
  },
  {
    image: '/images/hero_saree_model_1791372718962.jpg',
    alt: 'Model in a maroon Kanjivaram silk saree with heirloom jewellery',
    position: 'object-[50%_8%] md:object-[50%_15%]',
    kicker: 'The festive edit',
    textPlacement: 'w-full md:w-[46%] lg:w-[44%]',
    title: (
      <>
        Timeless
        <br />
        Elegance, Woven
        <br />
        <em className="italic font-normal">for</em> You
      </>
    ),
    text: 'Handwoven pure Kanjivaram and Banarasi heirlooms, crafted with tradition and artistry to be treasured for generations.',
    cta: 'Shop new arrivals',
    action: 'new',
  },
  {
    image: '/images/wedding_edit_banner_1791372730952.jpg',
    alt: 'Bride in a red zardozi saree in a candle-lit palace courtyard',
    position: 'object-[50%_22%] md:object-[50%_35%]',
    kicker: 'The bridal edit',
    textPlacement: 'w-full md:w-[46%] lg:w-[44%]',
    title: (
      <>
        The Royal
        <br />
        Wedding <em className="italic font-normal">Edit</em>
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
        className="relative w-full h-[clamp(520px,calc(100svh-190px),680px)] sm:h-[640px] lg:h-[620px] xl:h-[clamp(560px,calc(100vw/2.83),760px)] overflow-hidden bg-[#2a140b] text-ivory font-arial"
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
        {/* Warm temple-light backdrop (behind the half-width photos) */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_30%_40%,#5a3418_0%,#3a1d0e_45%,#24110a_100%)]" />

        {/* Slide photos */}
        {SLIDES.map((s, i) => {
          const active = i === index;
          const zoom = active
            ? 'scale-100 transition-transform duration-[8000ms] ease-out'
            : 'scale-[1.05] transition-transform duration-[1600ms]';
          return (
            <div
              key={s.image}
              className={`absolute inset-y-0 right-0 overflow-hidden transition-opacity duration-[1600ms] ease-in-out motion-reduce:transition-none ${
                s.fullBleed ? 'w-full' : 'w-full md:w-[62%]'
              } ${active ? 'opacity-100' : 'opacity-0'}`}
              aria-hidden={!active}
            >
              <img
                src={s.image}
                alt={s.alt}
                className={`w-full h-full object-cover ${s.position} will-change-transform motion-reduce:transition-none ${zoom} ${
                  s.fullBleed ? '' : '[mask-image:linear-gradient(to_right,transparent,black_28%)] max-md:[mask-image:none]'
                }`}
              />
              {/* Phones: photo clear at the top, deep shade at the bottom behind the text */}
              <div className="md:hidden absolute inset-0 bg-gradient-to-t from-[#1a0a05] from-5% via-[#1a0a05]/75 via-40% to-transparent to-70%" />
              {s.fullBleed && (
                <>
                  {/* Tablets: shade behind the centred text */}
                  <div className="hidden md:block lg:hidden absolute inset-0 bg-gradient-to-t from-[#1c0d06]/90 via-[#1c0d06]/55 to-[#1c0d06]/25" />
                  {/* Desktop: deepen the photo's dark left side under the text */}
                  <div className="hidden lg:block absolute inset-0 bg-[linear-gradient(90deg,rgba(28,13,6,0.55)_0%,rgba(28,13,6,0.45)_35%,rgba(28,13,6,0)_60%)]" />
                </>
              )}
            </div>
          );
        })}
        <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/40 to-transparent pointer-events-none" />

        {/* Left tagline (slide 1, large screens) */}
        {SLIDES.map((s, i) =>
          s.tagline ? (
            <div
              key={`${s.cta}-tagline`}
              className={`hidden xl:flex absolute z-10 left-[3%] bottom-[14%] w-44 flex-col items-center text-center text-[#f3dfae] leading-snug [text-shadow:0_2px_10px_rgba(0,0,0,0.6)] transition-opacity duration-1000 ${
                i === index ? 'opacity-100 delay-500' : 'opacity-0'
              }`}
              aria-hidden="true"
            >
              <p className="text-[15px] font-bold tracking-[0.22em] uppercase">Sarees</p>
              <p className="text-sm italic text-[#f3dfae]/85">that carry</p>
              <p className="text-[15px] font-bold tracking-[0.22em] uppercase">Culture</p>
              <p className="text-[15px] font-bold tracking-[0.22em] uppercase">Craftsmanship</p>
              <p className="text-sm italic text-[#f3dfae]/85">and</p>
              <p className="text-[15px] font-bold tracking-[0.22em] uppercase">Stories</p>
              <LotusMark className="w-6 h-6 mt-2 text-gold-400" />
            </div>
          ) : null
        )}

        {/* Slide copy */}
        <div className="relative z-10 h-full px-5 sm:px-16 lg:px-20 flex items-end md:items-center pb-14 md:pb-0 pointer-events-none">
          {/* All slides share one grid cell, so text cross-fades in place without the layout jumping */}
          <div className="w-full grid text-center">
            {SLIDES.map((s, i) => (
              <div
                key={s.cta}
                className={`[grid-area:1/1] self-end md:self-center ${s.textPlacement} transition-all ease-out motion-reduce:transition-none ${
                  i === index
                    ? 'opacity-100 translate-y-0 duration-[1000ms] delay-300 pointer-events-auto'
                    : 'opacity-0 translate-y-5 duration-500 pointer-events-none'
                }`}
                aria-hidden={i !== index}
                aria-live={i === index ? 'polite' : undefined}
              >
                <p className="mb-3 text-[11px] sm:text-xs font-bold tracking-[0.3em] uppercase text-gold-400 [text-shadow:0_1px_6px_rgba(0,0,0,0.5)]">
                  {s.kicker}
                </p>
                <h1 className="text-[38px] sm:text-6xl xl:text-[68px] font-bold tracking-tight leading-[1.05] text-[#f3dfae] [text-shadow:0_2px_16px_rgba(0,0,0,0.45)]">
                  {s.title}
                </h1>
                <div className="flex items-center justify-center gap-3 my-4 sm:my-6 text-gold-400" aria-hidden="true">
                  <span className="h-px w-16 sm:w-20 bg-gradient-to-r from-transparent to-gold-400" />
                  <LotusMark className="w-5 h-5" />
                  <span className="h-px w-16 sm:w-20 bg-gradient-to-l from-transparent to-gold-400" />
                </div>
                <p className="text-[15px] sm:text-lg leading-relaxed text-white/90 max-w-md mx-auto [text-shadow:0_1px_8px_rgba(0,0,0,0.5)]">
                  {s.text}
                </p>
                <button
                  onClick={() => runAction(s.action)}
                  tabIndex={i === index ? 0 : -1}
                  className="mt-6 sm:mt-8 w-full md:w-auto inline-flex items-center justify-center gap-3 px-6 sm:px-7 py-3.5 bg-[#5e1424]/90 hover:bg-[#6f1b31] border border-gold-500/80 text-ivory text-[13px] sm:text-sm font-bold tracking-[0.18em] uppercase shadow-lg transition-colors cursor-pointer"
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
          className="hidden md:grid absolute left-3 sm:left-5 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full border border-ivory/70 text-ivory place-items-center hover:bg-white/15 transition-colors cursor-pointer"
          aria-label="Previous slide"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <button
          onClick={() => go(index + 1)}
          className="hidden md:grid absolute right-3 sm:right-5 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-ivory/70 text-charcoal place-items-center hover:bg-ivory transition-colors cursor-pointer"
          aria-label="Next slide"
        >
          <ChevronRight className="w-5 h-5" />
        </button>

        {/* Dots */}
        <div className="absolute bottom-5 md:bottom-6 left-1/2 -translate-x-1/2 z-20 flex gap-2.5">
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
