import React, { useState } from 'react';
import { MapPin, CheckCircle, Truck, Clock } from 'lucide-react';

export const DeliveryChecker: React.FC = () => {
  const [pincode, setPincode] = useState('');
  const [deliveryResult, setDeliveryResult] = useState<{
    city: string;
    deliveryDate: string;
    isCodAvailable: boolean;
  } | null>(null);
  const [error, setError] = useState('');

  const handleCheck = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanPin = pincode.trim();

    if (!/^\d{6}$/.test(cleanPin)) {
      setError('Please enter a valid 6-digit Indian PIN code.');
      setDeliveryResult(null);
      return;
    }

    setError('');
    // Calculate realistic delivery date ~3-4 days ahead
    const today = new Date();
    const deliveryDateObj = new Date(today);
    deliveryDateObj.setDate(today.getDate() + 3);

    const formattedDate = deliveryDateObj.toLocaleDateString('en-IN', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    });

    let city = 'Metro Region';
    if (cleanPin.startsWith('11') || cleanPin.startsWith('20')) city = 'Delhi NCR';
    else if (cleanPin.startsWith('40') || cleanPin.startsWith('41')) city = 'Mumbai & Pune';
    else if (cleanPin.startsWith('56') || cleanPin.startsWith('57')) city = 'Bengaluru';
    else if (cleanPin.startsWith('60') || cleanPin.startsWith('61') || cleanPin.startsWith('62')) city = 'Chennai';
    else if (cleanPin.startsWith('70') || cleanPin.startsWith('71')) city = 'Kolkata';
    else if (cleanPin.startsWith('50')) city = 'Hyderabad';
    else if (cleanPin.startsWith('30')) city = 'Jaipur';
    else if (cleanPin.startsWith('38')) city = 'Ahmedabad';

    setDeliveryResult({
      city,
      deliveryDate: formattedDate,
      isCodAvailable: true,
    });
  };

  return (
    <div className="py-4 border-t border-b border-sand space-y-3">
      <div className="flex items-center gap-2 text-xs font-semibold tracking-wider uppercase text-charcoal">
        <MapPin className="w-3.5 h-3.5 text-burgundy-900" />
        <span>Delivery & Availability</span>
      </div>

      <form onSubmit={handleCheck} className="flex gap-2">
        <input
          type="text"
          value={pincode}
          onChange={(e) => setPincode(e.target.value.slice(0, 6))}
          placeholder="Enter 6-digit PIN code"
          maxLength={6}
          className="flex-1 px-3 py-2 text-xs bg-white border border-sand focus:border-burgundy-900 focus:outline-none placeholder:text-stone-400 font-sans"
        />
        <button
          type="submit"
          className="px-4 py-2 bg-charcoal text-ivory text-xs font-semibold uppercase tracking-wider hover:bg-burgundy-950 transition-colors"
        >
          Check
        </button>
      </form>

      {error && <p className="text-xs text-red-600 font-sans">{error}</p>}

      {deliveryResult && (
        <div className="bg-cream/40 p-3 border border-sand/60 space-y-1.5 animate-in fade-in text-xs font-sans">
          <div className="flex items-center gap-2 text-emerald-800 font-medium">
            <CheckCircle className="w-4 h-4 shrink-0 text-emerald-700" />
            <span>Delivering to <strong>{deliveryResult.city}</strong></span>
          </div>
          <div className="flex items-center gap-2 text-stone-600">
            <Truck className="w-3.5 h-3.5 text-stone-400 shrink-0" />
            <span>Estimated delivery by <strong className="text-charcoal">{deliveryResult.deliveryDate}</strong></span>
          </div>
          <div className="flex items-center gap-2 text-stone-600">
            <Clock className="w-3.5 h-3.5 text-stone-400 shrink-0" />
            <span>Prepaid orders only · UPI, cards &amp; net banking</span>
          </div>
        </div>
      )}
    </div>
  );
};
