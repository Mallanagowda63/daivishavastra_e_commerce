import React from 'react';
import { SectionHeading } from '../common/ContentBlocks';

const PHOTOS = [3086, 3093, 3094, 3091, 3092, 3095, 3096].map((n) => `/images/catalog/${n}.webp`);

/** Home page: the full collection photographed together. Wide shots fill the row; the two tall ones span two rows. */
export const CatalogGallery: React.FC<{ onShop: () => void }> = ({ onShop }) => (
  <section className="bg-[#fbf6ee] border-b border-gold-500/30">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12">
      <SectionHeading kicker="Our Catalog" title="The Daivisha Vastra Collection" />
      <div className="mt-8 grid grid-cols-2 lg:grid-cols-4 auto-rows-[160px] sm:auto-rows-[220px] lg:auto-rows-[200px] gap-3">
        {PHOTOS.map((src, i) => (
          <button
            key={src}
            onClick={onShop}
            className={`group relative overflow-hidden border border-gold-500/40 cursor-pointer ${
              i === 0 ? 'col-span-2 row-span-2' : /3093|3094/.test(src) ? 'row-span-2' : ''
            }`}
          >
            <img
              src={src}
              alt="Daivisha Vastra sarees arranged together with flowers"
              loading="lazy"
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
          </button>
        ))}
      </div>
      <div className="mt-8 text-center">
        <button
          onClick={onShop}
          className="px-7 py-3 border border-burgundy-800 text-burgundy-800 hover:bg-burgundy-800 hover:text-ivory font-serif text-sm tracking-[0.12em] uppercase transition-colors cursor-pointer"
        >
          Shop all sarees
        </button>
      </div>
    </div>
  </section>
);
