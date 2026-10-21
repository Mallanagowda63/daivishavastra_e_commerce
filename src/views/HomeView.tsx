import React from 'react';
import { SareeCategory, SareeProduct } from '../types';
import { TraditionBanner } from '../components/home/TraditionBanner';
import { scrollToElement } from '../lib/smoothScroll';
import { HeroSection } from '../components/home/HeroSection';
import { CategoryCards } from '../components/home/CategoryCards';
import { CatalogGallery } from '../components/home/CatalogGallery';
import { NewArrivalsSection } from '../components/home/NewArrivalsSection';
import { WeddingBannerSection } from '../components/home/WeddingBannerSection';
import { BestSellersCarousel } from '../components/home/BestSellersCarousel';
import { HeritageFeatureSection } from '../components/home/HeritageFeatureSection';
import { OurStorySection } from '../components/home/OurStorySection';
import { ReviewsSection } from '../components/home/ReviewsSection';
import { TrustFeatures } from '../components/home/TrustFeatures';
import { NewsletterSection } from '../components/home/NewsletterSection';

interface HomeViewProps {
  products: SareeProduct[];
  onSelectProduct: (product: SareeProduct) => void;
  onQuickView: (product: SareeProduct) => void;
  onNavigateToShop: (category?: string, collection?: string, occasion?: string, fabric?: string) => void;
  onNavigateToAbout: () => void;
  onOpenCollection: (key: SareeCategory) => void;
}

export const HomeView: React.FC<HomeViewProps> = ({
  products,
  onSelectProduct,
  onQuickView,
  onNavigateToShop,
  onNavigateToAbout,
  onOpenCollection,
}) => {
  return (
    <div className="space-y-0">
      {/* 1. Hero */}
      <HeroSection onExploreCollections={() => scrollToElement('#collections')} />

      {/* 2. Our Story, feature strip, Explore Our Collections */}
      <CategoryCards products={products} onOpenCollection={onOpenCollection} onLearnMore={onNavigateToAbout} />

      {/* Catalog photos of the whole collection */}
      <CatalogGallery onShop={() => onNavigateToShop()} />

      {/* 3. Wear Tradition, Live Elegance */}
      <TraditionBanner onViewNewArrivals={() => onNavigateToShop('New Arrivals')} />

      {/* 4. New Arrivals */}
      <NewArrivalsSection
        products={products}
        onSelectProduct={onSelectProduct}
        onQuickView={onQuickView}
        onViewAllNewArrivals={() => onNavigateToShop('New Arrivals')}
      />

      {/* 5. The Wedding Edit Banner */}
      <WeddingBannerSection
        onExploreWedding={() => onNavigateToShop(undefined, 'Wedding Collection')}
      />

      {/* 7. Best Sellers Carousel */}
      <BestSellersCarousel
        products={products}
        onSelectProduct={onSelectProduct}
        onQuickView={onQuickView}
        onViewAllBestSellers={() => onNavigateToShop('Best Sellers')}
      />

      {/* 9. Heritage Feature Collection */}
      <HeritageFeatureSection
        onShopCollection={() => onNavigateToShop(undefined, 'The Heritage Edit')}
      />

      {/* 10. Our Story (the "Our Story" links scroll here) */}
      <OurStorySection />

      {/* 12. Customer Reviews */}
      <ReviewsSection products={products} />

      {/* 13. Trust Features */}
      <TrustFeatures />

      {/* 14. Newsletter */}
      <NewsletterSection />
    </div>
  );
};
