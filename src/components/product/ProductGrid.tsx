import React from 'react';
import { SareeProduct } from '../../types';
import { ProductCard } from './ProductCard';
import { Sparkles } from 'lucide-react';

interface ProductGridProps {
  products: SareeProduct[];
  isLoading?: boolean;
  onSelectProduct: (product: SareeProduct) => void;
  onQuickView: (product: SareeProduct) => void;
  columns?: 3 | 4;
}

export const ProductGrid: React.FC<ProductGridProps> = ({
  products,
  isLoading = false,
  onSelectProduct,
  onQuickView,
  columns = 4,
}) => {
  if (isLoading) {
    return (
      <div
        className={`grid grid-cols-2 md:grid-cols-3 ${
          columns === 4 ? 'lg:grid-cols-4' : 'lg:grid-cols-3'
        } gap-4 sm:gap-6 lg:gap-8`}
      >
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="animate-pulse space-y-3">
            <div className="aspect-[3/4] bg-[#eae2d6] w-full" />
            <div className="h-3 bg-[#eae2d6] w-1/3" />
            <div className="h-4 bg-[#eae2d6] w-3/4" />
            <div className="h-4 bg-[#eae2d6] w-1/2" />
          </div>
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="py-20 text-center flex flex-col items-center justify-center border border-dashed border-sand p-8 bg-cream/30">
        <Sparkles className="w-8 h-8 text-gold-600 mb-3" />
        <h3 className="font-serif text-xl font-medium text-charcoal">
          No Sarees Match Your Current Curation
        </h3>
        <p className="text-xs text-stone-500 max-w-md mt-2 font-sans">
          We handcraft each collection in limited artisanal batches. Try clearing some filters or searching for our signature Gajji silk sarees.
        </p>
      </div>
    );
  }

  return (
    <div
      className={`grid grid-cols-2 md:grid-cols-3 ${
        columns === 4 ? 'lg:grid-cols-4' : 'lg:grid-cols-3'
      } gap-4 sm:gap-6 lg:gap-8`}
    >
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          onSelect={onSelectProduct}
          onQuickView={onQuickView}
        />
      ))}
    </div>
  );
};
