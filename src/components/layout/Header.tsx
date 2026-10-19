import React, { useState, useEffect } from 'react';
import { COLLECTIONS } from '../../data/collections';
import { useBackToClose } from '../../lib/history';
import { SAREE_TYPE_NAMES } from '../../data/sareeTypes';
import { SareeCategory } from '../../types';
import { Search, Heart, ShoppingBag, User, Menu, X } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { useAuth } from '../../context/AuthContext';
import { HangingLamp } from './BrandEmblem';

interface HeaderProps {
  currentView?: string;
  onNavigate: (view: 'home' | 'shop' | 'wishlist' | 'about' | 'aboutus' | 'contact', category?: string, collection?: string) => void;
  onOpenSearch: () => void;
  onOpenCollections: () => void;
  onOpenCollection: (key: SareeCategory) => void;
}

const navLinkClass = (active: boolean) =>
  `relative py-2 uppercase tracking-[0.08em] transition-colors cursor-pointer after:absolute after:left-0 after:right-0 after:-bottom-0.5 after:h-0.5 after:bg-burgundy-800 after:transition-transform after:origin-center ${
    active ? 'text-burgundy-800 after:scale-x-100' : 'text-charcoal hover:text-burgundy-800 after:scale-x-0 hover:after:scale-x-100'
  }`;

export const Header: React.FC<HeaderProps> = ({ currentView, onNavigate, onOpenSearch, onOpenCollections, onOpenCollection }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  // Phone back button closes the menu instead of leaving the page.
  useBackToClose(isMobileMenuOpen, () => setIsMobileMenuOpen(false));
  // Close it whenever the page changes.
  useEffect(() => setIsMobileMenuOpen(false), [currentView]);

  const { totalItemsCount, openCart } = useCart();
  const { wishlist } = useWishlist();
  const { user, openAuthModal, openAccountDashboard } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSelectCategory = (cat: string) => {
    setIsMobileMenuOpen(false);
    onNavigate('shop', cat);
  };

  const handleSelectCollection = (col: string) => {
    setIsMobileMenuOpen(false);
    onNavigate('shop', undefined, col);
  };

  return (
    <header
      className={`sticky top-0 z-40 transition-all duration-300 bg-[#f8f1e6] ${
        isScrolled
          ? 'shadow-md border-b border-gold-500/40 py-2'
          : 'border-b border-gold-500/30 py-3'
      }`}
    >
      {/* Hanging brass lamps on the edges, dropping from the top of the announcement bar (wide screens only) */}
      <HangingLamp className="pointer-events-none hidden min-[1600px]:block absolute left-5 -top-11 w-11 h-auto" />
      <HangingLamp className="pointer-events-none hidden min-[1600px]:block absolute right-5 -top-11 w-11 h-auto" />

      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 min-[1400px]:px-24">
        <div className="flex items-center justify-between gap-3 sm:gap-6">
          {/* Mobile Menu Button */}
          <div className="flex flex-1 basis-0 items-center gap-0.5 sm:gap-2 xl:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-1.5 text-charcoal hover:text-burgundy-800 transition-colors"
              aria-label="Toggle navigation menu"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5 sm:w-6 sm:h-6" /> : <Menu className="w-5 h-5 sm:w-6 sm:h-6" />}
            </button>
            <button
              onClick={onOpenSearch}
              className="p-1.5 text-charcoal hover:text-burgundy-800 transition-colors"
              aria-label="Search catalog"
            >
              <Search className="w-5 h-5" />
            </button>
          </div>

          {/* Zone 1: Emblem + Wordmark */}
          <button
            onClick={() => onNavigate('home')}
            className="flex flex-col sm:flex-row items-center gap-0.5 sm:gap-3 min-w-0 shrink-0 whitespace-nowrap text-center sm:text-left cursor-pointer focus-visible:outline-none"
            aria-label="Daivisha Vastra Home"
          >
            <img
              src="/images/daivisha_emblem.png"
              alt=""
              className={`shrink-0 w-auto object-contain transition-all duration-300 ${
                isScrolled ? 'h-7 sm:h-14' : 'h-9 sm:h-20'
              }`}
            />
            <span className="flex flex-col items-center min-w-0">
              <span className="font-serif text-[15px] min-[400px]:text-[17px] sm:text-[32px] font-semibold text-burgundy-800 leading-none tracking-[0.14em] sm:tracking-wide [font-variant:small-caps]">
                Daivisha Vastra<sup className="hidden sm:inline text-xs font-sans font-medium ml-0.5 align-super">™</sup>
              </span>
              <span className="hidden sm:flex items-center gap-1.5 mt-1 font-serif text-sm text-stone-700">
                <span className="w-1.5 h-1.5 rotate-45 bg-gold-500" />
                Elegant attire rooted in Indian heritage
              </span>
            </span>
          </button>

          {/* Zone 2: Navigation Links */}
          <nav className="hidden xl:flex items-center gap-7 2xl:gap-9 whitespace-nowrap font-helvetica text-[15px] font-bold">
            <button onClick={() => onNavigate('home')} className={navLinkClass(currentView === 'home')}>
              Home
            </button>

            <button
              onClick={() => onNavigate('shop')}
              className={navLinkClass(currentView === 'shop' || currentView === 'product')}
            >
              Sarees
            </button>

            <button onClick={onOpenCollections} className={navLinkClass(currentView === 'collection')}>
              Collections
            </button>

            <button onClick={() => onNavigate('about')} className={navLinkClass(currentView === 'about')}>
              Our Story
            </button>

            <button onClick={() => onNavigate('aboutus')} className={navLinkClass(currentView === 'aboutus')}>
              About Us
            </button>

            <button onClick={() => onNavigate('contact')} className={navLinkClass(currentView === 'contact')}>
              Contact
            </button>
          </nav>

          {/* Zone 3: Actions (Search, Wishlist, Account, Cart) */}
          <div className="flex flex-1 basis-0 xl:flex-none justify-end items-center gap-0.5 sm:gap-2 shrink-0">
            <button
              onClick={onOpenSearch}
              className="hidden xl:block p-1.5 text-charcoal hover:text-burgundy-800 transition-colors"
              aria-label="Open search dialog"
            >
              <Search className="w-6 h-6" strokeWidth={1.6} />
            </button>

            {/* Wishlist */}
            <button
              onClick={() => onNavigate('wishlist')}
              className="relative p-1.5 text-charcoal hover:text-burgundy-800 transition-colors"
              aria-label="View Wishlist"
            >
              <Heart className="w-5 h-5 sm:w-6 sm:h-6" strokeWidth={1.6} />
              {wishlist.length > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-burgundy-800 text-ivory text-[10px] font-semibold rounded-full flex items-center justify-center">
                  {wishlist.length}
                </span>
              )}
            </button>

            {/* Account */}
            <button
              onClick={() => {
                if (user) {
                  openAccountDashboard();
                } else {
                  openAuthModal();
                }
              }}
              className="hidden lg:block p-1.5 text-charcoal hover:text-burgundy-800 transition-colors"
              aria-label={user ? `Account: ${user.name}` : 'Login to Account'}
            >
              <User className="w-6 h-6" strokeWidth={1.6} />
            </button>

            {/* Cart Drawer Trigger */}
            <button
              onClick={openCart}
              className="relative p-1.5 text-charcoal hover:text-burgundy-800 transition-colors"
              aria-label="Open Shopping Bag"
            >
              <ShoppingBag className="w-5 h-5 sm:w-6 sm:h-6" strokeWidth={1.6} />
              {totalItemsCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-burgundy-800 text-ivory text-[10px] font-semibold rounded-full flex items-center justify-center">
                  {totalItemsCount}
                </span>
              )}
            </button>

          </div>
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {isMobileMenuOpen && (
        <div className="xl:hidden absolute inset-x-0 top-full h-[calc(100dvh-100%)] bg-[#faf7f2] z-50 overflow-y-auto border-t border-sand p-6 flex flex-col justify-between">
          <div className="space-y-6">
            <div className="space-y-4">
              <button
                onClick={() => {
                  onNavigate('home');
                  setIsMobileMenuOpen(false);
                }}
                className="block w-full text-left font-helvetica font-bold text-xl text-burgundy-950"
              >
                Home
              </button>
              <button
                onClick={() => {
                  onNavigate('shop', 'New Arrivals');
                  setIsMobileMenuOpen(false);
                }}
                className="block w-full text-left font-helvetica font-bold text-xl text-burgundy-950"
              >
                New Arrivals
              </button>
              <button
                onClick={() => {
                  onNavigate('shop');
                  setIsMobileMenuOpen(false);
                }}
                className="block w-full text-left font-helvetica font-bold text-xl text-burgundy-950"
              >
                All Sarees
              </button>
              <button
                onClick={() => {
                  onNavigate('about');
                  setIsMobileMenuOpen(false);
                }}
                className="block w-full text-left font-helvetica font-bold text-xl text-burgundy-950"
              >
                Our Story
              </button>
              <button
                onClick={() => {
                  onNavigate('aboutus');
                  setIsMobileMenuOpen(false);
                }}
                className="block w-full text-left font-helvetica font-bold text-xl text-burgundy-950"
              >
                About Us
              </button>
              <button
                onClick={() => {
                  onNavigate('contact');
                  setIsMobileMenuOpen(false);
                }}
                className="block w-full text-left font-helvetica font-bold text-xl text-burgundy-950"
              >
                Contact
              </button>
            </div>

            <div className="border-t border-sand pt-4">
              <p className="text-xs tracking-widest uppercase text-stone-400 font-semibold mb-3">
                Saree Types
              </p>
              <div className="grid grid-cols-2 gap-2 text-sm text-charcoal">
                {SAREE_TYPE_NAMES.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => handleSelectCategory(cat)}
                    className="text-left py-1.5 hover:text-burgundy-800"
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            <div className="border-t border-sand pt-4">
              <p className="text-xs tracking-widest uppercase text-stone-400 font-semibold mb-3">
                Collections
              </p>
              <div className="grid grid-cols-2 gap-2 text-sm text-charcoal">
                {COLLECTIONS.map((c) => (
                  <button
                    key={c.key}
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      onOpenCollection(c.key);
                    }}
                    className="text-left py-1.5 hover:text-burgundy-800"
                  >
                    {c.title}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
