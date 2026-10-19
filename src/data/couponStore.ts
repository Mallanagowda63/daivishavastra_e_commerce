import { useSyncExternalStore } from 'react';
import { Coupon } from '../types';

import { api, reportError } from '../lib/api';

// Shared coupon list used by the admin, the cart and the top announcement bar, saved in the store database.
// Visitors receive only usable coupons; the signed-in admin receives all of them. Prices are always
// re-checked by the server when an order is placed.

let coupons: Coupon[] = [];
const listeners = new Set<() => void>();
const emit = () => listeners.forEach((l) => l());

const subscribe = (l: () => void) => {
  listeners.add(l);
  return () => listeners.delete(l);
};

/** Filled from the catalog when the site loads. */
export const hydrateCoupons = (next: Coupon[]) => {
  coupons = (next ?? []).map((c) => ({
    ...c,
    discountPercentage: c.discountPercentage ?? undefined,
    discountAmount: c.discountAmount ?? undefined,
    expiresAt: c.expiresAt ?? undefined,
  }));
  emit();
};

/** Saves the whole list; rolls back if the server refuses. */
const save = async (next: Coupon[]) => {
  const before = coupons;
  coupons = next;
  emit();
  try {
    await api('coupons.save', { coupons: next });
  } catch (e) {
    coupons = before;
    emit();
    reportError(e);
  }
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
