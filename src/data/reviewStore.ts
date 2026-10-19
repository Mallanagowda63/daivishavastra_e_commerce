import { useSyncExternalStore } from 'react';
import { api } from '../lib/api';

// Customer reviews, saved in the store database. New reviews wait for admin approval before they appear.
// Visitors receive only approved reviews; the signed-in admin receives all of them.

export type ReviewStatus = 'pending' | 'approved' | 'hidden';

export interface Review {
  id: string;
  name: string;
  city: string;
  rating: number; // 1–5
  comment: string;
  productId?: string | null;
  productName?: string | null;
  date: string; // ISO
  status: ReviewStatus;
}

let reviews: Review[] = [];
const listeners = new Set<() => void>();
const emit = () => listeners.forEach((l) => l());

const subscribe = (l: () => void) => {
  listeners.add(l);
  return () => listeners.delete(l);
};

/** Filled from the catalog when the site loads (and again after the admin signs in). */
export const hydrateReviews = (next: Review[]) => {
  reviews = next ?? [];
  emit();
};

export const useReviews = () => useSyncExternalStore(subscribe, () => reviews);

/** Sends a review for approval. Throws with a readable message if it could not be saved. */
export const addReview = (r: Omit<Review, 'id' | 'date' | 'status'>) => api('review.add', r);

export const setReviewStatus = async (id: string, status: ReviewStatus) => {
  await api('review.status', { id, status });
  reviews = reviews.map((r) => (r.id === id ? { ...r, status } : r));
  emit();
};

export const deleteReview = async (id: string) => {
  await api('review.delete', { id });
  reviews = reviews.filter((r) => r.id !== id);
  emit();
};

export const formatReviewDate = (iso: string) =>
  new Date(iso).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
