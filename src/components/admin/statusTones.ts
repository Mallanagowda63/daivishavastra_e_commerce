import { BookingStatus, OrderStatus, PaymentStatus, ProductStatus } from '../../types';
import type { Tone } from './adminUi';

export const fulfilmentTone = (s: OrderStatus): Tone =>
  s === 'Delivered' ? 'green' : s === 'Cancelled' ? 'grey' : s === 'Pending' ? 'amber' : s === 'Shipped' || s === 'Out for Delivery' ? 'blue' : 'maroon';

export const paymentTone = (s: PaymentStatus): Tone => (s === 'Paid' ? 'green' : s === 'Pending' ? 'amber' : 'grey');

export const bookingTone = (s: BookingStatus): Tone =>
  s === 'Confirmed' ? 'green' : s === 'Pending' ? 'amber' : s === 'Completed' ? 'blue' : 'grey';

export const productTone = (s: ProductStatus): Tone => (s === 'published' ? 'green' : s === 'draft' ? 'amber' : 'grey');

export const PRODUCT_STATUS_LABEL: Record<ProductStatus, string> = { published: 'Published', draft: 'Draft', archived: 'Archived' };
