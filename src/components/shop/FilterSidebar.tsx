import React from 'react';
import { FilterState, SareeCategory, SareeCollection, SareeFabric, SareeOccasion } from '../../types';
import { X, Check } from 'lucide-react';

interface FilterSidebarProps {
  filters: FilterState;
  onFilterChange: (newFilters: FilterState) => void;
  onResetFilters: () => void;
  totalResultsCount: number;
}

export const FilterSidebar: React.FC<FilterSidebarProps> = ({
  filters,
  onFilterChange,
  onResetFilters,
  totalResultsCount,
}) => {
  const categoriesList: SareeCategory[] = [
    'Silk Sarees',
    'Kanjivaram Sarees',
    'Banarasi Sarees',
    'Cotton Sarees',
    'Organza Sarees',
    'Georgette Sarees',
    'Linen Sarees',
    'Designer Sarees',
    'Handloom Sarees',
  ];

  const collectionsList: SareeCollection[] = [
    'Wedding Collection',
    'Festive Collection',
    'Office Wear',
    'Party Wear',
    'Daily Wear',
    'Luxury Collection',
  ];

  const fabricsList: SareeFabric[] = [
    'Pure Silk',
    'Kanjivaram Silk',
    'Banarasi Katan Silk',
    'Cotton Silk',
    'Organza',
    'Chanderi Silk',
    'Georgette',
    'Pure Linen',
  ];

  const occasionsList: SareeOccasion[] = [
    'Wedding',
    'Festive',
    'Party',
    'Office Wear',
    'Traditional',
    'Daily Elegance',
  ];

  const handleCategoryToggle = (cat: SareeCategory) => {
    const exists = filters.categories.includes(cat);
    const updated = exists
      ? filters.categories.filter((c) => c !== cat)
      : [...filters.categories, cat];
    onFilterChange({ ...filters, categories: updated });
  };

  const handleCollectionToggle = (col: SareeCollection) => {
    const exists = filters.collections.includes(col);
    const updated = exists
      ? filters.collections.filter((c) => c !== col)
      : [...filters.collections, col];
    onFilterChange({ ...filters, collections: updated });
  };

  const handleFabricToggle = (fab: SareeFabric) => {
    const exists = filters.fabrics.includes(fab);
    const updated = exists
      ? filters.fabrics.filter((f) => f !== fab)
      : [...filters.fabrics, fab];
    onFilterChange({ ...filters, fabrics: updated });
  };

  const handleOccasionToggle = (occ: SareeOccasion) => {
    const exists = filters.occasions.includes(occ);
    const updated = exists
      ? filters.occasions.filter((o) => o !== occ)
      : [...filters.occasions, occ];
    onFilterChange({ ...filters, occasions: updated });
  };

  const hasActiveFilters =
    filters.categories.length > 0 ||
    filters.collections.length > 0 ||
    filters.fabrics.length > 0 ||
    filters.occasions.length > 0 ||
    filters.inStockOnly ||
    filters.priceRange[1] < 60000;

  return (
    <aside className="w-full space-y-6 text-xs font-sans text-charcoal">
      {/* Header & Reset */}
      <div className="flex items-center justify-between border-b border-sand pb-3">
        <div>
          <h3 className="font-serif text-lg font-bold text-burgundy-950">Refine Curation</h3>
          <span className="text-[11px] text-stone-500">Showing {totalResultsCount} sarees</span>
        </div>
        {hasActiveFilters && (
          <button
            onClick={onResetFilters}
            className="text-xs text-burgundy-800 hover:text-gold-700 font-semibold uppercase tracking-wider flex items-center gap-1 transition-colors"
          >
            <X className="w-3.5 h-3.5" />
            <span>Reset All</span>
          </button>
        )}
      </div>

      {/* Stock Filter Toggle */}
      <div className="flex items-center justify-between py-2 border-b border-sand">
        <span className="font-semibold text-charcoal uppercase tracking-wider text-[11px]">
          In Stock Only
        </span>
        <button
          onClick={() => onFilterChange({ ...filters, inStockOnly: !filters.inStockOnly })}
          className={`w-9 h-5 rounded-full transition-colors relative ${
            filters.inStockOnly ? 'bg-burgundy-950' : 'bg-sand'
          }`}
          aria-label="Toggle in-stock only filter"
        >
          <span
            className={`w-3.5 h-3.5 rounded-full bg-white absolute top-0.5 transition-transform ${
              filters.inStockOnly ? 'right-0.5' : 'left-0.5'
            }`}
          />
        </button>
      </div>

      {/* Price Range Filter */}
      <div className="space-y-3 border-b border-sand pb-5">
        <div className="flex items-center justify-between font-semibold uppercase tracking-wider text-[11px]">
          <span>Maximum Price</span>
          <span className="text-burgundy-950 font-bold tabular-nums">
            Up to ₹{filters.priceRange[1].toLocaleString('en-IN')}
          </span>
        </div>
        <input
          type="range"
          min={5000}
          max={60000}
          step={2000}
          value={filters.priceRange[1]}
          onChange={(e) =>
            onFilterChange({
              ...filters,
              priceRange: [filters.priceRange[0], Number(e.target.value)],
            })
          }
          className="w-full accent-burgundy-900 cursor-pointer"
        />
        <div className="flex justify-between text-[10px] text-stone-500">
          <span>₹5,000</span>
          <span>₹30,000</span>
          <span>₹60,000+</span>
        </div>
      </div>

      {/* Category Filter */}
      <div className="space-y-2.5 border-b border-sand pb-5">
        <h4 className="font-semibold uppercase tracking-wider text-[11px] text-burgundy-950">
          Saree Silhouette &amp; Type
        </h4>
        <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
          {categoriesList.map((cat) => {
            const isSelected = filters.categories.includes(cat);
            return (
              <label
                key={cat}
                className="flex items-center gap-2 cursor-pointer hover:text-burgundy-900 group select-none text-[12px]"
              >
                <div
                  onClick={() => handleCategoryToggle(cat)}
                  className={`w-4 h-4 border flex items-center justify-center transition-colors ${
                    isSelected
                      ? 'bg-burgundy-950 border-burgundy-950 text-gold-300'
                      : 'border-sand bg-white group-hover:border-stone-400'
                  }`}
                >
                  {isSelected && <Check className="w-3 h-3" />}
                </div>
                <span onClick={() => handleCategoryToggle(cat)}>{cat}</span>
              </label>
            );
          })}
        </div>
      </div>

      {/* Occasion Filter */}
      <div className="space-y-2.5 border-b border-sand pb-5">
        <h4 className="font-semibold uppercase tracking-wider text-[11px] text-burgundy-950">
          Occasion
        </h4>
        <div className="space-y-1.5">
          {occasionsList.map((occ) => {
            const isSelected = filters.occasions.includes(occ);
            return (
              <label
                key={occ}
                className="flex items-center gap-2 cursor-pointer hover:text-burgundy-900 group select-none text-[12px]"
              >
                <div
                  onClick={() => handleOccasionToggle(occ)}
                  className={`w-4 h-4 border flex items-center justify-center transition-colors ${
                    isSelected
                      ? 'bg-burgundy-950 border-burgundy-950 text-gold-300'
                      : 'border-sand bg-white group-hover:border-stone-400'
                  }`}
                >
                  {isSelected && <Check className="w-3 h-3" />}
                </div>
                <span onClick={() => handleOccasionToggle(occ)}>{occ}</span>
              </label>
            );
          })}
        </div>
      </div>

      {/* Fabric Filter */}
      <div className="space-y-2.5 border-b border-sand pb-5">
        <h4 className="font-semibold uppercase tracking-wider text-[11px] text-burgundy-950">
          Fabric &amp; Weave
        </h4>
        <div className="space-y-1.5">
          {fabricsList.map((fab) => {
            const isSelected = filters.fabrics.includes(fab);
            return (
              <label
                key={fab}
                className="flex items-center gap-2 cursor-pointer hover:text-burgundy-900 group select-none text-[12px]"
              >
                <div
                  onClick={() => handleFabricToggle(fab)}
                  className={`w-4 h-4 border flex items-center justify-center transition-colors ${
                    isSelected
                      ? 'bg-burgundy-950 border-burgundy-950 text-gold-300'
                      : 'border-sand bg-white group-hover:border-stone-400'
                  }`}
                >
                  {isSelected && <Check className="w-3 h-3" />}
                </div>
                <span onClick={() => handleFabricToggle(fab)}>{fab}</span>
              </label>
            );
          })}
        </div>
      </div>

      {/* Collections Filter */}
      <div className="space-y-2.5 pb-2">
        <h4 className="font-semibold uppercase tracking-wider text-[11px] text-burgundy-950">
          Curated Edits
        </h4>
        <div className="space-y-1.5">
          {collectionsList.map((col) => {
            const isSelected = filters.collections.includes(col);
            return (
              <label
                key={col}
                className="flex items-center gap-2 cursor-pointer hover:text-burgundy-900 group select-none text-[12px]"
              >
                <div
                  onClick={() => handleCollectionToggle(col)}
                  className={`w-4 h-4 border flex items-center justify-center transition-colors ${
                    isSelected
                      ? 'bg-burgundy-950 border-burgundy-950 text-gold-300'
                      : 'border-sand bg-white group-hover:border-stone-400'
                  }`}
                >
                  {isSelected && <Check className="w-3 h-3" />}
                </div>
                <span onClick={() => handleCollectionToggle(col)}>{col}</span>
              </label>
            );
          })}
        </div>
      </div>
    </aside>
  );
};
