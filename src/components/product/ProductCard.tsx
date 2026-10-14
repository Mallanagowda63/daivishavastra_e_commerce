import React, { useState } from 'react';
import { Heart, Eye, ShoppingBag } from 'lucide-react';
import { SareeProduct } from '../../types';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { ImageWithFallback } from '../common/ImageWithFallback';

interface ProductCardProps {
  product: SareeProduct;
  onSelect: (product: SareeProduct) => void;
  onQuickView: (product: SareeProduct) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onSelect,
  onQuickView,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [selectedColorIndex, setSelectedColorIndex] = useState(0);

  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();

  const isFavorited = isInWishlist(product.id);

  const currentDisplayImage =
    isHovered && product.secondaryImage
      ? product.secondaryImage
      : product.images[0] || '/images/hero_saree_model_1791372718962.jpg';

  const formatPrice = (amount: number) => {
    return `₹${amount.toLocaleString('en-IN')}`;
  };

  return (
    <article
      className="group relative flex flex-col bg-transparent text-charcoal transition-all duration-300"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Visual Image Container with 3:4 aspect ratio */}
      <div className="relative aspect-[3/4] w-full overflow-hidden bg-[#f4eee5] cursor-pointer">
        <div
          onClick={() => onSelect(product)}
          className="w-full h-full"
        >
          <ImageWithFallback
            src={currentDisplayImage}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
        </div>

        {/* Quiet Editorial Badges (Single unboxed text tag as per anti-slop rules) */}
        <div className="absolute top-3 left-3 flex flex-col gap-1 pointer-events-none">
          {product.isLimitedEdition && (
            <span className="text-[10px] tracking-widest uppercase font-semibold text-ivory bg-burgundy-950/90 px-2 py-0.5">
              Limited Edition
            </span>
          )}
          {product.isBestSeller && !product.isLimitedEdition && (
            <span className="text-[10px] tracking-widest uppercase font-semibold text-burgundy-950 bg-gold-400 px-2 py-0.5">
              Best Seller
            </span>
          )}
          {product.stock <= 3 && product.stock > 0 && (
            <span className="text-[10px] tracking-wider uppercase font-medium text-red-700 bg-white/90 px-2 py-0.5">
              Only {product.stock} Left
            </span>
          )}
        </div>

        {/* Wishlist Button (Top Right) */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleWishlist(product);
          }}
          className={`absolute top-3 right-3 w-9 h-9 rounded-full flex items-center justify-center transition-all duration-200 z-10 ${
            isFavorited
              ? 'bg-burgundy-950 text-gold-400'
              : 'bg-white/80 backdrop-blur-sm text-charcoal hover:bg-white hover:text-burgundy-900'
          }`}
          aria-label={isFavorited ? 'Remove from wishlist' : 'Save to wishlist'}
        >
          <Heart className={`w-4 h-4 ${isFavorited ? 'fill-gold-400 text-gold-400' : ''}`} />
        </button>

        {/* Action Overlay on Hover (Desktop) */}
        <div className="absolute inset-x-3 bottom-3 hidden lg:flex items-center gap-2 opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 z-10">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onQuickView(product);
            }}
            className="flex-1 py-2.5 bg-white/95 backdrop-blur-sm text-charcoal hover:text-burgundy-950 text-xs font-semibold tracking-wider uppercase flex items-center justify-center gap-1.5 shadow-md hover:bg-white transition-colors"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Quick View</span>
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              addToCart(product, 1, product.color);
            }}
            className="flex-1 py-2.5 bg-burgundy-950 text-gold-300 hover:bg-burgundy-900 text-xs font-semibold tracking-wider uppercase flex items-center justify-center gap-1.5 shadow-md transition-colors"
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>Add to Bag</span>
          </button>
        </div>
      </div>

      {/* Product Metadata */}
      <div className="pt-3.5 pb-2 flex flex-col flex-1">
        {/* Category & Fabric quiet label */}
        <div className="text-[11px] uppercase tracking-wider text-stone-500 font-medium">
          <span>{product.fabric}</span>
          <span aria-hidden="true" className="mx-1.5 text-stone-300">·</span>
          <span>{product.category.replace(' Sarees', '')}</span>
        </div>

        {/* Product Title */}
        <h3
          onClick={() => onSelect(product)}
          className="font-serif text-[16px] font-semibold text-charcoal hover:text-burgundy-900 transition-colors mt-1 line-clamp-1 cursor-pointer"
        >
          {product.name}
        </h3>

        {/* Color Swatch Preview (if any) */}
        {product.colorVariants && product.colorVariants.length > 1 && (
          <div className="flex items-center gap-1.5 mt-2">
            {product.colorVariants.map((variant, idx) => (
              <button
                key={variant.name}
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedColorIndex(idx);
                }}
                className={`w-3.5 h-3.5 rounded-full border transition-all ${
                  selectedColorIndex === idx
                    ? 'border-burgundy-950 scale-110'
                    : 'border-stone-300'
                }`}
                style={{ backgroundColor: variant.hex }}
                title={variant.name}
                aria-label={`Select color ${variant.name}`}
              />
            ))}
          </div>
        )}

        {/* Pricing with Tabular Numerals */}
        <div className="mt-2 flex items-baseline gap-2.5 font-sans">
          <span className="font-semibold text-sm text-burgundy-950 tabular-nums">
            {formatPrice(product.sellingPrice)}
          </span>
          {product.originalPrice > product.sellingPrice && (
            <>
              <span className="text-xs text-stone-400 line-through tabular-nums">
                {formatPrice(product.originalPrice)}
              </span>
              <span className="text-[11px] font-semibold text-gold-700 tracking-wider uppercase">
                {product.discountPercentage}% OFF
              </span>
            </>
          )}
        </div>

        {/* Mobile Quick Add Button */}
        <div className="lg:hidden mt-3">
          <button
            onClick={() => addToCart(product, 1, product.color)}
            className="w-full py-2 bg-burgundy-950 text-gold-300 text-xs font-semibold tracking-wider uppercase flex items-center justify-center gap-1.5"
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>Add to Bag</span>
          </button>
        </div>
      </div>
    </article>
  );
};
