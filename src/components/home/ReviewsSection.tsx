import React, { useState } from 'react';
import { MessageSquarePlus, Star } from 'lucide-react';
import { formatReviewDate, useReviews } from '../../data/reviewStore';
import { ReviewForm } from '../common/ReviewForm';
import { SareeProduct } from '../../types';

export const ReviewsSection: React.FC<{ products: SareeProduct[] }> = ({ products }) => {
  const approved = useReviews().filter((r) => r.status === 'approved');
  const [writing, setWriting] = useState(false);

  return (
    <section id="reviews" className="py-16 lg:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 scroll-mt-36">
      <div className="text-center max-w-2xl mx-auto mb-10 space-y-2">
        <span className="text-xs uppercase tracking-[0.2em] text-gold-700 font-semibold">Words of Appreciation</span>
        <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-burgundy-950">Customer Reviews</h2>
        <p className="text-sm text-stone-600 font-sans">
          {approved.length ? 'What our customers say about their Daivisha Vastra sarees.' : 'Bought a saree from us? We would love to hear about it.'}
        </p>
      </div>

      {approved.length > 0 && (
        <div className="flex flex-wrap justify-center gap-6">
          {approved.slice(0, 8).map((review) => (
            <div key={review.id} className="w-full sm:w-[calc(50%-12px)] lg:w-[calc(25%-18px)] p-6 bg-white border border-sand shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-1 mb-4" aria-label={`${review.rating} out of 5 stars`}>
                  {[1, 2, 3, 4, 5].map((n) => (
                    <Star key={n} className={`w-4 h-4 ${n <= review.rating ? 'fill-gold-500 text-gold-500' : 'text-stone-300'}`} />
                  ))}
                </div>
                <p className="text-sm text-stone-700 font-sans italic leading-relaxed mb-6">&ldquo;{review.comment}&rdquo;</p>
              </div>
              <div className="pt-4 border-t border-sand/70 space-y-1">
                <span className="font-serif font-bold text-charcoal text-sm">{review.name}</span>
                {review.productName && <p className="text-[11px] text-gold-700 font-medium line-clamp-1">{review.productName}</p>}
                <p className="text-[10px] text-stone-400">{[review.city, formatReviewDate(review.date)].filter(Boolean).join(' · ')}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="max-w-2xl mx-auto mt-10">
        {writing ? (
          <div className="bg-[#fbf3e6] border border-gold-500/40 p-5 sm:p-7">
            <h3 className="font-serif text-2xl text-burgundy-800 mb-4">Write a review</h3>
            <ReviewForm products={products.map((p) => ({ id: p.id, name: p.name }))} onDone={() => setWriting(false)} />
          </div>
        ) : (
          <div className="text-center">
            <button
              onClick={() => setWriting(true)}
              className="inline-flex items-center gap-2 px-7 py-3 border border-burgundy-800 text-burgundy-800 hover:bg-burgundy-800 hover:text-ivory font-serif text-sm tracking-[0.12em] uppercase transition-colors cursor-pointer"
            >
              <MessageSquarePlus className="w-4 h-4" /> Write a review
            </button>
          </div>
        )}
      </div>
    </section>
  );
};
