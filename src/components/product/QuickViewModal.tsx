import React, { useState } from 'react';
import { X, Heart, ShoppingBag, ArrowRight, ShieldCheck, Check } from 'lucide-react';
import { SareeProduct } from '../../types';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { ImageWithFallback } from '../common/ImageWithFallback';

interface QuickViewModalProps {
  product: SareeProduct | null;
  isOpen: boolean;
  onClose: () => void;
  onViewDetails: (product: SareeProduct) => void;
}

export const QuickViewModal: React.FC<QuickViewModalProps> = ({
  product,
  isOpen,
  onClose,
  onViewDetails,
}) => {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [selectedColor, setSelectedColor] = useState<string>('');

  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();

  if (!isOpen || !product) return null;

  const currentColor = selectedColor || product.color;
  const isFavorited = isInWishlist(product.id);

  const handleAdd = () => {
    addToCart(product, quantity, currentColor);
    onClose();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="quick-view-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in"
    >
      <div
        className="relative bg-[#faf7f2] w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl border border-sand flex flex-col md:flex-row"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 w-8 h-8 rounded-full bg-white/80 hover:bg-white text-charcoal flex items-center justify-center transition-colors shadow-sm"
          aria-label="Close Quick View"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Left: Product Images */}
        <div className="md:w-1/2 p-6 flex flex-col justify-between bg-cream/30 border-b md:border-b-0 md:border-r border-sand">
          <div className="relative aspect-[3/4] w-full overflow-hidden bg-white shadow-sm">
            <ImageWithFallback
              src={product.images[selectedImageIndex] || product.images[0]}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Thumbnail list */}
          {product.images.length > 1 && (
            <div className="flex gap-2 mt-4 overflow-x-auto pb-1">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImageIndex(idx)}
                  className={`w-14 h-18 shrink-0 overflow-hidden border-2 transition-all ${
                    selectedImageIndex === idx ? 'border-burgundy-900 scale-105' : 'border-transparent opacity-70'
                  }`}
                >
                  <ImageWithFallback src={img} alt="Thumbnail" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right: Purchase Module */}
        <div className="md:w-1/2 p-6 md:p-8 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-xs text-stone-500 uppercase tracking-widest font-medium">
              <span>{product.fabric}</span>
              <span className="text-gold-700 font-semibold">{product.category}</span>
            </div>

            <h2 id="quick-view-title" className="font-serif text-2xl font-bold text-burgundy-950 mt-2 leading-snug">
              {product.name}
            </h2>

            {/* Price */}
            <div className="mt-3 flex items-baseline gap-3 font-sans">
              <span className="text-xl font-bold text-burgundy-900 tabular-nums">
                ₹{product.sellingPrice.toLocaleString('en-IN')}
              </span>
              {product.originalPrice > product.sellingPrice && (
                <>
                  <span className="text-sm text-stone-400 line-through tabular-nums">
                    ₹{product.originalPrice.toLocaleString('en-IN')}
                  </span>
                  <span className="text-xs font-semibold text-gold-700 tracking-wider">
                    {product.discountPercentage}% OFF
                  </span>
                </>
              )}
            </div>

            <p className="text-xs text-stone-600 mt-4 leading-relaxed font-sans line-clamp-3">
              {product.description}
            </p>

            {/* Color Swatches */}
            {product.colorVariants && product.colorVariants.length > 0 && (
              <div className="mt-5">
                <span className="text-xs tracking-wider uppercase font-semibold text-charcoal block mb-2">
                  Color Shade: <span className="font-normal text-stone-600">{currentColor}</span>
                </span>
                <div className="flex items-center gap-2">
                  {product.colorVariants.map((v) => (
                    <button
                      key={v.name}
                      onClick={() => setSelectedColor(v.name)}
                      className={`w-6 h-6 rounded-full border-2 transition-transform ${
                        currentColor === v.name ? 'border-burgundy-900 scale-110' : 'border-stone-300'
                      }`}
                      style={{ backgroundColor: v.hex }}
                      title={v.name}
                      aria-label={`Color shade ${v.name}`}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Quantity Selector */}
            <div className="mt-5 flex items-center gap-4">
              <span className="text-xs tracking-wider uppercase font-semibold text-charcoal">
                Quantity:
              </span>
              <div className="flex items-center border border-sand bg-white">
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="px-3 py-1 text-charcoal hover:bg-cream transition-colors text-sm"
                  aria-label="Decrease quantity"
                >
                  -
                </button>
                <span className="px-3 py-1 text-xs font-semibold tabular-nums text-charcoal">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))}
                  className="px-3 py-1 text-charcoal hover:bg-cream transition-colors text-sm"
                  aria-label="Increase quantity"
                >
                  +
                </button>
              </div>
              <span className="text-xs text-stone-500">
                {product.stock > 0 ? `${product.stock} weaves in stock` : 'Out of stock'}
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-8 space-y-3">
            <div className="flex items-center gap-3">
              <button
                onClick={handleAdd}
                className="flex-1 py-3.5 bg-burgundy-950 text-gold-300 hover:bg-burgundy-900 font-semibold text-xs tracking-widest uppercase flex items-center justify-center gap-2 transition-colors shadow-md"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Add to Shopping Bag</span>
              </button>
              <button
                onClick={() => toggleWishlist(product)}
                className={`p-3.5 border border-sand transition-colors ${
                  isFavorited
                    ? 'bg-burgundy-950 text-gold-400 border-burgundy-950'
                    : 'bg-white text-charcoal hover:border-gold-600'
                }`}
                aria-label="Wishlist toggle"
              >
                <Heart className={`w-4 h-4 ${isFavorited ? 'fill-gold-400' : ''}`} />
              </button>
            </div>

            <button
              onClick={() => {
                onViewDetails(product);
                onClose();
              }}
              className="w-full py-2.5 text-center text-xs tracking-widest uppercase font-semibold text-charcoal hover:text-burgundy-900 flex items-center justify-center gap-1.5 transition-colors border-b border-transparent hover:border-burgundy-900"
            >
              <span>View Full Saree Story & Specifications</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
