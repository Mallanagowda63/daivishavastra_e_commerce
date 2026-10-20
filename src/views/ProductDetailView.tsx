import React, { useEffect } from 'react';
import { ProductReviews } from '../components/product/ProductReviews';
import { PosterShowcase } from '../components/product/PosterShowcase';
import { scrollToTop } from '../lib/smoothScroll';
import { SareeProduct } from '../types';
import { ProductGallery } from '../components/product/ProductGallery';
import { ProductInfo } from '../components/product/ProductInfo';
import { StylingSuggestions } from '../components/product/StylingSuggestions';
import { ChevronRight, ShoppingBag, Zap } from 'lucide-react';
import { useCart } from '../context/CartContext';

interface ProductDetailViewProps {
  product: SareeProduct;
  allProducts: SareeProduct[];
  onSelectProduct: (product: SareeProduct) => void;
  onQuickView: (product: SareeProduct) => void;
  onNavigateHome: () => void;
  onNavigateCategory: (category: string) => void;
  onBuyNow: (product: SareeProduct, quantity: number, color: string) => void;
}

export const ProductDetailView: React.FC<ProductDetailViewProps> = ({
  product,
  allProducts,
  onSelectProduct,
  onQuickView,
  onNavigateHome,
  onNavigateCategory,
  onBuyNow,
}) => {
  const { addToCart } = useCart();

  useEffect(() => {
    scrollToTop();
  }, [product.id]);

  // Related products from same category or collection
  const relatedProducts = allProducts.filter(
    (p) => p.id !== product.id && (p.category === product.category || p.collection === product.collection)
  );

  return (
    <div className="py-6 sm:py-10 pb-28 lg:pb-16">
      <div className="max-w-[1880px] mx-auto px-3 sm:px-6 lg:px-8">
      {/* Breadcrumb Navigation */}
      <nav aria-label="Breadcrumbs" className="flex items-center gap-2 text-xs text-stone-500 font-sans mb-8 overflow-x-auto whitespace-nowrap pb-1">
        <button onClick={onNavigateHome} className="hover:text-burgundy-900 transition-colors">
          Home
        </button>
        <ChevronRight className="w-3.5 h-3.5 text-stone-400 shrink-0" />
        <button
          onClick={() => onNavigateCategory(product.category)}
          className="hover:text-burgundy-900 transition-colors"
        >
          {product.category}
        </button>
        <ChevronRight className="w-3.5 h-3.5 text-stone-400 shrink-0" />
        <span className="text-charcoal font-medium truncate max-w-xs">{product.name}</span>
      </nav>

      {/* Poster-style showcase */}
      <PosterShowcase product={product} onBuyNow={onBuyNow} />
      </div>

      {/* Everything below keeps the normal page width */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

      <h2 className="mt-10 mb-5 font-serif text-2xl sm:text-3xl text-burgundy-900">Photos &amp; ordering</h2>

      {/* Main 2-Column Product Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
        {/* Left: Gallery (Takes 7 columns on desktop for large editorial presence) */}
        <div className="lg:col-span-7">
          <ProductGallery images={product.images} productName={product.name} />
        </div>

        {/* Right: Contiguous Purchase Module (Takes 5 columns, sticky) */}
        <div className="lg:col-span-5 lg:sticky lg:top-24">
          <ProductInfo product={product} onBuyNow={onBuyNow} />
        </div>
      </div>

      {/* Customer reviews */}
      <ProductReviews product={product} />

      {/* Styling Suggestions, Complete the Look & Related Sarees */}
      <StylingSuggestions
        product={product}
        relatedProducts={relatedProducts}
        onSelectProduct={onSelectProduct}
        onQuickView={onQuickView}
      />

      </div>

      {/* Mobile Sticky Bottom Purchase Bar (capped <= 15% viewport height as per frontend-design) */}
      <div className="lg:hidden fixed bottom-14 inset-x-0 bg-[#faf7f2]/95 backdrop-blur-md border-t border-sand p-3 z-30 shadow-2xl flex items-center gap-3">
        <div className="flex-1">
          <span className="font-bold text-sm text-burgundy-950 block tabular-nums">
            ₹{product.sellingPrice.toLocaleString('en-IN')}
          </span>
          <span className="text-[10px] text-stone-500 line-clamp-1">{product.name}</span>
        </div>

        <button
          onClick={() => addToCart(product, 1, product.color)}
          className="px-4 py-2.5 bg-burgundy-950 text-gold-300 font-semibold text-xs tracking-wider uppercase shrink-0"
        >
          Add to Bag
        </button>
        <button
          onClick={() => onBuyNow(product, 1, product.color)}
          className="px-4 py-2.5 bg-gold-500 text-burgundy-950 font-bold text-xs tracking-wider uppercase shrink-0"
        >
          Buy Now
        </button>
      </div>
    </div>
  );
};
