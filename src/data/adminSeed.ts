import { Booking, Order, OrderStatus, PaymentStatus } from '../types';

const IMG = '/images';

const SAREES = {
  kanjivaram: { id: 'dv-kanjivaram-royal-crimson', name: 'Royal Kanjivaram Pure Mulberry Silk Saree', price: 28999, image: `${IMG}/kanjivaram_silk_saree_1791372743617.jpg` },
  banarasi: { id: 'dv-banarasi-emerald-katan', name: 'Imperial Emerald Banarasi Katan Silk Saree', price: 24500, image: `${IMG}/banarasi_heritage_saree_1791372753729.jpg` },
  organza: { id: 'dv-organza-champagne-blush', name: 'Blush Champagne Handcrafted Organza Silk Saree', price: 15800, image: `${IMG}/organza_pastel_saree_1791372764937.jpg` },
  bridal: { id: 'dv-wedding-royal-jaal-maroon', name: 'Sultana Heritage Maroon Zardozi Bridal Saree', price: 39500, image: `${IMG}/wedding_edit_banner_1791372730952.jpg` },
  chanderi: { id: 'dv-handloom-chanderi-gold', name: 'Celestial Ivory Chanderi Tissue Silk Saree', price: 13999, image: `${IMG}/hero_saree_model_1791372718962.jpg` },
  cotton: { id: 'dv-cotton-maheshwari-regal', name: 'Royal Blue Handloom Cotton Silk Saree', price: 6899, image: `${IMG}/banarasi_heritage_saree_1791372753729.jpg` },
  georgette: { id: 'dv-designer-georgette-wine', name: 'Vintage Wine Chikankari Designer Georgette Saree', price: 19499, image: `${IMG}/hero_saree_model_1791372718962.jpg` },
  linen: { id: 'dv-linen-zari-terracotta', name: 'Artisan 100-Count Handspun Pure Linen Saree', price: 8750, image: `${IMG}/organza_pastel_saree_1791372764937.jpg` },
};

type SeedRow = [
  num: number,
  date: string,
  saree: keyof typeof SAREES,
  qty: number,
  name: string,
  phone: string,
  city: string,
  state: string,
  status: OrderStatus,
  method: string,
  payment?: PaymentStatus,
];

const ROWS: SeedRow[] = [
  [1031, '2026-10-01', 'cotton', 1, 'Lakshmi Iyer', '+91 98450 21031', 'Bengaluru', 'Karnataka', 'Delivered', 'UPI (PhonePe)'],
  [1032, '2026-10-02', 'chanderi', 1, 'Nandini Rao', '+91 99001 21032', 'Hyderabad', 'Telangana', 'Delivered', 'Credit Card'],
  [1033, '2026-10-03', 'linen', 2, 'Sneha Kulkarni', '+91 98220 21033', 'Pune', 'Maharashtra', 'Delivered', 'UPI (GPay)'],
  [1034, '2026-10-04', 'banarasi', 1, 'Divya Menon', '+91 94470 21034', 'Kochi', 'Kerala', 'Delivered', 'Cash on Delivery (COD)'],
  [1035, '2026-10-05', 'organza', 1, 'Pooja Shah', '+91 98250 21035', 'Surat', 'Gujarat', 'Delivered', 'UPI (GPay)'],
  [1036, '2026-10-06', 'georgette', 1, 'Aditi Verma', '+91 98100 21036', 'New Delhi', 'Delhi', 'Delivered', 'Debit Card'],
  [1037, '2026-10-07', 'kanjivaram', 1, 'Revathi Krishnan', '+91 98400 21037', 'Chennai', 'Tamil Nadu', 'Delivered', 'UPI (Paytm)'],
  [1038, '2026-10-08', 'cotton', 2, 'Swati Joshi', '+91 98920 21038', 'Mumbai', 'Maharashtra', 'Delivered', 'Cash on Delivery (COD)'],
  [1039, '2026-10-09', 'bridal', 1, 'Meenakshi Pillai', '+91 94460 21039', 'Thiruvananthapuram', 'Kerala', 'Shipped', 'Credit Card'],
  [1040, '2026-10-10', 'chanderi', 1, 'Anjali Gupta', '+91 98290 21040', 'Jaipur', 'Rajasthan', 'Shipped', 'UPI (GPay)'],
  [1041, '2026-10-10', 'linen', 1, 'Harini Reddy', '+91 99490 21041', 'Visakhapatnam', 'Andhra Pradesh', 'Delivered', 'UPI (PhonePe)'],
  [1042, '2026-10-11', 'organza', 1, 'Tanvi Desai', '+91 98240 21042', 'Ahmedabad', 'Gujarat', 'Out for Delivery', 'Debit Card'],
  [1043, '2026-10-11', 'cotton', 1, 'Ishita Sen', '+91 98310 21043', 'Kolkata', 'West Bengal', 'Cancelled', 'UPI (GPay)', 'Refunded'],
  [1044, '2026-10-11', 'georgette', 1, 'Priya Nair', '+91 98470 21044', 'Kochi', 'Kerala', 'Delivered', 'UPI (GPay)'],
  [1045, '2026-10-12', 'linen', 1, 'Kavya Rao', '+91 98860 21045', 'Bengaluru', 'Karnataka', 'Delivered', 'Cash on Delivery (COD)'],
  [1046, '2026-10-12', 'chanderi', 1, 'Riya Patel', '+91 98790 21046', 'Ahmedabad', 'Gujarat', 'Pending', 'Cash on Delivery (COD)'],
  [1047, '2026-10-13', 'kanjivaram', 1, 'Meera Iyer', '+91 97890 21047', 'Chennai', 'Tamil Nadu', 'Shipped', 'UPI (GPay)'],
  [1048, '2026-10-13', 'banarasi', 1, 'Ananya Sharma', '+91 98200 21048', 'Mumbai', 'Maharashtra', 'Confirmed', 'UPI (PhonePe)'],
];

const addDays = (iso: string, days: number) => {
  const d = new Date(`${iso}T00:00:00`);
  d.setDate(d.getDate() + days);
  return d.toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' });
};

export const SEED_ORDERS: Order[] = ROWS.map(
  ([num, date, key, qty, name, phone, city, state, status, method, payment]) => {
    const saree = SAREES[key];
    const subtotal = saree.price * qty;
    return {
      id: `ord-${num}`,
      orderNumber: `DV-${num}`,
      date,
      items: [{ id: saree.id, name: saree.name, image: saree.image, price: saree.price, quantity: qty }],
      subtotal,
      discount: 0,
      shipping: 0,
      total: subtotal,
      status,
      paymentMethod: method,
      ...(payment ? { paymentStatus: payment } : {}),
      shippingAddress: { fullName: name, phone, addressLine: '', city, state, pincode: '' },
      trackingNumber: `DV-TRK-${num}`,
      carrier: 'BlueDart',
      estimatedDelivery: addDays(date, 5),
    };
  }
).reverse();

export const SEED_BOOKINGS: Booking[] = [
  { id: 'bk-201', customerName: 'Ananya Sharma', phone: '+91 98200 21048', service: 'Bridal consultation', date: '2026-10-14', time: '11:00', status: 'Confirmed', notes: 'Wedding in December — looking at Kanjivaram and Banarasi.' },
  { id: 'bk-202', customerName: 'Meera Iyer', phone: '+91 97890 21047', service: 'Saree styling', date: '2026-10-14', time: '14:00', status: 'Pending' },
  { id: 'bk-203', customerName: 'Kavya Rao', phone: '+91 98860 21045', service: 'Video call', date: '2026-10-16', time: '17:30', status: 'Confirmed' },
  { id: 'bk-204', customerName: 'Shalini Bose', phone: '+91 98300 22204', service: 'Store visit', date: '2026-10-18', time: '12:00', status: 'Pending', notes: 'Bringing mother; wants festive silks.' },
  { id: 'bk-205', customerName: 'Priya Nair', phone: '+91 98470 21044', service: 'Saree styling', date: '2026-10-10', time: '15:00', status: 'Completed' },
];
