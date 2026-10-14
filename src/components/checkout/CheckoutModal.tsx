import React, { useState } from 'react';
import { X, CheckCircle2, ShieldCheck, CreditCard, Smartphone, Banknote, Building2, Truck, ArrowRight, Lock } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useAdmin } from '../../context/AdminContext';
import { useAuth } from '../../context/AuthContext';
import { ImageWithFallback } from '../common/ImageWithFallback';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOrderSuccess: (orderId: string) => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  onOrderSuccess,
}) => {
  const { cartItems, subtotal, discountAmount, giftWrapAmount, shippingAmount, total, clearCart } = useCart();
  const { createOrder } = useAdmin();
  const { user } = useAuth();

  const [step, setStep] = useState<1 | 2 | 3 | 4 | 5>(1);

  // Form states
  const [email, setEmail] = useState(user?.email || 'patron@daivishavastra.com');
  const [phone, setPhone] = useState(user?.phone || '+91 98201 54321');
  const [fullName, setFullName] = useState(user?.name || 'Gayatri Devi');
  const [addressLine, setAddressLine] = useState(user?.addresses[0]?.addressLine || 'The Royal Belvedere, Bungalow 7, Malabar Hill');
  const [city, setCity] = useState(user?.addresses[0]?.city || 'Mumbai');
  const [state, setState] = useState(user?.addresses[0]?.state || 'Maharashtra');
  const [pincode, setPincode] = useState(user?.addresses[0]?.pincode || '400006');
  const [deliveryMethod, setDeliveryMethod] = useState<'express' | 'white-glove'>('express');
  const [paymentMethod, setPaymentMethod] = useState<'upi' | 'card' | 'netbanking' | 'cod'>('upi');
  const [upiId, setUpiId] = useState('patron@okhdfcbank');

  const [completedOrderNumber, setCompletedOrderNumber] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  if (!isOpen) return null;

  const handlePlaceOrder = () => {
    setIsProcessing(true);

    setTimeout(() => {
      const orderItems = cartItems.map((item) => ({
        id: item.product.id,
        name: item.product.name,
        image: item.product.images[0],
        price: item.product.sellingPrice,
        quantity: item.quantity,
        color: item.selectedColor,
      }));

      const newOrder = createOrder({
        items: orderItems,
        subtotal,
        discount: discountAmount,
        shipping: shippingAmount,
        total,
        status: 'Confirmed',
        paymentMethod:
          paymentMethod === 'upi'
            ? `UPI (${upiId})`
            : paymentMethod === 'card'
            ? 'Credit Card'
            : paymentMethod === 'netbanking'
            ? 'Net Banking (HDFC)'
            : 'Cash on Delivery',
        shippingAddress: {
          fullName,
          phone,
          addressLine,
          city,
          state,
          pincode,
        },
        trackingNumber: `DV-TRACK-${Math.floor(10000000 + Math.random() * 90000000)}`,
        carrier: 'BlueDart Luxury Express',
        estimatedDelivery: 'Oct 11, 2026',
      });

      setCompletedOrderNumber(newOrder.orderNumber);
      clearCart();
      setIsProcessing(false);
      setStep(5);
      onOrderSuccess(newOrder.orderNumber);
    }, 1200);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="checkout-heading"
      className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm overflow-y-auto flex items-center justify-center p-4 animate-in fade-in"
    >
      <div className="bg-[#faf7f2] w-full max-w-3xl shadow-2xl border border-sand my-8 overflow-hidden">
        {/* Top Header */}
        <div className="p-5 border-b border-sand bg-cream/40 flex items-center justify-between">
          <div>
            <span className="text-[10px] tracking-widest uppercase font-semibold text-gold-700 block">
              Daivisha Vastra Checkout
            </span>
            <h2 id="checkout-heading" className="font-serif text-xl font-bold text-burgundy-950">
              {step === 5 ? 'Order Confirmed' : 'Complete Your Purchase'}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-stone-500 hover:text-charcoal transition-colors"
            aria-label="Close Checkout"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Steps Progress Indicator (if not on confirmation) */}
        {step < 5 && (
          <div className="grid grid-cols-4 border-b border-sand text-[11px] font-sans">
            {[
              { num: 1, label: 'Contact' },
              { num: 2, label: 'Shipping' },
              { num: 3, label: 'Delivery' },
              { num: 4, label: 'Payment' },
            ].map((s) => (
              <div
                key={s.num}
                className={`py-3 text-center border-r last:border-r-0 border-sand ${
                  step === s.num
                    ? 'bg-burgundy-950 text-gold-300 font-semibold'
                    : step > s.num
                    ? 'bg-cream text-charcoal'
                    : 'text-stone-400'
                }`}
              >
                <span>{s.num}. {s.label}</span>
              </div>
            ))}
          </div>
        )}

        <div className="p-6 md:p-8">
          {/* STEP 1: CONTACT */}
          {step === 1 && (
            <div className="space-y-5">
              <h3 className="font-serif text-lg font-bold text-charcoal">
                Contact Information
              </h3>
              <p className="text-xs text-stone-600">
                We will send dispatch updates and tracking credentials to your phone and email.
              </p>
              <div className="space-y-4 text-xs font-sans">
                <div>
                  <label className="block font-semibold uppercase tracking-wider text-charcoal mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full px-3 py-2.5 bg-white border border-sand focus:border-burgundy-950 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-semibold uppercase tracking-wider text-charcoal mb-1">
                    Mobile Phone Number (for WhatsApp/SMS alerts)
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                    className="w-full px-3 py-2.5 bg-white border border-sand focus:border-burgundy-950 focus:outline-none"
                  />
                </div>
              </div>
              <div className="pt-4 flex justify-end">
                <button
                  onClick={() => setStep(2)}
                  className="px-6 py-3 bg-burgundy-950 text-gold-300 text-xs font-semibold tracking-wider uppercase hover:bg-burgundy-900 transition-colors flex items-center gap-2"
                >
                  <span>Continue to Shipping</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: SHIPPING ADDRESS */}
          {step === 2 && (
            <div className="space-y-5">
              <h3 className="font-serif text-lg font-bold text-charcoal">
                Shipping Destination
              </h3>
              <div className="space-y-4 text-xs font-sans">
                <div>
                  <label className="block font-semibold uppercase tracking-wider text-charcoal mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required
                    className="w-full px-3 py-2.5 bg-white border border-sand focus:border-burgundy-950 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-semibold uppercase tracking-wider text-charcoal mb-1">
                    Street Address / Bungalow / Flat Details
                  </label>
                  <input
                    type="text"
                    value={addressLine}
                    onChange={(e) => setAddressLine(e.target.value)}
                    required
                    className="w-full px-3 py-2.5 bg-white border border-sand focus:border-burgundy-950 focus:outline-none"
                  />
                </div>
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block font-semibold uppercase tracking-wider text-charcoal mb-1">
                      City
                    </label>
                    <input
                      type="text"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      required
                      className="w-full px-3 py-2.5 bg-white border border-sand focus:border-burgundy-950 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold uppercase tracking-wider text-charcoal mb-1">
                      State
                    </label>
                    <input
                      type="text"
                      value={state}
                      onChange={(e) => setState(e.target.value)}
                      required
                      className="w-full px-3 py-2.5 bg-white border border-sand focus:border-burgundy-950 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold uppercase tracking-wider text-charcoal mb-1">
                      PIN Code
                    </label>
                    <input
                      type="text"
                      value={pincode}
                      onChange={(e) => setPincode(e.target.value)}
                      maxLength={6}
                      required
                      className="w-full px-3 py-2.5 bg-white border border-sand focus:border-burgundy-950 focus:outline-none"
                    />
                  </div>
                </div>
              </div>
              <div className="pt-4 flex justify-between">
                <button
                  onClick={() => setStep(1)}
                  className="px-4 py-2 text-xs uppercase tracking-wider text-stone-600 hover:text-charcoal"
                >
                  ← Back
                </button>
                <button
                  onClick={() => setStep(3)}
                  className="px-6 py-3 bg-burgundy-950 text-gold-300 text-xs font-semibold tracking-wider uppercase hover:bg-burgundy-900 transition-colors flex items-center gap-2"
                >
                  <span>Continue to Delivery</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: DELIVERY METHOD */}
          {step === 3 && (
            <div className="space-y-5">
              <h3 className="font-serif text-lg font-bold text-charcoal">
                Select Shipping Experience
              </h3>
              <div className="space-y-3 text-xs font-sans">
                <label
                  onClick={() => setDeliveryMethod('express')}
                  className={`p-4 border flex items-start gap-3 cursor-pointer transition-colors ${
                    deliveryMethod === 'express'
                      ? 'border-burgundy-950 bg-cream/50'
                      : 'border-sand bg-white'
                  }`}
                >
                  <input
                    type="radio"
                    name="delivery"
                    checked={deliveryMethod === 'express'}
                    onChange={() => setDeliveryMethod('express')}
                    className="mt-1 accent-burgundy-900"
                  />
                  <div className="flex-1">
                    <div className="flex items-center justify-between font-semibold text-charcoal">
                      <span>Standard Insured Express Delivery (BlueDart)</span>
                      <span className="text-emerald-800">FREE</span>
                    </div>
                    <p className="text-stone-500 mt-0.5">
                      Dispatched within 24h in tamper-proof security box. Estimated delivery in 2-4 business days.
                    </p>
                  </div>
                </label>

                <label
                  onClick={() => setDeliveryMethod('white-glove')}
                  className={`p-4 border flex items-start gap-3 cursor-pointer transition-colors ${
                    deliveryMethod === 'white-glove'
                      ? 'border-burgundy-950 bg-cream/50'
                      : 'border-sand bg-white'
                  }`}
                >
                  <input
                    type="radio"
                    name="delivery"
                    checked={deliveryMethod === 'white-glove'}
                    onChange={() => setDeliveryMethod('white-glove')}
                    className="mt-1 accent-burgundy-900"
                  />
                  <div className="flex-1">
                    <div className="flex items-center justify-between font-semibold text-charcoal">
                      <span>Royal White-Glove Concierge Appointment</span>
                      <span className="text-gold-700">COMPLIMENTARY PRIVILEGE</span>
                    </div>
                    <p className="text-stone-500 mt-0.5">
                      Delivered in person by a uniformed courier with optional drape inspection at doorstep before sign-off.
                    </p>
                  </div>
                </label>
              </div>

              <div className="pt-4 flex justify-between">
                <button
                  onClick={() => setStep(2)}
                  className="px-4 py-2 text-xs uppercase tracking-wider text-stone-600 hover:text-charcoal"
                >
                  ← Back
                </button>
                <button
                  onClick={() => setStep(4)}
                  className="px-6 py-3 bg-burgundy-950 text-gold-300 text-xs font-semibold tracking-wider uppercase hover:bg-burgundy-900 transition-colors flex items-center gap-2"
                >
                  <span>Continue to Payment</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 4: PAYMENT */}
          {step === 4 && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="font-serif text-lg font-bold text-charcoal">
                  Secure Payment Method
                </h3>
                <span className="text-xs text-stone-500 flex items-center gap-1">
                  <Lock className="w-3.5 h-3.5 text-gold-600" />
                  <span>256-Bit SSL Encrypted</span>
                </span>
              </div>

              {/* Order Quick Summary */}
              <div className="p-3 bg-cream/40 border border-sand text-xs flex justify-between font-sans">
                <span className="text-stone-600">Total Payable Amount:</span>
                <span className="font-bold text-burgundy-950 text-sm tabular-nums">
                  ₹{total.toLocaleString('en-IN')}
                </span>
              </div>

              {/* Payment Methods Tabs */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-sans">
                {[
                  { id: 'upi', label: 'UPI / QR', icon: Smartphone },
                  { id: 'card', label: 'Cards', icon: CreditCard },
                  { id: 'netbanking', label: 'Net Banking', icon: Building2 },
                  { id: 'cod', label: 'Cash on Delivery', icon: Banknote },
                ].map((pm) => {
                  const Icon = pm.icon;
                  return (
                    <button
                      key={pm.id}
                      onClick={() => setPaymentMethod(pm.id as any)}
                      className={`p-3 border flex flex-col items-center gap-1.5 transition-colors ${
                        paymentMethod === pm.id
                          ? 'border-burgundy-950 bg-burgundy-950 text-gold-300 font-semibold'
                          : 'border-sand bg-white text-stone-600 hover:border-stone-400'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      <span>{pm.label}</span>
                    </button>
                  );
                })}
              </div>

              {/* Method Details */}
              <div className="p-4 bg-white border border-sand text-xs space-y-3 font-sans">
                {paymentMethod === 'upi' && (
                  <div className="space-y-2">
                    <label className="block font-semibold uppercase tracking-wider text-charcoal">
                      Enter UPI ID / VPA
                    </label>
                    <input
                      type="text"
                      value={upiId}
                      onChange={(e) => setUpiId(e.target.value)}
                      placeholder="e.g. yourname@okhdfcbank"
                      className="w-full px-3 py-2 bg-white border border-sand focus:border-burgundy-950 focus:outline-none"
                    />
                    <p className="text-[11px] text-stone-500">
                      Supports Google Pay, PhonePe, Paytm, BHIM and all banking apps.
                    </p>
                  </div>
                )}

                {paymentMethod === 'card' && (
                  <div className="space-y-2.5">
                    <div>
                      <label className="block font-semibold text-charcoal">Card Number</label>
                      <input
                        type="text"
                        placeholder="4111 •••• •••• 4242"
                        className="w-full px-3 py-2 bg-white border border-sand focus:border-burgundy-950 focus:outline-none"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="text"
                        placeholder="MM / YY"
                        className="w-full px-3 py-2 bg-white border border-sand focus:border-burgundy-950 focus:outline-none"
                      />
                      <input
                        type="password"
                        placeholder="CVV"
                        maxLength={4}
                        className="w-full px-3 py-2 bg-white border border-sand focus:border-burgundy-950 focus:outline-none"
                      />
                    </div>
                  </div>
                )}

                {paymentMethod === 'netbanking' && (
                  <div className="space-y-2">
                    <label className="block font-semibold text-charcoal">Select Bank</label>
                    <select className="w-full px-3 py-2 bg-white border border-sand focus:border-burgundy-950 focus:outline-none">
                      <option>HDFC Bank</option>
                      <option>ICICI Bank</option>
                      <option>State Bank of India</option>
                      <option>Axis Bank</option>
                      <option>Kotak Mahindra Bank</option>
                    </select>
                  </div>
                )}

                {paymentMethod === 'cod' && (
                  <div className="space-y-1">
                    <p className="font-semibold text-charcoal">Cash on Delivery Verification</p>
                    <p className="text-stone-600">
                      Pay safely upon delivery. A verification call or SMS OTP will be requested before dispatch.
                    </p>
                  </div>
                )}
              </div>

              <div className="pt-4 flex justify-between items-center">
                <button
                  onClick={() => setStep(3)}
                  className="px-4 py-2 text-xs uppercase tracking-wider text-stone-600 hover:text-charcoal"
                >
                  ← Back
                </button>
                <button
                  onClick={handlePlaceOrder}
                  disabled={isProcessing}
                  className="px-8 py-3.5 bg-burgundy-950 text-gold-300 text-xs font-semibold tracking-widest uppercase hover:bg-burgundy-900 transition-colors shadow-lg flex items-center gap-2"
                >
                  {isProcessing ? (
                    <span>Securing Order...</span>
                  ) : (
                    <>
                      <span>Authorize Payment &amp; Place Order</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {/* STEP 5: ORDER CONFIRMATION */}
          {step === 5 && (
            <div className="py-6 text-center space-y-5">
              <div className="w-16 h-16 rounded-full bg-emerald-50 border-2 border-emerald-600 text-emerald-700 flex items-center justify-center mx-auto animate-in zoom-in">
                <CheckCircle2 className="w-8 h-8" />
              </div>

              <div>
                <span className="text-xs uppercase tracking-widest font-semibold text-gold-700">
                  Auspicious Congratulations
                </span>
                <h3 className="font-serif text-3xl font-bold text-burgundy-950 mt-1">
                  Your Order Has Been Confirmed
                </h3>
                <p className="text-xs text-stone-600 mt-2 font-sans max-w-md mx-auto">
                  Order <strong>{completedOrderNumber}</strong> is currently being inspected and hand-packaged into our archival preservation box at our atelier.
                </p>
              </div>

              <div className="bg-cream/40 p-4 border border-sand text-xs font-sans max-w-md mx-auto text-left space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-stone-500">Order ID:</span>
                  <span className="font-semibold text-charcoal">{completedOrderNumber}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-500">Estimated Delivery:</span>
                  <span className="font-semibold text-charcoal">Within 3-4 Business Days</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-500">Shipping Address:</span>
                  <span className="font-semibold text-charcoal text-right">{city}, {pincode}</span>
                </div>
              </div>

              <div className="pt-4 flex justify-center gap-3">
                <button
                  onClick={onClose}
                  className="px-6 py-3 bg-burgundy-950 text-gold-300 text-xs font-semibold tracking-widest uppercase hover:bg-burgundy-900 transition-colors"
                >
                  Continue Browsing Sarees
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
