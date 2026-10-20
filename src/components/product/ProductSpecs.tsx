import React from 'react';
import { Flower2, Gem, IndianRupee, Palette, Scroll } from 'lucide-react';
import { SareeProduct } from '../../types';

/** A gold-ringed circular close-up, cropped from a saree photo (like the detail circles on the posters). */
const Closeup: React.FC<{ src: string; zoom: number; at: string }> = ({ src, zoom, at }) => (
  <div className="w-28 h-28 sm:w-36 sm:h-36 rounded-full overflow-hidden border-[3px] border-[#c9a45c] shadow-[0_0_0_4px_#fbf3e6,0_0_0_5px_rgba(201,164,92,0.5)] bg-[#f4ece0]">
    <img src={src} alt="" loading="lazy" className="w-full h-full object-cover" style={{ transform: `scale(${zoom})`, transformOrigin: at, objectPosition: at }} />
  </div>
);

const Ornament: React.FC = () => (
  <div className="flex items-center justify-center gap-2 text-gold-600" aria-hidden="true">
    <span className="h-px w-20 sm:w-32 bg-gradient-to-r from-transparent to-gold-500" />
    <span className="w-1.5 h-1.5 rotate-45 bg-gold-500" />
    <span className="h-px w-20 sm:w-32 bg-gradient-to-l from-transparent to-gold-500" />
  </div>
);

/**
 * Poster-style "Details that make it special" panel on the saree page: close-up circles cropped from the
 * saree's own photos, then an icon row (Fabric · Colours · Motifs · Border · Price). Everything comes from
 * the saree's admin details, so editing the saree in admin updates this panel.
 */
export const ProductSpecs: React.FC<{ product: SareeProduct }> = ({ product }) => {
  const s = product.spec ?? {};
  const fabric = s.fabric || product.details?.fabric || product.fabric;
  const colours = s.colours || product.color;
  const motifs = s.motifs || product.details?.work;
  const border = s.border || product.details?.border;
  const price = product.sellingPrice > 0 ? `₹${product.sellingPrice.toLocaleString('en-IN')} + Shipping` : '';

  // Close-ups only from real photos; designed posters would be cropped mid-text.
  const photos = product.images.filter((src) => !/poster/i.test(src));
  const p0 = photos[0];
  const p1 = photos[1] ?? photos[0];
  const circles = p0
    ? [
        motifs && { title: 'Woven Motifs', text: motifs, src: p0, zoom: 2.4, at: '45% 40%' },
        border && { title: 'Elegant Border', text: border, src: p0, zoom: 2.2, at: '60% 88%' },
        fabric && { title: 'Rich Fabric', text: `${fabric} with a graceful drape`, src: p1, zoom: 2.8, at: '35% 25%' },
        colours && { title: 'Colours', text: colours, src: p1, zoom: 1.4, at: '50% 50%' },
      ].filter(Boolean) as { title: string; text: string; src: string; zoom: number; at: string }[]
    : [];

  const strip = [
    { icon: Scroll, label: 'Fabric', value: fabric },
    { icon: Palette, label: 'Colours', value: colours },
    { icon: Flower2, label: 'Motifs', value: motifs },
    { icon: Gem, label: 'Border', value: border },
    { icon: IndianRupee, label: 'Price', value: price },
  ].filter((r) => r.value && String(r.value).trim());

  if (!circles.length && !strip.length) return null;
  return (
    <section className="max-w-6xl mx-auto mt-14">
      <div className="relative bg-[radial-gradient(ellipse_at_top,#fdf7ec_0%,#f7ecdb_100%)] border border-[#d9bf8c] px-4 sm:px-10 py-10">
        <div className="pointer-events-none absolute inset-2 border border-[#d9bf8c]/60" aria-hidden="true" />

        <h2 className="relative text-center font-serif text-base sm:text-xl uppercase tracking-[0.3em] text-[#5a1028]">Details that make it special</h2>
        <div className="relative mt-3 mb-9"><Ornament /></div>

        {circles.length > 0 && (
          <ul className="relative grid grid-cols-2 lg:grid-cols-4 gap-y-9">
            {circles.map((c, i) => (
              <li key={c.title} className={`flex flex-col items-center text-center px-3 ${i > 0 ? 'lg:border-l lg:border-[#d9bf8c]/60' : ''}`}>
                <Closeup src={c.src} zoom={c.zoom} at={c.at} />
                <h3 className="mt-4 font-serif text-sm sm:text-base font-semibold uppercase tracking-[0.12em] text-[#5a1028]">{c.title}</h3>
                <p className="mt-1.5 font-serif text-[15px] sm:text-base leading-snug text-stone-700 max-w-[15rem]">{c.text}</p>
              </li>
            ))}
          </ul>
        )}

        {strip.length > 0 && (
          <dl className={`relative grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-y-6 ${circles.length ? 'mt-10 pt-8 border-t border-[#d9bf8c]/70' : ''}`}>
            {strip.map(({ icon: Icon, label, value }, i) => (
              <div key={label} className={`flex flex-col items-center text-center px-3 ${i > 0 ? 'lg:border-l lg:border-[#d9bf8c]/60' : ''}`}>
                <Icon className="w-8 h-8 text-[#a07a35]" strokeWidth={1.2} />
                <dt className="mt-2 font-sans text-[11px] font-semibold uppercase tracking-[0.2em] text-stone-500">{label}</dt>
                <dd className="mt-1 font-serif text-lg sm:text-xl leading-snug text-[#3d2a24]">{value}</dd>
              </div>
            ))}
          </dl>
        )}
      </div>
    </section>
  );
};
