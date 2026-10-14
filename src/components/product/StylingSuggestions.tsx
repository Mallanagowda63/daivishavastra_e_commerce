import React from 'react';
import { Sparkles, ShoppingBag, Plus } from 'lucide-react';
import { SareeProduct } from '../../types';
import { useCart } from '../../context/CartContext';
import { ProductCard } from './ProductCard';

interface StylingSuggestionsProps {
  product: SareeProduct;
  relatedProducts: SareeProduct[];
  onSelectProduct: (product: SareeProduct) => void;
  onQuickView: (product: SareeProduct) => void;
}

export const StylingSuggestions: React.FC<StylingSuggestionsProps> = ({
  product,
  relatedProducts,
  onSelectProduct,
  onQuickView,
}) => {
  const { addToCart } = useCart();

  const handleAddAccessory = (acc: { name: string; price: number }) => {
    // Add accessory as mock companion item to cart
    const dummyProduct: SareeProduct = {
      ...product,
      id: `acc-${Date.now()}`,
      name: acc.name,
      sellingPrice: acc.price,
      originalPrice: acc.price + 1000,
      discountPercentage: 10,
      stock: 5,
    };
    addToCart(dummyProduct, 1);
  };

  return (
    <div className="space-y-16 pt-12 border-t border-sand">
      {/* Styling Tips & Complete the Look */}
      <div className="bg-cream/40 p-6 md:p-8 border border-sand">
        <div className="flex items-center gap-2 text-xs font-semibold tracking-widest uppercase text-burgundy-900 mb-3">
          <Sparkles className="w-4 h-4 text-gold-600" />
          <span>Atelier Styling Suggestions</span>
        </div>
        <h3 className="font-serif text-2xl text-charcoal font-semibold mb-4">
          Complete Your Royal Ensemble
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
          {/* Styling Points */}
          <div className="space-y-3">
            <p className="text-xs text-stone-500 uppercase tracking-wider font-semibold">
              Curated by Chief Drape Stylist:
            </p>
            <ul className="space-y-2 text-sm text-stone-700 font-sans list-disc list-inside">
              {product.stylingTips.map((tip, idx) => (
                <li key={idx} className="leading-relaxed">
                  {tip}
                </li>
              ))}
            </ul>
          </div>

          {/* Paired Companion Pieces */}
          {product.matchingAccessories && product.matchingAccessories.length > 0 && (
            <div className="space-y-3">
              <p className="text-xs text-stone-500 uppercase tracking-wider font-semibold">
                Harmonious Pairings:
              </p>
              <div className="space-y-2.5">
                {product.matchingAccessories.map((acc, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-3 bg-white border border-sand/70 text-xs font-sans"
                  >
                    <div>
                      <span className="font-medium text-charcoal block">{acc.name}</span>
                      <span className="text-[11px] text-stone-500">{acc.type} · ₹{acc.price.toLocaleString('en-IN')}</span>
                    </div>
                    <button
                      onClick={() => handleAddAccessory(acc)}
                      className="px-3 py-1.5 bg-burgundy-950 text-gold-300 hover:bg-burgundy-900 font-medium text-[11px] uppercase tracking-wider flex items-center gap-1 transition-colors"
                    >
                      <Plus className="w-3 h-3" />
                      <span>Add</span>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* You May Also Like Section */}
      {relatedProducts.length > 0 && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 border-b border-sand pb-4">
            <div>
              <span className="text-xs uppercase tracking-widest text-gold-700 font-semibold">
                Handpicked Pairings
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-burgundy-950 mt-1">
                You May Also Admire
              </h2>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            {relatedProducts.slice(0, 4).map((relProduct) => (
              <ProductCard
                key={relProduct.id}
                product={relProduct}
                onSelect={onSelectProduct}
                onQuickView={onQuickView}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
