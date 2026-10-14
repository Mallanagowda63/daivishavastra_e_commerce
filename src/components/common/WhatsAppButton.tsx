import React from 'react';
import { MessageCircle } from 'lucide-react';
import { SareeProduct } from '../../types';
import { openWhatsApp } from './WhatsAppGate';

interface WhatsAppButtonProps {
  product?: SareeProduct;
  variant?: 'floating' | 'inline';
}

export const WhatsAppButton: React.FC<WhatsAppButtonProps> = ({
  product,
  variant = 'floating',
}) => {
  const handleClick = () => {
    const message = product
      ? `Hi Daivisha Vastra, I am inquiring about the "${product.name}" (SKU: ${product.sku}, ₹${product.sellingPrice.toLocaleString('en-IN')}). Could you please share more details or drape videos?`
      : 'Hi Daivisha Vastra, I need help with a saree.';
    openWhatsApp(message);
  };

  if (variant === 'inline') {
    return (
      <button
        type="button"
        onClick={handleClick}
        className="cursor-pointer inline-flex items-center justify-center gap-2.5 w-full py-3.5 px-6 border border-emerald-800/40 text-emerald-900 bg-emerald-50/60 hover:bg-emerald-100/80 transition-all font-medium text-xs tracking-wider uppercase hover:border-emerald-700"
      >
        <MessageCircle className="w-4 h-4 text-emerald-700 shrink-0" />
        <span>Ask about this saree on WhatsApp</span>
      </button>
    );
  }

  return (
    <aside
      aria-label="WhatsApp Concierge"
      className="fixed bottom-24 md:bottom-8 right-5 z-40"
    >
      <button
        type="button"
        onClick={handleClick}
        className="cursor-pointer group flex items-center gap-2.5 px-4 py-3 bg-[#25D366] text-white rounded-full shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300"
        title="Chat with our Saree Stylist on WhatsApp"
        aria-label="Chat with Daivisha Vastra stylist on WhatsApp"
      >
        <MessageCircle className="w-5 h-5 fill-white text-emerald-600" />
        <span className="hidden sm:inline text-xs font-semibold tracking-wide uppercase">
          Stylist Help
        </span>
      </button>
    </aside>
  );
};
