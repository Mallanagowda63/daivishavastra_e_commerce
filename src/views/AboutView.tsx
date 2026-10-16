import React from 'react';
import { ArrowRight } from 'lucide-react';
import { LotusMark } from '../components/layout/BrandEmblem';

interface AboutViewProps {
  onExploreCatalog: () => void;
}

const Divider: React.FC<{ className?: string }> = ({ className = '' }) => (
  <div className={`flex items-center justify-center gap-2 text-gold-600 ${className}`} aria-hidden="true">
    <span className="h-px w-16 sm:w-24 bg-gradient-to-r from-transparent to-gold-500" />
    <LotusMark className="w-5 h-5" />
    <span className="h-px w-16 sm:w-24 bg-gradient-to-l from-transparent to-gold-500" />
  </div>
);

export const AboutView: React.FC<AboutViewProps> = ({ onExploreCatalog }) => {
  return (
    <div>
      {/* Story: portrait in a temple arch beside the brand story. On large screens the artwork is one 16:9 panel
          (text sized in container units so it scales with it); on small screens the portrait stacks above the text. */}
      <section className="bg-[#f8ebdb] border-b border-gold-500/40">
        <div
          className="relative max-w-[1920px] mx-auto lg:aspect-[16/9] lg:bg-[url('/images/about_banner.jpg?v=4')] lg:bg-cover lg:bg-center"
          style={{ containerType: 'inline-size' }}
        >
          <img
            src="/images/about_portrait.jpg?v=4"
            alt="Smiling woman in a mustard silk saree with a pink blouse, framed by a temple arch with brass lamps and jasmine"
            className="lg:hidden w-full max-w-md mx-auto block"
          />

          <div className="px-5 sm:px-8 py-10 lg:p-0 lg:absolute lg:top-[14.5%] lg:left-[51%] lg:right-[5.5%] text-stone-700">
            <header className="text-center">
              <p className="font-serif uppercase text-gold-700 tracking-[0.35em] text-lg lg:text-[1.75cqw]">About</p>
              <Divider className="mt-1 lg:mt-[0.3cqw]" />
              <h1
                className="mt-2 lg:mt-[0.6cqw] text-burgundy-800 font-medium leading-none text-4xl sm:text-5xl lg:text-[4.6cqw]"
                style={{ fontFamily: "'Cinzel', serif", color: '#6b1418' }}
              >
                Daivisha Vastra
              </h1>
              <p className="mt-3 lg:mt-[1.4cqw] font-serif italic text-[#6b1418] text-xl sm:text-2xl lg:text-[2.15cqw]">
                More than attire. A legacy in every thread.
              </p>
            </header>

            <div className="mt-6 lg:mt-[2.4cqw] space-y-4 lg:space-y-[1.7cqw] lg:pr-[7%] font-serif text-lg leading-relaxed lg:text-[1.34cqw] lg:leading-[1.4] text-[#3d3530]">
              <p>
                At Daivisha Vastra, we believe every saree has a story to tell — a story woven with tradition, culture, grace,
                and timeless beauty.
              </p>
              <p>
                Rooted in the richness of Indian heritage, we bring you sarees that reflect the depth of our traditions while
                embracing the elegance of today. From cherished handlooms to exquisite silks, distinctive motifs, and intricate
                borders, every saree holds a charm that goes beyond the fabric itself.
              </p>
              <p>
                We believe a saree is more than something you wear. It becomes a part of your celebrations, your memories, and
                the moments you treasure forever.
              </p>
              <p>
                Through Daivisha Vastra, we invite you to discover the stories behind every saree, appreciate the beauty in
                every detail, and find a piece that feels uniquely yours.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Closing */}
      <section className="max-w-3xl mx-auto px-4 sm:px-6 py-14 sm:py-20 text-center">
        <p className="font-serif text-xl sm:text-2xl leading-relaxed text-stone-700">
          Welcome to a world where every saree has a story, and every story deserves to be cherished.
        </p>
        <p className="mt-4 font-serif text-2xl sm:text-3xl text-burgundy-800">Welcome to Daivisha Vastra.</p>
        <Divider className="my-8" />
        <button
          onClick={onExploreCatalog}
          className="inline-flex items-center gap-3 px-8 py-3.5 bg-burgundy-800 hover:bg-burgundy-900 text-ivory font-serif text-base tracking-[0.12em] uppercase shadow-md transition-colors cursor-pointer"
        >
          Explore our sarees
          <ArrowRight className="w-4 h-4" />
        </button>
      </section>
    </div>
  );
};
