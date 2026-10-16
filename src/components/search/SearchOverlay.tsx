import React, { useState, useEffect, useRef } from 'react';
import { Search, X, ArrowRight, Sparkles } from 'lucide-react';
import { SareeProduct } from '../../types';
import { ImageWithFallback } from '../common/ImageWithFallback';

interface SearchOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  products: SareeProduct[];
  onSelectProduct: (product: SareeProduct) => void;
}

export const SearchOverlay: React.FC<SearchOverlayProps> = ({
  isOpen,
  onClose,
  products,
  onSelectProduct,
}) => {
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const trendingKeywords = [
    'Silk Saree',
    'Wedding Saree',
    'Gajji Silk',
    'Paithani',
    'Kalamkari',
    'Mirror Work',
  ];

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    } else {
      setQuery('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const filteredProducts = query.trim()
    ? products.filter((p) => {
        const q = query.toLowerCase();
        return (
          p.name.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          p.fabric.toLowerCase().includes(q) ||
          p.collection.toLowerCase().includes(q) ||
          p.color.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q)
        );
      })
    : [];

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="search-modal-heading"
      className="fixed inset-0 z-50 bg-[#faf7f2]/98 backdrop-blur-md overflow-y-auto animate-in fade-in"
    >
      <div className="max-w-4xl mx-auto px-4 py-8 sm:py-12">
        {/* Top Controls: Close button */}
        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="p-2 text-stone-500 hover:text-charcoal transition-colors flex items-center gap-1.5 text-xs uppercase tracking-wider font-medium"
            aria-label="Close search overlay"
          >
            <span>Close</span>
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Big Search Input */}
        <div className="mt-6 border-b-2 border-burgundy-950 pb-4">
          <div className="flex items-center gap-4">
            <Search className="w-6 h-6 text-burgundy-950 shrink-0" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by silk, weave, motif, occasion (e.g. Gajji Silk, Paithani)..."
              className="w-full bg-transparent text-xl sm:text-2xl font-serif text-burgundy-950 placeholder:text-stone-400 focus:outline-none"
            />
            {query && (
              <button
                onClick={() => setQuery('')}
                className="text-stone-400 hover:text-charcoal p-1"
                aria-label="Clear query"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>

        {/* Trending Searches */}
        {!query && (
          <div className="mt-8 space-y-3">
            <span className="text-[11px] uppercase tracking-widest text-stone-400 font-semibold block">
              Trending Searches
            </span>
            <div className="flex flex-wrap gap-2">
              {trendingKeywords.map((kw) => (
                <button
                  key={kw}
                  onClick={() => setQuery(kw)}
                  className="px-3.5 py-1.5 bg-cream/70 hover:bg-cream border border-sand text-xs text-charcoal font-medium transition-colors"
                >
                  {kw}
                </button>
              ))}
            </div>

            {/* Popular Curations Grid */}
            <div className="mt-12 pt-8 border-t border-sand">
              <span className="text-[11px] uppercase tracking-widest text-stone-400 font-semibold block mb-4">
                Popular In High Demand
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {products.slice(0, 4).map((item) => (
                  <div
                    key={item.id}
                    onClick={() => {
                      onSelectProduct(item);
                      onClose();
                    }}
                    className="group cursor-pointer space-y-2"
                  >
                    <div className="aspect-[3/4] bg-[#eae2d6] overflow-hidden">
                      <ImageWithFallback
                        src={item.images[0]}
                        alt={item.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                    <div>
                      <h4 className="font-serif text-xs font-semibold text-charcoal group-hover:text-burgundy-900 line-clamp-1">
                        {item.name}
                      </h4>
                      <p className="text-[11px] text-burgundy-950 font-medium tabular-nums mt-0.5">
                        ₹{item.sellingPrice.toLocaleString('en-IN')}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Live Search Results */}
        {query && (
          <div className="mt-8 space-y-4">
            <div className="flex items-center justify-between text-xs text-stone-500">
              <span>
                Found {filteredProducts.length} matching weaves for &ldquo;{query}&rdquo;
              </span>
            </div>

            {filteredProducts.length === 0 ? (
              <div className="py-16 text-center text-stone-500">
                <p className="font-serif text-lg text-charcoal">No sarees found matching &ldquo;{query}&rdquo;</p>
                <p className="text-xs mt-1">Try searching for &quot;Silk&quot;, &quot;Wedding&quot;, &quot;Gajji&quot;, or &quot;Paithani&quot;.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {filteredProducts.map((prod) => (
                  <div
                    key={prod.id}
                    onClick={() => {
                      onSelectProduct(prod);
                      onClose();
                    }}
                    className="group p-3 bg-white border border-sand hover:border-gold-600 transition-all flex gap-3.5 cursor-pointer"
                  >
                    <div className="w-20 aspect-[3/4] bg-[#eae2d6] overflow-hidden shrink-0">
                      <ImageWithFallback
                        src={prod.images[0]}
                        alt={prod.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                    <div className="flex-1 flex flex-col justify-between text-xs">
                      <div>
                        <span className="text-[10px] uppercase tracking-wider text-gold-700 font-semibold block">
                          {prod.fabric} · {prod.category}
                        </span>
                        <h4 className="font-serif text-sm font-semibold text-charcoal group-hover:text-burgundy-900 mt-1 line-clamp-1">
                          {prod.name}
                        </h4>
                        <p className="text-[11px] text-stone-500 line-clamp-1 mt-0.5">
                          {prod.color}
                        </p>
                      </div>

                      <div className="flex items-center justify-between mt-2 pt-2 border-t border-sand/50">
                        <span className="font-bold text-burgundy-950 tabular-nums font-sans">
                          ₹{prod.sellingPrice.toLocaleString('en-IN')}
                        </span>
                        <span className="text-[11px] font-medium text-stone-400 group-hover:text-burgundy-900 flex items-center gap-1 transition-colors">
                          View Saree <ArrowRight className="w-3 h-3" />
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
