import React from 'react';
import { openWhatsApp } from '../common/WhatsAppGate';
import { Instagram, Facebook, Youtube, ShieldCheck, CreditCard, Lock, Sparkles } from 'lucide-react';
import { PolicyId } from '../../data/policies';

const POLICY_LINKS: { id: PolicyId; label: string }[] = [
  { id: 'privacy', label: 'Privacy Policy' },
  { id: 'terms', label: 'Terms & Conditions' },
  { id: 'refund', label: 'Refund Policy' },
];

interface FooterProps {
  onNavigate: (view: 'home' | 'shop' | 'wishlist' | 'about' | 'track' | PolicyId, category?: string, collection?: string) => void;
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
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-full border border-gold-500/30 flex items-center justify-center hover:bg-gold-500 hover:text-burgundy-950 transition-colors"
                aria-label="Follow Daivisha Vastra on Instagram"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-full border border-gold-500/30 flex items-center justify-center hover:bg-gold-500 hover:text-burgundy-950 transition-colors"
                aria-label="Follow Daivisha Vastra on Facebook"
              >
                <Facebook className="w-4 h-4" />
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-full border border-gold-500/30 flex items-center justify-center hover:bg-gold-500 hover:text-burgundy-950 transition-colors"
                aria-label="Watch Daivisha Vastra on YouTube"
              >
                <Youtube className="w-4 h-4" />
              </a>
            </div>
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
                  onClick={() => onNavigate('shop', 'Silk Sarees')}
                  className="hover:text-gold-300 transition-colors"
                >
                  Silk Sarees
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('shop', 'Designer Sarees')}
                  className="hover:text-gold-300 transition-colors"
                >
                  Designer Sarees
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
                <a
                  href="mailto:concierge@daivishavastra.com"
                  className="hover:text-gold-300 transition-colors"
                >
                  Contact Us
                </a>
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
                <button
                  onClick={() => onNavigate('track')}
                  className="hover:text-gold-300 transition-colors"
                >
                  Track Order
                </button>
              </li>
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
            <span>UPI (GPay / PhonePe)</span>
            <span className="text-stone-500">·</span>
            <span>Visa / Mastercard / RuPay</span>
            <span className="text-stone-500">·</span>
            <span>Net Banking</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
