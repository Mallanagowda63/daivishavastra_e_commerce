import { useSyncExternalStore } from 'react';

// Banner image chosen in admin for each saree collection (keyed by category name).
// Used on the home page collection card and at the top of the collection page.
// Saved in this browser until the store database is connected; other open tabs stay in sync.

const KEY = 'daivisha_collection_banners';

type Banners = Record<string, string>;

const load = (): Banners => {
  try {
    return JSON.parse(localStorage.getItem(KEY) || '{}');
  } catch {
    return {};
  }
};

let banners: Banners = load();
const listeners = new Set<() => void>();

const save = (next: Banners) => {
  banners = next;
  try {
    localStorage.setItem(KEY, JSON.stringify(next));
  } catch {
    // storage full or blocked: keep the in-memory value for this visit
  }
  listeners.forEach((l) => l());
};

if (typeof window !== 'undefined') {
  window.addEventListener('storage', (e) => {
    if (e.key === KEY) {
      banners = load();
      listeners.forEach((l) => l());
    }
  });
}

const subscribe = (l: () => void) => {
  listeners.add(l);
  return () => listeners.delete(l);
};

export const useBanners = () => useSyncExternalStore(subscribe, () => banners);

export const setBanner = (key: string, image: string) => save({ ...banners, [key]: image });

export const removeBanner = (key: string) => {
  const next = { ...banners };
  delete next[key];
  save(next);
};
