import React from 'react';
import { Flower2, IndianRupee, Palette, Scroll, ShoppingBag, Sparkles, Zap } from 'lucide-react';
import { SareeProduct } from '../../types';
import { LotusMark } from '../layout/BrandEmblem';
import { ARCH_PATH, archMaskStyle } from '../common/TempleArch';
import { useCart } from '../../context/CartContext';

const PLUM = '#5a1028';
const GOLD_LINE = 'bg-[#c9a45c]';

const Ornament: React.FC<{ w?: string }> = ({ w = 'w-24 sm:w-36' }) => (
  <div className="flex items-center justify-center gap-2" aria-hidden="true">
    <span className={`h-px ${w} bg-gradient-to-r from-transparent to-[#b8924a]`} />
    <span className={`w-1.5 h-1.5 rotate-45 ${GOLD_LINE}`} />
    <span className="w-2.5 h-2.5 rotate-45 border border-[#b8924a]" />
    <span className={`w-1.5 h-1.5 rotate-45 ${GOLD_LINE}`} />
    <span className={`h-px ${w} bg-gradient-to-l from-transparent to-[#b8924a]`} />
  </div>
);

/** Corner flourish of the parchment frame. */
const Corner: React.FC<{ className: string }> = ({ className }) => (
  <svg viewBox="0 0 48 48" className={`absolute w-10 h-10 sm:w-14 sm:h-14 text-[#c9a45c] ${className}`} aria-hidden="true">
    <path d="M3 45V14C3 8 8 3 14 3h31" fill="none" stroke="currentColor" strokeWidth="1.4" />
    <path d="M9 45V19c0-6 4-10 10-10h26" fill="none" stroke="currentColor" strokeWidth="0.8" opacity="0.7" />
    <path d="M14 14c4-1 7 1 8 5-4 1-7-1-8-5zM14 14c1 4-1 7-5 8-1-4 1-7 5-8z" fill="currentColor" opacity="0.8" />
  </svg>
);

type Circle = { title: string; text: string; image?: string; zoom?: number; at?: string };

/** Circle cards: the saree's own highlights from admin, or close-ups made from its photo. */
const circlesFor = (p: SareeProduct): Circle[] => {
  const own = (p.highlights ?? []).filter((h) => h.title?.trim() || h.text?.trim());
  if (own.length) return own;
  const photo = p.images.find((src) => !/poster/i.test(src));
  const s = p.spec ?? {};
  const list: (Circle | false | undefined)[] = [
    !!(s.motifs || p.details?.work) && { title: 'Woven Motifs', text: s.motifs || p.details.work, image: photo, zoom: 2.4, at: '45% 40%' },
    !!(s.border || p.details?.border) && { title: 'Elegant Border', text: s.border || p.details.border, image: photo, zoom: 2.2, at: '60% 88%' },
    { title: 'Rich Fabric', text: `${s.fabric || p.fabric} with a soft sheen and graceful drape.`, image: photo, zoom: 2.8, at: '35% 25%' },
    !!(s.occasion || p.occasion?.length) && { title: 'Perfect For', text: s.occasion || p.occasion.join(', '), image: photo, zoom: 1.5, at: '50% 50%' },
  ];
  return photo ? (list.filter(Boolean) as Circle[]) : [];
};

/**
 * The saree page laid out like the Daivisha Vastra product posters: brand header, large title,
 * story, framed photo, "Details that make it special" circles and the fact row. Every part comes
 * from the saree's details in admin.
 */
export const PosterShowcase: React.FC<{ product: SareeProduct; onBuyNow: (p: SareeProduct, qty: number, color: string) => void }> = ({ product, onBuyNow }) => {
  const { addToCart } = useCart();
  const s = product.spec ?? {};
  const title = product.posterTitle?.trim() || product.name.replace(/\s+Saree$/i, '');
  const photo = product.images.find((src) => !/poster/i.test(src)) ?? product.images[0];
  const circles = circlesFor(product);
  const soldOut = product.stock <= 0;
  const facts = [
    { icon: Scroll, label: 'Fabric', value: s.fabric || product.details?.fabric || product.fabric },
    { icon: Palette, label: 'Colours', value: s.colours || product.color },
    { icon: Flower2, label: 'Motifs', value: s.motifs || product.details?.work },
    { icon: Sparkles, label: 'Border Material', value: s.border || product.details?.border },
    { icon: IndianRupee, label: 'Price', value: product.sellingPrice > 0 ? `₹${product.sellingPrice.toLocaleString('en-IN')} + Shipping` : '' },
  ].filter((f) => f.value && String(f.value).trim());

  return (
    <article className="relative overflow-hidden bg-[radial-gradient(ellipse_at_20%_0%,#fdf8ee_0%,#f8eedd_45%,#f1e2c8_100%)] border border-[#d9bf8c] shadow-[0_24px_60px_-30px_rgba(90,16,40,0.35)]">
      <div className="pointer-events-none absolute inset-2 sm:inset-3 border border-[#d9bf8c]/70" aria-hidden="true" />
      <Corner className="top-1 left-1" />
      <Corner className="top-1 right-1 rotate-90" />
      <Corner className="bottom-1 right-1 rotate-180" />
      <Corner className="bottom-1 left-1 -rotate-90" />

      {/* ── Hero: brand, title, story · framed photo ── */}
      <div className="relative grid lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)] gap-8 lg:gap-10 2xl:gap-16 px-5 sm:px-12 2xl:px-24 pt-10 sm:pt-14 pb-10">
        <div className="text-center flex flex-col items-center justify-center">
          <LotusMark className="w-12 h-12 text-[#a07a35]" />
          <p className="mt-2 text-xl sm:text-2xl tracking-[0.18em] text-[#5b4a3a]" style={{ fontFamily: "'Cinzel', serif" }}>DAIVISHA VASTRA</p>
          <div className="mt-2 w-full max-w-sm"><Ornament w="w-20 sm:w-28" /></div>
          <p className="mt-2 font-sans text-[10px] sm:text-[11px] tracking-[0.3em] uppercase text-[#6d5a46]">Elegance rooted in Indian heritage.</p>

          <h1 className="mt-6 text-[2.4rem] sm:text-6xl 2xl:text-7xl leading-[1.02] font-semibold text-balance" style={{ fontFamily: "'Cinzel', serif", color: PLUM }}>
            {title}
          </h1>
          <div className="mt-4 w-full max-w-md"><Ornament /></div>
          <p className="mt-5 font-serif text-lg sm:text-xl 2xl:text-2xl leading-relaxed text-[#3d2a24] max-w-md 2xl:max-w-xl">{product.description}</p>

          <div className="mt-7 flex flex-col items-center gap-3">
            {product.sellingPrice > 0 && (
              <p className="font-serif text-2xl text-[#3d2a24]">
                <span className="font-semibold" style={{ color: PLUM }}>₹{product.sellingPrice.toLocaleString('en-IN')}</span>
                <span className="text-base text-stone-600"> + shipping</span>
              </p>
            )}
            <div className="flex flex-wrap justify-center gap-2.5">
              <button
                onClick={() => addToCart(product, 1, product.color)}
                disabled={soldOut}
                className="inline-flex items-center gap-2 px-6 py-3 bg-[#4c1012] hover:bg-[#6b1a2b] text-[#f3dfae] font-sans text-xs font-semibold tracking-[0.15em] uppercase cursor-pointer disabled:opacity-50"
              >
                <ShoppingBag className="w-4 h-4" /> {soldOut ? 'Sold out' : 'Add to bag'}
              </button>
              {!soldOut && (
                <button
                  onClick={() => onBuyNow(product, 1, product.color)}
                  className="inline-flex items-center gap-2 px-6 py-3 border border-[#4c1012] text-[#4c1012] hover:bg-[#4c1012] hover:text-[#f3dfae] font-sans text-xs font-semibold tracking-[0.15em] uppercase cursor-pointer"
                >
                  <Zap className="w-4 h-4" /> Buy now
                </button>
              )}
            </div>
          </div>
        </div>

        {photo && (
          <div className="relative w-full max-w-xl mx-auto lg:max-w-none aspect-[4/5] 2xl:aspect-[5/5] drop-shadow-xl">
            <div className="absolute inset-0 bg-[#fffaf3] p-1.5" style={archMaskStyle}>
              <img src={photo} alt={product.name} className="w-full h-full object-cover" style={archMaskStyle} />
            </div>
            <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 w-full h-full pointer-events-none" aria-hidden="true">
              <path d={ARCH_PATH} fill="none" stroke="#b8924a" strokeWidth="3" vectorEffect="non-scaling-stroke" />
            </svg>
          </div>
        )}
      </div>

      {/* ── Details that make it special ── */}
      {circles.length > 0 && (
        <section className="relative border-t border-[#d9bf8c]/80 bg-[#fbf3e4]/70 px-4 sm:px-12 2xl:px-24 pt-9 pb-10">
          <h2 className="text-center font-serif text-sm sm:text-lg uppercase tracking-[0.32em] text-[#4a3a2c]">Details that make it special</h2>
          <div className="mt-2 mb-9"><Ornament /></div>
          <ul className={`grid grid-cols-2 gap-y-10 ${circles.length >= 5 ? 'lg:grid-cols-5' : circles.length === 3 ? 'lg:grid-cols-3' : 'lg:grid-cols-4'}`}>
            {circles.map((c, i) => (
              <li key={c.title + i} className={`flex flex-col items-center text-center px-3 ${i > 0 ? 'lg:border-l lg:border-[#d9bf8c]/70' : ''}`}>
                <div className="w-32 h-32 sm:w-44 sm:h-44 2xl:w-52 2xl:h-52 rounded-full overflow-hidden border-[3px] border-[#c9a45c] shadow-[0_0_0_5px_#fbf3e4,0_0_0_6px_rgba(201,164,92,0.55)] bg-[#f4ece0]">
                  {c.image && (
                    <img
                      src={c.image}
                      alt=""
                      loading="lazy"
                      className="w-full h-full object-cover"
                      style={c.zoom ? { transform: `scale(${c.zoom})`, transformOrigin: c.at, objectPosition: c.at } : undefined}
                    />
                  )}
                </div>
                <h3 className="mt-5 font-serif text-sm sm:text-[17px] font-semibold uppercase tracking-[0.1em] leading-tight" style={{ color: PLUM }}>{c.title}</h3>
                <p className="mt-2 font-serif text-[15px] sm:text-[17px] leading-snug text-[#3d2a24] max-w-[16rem]">{c.text}</p>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* ── Fact row ── */}
      {facts.length > 0 && (
        <dl className="relative border-t border-[#d9bf8c]/80 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-y-7 px-4 sm:px-12 2xl:px-24 py-9">
          {facts.map(({ icon: Icon, label, value }, i) => (
            <div key={label} className={`flex flex-col items-center text-center px-3 ${i > 0 ? 'lg:border-l lg:border-[#d9bf8c]/70' : ''}`}>
              <Icon className="w-9 h-9 text-[#a07a35]" strokeWidth={1.1} />
              <dt className="mt-2 font-sans text-[10px] sm:text-[11px] tracking-[0.22em] uppercase text-[#6d5a46]">{label}</dt>
              <dd className="mt-1 font-serif text-lg sm:text-xl leading-snug text-[#3d2a24]">{value}</dd>
            </div>
          ))}
        </dl>
      )}
    </article>
  );
};
