import React, { useState } from 'react';
import { Star } from 'lucide-react';
import { addReview } from '../../data/reviewStore';
import { useToast } from '../../context/ToastContext';

interface ReviewFormProps {
  /** Saree being reviewed; when omitted the customer can pick one (or none). */
  product?: { id: string; name: string };
  products?: { id: string; name: string }[];
  onDone?: () => void;
}

const input =
  'w-full px-3.5 py-2.5 bg-white border border-sand focus:border-gold-600 focus:outline-none text-sm font-sans text-charcoal';

/** Customer review form. Reviews are sent for approval and appear once the store approves them. */
export const ReviewForm: React.FC<ReviewFormProps> = ({ product, products = [], onDone }) => {
  const { showToast } = useToast();
  const [name, setName] = useState('');
  const [city, setCity] = useState('');
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [productId, setProductId] = useState(product?.id ?? '');
  const [error, setError] = useState('');
  const [sending, setSending] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim().length < 2) return setError('Please enter your name.');
    if (comment.trim().length < 10) return setError('Please write a few words about your saree (at least 10 characters).');
    const chosen = product ?? products.find((p) => p.id === productId);
    setSending(true);
    try {
    await addReview({
      name: name.trim(),
      city: city.trim(),
      rating,
      comment: comment.trim(),
      productId: chosen?.id,
      productName: chosen?.name,
    });
    } catch (err) {
      setSending(false);
      return setError(err instanceof Error ? err.message : 'Could not send your review. Please try again.');
    }
    setSending(false);
    setName('');
    setCity('');
    setRating(5);
    setComment('');
    setError('');
    showToast({ type: 'success', title: 'Thank you for your review!', message: 'It will appear on the website once approved.' });
    onDone?.();
  };

  return (
    <form onSubmit={submit} className="space-y-3 text-left">
      <div>
        <p className="text-xs uppercase tracking-wider font-semibold text-stone-600 mb-1.5">Your rating</p>
        <div className="flex gap-1" role="radiogroup" aria-label="Rating">
          {[1, 2, 3, 4, 5].map((n) => (
            <button
              key={n}
              type="button"
              role="radio"
              aria-checked={rating === n}
              aria-label={`${n} star${n > 1 ? 's' : ''}`}
              onClick={() => setRating(n)}
              className="p-0.5 cursor-pointer"
            >
              <Star className={`w-6 h-6 ${n <= rating ? 'fill-gold-500 text-gold-500' : 'text-stone-300'}`} />
            </button>
          ))}
        </div>
      </div>
      <div className="grid sm:grid-cols-2 gap-3">
        <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name *" className={input} maxLength={60} />
        <input value={city} onChange={(e) => setCity(e.target.value)} placeholder="City (optional)" className={input} maxLength={40} />
      </div>
      {!product && products.length > 0 && (
        <select value={productId} onChange={(e) => setProductId(e.target.value)} className={input}>
          <option value="">Which saree? (optional)</option>
          {products.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name}
            </option>
          ))}
        </select>
      )}
      <textarea
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder="Tell us about your saree and your experience *"
        rows={4}
        maxLength={800}
        className={`${input} resize-y`}
      />
      {error && <p className="text-sm text-rose-700">{error}</p>}
      <button
        type="submit"
        disabled={sending}
        className="disabled:opacity-60 w-full sm:w-auto px-7 py-3 bg-burgundy-800 hover:bg-burgundy-900 text-ivory font-serif text-sm tracking-[0.12em] uppercase cursor-pointer"
      >
        {sending ? 'Sending…' : 'Submit review'}
      </button>
      <p className="text-xs text-stone-500">Reviews are checked by our team before they appear on the website.</p>
    </form>
  );
};
