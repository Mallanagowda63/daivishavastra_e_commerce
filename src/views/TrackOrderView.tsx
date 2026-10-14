import React, { useState } from 'react';
import { Search, Package, Truck, CheckCircle2, Clock } from 'lucide-react';
import { useAdmin } from '../context/AdminContext';
import { OrderTimeline } from '../components/account/OrderTimeline';
import { Order } from '../types';
import { ImageWithFallback } from '../components/common/ImageWithFallback';

export const TrackOrderView: React.FC = () => {
  const { getOrderById, orders } = useAdmin();
  const [searchInput, setSearchInput] = useState('');
  const [foundOrder, setFoundOrder] = useState<Order | null>(orders[0] || null);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setHasSearched(true);
    const res = getOrderById(searchInput);
    setFoundOrder(res || null);
  };

  return (
    <div className="py-12 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <span className="text-xs uppercase tracking-[0.2em] text-gold-700 font-semibold">
          Live White-Glove Dispatch
        </span>
        <h1 className="font-serif text-3xl sm:text-5xl font-bold text-burgundy-950">
          Track Your Saree Shipment
        </h1>
        <p className="text-sm text-stone-600 font-sans">
          Enter your Daivisha Vastra Order ID (e.g. DV-98241) or Tracking Number to view live transit progress.
        </p>
      </div>

      {/* Search Input Box */}
      <form onSubmit={handleSearch} className="flex gap-2 max-w-lg mx-auto">
        <input
          type="text"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          placeholder="Enter Order ID (e.g. DV-98241)"
          className="flex-1 px-4 py-3 bg-white border border-sand focus:border-burgundy-950 focus:outline-none text-xs font-sans placeholder:text-stone-400"
        />
        <button
          type="submit"
          className="px-6 py-3 bg-burgundy-950 text-gold-300 font-semibold text-xs tracking-wider uppercase hover:bg-burgundy-900 transition-colors flex items-center gap-1.5"
        >
          <Search className="w-4 h-4" />
          <span>Track</span>
        </button>
      </form>

      {/* Found Order Card */}
      {foundOrder ? (
        <div className="bg-white border border-sand p-6 sm:p-8 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-sand pb-4">
            <div>
              <span className="text-xs uppercase tracking-widest text-stone-400 font-semibold block">
                Active Consignment
              </span>
              <h2 className="font-serif text-2xl font-bold text-burgundy-950">
                {foundOrder.orderNumber}
              </h2>
              <p className="text-xs text-stone-500 font-sans mt-0.5">
                Booked on {foundOrder.date} · Payment: {foundOrder.paymentMethod}
              </p>
            </div>

            <div className="text-left sm:text-right">
              <span className="text-xs font-bold text-burgundy-950 bg-cream px-3 py-1.5 uppercase tracking-wider inline-block">
                Status: {foundOrder.status}
              </span>
              <p className="text-xs text-emerald-800 font-medium mt-1">
                Estimated Delivery: {foundOrder.estimatedDelivery}
              </p>
            </div>
          </div>

          {/* Interactive Visual Timeline */}
          <div>
            <h3 className="text-xs uppercase tracking-wider font-semibold text-charcoal mb-2">
              Dispatch Progression
            </h3>
            <OrderTimeline status={foundOrder.status} />
          </div>

          {/* Carrier Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-cream/30 p-4 border border-sand/70 text-xs font-sans">
            <div>
              <span className="text-stone-500 block">Courier Carrier:</span>
              <span className="font-semibold text-charcoal">{foundOrder.carrier}</span>
            </div>
            <div>
              <span className="text-stone-500 block">Tracking Number:</span>
              <span className="font-semibold text-charcoal">{foundOrder.trackingNumber}</span>
            </div>
            <div className="sm:col-span-2">
              <span className="text-stone-500 block">Delivery Destination:</span>
              <span className="font-medium text-charcoal">
                {foundOrder.shippingAddress.fullName}, {foundOrder.shippingAddress.addressLine}, {foundOrder.shippingAddress.city} - {foundOrder.shippingAddress.pincode}
              </span>
            </div>
          </div>

          {/* Items in Consignment */}
          <div className="space-y-3 pt-2">
            <h4 className="text-xs uppercase tracking-wider font-semibold text-charcoal">
              Items in this Shipment
            </h4>
            {foundOrder.items.map((it) => (
              <div key={it.id} className="flex items-center gap-4 text-xs font-sans border-t border-sand/50 pt-3">
                <div className="w-16 aspect-[3/4] bg-[#f1e9df] overflow-hidden shrink-0">
                  <ImageWithFallback src={it.image} alt={it.name} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1">
                  <h5 className="font-serif font-semibold text-sm text-charcoal">{it.name}</h5>
                  <p className="text-stone-500 text-[11px]">Color: {it.color || 'Standard'} · Quantity: {it.quantity}</p>
                  <p className="font-bold text-burgundy-950 tabular-nums mt-0.5">₹{it.price.toLocaleString('en-IN')}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : hasSearched ? (
        <div className="py-16 text-center text-xs font-sans text-stone-500 bg-white border border-sand p-6">
          <p className="font-serif text-lg text-charcoal">No shipment found matching &ldquo;{searchInput}&rdquo;</p>
          <p className="mt-1">Please check your Order Confirmation email or SMS for your exact Order ID (e.g. DV-98241).</p>
        </div>
      ) : null}
    </div>
  );
};
