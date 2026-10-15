import React from 'react';
import { Truck, ShieldCheck, Heart, Tag } from 'lucide-react';
import { couponLabel, isUsable, useCoupons } from '../../data/couponStore';
import { LotusMark } from './BrandEmblem';

const badges = [
  { icon: Truck, label: 'Pan India Shipping' },
  { icon: ShieldCheck, label: 'Secure Enquiries' },
  { icon: Heart, label: 'Authentic Collections' },
];

export const AnnouncementBar: React.FC = () => {
  const featured = useCoupons().find((c) => c.featured && isUsable(c));

  return (
    <div className="bg-[#4c1012] text-ivory border-b border-gold-500/30">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 min-[1400px]:px-24 py-2 sm:py-2.5 flex items-center justify-center md:justify-between gap-4">
        <div className={`${featured ? "hidden sm:flex" : "flex"} items-center gap-2.5 font-serif text-sm md:text-base tracking-wide`}>
          <LotusMark className="w-5 h-5 text-gold-400 shrink-0" />
          <span>Elegant attire rooted in Indian heritage.</span>
        </div>

        {/* Featured coupon, chosen in the admin Coupons page */}
        {featured && (
          <p className="flex items-center gap-2 font-serif text-[13px] sm:text-sm tracking-wide whitespace-nowrap">
            <Tag className="w-4 h-4 text-gold-400 shrink-0" />
            <span>Use code</span>
            <span className="rounded border border-dashed border-gold-400 bg-gold-400/10 px-2 py-0.5 font-sans text-xs font-bold tracking-widest text-gold-300">
              {featured.code}
            </span>
            <span>
              {couponLabel(featured).toLowerCase()}
              {featured.minimumOrder > 0 && <span className="hidden min-[400px]:inline"> above ₹{featured.minimumOrder.toLocaleString('en-IN')}</span>}
            </span>
          </p>
        )}

        <ul className={`hidden ${featured ? 'xl:flex' : 'md:flex'} items-center gap-8 font-serif text-sm tracking-wide`}>
          {badges.map(({ icon: Icon, label }) => (
            <li key={label} className="flex items-center gap-2">
              <Icon className="w-4 h-4 text-gold-400" />
              <span>{label}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};
