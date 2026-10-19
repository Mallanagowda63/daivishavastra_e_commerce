import { useSyncExternalStore } from 'react';

// Customer reviews. New reviews wait for admin approval before they appear on the website.
// Saved in this browser until the store database is connected; other open tabs stay in sync.

export type ReviewStatus = 'pending' | 'approved' | 'hidden';

export interface Review {
  id: string;
  name: string;
  city: string;
  rating: number; // 1–5
  comment: string;
  productId?: string;
  productName?: string;
  date: string; // ISO
  status: ReviewStatus;
}

const KEY = 'daivisha_reviews';

const load = (): Review[] => {
  try {
    return JSON.parse(localStorage.getItem(KEY) || '[]');
  } catch {
    return [];
  }
};

let reviews: Review[] = load();
const listeners = new Set<() => void>();

const save = (next: Review[]) => {
  reviews = next;
  try {
    localStorage.setItem(KEY, JSON.stringify(next));
  } catch {
    // storage blocked: keep for this visit
  }
  listeners.forEach((l) => l());
};

if (typeof window !== 'undefined') {
  window.addEventListener('storage', (e) => {
    if (e.key === KEY) {
      reviews = load();
      listeners.forEach((l) => l());
    }
  });
}

const subscribe = (l: () => void) => {
  listeners.add(l);
  return () => listeners.delete(l);
};

export const useReviews = () => useSyncExternalStore(subscribe, () => reviews);

export const addReview = (r: Omit<Review, 'id' | 'date' | 'status'>) =>
  save([{ ...r, id: `rev-${Date.now().toString(36)}`, date: new Date().toISOString(), status: 'pending' }, ...reviews]);

export const setReviewStatus = (id: string, status: ReviewStatus) => save(reviews.map((r) => (r.id === id ? { ...r, status } : r)));

export const deleteReview = (id: string) => save(reviews.filter((r) => r.id !== id));

export const formatReviewDate = (iso: string) =>
  new Date(iso).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
