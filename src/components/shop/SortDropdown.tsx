import React from 'react';
import { ChevronDown } from 'lucide-react';
import { FilterState } from '../../types';

interface SortDropdownProps {
  currentSort: FilterState['sortBy'];
  onSortChange: (sort: FilterState['sortBy']) => void;
}

export const SortDropdown: React.FC<SortDropdownProps> = ({ currentSort, onSortChange }) => {
  return (
    <div className="flex items-center gap-2 text-xs font-sans">
      <span className="uppercase tracking-wider font-semibold text-[11px] text-gold-300 hidden sm:inline">
        Sort By:
      </span>
      <div className="relative inline-block">
        <select
          value={currentSort}
          onChange={(e) => onSortChange(e.target.value as FilterState['sortBy'])}
          className="appearance-none bg-transparent border border-gold-500/70 rounded-full px-4 py-2 pr-9 font-serif text-sm text-ivory focus:outline-none focus:border-gold-300 hover:border-gold-300 cursor-pointer [&>option]:bg-ivory [&>option]:text-charcoal"
        >
          <option value="featured">Featured Curations</option>
          <option value="newest">New Arrivals</option>
          <option value="best-selling">Best Sellers</option>
          <option value="price-low">Price: Low to High</option>
          <option value="price-high">Price: High to Low</option>
        </select>
        <ChevronDown className="w-3.5 h-3.5 text-gold-300 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
      </div>
    </div>
  );
};
