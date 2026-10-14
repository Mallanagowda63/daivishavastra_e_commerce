import React from 'react';
import { ShieldCheck, Lock, Truck, RefreshCw } from 'lucide-react';

export const TrustFeatures: React.FC = () => {
  const features = [
    {
      icon: ShieldCheck,
      title: 'Silk Mark Authenticity',
      desc: '100% certified handloom Mulberry silk with tested real silver & gold zari.',
    },
    {
      icon: Lock,
      title: 'Secure Payments',
      desc: 'Bank-grade 256-bit SSL encrypted transactions supporting UPI, Cards & NetBanking.',
    },
    {
      icon: Truck,
      title: 'Fast Insured Shipping',
      desc: 'Complimentary insured door-to-door delivery across all PIN codes in India.',
    },
    {
      icon: RefreshCw,
      title: '7-Day Easy Returns',
      desc: 'Hassle-free doorstep exchanges and returns with full money-back guarantee.',
    },
  ];

  return (
    <section id="trust" className="py-16 bg-[#f7f2ea] border-t border-b border-sand">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feat) => {
            const Icon = feat.icon;
            return (
              <div key={feat.title} className="flex items-start gap-4 text-charcoal">
                <div className="w-12 h-12 shrink-0 border border-gold-600/40 bg-white flex items-center justify-center text-burgundy-950 shadow-sm">
                  <Icon className="w-5 h-5 text-gold-700" />
                </div>
                <div>
                  <h3 className="font-serif text-base font-bold text-burgundy-950">
                    {feat.title}
                  </h3>
                  <p className="text-xs text-stone-600 font-sans mt-1 leading-relaxed">
                    {feat.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
