import React from 'react';
import { Instagram, Heart } from 'lucide-react';
import { ImageWithFallback } from '../common/ImageWithFallback';

export const SocialGallerySection: React.FC = () => {
  const galleryItems = [
    {
      image: '/images/kanjivaram_silk_saree_1791372743617.jpg',
      handle: '@radhika_wedding',
      caption: 'Felt like royalty draped in this crimson Kanjivaram for my phera ceremony.',
    },
    {
      image: '/images/banarasi_heritage_saree_1791372753729.jpg',
      handle: '@sneha.couture',
      caption: 'The emerald shine in the evening light is simply out of this world.',
    },
    {
      image: '/images/hero_saree_model_1791372718962.jpg',
      handle: '@divya_drapes',
      caption: 'Heirloom packaging arrived with handwritten silk care notes from the atelier.',
    },
    {
      image: '/images/organza_pastel_saree_1791372764937.jpg',
      handle: '@ananya_delhi',
      caption: 'Daytime cocktail reception look in Daivisha Vastra blush organza!',
    },
  ];

  return (
    <section className="py-20 lg:py-24 bg-cream/40 border-t border-b border-sand">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4 mb-12">
        <span className="text-xs uppercase tracking-[0.2em] text-gold-700 font-semibold">
          Clientele Moments
        </span>
        <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-burgundy-950">
          Worn With Love
        </h2>
        <p className="text-sm text-stone-600 font-sans max-w-lg mx-auto">
          Real patrons celebrating life&apos;s grandest memories in Daivisha Vastra sarees.
        </p>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          {galleryItems.map((item, idx) => (
            <div
              key={idx}
              className="group relative aspect-square overflow-hidden bg-white shadow-sm hover:shadow-xl transition-all"
            >
              <ImageWithFallback
                src={item.image}
                alt={item.caption}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />

              <div className="absolute inset-0 bg-burgundy-950/80 text-white opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-4 text-left">
                <div className="flex items-center justify-between text-gold-300">
                  <Instagram className="w-5 h-5" />
                  <Heart className="w-4 h-4 fill-gold-400" />
                </div>
                <div>
                  <span className="text-xs font-semibold text-gold-300 block">{item.handle}</span>
                  <p className="text-[11px] text-cream/90 font-sans line-clamp-3 mt-1 leading-snug">
                    {item.caption}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-10">
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 border border-burgundy-950 text-burgundy-950 hover:bg-burgundy-950 hover:text-gold-300 font-semibold text-xs tracking-widest uppercase transition-colors"
          >
            <Instagram className="w-4 h-4" />
            <span>Follow @DaivishaVastra on Instagram</span>
          </a>
        </div>
      </div>
    </section>
  );
};
