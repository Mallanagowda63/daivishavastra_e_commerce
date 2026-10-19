import React from 'react';
import { ChevronRight, Facebook, Instagram, MapPin, MessageCircle, Phone, ShoppingBag } from 'lucide-react';
import { SectionHeading } from '../components/common/ContentBlocks';
import { openWhatsApp } from '../components/common/WhatsAppGate';
import {
  STORE_ADDRESS_LINES,
  STORE_FACEBOOK_URL,
  STORE_INSTAGRAM_HANDLE,
  STORE_INSTAGRAM_URL,
  STORE_LANDMARK,
  STORE_PHONE_DISPLAY,
  STORE_PHONE_TEL,
} from '../config/contact';

interface ContactViewProps {
  onNavigateHome: () => void;
}

const Row: React.FC<{ icon: React.ElementType; title: string; children: React.ReactNode }> = ({ icon: Icon, title, children }) => (
  <li className="flex gap-4">
    <span className="mt-0.5 w-10 h-10 rounded-full border border-gold-600/60 text-gold-700 grid place-items-center shrink-0">
      <Icon className="w-5 h-5" strokeWidth={1.5} />
    </span>
    <div>
      <h2 className="font-serif text-lg sm:text-xl font-semibold uppercase tracking-[0.04em] text-burgundy-800">{title}</h2>
      <div className="mt-0.5 font-serif text-[17px] sm:text-lg leading-relaxed text-stone-700">{children}</div>
    </div>
  </li>
);

const linkClass = 'text-burgundy-800 underline decoration-gold-500/60 underline-offset-4 hover:decoration-burgundy-800';

export const ContactView: React.FC<ContactViewProps> = ({ onNavigateHome }) => (
  <div className="bg-[#fbf6ee]">
    <section className="bg-gradient-to-r from-[#fbefdf] via-[#fbf1e3] to-[#f6e6cf] border-b border-gold-500/40">
      <div className="max-w-3xl mx-auto px-5 sm:px-8 py-10 sm:py-12">
        <nav aria-label="Breadcrumbs" className="flex items-center justify-center gap-2 text-xs text-stone-500 mb-5">
          <button onClick={onNavigateHome} className="hover:text-burgundy-900 cursor-pointer">
            Home
          </button>
          <ChevronRight className="w-3.5 h-3.5 text-stone-400" />
          <span className="text-charcoal font-medium">Contact Us</span>
        </nav>
        <SectionHeading as="h1" title="Contact Us" subtitle="We would love to help you find your drape" />
      </div>
    </section>

    <div className="max-w-3xl mx-auto px-5 sm:px-8 py-12 sm:py-14">
      <ul className="space-y-7">
        <Row icon={MessageCircle} title="WhatsApp">
          <button onClick={() => openWhatsApp()} className={`${linkClass} cursor-pointer`}>
            {STORE_PHONE_DISPLAY}
          </button>
        </Row>
        <Row icon={Phone} title="Call Us">
          <a href={`tel:${STORE_PHONE_TEL}`} className={linkClass}>
            {STORE_PHONE_DISPLAY}
          </a>
        </Row>
        <Row icon={Instagram} title="Instagram">
          <a href={STORE_INSTAGRAM_URL} target="_blank" rel="noreferrer" className={linkClass}>
            {STORE_INSTAGRAM_HANDLE}
          </a>
        </Row>
        <Row icon={Facebook} title="Facebook">
          <a href={STORE_FACEBOOK_URL} target="_blank" rel="noreferrer" className={linkClass}>
            Daivisha Vastra on Facebook
          </a>
        </Row>
        <Row icon={MapPin} title="Visit Us">
          {STORE_ADDRESS_LINES.join(', ')}
          <span className="block text-stone-500 text-base">Landmark: {STORE_LANDMARK}</span>
        </Row>
        <Row icon={ShoppingBag} title="Orders & Enquiries">
          Message us with the saree name or product image. We will confirm availability, price, shipping and payment details before you
          place your order.
        </Row>
      </ul>

      <div className="mt-12 bg-[#f6ead7] border border-gold-500/50 rounded-xl px-6 py-7 text-center">
        <p className="font-serif text-2xl font-semibold uppercase tracking-[0.06em] text-burgundy-800">Daivisha Vastra</p>
        <p className="mt-1 font-serif italic text-lg text-gold-700">Every saree has a story.</p>
      </div>
    </div>
  </div>
);
