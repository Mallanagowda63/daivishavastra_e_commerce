import React from 'react';
import { CheckCircle2, Clock, Package, Truck, Home, Wallet } from 'lucide-react';
import { OrderStatus } from '../../types';

interface OrderTimelineProps {
  status: OrderStatus;
}

export const OrderTimeline: React.FC<OrderTimelineProps> = ({ status }) => {
  const steps = [
    { key: 'Pending', label: 'Payment Verification', icon: Wallet },
    { key: 'Confirmed', label: 'Order Confirmed', icon: CheckCircle2 },
    { key: 'Packed', label: 'Hand-Packed', icon: Package },
    { key: 'Shipped', label: 'Shipped (In Transit)', icon: Truck },
    { key: 'Out for Delivery', label: 'Out for Delivery', icon: Clock },
    { key: 'Delivered', label: 'Delivered to Doorstep', icon: Home },
  ];

  const getStepIndex = (st: OrderStatus) => {
    switch (st) {
      case 'Pending':
        return 0;
      case 'Confirmed':
        return 1;
      case 'Packed':
        return 2;
      case 'Shipped':
        return 3;
      case 'Out for Delivery':
        return 4;
      case 'Delivered':
        return 5;
      default:
        return 0;
    }
  };

  const currentIndex = getStepIndex(status);

  return (
    <div className="py-4">
      <div className="relative flex items-center justify-between">
        {/* Background track line */}
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-0.5 bg-sand -z-0" />
        <div
          className="absolute left-0 top-1/2 -translate-y-1/2 h-0.5 bg-gold-600 transition-all duration-500 -z-0"
          style={{ width: `${(currentIndex / (steps.length - 1)) * 100}%` }}
        />

        {steps.map((step, idx) => {
          const isDone = idx <= currentIndex;
          const isCurrent = idx === currentIndex;
          const Icon = step.icon;

          return (
            <div key={step.key} className="flex flex-col items-center relative z-10">
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center transition-colors ${
                  isDone
                    ? 'bg-burgundy-950 text-gold-300 ring-2 ring-gold-500/40'
                    : 'bg-white text-stone-300 border border-sand'
                } ${isCurrent ? 'scale-110' : ''}`}
              >
                <Icon className="w-3.5 h-3.5" />
              </div>
              <span
                className={`text-[10px] font-medium uppercase tracking-wider mt-2 hidden sm:block ${
                  isDone ? 'text-charcoal font-semibold' : 'text-stone-400'
                }`}
              >
                {step.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
