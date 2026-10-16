export type SareeCategory =
  | 'Soft Silk Tissue Sarees'
  | 'Cotton Boutique Work Sarees'
  | 'Pure Gajji Silk Sarees'
  | 'Soft Silk Paithani Sarees'
  | 'Fancy Sarees'
  | 'Banarasi Georgette Sarees'
  | 'Linen Cotton Mirror Work Sarees'
  | 'Chinnon Sarees'
  | 'Warm Silk Sarees with Ikat Border'
  | 'Kalamkari Sarees with Bentex Border';

export type SareeCollection = 
  | 'Wedding Collection'
  | 'Festive Collection'
  | 'Office Wear'
  | 'Party Wear'
  | 'Daily Wear'
  | 'Luxury Collection'
  | 'The Heritage Edit';

export type SareeOccasion = 
  | 'Wedding'
  | 'Festive'
  | 'Party'
  | 'Office Wear'
  | 'Traditional'
  | 'Daily Elegance';

export type SareeFabric = 
  | 'Pure Silk'
  | 'Kanjivaram Silk'
  | 'Banarasi Katan Silk'
  | 'Cotton Silk'
  | 'Organza'
  | 'Chanderi Silk'
  | 'Georgette'
  | 'Pure Linen'
  | 'Tussar Silk'
  | 'Gajji Silk';

export interface ProductColorVariant {
  name: string;
  hex: string;
  image: string;
}

export type ProductStatus = 'published' | 'draft' | 'archived';

export interface SareeProduct {
  id: string;
  name: string;
  slug: string;
  sku: string;
  category: SareeCategory;
  collection: SareeCollection;
  occasion: SareeOccasion[];
  fabric: SareeFabric;
  color: string;
  colorVariants?: ProductColorVariant[];
  originalPrice: number;
  sellingPrice: number;
  discountPercentage: number;
  images: string[];
  secondaryImage?: string;
  isNewArrival?: boolean;
  isBestSeller?: boolean;
  isLimitedEdition?: boolean;
  stock: number;
  /** Visibility in the storefront; missing means published. */
  status?: ProductStatus;
  updatedAt?: string;
  rating: number;
  reviewCount: number;
  description: string;
  story: string;
  details: {
    fabric: string;
    sareeLength: string;
    blousePiece: string;
    work: string;
    border: string;
    palluDetails: string;
    washCare: string;
    countryOfOrigin: string;
  };
  stylingTips: string[];
  matchingAccessories?: {
    name: string;
    type: string;
    price: number;
  }[];
}

export interface CartItem {
  product: SareeProduct;
  selectedColor?: string;
  quantity: number;
  includeGiftWrap?: boolean;
}

export interface Coupon {
  code: string;
  discountPercentage?: number;
  discountAmount?: number;
  minimumOrder: number;
  description: string;
  /** ISO date-time; missing means it never expires. */
  expiresAt?: string;
  /** Missing means active. */
  active?: boolean;
  /** Shown in the top announcement bar. */
  featured?: boolean;
}

export interface OrderItem {
  id: string;
  name: string;
  image: string;
  price: number;
  quantity: number;
  color?: string;
}

export type OrderStatus = 
  | 'Pending'
  | 'Confirmed'
  | 'Packed'
  | 'Shipped'
  | 'Out for Delivery'
  | 'Delivered'
  | 'Cancelled';

export type PaymentStatus = 'Paid' | 'Pending' | 'Refunded';

export interface Order {
  id: string;
  orderNumber: string;
  date: string;
  items: OrderItem[];
  subtotal: number;
  discount: number;
  shipping: number;
  total: number;
  status: OrderStatus;
  paymentMethod: string;
  /** Email of the customer who placed the order on the website. */
  customerEmail?: string;
  /** Missing means derived: COD orders are pending until delivered, cancelled are refunded. */
  paymentStatus?: PaymentStatus;
  paymentDate?: string;
  shippingAddress: {
    fullName: string;
    phone: string;
    addressLine: string;
    city: string;
    state: string;
    pincode: string;
  };
  trackingNumber: string;
  carrier: string;
  estimatedDelivery: string;
}

export interface CustomerReview {
  id: string;
  customerName: string;
  rating: number;
  verifiedBuyer: boolean;
  productName: string;
  comment: string;
  city: string;
  date: string;
}

export interface FilterState {
  categories: SareeCategory[];
  collections: SareeCollection[];
  fabrics: SareeFabric[];
  occasions: SareeOccasion[];
  priceRange: [number, number];
  inStockOnly: boolean;
  searchQuery: string;
  sortBy: 'featured' | 'newest' | 'price-low' | 'price-high' | 'best-selling';
}

export type BookingService = 'Bridal consultation' | 'Saree styling' | 'Video call' | 'Store visit';
export type BookingStatus = 'Pending' | 'Confirmed' | 'Completed' | 'Cancelled';

export interface Booking {
  id: string;
  customerName: string;
  phone: string;
  service: BookingService;
  date: string; // YYYY-MM-DD
  time: string; // HH:MM (24h, IST)
  status: BookingStatus;
  notes?: string;
}
