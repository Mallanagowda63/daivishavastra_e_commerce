import React from 'react';
import { ImageWithFallback } from '../common/ImageWithFallback';

interface MegaMenuProps {
  type: 'sarees' | 'collections';
  isOpen: boolean;
  onClose: () => void;
  onSelectCategory: (category: string) => void;
  onSelectCollection: (collection: string) => void;
}

export const MegaMenu: React.FC<MegaMenuProps> = ({
  type,
  isOpen,
  onClose,
  onSelectCategory,
  onSelectCollection,
}) => {
  if (!isOpen) return null;

  const sareeCategories = [
    { name: 'Silk Sarees', desc: 'Lustrous pure mulberry weave', tag: 'Bestseller' },
    { name: 'Kanjivaram Sarees', desc: 'Temple borders with tested gold zari', tag: 'Royal Heirloom' },
    { name: 'Banarasi Sarees', desc: 'Authentic Varanasi Kadwa and Katan', tag: 'Heritage' },
    { name: 'Cotton Sarees', desc: 'Maheshwari and Chanderi blends', tag: 'All-Day' },
    { name: 'Organza Sarees', desc: 'Whisper-light with hand gota patti', tag: 'Trending' },
    { name: 'Georgette Sarees', desc: 'Flowing Chikankari and sequin drape', tag: 'Party' },
    { name: 'Linen Sarees', desc: 'Organic handspun breathable luxury', tag: 'Minimal' },
    { name: 'Designer Sarees', desc: 'Modern couture embroidery', tag: 'Exclusive' },
    { name: 'Handloom Sarees', desc: 'Woven by master karigars of India', tag: 'Artisan' },
  ];

  const collections = [
    { name: 'Wedding Collection', desc: 'Grand bridal weaves for sacred vows', tag: 'Couture' },
    { name: 'Festive Collection', desc: 'Vibrant silks for celebratory auspiciousness', tag: 'Festive' },
    { name: 'Office Wear', desc: 'Understated cottons & linens for executive poise', tag: 'Daywear' },
    { name: 'Party Wear', desc: 'Luminous organza & georgette cocktail drapes', tag: 'Evening' },
    { name: 'Daily Wear', desc: 'Featherlight comfortable artisanal staples', tag: 'Essential' },
    { name: 'Luxury Collection', desc: 'Limited edition museum-grade heirlooms', tag: 'Masterpiece' },
  ];

  return (
    <div
      onMouseLeave={onClose}
      className="absolute top-full left-0 w-full bg-[#fdfbf7] border-b border-sand shadow-2xl z-40 transition-all duration-300 animate-in fade-in slide-in-from-top-2"
    >
      <div className="max-w-7xl mx-auto px-6 py-8">
        {type === 'sarees' ? (
          <div className="grid grid-cols-12 gap-8 items-stretch">
            {/* Column 1 & 2: Categories */}
            <div className="col-span-8 grid grid-cols-3 gap-y-4 gap-x-6">
              {sareeCategories.map((cat) => (
                <button
                  key={cat.name}
                  onClick={() => {
                    onSelectCategory(cat.name);
                    onClose();
                  }}
                  className="group text-left p-2.5 rounded-none hover:bg-cream/70 transition-all duration-200 border-l border-transparent hover:border-gold-600"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-serif text-[15px] font-medium text-charcoal group-hover:text-burgundy-800 transition-colors">
                      {cat.name}
                    </span>
                  </div>
                  <p className="text-[11px] text-stone-500 mt-0.5 line-clamp-1">
                    {cat.desc}
                  </p>
                </button>
              ))}
            </div>

            {/* Column 3: Featured Editorial Card */}
            <div className="col-span-4 bg-cream/40 p-4 border border-sand flex flex-col justify-between">
              <div className="relative aspect-[4/3] overflow-hidden mb-3">
                <ImageWithFallback
                  src="/src/assets/images/kanjivaram_silk_saree_1791372743617.jpg"
                  alt="The Kanchipuram Weaving Legacy"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <span className="absolute top-2 left-2 bg-burgundy-900/90 text-gold-300 text-[10px] tracking-widest uppercase px-2.5 py-1">
                  Heirloom Spotlight
                </span>
              </div>
              <div>
                <h4 className="font-serif text-base text-charcoal font-semibold">
                  The Pure Kanchipuram Korvai
                </h4>
                <p className="text-xs text-stone-600 mt-1 leading-relaxed">
                  Interlocked by two master weavers simultaneously to create seamless contrast borders.
                </p>
                <button
                  onClick={() => {
                    onSelectCategory('Kanjivaram Sarees');
                    onClose();
                  }}
                  className="mt-3 text-xs tracking-widest uppercase font-semibold text-burgundy-800 hover:text-gold-700 inline-flex items-center gap-1.5 transition-colors"
                >
                  Explore Kanjivaram Sarees →
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-12 gap-8 items-stretch">
            {/* Column 1 & 2: Collections */}
            <div className="col-span-8 grid grid-cols-2 gap-y-4 gap-x-8">
              {collections.map((col) => (
                <button
                  key={col.name}
                  onClick={() => {
                    onSelectCollection(col.name);
                    onClose();
                  }}
                  className="group text-left p-3 hover:bg-cream/70 transition-all duration-200 border-l border-transparent hover:border-gold-600"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-serif text-lg font-medium text-charcoal group-hover:text-burgundy-800 transition-colors">
                      {col.name}
                    </span>
                    <span className="text-[10px] tracking-widest uppercase text-gold-600 font-medium">
                      {col.tag}
                    </span>
                  </div>
                  <p className="text-xs text-stone-500 mt-1">
                    {col.desc}
                  </p>
                </button>
              ))}
            </div>

            {/* Column 3: Featured Wedding Edit Banner */}
            <div className="col-span-4 bg-cream/40 p-4 border border-sand flex flex-col justify-between">
              <div className="relative aspect-[4/3] overflow-hidden mb-3">
                <ImageWithFallback
                  src="/src/assets/images/wedding_edit_banner_1791372730952.jpg"
                  alt="The Wedding Edit"
                  className="w-full h-full object-cover"
                />
                <span className="absolute top-2 left-2 bg-burgundy-900/90 text-gold-300 text-[10px] tracking-widest uppercase px-2.5 py-1">
                  Bridal Troussier
                </span>
              </div>
              <div>
                <h4 className="font-serif text-base text-charcoal font-semibold">
                  The Royal Wedding Edit
                </h4>
                <p className="text-xs text-stone-600 mt-1 leading-relaxed">
                  Crafted with real gold and silver zari for your most auspicious life vows.
                </p>
                <button
                  onClick={() => {
                    onSelectCollection('Wedding Collection');
                    onClose();
                  }}
                  className="mt-3 text-xs tracking-widest uppercase font-semibold text-burgundy-800 hover:text-gold-700 inline-flex items-center gap-1.5 transition-colors"
                >
                  View Wedding Edit →
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
