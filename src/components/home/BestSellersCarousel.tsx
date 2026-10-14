import React, { useRef } from 'react';
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';
import { SareeProduct } from '../../types';
import { ProductCard } from '../product/ProductCard';

interface BestSellersCarouselProps {
  products: SareeProduct[];
  onSelectProduct: (product: SareeProduct) => void;
  onQuickView: (product: SareeProduct) => void;
  onViewAllBestSellers: () => void;
}

export const BestSellersCarousel: React.FC<BestSellersCarouselProps> = ({
  products,
  onSelectProduct,
  onQuickView,
  onViewAllBestSellers,
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const bestSellers = products.filter((p) => p.isBestSeller);
  const displayItems = bestSellers.length > 0 ? bestSellers : products;

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const offset = direction === 'left' ? -350 : 350;
      scrollRef.current.scrollBy({ left: offset, behavior: 'smooth' });
    }
  };

  return (
    <section className="py-20 lg:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 overflow-hidden">
      {/* Section Header with Carousel Arrows */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
        <div>
          <span className="text-xs uppercase tracking-[0.2em] text-gold-700 font-semibold">
            Beloved By Our Patrons
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-burgundy-950 mt-1">
            Best Sellers
          </h2>
          <p className="text-sm text-stone-600 font-sans mt-1">
            Signature handloom weaves that our royal clientele return to time and again.
          </p>
        </div>

        <div className="flex items-center gap-2 self-end sm:self-auto">
          <button
            onClick={() => scroll('left')}
            className="w-10 h-10 border border-sand bg-white hover:bg-cream text-charcoal flex items-center justify-center transition-colors"
            aria-label="Scroll best sellers left"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={() => scroll('right')}
            className="w-10 h-10 border border-sand bg-white hover:bg-cream text-charcoal flex items-center justify-center transition-colors"
            aria-label="Scroll best sellers right"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Horizontal Scroll Grid */}
      <div
        ref={scrollRef}
        className="flex gap-6 overflow-x-auto pb-6 scrollbar-none snap-x"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {displayItems.map((product) => (
          <div key={product.id} className="w-[280px] sm:w-[320px] shrink-0 snap-start">
            <ProductCard
              product={product}
              onSelect={onSelectProduct}
              onQuickView={onQuickView}
            />
          </div>
        ))}
      </div>

      <div className="text-center mt-6">
        <button
          onClick={onViewAllBestSellers}
          className="text-xs font-semibold uppercase tracking-widest text-burgundy-900 hover:text-gold-700 inline-flex items-center gap-1.5 transition-colors border-b border-burgundy-900 pb-0.5"
        >
          <span>Explore All Patron Favorites</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </section>
  );
};
