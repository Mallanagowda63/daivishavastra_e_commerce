import React, { createContext, useContext, useState, useEffect } from 'react';
import { SareeProduct, Order, OrderStatus, Booking } from '../types';
import { SEED_ORDERS, SEED_BOOKINGS } from '../data/adminSeed';
import { localISO } from '../components/admin/adminUtils';
import { INITIAL_PRODUCTS } from '../data/products';
import { useToast } from './ToastContext';
import { ADMIN_EMAIL } from '../config/admin';

const ADMIN_SESSION_KEY = 'daivisha_admin_session';

interface AdminContextType {
  products: SareeProduct[];
  orders: Order[];
  addProduct: (product: Omit<SareeProduct, 'id' | 'slug'>) => void;
  updateProductStock: (productId: string, newStock: number) => void;
  updateOrderStatus: (orderId: string, status: OrderStatus) => void;
  createOrder: (orderData: Omit<Order, 'id' | 'orderNumber' | 'date'> & { orderNumber?: string }) => Order;
  getOrderById: (orderIdOrNumber: string) => Order | undefined;
  updateProduct: (productId: string, patch: Partial<SareeProduct>) => void;
  deleteProduct: (productId: string) => void;
  updateOrder: (orderId: string, patch: Partial<Order>) => void;
  addManualOrder: (orderData: Omit<Order, 'id' | 'orderNumber'>) => Order;
  bookings: Booking[];
  addBooking: (booking: Omit<Booking, 'id'>) => void;
  updateBooking: (bookingId: string, patch: Partial<Booking>) => void;
  isAdminOpen: boolean;
  setIsAdminOpen: (open: boolean) => void;
  isAdminAuthenticated: boolean;
  loginAdmin: (email: string) => boolean;
  logoutAdmin: () => void;
}

const INITIAL_ORDERS: Order[] = [
  {
    id: 'ord-1001',
    orderNumber: 'DV-98241',
    date: '2026-10-04',
    items: [
      {
        id: 'dv-kanjivaram-royal-crimson',
        name: 'Royal Kanjivaram Pure Mulberry Silk Saree',
        image: '/images/kanjivaram_silk_saree_1791372743617.jpg',
        price: 28999,
        quantity: 1,
        color: 'Crimson Red',
      },
    ],
    subtotal: 28999,
    discount: 2500,
    shipping: 0,
    total: 26499,
    status: 'Shipped',
    paymentMethod: 'UPI (GPay)',
    shippingAddress: {
      fullName: 'Priya Sundaram',
      phone: '+91 98401 23456',
      addressLine: 'Villa 14, Whispering Palms, Boat Club Road',
      city: 'Chennai',
      state: 'Tamil Nadu',
      pincode: '600028',
    },
    trackingNumber: 'BLUEDART-882910394',
    carrier: 'BlueDart Luxury Express',
    estimatedDelivery: 'Oct 08, 2026',
  },
  {
    id: 'ord-1002',
    orderNumber: 'DV-98242',
    date: '2026-10-06',
    items: [
      {
        id: 'dv-banarasi-emerald-katan',
        name: 'Imperial Emerald Banarasi Katan Silk Saree',
        image: '/images/banarasi_heritage_saree_1791372753729.jpg',
        price: 24500,
        quantity: 1,
        color: 'Emerald Green',
      },
    ],
    subtotal: 24500,
    discount: 0,
    shipping: 0,
    total: 24500,
    status: 'Packed',
    paymentMethod: 'Credit Card (HDFC Infinia)',
    shippingAddress: {
      fullName: 'Aarohi Sen',
      phone: '+91 98300 87654',
      addressLine: 'Flat 8B, Queens Mansion, Park Street',
      city: 'Kolkata',
      state: 'West Bengal',
      pincode: '700016',
    },
    trackingNumber: 'DELHIVERY-549102948',
    carrier: 'Delhivery White Glove',
    estimatedDelivery: 'Oct 10, 2026',
  },
];

const ORDERS_KEY = 'daivisha_orders_v2';
// Catalogue ids this browser has already received, so deleted seed products don't come back.
const SEEN_SEED_KEY = 'daivisha_seen_seed_products';
const BOOKINGS_KEY = 'daivisha_bookings';
const today = () => localISO(new Date());

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export const AdminProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<SareeProduct[]>(() => {
    try {
      const saved = localStorage.getItem('daivisha_products');
      if (!saved) {
        localStorage.setItem(SEEN_SEED_KEY, JSON.stringify(INITIAL_PRODUCTS.map((p) => p.id)));
        return INITIAL_PRODUCTS;
      }
      const list: SareeProduct[] = JSON.parse(saved);
      // Add catalogue items introduced after this browser saved its list (once per item).
      const seen: string[] = JSON.parse(localStorage.getItem(SEEN_SEED_KEY) || '[]');
      const missing = INITIAL_PRODUCTS.filter((p) => !seen.includes(p.id) && !list.some((x) => x.id === p.id));
      localStorage.setItem(SEEN_SEED_KEY, JSON.stringify(INITIAL_PRODUCTS.map((p) => p.id)));
      return missing.length ? [...missing, ...list] : list;
    } catch {
      return INITIAL_PRODUCTS;
    }
  });

  const [orders, setOrders] = useState<Order[]>(() => {
    try {
      const saved = localStorage.getItem(ORDERS_KEY);
      return saved ? JSON.parse(saved) : [...SEED_ORDERS, ...INITIAL_ORDERS];
    } catch {
      return [...SEED_ORDERS, ...INITIAL_ORDERS];
    }
  });

  const [bookings, setBookings] = useState<Booking[]>(() => {
    try {
      const saved = localStorage.getItem(BOOKINGS_KEY);
      return saved ? JSON.parse(saved) : SEED_BOOKINGS;
    } catch {
      return SEED_BOOKINGS;
    }
  });

  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean>(() => {
    try {
      return sessionStorage.getItem(ADMIN_SESSION_KEY) === '1';
    } catch {
      return false;
    }
  });
  const { showToast } = useToast();

  useEffect(() => {
    try {
      localStorage.setItem('daivisha_products', JSON.stringify(products));
    } catch {
      // ignore
    }
  }, [products]);

  useEffect(() => {
    try {
      localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));
    } catch {
      // ignore
    }
  }, [orders]);

  useEffect(() => {
    try {
      localStorage.setItem(BOOKINGS_KEY, JSON.stringify(bookings));
    } catch {
      // ignore
    }
  }, [bookings]);

  const addProduct = (newProdData: Omit<SareeProduct, 'id' | 'slug'>) => {
    const slug = newProdData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const id = `dv-${slug}-${Date.now().toString().slice(-4)}`;
    const product: SareeProduct = {
      ...newProdData,
      id,
      slug,
      updatedAt: today(),
    };
    setProducts((prev) => [product, ...prev]);
    showToast({
      type: 'success',
      title: 'Product Added to Catalog',
      message: `${product.name} is now live in the boutique.`,
    });
  };

  const updateProduct = (productId: string, patch: Partial<SareeProduct>) => {
    setProducts((prev) => prev.map((p) => (p.id === productId ? { ...p, ...patch, updatedAt: today() } : p)));
  };

  const deleteProduct = (productId: string) => {
    const removed = products.find((p) => p.id === productId);
    setProducts((prev) => prev.filter((p) => p.id !== productId));
    if (removed) {
      showToast({ type: 'info', title: 'Saree deleted', message: `${removed.name} was removed from the catalogue.` });
    }
  };

  const updateOrder = (orderId: string, patch: Partial<Order>) => {
    setOrders((prev) => prev.map((o) => (o.id === orderId ? { ...o, ...patch } : o)));
  };

  const addManualOrder = (orderData: Omit<Order, 'id' | 'orderNumber'>): Order => {
    const highest = orders.reduce((max, o) => {
      const n = parseInt(o.orderNumber.replace(/\D/g, ''), 10);
      return n < 90000 && n > max ? n : max;
    }, 1000);
    const newOrder: Order = { ...orderData, id: `ord-${Date.now()}`, orderNumber: `DV-${highest + 1}` };
    setOrders((prev) => [newOrder, ...prev]);
    setProducts((prev) =>
      prev.map((p) => {
        const item = orderData.items.find((i) => i.id === p.id);
        return item ? { ...p, stock: Math.max(0, p.stock - item.quantity) } : p;
      })
    );
    showToast({ type: 'success', title: 'Order Added', message: `${newOrder.orderNumber} has been recorded.` });
    return newOrder;
  };

  const addBooking = (booking: Omit<Booking, 'id'>) => {
    setBookings((prev) => [{ ...booking, id: `bk-${Date.now()}` }, ...prev]);
    showToast({ type: 'success', title: 'Booking Added', message: `${booking.service} for ${booking.customerName}.` });
  };

  const updateBooking = (bookingId: string, patch: Partial<Booking>) => {
    setBookings((prev) => prev.map((b) => (b.id === bookingId ? { ...b, ...patch } : b)));
  };

  const updateProductStock = (productId: string, newStock: number) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === productId ? { ...p, stock: Math.max(0, newStock), updatedAt: today() } : p))
    );
    showToast({
      type: 'info',
      title: 'Inventory Updated',
      message: `Stock level updated to ${newStock}.`,
    });
  };

  const updateOrderStatus = (orderId: string, status: OrderStatus) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status } : o))
    );
    showToast({
      type: 'success',
      title: 'Order Status Changed',
      message: `Order status transitioned to ${status}.`,
    });
  };

  const createOrder = (orderData: Omit<Order, 'id' | 'orderNumber' | 'date'> & { orderNumber?: string }): Order => {
    const orderNumber = orderData.orderNumber ?? `DV-${Math.floor(10000 + Math.random() * 90000)}`;
    const newOrder: Order = {
      ...orderData,
      id: `ord-${Date.now()}`,
      orderNumber,
      date: today(),
      // Website orders pay by UPI and stay "Pending" until the store confirms the money arrived.
      ...(orderData.paymentStatus ? {} : { paymentStatus: 'Paid' as const, paymentDate: new Date().toISOString() }),
    };

    setOrders((prev) => [newOrder, ...prev]);

    // Decrease product stock
    setProducts((prev) =>
      prev.map((p) => {
        const item = orderData.items.find((i) => i.id === p.id);
        if (item) {
          return { ...p, stock: Math.max(0, p.stock - item.quantity) };
        }
        return p;
      })
    );

    return newOrder;
  };

  const loginAdmin = (email: string) => {
    const ok = email.trim().toLowerCase() === ADMIN_EMAIL.toLowerCase();
    if (ok) {
      setIsAdminAuthenticated(true);
      try {
        sessionStorage.setItem(ADMIN_SESSION_KEY, '1');
      } catch {
        // ignore
      }
    }
    return ok;
  };

  const logoutAdmin = () => {
    setIsAdminAuthenticated(false);
    setIsAdminOpen(false);
    try {
      sessionStorage.removeItem(ADMIN_SESSION_KEY);
    } catch {
      // ignore
    }
  };

  const getOrderById = (orderIdOrNumber: string) => {
    const q = orderIdOrNumber.trim().toUpperCase();
    return orders.find(
      (o) => o.id.toUpperCase() === q || o.orderNumber.toUpperCase() === q || o.trackingNumber.toUpperCase() === q
    );
  };

  return (
    <AdminContext.Provider
      value={{
        products,
        orders,
        addProduct,
        updateProductStock,
        updateOrderStatus,
        createOrder,
        getOrderById,
        updateProduct,
        deleteProduct,
        updateOrder,
        addManualOrder,
        bookings,
        addBooking,
        updateBooking,
        isAdminOpen,
        setIsAdminOpen,
        isAdminAuthenticated,
        loginAdmin,
        logoutAdmin,
      }}
    >
      {children}
    </AdminContext.Provider>
  );
};

export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error('useAdmin must be used within AdminProvider');
  }
  return context;
};
