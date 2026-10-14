import React from 'react';
import { Star, CheckCircle, Quote } from 'lucide-react';
import { INITIAL_REVIEWS } from '../../data/products';

export const ReviewsSection: React.FC = () => {
  return (
    <section id="reviews" className="py-20 lg:py-28 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto mb-16 space-y-2">
        <span className="text-xs uppercase tracking-[0.2em] text-gold-700 font-semibold">
          Words of Appreciation
        </span>
        <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-burgundy-950">
          Patron Experiences
        </h2>
        <p className="text-sm text-stone-600 font-sans">
          Discover why discerning women across India and worldwide choose Daivisha Vastra for their milestone moments.
        </p>
      </div>

      {/* Reviews Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {INITIAL_REVIEWS.map((review) => (
          <div
            key={review.id}
            className="p-6 bg-white border border-sand shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between"
          >
            <div>
              {/* Star Rating */}
              <div className="flex items-center gap-1 text-gold-500 mb-4">
                {Array.from({ length: review.rating }).map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-gold-500" />
                ))}
              </div>

              {/* Review Text */}
              <p className="text-xs sm:text-sm text-stone-700 font-sans italic leading-relaxed mb-6">
                &ldquo;{review.comment}&rdquo;
              </p>
            </div>

            {/* Author info & verified buyer badge */}
            <div className="pt-4 border-t border-sand/70 space-y-1">
              <div className="flex items-center justify-between">
                <span className="font-serif font-bold text-charcoal text-sm">
                  {review.customerName}
                </span>
                {review.verifiedBuyer && (
                  <span className="flex items-center gap-1 text-[10px] text-emerald-800 font-medium">
                    <CheckCircle className="w-3 h-3 text-emerald-600" />
                    <span>Verified</span>
                  </span>
                )}
              </div>
              <p className="text-[11px] text-gold-800 font-medium line-clamp-1">
                {review.productName}
              </p>
              <p className="text-[10px] text-stone-400">
                {review.city} · {review.date}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
