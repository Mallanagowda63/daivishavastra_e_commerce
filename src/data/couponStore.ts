import { useSyncExternalStore } from 'react';
import { Coupon } from '../types';

// Shared coupon list used by the admin, the cart and the top announcement bar.
// Saved in this browser; other open tabs stay in sync through the storage event.

const KEY = 'daivisha_coupons';

const SEED: Coupon[] = [
  { code: 'WELCOME10', discountPercentage: 10, minimumOrder: 5000, description: '10% off your first saree above ₹5,000', expiresAt: '2028-12-31T23:59', active: true, featured: true },
  { code: 'FESTIVE2500', discountAmount: 2500, minimumOrder: 20000, description: 'Flat ₹2,500 off festive & bridal orders above ₹20,000', expiresAt: '2028-12-31T23:59', active: true },
  { code: 'ROYAL15', discountPercentage: 15, minimumOrder: 35000, description: '15% off luxury couture above ₹35,000', expiresAt: '2028-12-31T23:59', active: true },
  { code: 'SHUBH20', discountPercentage: 20, minimumOrder: 15000, description: '20% off for the wedding season above ₹15,000', expiresAt: '2026-12-31T23:59', active: true },
];

const load = (): Coupon[] => {
  try {
    const saved = localStorage.getItem(KEY);
    return saved ? JSON.parse(saved) : SEED;
  } catch {
    return SEED;
  }
};

let coupons: Coupon[] = load();
const listeners = new Set<() => void>();

const save = (next: Coupon[]) => {
  coupons = next;
  try {
    localStorage.setItem(KEY, JSON.stringify(next));
  } catch {
    // ignore
  }
  listeners.forEach((l) => l());
};

if (typeof window !== 'undefined') {
  window.addEventListener('storage', (e) => {
    if (e.key === KEY) {
      coupons = load();
      listeners.forEach((l) => l());
    }
  });
}

const subscribe = (l: () => void) => {
  listeners.add(l);
  return () => listeners.delete(l);
};

export const useCoupons = () => useSyncExternalStore(subscribe, () => coupons);

export const isExpired = (c: Coupon, now = Date.now()) => !!c.expiresAt && new Date(c.expiresAt).getTime() < now;
export const isUsable = (c: Coupon) => c.active !== false && !isExpired(c);

export const couponLabel = (c: Coupon) =>
  c.discountPercentage ? `${c.discountPercentage}% OFF` : `₹${(c.discountAmount ?? 0).toLocaleString('en-IN')} OFF`;

export const findUsableCoupon = (code: string) => coupons.find((c) => c.code === code.trim().toUpperCase() && isUsable(c));

export const couponActions = {
  add: (c: Coupon) => {
    const code = c.code.trim().toUpperCase();
    const rest = coupons.filter((x) => x.code !== code).map((x) => (c.featured ? { ...x, featured: false } : x));
    save([{ ...c, code }, ...rest]);
  },
  remove: (code: string) => save(coupons.filter((c) => c.code !== code)),
  removeAll: () => save([]),
  toggleActive: (code: string) =>
    save(coupons.map((c) => (c.code === code ? { ...c, active: c.active === false, featured: c.active === false ? c.featured : false } : c))),
  /** Only one coupon is featured at a time; featuring an already-featured coupon clears it. */
  setFeatured: (code: string) => save(coupons.map((c) => ({ ...c, featured: c.code === code ? !c.featured : false }))),
};
