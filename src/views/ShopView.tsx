import React, { useState, useMemo } from 'react';
import { FilterState, SareeProduct, SareeCategory, SareeCollection, SareeFabric, SareeOccasion } from '../types';
import { SortDropdown } from '../components/shop/SortDropdown';
import { ProductGrid } from '../components/product/ProductGrid';
import { ChevronRight } from 'lucide-react';
import { LotusMark } from '../components/layout/BrandEmblem';
import { ARCH_PATH, archMaskStyle } from '../components/common/TempleArch';

const CATEGORY_CHIPS: SareeCategory[] = [
  'Gajji Silks',
  'Mysore Silk Crepe',
  'Soft Tissue Silk',
  'Silk Sarees',
  'Kanjivaram Sarees',
  'Banarasi Sarees',
  'Cotton Sarees',
  'Organza Sarees',
  'Linen Sarees',
  'Designer Sarees',
  'Handloom Sarees',
];

interface ShopViewProps {
  products: SareeProduct[];
  initialCategory?: string;
  initialCollection?: string;
  initialOccasion?: string;
  initialFabric?: string;
  onSelectProduct: (product: SareeProduct) => void;
  onQuickView: (product: SareeProduct) => void;
  onNavigateHome: () => void;
}

export const ShopView: React.FC<ShopViewProps> = ({
  products,
  initialCategory,
  initialCollection,
  initialOccasion,
  initialFabric,
  onSelectProduct,
  onQuickView,
  onNavigateHome,
}) => {
  // Initialize filters
  const [filters, setFilters] = useState<FilterState>(() => {
    const cats: SareeCategory[] = [];
    const cols: SareeCollection[] = [];
    const occs: SareeOccasion[] = [];
    const fabs: SareeFabric[] = [];

    if (initialCategory && initialCategory !== 'New Arrivals' && initialCategory !== 'Best Sellers') {
      cats.push(initialCategory as SareeCategory);
    }
    if (initialCollection) {
      cols.push(initialCollection as SareeCollection);
    }
    if (initialOccasion) {
      occs.push(initialOccasion as SareeOccasion);
    }
    if (initialFabric) {
      fabs.push(initialFabric as SareeFabric);
    }

    return {
      categories: cats,
      collections: cols,
      fabrics: fabs,
      occasions: occs,
      priceRange: [0, 60000],
      inStockOnly: false,
      searchQuery: '',
      sortBy: initialCategory === 'New Arrivals' ? 'newest' : initialCategory === 'Best Sellers' ? 'best-selling' : 'featured',
    };
  });

  // Filter and Sort logic
  const filteredAndSortedProducts = useMemo(() => {
    let result = [...products];

    // Category filter
    if (filters.categories.length > 0) {
      result = result.filter((p) => filters.categories.includes(p.category));
    }

    // Collection filter
    if (filters.collections.length > 0) {
      result = result.filter((p) => filters.collections.includes(p.collection));
    }

    // Fabric filter
    if (filters.fabrics.length > 0) {
      result = result.filter((p) => filters.fabrics.includes(p.fabric));
    }

    // Occasion filter
    if (filters.occasions.length > 0) {
      result = result.filter((p) =>
        p.occasion.some((occ) => filters.occasions.includes(occ))
      );
    }

    // Price range
    result = result.filter(
      (p) => p.sellingPrice >= filters.priceRange[0] && p.sellingPrice <= filters.priceRange[1]
    );

    // In stock
    if (filters.inStockOnly) {
      result = result.filter((p) => p.stock > 0);
    }

    // Sorting
    switch (filters.sortBy) {
      case 'newest':
        result.sort((a, b) => (b.isNewArrival ? 1 : 0) - (a.isNewArrival ? 1 : 0));
        break;
      case 'best-selling':
        result.sort((a, b) => (b.isBestSeller ? 1 : 0) - (a.isBestSeller ? 1 : 0));
        break;
      case 'price-low':
        result.sort((a, b) => a.sellingPrice - b.sellingPrice);
        break;
      case 'price-high':
        result.sort((a, b) => b.sellingPrice - a.sellingPrice);
        break;
      default:
        // featured
        result.sort((a, b) => b.rating - a.rating);
        break;
    }

    return result;
  }, [products, filters]);

  const pageTitle =
    filters.categories.length === 1
      ? filters.categories[0]
      : filters.collections.length === 1
      ? filters.collections[0]
      : filters.occasions.length === 1
      ? `${filters.occasions[0]} Sarees`
      : 'All Handcrafted Sarees';

  const selectCategory = (category: SareeCategory | null) =>
    setFilters({ ...filters, categories: category ? [category] : [], collections: [], occasions: [], fabrics: [] });

  const isAllActive =
    filters.categories.length === 0 &&
    filters.collections.length === 0 &&
    filters.occasions.length === 0 &&
    filters.fabrics.length === 0;

  return (
    <div>
      {/* Heritage banner */}
      <section className="relative overflow-hidden bg-gradient-to-r from-[#fbefdf] via-[#fbf1e3] to-[#f6e6cf]">
        {/* Model in a temple arch — pinned to the right edge, full banner height */}
        <div className="hidden md:block absolute right-4 lg:right-[5%] top-5 h-[calc(100%-1.25rem)] aspect-[4/5]">
          <img
            src="/images/story_temple.jpg"
            alt=""
            className="absolute right-full bottom-0 h-[85%] w-auto -mr-10 mix-blend-multiply opacity-50 pointer-events-none [mask-image:radial-gradient(ellipse_at_center,black_50%,transparent_78%)]"
          />
          <div className="absolute inset-0 bg-[#fffaf3] p-1.5 drop-shadow-lg" style={archMaskStyle}>
            <img
              src="/images/kanjivaram_silk_saree_1791372743617.jpg"
              alt="Model seated in a red Kanjivaram silk saree"
              className="w-full h-full object-cover object-[50%_20%]"
              style={archMaskStyle}
            />
          </div>
          <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 w-full h-full pointer-events-none" aria-hidden="true">
            <path d={ARCH_PATH} fill="none" stroke="#b08d46" strokeWidth="4" vectorEffect="non-scaling-stroke" />
          </svg>
          {/* Floating caption */}
          <div className="absolute -left-6 bottom-6 bg-burgundy-800 text-ivory px-3.5 py-2.5 shadow-lg border border-gold-500/50">
            <p className="font-serif text-base leading-none">Handwoven</p>
            <p className="text-[9px] uppercase tracking-[0.2em] text-gold-300 mt-1">Kanjivaram Silk</p>
          </div>
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
          <div className="md:pr-[340px] lg:pr-[400px]">
          {/* Breadcrumbs */}
          <nav aria-label="Breadcrumbs" className="flex items-center gap-2 text-xs text-stone-500 font-sans mb-6">
            <button onClick={onNavigateHome} className="hover:text-burgundy-900 transition-colors">
              Home
            </button>
            <ChevronRight className="w-3.5 h-3.5 text-stone-400" />
            <span className="text-charcoal font-medium">{pageTitle}</span>
          </nav>

          <div className="max-w-xl text-center lg:text-left">
            <span className="inline-flex items-center gap-2 font-serif text-sm sm:text-base uppercase tracking-[0.25em] text-gold-700">
              <LotusMark className="w-5 h-5" />
              The Atelier Catalog
            </span>
            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-medium text-burgundy-800 mt-2 leading-tight">
              {pageTitle}
            </h1>
            <div className="flex items-center justify-center lg:justify-start gap-2 my-4 text-gold-600" aria-hidden="true">
              <span className="h-px w-20 bg-gradient-to-r from-transparent to-gold-500 lg:from-gold-500 lg:to-gold-500" />
              <span className="w-2 h-2 rotate-45 bg-gold-500" />
              <span className="h-px w-20 bg-gradient-to-l from-transparent to-gold-500" />
            </div>
            <p className="font-serif text-base sm:text-lg text-stone-700 leading-relaxed">
              Certified authentic handloom drapes with tested gold &amp; silver zari — woven by master karigars across India.
            </p>
            <p className="mt-4 text-xs uppercase tracking-[0.2em] text-burgundy-900 font-semibold">
              {filteredAndSortedProducts.length} handcrafted {filteredAndSortedProducts.length === 1 ? 'piece' : 'pieces'}
            </p>
          </div>
          </div>
        </div>
      </section>

      {/* Maroon band: category chips + sorting */}
      <div className="bg-[#4a0f1a] border-t-2 border-gold-500 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex gap-2 overflow-x-auto pb-1 lg:pb-0 -mx-4 px-4 sm:mx-0 sm:px-0 sm:flex-wrap">
            {[null, ...CATEGORY_CHIPS].map((cat) => {
              const active = cat === null ? isAllActive : filters.categories.length === 1 && filters.categories[0] === cat;
              return (
                <button
                  key={cat ?? 'all'}
                  onClick={() => selectCategory(cat)}
                  className={`shrink-0 px-4 py-1.5 rounded-full border font-serif text-sm tracking-wide transition-colors cursor-pointer ${
                    active
                      ? 'bg-gold-500 border-gold-500 text-burgundy-950 font-semibold'
                      : 'border-gold-500/50 text-ivory hover:border-gold-300 hover:text-gold-300'
                  }`}
                >
                  {cat === null ? 'All Sarees' : cat.replace(' Sarees', '')}
                </button>
              );
            })}
          </div>

          <div className="flex items-center justify-end gap-3 shrink-0">
            <SortDropdown
              currentSort={filters.sortBy}
              onSortChange={(sortBy) => setFilters({ ...filters, sortBy })}
            />
          </div>
        </div>
      </div>

      <div className="py-8 sm:py-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Products */}
        <ProductGrid
          products={filteredAndSortedProducts}
          onSelectProduct={onSelectProduct}
          onQuickView={onQuickView}
          columns={4}
        />
      </div>
    </div>
  );
};
