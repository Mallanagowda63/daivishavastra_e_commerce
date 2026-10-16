import React, { useState } from 'react';
import { Star, Heart, ShoppingBag, Zap, ChevronDown, ChevronUp, ShieldCheck, RefreshCw, Truck } from 'lucide-react';
import { SareeProduct } from '../../types';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { DeliveryChecker } from './DeliveryChecker';
import { WhatsAppButton } from '../common/WhatsAppButton';

interface ProductInfoProps {
  product: SareeProduct;
  onBuyNow: (product: SareeProduct, quantity: number, color: string) => void;
}

export const ProductInfo: React.FC<ProductInfoProps> = ({ product, onBuyNow }) => {
  const [quantity, setQuantity] = useState(1);
  const [selectedColor, setSelectedColor] = useState<string>(product.color);
  const [openAccordion, setOpenAccordion] = useState<string | null>('specifications');

  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();

  const isFavorited = isInWishlist(product.id);

  const toggleSection = (id: string) => {
    setOpenAccordion(openAccordion === id ? null : id);
  };

  const handleAddToCart = () => {
    addToCart(product, quantity, selectedColor);
  };

  const handleImmediateBuy = () => {
    onBuyNow(product, quantity, selectedColor);
  };

  return (
    <div className="space-y-6">
      {/* Category / Collection breadcrumb metadata */}
      <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-stone-500 font-medium">
        <span>{product.collection}</span>
        <span aria-hidden="true" className="text-stone-300">/</span>
        <span className="text-gold-700 font-semibold">{product.category}</span>
        <span aria-hidden="true" className="text-stone-300">/</span>
        <span>SKU: {product.sku}</span>
      </div>

      {/* Saree Title */}
      <h1 className="font-serif text-3xl sm:text-4xl font-bold text-burgundy-950 leading-tight">
        {product.name}
      </h1>

      {/* Rating & Reviews */}
      <div className="flex items-center gap-3">
        <div className="flex items-center text-gold-500">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star key={i} className="w-4 h-4 fill-gold-500" />
          ))}
        </div>
        <span className="text-xs font-semibold text-charcoal font-sans tabular-nums">
          {product.rating}
        </span>
        <span aria-hidden="true" className="text-stone-300">·</span>
        <a href="#reviews" className="text-xs text-stone-500 hover:text-burgundy-900 underline font-sans">
          {product.reviewCount} Connoisseur Reviews
        </a>
      </div>

      {/* Pricing Module */}
      <div className="p-4 bg-cream/40 border border-sand/80 space-y-1">
        <div className="flex items-baseline gap-3">
          <span className="text-2xl sm:text-3xl font-bold text-burgundy-950 tabular-nums">
            ₹{product.sellingPrice.toLocaleString('en-IN')}
          </span>
          {product.originalPrice > product.sellingPrice && (
            <>
              <span className="text-sm sm:text-base text-stone-400 line-through tabular-nums">
                ₹{product.originalPrice.toLocaleString('en-IN')}
              </span>
              <span className="text-xs sm:text-sm font-semibold text-gold-700 tracking-wider">
                SAVE {product.discountPercentage}%
              </span>
            </>
          )}
        </div>
        <p className="text-[11px] text-stone-500">
          Inclusive of all taxes. Shipping added at checkout · free above ₹4,999.
        </p>
      </div>

      {/* Editorial Short Description */}
      <p className="text-sm text-stone-700 leading-relaxed font-sans">
        {product.description}
      </p>

      {/* Color Variants (if any) */}
      {product.colorVariants && product.colorVariants.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs tracking-wider uppercase font-semibold text-charcoal">
            <span>Color: <span className="font-normal text-stone-600">{selectedColor}</span></span>
          </div>
          <div className="flex items-center gap-3">
            {product.colorVariants.map((c) => (
              <button
                key={c.name}
                onClick={() => setSelectedColor(c.name)}
                className={`flex items-center gap-2 p-1.5 border transition-all ${
                  selectedColor === c.name
                    ? 'border-burgundy-950 bg-white shadow-sm'
                    : 'border-transparent hover:border-sand'
                }`}
              >
                <span
                  className="w-4 h-4 rounded-full border border-stone-300"
                  style={{ backgroundColor: c.hex }}
                />
                <span className="text-xs text-charcoal font-medium pr-1">{c.name}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Quantity & Stock */}
      <div className="flex items-center gap-6">
        <div className="space-y-1">
          <label className="text-xs tracking-wider uppercase font-semibold text-charcoal block">
            Quantity
          </label>
          <div className="flex items-center border border-sand bg-white">
            <button
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              className="px-3.5 py-2 text-charcoal hover:bg-cream transition-colors text-sm font-semibold"
              aria-label="Decrease quantity"
            >
              -
            </button>
            <span className="px-4 py-2 text-xs font-semibold tabular-nums text-charcoal">
              {quantity}
            </span>
            <button
              onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))}
              className="px-3.5 py-2 text-charcoal hover:bg-cream transition-colors text-sm font-semibold"
              aria-label="Increase quantity"
            >
              +
            </button>
          </div>
        </div>

        <div className="text-xs space-y-0.5 pt-4">
          <span className="font-semibold text-charcoal block">
            {product.stock > 0 ? 'Certified Artisan Weave' : 'Out of Stock'}
          </span>
          <span className="text-stone-500">
            {product.stock <= 3 && product.stock > 0
              ? `Only ${product.stock} pieces remaining in current loom run`
              : 'Dispatches within 24 hours in velvet box'}
          </span>
        </div>
      </div>

      {/* Main CTAs: ADD TO BAG & BUY NOW */}
      <div className="space-y-3 pt-2">
        <div className="flex items-center gap-3">
          <button
            onClick={handleAddToCart}
            className="flex-1 py-4 bg-burgundy-950 text-gold-300 hover:bg-burgundy-900 font-semibold text-xs tracking-widest uppercase flex items-center justify-center gap-2 transition-all shadow-md active:scale-[0.99]"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Add to Shopping Bag</span>
          </button>

          <button
            onClick={() => toggleWishlist(product)}
            className={`p-4 border transition-colors ${
              isFavorited
                ? 'bg-burgundy-950 text-gold-400 border-burgundy-950'
                : 'bg-white text-charcoal border-sand hover:border-gold-600'
            }`}
            aria-label="Toggle wishlist bookmark"
          >
            <Heart className={`w-5 h-5 ${isFavorited ? 'fill-gold-400' : ''}`} />
          </button>
        </div>

        <button
          onClick={handleImmediateBuy}
          className="w-full py-3.5 bg-gold-500 text-burgundy-950 hover:bg-gold-400 font-semibold text-xs tracking-widest uppercase flex items-center justify-center gap-2 transition-all shadow-sm"
        >
          <Zap className="w-4 h-4" />
          <span>Express Checkout (Buy Now)</span>
        </button>
      </div>

      {/* WhatsApp Stylist Advice Button */}
      <WhatsAppButton product={product} variant="inline" />

      {/* Delivery Checker */}
      <DeliveryChecker />

      {/* Product Details Accordion */}
      <div className="divide-y divide-sand border-t border-b border-sand text-xs font-sans">
        {/* Specifications Accordion */}
        <div className="py-3">
          <button
            onClick={() => toggleSection('specifications')}
            className="w-full flex items-center justify-between text-left font-semibold uppercase tracking-wider text-charcoal py-1"
          >
            <span>Product Details &amp; Specifications</span>
            {openAccordion === 'specifications' ? (
              <ChevronUp className="w-4 h-4 text-stone-500" />
            ) : (
              <ChevronDown className="w-4 h-4 text-stone-500" />
            )}
          </button>
          {openAccordion === 'specifications' && (
            <div className="pt-3 pb-2 space-y-2.5 text-stone-600">
              <div className="grid grid-cols-3 gap-2">
                <span className="text-stone-400">Fabric</span>
                <span className="col-span-2 text-charcoal font-medium">{product.details.fabric}</span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <span className="text-stone-400">Saree Length</span>
                <span className="col-span-2 text-charcoal font-medium">{product.details.sareeLength}</span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <span className="text-stone-400">Blouse Piece</span>
                <span className="col-span-2 text-charcoal font-medium">{product.details.blousePiece}</span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <span className="text-stone-400">Work / Weave</span>
                <span className="col-span-2 text-charcoal font-medium">{product.details.work}</span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <span className="text-stone-400">Border</span>
                <span className="col-span-2 text-charcoal font-medium">{product.details.border}</span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <span className="text-stone-400">Pallu Details</span>
                <span className="col-span-2 text-charcoal font-medium">{product.details.palluDetails}</span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <span className="text-stone-400">Wash Care</span>
                <span className="col-span-2 text-charcoal font-medium">{product.details.washCare}</span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <span className="text-stone-400">Origin</span>
                <span className="col-span-2 text-charcoal font-medium">{product.details.countryOfOrigin}</span>
              </div>
            </div>
          )}
        </div>

        {/* The Weaving Story */}
        <div className="py-3">
          <button
            onClick={() => toggleSection('story')}
            className="w-full flex items-center justify-between text-left font-semibold uppercase tracking-wider text-charcoal py-1"
          >
            <span>Artisan Weaving Story</span>
            {openAccordion === 'story' ? (
              <ChevronUp className="w-4 h-4 text-stone-500" />
            ) : (
              <ChevronDown className="w-4 h-4 text-stone-500" />
            )}
          </button>
          {openAccordion === 'story' && (
            <div className="pt-3 pb-2 text-stone-700 leading-relaxed font-sans">
              <p>{product.story}</p>
            </div>
          )}
        </div>

        {/* Shipping & Returns */}
        <div className="py-3">
          <button
            onClick={() => toggleSection('shipping')}
            className="w-full flex items-center justify-between text-left font-semibold uppercase tracking-wider text-charcoal py-1"
          >
            <span>Shipping, Delivery &amp; Returns</span>
            {openAccordion === 'shipping' ? (
              <ChevronUp className="w-4 h-4 text-stone-500" />
            ) : (
              <ChevronDown className="w-4 h-4 text-stone-500" />
            )}
          </button>
          {openAccordion === 'shipping' && (
            <div className="pt-3 pb-2 space-y-2 text-stone-600">
              <p>• Pan India shipping to all serviceable pin codes.</p>
              <p>• Packed with care in our signature packaging.</p>
              <p>• Return, refund or exchange requests accepted within 48 hours of delivery.</p>
              <p>• The saree must be unused, with all tags intact.</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
