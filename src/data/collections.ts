import { Feather, Flower2, Gem, Sparkles, MapPin, Scroll, Sun, Wind, Droplets, Palette } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { SareeCategory } from '../types';

export interface CollectionInfo {
  key: SareeCategory;
  title: string;
  subtitle: string;
  description: string;
  /** Large photo beside the intro on the collection page. */
  heroImage: string;
  /** Fabric close-up used on the home page arch card. */
  cardImage: string;
  highlights: { icon: LucideIcon; label: string }[];
  heritage: { title: string; text: string; points: { icon: LucideIcon; label: string }[] };
}

/** The collections shown on the home page, in display order. */
export const COLLECTIONS: CollectionInfo[] = [
  {
    key: 'Pure Gajji Silk Sarees',
    title: 'Pure Gajji Silk',
    subtitle: 'A heritage weave of Gujarat & Rajasthan',
    description:
      'Gajji silk is a traditional, high-gloss satin-weave fabric heavily associated with the heritage occasion wear of Gujarat and Rajasthan. Known for its smooth texture, rich sheen and graceful drape, it brings together timeless tradition and royal elegance — perfect for festive celebrations and special occasions.',
    heroImage: '/images/collection_gajji_hero.jpg',
    cardImage: '/images/swatch_gajji.jpg',
    highlights: [
      { icon: Feather, label: 'Rich Satin Weave' },
      { icon: Flower2, label: 'Lightweight & Graceful Drape' },
      { icon: Gem, label: 'Perfect for Festive Occasions' },
      { icon: Sparkles, label: 'A Heritage Handloom Favourite' },
    ],
    heritage: {
      title: 'Crafted in Heritage',
      text: 'Woven with age-old techniques and celebrated in the royal wardrobes of Gujarat and Rajasthan, Gajji silk reflects the rich textile legacy of India. Its lustrous finish, smooth feel and elegant fall make it a treasured choice for weddings, festivals and special occasions — a perfect blend of tradition and timeless beauty.',
      points: [
        { icon: MapPin, label: 'Heritage Weave of Gujarat & Rajasthan' },
        { icon: Scroll, label: 'High-Gloss Satin Texture' },
        { icon: Flower2, label: 'Elegant & Timeless Appeal' },
        { icon: Sparkles, label: 'Ideal for Weddings & Festive Wear' },
      ],
    },
  },
  {
    key: 'Cotton Boutique Work Sarees',
    title: 'Cotton Boutique Work',
    subtitle: 'Everyday elegance in breathable cotton',
    description:
      'Soft, breathable and easy to drape, our cotton sarees bring traditional prints and woven borders to everyday wear — comfortable from morning to evening, and graceful for every occasion.',
    heroImage: '/images/swatch_cotton.jpg',
    cardImage: '/images/swatch_cotton.jpg',
    highlights: [
      { icon: Wind, label: 'Light & Breathable' },
      { icon: Sun, label: 'Comfortable All Day' },
      { icon: Palette, label: 'Traditional Prints' },
      { icon: Flower2, label: 'Easy to Drape' },
    ],
    heritage: {
      title: 'Woven for Every Day',
      text: 'Cotton has been woven across India for centuries. Our cotton sarees carry that tradition into modern wardrobes — simple to care for, lovely to wear, and full of colour.',
      points: [
        { icon: Wind, label: 'Breathable Comfort' },
        { icon: Palette, label: 'Classic Prints & Borders' },
        { icon: Droplets, label: 'Easy Care' },
        { icon: Sun, label: 'Perfect for Daily Wear' },
      ],
    },
  },
  {
    key: 'Soft Silk Tissue Sarees',
    title: 'Soft Silk Tissue',
    subtitle: 'Light, luminous and made to shimmer',
    description:
      'Soft tissue silk combines a delicate, airy feel with a luminous metallic sheen. Light to wear and lovely in every light, it is a radiant choice for weddings, receptions and evening celebrations.',
    heroImage: '/images/swatch_soft_tissue.jpg',
    cardImage: '/images/swatch_soft_tissue.jpg',
    highlights: [
      { icon: Sparkles, label: 'Luminous Sheen' },
      { icon: Feather, label: 'Airy & Lightweight' },
      { icon: Gem, label: 'Wedding & Reception Wear' },
      { icon: Flower2, label: 'Graceful Drape' },
    ],
    heritage: {
      title: 'Woven to Shine',
      text: 'Tissue silk weaves fine metallic threads into silk for a gentle glow. Soft to the touch and light on the shoulder, it brings quiet glamour to every celebration.',
      points: [
        { icon: Sparkles, label: 'Metallic Glow' },
        { icon: Feather, label: 'Featherlight Feel' },
        { icon: Flower2, label: 'Elegant Fall' },
        { icon: Gem, label: 'For Special Occasions' },
      ],
    },
  },
];

export const findCollection = (key: string) => COLLECTIONS.find((c) => c.key === key);
