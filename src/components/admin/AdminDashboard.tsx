import React, { useEffect, useRef, useState } from 'react';
import { Bell, CalendarDays, ChevronRight, ExternalLink, LayoutGrid, Layers, LogOut, Menu, ShoppingBag, Tag, Wallet, X } from 'lucide-react';
import { useAdmin } from '../../context/AdminContext';
import { OverviewPage } from './OverviewPage';
import { ProductsPage } from './ProductsPage';
import { OrdersPage } from './OrdersPage';
import { BookingsPage } from './BookingsPage';
import { PaymentsPage } from './PaymentsPage';
import { CouponsPage } from './CouponsPage';
import { paymentStatusOf } from './adminUtils';

export type AdminPage = 'overview' | 'products' | 'orders' | 'bookings' | 'payments' | 'coupons';

const NAV: { id: AdminPage; label: string; icon: React.FC<{ className?: string }> }[] = [
  { id: 'overview', label: 'Overview', icon: LayoutGrid },
  { id: 'products', label: 'Saree products', icon: Layers },
  { id: 'orders', label: 'Orders', icon: ShoppingBag },
  { id: 'bookings', label: 'Bookings', icon: CalendarDays },
  { id: 'payments', label: 'Payments & Collections', icon: Wallet },
  { id: 'coupons', label: 'Coupons', icon: Tag },
];

export const AdminDashboard: React.FC = () => {
  const { isAdminOpen, setIsAdminOpen, isAdminAuthenticated, logoutAdmin, bookings, orders } = useAdmin();
  const [page, setPage] = useState<AdminPage>('overview');
  const [navOpen, setNavOpen] = useState(false);
  const mainRef = useRef<HTMLDivElement>(null);

  // Each page starts at the top.
  useEffect(() => {
    mainRef.current?.scrollTo({ top: 0 });
  }, [page]);

  // Keep the storefront behind the workspace from scrolling.
  useEffect(() => {
    if (!isAdminOpen || !isAdminAuthenticated) return;
    const prev = document.documentElement.style.overflow;
    document.documentElement.style.overflow = 'hidden';
    return () => {
      document.documentElement.style.overflow = prev;
    };
  }, [isAdminOpen, isAdminAuthenticated]);

  if (!isAdminOpen || !isAdminAuthenticated) return null;

  const go = (p: AdminPage) => {
    setPage(p);
    setNavOpen(false);
  };
  const alerts = bookings.filter((b) => b.status === 'Pending').length + orders.filter((o) => paymentStatusOf(o) === 'Pending').length;
  const current = NAV.find((n) => n.id === page)!;

  const sidebar = (
    <nav className="flex flex-col h-full px-4 py-6" aria-label="Admin navigation">
      <div className="mx-auto w-40 rounded-full bg-[#f8f1e6] border border-gold-500/50 aspect-square flex flex-col items-center justify-center p-4 shadow-sm">
        <img src="/src/assets/images/daivisha_emblem.png" alt="" className="w-full h-auto" />
        <p className="font-serif text-lg font-semibold text-burgundy-800 leading-none mt-1 [font-variant:small-caps]">Daivisha Vastra</p>
      </div>
      <p className="mt-3 text-center text-[10px] uppercase tracking-[0.2em] text-gold-700">Admin workspace</p>

      <ul className="mt-6 space-y-1">
        {NAV.map(({ id, label, icon: Icon }) => (
          <li key={id}>
            <button
              onClick={() => go(id)}
              aria-current={page === id ? 'page' : undefined}
              className={`w-full flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-left transition-colors cursor-pointer ${
                page === id ? 'bg-[#f6e3e7] text-burgundy-800 font-semibold' : 'text-stone-600 hover:bg-[#f4ecdf] hover:text-charcoal'
              }`}
            >
              <Icon className="w-4 h-4 shrink-0" />
              {label}
            </button>
          </li>
        ))}
      </ul>

      <div className="my-5 border-t border-[#ebe3d6]" />
      <button
        onClick={() => setIsAdminOpen(false)}
        className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-stone-600 hover:bg-[#f4ecdf] hover:text-charcoal cursor-pointer"
      >
        <ExternalLink className="w-4 h-4" /> View website
      </button>

      <div className="mt-auto space-y-4">
        <div className="rounded-lg bg-[#f4ecdf] p-3 text-[11px] text-stone-600 leading-relaxed">
          <p className="font-semibold text-charcoal uppercase tracking-wider text-[10px] mb-1">Saved in this browser</p>
          Changes update the website on this device. Connect a database to share them across devices.
        </div>
        <button onClick={logoutAdmin} className="flex items-center gap-3 px-3 py-2 text-sm text-stone-600 hover:text-burgundy-800 cursor-pointer">
          <LogOut className="w-4 h-4" /> Sign out
        </button>
      </div>
    </nav>
  );

  return (
    <div role="dialog" aria-modal="true" aria-label="Admin workspace" className="fixed inset-0 z-50 bg-[#f6f1e8] flex text-charcoal">
      {/* Desktop sidebar */}
      <aside className="hidden lg:block w-64 shrink-0 bg-[#fffdf9] border-r border-[#ebe3d6] overflow-y-auto">{sidebar}</aside>

      {/* Mobile sidebar */}
      {navOpen && (
        <div className="lg:hidden fixed inset-0 z-[55] flex">
          <aside className="w-64 bg-[#fffdf9] h-full overflow-y-auto shadow-2xl">{sidebar}</aside>
          <button className="flex-1 bg-black/40" onClick={() => setNavOpen(false)} aria-label="Close menu" />
        </div>
      )}

      <div className="flex-1 min-w-0 flex flex-col">
        {/* Top bar */}
        <header className="h-16 shrink-0 bg-[#fffdf9] border-b border-[#ebe3d6] flex items-center justify-between px-4 sm:px-8">
          <div className="flex items-center gap-3 text-sm">
            <button onClick={() => setNavOpen(true)} className="lg:hidden p-1.5 -ml-1.5 text-stone-600 cursor-pointer" aria-label="Open menu">
              <Menu className="w-5 h-5" />
            </button>
            <span className="hidden sm:inline text-stone-500">Workspace</span>
            <ChevronRight className="hidden sm:inline w-4 h-4 text-stone-400" />
            <span className="font-medium text-charcoal">{current.label}</span>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => go(bookings.some((b) => b.status === 'Pending') ? 'bookings' : 'payments')}
              className="relative p-1.5 text-stone-600 hover:text-charcoal cursor-pointer"
              aria-label={`${alerts} items need attention`}
              title="Pending bookings and payments"
            >
              <Bell className="w-5 h-5" />
              {alerts > 0 && (
                <span className="absolute -top-0.5 -right-0.5 min-w-4 h-4 px-1 rounded-full bg-burgundy-800 text-ivory text-[10px] font-semibold grid place-items-center">
                  {alerts}
                </span>
              )}
            </button>
            <span className="h-6 w-px bg-[#ebe3d6]" />
            <div className="flex items-center gap-2.5">
              <span className="w-8 h-8 rounded-full bg-[#f6e3e7] text-burgundy-800 text-xs font-semibold grid place-items-center">DV</span>
              <span className="hidden sm:inline text-sm text-charcoal">Store admin</span>
            </div>
            <button onClick={() => setIsAdminOpen(false)} className="p-1.5 text-stone-500 hover:text-charcoal cursor-pointer" aria-label="Close admin workspace" title="Back to website">
              <X className="w-5 h-5" />
            </button>
          </div>
        </header>

        <main ref={mainRef} className="flex-1 overflow-y-auto overscroll-contain">
          <div className="w-full px-4 sm:px-6 lg:px-8 py-8">
            {page === 'overview' && <OverviewPage go={go} />}
            {page === 'products' && <ProductsPage />}
            {page === 'orders' && <OrdersPage />}
            {page === 'bookings' && <BookingsPage />}
            {page === 'payments' && <PaymentsPage />}
            {page === 'coupons' && <CouponsPage />}
          </div>
          <footer className="w-full px-4 sm:px-6 lg:px-8 pb-6 flex justify-between text-[11px] text-stone-400">
            <span>Daivisha Vastra · Admin workspace</span>
            <span>Elegant attire rooted in Indian heritage</span>
          </footer>
        </main>
      </div>
    </div>
  );
};
