import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { SareeProduct, Order, OrderStatus, Booking, Coupon } from '../types';
import { INITIAL_PRODUCTS } from '../data/products';
import { useToast } from './ToastContext';
import { api, getToken, onUnauthorized, reportError, setToken } from '../lib/api';
import { hydrateBanners } from '../data/bannerStore';
import { hydrateCoupons } from '../data/couponStore';
import { Review, hydrateReviews } from '../data/reviewStore';

// Store data now lives in the MongoDB database behind /api. The website loads the catalog on start;
// the admin's orders and bookings are loaded once the admin signs in.

type NewOrder = Omit<Order, 'id' | 'orderNumber' | 'date' | 'items'> & {
  date?: string;
  orderNumber?: string;
  couponCode?: string;
  paymentReference?: string;
  items: (Order['items'][number] & { includeGiftWrap?: boolean })[];
};

interface AdminContextType {
  products: SareeProduct[];
  /** False until the catalog has arrived from the database. */
  catalogLoaded: boolean;
  /** Admin: all orders. Customers: orders placed from this browser. */
  orders: Order[];
  addProduct: (product: Omit<SareeProduct, 'id' | 'slug'>) => Promise<void>;
  updateProductStock: (productId: string, newStock: number) => void;
  updateOrderStatus: (orderId: string, status: OrderStatus) => void;
  createOrder: (orderData: NewOrder) => Promise<Order>;
  getOrderById: (orderIdOrNumber: string) => Order | undefined;
  updateProduct: (productId: string, patch: Partial<SareeProduct>) => Promise<void>;
  deleteProduct: (productId: string) => void;
  updateOrder: (orderId: string, patch: Partial<Order>) => void;
  addManualOrder: (orderData: Omit<NewOrder, 'orderNumber'>) => Promise<Order | null>;
  bookings: Booking[];
  addBooking: (booking: Omit<Booking, 'id'>) => void;
  updateBooking: (bookingId: string, patch: Partial<Booking>) => void;
  isAdminOpen: boolean;
  setIsAdminOpen: (open: boolean) => void;
  isAdminAuthenticated: boolean;
  /** Returns an error message, or null when signed in. */
  loginAdmin: (email: string, password: string) => Promise<string | null>;
  logoutAdmin: () => void;
  changeAdminPassword: (current: string, next: string) => Promise<string | null>;
  /** Fetch the latest status of the customer's own orders (account page). */
  refreshMyOrders: () => void;
}

const MY_ORDERS_KEY = 'daivisha_my_orders';
const loadMyOrders = (): Order[] => {
  try {
    return JSON.parse(localStorage.getItem(MY_ORDERS_KEY) || '[]');
  } catch {
    return [];
  }
};

const slugify = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export const AdminProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { showToast } = useToast();
  // Built-in sarees show instantly; the database list replaces them as soon as it loads.
  const [products, setProducts] = useState<SareeProduct[]>(INITIAL_PRODUCTS);
  const [catalogLoaded, setCatalogLoaded] = useState(false);
  const [adminOrders, setAdminOrders] = useState<Order[]>([]);
  const [myOrders, setMyOrders] = useState<Order[]>(loadMyOrders);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(() => getToken() !== '');

  const loadCatalog = useCallback(async () => {
    try {
      const data = await api<{ products: SareeProduct[]; banners: Record<string, string>; coupons: Coupon[]; reviews: Review[] }>('catalog');
      setProducts(data.products);
      hydrateBanners(data.banners);
      hydrateCoupons(data.coupons);
      hydrateReviews(data.reviews);
    } catch {
      // Store database unreachable: keep showing the built-in sarees.
    } finally {
      setCatalogLoaded(true);
    }
  }, []);

  const loadAdminData = useCallback(async () => {
    try {
      const data = await api<{ orders: Order[]; bookings: Booking[] }>('admin.data');
      setAdminOrders(data.orders);
      setBookings(data.bookings);
    } catch (e) {
      reportError(e);
    }
  }, []);

  // Catalog on start; again (with drafts, hidden reviews, all coupons) whenever the admin signs in or out.
  useEffect(() => {
    loadCatalog();
    if (isAdminAuthenticated) loadAdminData();
  }, [isAdminAuthenticated, loadCatalog, loadAdminData]);

  useEffect(
    () =>
      onUnauthorized(() => {
        setIsAdminAuthenticated(false);
        showToast({ type: 'info', title: 'Admin session ended', message: 'Please sign in again.' });
      }),
    [showToast]
  );

  // Customer's own orders: update status / tracking from the database (the admin may have changed them).
  const refreshMyOrders = useCallback(async () => {
    const ids = loadMyOrders().map((o) => o.id);
    if (!ids.length) return;
    try {
      const { orders: live } = await api<{ orders: Partial<Order>[] }>('orders.status', { ids });
      setMyOrders((prev) =>
        prev.flatMap((o) => {
          const l = live.find((x) => x.id === o.id);
          return l ? [{ ...o, ...l }] : []; // orders no longer in the store are removed
        })
      );
    } catch {
      // offline: keep showing the last known status
    }
  }, []);

  useEffect(() => {
    refreshMyOrders();
  }, [refreshMyOrders]);

  useEffect(() => {
    try {
      localStorage.setItem(MY_ORDERS_KEY, JSON.stringify(myOrders.slice(0, 50)));
    } catch {
      // ignore
    }
  }, [myOrders]);

  // ── products ──
  const saveProduct = async (p: SareeProduct) => {
    const saved = await api<SareeProduct>('product.save', p);
    setProducts((prev) => (prev.some((x) => x.id === saved.id) ? prev.map((x) => (x.id === saved.id ? saved : x)) : [saved, ...prev]));
  };

  const addProduct = async (data: Omit<SareeProduct, 'id' | 'slug'>) => {
    let slug = slugify(data.name) || 'saree';
    if (products.some((p) => p.slug === slug)) slug = `${slug}-${Date.now().toString(36).slice(-4)}`;
    const product: SareeProduct = { ...data, id: `dv-${slug}`, slug };
    try {
      await saveProduct(product);
      showToast({ type: 'success', title: 'Saree added', message: `${product.name} is saved to your store.` });
    } catch (e) {
      reportError(e);
      throw e;
    }
  };

  const updateProduct = async (productId: string, patch: Partial<SareeProduct>) => {
    const current = products.find((p) => p.id === productId);
    if (!current) return;
    try {
      await saveProduct({ ...current, ...patch, id: productId });
    } catch (e) {
      reportError(e);
      throw e;
    }
  };

  const updateProductStock = (productId: string, newStock: number) => {
    updateProduct(productId, { stock: Math.max(0, newStock) })
      .then(() => showToast({ type: 'info', title: 'Stock updated', message: `Stock is now ${Math.max(0, newStock)}.` }))
      .catch(() => {});
  };

  const deleteProduct = (productId: string) => {
    const removed = products.find((p) => p.id === productId);
    api('product.delete', { id: productId })
      .then(() => {
        setProducts((prev) => prev.filter((p) => p.id !== productId));
        if (removed) showToast({ type: 'info', title: 'Saree deleted', message: `${removed.name} was removed from the catalogue.` });
      })
      .catch(reportError);
  };

  // ── orders ──
  const applyStock = (items: { id: string; quantity: number }[]) =>
    setProducts((prev) =>
      prev.map((p) => {
        const it = items.find((i) => i.id === p.id);
        return it ? { ...p, stock: Math.max(0, p.stock - it.quantity) } : p;
      })
    );

  /** Website checkout. The server re-prices the order from the database and gives it an order number. */
  const createOrder = async (o: NewOrder): Promise<Order> => {
    const order = await api<Order>('order.place', {
      items: o.items.map((i) => ({ id: i.id, quantity: i.quantity, color: i.color, includeGiftWrap: i.includeGiftWrap })),
      customerEmail: o.customerEmail,
      shippingAddress: o.shippingAddress,
      paymentMethod: o.paymentMethod,
      paymentReference: o.paymentReference ?? o.orderNumber,
      couponCode: o.couponCode,
      estimatedDelivery: o.estimatedDelivery,
    });
    setMyOrders((prev) => [order, ...prev]);
    applyStock(order.items);
    return order;
  };

  const addManualOrder = async (o: Omit<NewOrder, 'orderNumber'>) => {
    try {
      const order = await api<Order>('order.add', o);
      setAdminOrders((prev) => [order, ...prev]);
      applyStock(order.items);
      showToast({ type: 'success', title: 'Order added', message: `${order.orderNumber} has been recorded.` });
      return order;
    } catch (e) {
      reportError(e);
      return null;
    }
  };

  const updateOrder = (orderId: string, patch: Partial<Order>) => {
    const before = adminOrders;
    setAdminOrders((prev) => prev.map((o) => (o.id === orderId ? { ...o, ...patch } : o)));
    const num = adminOrders.find((o) => o.id === orderId)?.orderNumber ?? '';
    api('order.update', { id: orderId, patch })
      .then(() => {
        if (patch.paymentStatus === 'Paid') showToast({ type: 'success', title: 'Payment marked as received', message: `${num} is now paid.` });
        else if (patch.paymentStatus === 'Refunded') showToast({ type: 'info', title: 'Marked as refunded', message: num });
        else if (patch.status) showToast({ type: 'success', title: 'Order updated', message: `${num} is now ${patch.status}.` });
      })
      .catch((e) => {
        setAdminOrders(before);
        reportError(e);
      });
  };

  const updateOrderStatus = (orderId: string, status: OrderStatus) => updateOrder(orderId, { status });

  const getOrderById = (q: string) => {
    const k = q.trim().toUpperCase();
    return [...adminOrders, ...myOrders].find((o) => o.id.toUpperCase() === k || o.orderNumber.toUpperCase() === k);
  };

  // ── bookings ──
  const addBooking = (booking: Omit<Booking, 'id'>) => {
    api<Booking>('booking.save', booking)
      .then((saved) => {
        setBookings((prev) => [saved, ...prev]);
        showToast({ type: 'success', title: 'Booking added', message: `${saved.service} for ${saved.customerName}.` });
      })
      .catch(reportError);
  };

  const updateBooking = (bookingId: string, patch: Partial<Booking>) => {
    const current = bookings.find((b) => b.id === bookingId);
    if (!current) return;
    const next = { ...current, ...patch };
    setBookings((prev) => prev.map((b) => (b.id === bookingId ? next : b)));
    api('booking.save', next)
      .then(() => {
        if (patch.status)
          showToast({ type: patch.status === 'Cancelled' ? 'info' : 'success', title: `Booking ${patch.status.toLowerCase()}`, message: `${next.service} · ${next.customerName}` });
      })
      .catch((e) => {
        setBookings((prev) => prev.map((b) => (b.id === bookingId ? current : b)));
        reportError(e);
      });
  };

  // ── admin session ──
  const loginAdmin = async (email: string, password: string) => {
    try {
      const { token } = await api<{ token: string }>('login', { email, password });
      setToken(token);
      setIsAdminAuthenticated(true);
      return null;
    } catch (e) {
      return e instanceof Error ? e.message : 'Could not sign in.';
    }
  };

  const logoutAdmin = () => {
    api('logout', {}).catch(() => {});
    setToken('');
    setIsAdminAuthenticated(false);
    setIsAdminOpen(false);
    setAdminOrders([]);
    setBookings([]);
    showToast({ type: 'info', title: 'Signed out of admin', message: 'See you soon.' });
  };

  const changeAdminPassword = async (current: string, next: string) => {
    try {
      await api('password.change', { current, next });
      return null;
    } catch (e) {
      return e instanceof Error ? e.message : 'Could not change the password.';
    }
  };

  return (
    <AdminContext.Provider
      value={{
        products,
        catalogLoaded,
        orders: isAdminAuthenticated ? adminOrders : myOrders,
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
        changeAdminPassword,
        refreshMyOrders,
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
