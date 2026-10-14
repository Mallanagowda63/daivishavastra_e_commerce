import React from 'react';
import { Home, Grid, Search, Heart, User } from 'lucide-react';
import { useWishlist } from '../../context/WishlistContext';
import { useAuth } from '../../context/AuthContext';

interface MobileNavProps {
  currentView: string;
  onNavigate: (view: 'home' | 'shop' | 'wishlist' | 'about' | 'track') => void;
  onOpenSearch: () => void;
}

export const MobileNav: React.FC<MobileNavProps> = ({
  currentView,
  onNavigate,
  onOpenSearch,
}) => {
  const { wishlist } = useWishlist();
  const { user, openAuthModal, openAccountDashboard } = useAuth();

  return (
    <nav
      aria-label="Mobile navigation"
      className="lg:hidden fixed bottom-0 inset-x-0 bg-[#faf7f2]/95 backdrop-blur-md border-t border-sand z-30 flex items-center justify-around py-2.5 px-2 safe-area-pb"
    >
      <button
        onClick={() => onNavigate('home')}
        className={`flex flex-col items-center gap-1 py-1 px-3 text-[10px] uppercase tracking-wider ${
          currentView === 'home' ? 'text-burgundy-900 font-bold' : 'text-stone-500'
        }`}
      >
        <Home className="w-5 h-5" />
        <span>Home</span>
      </button>

      <button
        onClick={() => onNavigate('shop')}
        className={`flex flex-col items-center gap-1 py-1 px-3 text-[10px] uppercase tracking-wider ${
          currentView === 'shop' ? 'text-burgundy-900 font-bold' : 'text-stone-500'
        }`}
      >
        <Grid className="w-5 h-5" />
        <span>Sarees</span>
      </button>

      <button
        onClick={onOpenSearch}
        className="flex flex-col items-center gap-1 py-1 px-3 text-[10px] uppercase tracking-wider text-stone-500"
      >
        <Search className="w-5 h-5" />
        <span>Search</span>
      </button>

      <button
        onClick={() => onNavigate('wishlist')}
        className={`relative flex flex-col items-center gap-1 py-1 px-3 text-[10px] uppercase tracking-wider ${
          currentView === 'wishlist' ? 'text-burgundy-900 font-bold' : 'text-stone-500'
        }`}
      >
        <Heart className="w-5 h-5" />
        <span>Wishlist</span>
        {wishlist.length > 0 && (
          <span className="absolute top-0 right-3 w-3.5 h-3.5 bg-burgundy-800 text-ivory text-[9px] font-bold rounded-full flex items-center justify-center">
            {wishlist.length}
          </span>
        )}
      </button>

      <button
        onClick={() => {
          if (user) {
            openAccountDashboard();
          } else {
            openAuthModal();
          }
        }}
        className="flex flex-col items-center gap-1 py-1 px-3 text-[10px] uppercase tracking-wider text-stone-500"
      >
        <User className="w-5 h-5" />
        <span>{user ? 'Account' : 'Login'}</span>
      </button>
    </nav>
  );
};
