import React, { Suspense, lazy, useState } from 'react';
import { scrollToElement, scrollToTop } from './lib/smoothScroll';
import { ToastProvider } from './context/ToastContext';
import { WishlistProvider } from './context/WishlistContext';
import { CartProvider, useCart } from './context/CartContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { AdminProvider, useAdmin } from './context/AdminContext';

import { AnnouncementBar } from './components/layout/AnnouncementBar';
import { Header } from './components/layout/Header';
import { MobileNav } from './components/layout/MobileNav';
import { Footer } from './components/layout/Footer';

import { HomeView } from './views/HomeView';
import { ShopView } from './views/ShopView';
import { ProductDetailView } from './views/ProductDetailView';
import { WishlistView } from './views/WishlistView';
import { PolicyView } from './views/PolicyView';
import { CollectionView } from './views/CollectionView';
import { POLICIES, PolicyId } from './data/policies';
import { AboutUsView } from './views/AboutUsView';
import { ContactView } from './views/ContactView';

import { CartDrawer } from './components/cart/CartDrawer';
import { SearchOverlay } from './components/search/SearchOverlay';
import { QuickViewModal } from './components/product/QuickViewModal';
import { CheckoutModal } from './components/checkout/CheckoutModal';
import { AccountModal } from './components/account/AccountModal';
import { WhatsAppButton } from './components/common/WhatsAppButton';
import { WhatsAppGate } from './components/common/WhatsAppGate';
import { ToastContainer } from './components/common/ToastContainer';

import { SareeCategory, SareeProduct } from './types';

// The admin workspace is only downloaded when it is opened, keeping the storefront light.
const AdminDashboard = lazy(() => import('./components/admin/AdminDashboard').then((m) => ({ default: m.AdminDashboard })));

function MainApp() {
  const { products: allProducts, isAdminOpen } = useAdmin();
  // Only published sarees appear in the storefront; drafts and archived stay in admin.
  const products = allProducts.filter((p) => !p.status || p.status === 'published');
  const { isAuthModalOpen, closeAuthModal, isAccountDashboardOpen, closeAccountDashboard } = useAuth();
  const { addToCart } = useCart();

  // Navigation State
  const [currentView, setCurrentView] = useState<'home' | 'shop' | 'product' | 'wishlist' | 'about' | 'aboutus' | 'contact' | 'collection' | PolicyId>('home');
  const [collectionKey, setCollectionKey] = useState<SareeCategory>('Pure Gajji Silk Sarees');
  const [selectedProduct, setSelectedProduct] = useState<SareeProduct | null>(null);

  // Shop filter parameters when navigating from menus
  const [shopCategory, setShopCategory] = useState<string | undefined>();
  const [shopCollection, setShopCollection] = useState<string | undefined>();
  const [shopOccasion, setShopOccasion] = useState<string | undefined>();
  const [shopFabric, setShopFabric] = useState<string | undefined>();

  // Modals
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState<SareeProduct | null>(null);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

  // Navigation handler
  const handleNavigate = (
    view: 'home' | 'shop' | 'wishlist' | 'about' | 'aboutus' | 'contact' | PolicyId,
    category?: string,
    collection?: string,
    occasion?: string,
    fabric?: string
  ) => {
    // Our Story is a section of the home page, not a separate page
    if (view === 'about') {
      goToHomeSection('#our-story');
      return;
    }
    setShopCategory(category);
    setShopCollection(collection);
    setShopOccasion(occasion);
    setShopFabric(fabric);
    setCurrentView(view);
    scrollToTop();
  };

  const openCollection = (key: SareeCategory) => {
    setCollectionKey(key);
    setCurrentView('collection');
    scrollToTop();
  };

  // Scroll to a section of the home page, switching to it first if needed
  const goToHomeSection = (selector: string) => {
    if (currentView === 'home') {
      scrollToElement(selector);
      return;
    }
    setCurrentView('home');
    setTimeout(() => scrollToElement(selector), 150);
  };

  // Home page "Explore Our Collections" section
  const goToCollections = () => goToHomeSection('#collections');

  const handleSelectProduct = (product: SareeProduct) => {
    setSelectedProduct(product);
    setCurrentView('product');
    scrollToTop();
  };

  const handleBuyNow = (product: SareeProduct, quantity: number, color: string) => {
    addToCart(product, quantity, color);
    setIsCheckoutOpen(true);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#faf7f2] text-[#1f1b1c] font-sans selection:bg-burgundy-950 selection:text-ivory">
      {/* 1–2. Announcement bar and header stay pinned together while scrolling */}
      <div id="site-top" className="sticky top-0 z-40">
        <AnnouncementBar />
        <Header
          currentView={currentView}
          onNavigate={(view, cat, col) => handleNavigate(view, cat, col)}
          onOpenSearch={() => setIsSearchOpen(true)}
          onOpenCollections={goToCollections}
          onOpenCollection={openCollection}
        />
      </div>

      {/* 3. Main Dynamic Content View */}
      <main className="flex-1">
        {currentView === 'home' && (
          <HomeView
            products={products}
            onSelectProduct={handleSelectProduct}
            onQuickView={(p) => setQuickViewProduct(p)}
            onNavigateToShop={(cat, col, occ, fab) => handleNavigate('shop', cat, col, occ, fab)}
            onNavigateToAbout={() => handleNavigate('about')}
            onOpenCollection={openCollection}
          />
        )}

        {currentView === 'shop' && (
          <ShopView
            products={products}
            initialCategory={shopCategory}
            initialCollection={shopCollection}
            initialOccasion={shopOccasion}
            initialFabric={shopFabric}
            onSelectProduct={handleSelectProduct}
            onQuickView={(p) => setQuickViewProduct(p)}
            onNavigateHome={() => handleNavigate('home')}
          />
        )}

        {currentView === 'product' && selectedProduct && (
          <ProductDetailView
            product={selectedProduct}
            allProducts={products}
            onSelectProduct={handleSelectProduct}
            onQuickView={(p) => setQuickViewProduct(p)}
            onNavigateHome={() => handleNavigate('home')}
            onNavigateCategory={(cat) => handleNavigate('shop', cat)}
            onBuyNow={handleBuyNow}
          />
        )}

        {currentView === 'wishlist' && (
          <WishlistView
            onSelectProduct={handleSelectProduct}
            onExploreCatalog={() => handleNavigate('shop')}
          />
        )}

        {currentView === 'collection' && (
          <CollectionView
            collectionKey={collectionKey}
            products={products}
            onSelectProduct={handleSelectProduct}
            onNavigateHome={() => handleNavigate('home')}
            onNavigateCollections={goToCollections}
          />
        )}

        {currentView === 'aboutus' && <AboutUsView onNavigateHome={() => handleNavigate('home')} />}

        {currentView === 'contact' && <ContactView onNavigateHome={() => handleNavigate('home')} />}

        {currentView in POLICIES && (
          <PolicyView
            policy={currentView as PolicyId}
            onNavigateHome={() => handleNavigate('home')}
            onOpenPolicy={(p) => handleNavigate(p)}
          />
        )}
      </main>

      {/* 4. Multi-Column Luxury Footer */}
      <Footer onNavigate={(view, cat, col) => handleNavigate(view, cat, col)} />

      {/* 5. Mobile Bottom Sticky Navigation */}
      <MobileNav
        currentView={currentView}
        onNavigate={(view) => handleNavigate(view)}
        onOpenSearch={() => setIsSearchOpen(true)}
      />

      {/* 6. Floating WhatsApp Concierge */}
      <WhatsAppButton />
      <WhatsAppGate />

      {/* 7. Drawers & Overlays */}
      <CartDrawer
        onCheckout={() => setIsCheckoutOpen(true)}
        onSelectProduct={handleSelectProduct}
      />

      <SearchOverlay
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        products={products}
        onSelectProduct={handleSelectProduct}
      />

      <QuickViewModal
        product={quickViewProduct}
        isOpen={quickViewProduct !== null}
        onClose={() => setQuickViewProduct(null)}
        onViewDetails={handleSelectProduct}
      />

      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        onOrderSuccess={(orderNum) => {
          // Stay in order confirmation step of checkout modal
        }}
      />

      <AccountModal
        isOpen={isAuthModalOpen || isAccountDashboardOpen}
        onClose={() => {
          closeAuthModal();
          closeAccountDashboard();
        }}
        onNavigateWishlist={() => {
          closeAuthModal();
          closeAccountDashboard();
          handleNavigate('wishlist');
        }}
      />

      {/* 8. Admin Panel Console */}
      {isAdminOpen && (
        <Suspense fallback={null}>
          <AdminDashboard />
        </Suspense>
      )}

      {/* 9. Global Luxury Toasts */}
      <ToastContainer />
    </div>
  );
}

export function App() {
  return (
    <ToastProvider>
      <WishlistProvider>
        <CartProvider>
          <AuthProvider>
            <AdminProvider>
              <MainApp />
            </AdminProvider>
          </AuthProvider>
        </CartProvider>
      </WishlistProvider>
    </ToastProvider>
  );
}

export default App;
