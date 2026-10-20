import React, { useState } from 'react';
import { Maximize2, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { useBackToClose } from '../../lib/history';

interface ProductGalleryProps {
  images: string[];
  productName: string;
}

/**
 * One large photo shown whole (posters keep their text and edges), with thumbnails to switch.
 * Tap the photo for a full-screen view.
 */
export const ProductGallery: React.FC<ProductGalleryProps> = ({ images, productName }) => {
  const [active, setActive] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  useBackToClose(isFullscreen, () => setIsFullscreen(false));

  const displayImages = images.length > 0 ? images : ['/images/hero_saree_model_1791372718962.jpg'];
  const current = Math.min(active, displayImages.length - 1);
  const many = displayImages.length > 1;
  const next = () => setActive((current + 1) % displayImages.length);
  const prev = () => setActive((current - 1 + displayImages.length) % displayImages.length);

  const arrow = 'absolute top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/85 hover:bg-white flex items-center justify-center text-charcoal shadow-md cursor-pointer';

  return (
    <div className="space-y-3">
      <div className="relative bg-[#f4ece0] border border-sand/70">
        <button
          onClick={() => setIsFullscreen(true)}
          className="group block w-full aspect-[4/5] cursor-zoom-in"
          aria-label={`Open ${productName} photo ${current + 1} full screen`}
        >
          <img
            key={displayImages[current]}
            src={displayImages[current]}
            alt={`${productName} — photo ${current + 1}`}
            className="w-full h-full object-contain"
          />
          <span className="absolute top-3 right-3 bg-black/55 text-white p-2 rounded-full opacity-80 group-hover:opacity-100">
            <Maximize2 className="w-4 h-4" />
          </span>
        </button>
        {many && (
          <>
            <button onClick={prev} className={`${arrow} left-3`} aria-label="Previous photo">
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button onClick={next} className={`${arrow} right-3`} aria-label="Next photo">
              <ChevronRight className="w-5 h-5" />
            </button>
          </>
        )}
        <span className="absolute bottom-3 left-3 bg-burgundy-950/80 text-gold-300 text-[10px] tracking-widest uppercase px-2.5 py-1 pointer-events-none">
          Photo {current + 1} of {displayImages.length}
        </span>
      </div>

      {many && (
        <div className="flex gap-2 overflow-x-auto pb-1">
          {displayImages.map((img, idx) => (
            <button
              key={img + idx}
              onClick={() => setActive(idx)}
              aria-label={`Show photo ${idx + 1}`}
              aria-current={idx === current}
              className={`shrink-0 w-20 h-24 bg-[#f4ece0] border-2 cursor-pointer ${idx === current ? 'border-burgundy-800' : 'border-transparent hover:border-gold-500'}`}
            >
              <img src={img} alt="" loading="lazy" className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      )}

      {isFullscreen && (
        <div role="dialog" aria-modal="true" aria-label={`${productName} photos`} className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-3 animate-in fade-in">
          <button onClick={() => setIsFullscreen(false)} className="absolute top-4 right-4 text-white hover:text-gold-400 p-2 z-10 cursor-pointer" aria-label="Close">
            <X className="w-8 h-8" />
          </button>
          {/* Shown at its real size at most, so phone photos never look stretched or blurry */}
          <img src={displayImages[current]} alt={productName} className="max-h-[92vh] max-w-full w-auto h-auto" />
          {many && (
            <>
              <button onClick={prev} className="absolute left-3 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/20 hover:bg-white/40 text-white flex items-center justify-center cursor-pointer" aria-label="Previous photo">
                <ChevronLeft className="w-6 h-6" />
              </button>
              <button onClick={next} className="absolute right-3 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/20 hover:bg-white/40 text-white flex items-center justify-center cursor-pointer" aria-label="Next photo">
                <ChevronRight className="w-6 h-6" />
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
};
