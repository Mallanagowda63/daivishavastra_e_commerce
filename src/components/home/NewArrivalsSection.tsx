import React from 'react';
import { ArrowRight } from 'lucide-react';
import { SareeProduct } from '../../types';
import { ProductCard } from '../product/ProductCard';

interface NewArrivalsSectionProps {
  products: SareeProduct[];
  onSelectProduct: (product: SareeProduct) => void;
  onQuickView: (product: SareeProduct) => void;
  onViewAllNewArrivals: () => void;
}

export const NewArrivalsSection: React.FC<NewArrivalsSectionProps> = ({
  products,
  onSelectProduct,
  onQuickView,
  onViewAllNewArrivals,
}) => {
  // Show new arrival products, or fallback to first 4
  const newArrivals = products.filter((p) => p.isNewArrival).slice(0, 4);
  const displayItems = newArrivals.length > 0 ? newArrivals : products.slice(0, 4);

  return (
    <section className="py-10 lg:py-12 bg-cream/30 border-t border-b border-sand">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-7">
          <div>
            <span className="text-xs uppercase tracking-[0.2em] text-gold-700 font-semibold">
              Fresh Off The Handlooms
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-burgundy-950 mt-1">
              New Arrivals
            </h2>
            <p className="text-sm text-stone-600 font-sans mt-1">
              Freshly curated pieces you&apos;ll love, woven for discerning connoisseurs.
            </p>
          </div>

          <button
            onClick={onViewAllNewArrivals}
            className="self-start sm:self-auto text-xs font-semibold uppercase tracking-widest text-burgundy-900 hover:text-gold-700 flex items-center gap-1.5 transition-colors border-b border-burgundy-900 hover:border-gold-700 pb-0.5"
          >
            <span>View All New Arrivals</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Product Cards Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
          {displayItems.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onSelect={onSelectProduct}
              onQuickView={onQuickView}
            />
          ))}
        </div>
      </div>
    </section>
  );
};
