import React, { useState } from 'react';
import { Maximize2, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { ImageWithFallback } from '../common/ImageWithFallback';

interface ProductGalleryProps {
  images: string[];
  productName: string;
}

export const ProductGallery: React.FC<ProductGalleryProps> = ({ images, productName }) => {
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const displayImages = images.length > 0 ? images : ['/images/hero_saree_model_1791372718962.jpg'];

  const nextImage = () => {
    setActiveImageIndex((prev) => (prev + 1) % displayImages.length);
  };

  const prevImage = () => {
    setActiveImageIndex((prev) => (prev - 1 + displayImages.length) % displayImages.length);
  };

  return (
    <div className="space-y-4">
      {/* Desktop 2-column or stacked high-res editorial presentation */}
      <div className="hidden lg:grid grid-cols-2 gap-4">
        {displayImages.map((img, idx) => (
          <div
            key={idx}
            onClick={() => {
              setActiveImageIndex(idx);
              setIsFullscreen(true);
            }}
            className="group relative aspect-[3/4] overflow-hidden bg-cream/40 cursor-zoom-in"
          >
            <ImageWithFallback
              src={img}
              alt={`${productName} - View ${idx + 1}`}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity bg-black/60 text-white p-2 rounded-full">
              <Maximize2 className="w-4 h-4" />
            </div>
            <div className="absolute bottom-3 left-3 bg-burgundy-950/80 text-gold-300 text-[10px] tracking-widest uppercase px-2.5 py-1">
              View {idx + 1} of {displayImages.length}
            </div>
          </div>
        ))}
      </div>

      {/* Mobile Swipe / Carousel View */}
      <div className="lg:hidden relative aspect-[3/4] overflow-hidden bg-cream/40">
        <ImageWithFallback
          src={displayImages[activeImageIndex]}
          alt={`${productName} view ${activeImageIndex + 1}`}
          className="w-full h-full object-cover"
        />

        {displayImages.length > 1 && (
          <>
            <button
              onClick={prevImage}
              className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/80 flex items-center justify-center text-charcoal shadow-md"
              aria-label="Previous view"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={nextImage}
              className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/80 flex items-center justify-center text-charcoal shadow-md"
              aria-label="Next view"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
            <div className="absolute bottom-3 inset-x-0 flex justify-center gap-1.5">
              {displayImages.map((_, idx) => (
                <div
                  key={idx}
                  className={`w-2 h-2 rounded-full transition-all ${
                    activeImageIndex === idx ? 'bg-burgundy-900 w-4' : 'bg-white/70'
                  }`}
                />
              ))}
            </div>
          </>
        )}
      </div>

      {/* Fullscreen Lightbox Modal */}
      {isFullscreen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4 animate-in fade-in"
        >
          <button
            onClick={() => setIsFullscreen(false)}
            className="absolute top-6 right-6 text-white hover:text-gold-400 p-2 z-10"
            aria-label="Close fullscreen gallery"
          >
            <X className="w-8 h-8" />
          </button>

          <div className="relative max-w-4xl max-h-[90vh] flex items-center justify-center">
            <ImageWithFallback
              src={displayImages[activeImageIndex]}
              alt={productName}
              className="max-h-[85vh] w-auto object-contain"
            />

            {displayImages.length > 1 && (
              <>
                <button
                  onClick={prevImage}
                  className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/20 hover:bg-white/40 text-white flex items-center justify-center transition-colors"
                  aria-label="Previous image"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/20 hover:bg-white/40 text-white flex items-center justify-center transition-colors"
                  aria-label="Next image"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
