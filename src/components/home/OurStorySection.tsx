import React from 'react';
import { LotusMark } from '../layout/BrandEmblem';

const Divider: React.FC<{ className?: string }> = ({ className = '' }) => (
  <div className={`flex items-center justify-center gap-2 text-gold-600 ${className}`} aria-hidden="true">
    <span className="h-px w-16 sm:w-24 bg-gradient-to-r from-transparent to-gold-500" />
    <LotusMark className="w-5 h-5" />
    <span className="h-px w-16 sm:w-24 bg-gradient-to-l from-transparent to-gold-500" />
  </div>
);

/**
 * Our Story: portrait in a temple arch beside the brand story. On large screens the artwork is one 16:9 panel
 * (text sized in container units so it scales with it); on small screens the portrait stacks above the text.
 * Lives on the home page; the "Our Story" links scroll here (#our-story).
 */
export const OurStorySection: React.FC = () => (
  <section id="our-story" className="bg-[#f8ebdb] border-y border-gold-500/40 scroll-mt-36">
    <div
      className="relative max-w-[1920px] mx-auto lg:aspect-[16/9] lg:bg-[url('/images/about_banner.jpg?v=5')] lg:bg-cover lg:bg-center"
      style={{ containerType: 'inline-size' }}
    >
      <img
        src="/images/about_portrait.jpg?v=5"
        alt="Smiling woman in a wine embellished outfit, framed by a temple arch with brass lamps and jasmine"
        loading="lazy"
        className="lg:hidden w-full max-w-md mx-auto block"
      />

      <div className="px-5 sm:px-8 py-10 lg:p-0 lg:absolute lg:top-[14.5%] lg:left-[51%] lg:right-[5.5%] text-stone-700">
        <header className="text-center">
          <p className="font-serif uppercase text-gold-700 tracking-[0.35em] text-lg lg:text-[1.75cqw]">Our Story</p>
          <Divider className="mt-1 lg:mt-[0.3cqw]" />
          <h2
            className="mt-2 lg:mt-[0.6cqw] font-medium leading-none text-4xl sm:text-5xl lg:text-[4.6cqw]"
            style={{ fontFamily: "'Cinzel', serif", color: '#6b1418' }}
          >
            Daivisha Vastra
          </h2>
          <p className="mt-3 lg:mt-[1.4cqw] font-serif italic text-[#6b1418] text-xl sm:text-2xl lg:text-[2.15cqw]">
            Elegant attire rooted in Indian heritage.
          </p>
        </header>

        <div className="mt-6 lg:mt-[2.4cqw] space-y-4 lg:space-y-[1.7cqw] lg:pr-[7%] font-serif text-lg leading-relaxed lg:text-[1.34cqw] lg:leading-[1.4] text-[#3d3530]">
          <p>
            Some sarees remind us of a celebration; others carry the memory of a person, a place or a moment. Their colours, textures
            and details can connect generations and make ordinary days feel special.
          </p>
          <p>
            Daivisha Vastra was founded by Daivisha with the wish to celebrate these connections—to bring heritage-inspired drapes to women who value
            tradition, beauty and personal style.
          </p>
          <p>
            Our story continues with every collection we curate and every customer who finds a saree that feels like her own. We invite
            you to discover a drape, make it part of your story and pass its beauty forward.
          </p>
        </div>
      </div>
    </div>
  </section>
);
