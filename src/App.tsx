import React, { Suspense, lazy, useEffect, useRef, useState } from 'react';
import { jumpTo, scrollToElement } from './lib/smoothScroll';
import { pushUrl, replaceUrl, useBackToClose } from './lib/history';
import { Route, parseUrl, routeTitle, routeToUrl } from './lib/routes';
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
import { PolicyId } from './data/policies';
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
import { LaunchScreen } from './components/common/LaunchScreen';

import { SareeCategory, SareeProduct } from './types';

// The admin workspace is only downloaded when it is opened, keeping the storefront light.
const AdminDashboard = lazy(() => import('./components/admin/AdminDashboard').then((m) => ({ default: m.AdminDashboard })));

function MainApp() {
  const { products: allProducts, isAdminOpen, catalogLoaded } = useAdmin();
  // Only published sarees appear in the storefront; drafts and archived stay in admin.
  const products = allProducts.filter((p) => !p.status || p.status === 'published');
  const { isAuthModalOpen, closeAuthModal, isAccountDashboardOpen, closeAccountDashboard } = useAuth();
  const { addToCart } = useCart();

  const { isCartOpen, closeCart } = useCart();

  // Navigation: the current page lives in the address bar (see lib/routes), so back/forward and shared links work.
  const [route, setRoute] = useState<Route>(() => parseUrl(window.location.pathname, window.location.search));
  const currentView = route.view;
  // How to scroll once the next page has rendered.
  const pendingScroll = useRef<{ top: true } | { y: number } | { section: string } | null>(
    route.view === 'home' && route.section ? { section: `#${route.section}` } : null,
  );

  const goTo = (next: Route) => {
    pendingScroll.current = next.view === 'home' && next.section ? { section: `#${next.section}` } : { top: true };
    const url = routeToUrl(next);
    if (url !== window.location.pathname + window.location.search) pushUrl(url, window.scrollY);
    setRoute(next);
  };

  // Back / forward buttons
  useEffect(() => {
    const onPop = (e: PopStateEvent) => {
      const next = parseUrl(window.location.pathname, window.location.search);
      // Same address (a drawer or modal entry): nothing to change on the page.
      if (routeToUrl(next) === routeToUrl(route)) return;
      pendingScroll.current = { y: e.state?.scrollY ?? 0 };
      setRoute(next);
    };
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, [route]);

  // Scroll after the page has rendered.
  useEffect(() => {
    const p = pendingScroll.current;
    if (!p) return;
    let tries = 0;
    let t: ReturnType<typeof setTimeout>;
    const run = () => {
      pendingScroll.current = null;
      if ('section' in p) return scrollToElement(p.section);
      const y = 'y' in p ? p.y : 0;
      jumpTo(y);
      // The page may still be growing while images load; keep trying until the position is reachable (max ~2s).
      if (Math.abs(window.scrollY - y) > 2 && ++tries < 14) t = setTimeout(run, 150);
    };
    t = setTimeout(run, 'section' in p ? 120 : 0);
    return () => clearTimeout(t);
  }, [route]);

  const selectedProduct = route.view === 'product' ? products.find((p) => p.slug === route.slug) ?? null : null;

  // Tab title, and fix the address if it pointed to a saree that no longer exists.
  useEffect(() => {
    document.title = routeTitle(route, selectedProduct?.name);
    if (route.view === 'product' && !selectedProduct && catalogLoaded) {
      replaceUrl('/sarees');
      setRoute({ view: 'shop' });
    }
  }, [route, selectedProduct, catalogLoaded]);

  // Modals
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState<SareeProduct | null>(null);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

  // On phones, the back button closes whatever is open on top of the page first.
  useBackToClose(isSearchOpen, () => setIsSearchOpen(false));
  useBackToClose(quickViewProduct !== null, () => setQuickViewProduct(null));
  useBackToClose(isCheckoutOpen, () => setIsCheckoutOpen(false));
  useBackToClose(isCartOpen, closeCart);
  useBackToClose(isAuthModalOpen || isAccountDashboardOpen, () => {
    closeAuthModal();
    closeAccountDashboard();
  });

  // Navigation handler used by menus, footer and buttons
  const handleNavigate = (
    view: 'home' | 'shop' | 'wishlist' | 'about' | 'aboutus' | 'contact' | PolicyId,
    category?: string,
    collection?: string,
    occasion?: string,
    fabric?: string
  ) => {
    if (view === 'about') return goTo({ view: 'home', section: 'our-story' }); // Our Story is a home page section
    if (view === 'shop') return goTo({ view: 'shop', category, collection, occasion, fabric });
    goTo({ view } as Route);
  };

  const openCollection = (key: SareeCategory) => goTo({ view: 'collection', key });

  // Home page "Explore Our Collections" section
  const goToCollections = () => goTo({ view: 'home', section: 'collections' });

  const handleSelectProduct = (product: SareeProduct) => goTo({ view: 'product', slug: product.slug });

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

        {route.view === 'shop' && (
          <ShopView
            key={routeToUrl(route)}
            products={products}
            initialCategory={route.category}
            initialCollection={route.collection}
            initialOccasion={route.occasion}
            initialFabric={route.fabric}
            onSelectProduct={handleSelectProduct}
            onQuickView={(p) => setQuickViewProduct(p)}
            onNavigateHome={() => handleNavigate('home')}
          />
        )}

        {route.view === 'product' && selectedProduct && (
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

        {route.view === 'collection' && (
          <CollectionView
            collectionKey={route.key}
            products={products}
            onSelectProduct={handleSelectProduct}
            onNavigateHome={() => handleNavigate('home')}
            onNavigateCollections={goToCollections}
          />
        )}

        {currentView === 'aboutus' && <AboutUsView onNavigateHome={() => handleNavigate('home')} onShopType={(cat) => handleNavigate('shop', cat)} />}

        {currentView === 'contact' && <ContactView onNavigateHome={() => handleNavigate('home')} />}

        {(currentView === 'refund' || currentView === 'shipping' || currentView === 'privacy' || currentView === 'terms') && (
          <PolicyView
            policy={currentView}
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

      {/* Launch screen, first visit in a session */}
      <LaunchScreen />
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
