export interface CategoryCardData {
  title: string;
  categoryKey: string;
  count: string;
  tagline: string;
  image: string;
}

export const CATEGORY_CARDS: CategoryCardData[] = [
  {
    title: 'Kanjivaram Sarees',
    categoryKey: 'Kanjivaram Sarees',
    count: '24 Curated Weaves',
    tagline: 'Pure mulberry silk with heirloom korvai temple borders',
    image: '/images/kanjivaram_silk_saree_1791372743617.jpg',
  },
  {
    title: 'Banarasi Silks',
    categoryKey: 'Banarasi Sarees',
    count: '32 Regal Designs',
    tagline: 'Timeless Kadwa and Katan brocades crafted by Varanasi karigars',
    image: '/images/banarasi_heritage_saree_1791372753729.jpg',
  },
  {
    title: 'Pure Silk Sarees',
    categoryKey: 'Silk Sarees',
    count: '48 Masterpieces',
    tagline: 'Lustrous, authentic silks woven for life’s grandest milestones',
    image: '/images/hero_saree_model_1791372718962.jpg',
  },
  {
    title: 'Organza Sarees',
    categoryKey: 'Organza Sarees',
    count: '18 Ethereal Pieces',
    tagline: 'Featherlight sheer elegance with delicate hand-embroidery',
    image: '/images/organza_pastel_saree_1791372764937.jpg',
  },
  {
    title: 'Cotton Silk & Maheshwari',
    categoryKey: 'Cotton Sarees',
    count: '26 Handlooms',
    tagline: 'Effortless dignity and breathability for boardroom and daywear',
    image: '/images/banarasi_heritage_saree_1791372753729.jpg',
  },
  {
    title: 'Designer Couture',
    categoryKey: 'Designer Sarees',
    count: '15 Exclusive Pieces',
    tagline: 'Contemporary silhouettes with traditional hand zardozi accents',
    image: '/images/wedding_edit_banner_1791372730952.jpg',
  },
];

export const OCCASIONS_DATA = [
  {
    id: 'occ-wedding',
    name: 'Wedding',
    subtitle: 'Grand Bridal & Muhurtham Elegance',
    count: '45+ Pieces',
    image: '/images/wedding_edit_banner_1791372730952.jpg',
  },
  {
    id: 'occ-festive',
    name: 'Festive',
    subtitle: 'Diwali, Dussehra & Sacred Celebrations',
    count: '60+ Pieces',
    image: '/images/banarasi_heritage_saree_1791372753729.jpg',
  },
  {
    id: 'occ-party',
    name: 'Party',
    subtitle: 'Cocktails, Receptions & Modern Soirees',
    count: '30+ Pieces',
    image: '/images/organza_pastel_saree_1791372764937.jpg',
  },
  {
    id: 'occ-office',
    name: 'Office Wear',
    subtitle: 'Structured Cottons & Subtle Linens',
    count: '24+ Pieces',
    image: '/images/hero_saree_model_1791372718962.jpg',
  },
  {
    id: 'occ-traditional',
    name: 'Traditional',
    subtitle: 'Puja, Temple Visits & Cultural Rituals',
    count: '40+ Pieces',
    image: '/images/kanjivaram_silk_saree_1791372743617.jpg',
  },
  {
    id: 'occ-daily',
    name: 'Daily Elegance',
    subtitle: 'Understated Luxury for Every Sunrise',
    count: '20+ Pieces',
    image: '/images/organza_pastel_saree_1791372764937.jpg',
  },
];
