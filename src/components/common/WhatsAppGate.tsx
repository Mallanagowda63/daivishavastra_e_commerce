import React, { useEffect, useState } from 'react';
import { MessageCircle, X } from 'lucide-react';
import { WHATSAPP_NUMBER } from '../../config/contact';

const STORAGE_KEY = 'daivisha_whatsapp_number';
const OPEN_EVENT = 'daivisha:open-whatsapp';

const savedNumber = () => {
  try {
    return localStorage.getItem(STORAGE_KEY) ?? '';
  } catch {
    return '';
  }
};

const chatUrl = (number: string, message: string) => `https://wa.me/${number}?text=${encodeURIComponent(message)}`;

/** Opens a WhatsApp chat, or asks for the store number when none is configured yet. */
export const openWhatsApp = (message = 'Hi Daivisha Vastra, I need help with a saree.') => {
  const number = WHATSAPP_NUMBER || savedNumber();
  if (number) {
    window.open(chatUrl(number, message), '_blank', 'noopener,noreferrer');
  } else {
    window.dispatchEvent(new CustomEvent(OPEN_EVENT, { detail: message }));
  }
};

/** Mounted once in the app; shows the "connect WhatsApp" dialog when needed. */
export const WhatsAppGate: React.FC = () => {
  const [message, setMessage] = useState<string | null>(null);
  const [number, setNumber] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const onOpen = (e: Event) => {
      setMessage((e as CustomEvent<string>).detail);
      setNumber('');
      setError('');
    };
    window.addEventListener(OPEN_EVENT, onOpen);
    return () => window.removeEventListener(OPEN_EVENT, onOpen);
  }, []);

  if (message === null) return null;

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    let digits = number.replace(/\D/g, '');
    if (digits.length === 10) digits = `91${digits}`; // assume an Indian mobile number
    if (digits.length < 11 || digits.length > 15) {
      setError('Enter a valid WhatsApp number with country code, e.g. +91 98765 43210.');
      return;
    }
    try {
      localStorage.setItem(STORAGE_KEY, digits);
    } catch {
      // ignore
    }
    window.open(chatUrl(digits, message), '_blank', 'noopener,noreferrer');
    setMessage(null);
  };

  return (
    <div role="dialog" aria-modal="true" aria-labelledby="wa-gate-title" className="fixed inset-0 z-[70] flex items-center justify-center p-4">
      <button className="absolute inset-0 bg-black/50" onClick={() => setMessage(null)} aria-label="Close" />
      <form onSubmit={submit} className="relative w-full max-w-sm bg-[#faf6ef] border border-gold-500/40 shadow-2xl p-6">
        <button type="button" onClick={() => setMessage(null)} className="absolute right-3 top-3 p-1 text-stone-500 hover:text-charcoal cursor-pointer" aria-label="Close">
          <X className="w-5 h-5" />
        </button>
        <span className="inline-flex w-11 h-11 items-center justify-center rounded-full bg-[#25D366]/15 text-[#128C7E]">
          <MessageCircle className="w-5 h-5" />
        </span>
        <h2 id="wa-gate-title" className="mt-4 font-serif text-2xl text-burgundy-900">
          Connect WhatsApp
        </h2>
        <p className="mt-1.5 text-sm text-stone-600 leading-relaxed">
          The store's WhatsApp Business number isn't set up yet. Enter the WhatsApp number to chat with.
        </p>
        <label htmlFor="wa-number" className="block mt-5 text-xs font-semibold text-charcoal">
          WhatsApp number
        </label>
        <input
          id="wa-number"
          type="tel"
          inputMode="tel"
          autoFocus
          value={number}
          onChange={(e) => {
            setNumber(e.target.value);
            setError('');
          }}
          placeholder="+91 98765 43210"
          className="mt-1.5 w-full border border-sand bg-white px-3 py-2.5 text-sm focus:outline-none focus:border-burgundy-800"
        />
        {error && <p className="mt-2 text-xs text-rose-700">{error}</p>}
        <button type="submit" className="mt-5 w-full inline-flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#1ebe5b] text-white py-3 text-sm font-semibold cursor-pointer">
          <MessageCircle className="w-4 h-4" /> Save &amp; open WhatsApp
        </button>
        <p className="mt-3 text-[11px] text-stone-500">Saved in this browser, so you won't be asked again here.</p>
      </form>
    </div>
  );
};
