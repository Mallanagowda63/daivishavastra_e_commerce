import { COLLECTIONS } from '../data/collections';
import { POLICIES, PolicyId } from '../data/policies';
import { SareeCategory } from '../types';

// Every storefront page has its own address, so links can be shared and the back button works.
export type Route =
  | { view: 'home'; section?: 'our-story' | 'collections' }
  | { view: 'shop'; category?: string; collection?: string; occasion?: string; fabric?: string }
  | { view: 'product'; slug: string }
  | { view: 'collection'; key: SareeCategory }
  | { view: 'wishlist' }
  | { view: 'aboutus' }
  | { view: 'contact' }
  | { view: PolicyId };

const slugify = (s: string) => s.toLowerCase().replace(/&/g, 'and').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

const POLICY_PATHS: Record<PolicyId, string> = {
  refund: '/returns-exchange',
  shipping: '/shipping',
  privacy: '/privacy-policy',
  terms: '/terms',
};

const SHOP_PARAMS = ['category', 'collection', 'occasion', 'fabric'] as const;

export const routeToUrl = (r: Route): string => {
  switch (r.view) {
    case 'home':
      return r.section ? `/${r.section}` : '/';
    case 'shop': {
      const q = new URLSearchParams();
      SHOP_PARAMS.forEach((k) => r[k] && q.set(k, r[k] as string));
      const qs = q.toString();
      return qs ? `/sarees?${qs}` : '/sarees';
    }
    case 'product':
      return `/saree/${r.slug}`;
    case 'collection':
      return `/collections/${slugify(r.key)}`;
    case 'wishlist':
      return '/wishlist';
    case 'aboutus':
      return '/about-us';
    case 'contact':
      return '/contact';
    default:
      return POLICY_PATHS[r.view];
  }
};

/** Read the page from the address bar. Unknown addresses fall back to the home page. */
export const parseUrl = (pathname: string, search: string): Route => {
  const path = pathname.replace(/\/+$/, '') || '/';
  const parts = path.split('/').filter(Boolean);

  if (path === '/') return { view: 'home' };
  if (path === '/our-story') return { view: 'home', section: 'our-story' };
  if (path === '/collections') return { view: 'home', section: 'collections' };
  if (path === '/sarees') {
    const q = new URLSearchParams(search);
    const r: Route = { view: 'shop' };
    SHOP_PARAMS.forEach((k) => {
      const v = q.get(k);
      if (v) r[k] = v;
    });
    return r;
  }
  if (parts[0] === 'saree' && parts[1]) return { view: 'product', slug: decodeURIComponent(parts[1]) };
  if (parts[0] === 'collections' && parts[1]) {
    const c = COLLECTIONS.find((x) => slugify(x.key) === parts[1]);
    if (c) return { view: 'collection', key: c.key };
  }
  if (path === '/wishlist') return { view: 'wishlist' };
  if (path === '/about-us') return { view: 'aboutus' };
  if (path === '/contact') return { view: 'contact' };
  const policy = (Object.keys(POLICY_PATHS) as PolicyId[]).find((id) => POLICY_PATHS[id] === path);
  if (policy) return { view: policy };
  return { view: 'home' };
};

const SITE = 'Daivisha Vastra';

/** Browser tab title for a page. */
export const routeTitle = (r: Route, productName?: string): string => {
  switch (r.view) {
    case 'home':
      return r.section === 'our-story' ? `Our Story | ${SITE}` : `${SITE} | Elegant attire rooted in Indian heritage`;
    case 'shop':
      return `${r.category || r.collection || r.occasion || 'Sarees'} | ${SITE}`;
    case 'product':
      return `${productName ?? 'Saree'} | ${SITE}`;
    case 'collection':
      return `${COLLECTIONS.find((c) => c.key === r.key)?.title ?? 'Collection'} | ${SITE}`;
    case 'wishlist':
      return `Wishlist | ${SITE}`;
    case 'aboutus':
      return `About Us | ${SITE}`;
    case 'contact':
      return `Contact Us | ${SITE}`;
    default:
      return `${POLICIES[r.view].title} | ${SITE}`;
  }
};
