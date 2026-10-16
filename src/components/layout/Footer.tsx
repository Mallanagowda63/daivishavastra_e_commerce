import React from 'react';
import { openWhatsApp } from '../common/WhatsAppGate';
import { Instagram, MapPin, Phone, Lock } from 'lucide-react';
import { STORE_ADDRESS_LINES, STORE_INSTAGRAM_HANDLE, STORE_INSTAGRAM_URL, STORE_LANDMARK, STORE_PHONE_DISPLAY, STORE_PHONE_TEL } from '../../config/contact';
import { PolicyId } from '../../data/policies';

const POLICY_LINKS: { id: PolicyId; label: string }[] = [
  { id: 'privacy', label: 'Privacy Policy' },
  { id: 'terms', label: 'Terms & Conditions' },
  { id: 'refund', label: 'Refund Policy' },
];

interface FooterProps {
  onNavigate: (view: 'home' | 'shop' | 'wishlist' | 'about' | PolicyId, category?: string, collection?: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className="bg-burgundy-950 text-ivory border-t border-gold-500/30 pt-16 pb-24 lg:pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 lg:gap-12 pb-12 border-b border-white/10">
          {/* Brand Intro Column */}
          <div className="col-span-2 md:col-span-1">
            <span className="font-serif text-2xl font-bold tracking-tight text-gold-300 block mb-3">
              Daivisha Vastra
            </span>
            <p className="font-serif text-sm italic text-stone-300 mb-4">Elegant attire rooted in Indian heritage.</p>
            <div className="flex items-center gap-3 text-gold-400">
              <a
                href={STORE_INSTAGRAM_URL}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 h-8 pl-2 pr-3 rounded-full border border-gold-500/30 hover:bg-gold-500 hover:text-burgundy-950 transition-colors text-xs"
                aria-label="Follow Daivisha Vastra on Instagram"
              >
                <Instagram className="w-4 h-4" />
                {STORE_INSTAGRAM_HANDLE}
              </a>
            </div>

            {/* Visit / contact */}
            <address className="not-italic mt-5 space-y-2 text-xs text-stone-300 leading-relaxed">
              <p className="flex gap-2">
                <MapPin className="w-4 h-4 text-gold-400 shrink-0 mt-0.5" />
                <span>
                  {STORE_ADDRESS_LINES.map((l) => (
                    <span key={l} className="block">{l}</span>
                  ))}
                  <span className="block text-stone-400">Landmark: {STORE_LANDMARK}</span>
                </span>
              </p>
              <p className="flex gap-2 items-center">
                <Phone className="w-4 h-4 text-gold-400 shrink-0" />
                <a href={`tel:${STORE_PHONE_TEL}`} className="hover:text-gold-300">{STORE_PHONE_DISPLAY}</a>
                <span className="text-stone-500">·</span>
                <button type="button" onClick={() => openWhatsApp()} className="hover:text-gold-300 cursor-pointer">WhatsApp</button>
              </p>
            </address>
          </div>

          {/* SHOP Column */}
          <div>
            <h4 className="font-serif text-sm tracking-widest uppercase text-gold-400 font-semibold mb-4">
              Shop
            </h4>
            <ul className="space-y-2.5 text-xs text-stone-300 font-sans">
              <li>
                <button
                  onClick={() => onNavigate('shop', 'New Arrivals')}
                  className="hover:text-gold-300 transition-colors"
                >
                  New Arrivals
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('shop', 'Best Sellers')}
                  className="hover:text-gold-300 transition-colors"
                >
                  Best Sellers
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('shop', 'Pure Gajji Silk Sarees')}
                  className="hover:text-gold-300 transition-colors"
                >
                  Pure Gajji Silk Sarees
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('shop', 'Soft Silk Paithani Sarees')}
                  className="hover:text-gold-300 transition-colors"
                >
                  Soft Silk Paithani Sarees
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('shop', undefined, 'Wedding Collection')}
                  className="hover:text-gold-300 transition-colors"
                >
                  Wedding Collection
                </button>
              </li>
            </ul>
          </div>

          {/* ABOUT Column */}
          <div>
            <h4 className="font-serif text-sm tracking-widest uppercase text-gold-400 font-semibold mb-4">
              About
            </h4>
            <ul className="space-y-2.5 text-xs text-stone-300 font-sans">
              <li>
                <button
                  onClick={() => onNavigate('about')}
                  className="hover:text-gold-300 transition-colors"
                >
                  Our Story
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('about')}
                  className="hover:text-gold-300 transition-colors"
                >
                  Artisanal Craftsmanship
                </button>
              </li>
              <li>
                <button type="button" onClick={() => openWhatsApp()} className="hover:text-gold-300 transition-colors cursor-pointer">
                  Contact Us
                </button>
              </li>
            </ul>
          </div>

          {/* HELP Column */}
          <div>
            <h4 className="font-serif text-sm tracking-widest uppercase text-gold-400 font-semibold mb-4">
              Help
            </h4>
            <ul className="space-y-2.5 text-xs text-stone-300 font-sans">
              <li>
                <span className="block text-stone-400">Pan India Shipping</span>
              </li>
              <li>
                <span className="block text-stone-400">48-Hour Returns &amp; Exchange</span>
              </li>
              <li>
                <span className="block text-stone-400">Saree Care & Storage</span>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => openWhatsApp()}
                  className="hover:text-gold-300 transition-colors cursor-pointer"
                >
                  WhatsApp Concierge
                </button>
              </li>
            </ul>
          </div>

          {/* LEGAL & NEWSLETTER */}
          <div>
            <h4 className="font-serif text-sm tracking-widest uppercase text-gold-400 font-semibold mb-4">
              Policies
            </h4>
            <ul className="space-y-2 text-xs">
              {POLICY_LINKS.map((l) => (
                <li key={l.id}>
                  <button onClick={() => onNavigate(l.id)} className="text-stone-300 hover:text-gold-300 transition-colors cursor-pointer">
                    {l.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar with payment badges and copyright */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-stone-400">
          <div className="flex flex-col items-center md:items-start gap-2">
            <p>© {new Date().getFullYear()} Daivisha Vastra Couturier. All Rights Reserved.</p>
            <nav aria-label="Legal" className="flex flex-wrap justify-center gap-x-2 gap-y-1 text-[11px]">
              {POLICY_LINKS.map((l, i) => (
                <React.Fragment key={l.id}>
                  {i > 0 && <span className="text-stone-500" aria-hidden="true">·</span>}
                  <button onClick={() => onNavigate(l.id)} className="underline-offset-2 hover:underline hover:text-gold-300 cursor-pointer">
                    {l.label}
                  </button>
                </React.Fragment>
              ))}
            </nav>
          </div>
          
          <div className="flex items-center flex-wrap gap-4 text-[11px]">
            <span className="flex items-center gap-1.5 text-stone-300">
              <Lock className="w-3.5 h-3.5 text-gold-400" /> 256-Bit SSL Encryption
            </span>
            <span className="text-stone-500">·</span>
            <span>UPI payments (GPay · PhonePe · Paytm)</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
