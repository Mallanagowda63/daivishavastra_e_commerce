import React, { createContext, useContext, useState, useEffect } from 'react';
import { SareeProduct } from '../types';
import { useToast } from './ToastContext';

interface WishlistContextType {
  wishlist: SareeProduct[];
  addToWishlist: (product: SareeProduct) => void;
  removeFromWishlist: (productId: string) => void;
  toggleWishlist: (product: SareeProduct) => void;
  isInWishlist: (productId: string) => boolean;
  clearWishlist: () => void;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export const WishlistProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [wishlist, setWishlist] = useState<SareeProduct[]>(() => {
    try {
      const saved = localStorage.getItem('daivisha_wishlist');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const { showToast } = useToast();

  useEffect(() => {
    try {
      localStorage.setItem('daivisha_wishlist', JSON.stringify(wishlist));
    } catch {
      // ignore
    }
  }, [wishlist]);

  const isInWishlist = (productId: string) => {
    return wishlist.some((item) => item.id === productId);
  };

  const addToWishlist = (product: SareeProduct) => {
    if (!isInWishlist(product.id)) {
      setWishlist((prev) => [...prev, product]);
      showToast({
        type: 'success',
        title: 'Added to Wishlist',
        message: `${product.name} saved to your curation.`,
      });
    }
  };

  const removeFromWishlist = (productId: string) => {
    setWishlist((prev) => prev.filter((item) => item.id !== productId));
    showToast({
      type: 'info',
      title: 'Removed from Wishlist',
      message: 'Item removed from your saved sarees.',
    });
  };

  const toggleWishlist = (product: SareeProduct) => {
    if (isInWishlist(product.id)) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product);
    }
  };

  const clearWishlist = () => {
    setWishlist([]);
  };

  return (
    <WishlistContext.Provider
      value={{
        wishlist,
        addToWishlist,
        removeFromWishlist,
        toggleWishlist,
        isInWishlist,
        clearWishlist,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within WishlistProvider');
  }
  return context;
};
