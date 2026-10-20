import React, { useState } from 'react';
import { MessageSquarePlus, Star } from 'lucide-react';
import { formatReviewDate, useReviews } from '../../data/reviewStore';
import { ReviewForm } from '../common/ReviewForm';
import { SareeProduct } from '../../types';

/** Approved reviews for one saree, plus the form to write one. */
export const ProductReviews: React.FC<{ product: SareeProduct }> = ({ product }) => {
  const reviews = useReviews().filter((r) => r.status === 'approved' && r.productId === product.id);
  const [writing, setWriting] = useState(false);

  return (
    <section id="product-reviews" className="max-w-4xl mx-auto px-4 sm:px-6 mt-10 scroll-mt-36">
      <div className="flex flex-wrap items-end justify-between gap-3 border-b border-sand pb-3">
        <h2 className="font-serif text-2xl sm:text-3xl text-burgundy-900">Customer Reviews</h2>
        {!writing && (
          <button
            onClick={() => setWriting(true)}
            className="inline-flex items-center gap-2 text-sm font-serif text-burgundy-800 underline decoration-gold-500/60 underline-offset-4 cursor-pointer"
          >
            <MessageSquarePlus className="w-4 h-4" /> Write a review
          </button>
        )}
      </div>

      {writing && (
        <div className="mt-5 bg-[#fbf3e6] border border-gold-500/40 p-5 sm:p-6">
          <ReviewForm product={{ id: product.id, name: product.name }} onDone={() => setWriting(false)} />
        </div>
      )}

      {reviews.length ? (
        <ul className="mt-5 divide-y divide-sand">
          {reviews.map((r) => (
            <li key={r.id} className="py-4">
              <div className="flex items-center gap-2">
                <div className="flex" aria-label={`${r.rating} out of 5 stars`}>
                  {[1, 2, 3, 4, 5].map((n) => (
                    <Star key={n} className={`w-4 h-4 ${n <= r.rating ? 'fill-gold-500 text-gold-500' : 'text-stone-300'}`} />
                  ))}
                </div>
                <span className="font-serif font-semibold text-charcoal">{r.name}</span>
                <span className="text-xs text-stone-400">{[r.city, formatReviewDate(r.date)].filter(Boolean).join(' · ')}</span>
              </div>
              <p className="mt-2 font-serif text-lg leading-relaxed text-stone-700">{r.comment}</p>
            </li>
          ))}
        </ul>
      ) : (
        !writing && <p className="mt-4 font-serif text-lg text-stone-500">No reviews yet for this saree.</p>
      )}
    </section>
  );
};
