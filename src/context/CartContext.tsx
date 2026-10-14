import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { SareeProduct, CartItem, Coupon } from '../types';
import { findUsableCoupon, isUsable, useCoupons } from '../data/couponStore';
import { useToast } from './ToastContext';

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (product: SareeProduct, quantity?: number, selectedColor?: string, giftWrap?: boolean) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  toggleGiftWrap: (productId: string) => void;
  clearCart: () => void;
  isCartOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  appliedCoupon: Coupon | null;
  applyCoupon: (code: string) => boolean;
  removeCoupon: () => void;
  subtotal: number;
  discountAmount: number;
  giftWrapAmount: number;
  shippingAmount: number;
  total: number;
  totalItemsCount: number;
  freeShippingThreshold: number;
  amountNeededForFreeShipping: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('daivisha_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [isCartOpen, setIsCartOpen] = useState(false);
  const coupons = useCoupons();
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(() => {
    try {
      const saved = localStorage.getItem('daivisha_coupon');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const { showToast } = useToast();
  const freeShippingThreshold = 4999;

  useEffect(() => {
    try {
      localStorage.setItem('daivisha_cart', JSON.stringify(cartItems));
    } catch {
      // ignore
    }
  }, [cartItems]);

  useEffect(() => {
    try {
      if (appliedCoupon) {
        localStorage.setItem('daivisha_coupon', JSON.stringify(appliedCoupon));
      } else {
        localStorage.removeItem('daivisha_coupon');
      }
    } catch {
      // ignore
    }
  }, [appliedCoupon]);

  const openCart = () => setIsCartOpen(true);
  const closeCart = () => setIsCartOpen(false);

  const addToCart = (
    product: SareeProduct,
    quantity = 1,
    selectedColor = product.color,
    giftWrap = false
  ) => {
    if (product.stock <= 0) {
      showToast({
        type: 'error',
        title: 'Out of Stock',
        message: 'This exquisite weave is currently sold out.',
      });
      return;
    }

    setCartItems((prev) => {
      const existingIndex = prev.findIndex(
        (item) => item.product.id === product.id && item.selectedColor === selectedColor
      );

      if (existingIndex > -1) {
        const updated = [...prev];
        const newQty = Math.min(product.stock, updated[existingIndex].quantity + quantity);
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: newQty,
          includeGiftWrap: updated[existingIndex].includeGiftWrap || giftWrap,
        };
        return updated;
      } else {
        return [...prev, { product, quantity, selectedColor, includeGiftWrap: giftWrap }];
      }
    });

    showToast({
      type: 'success',
      title: 'Added to Shopping Bag',
      message: `${product.name} (${quantity}) added.`,
    });
    openCart();
  };

  const removeFromCart = (productId: string) => {
    setCartItems((prev) => prev.filter((item) => item.product.id !== productId));
    showToast({
      type: 'info',
      title: 'Removed from Bag',
      message: 'Item has been removed from your shopping bag.',
    });
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }

    setCartItems((prev) =>
      prev.map((item) => {
        if (item.product.id === productId) {
          const clampedQty = Math.min(item.product.stock, quantity);
          return { ...item, quantity: clampedQty };
        }
        return item;
      })
    );
  };

  const toggleGiftWrap = (productId: string) => {
    setCartItems((prev) =>
      prev.map((item) =>
        item.product.id === productId ? { ...item, includeGiftWrap: !item.includeGiftWrap } : item
      )
    );
  };

  const clearCart = () => {
    setCartItems([]);
    setAppliedCoupon(null);
  };

  const subtotal = useMemo(() => {
    return cartItems.reduce((acc, item) => acc + item.product.sellingPrice * item.quantity, 0);
  }, [cartItems]);

  const giftWrapAmount = useMemo(() => {
    return cartItems.reduce((acc, item) => (item.includeGiftWrap ? acc + 250 : acc), 0);
  }, [cartItems]);

  const discountAmount = useMemo(() => {
    if (!appliedCoupon) return 0;
    // Use the live coupon so admin changes (switched off, expired, deleted) apply to carts too.
    const live = coupons.find((c) => c.code === appliedCoupon.code);
    if (!live || !isUsable(live)) return 0;
    if (subtotal < live.minimumOrder) return 0;

    if (live.discountPercentage) {
      return Math.round((subtotal * live.discountPercentage) / 100);
    }
    if (live.discountAmount) {
      return Math.min(subtotal, live.discountAmount);
    }
    return 0;
  }, [appliedCoupon, subtotal, coupons]);

  const shippingAmount = useMemo(() => {
    if (subtotal === 0) return 0;
    return subtotal >= freeShippingThreshold ? 0 : 350;
  }, [subtotal, freeShippingThreshold]);

  const total = useMemo(() => {
    return Math.max(0, subtotal - discountAmount + giftWrapAmount + shippingAmount);
  }, [subtotal, discountAmount, giftWrapAmount, shippingAmount]);

  const totalItemsCount = useMemo(() => {
    return cartItems.reduce((acc, item) => acc + item.quantity, 0);
  }, [cartItems]);

  const amountNeededForFreeShipping = Math.max(0, freeShippingThreshold - subtotal);

  const applyCoupon = (code: string): boolean => {
    const cleanCode = code.trim().toUpperCase();
    const found = findUsableCoupon(cleanCode);

    if (!found) {
      showToast({
        type: 'error',
        title: 'Invalid Coupon',
        message: 'The coupon code entered does not exist or has expired.',
      });
      return false;
    }

    if (subtotal < found.minimumOrder) {
      showToast({
        type: 'error',
        title: 'Minimum Order Not Met',
        message: `This coupon requires a minimum cart value of ₹${found.minimumOrder.toLocaleString('en-IN')}.`,
      });
      return false;
    }

    setAppliedCoupon(found);
    showToast({
      type: 'success',
      title: 'Coupon Applied!',
      message: `${found.code} applied successfully.`,
    });
    return true;
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    showToast({
      type: 'info',
      title: 'Coupon Removed',
      message: 'The coupon code has been removed.',
    });
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        toggleGiftWrap,
        clearCart,
        isCartOpen,
        openCart,
        closeCart,
        appliedCoupon,
        applyCoupon,
        removeCoupon,
        subtotal,
        discountAmount,
        giftWrapAmount,
        shippingAmount,
        total,
        totalItemsCount,
        freeShippingThreshold,
        amountNeededForFreeShipping,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within CartProvider');
  }
  return context;
};
