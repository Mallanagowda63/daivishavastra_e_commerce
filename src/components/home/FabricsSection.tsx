import React from 'react';
import { FABRICS_DATA } from '../../data/categories';
import { ArrowRight } from 'lucide-react';

interface FabricsSectionProps {
  onSelectFabric: (fabric: string) => void;
}

export const FabricsSection: React.FC<FabricsSectionProps> = ({ onSelectFabric }) => {
  return (
    <section className="py-20 lg:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto mb-14 space-y-2">
        <span className="text-xs uppercase tracking-[0.2em] text-gold-700 font-semibold">
          Tactile Luxury
        </span>
        <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-burgundy-950">
          Shop by Fabric
        </h2>
        <p className="text-sm text-stone-600 font-sans">
          Select the feel, fall, and texture that speaks to your occasion.
        </p>
      </div>

      {/* Fabric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {FABRICS_DATA.map((fab) => (
          <div
            key={fab.name}
            onClick={() => onSelectFabric(fab.name)}
            className="group p-8 bg-cream/40 border border-sand hover:border-gold-600 hover:bg-white transition-all duration-300 cursor-pointer flex flex-col justify-between"
          >
            <div>
              <div className="w-12 h-12 border border-gold-500/40 flex items-center justify-center font-serif text-xl font-bold text-burgundy-900 mb-6 bg-white shadow-sm group-hover:bg-burgundy-950 group-hover:text-gold-300 transition-colors">
                {fab.iconLetter}
              </div>
              <h3 className="font-serif text-2xl font-bold text-charcoal group-hover:text-burgundy-950 transition-colors">
                {fab.name}
              </h3>
              <p className="text-xs text-stone-600 font-sans mt-2.5 leading-relaxed">
                {fab.description}
              </p>
            </div>

            <div className="mt-8 pt-4 border-t border-sand/60 flex items-center justify-between text-xs font-semibold uppercase tracking-widest text-burgundy-900 group-hover:text-gold-700 transition-colors">
              <span>Explore {fab.name} Sarees</span>
              <ArrowRight className="w-3.5 h-3.5 transform group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
