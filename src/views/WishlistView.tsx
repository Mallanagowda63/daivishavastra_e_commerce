import React, { useState } from 'react';
import { Heart, ShoppingBag, Trash2, Share2, ArrowRight, Check } from 'lucide-react';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';
import { SareeProduct } from '../types';
import { ImageWithFallback } from '../components/common/ImageWithFallback';

interface WishlistViewProps {
  onSelectProduct: (product: SareeProduct) => void;
  onExploreCatalog: () => void;
}

export const WishlistView: React.FC<WishlistViewProps> = ({
  onSelectProduct,
  onExploreCatalog,
}) => {
  const { wishlist, removeFromWishlist, clearWishlist } = useWishlist();
  const { addToCart } = useCart();
  const [copied, setCopied] = useState(false);

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleMoveToBag = (product: SareeProduct) => {
    addToCart(product, 1, product.color);
    removeFromWishlist(product.id);
  };

  return (
    <div className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-sand pb-6 mb-8">
        <div>
          <span className="text-xs uppercase tracking-[0.2em] text-gold-700 font-semibold block">
            Personal Atelier Curation
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-burgundy-950 mt-1">
            Your Wishlist ({wishlist.length})
          </h1>
          <p className="text-xs sm:text-sm text-stone-600 font-sans mt-1">
            Saved heirloom sarees and trousseau selections reserved for your review.
          </p>
        </div>

        {wishlist.length > 0 && (
          <div className="flex items-center gap-3">
            <button
              onClick={handleShare}
              className="px-4 py-2 border border-sand bg-white text-xs font-semibold uppercase tracking-wider text-charcoal hover:border-burgundy-950 flex items-center gap-1.5 transition-colors"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Share2 className="w-3.5 h-3.5" />}
              <span>{copied ? 'Link Copied!' : 'Share Wishlist'}</span>
            </button>
            <button
              onClick={clearWishlist}
              className="text-xs text-stone-500 hover:text-red-700 font-medium uppercase tracking-wider underline transition-colors"
            >
              Clear All
            </button>
          </div>
        )}
      </div>

      {/* Content */}
      {wishlist.length === 0 ? (
        <div className="py-24 text-center max-w-md mx-auto space-y-4">
          <div className="w-16 h-16 rounded-full bg-cream flex items-center justify-center mx-auto text-stone-400">
            <Heart className="w-8 h-8" />
          </div>
          <h2 className="font-serif text-2xl font-bold text-charcoal">
            Your Wishlist is Empty
          </h2>
          <p className="text-xs text-stone-500 font-sans leading-relaxed">
            As you explore our sarees, click the heart icon on any drape to preserve it in your personal curation.
          </p>
          <div className="pt-2">
            <button
              onClick={onExploreCatalog}
              className="px-8 py-3.5 bg-burgundy-950 text-gold-300 font-semibold text-xs tracking-widest uppercase hover:bg-burgundy-900 transition-colors shadow-md inline-flex items-center gap-2"
            >
              <span>Explore The Boutique</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {wishlist.map((product) => (
            <div
              key={product.id}
              className="group bg-white border border-sand shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div
                onClick={() => onSelectProduct(product)}
                className="aspect-[3/4] bg-[#f1e9df] overflow-hidden cursor-pointer relative"
              >
                <ImageWithFallback
                  src={product.images[0]}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    removeFromWishlist(product.id);
                  }}
                  className="absolute top-3 right-3 p-2 rounded-full bg-white/90 text-stone-500 hover:text-red-700 transition-colors shadow-sm"
                  aria-label="Remove from wishlist"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                <div>
                  <span className="text-[10px] uppercase tracking-wider text-stone-400 font-semibold block">
                    {product.fabric} · {product.category}
                  </span>
                  <h3
                    onClick={() => onSelectProduct(product)}
                    className="font-serif text-base font-semibold text-charcoal hover:text-burgundy-900 line-clamp-1 cursor-pointer mt-0.5"
                  >
                    {product.name}
                  </h3>
                  <div className="mt-2 flex items-baseline gap-2 font-sans">
                    <span className="font-bold text-sm text-burgundy-950 tabular-nums">
                      ₹{product.sellingPrice.toLocaleString('en-IN')}
                    </span>
                    {product.originalPrice > product.sellingPrice && (
                      <span className="text-xs text-stone-400 line-through tabular-nums">
                        ₹{product.originalPrice.toLocaleString('en-IN')}
                      </span>
                    )}
                  </div>
                </div>

                <button
                  onClick={() => handleMoveToBag(product)}
                  className="w-full py-2.5 bg-burgundy-950 hover:bg-burgundy-900 text-gold-300 font-semibold text-xs tracking-wider uppercase flex items-center justify-center gap-2 transition-colors"
                >
                  <ShoppingBag className="w-3.5 h-3.5" />
                  <span>Move to Bag</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
