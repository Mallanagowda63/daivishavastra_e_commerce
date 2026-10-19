import { useSyncExternalStore } from 'react';
import { api } from '../lib/api';

// Banner image chosen in admin for each saree collection (keyed by category name), saved in the store database.
// Used on the home page collection card and at the top of the collection page.

type Banners = Record<string, string>;

let banners: Banners = {};
const listeners = new Set<() => void>();
const emit = () => listeners.forEach((l) => l());

const subscribe = (l: () => void) => {
  listeners.add(l);
  return () => listeners.delete(l);
};

/** Filled from the catalog when the site loads. */
export const hydrateBanners = (next: Banners) => {
  banners = next ?? {};
  emit();
};

export const useBanners = () => useSyncExternalStore(subscribe, () => banners);

export const setBanner = async (key: string, image: string) => {
  await api('banner.set', { key, image });
  banners = { ...banners, [key]: image };
  emit();
};

export const removeBanner = async (key: string) => {
  await api('banner.remove', { key });
  const next = { ...banners };
  delete next[key];
  banners = next;
  emit();
};
