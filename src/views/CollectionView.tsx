import React from 'react';
import { ArrowRight, ChevronRight, MessageCircle } from 'lucide-react';
import { LotusMark } from '../components/layout/BrandEmblem';
import { openWhatsApp } from '../components/common/WhatsAppGate';
import { collectionImage, findCollection } from '../data/collections';
import { useBanners } from '../data/bannerStore';
import { SareeCategory, SareeProduct } from '../types';

interface CollectionViewProps {
  collectionKey: SareeCategory;
  products: SareeProduct[];
  onSelectProduct: (product: SareeProduct) => void;
  onNavigateHome: () => void;
  onNavigateCollections: () => void;
}

const Divider: React.FC<{ className?: string }> = ({ className = '' }) => (
  <div className={`flex items-center gap-2 text-gold-600 ${className}`} aria-hidden="true">
    <span className="h-px w-16 sm:w-20 bg-gradient-to-r from-transparent to-gold-500" />
    <LotusMark className="w-5 h-5" />
    <span className="h-px w-16 sm:w-20 bg-gradient-to-l from-transparent to-gold-500" />
  </div>
);

const formatPrice = (n: number) => `₹${n.toLocaleString('en-IN')}`;

export const CollectionView: React.FC<CollectionViewProps> = ({
  collectionKey,
  products,
  onSelectProduct,
  onNavigateHome,
  onNavigateCollections,
}) => {
  const info = findCollection(collectionKey);
  const banners = useBanners();
  const items = products.filter((p) => p.category === collectionKey);
  if (!info) return null;

  return (
    <div className="bg-[#fbf4e9]">
      {/* ── Intro ── */}
      <section className="relative overflow-hidden bg-gradient-to-r from-[#fbf1e3] via-[#fbefdf] to-[#f3e1c6] border-b border-gold-500/40">
        <div className="relative grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_minmax(0,46%)]">
          <div className="px-5 sm:px-10 lg:pl-[6%] lg:pr-10 py-4 sm:py-5">
            <nav aria-label="Breadcrumbs" className="flex items-center gap-2 font-serif text-sm text-stone-600 mb-2">
              <button onClick={onNavigateHome} className="hover:text-burgundy-800 cursor-pointer">Home</button>
              <ChevronRight className="w-3.5 h-3.5 text-stone-400" />
              <button onClick={onNavigateCollections} className="hover:text-burgundy-800 cursor-pointer">Collections</button>
              <ChevronRight className="w-3.5 h-3.5 text-stone-400" />
              <span className="text-charcoal">{info.title}</span>
            </nav>

            <h1 className="font-serif text-3xl sm:text-4xl font-semibold uppercase tracking-[0.04em] text-burgundy-800 leading-none">
              {info.title}
            </h1>
            <Divider className="my-2" />
            <p className="font-serif text-lg text-charcoal">{info.subtitle}</p>
            <p className="mt-1 font-serif text-[15px] leading-snug text-stone-700 max-w-2xl line-clamp-3">{info.description}</p>

            <ul className="mt-3 hidden sm:grid grid-cols-4 gap-y-3 max-w-2xl">
              {info.highlights.map(({ icon: Icon, label }, i) => (
                <li key={label} className={`flex flex-col items-center text-center px-2 ${i > 0 ? 'sm:border-l sm:border-gold-500/40' : ''}`}>
                  <span className="w-8 h-8 rounded-full border border-gold-600/70 text-gold-700 grid place-items-center">
                    <Icon className="w-4 h-4" strokeWidth={1.4} />
                  </span>
                  <span className="mt-1 font-serif text-[13px] text-stone-700 leading-tight">{label}</span>
                </li>
              ))}
            </ul>
          </div>

          {collectionImage(info, banners, products, 'hero') ? (
            <img
              src={collectionImage(info, banners, products, 'hero')}
              alt={`${info.title} saree`}
              className="w-full h-36 sm:h-56 lg:h-0 lg:min-h-full object-cover lg:[mask-image:linear-gradient(to_right,transparent,black_22%)]"
            />
          ) : (
            <div className="hidden lg:grid place-items-center bg-gradient-to-r from-transparent to-[#efd9b8]">
              <LotusMark className="w-24 h-24 text-gold-600/50" />
            </div>
          )}
        </div>
      </section>

      {/* ── Sarees ── */}
      <section className="max-w-[1880px] mx-auto px-3 sm:px-6 lg:px-10 pt-6 pb-10 sm:pt-8 sm:pb-14">
        {items.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-3 sm:gap-5">
            {items.map((p) => (
              <article key={p.id} className="bg-[#fffaf3] border border-[#ecdcc2] shadow-sm hover:shadow-lg transition-shadow flex flex-col">
                <button onClick={() => onSelectProduct(p)} className="block overflow-hidden aspect-[3/4] cursor-pointer" aria-label={`View ${p.name}`}>
                  <img src={p.images[0]} alt={p.name} className="w-full h-full object-cover transition-transform duration-700 hover:scale-105" />
                </button>
                <div className="flex-1 flex flex-col items-center text-center px-3 pt-4 pb-4">
                  <h2 className="font-serif text-base sm:text-lg text-charcoal leading-snug">{p.name}</h2>
                  <p className="mt-1 font-serif text-base text-charcoal">
                    <strong className="font-semibold">{formatPrice(p.sellingPrice)}</strong>
                    <span className="text-sm text-stone-500"> + shipping</span>
                  </p>
                  {p.stock === 0 && <p className="mt-1 text-xs font-semibold uppercase tracking-wider text-rose-700">Sold out</p>}
                  <Divider className="my-3 scale-75" />
                  <button
                    onClick={() => onSelectProduct(p)}
                    className="mt-auto w-full inline-flex items-center justify-center gap-2 px-3 py-2.5 bg-[#4c1012] hover:bg-burgundy-800 text-ivory font-serif text-[13px] sm:text-sm tracking-[0.1em] uppercase transition-colors cursor-pointer"
                  >
                    View details
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 max-w-md mx-auto">
            <LotusMark className="w-10 h-10 mx-auto text-gold-600" />
            <h2 className="mt-4 font-serif text-2xl text-burgundy-800">New pieces arriving soon</h2>
            <p className="mt-2 font-serif text-lg text-stone-600">
              Our {info.title.toLowerCase()} are being added. Message us on WhatsApp to see the latest designs.
            </p>
            <button
              onClick={() => openWhatsApp(`Hi Daivisha Vastra, I'd like to see your ${info.title} collection.`)}
              className="mt-6 inline-flex items-center gap-2 px-6 py-3 bg-[#25D366] hover:bg-[#1ebe5b] text-white text-sm font-semibold cursor-pointer"
            >
              <MessageCircle className="w-4 h-4" /> Ask on WhatsApp
            </button>
          </div>
        )}
      </section>

      {/* ── Crafted in Heritage ── */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#fbf1e3] to-[#f6e6cf] border-t border-gold-500/40">
        <img
          src="/images/collection_palace_sketch.jpg"
          alt=""
          className="hidden xl:block absolute left-0 bottom-0 w-[22%] max-w-[340px] h-auto mix-blend-multiply opacity-70 pointer-events-none [mask-image:linear-gradient(to_right,black_65%,transparent)]"
        />
        <img
          src="/images/collection_floral_sketch.jpg"
          alt=""
          className="hidden xl:block absolute right-0 top-0 w-[16%] max-w-[240px] h-auto mix-blend-multiply opacity-70 pointer-events-none [mask-image:linear-gradient(to_left,black_65%,transparent)]"
        />
        <div className="relative max-w-2xl mx-auto px-5 py-12 sm:py-16 text-center">
          <h2 className="font-serif text-3xl sm:text-4xl uppercase tracking-[0.06em] text-burgundy-800">{info.heritage.title}</h2>
          <Divider className="justify-center my-4" />
          <p className="font-serif text-lg leading-relaxed text-stone-700">{info.heritage.text}</p>
        </div>
        <ul className="relative max-w-4xl mx-auto px-4 pb-12 grid grid-cols-2 md:grid-cols-4 gap-y-6">
          {info.heritage.points.map(({ icon: Icon, label }, i) => (
            <li key={label} className={`flex items-center justify-center gap-3 px-3 ${i > 0 ? 'md:border-l md:border-gold-500/40' : ''}`}>
              <Icon className="w-9 h-9 text-gold-700 shrink-0" strokeWidth={1.3} />
              <span className="font-serif text-sm sm:text-base text-stone-700 leading-snug text-left">{label}</span>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
};
