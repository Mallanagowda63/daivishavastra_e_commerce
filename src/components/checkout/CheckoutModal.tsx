import React, { useEffect, useState } from 'react';
import QRCode from 'qrcode';
import { X, CheckCircle2, ArrowRight, Lock, Smartphone, Copy, Check, Clock, Info } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useAdmin } from '../../context/AdminContext';
import { useAuth } from '../../context/AuthContext';
import { ImageWithFallback } from '../common/ImageWithFallback';
import { STORE_UPI_ID, STORE_UPI_NAME } from '../../config/contact';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOrderSuccess: (orderId: string) => void;
}

type Step = 1 | 2 | 3 | 4 | 5;

const STEPS = [
  { num: 1, label: 'Contact' },
  { num: 2, label: 'Address' },
  { num: 3, label: 'Review' },
  { num: 4, label: 'Payment' },
];

const inputClass = 'w-full px-3 py-2.5 bg-white border focus:outline-none';
const formatINR = (n: number) => `₹${n.toLocaleString('en-IN')}`;
const newReference = () => `DV-${Date.now().toString().slice(-6)}`;

const FieldError: React.FC<{ msg?: string }> = ({ msg }) => (msg ? <p className="mt-1 text-[11px] text-rose-700">{msg}</p> : null);

export const CheckoutModal: React.FC<CheckoutModalProps> = ({ isOpen, onClose, onOrderSuccess }) => {
  const { cartItems, subtotal, discountAmount, giftWrapAmount, shippingAmount, total, clearCart } = useCart();
  const { createOrder } = useAdmin();
  const { user } = useAuth();

  const [step, setStep] = useState<Step>(1);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [fullName, setFullName] = useState('');
  const [addressLine, setAddressLine] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [pincode, setPincode] = useState('');

  const [reference, setReference] = useState(newReference);
  const [utr, setUtr] = useState('');
  const [qr, setQr] = useState('');
  const [copied, setCopied] = useState(false);
  const [placed, setPlaced] = useState<{ number: string; total: number } | null>(null);

  const upiReady = STORE_UPI_ID.trim() !== '';
  const upiLink = `upi://pay?pa=${encodeURIComponent(STORE_UPI_ID)}&pn=${encodeURIComponent(STORE_UPI_NAME)}&am=${total.toFixed(
    2
  )}&cu=INR&tn=${encodeURIComponent(`Order ${reference}`)}`;

  // Every time checkout opens, start fresh at step 1 with the signed-in customer's details.
  useEffect(() => {
    if (!isOpen) return;
    setStep(1);
    setErrors({});
    setUtr('');
    setPlaced(null);
    setReference(newReference());
    setEmail(user?.email ?? '');
    setPhone(user?.phone ?? '');
    setFullName(user?.name ?? '');
    const a = user?.addresses?.[0];
    setAddressLine(a?.addressLine ?? '');
    setCity(a?.city ?? '');
    setState(a?.state ?? '');
    setPincode(a?.pincode ?? '');
  }, [isOpen, user]);

  useEffect(() => {
    if (step !== 4 || !upiReady) return;
    QRCode.toDataURL(upiLink, { width: 440, margin: 1, color: { dark: '#260a11', light: '#ffffff' } })
      .then(setQr)
      .catch(() => setQr(''));
  }, [step, upiLink, upiReady]);

  if (!isOpen) return null;

  const border = (key: string) => (errors[key] ? 'border-rose-400' : 'border-sand focus:border-burgundy-950');

  const validate = (s: Step) => {
    const e: Record<string, string> = {};
    if (s === 1) {
      if (!/^\S+@\S+\.\S+$/.test(email.trim())) e.email = 'Enter a valid email address.';
      const digits = phone.replace(/\D/g, '').replace(/^91(?=\d{10}$)/, '');
      if (!/^[6-9]\d{9}$/.test(digits)) e.phone = 'Enter a valid 10-digit mobile number.';
    }
    if (s === 2) {
      if (fullName.trim().length < 2) e.fullName = 'Enter the full name.';
      if (addressLine.trim().length < 6) e.addressLine = 'Enter the house / street address.';
      if (!city.trim()) e.city = 'Enter the city.';
      if (!state.trim()) e.state = 'Enter the state.';
      if (!/^\d{6}$/.test(pincode.trim())) e.pincode = 'Enter a 6-digit PIN code.';
    }
    if (s === 4 && upiReady && !/^\d{12}$/.test(utr.trim())) e.utr = 'Enter the 12-digit UPI transaction ID (UTR) from your payment app.';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const next = (to: Step) => {
    if (validate(step)) setStep(to);
  };

  const placeOrder = () => {
    if (!validate(4)) return;
    const eta = new Date();
    eta.setDate(eta.getDate() + 6);
    const order = createOrder({
      orderNumber: reference,
      customerEmail: email.trim().toLowerCase(),
      items: cartItems.map((item) => ({
        id: item.product.id,
        name: item.product.name,
        image: item.product.images[0],
        price: item.product.sellingPrice,
        quantity: item.quantity,
        color: item.selectedColor,
      })),
      subtotal,
      discount: discountAmount,
      shipping: shippingAmount,
      total,
      // Not confirmed until the store sees the money arrive and confirms it in the admin.
      status: 'Pending',
      paymentStatus: 'Pending',
      paymentMethod: upiReady ? `UPI · UTR ${utr.trim()}` : 'UPI (payment details to be shared)',
      shippingAddress: { fullName: fullName.trim(), phone: phone.trim(), addressLine: addressLine.trim(), city: city.trim(), state: state.trim(), pincode: pincode.trim() },
      trackingNumber: '—',
      carrier: 'To be assigned',
      estimatedDelivery: eta.toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }),
    });
    setPlaced({ number: order.orderNumber, total });
    clearCart();
    setStep(5);
    onOrderSuccess(order.orderNumber);
  };

  const copyUpi = async () => {
    try {
      await navigator.clipboard.writeText(STORE_UPI_ID);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      // clipboard blocked — the ID is visible to copy manually
    }
  };

  const primaryBtn =
    'px-6 py-3 bg-burgundy-950 text-gold-300 text-xs font-semibold tracking-wider uppercase hover:bg-burgundy-900 transition-colors flex items-center gap-2 cursor-pointer disabled:opacity-50';
  const backBtn = 'px-4 py-2 text-xs uppercase tracking-wider text-stone-600 hover:text-charcoal cursor-pointer';

  const emptyCart = cartItems.length === 0 && step !== 5;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="checkout-heading"
      className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm overflow-y-auto flex items-start sm:items-center justify-center p-3 sm:p-4 animate-in fade-in"
    >
      <div className="bg-[#faf7f2] w-full max-w-3xl shadow-2xl border border-sand my-4 sm:my-8 overflow-hidden">
        {/* Header */}
        <div className="p-5 border-b border-sand bg-cream/40 flex items-center justify-between">
          <div>
            <span className="text-[10px] tracking-widest uppercase font-semibold text-gold-700 block">Daivisha Vastra Checkout</span>
            <h2 id="checkout-heading" className="font-serif text-xl font-bold text-burgundy-950">
              {step === 5 ? 'Order Received' : 'Complete Your Purchase'}
            </h2>
          </div>
          <button onClick={onClose} className="p-1 text-stone-500 hover:text-charcoal transition-colors cursor-pointer" aria-label="Close checkout">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Progress */}
        {step < 5 && !emptyCart && (
          <div className="grid grid-cols-4 border-b border-sand text-[11px] font-sans">
            {STEPS.map((s) => (
              <div
                key={s.num}
                className={`py-3 text-center border-r last:border-r-0 border-sand ${
                  step === s.num ? 'bg-burgundy-950 text-gold-300 font-semibold' : step > s.num ? 'bg-cream text-charcoal' : 'text-stone-400'
                }`}
              >
                {s.num}. {s.label}
              </div>
            ))}
          </div>
        )}

        <div className="p-5 sm:p-8">
          {emptyCart && (
            <div className="py-10 text-center space-y-4">
              <p className="font-serif text-xl text-burgundy-950">Your shopping bag is empty.</p>
              <button onClick={onClose} className={`${primaryBtn} mx-auto`}>Continue shopping</button>
            </div>
          )}

          {/* STEP 1: CONTACT */}
          {step === 1 && !emptyCart && (
            <div className="space-y-5">
              <h3 className="font-serif text-lg font-bold text-charcoal">Contact Information</h3>
              <p className="text-xs text-stone-600">We&apos;ll send your order updates to this email and phone.</p>
              <div className="space-y-4 text-xs font-sans">
                <div>
                  <label htmlFor="co-email" className="block font-semibold uppercase tracking-wider text-charcoal mb-1">Email Address</label>
                  <input id="co-email" type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" className={`${inputClass} ${border('email')}`} />
                  <FieldError msg={errors.email} />
                </div>
                <div>
                  <label htmlFor="co-phone" className="block font-semibold uppercase tracking-wider text-charcoal mb-1">Mobile Number (WhatsApp)</label>
                  <input id="co-phone" type="tel" autoComplete="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="98765 43210" className={`${inputClass} ${border('phone')}`} />
                  <FieldError msg={errors.phone} />
                </div>
              </div>
              <div className="pt-4 flex justify-end">
                <button onClick={() => next(2)} className={primaryBtn}>
                  Continue to Address <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: ADDRESS */}
          {step === 2 && (
            <div className="space-y-5">
              <h3 className="font-serif text-lg font-bold text-charcoal">Delivery Address</h3>
              <div className="space-y-4 text-xs font-sans">
                <div>
                  <label htmlFor="co-name" className="block font-semibold uppercase tracking-wider text-charcoal mb-1">Full Name</label>
                  <input id="co-name" autoComplete="name" value={fullName} onChange={(e) => setFullName(e.target.value)} className={`${inputClass} ${border('fullName')}`} />
                  <FieldError msg={errors.fullName} />
                </div>
                <div>
                  <label htmlFor="co-addr" className="block font-semibold uppercase tracking-wider text-charcoal mb-1">House / Flat, Street, Area</label>
                  <input id="co-addr" autoComplete="street-address" value={addressLine} onChange={(e) => setAddressLine(e.target.value)} className={`${inputClass} ${border('addressLine')}`} />
                  <FieldError msg={errors.addressLine} />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label htmlFor="co-city" className="block font-semibold uppercase tracking-wider text-charcoal mb-1">City</label>
                    <input id="co-city" autoComplete="address-level2" value={city} onChange={(e) => setCity(e.target.value)} className={`${inputClass} ${border('city')}`} />
                    <FieldError msg={errors.city} />
                  </div>
                  <div>
                    <label htmlFor="co-state" className="block font-semibold uppercase tracking-wider text-charcoal mb-1">State</label>
                    <input id="co-state" autoComplete="address-level1" value={state} onChange={(e) => setState(e.target.value)} className={`${inputClass} ${border('state')}`} />
                    <FieldError msg={errors.state} />
                  </div>
                  <div>
                    <label htmlFor="co-pin" className="block font-semibold uppercase tracking-wider text-charcoal mb-1">PIN Code</label>
                    <input id="co-pin" inputMode="numeric" autoComplete="postal-code" maxLength={6} value={pincode} onChange={(e) => setPincode(e.target.value.replace(/\D/g, ''))} className={`${inputClass} ${border('pincode')}`} />
                    <FieldError msg={errors.pincode} />
                  </div>
                </div>
              </div>
              <div className="pt-4 flex justify-between">
                <button onClick={() => setStep(1)} className={backBtn}>← Back</button>
                <button onClick={() => next(3)} className={primaryBtn}>
                  Review Order <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: REVIEW */}
          {step === 3 && (
            <div className="space-y-5">
              <h3 className="font-serif text-lg font-bold text-charcoal">Review Your Order</h3>
              <ul className="divide-y divide-sand border border-sand bg-white">
                {cartItems.map((item) => (
                  <li key={item.product.id + (item.selectedColor ?? '')} className="flex items-center gap-3 p-3">
                    <ImageWithFallback src={item.product.images[0]} alt={item.product.name} className="w-12 h-16 object-cover shrink-0" />
                    <div className="flex-1 min-w-0 text-xs">
                      <p className="font-serif text-sm text-charcoal truncate">{item.product.name}</p>
                      <p className="text-stone-500">Qty {item.quantity}</p>
                    </div>
                    <span className="text-sm font-semibold text-charcoal">{formatINR(item.product.sellingPrice * item.quantity)}</span>
                  </li>
                ))}
              </ul>
              <div className="text-xs font-sans space-y-1.5 bg-cream/40 border border-sand p-4">
                <div className="flex justify-between"><span className="text-stone-600">Subtotal</span><span>{formatINR(subtotal)}</span></div>
                {discountAmount > 0 && <div className="flex justify-between text-emerald-800"><span>Discount</span><span>−{formatINR(discountAmount)}</span></div>}
                {giftWrapAmount > 0 && <div className="flex justify-between"><span className="text-stone-600">Gift wrap</span><span>{formatINR(giftWrapAmount)}</span></div>}
                <div className="flex justify-between"><span className="text-stone-600">Shipping</span><span>{shippingAmount ? formatINR(shippingAmount) : 'Free'}</span></div>
                <div className="flex justify-between pt-2 border-t border-sand text-sm font-bold text-burgundy-950"><span>Total to pay</span><span>{formatINR(total)}</span></div>
              </div>
              <div className="text-xs text-stone-600 bg-white border border-sand p-4">
                <p className="font-semibold uppercase tracking-wider text-charcoal mb-1">Delivering to</p>
                <p>{fullName}, {addressLine}, {city}, {state} – {pincode}</p>
                <p>{phone} · {email}</p>
              </div>
              <div className="pt-2 flex justify-between">
                <button onClick={() => setStep(2)} className={backBtn}>← Back</button>
                <button onClick={() => setStep(4)} className={primaryBtn}>
                  Continue to Payment <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 4: PAYMENT (UPI to the store) */}
          {step === 4 && (
            <div className="space-y-5">
              <div className="flex items-center justify-between">
                <h3 className="font-serif text-lg font-bold text-charcoal">Pay with UPI</h3>
                <span className="text-xs text-stone-500 flex items-center gap-1"><Lock className="w-3.5 h-3.5 text-gold-600" /> Secure UPI payment</span>
              </div>

              <div className="p-3 bg-cream/40 border border-sand text-xs flex justify-between font-sans">
                <span className="text-stone-600">Amount to pay · Order {reference}</span>
                <span className="font-bold text-burgundy-950 text-sm tabular-nums">{formatINR(total)}</span>
              </div>

              {upiReady ? (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-[auto_1fr] gap-5 items-center bg-white border border-sand p-4">
                    <div className="hidden sm:block">
                      {qr ? <img src={qr} alt="UPI payment QR code" className="w-44 h-44" /> : <div className="w-44 h-44 bg-cream animate-pulse" />}
                      <p className="mt-1 text-center text-[11px] text-stone-500">Scan with any UPI app</p>
                    </div>
                    <div className="space-y-3 text-xs">
                      <a href={upiLink} className="sm:hidden w-full inline-flex items-center justify-center gap-2 py-3.5 bg-burgundy-950 text-gold-300 font-semibold uppercase tracking-wider">
                        <Smartphone className="w-4 h-4" /> Pay {formatINR(total)} with UPI app
                      </a>
                      <p className="text-stone-600">Or pay to this UPI ID from GPay, PhonePe, Paytm or your bank app:</p>
                      <div className="flex items-center gap-2">
                        <code className="flex-1 px-3 py-2 bg-cream/60 border border-sand font-mono text-sm text-charcoal truncate">{STORE_UPI_ID}</code>
                        <button onClick={copyUpi} className="px-3 py-2 border border-sand hover:border-burgundy-950 cursor-pointer" aria-label="Copy UPI ID">
                          {copied ? <Check className="w-4 h-4 text-emerald-700" /> : <Copy className="w-4 h-4" />}
                        </button>
                      </div>
                      <p className="text-stone-500">Please pay exactly <strong>{formatINR(total)}</strong>.</p>
                    </div>
                  </div>

                  <div className="text-xs">
                    <label htmlFor="co-utr" className="block font-semibold uppercase tracking-wider text-charcoal mb-1">UPI Transaction ID (UTR)</label>
                    <input
                      id="co-utr"
                      inputMode="numeric"
                      maxLength={12}
                      value={utr}
                      onChange={(e) => setUtr(e.target.value.replace(/\D/g, ''))}
                      placeholder="12-digit number shown after payment"
                      className={`${inputClass} ${border('utr')} font-mono tracking-wider`}
                    />
                    <FieldError msg={errors.utr} />
                    <p className="mt-1 text-[11px] text-stone-500">Find it in your UPI app under the payment details.</p>
                  </div>
                </>
              ) : (
                <div className="flex gap-3 p-4 bg-amber-50 border border-amber-200 text-xs text-amber-900">
                  <Info className="w-4 h-4 shrink-0 mt-0.5" />
                  <p>Online UPI payment is being set up. Place your order now and we&apos;ll send the payment details to you on WhatsApp.</p>
                </div>
              )}

              <div className="pt-2 flex justify-between items-center">
                <button onClick={() => setStep(3)} className={backBtn}>← Back</button>
                <button onClick={placeOrder} className={primaryBtn}>
                  {upiReady ? "I've paid — place order" : 'Place order'} <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 5: ORDER RECEIVED */}
          {step === 5 && placed && (
            <div className="py-6 text-center space-y-5">
              <div className="w-16 h-16 rounded-full bg-emerald-50 border-2 border-emerald-600 text-emerald-700 flex items-center justify-center mx-auto animate-in zoom-in">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <div>
                <h3 className="font-serif text-3xl font-bold text-burgundy-950">Thank you! Order received</h3>
                <p className="text-xs text-stone-600 mt-2 font-sans max-w-md mx-auto">
                  {upiReady
                    ? "We're checking your UPI payment. Once it's verified, we'll confirm your order on WhatsApp and email."
                    : "We'll message you on WhatsApp with the payment details to confirm your order."}
                </p>
              </div>
              <div className="bg-cream/40 p-4 border border-sand text-xs font-sans max-w-md mx-auto text-left space-y-1.5">
                <div className="flex justify-between"><span className="text-stone-500">Order ID</span><span className="font-semibold text-charcoal">{placed.number}</span></div>
                <div className="flex justify-between"><span className="text-stone-500">Amount</span><span className="font-semibold text-charcoal">{formatINR(placed.total)}</span></div>
                <div className="flex justify-between items-center">
                  <span className="text-stone-500">Payment</span>
                  <span className="inline-flex items-center gap-1 font-semibold text-amber-800"><Clock className="w-3.5 h-3.5" /> Awaiting verification</span>
                </div>
                <div className="flex justify-between"><span className="text-stone-500">Delivering to</span><span className="font-semibold text-charcoal text-right">{city}, {pincode}</span></div>
              </div>
              <div className="pt-2 flex justify-center">
                <button onClick={onClose} className={primaryBtn}>Continue shopping</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
