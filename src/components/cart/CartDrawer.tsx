import React, { useState } from 'react';
import { X, Trash2, ShoppingBag, Gift, ArrowRight, ShieldCheck, Tag, Sparkles } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { ImageWithFallback } from '../common/ImageWithFallback';

interface CartDrawerProps {
  onCheckout: () => void;
  onSelectProduct: (product: any) => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({ onCheckout, onSelectProduct }) => {
  const {
    isCartOpen,
    closeCart,
    cartItems,
    removeFromCart,
    updateQuantity,
    toggleGiftWrap,
    subtotal,
    discountAmount,
    giftWrapAmount,
    shippingAmount,
    total,
    appliedCoupon,
    applyCoupon,
    removeCoupon,
    amountNeededForFreeShipping,
  } = useCart();

  const [couponInput, setCouponInput] = useState('');

  if (!isCartOpen) return null;

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (couponInput.trim()) {
      const ok = applyCoupon(couponInput);
      if (ok) setCouponInput('');
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="cart-drawer-heading"
      className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-sm animate-in fade-in"
    >
      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[#faf7f2] shadow-2xl flex flex-col justify-between border-l border-sand">
          {/* Drawer Header */}
          <div className="p-5 border-b border-sand bg-cream/30 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <ShoppingBag className="w-5 h-5 text-burgundy-950" />
              <h2 id="cart-drawer-heading" className="font-serif text-xl font-bold text-burgundy-950">
                Your Shopping Bag ({cartItems.length})
              </h2>
            </div>
            <button
              onClick={closeCart}
              className="p-1 text-stone-500 hover:text-charcoal transition-colors"
              aria-label="Close Shopping Bag"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Free Shipping Progress Bar */}
          <div className="px-5 py-3 bg-burgundy-950 text-gold-300 text-xs font-sans border-b border-gold-500/20">
            {amountNeededForFreeShipping > 0 ? (
              <div className="space-y-1.5">
                <div className="flex justify-between text-[11px] uppercase tracking-wider">
                  <span>Add ₹{amountNeededForFreeShipping.toLocaleString('en-IN')} for Free Insured Express Delivery</span>
                </div>
                <div className="w-full bg-white/20 h-1 rounded-full overflow-hidden">
                  <div
                    className="bg-gold-400 h-full transition-all duration-500"
                    style={{
                      width: `${Math.min(100, ((4999 - amountNeededForFreeShipping) / 4999) * 100)}%`,
                    }}
                  />
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-1.5 text-gold-300 font-medium">
                <Sparkles className="w-3.5 h-3.5 text-gold-400" />
                <span>Complimentary White-Glove Insured Delivery Unlocked!</span>
              </div>
            )}
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-5 divide-y divide-sand">
            {cartItems.length === 0 ? (
              <div className="py-20 text-center space-y-4">
                <ShoppingBag className="w-12 h-12 text-stone-300 mx-auto" />
                <h3 className="font-serif text-lg font-medium text-charcoal">
                  Your bag is currently empty
                </h3>
                <p className="text-xs text-stone-500 max-w-xs mx-auto font-sans">
                  Explore our handcrafted Kanjivaram and Banarasi silk sarees to begin your royal collection.
                </p>
                <button
                  onClick={closeCart}
                  className="mt-4 px-6 py-2.5 bg-burgundy-950 text-gold-300 text-xs font-semibold tracking-wider uppercase transition-colors"
                >
                  Explore Sarees
                </button>
              </div>
            ) : (
              cartItems.map((item) => (
                <div key={`${item.product.id}-${item.selectedColor}`} className="py-4 flex gap-4">
                  {/* Thumbnail */}
                  <div
                    onClick={() => {
                      onSelectProduct(item.product);
                      closeCart();
                    }}
                    className="w-20 aspect-[3/4] bg-[#f1e9df] overflow-hidden shrink-0 cursor-pointer"
                  >
                    <ImageWithFallback
                      src={item.product.images[0]}
                      alt={item.product.name}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Details */}
                  <div className="flex-1 flex flex-col justify-between text-xs font-sans">
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <h4
                          onClick={() => {
                            onSelectProduct(item.product);
                            closeCart();
                          }}
                          className="font-serif text-sm font-semibold text-charcoal hover:text-burgundy-900 line-clamp-1 cursor-pointer"
                        >
                          {item.product.name}
                        </h4>
                        <button
                          onClick={() => removeFromCart(item.product.id)}
                          className="text-stone-400 hover:text-red-700 p-1"
                          aria-label="Remove item"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <p className="text-[11px] text-stone-500 mt-0.5">
                        {item.selectedColor || item.product.color} · {item.product.fabric}
                      </p>

                      <div className="mt-1 font-semibold text-burgundy-950 tabular-nums">
                        ₹{item.product.sellingPrice.toLocaleString('en-IN')}
                      </div>
                    </div>

                    {/* Quantity Stepper & Gift Wrap Option */}
                    <div className="space-y-2 mt-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center border border-sand bg-white">
                          <button
                            onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                            className="px-2 py-0.5 text-stone-600 hover:bg-cream"
                          >
                            -
                          </button>
                          <span className="px-2 py-0.5 font-semibold text-[11px] tabular-nums">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                            className="px-2 py-0.5 text-stone-600 hover:bg-cream"
                          >
                            +
                          </button>
                        </div>

                        <span className="font-semibold text-charcoal tabular-nums">
                          ₹{(item.product.sellingPrice * item.quantity).toLocaleString('en-IN')}
                        </span>
                      </div>

                      {/* Gift Wrap Toggle */}
                      <label className="flex items-center gap-1.5 text-[11px] text-stone-600 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={item.includeGiftWrap || false}
                          onChange={() => toggleGiftWrap(item.product.id)}
                          className="accent-burgundy-900"
                        />
                        <Gift className="w-3 h-3 text-gold-600 shrink-0" />
                        <span>Add Royal Archival Gift Box (+₹250)</span>
                      </label>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Drawer Footer & Checkout Action */}
          {cartItems.length > 0 && (
            <div className="p-5 bg-cream/40 border-t border-sand space-y-4">
              {/* Coupon Form */}
              {appliedCoupon ? (
                <div className="flex items-center justify-between p-2.5 bg-burgundy-950 text-gold-300 text-xs font-sans">
                  <div className="flex items-center gap-2">
                    <Tag className="w-3.5 h-3.5 text-gold-400" />
                    <span>Coupon <strong>{appliedCoupon.code}</strong> applied</span>
                  </div>
                  <button
                    onClick={removeCoupon}
                    className="text-stone-300 hover:text-white underline text-[11px]"
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <form onSubmit={handleApplyCoupon} className="flex gap-2 text-xs font-sans">
                  <input
                    type="text"
                    value={couponInput}
                    onChange={(e) => setCouponInput(e.target.value)}
                    placeholder="Enter Coupon (e.g. WELCOME10)"
                    className="flex-1 px-3 py-2 bg-white border border-sand focus:border-burgundy-950 focus:outline-none uppercase tracking-wider text-[11px]"
                  />
                  <button
                    type="submit"
                    className="px-3 py-2 bg-charcoal text-ivory text-[11px] font-semibold uppercase tracking-wider hover:bg-burgundy-950 transition-colors"
                  >
                    Apply
                  </button>
                </form>
              )}

              {/* Price Calculations */}
              <div className="space-y-1.5 text-xs font-sans text-stone-600">
                <div className="flex justify-between">
                  <span>Bag Subtotal</span>
                  <span className="font-medium text-charcoal tabular-nums">
                    ₹{subtotal.toLocaleString('en-IN')}
                  </span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between text-emerald-800">
                    <span>Privilege Discount</span>
                    <span className="font-semibold tabular-nums">
                      -₹{discountAmount.toLocaleString('en-IN')}
                    </span>
                  </div>
                )}
                {giftWrapAmount > 0 && (
                  <div className="flex justify-between">
                    <span>Archival Box Packaging</span>
                    <span className="tabular-nums">₹{giftWrapAmount.toLocaleString('en-IN')}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Insured Shipping</span>
                  <span className="text-charcoal font-medium">
                    {shippingAmount === 0 ? 'Complimentary' : `₹${shippingAmount}`}
                  </span>
                </div>
                <div className="flex justify-between text-sm font-bold text-burgundy-950 border-t border-sand pt-2 font-serif">
                  <span>Estimated Total</span>
                  <span className="tabular-nums font-sans">
                    ₹{total.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>

              {/* Proceed to Checkout CTA */}
              <button
                onClick={() => {
                  closeCart();
                  onCheckout();
                }}
                className="w-full py-4 bg-burgundy-950 text-gold-300 hover:bg-burgundy-900 font-semibold text-xs tracking-widest uppercase flex items-center justify-center gap-2 shadow-lg transition-colors"
              >
                <span>Proceed to Secure Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="flex items-center justify-center gap-2 text-[10px] text-stone-500 uppercase tracking-wider">
                <ShieldCheck className="w-3.5 h-3.5 text-gold-600" />
                <span>Silk Mark Certified · 100% Secure Checkout</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
