import React, { useEffect, useState } from 'react';
import { useToast } from '../../context/ToastContext';
import { X, User, Package, MapPin, Heart, LogOut, ArrowRight, ShieldCheck, Phone, Mail, Key } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useAdmin } from '../../context/AdminContext';
import { ADMIN_EMAIL } from '../../config/admin';
import { OrderTimeline } from './OrderTimeline';
import { ImageWithFallback } from '../common/ImageWithFallback';

export const AccountModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onNavigateWishlist: () => void;
}> = ({ isOpen, onClose, onNavigateWishlist }) => {
  const { user, login, signup, logout } = useAuth();
  const { showToast } = useToast();
  const { orders: allOrders, loginAdmin, setIsAdminOpen, refreshMyOrders } = useAdmin();
  // Show the latest order status every time the account opens.
  useEffect(() => {
    if (isOpen) refreshMyOrders();
  }, [isOpen, refreshMyOrders]);
  // Customers only see orders placed with their own email.
  const orders = user ? allOrders.filter((o) => o.customerEmail === user.email.trim().toLowerCase()) : [];

  const [activeTab, setActiveTab] = useState<'profile' | 'orders' | 'addresses'>('orders');
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');

  // Login form state
  const [emailInput, setEmailInput] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [adminError, setAdminError] = useState('');
  const [signingIn, setSigningIn] = useState(false);
  const isAdminEmail = emailInput.trim().toLowerCase() === ADMIN_EMAIL.toLowerCase();

  // Signup form state
  const [signupName, setSignupName] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPhone, setSignupPhone] = useState('');

  if (!isOpen) return null;

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailInput) return;
    // The admin email asks for the admin password and opens the admin workspace instead of a customer account.
    if (isAdminEmail) {
      if (!adminPassword) return setAdminError('Enter the admin password.');
      setSigningIn(true);
      const err = await loginAdmin(emailInput.trim(), adminPassword);
      setSigningIn(false);
      if (err) return setAdminError(err);
      setEmailInput('');
      setAdminPassword('');
      setAdminError('');
      onClose();
      setIsAdminOpen(true);
      showToast({ type: 'success', title: 'Welcome to the admin workspace', message: 'Signed in as store admin.' });
      return;
    }
    login(emailInput);
  };

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    if (signupName && signupEmail) {
      signup(signupName, signupEmail, signupPhone);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="account-modal-heading"
      className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm overflow-y-auto flex items-center justify-center p-4 animate-in fade-in"
    >
      <div className="bg-[#faf7f2] w-full max-w-2xl shadow-2xl border border-sand my-8 overflow-hidden">
        {/* Header */}
        <div className="p-5 border-b border-sand bg-cream/40 flex items-center justify-between">
          <div>
            <span className="text-[10px] tracking-widest uppercase font-semibold text-gold-700 block">
              Daivisha Circle
            </span>
            <h2 id="account-modal-heading" className="font-serif text-xl font-bold text-burgundy-950">
              {user ? `Namaste, ${user.name}` : 'Patron Portal & Account'}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-stone-500 hover:text-charcoal transition-colors"
            aria-label="Close Account Portal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* LOGGED IN DASHBOARD */}
        {user ? (
          <div>
            {/* Top Patron Status */}
            <div className="bg-burgundy-950 text-gold-300 p-4 px-6 flex items-center justify-between text-xs">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-gold-500 text-burgundy-950 font-serif font-bold text-base flex items-center justify-center">
                  {user.name.charAt(0)}
                </div>
                <div>
                  <h4 className="font-serif text-sm font-semibold text-ivory">{user.name}</h4>
                  <p className="text-[11px] text-gold-400 font-sans">{user.memberTier} Privilege</p>
                </div>
              </div>
              <button
                onClick={logout}
                className="flex items-center gap-1.5 text-stone-300 hover:text-white uppercase tracking-wider text-[11px]"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Logout</span>
              </button>
            </div>

            {/* Dashboard Tabs */}
            <div className="grid grid-cols-3 border-b border-sand text-xs font-sans text-center">
              <button
                onClick={() => setActiveTab('orders')}
                className={`py-3 font-semibold uppercase tracking-wider border-b-2 transition-colors ${
                  activeTab === 'orders'
                    ? 'border-burgundy-950 text-burgundy-950 bg-cream/30'
                    : 'border-transparent text-stone-500 hover:text-charcoal'
                }`}
              >
                Orders &amp; Tracking ({orders.length})
              </button>
              <button
                onClick={() => setActiveTab('addresses')}
                className={`py-3 font-semibold uppercase tracking-wider border-b-2 transition-colors ${
                  activeTab === 'addresses'
                    ? 'border-burgundy-950 text-burgundy-950 bg-cream/30'
                    : 'border-transparent text-stone-500 hover:text-charcoal'
                }`}
              >
                Saved Addresses
              </button>
              <button
                onClick={() => setActiveTab('profile')}
                className={`py-3 font-semibold uppercase tracking-wider border-b-2 transition-colors ${
                  activeTab === 'profile'
                    ? 'border-burgundy-950 text-burgundy-950 bg-cream/30'
                    : 'border-transparent text-stone-500 hover:text-charcoal'
                }`}
              >
                Profile &amp; Perks
              </button>
            </div>

            {/* Tab Contents */}
            <div className="p-6 max-h-[60vh] overflow-y-auto">
              {/* ORDERS TAB */}
              {activeTab === 'orders' && (
                <div className="space-y-6">
                  {orders.length === 0 ? (
                    <div className="py-12 text-center text-stone-500 text-xs">
                      No orders placed yet.
                    </div>
                  ) : (
                    orders.map((order) => (
                      <div
                        key={order.id}
                        className="bg-white p-5 border border-sand shadow-sm space-y-4"
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-sand/60 pb-3 text-xs">
                          <div>
                            <span className="text-[10px] uppercase tracking-wider text-stone-400 font-semibold block">
                              Order Reference
                            </span>
                            <span className="font-bold text-burgundy-950 font-serif text-sm">
                              {order.orderNumber}
                            </span>
                            <span className="text-stone-400 mx-2">·</span>
                            <span className="text-stone-500">Date: {order.date}</span>
                          </div>
                          <div className="text-right">
                            <span className="text-[11px] bg-cream px-2.5 py-1 font-semibold text-burgundy-950 uppercase tracking-wider">
                              Status: {order.status}
                            </span>
                          </div>
                        </div>

                        {/* Order Items */}
                        <div className="space-y-3">
                          {order.items.map((it, idx) => (
                            <div key={idx} className="flex items-center gap-3 text-xs">
                              <div className="w-14 aspect-[3/4] bg-[#f1e9df] overflow-hidden shrink-0">
                                <ImageWithFallback src={it.image} alt={it.name} className="w-full h-full object-cover" />
                              </div>
                              <div className="flex-1">
                                <h4 className="font-serif font-semibold text-charcoal">{it.name}</h4>
                                <p className="text-[11px] text-stone-500">
                                  Qty: {it.quantity} · {it.color || 'Standard'}
                                </p>
                                <p className="text-xs font-semibold text-burgundy-950 tabular-nums mt-0.5">
                                  ₹{it.price.toLocaleString('en-IN')}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>

                        {/* Order Timeline */}
                        <div className="border-t border-sand/60 pt-3">
                          <OrderTimeline status={order.status} />
                          <div className="mt-2 flex items-center justify-between text-[11px] text-stone-500 font-sans">
                            <span>Carrier: {order.carrier}</span>
                            <span>Tracking: <strong className="text-charcoal">{order.trackingNumber}</strong></span>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}

              {/* ADDRESSES TAB */}
              {activeTab === 'addresses' && (
                <div className="space-y-4">
                  {user.addresses.map((addr) => (
                    <div
                      key={addr.id}
                      className="p-4 bg-white border border-sand space-y-1.5 text-xs font-sans"
                    >
                      <div className="flex items-center justify-between font-semibold text-charcoal">
                        <span>{addr.fullName}</span>
                        {addr.isDefault && (
                          <span className="text-[10px] uppercase tracking-wider bg-gold-400 text-burgundy-950 px-2 py-0.5">
                            Default Address
                          </span>
                        )}
                      </div>
                      <p className="text-stone-600">{addr.addressLine}</p>
                      <p className="text-stone-600">{addr.city}, {addr.state} - {addr.pincode}</p>
                      <p className="text-stone-500">Contact: {addr.phone}</p>
                    </div>
                  ))}
                </div>
              )}

              {/* PROFILE TAB */}
              {activeTab === 'profile' && (
                <div className="space-y-4 text-xs font-sans">
                  <div className="p-4 bg-white border border-sand space-y-2">
                    <div className="grid grid-cols-3 gap-2">
                      <span className="text-stone-400">Patron Name</span>
                      <span className="col-span-2 font-semibold text-charcoal">{user.name}</span>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      <span className="text-stone-400">Email</span>
                      <span className="col-span-2 text-charcoal">{user.email}</span>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      <span className="text-stone-400">Phone</span>
                      <span className="col-span-2 text-charcoal">{user.phone}</span>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      <span className="text-stone-400">Privilege Status</span>
                      <span className="col-span-2 text-gold-700 font-semibold">{user.memberTier}</span>
                    </div>
                  </div>

                  <div className="p-4 bg-cream/40 border border-sand space-y-2">
                    <h4 className="font-serif text-sm font-semibold text-burgundy-950">
                      Privilege Member Benefits
                    </h4>
                    <p className="text-stone-600 leading-relaxed">
                      • Priority preview access to seasonal bridal handloom launches 48 hours in advance.<br />
                      • Complimentary dry cleaning consultation with our heritage master weavers.<br />
                      • Dedicated WhatsApp personal drape stylist assistance.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : (
          /* AUTH FORMS (EMAIL SIGN IN / CREATE ACCOUNT) — email only, no password or OTP */
          <div className="p-6 md:p-8 space-y-6">
            {/* Mode Selector */}
            <div className="flex border-b border-sand text-xs font-sans">
              <button
                onClick={() => setAuthMode('login')}
                className={`flex-1 py-2.5 uppercase tracking-wider font-semibold border-b-2 ${
                  authMode === 'login'
                    ? 'border-burgundy-950 text-burgundy-950'
                    : 'border-transparent text-stone-400 hover:text-charcoal'
                }`}
              >
                Sign In
              </button>
              <button
                onClick={() => setAuthMode('signup')}
                className={`flex-1 py-2.5 uppercase tracking-wider font-semibold border-b-2 ${
                  authMode === 'signup'
                    ? 'border-burgundy-950 text-burgundy-950'
                    : 'border-transparent text-stone-400 hover:text-charcoal'
                }`}
              >
                Create Account
              </button>
            </div>

            {/* Email Sign In */}
            {authMode === 'login' && (
              <form onSubmit={handleEmailLogin} className="space-y-4 text-xs font-sans">
                <div>
                  <label className="block font-semibold uppercase tracking-wider text-charcoal mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={emailInput}
                    onChange={(e) => setEmailInput(e.target.value)}
                    placeholder="you@example.com"
                    autoComplete="email"
                    required
                    className="w-full px-3 py-2.5 bg-white border border-sand focus:border-burgundy-950 focus:outline-none"
                  />
                </div>
                {isAdminEmail && (
                  <div>
                    <label className="block font-semibold uppercase tracking-wider text-charcoal mb-1">Admin Password</label>
                    <input
                      type="password"
                      value={adminPassword}
                      onChange={(e) => {
                        setAdminPassword(e.target.value);
                        setAdminError('');
                      }}
                      autoComplete="current-password"
                      className="w-full px-3 py-2.5 bg-white border border-sand focus:border-burgundy-950 focus:outline-none"
                    />
                    {adminError && <p className="mt-1 text-[11px] text-rose-700">{adminError}</p>}
                  </div>
                )}
                <button
                  type="submit"
                  disabled={signingIn}
                  className="w-full py-3.5 bg-burgundy-950 text-gold-300 font-semibold uppercase tracking-widest hover:bg-burgundy-900 transition-colors shadow-md disabled:opacity-60"
                >
                  {isAdminEmail ? (signingIn ? 'Signing in…' : 'Sign in to admin') : 'Continue with Email'}
                </button>
                {!isAdminEmail && <p className="text-center text-stone-500">Just enter your email — no password or OTP needed.</p>}
              </form>
            )}

            {/* Signup Form */}
            {authMode === 'signup' && (
              <form onSubmit={handleSignup} className="space-y-4 text-xs font-sans">
                <div>
                  <label className="block font-semibold uppercase tracking-wider text-charcoal mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={signupName}
                    onChange={(e) => setSignupName(e.target.value)}
                    placeholder="Maharani Gayatri"
                    required
                    className="w-full px-3 py-2.5 bg-white border border-sand focus:border-burgundy-950 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-semibold uppercase tracking-wider text-charcoal mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={signupEmail}
                    onChange={(e) => setSignupEmail(e.target.value)}
                    placeholder="patron@daivishavastra.com"
                    required
                    className="w-full px-3 py-2.5 bg-white border border-sand focus:border-burgundy-950 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-semibold uppercase tracking-wider text-charcoal mb-1">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={signupPhone}
                    onChange={(e) => setSignupPhone(e.target.value)}
                    placeholder="+91 98201 54321"
                    className="w-full px-3 py-2.5 bg-white border border-sand focus:border-burgundy-950 focus:outline-none"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-3.5 bg-burgundy-950 text-gold-300 font-semibold uppercase tracking-widest hover:bg-burgundy-900 transition-colors shadow-md"
                >
                  Join Daivisha Circle
                </button>
              </form>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
