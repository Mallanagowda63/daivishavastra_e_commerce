import React from 'react';
import { Flower2, IndianRupee, Palette, Scroll, ShoppingBag, Sparkles, Zap } from 'lucide-react';
import { SareeProduct } from '../../types';
import { LotusMark } from '../layout/BrandEmblem';
import { findSareeType } from '../../data/sareeTypes';
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

/** Heritage art behind the legacy story: the Rajasthan scene for Gajji, a palace sketch for other weaves. */
const defaultArt = (category: string) => (/gajji/i.test(category) ? '/images/poster-bg/rajasthan.jpg' : '/images/collection_palace_sketch.jpg');

const defaultLegacy = (category: string) =>
  /gajji/i.test(category)
    ? 'Rooted in the vibrant weaving traditions of Gujarat and Rajasthan, Gajji silk has long been cherished in royal and festive attire. Its lustrous finish, luxurious feel and graceful drape make it a timeless choice for celebrations.'
    : findSareeType(category)?.origin ?? 'Woven with care and rooted in the rich textile traditions of India, this saree brings timeless grace to every celebration.';

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
  const heroImage = product.posterImage || photo;
  const cutout = /cutout|\.(png|webp)$/i.test(heroImage ?? '');
  const art = product.posterArt || defaultArt(product.category);
  const legacy = {
    title: product.legacy?.title?.trim() || 'A Fabric with a Rich Legacy',
    text: product.legacy?.text?.trim() || defaultLegacy(product.category),
  };
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

      {/* ── Hero, laid out like the posters: brand + title + story + legacy over heritage art · the saree ── */}
      <div className="relative grid lg:grid-cols-[minmax(0,9fr)_minmax(0,11fr)]">
        {/* Left column */}
        <div className="relative flex flex-col">
          <div className="relative z-10 text-center px-5 sm:px-10 2xl:px-16 pt-10 sm:pt-14">
            <LotusMark className="mx-auto w-11 h-11 text-[#a07a35]" />
            <p className="mt-1 text-xl sm:text-2xl tracking-[0.18em] text-[#7a5a2e]" style={{ fontFamily: "'Cinzel', serif" }}>DAIVISHA VASTRA</p>
            <div className="mt-2"><Ornament w="w-24 sm:w-40" /></div>
            <p className="mt-2 font-sans text-[10px] sm:text-[11px] tracking-[0.3em] uppercase text-[#7a6650]">Elegance rooted in Indian heritage.</p>
            <h1 className="mt-7 text-[2.6rem] sm:text-[4.2rem] 2xl:text-[5rem] leading-[1] font-medium text-balance" style={{ fontFamily: "'Cinzel', serif", color: '#3d1438' }}>
              {title}
            </h1>
            <div className="mt-4"><Ornament w="w-20 sm:w-32" /></div>
            <p className="mt-5 mx-auto font-serif text-lg sm:text-[1.35rem] 2xl:text-2xl leading-snug text-[#2f2420] max-w-lg">{product.description}</p>
          </div>

          {/* Heritage art with the legacy story on it */}
          <div className="relative mt-4 flex-1 min-h-[360px] sm:min-h-[480px]">
            <img
              src={art}
              alt=""
              className="absolute left-0 bottom-0 h-full w-auto max-w-[110%] object-cover object-left"
              style={{
                WebkitMaskImage: 'linear-gradient(to bottom, transparent, black 12%, black 94%, transparent), linear-gradient(to right, black 78%, transparent)',
                maskImage: 'linear-gradient(to bottom, transparent, black 12%, black 94%, transparent), linear-gradient(to right, black 78%, transparent)',
                WebkitMaskComposite: 'source-in',
                maskComposite: 'intersect',
              }}
            />
            <div className="relative z-10 ml-auto w-full sm:w-[56%] px-6 sm:pl-0 sm:pr-8 pt-24 pb-10 sm:pt-36 sm:pb-16 text-left">
              <div className="absolute -inset-x-6 inset-y-16 -z-10 bg-[radial-gradient(ellipse_at_center,rgba(251,243,228,0.7)_0%,rgba(251,243,228,0.35)_60%,transparent_80%)]" aria-hidden="true" />
              <h2 className="text-lg sm:text-[1.35rem] tracking-[0.16em] uppercase leading-snug text-[#3d2a24]" style={{ fontFamily: "'Cinzel', serif" }}>
                {legacy.title}
              </h2>
              <div className="mt-2 flex items-center gap-2 text-[#b8924a]" aria-hidden="true">
                <span className="h-px w-14 bg-[#b8924a]" />
                <span className="w-1.5 h-1.5 rotate-45 bg-[#b8924a]" />
                <span className="h-px w-14 bg-[#b8924a]" />
              </div>
              <p className="mt-3 font-serif text-[15px] sm:text-[1.05rem] leading-snug text-[#2f2420] max-w-sm">{legacy.text}</p>
            </div>
          </div>
        </div>

        {/* Right column: the saree, large and angled, on a warm glow */}
        <div className="relative min-h-[420px] sm:min-h-[620px] flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_60%_45%,rgba(214,176,108,0.45)_0%,rgba(214,176,108,0.15)_45%,transparent_72%)]" aria-hidden="true" />
          <div className="absolute right-[-10%] top-[12%] w-[74%] aspect-square rounded-full shadow-[inset_0_0_40px_rgba(90,60,20,0.45),0_20px_50px_-15px_rgba(60,35,10,0.45)] bg-[radial-gradient(circle,#e8cf92_0%,#caa25c_38%,#a57b35_62%,#d9b878_70%,#8a6428_78%,#c49a52_86%,#6f4e1f_100%)]" aria-hidden="true">
            <div className="absolute inset-[9%] rounded-full opacity-[0.12] bg-[repeating-conic-gradient(from_0deg,#7a5522_0deg_3deg,transparent_3deg_12deg)]" />
            <div className="absolute inset-[24%] rounded-full bg-[radial-gradient(circle,#f0dcaa_0%,#d4b06c_70%,#b38a44_100%)] opacity-80" />
          </div>
          <div className="absolute left-[-6%] bottom-[-6%] w-[70%] h-[45%] rounded-[50%] bg-[radial-gradient(ellipse_at_center,rgba(233,207,146,0.65)_0%,rgba(233,207,146,0.25)_55%,transparent_75%)] blur-sm" aria-hidden="true" />
          {heroImage && (
            <img
              src={heroImage}
              alt={product.name}
              className={
                cutout
                  ? 'relative z-10 w-[88%] max-h-[860px] object-contain -rotate-[4deg] drop-shadow-[0_30px_35px_rgba(40,20,10,0.35)]'
                  : 'relative z-10 w-[90%] max-h-[860px] object-cover rounded-[28px] shadow-[0_30px_60px_-20px_rgba(40,20,10,0.45)]'
              }
            />
          )}
        </div>
      </div>

      {/* Price and ordering, under the hero */}
      <div className="relative flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8 border-t border-[#d9bf8c]/80 bg-[#fbf3e4]/80 px-5 py-6">
        {product.sellingPrice > 0 && (
          <p className="font-serif text-2xl sm:text-3xl text-[#3d2a24]">
            <span className="font-semibold" style={{ color: PLUM }}>₹{product.sellingPrice.toLocaleString('en-IN')}</span>
            <span className="text-base sm:text-lg text-stone-600"> + Shipping</span>
          </p>
        )}
        <div className="flex flex-wrap justify-center gap-2.5">
          <button
            onClick={() => addToCart(product, 1, product.color)}
            disabled={soldOut}
            className="inline-flex items-center gap-2 px-7 py-3.5 bg-[#4c1012] hover:bg-[#6b1a2b] text-[#f3dfae] font-sans text-xs font-semibold tracking-[0.15em] uppercase cursor-pointer disabled:opacity-50"
          >
            <ShoppingBag className="w-4 h-4" /> {soldOut ? 'Sold out' : 'Add to bag'}
          </button>
          {!soldOut && (
            <button
              onClick={() => onBuyNow(product, 1, product.color)}
              className="inline-flex items-center gap-2 px-7 py-3.5 border border-[#4c1012] text-[#4c1012] hover:bg-[#4c1012] hover:text-[#f3dfae] font-sans text-xs font-semibold tracking-[0.15em] uppercase cursor-pointer"
            >
              <Zap className="w-4 h-4" /> Buy now
            </button>
          )}
        </div>
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
