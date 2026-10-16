import { SareeCategory } from '../types';

/** The saree types Daivisha Vastra sells, in menu order. Shown in the Sarees menu, shop chips, filters and admin. */
export const SAREE_TYPES: { name: SareeCategory; desc: string }[] = [
  { name: 'Soft Silk Tissue Sarees', desc: 'Soft silk with a gentle tissue sheen' },
  { name: 'Cotton Boutique Work Sarees', desc: 'Breathable cotton with boutique work' },
  { name: 'Pure Gajji Silk Sarees', desc: 'High-gloss satin weave of Gujarat & Rajasthan' },
  { name: 'Soft Silk Paithani Sarees', desc: 'Paithani motifs and borders on soft silk' },
  { name: 'Fancy Sarees', desc: 'Contemporary designs for parties and celebrations' },
  { name: 'Banarasi Georgette Sarees', desc: 'Flowing georgette with Banarasi weaving' },
  { name: 'Linen Cotton Mirror Work Sarees', desc: 'Linen cotton finished with mirror work' },
  { name: 'Chinnon Sarees', desc: 'Light, flowing chinnon with a soft sheen' },
  { name: 'Warm Silk Sarees with Ikat Border', desc: 'Warm silk paired with an ikat border' },
  { name: 'Kalamkari Sarees with Bentex Border', desc: 'Kalamkari prints with a Bentex border' },
];

export const SAREE_TYPE_NAMES: SareeCategory[] = SAREE_TYPES.map((t) => t.name);

/** Old category names saved in browsers before the type list changed, mapped to their new name. */
export const RENAMED_CATEGORIES: Record<string, SareeCategory> = {
  'Gajji Silks': 'Pure Gajji Silk Sarees',
  'Soft Tissue Silk': 'Soft Silk Tissue Sarees',
};

/** Sample sarees that were removed from the catalogue; dropped from lists saved in browsers. */
export const RETIRED_PRODUCT_IDS = [
  'dv-kanjivaram-royal-crimson',
  'dv-banarasi-emerald-katan',
  'dv-organza-champagne-blush',
  'dv-wedding-royal-jaal-maroon',
  'dv-handloom-chanderi-gold',
  'dv-cotton-maheshwari-regal',
  'dv-designer-georgette-wine',
  'dv-linen-zari-terracotta',
];
