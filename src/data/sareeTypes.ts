import { SareeCategory } from '../types';

/** The saree types Daivisha Vastra sells, in menu order. Shown in the Sarees menu, shop chips, filters and admin. */
export interface SareeType {
  name: SareeCategory;
  /** Short display title, as in the collection guide. */
  title: string;
  desc: string;
  origin: string;
  roots: string;
}

/** The saree types Daivisha Vastra sells, in menu order, with their heritage notes. */
export const SAREE_TYPES: SareeType[] = [
  {
    name: 'Soft Silk Tissue Sarees',
    title: 'Soft Silk Tissue Sarees',
    desc: 'Soft silk with a gentle tissue sheen',
    origin: 'Tissue silk styles are part of India’s broader silk-and-zari tradition, valued for their luminous, light-catching finish. This is a contemporary style category rather than a single region-specific weave.',
    roots: 'Inspired by India’s silk and zari traditions',
  },
  {
    name: 'Cotton Boutique Work Sarees',
    title: 'Cotton Boutique Work Saree',
    desc: 'Breathable cotton with boutique work',
    origin: 'Cotton sarees have a long history across India, with regional weaving traditions from Bengal to Tamil Nadu and beyond. “Boutique work” describes the decorative finish, which can vary by maker and design.',
    roots: 'Indian cotton textile traditions; finish varies',
  },
  {
    name: 'Pure Gajji Silk Sarees',
    title: 'Pure Gajji Silk',
    desc: 'High-gloss satin weave of Gujarat & Rajasthan',
    origin: 'Gajji silk is associated with western India, especially Gujarat and Rajasthan, where glossy satin-like silk textiles have long been prized for festive dress. Its rich sheen makes it a statement occasion drape.',
    roots: 'Gujarat and Rajasthan textile traditions',
  },
  {
    name: 'Soft Silk Paithani Sarees',
    title: 'Soft Silk Paithani Saree',
    desc: 'Paithani motifs and borders on soft silk',
    origin: 'Paithani originated in Paithan, Maharashtra, and is celebrated for silk weaving, rich colours and intricate zari motifs. Traditional designs often feature peacocks, flowers and other symbolic forms.',
    roots: 'Paithan, Maharashtra',
  },
  {
    name: 'Fancy Sarees',
    title: 'Fancy Saree',
    desc: 'Contemporary designs for parties and celebrations',
    origin: '“Fancy saree” is a modern retail category, not one historic regional weave. It brings together contemporary fabrics, embellishments and design trends inspired by many parts of India.',
    roots: 'Contemporary Indian occasion wear; styles vary',
  },
  {
    name: 'Banarasi Georgette Sarees',
    title: 'Banarasi Georgette Saree',
    desc: 'Flowing georgette with Banarasi weaving',
    origin: 'Banarasi textile heritage developed in and around Varanasi, Uttar Pradesh, famed for brocades and ornate motifs. Georgette versions adapt the Banarasi look to a lighter, fluid fabric.',
    roots: 'Varanasi (Banaras), Uttar Pradesh',
  },
  {
    name: 'Linen Cotton Mirror Work Sarees',
    title: 'Linen Cotton Mirror Work Saree',
    desc: 'Linen cotton finished with mirror work',
    origin: 'Linen-cotton blends are a modern fabric combination, while mirror-work embroidery is strongly associated with Kutch and Saurashtra in Gujarat. The reflective details bring a folk-art influence to a contemporary drape.',
    roots: 'Mirror-work inspiration: Kutch and Saurashtra, Gujarat',
  },
  {
    name: 'Chinnon Sarees',
    title: 'Chinnon Saree',
    desc: 'Light, flowing chinnon with a soft sheen',
    origin: 'Chinnon is used in modern Indian occasion wear for its light, flowing drape; it is a fabric category rather than a single regional saree tradition. Designs and manufacturing origins can vary by supplier.',
    roots: 'Contemporary Indian occasion wear; origin varies by fabric source',
  },
  {
    name: 'Warm Silk Sarees with Ikat Border',
    title: 'Warm Silk with Ikat Border',
    desc: 'Warm silk paired with an ikat border',
    origin: 'Ikat is a resist-dyeing tradition found in several regions, including Odisha, Telangana and Gujarat. A silk saree with an ikat border combines this distinctive patterned tradition with a modern silk styling.',
    roots: 'Ikat traditions of Odisha, Telangana and Gujarat',
  },
  {
    name: 'Kalamkari Sarees with Bentex Border',
    title: 'Kalamkari with Bentex Border',
    desc: 'Kalamkari prints with a Bentex border',
    origin: 'Kalamkari is a traditional painted or printed textile art associated especially with Andhra Pradesh, including Srikalahasti and Machilipatnam. A Bentex border is a contemporary embellishment and should not be confused with the historical Kalamkari craft.',
    roots: 'Andhra Pradesh; Srikalahasti and Machilipatnam traditions',
  },
];

export const findSareeType = (name: string) => SAREE_TYPES.find((t) => t.name === name);

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
