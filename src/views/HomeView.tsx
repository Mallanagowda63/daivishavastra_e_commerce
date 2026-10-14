import React from 'react';
import { SareeProduct } from '../types';
import { HeroSection } from '../components/home/HeroSection';
import { CategoryCards } from '../components/home/CategoryCards';
import { NewArrivalsSection } from '../components/home/NewArrivalsSection';
import { WeddingBannerSection } from '../components/home/WeddingBannerSection';
import { OccasionsSection } from '../components/home/OccasionsSection';
import { BestSellersCarousel } from '../components/home/BestSellersCarousel';
import { BrandStorySection } from '../components/home/BrandStorySection';
import { FabricsSection } from '../components/home/FabricsSection';
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
}

export const HomeView: React.FC<HomeViewProps> = ({
  products,
  onSelectProduct,
  onQuickView,
  onNavigateToShop,
  onNavigateToAbout,
}) => {
  return (
    <div className="space-y-0">
      {/* 1. Hero */}
      <HeroSection
        onShopNewArrivals={() => onNavigateToShop('New Arrivals')}
        onExploreCollections={() => onNavigateToShop(undefined, 'Wedding Collection')}
        onExploreStory={onNavigateToAbout}
      />

      {/* 2. Our Story + Explore Our Collections */}
      <CategoryCards
        onSelectCategory={(cat) => onNavigateToShop(cat)}
        onSelectCollection={(col) => onNavigateToShop(undefined, col)}
        onLearnMore={onNavigateToAbout}
      />

      {/* 3. New Arrivals */}
      <NewArrivalsSection
        products={products}
        onSelectProduct={onSelectProduct}
        onQuickView={onQuickView}
        onViewAllNewArrivals={() => onNavigateToShop('New Arrivals')}
      />

      {/* 4. The Wedding Edit Banner */}
      <WeddingBannerSection
        onExploreWedding={() => onNavigateToShop(undefined, 'Wedding Collection')}
      />

      {/* 5. Shop by Occasion */}
      <OccasionsSection
        onSelectOccasion={(occ) => onNavigateToShop(undefined, undefined, occ)}
      />

      {/* 6. Best Sellers Carousel */}
      <BestSellersCarousel
        products={products}
        onSelectProduct={onSelectProduct}
        onQuickView={onQuickView}
        onViewAllBestSellers={() => onNavigateToShop('Best Sellers')}
      />

      {/* 7. Brand Story */}
      <BrandStorySection
        onLearnMore={onNavigateToAbout}
      />

      {/* 8. Shop by Fabric */}
      <FabricsSection
        onSelectFabric={(fab) => onNavigateToShop(undefined, undefined, undefined, fab)}
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
