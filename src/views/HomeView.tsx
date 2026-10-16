import React from 'react';
import { SareeCategory, SareeProduct } from '../types';
import { TraditionBanner } from '../components/home/TraditionBanner';
import { scrollToElement } from '../lib/smoothScroll';
import { HeroSection } from '../components/home/HeroSection';
import { CategoryCards } from '../components/home/CategoryCards';
import { NewArrivalsSection } from '../components/home/NewArrivalsSection';
import { WeddingBannerSection } from '../components/home/WeddingBannerSection';
import { OccasionsSection } from '../components/home/OccasionsSection';
import { BestSellersCarousel } from '../components/home/BestSellersCarousel';
import { HeritageFeatureSection } from '../components/home/HeritageFeatureSection';
import { SocialGallerySection } from '../components/home/SocialGallerySection';
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
      <CategoryCards onOpenCollection={onOpenCollection} onLearnMore={onNavigateToAbout} />

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

      {/* 6. Shop by Occasion */}
      <OccasionsSection
        onSelectOccasion={(occ) => onNavigateToShop(undefined, undefined, occ)}
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

      {/* 10. Social / Worn With Love */}
      <SocialGallerySection />

      {/* 11. Customer Reviews */}
      <ReviewsSection />

      {/* 12. Trust Features */}
      <TrustFeatures />

      {/* 13. Newsletter */}
      <NewsletterSection />
    </div>
  );
};
