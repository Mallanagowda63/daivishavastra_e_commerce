import React, { useEffect, useMemo, useRef, useState } from 'react';
import { ArrowRight, CalendarDays, IndianRupee, Layers, ShoppingBag } from 'lucide-react';
import { useAdmin } from '../../context/AdminContext';
import { Badge, Button, Card, SelectMenu, StatCard } from './adminUi';
import { bookingTone, fulfilmentTone, paymentTone } from './statusTones';
import { formatDate, formatINR, formatTime12, paymentStatusOf, productStatusOf, todayISO } from './adminUtils';
import type { AdminPage } from './AdminDashboard';

type Range = 'month' | '7d' | '30d';

const isoOf = (d: Date) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;

const rangeDays = (range: Range): string[] => {
  const end = new Date();
  const start = new Date(end);
  if (range === 'month') start.setDate(1);
  else start.setDate(end.getDate() - (range === '7d' ? 6 : 29));
  const days: string[] = [];
  for (const d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) days.push(isoOf(d));
  return days;
};

/** Monotone cubic path through points, so the curve never overshoots between days. */
const smoothPath = (pts: [number, number][]) => {
  if (pts.length < 2) return pts.length ? `M${pts[0][0]} ${pts[0][1]}` : '';
  const n = pts.length;
  const dx = pts.slice(1).map((p, i) => p[0] - pts[i][0]);
  const m = pts.slice(1).map((p, i) => (p[1] - pts[i][1]) / dx[i]);
  const t = pts.map((_, i) => {
    if (i === 0) return m[0];
    if (i === n - 1) return m[n - 2];
    return m[i - 1] * m[i] <= 0 ? 0 : (m[i - 1] + m[i]) / 2;
  });
  let d = `M${pts[0][0].toFixed(1)} ${pts[0][1].toFixed(1)}`;
  for (let i = 0; i < n - 1; i++) {
    const h = dx[i] / 3;
    d += ` C${(pts[i][0] + h).toFixed(1)} ${(pts[i][1] + t[i] * h).toFixed(1)} ${(pts[i + 1][0] - h).toFixed(1)} ${(pts[i + 1][1] - t[i + 1] * h).toFixed(1)} ${pts[i + 1][0].toFixed(1)} ${pts[i + 1][1].toFixed(1)}`;
  }
  return d;
};

/** Single-series area chart sized to its container, with crosshair + tooltip; one axis, recessive grid. */
const RevenueChart: React.FC<{ data: { date: string; value: number }[] }> = ({ data }) => {
  const boxRef = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState({ w: 640, h: 240 });
  const [hover, setHover] = useState<number | null>(null);

  useEffect(() => {
    const el = boxRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect;
      if (width > 0 && height > 0) setSize({ w: width, h: height });
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const { w: W, h: H } = size;
  const L = 48, R = 16, T = 14, B = 30;
  const max = Math.max(10000, ...data.map((d) => d.value));
  const step = Math.pow(10, Math.floor(Math.log10(max)));
  const top = Math.ceil(max / step) * step;
  const x = (i: number) => L + (data.length <= 1 ? 0 : (i / (data.length - 1)) * (W - L - R));
  const y = (v: number) => T + (1 - v / top) * (H - T - B);
  const pts = data.map((d, i) => [x(i), y(d.value)] as [number, number]);
  const line = smoothPath(pts);
  const area = `${line} L${x(data.length - 1)} ${y(0)} L${x(0)} ${y(0)} Z`;
  const ticks = [0, top / 2, top];
  const labelEvery = Math.max(1, Math.ceil(data.length / Math.max(2, Math.floor((W - L - R) / 70))));
  const fmtTick = (t: number) => (t >= 100000 ? `₹${(t / 100000).toFixed(t % 100000 ? 1 : 0)}L` : t >= 1000 ? `₹${Math.round(t / 1000)}k` : `₹${t}`);

  const onMove = (e: React.MouseEvent<SVGRectElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const frac = (e.clientX - rect.left) / rect.width;
    setHover(Math.max(0, Math.min(data.length - 1, Math.round(frac * (data.length - 1)))));
  };

  return (
    <div ref={boxRef} className="relative flex-1 min-h-[220px]">
      <svg width={W} height={H} className="absolute inset-0 block" role="img" aria-label="Daily revenue chart">
        {ticks.map((t) => (
          <g key={t}>
            <line x1={L} x2={W - R} y1={y(t)} y2={y(t)} stroke="#ece4d7" strokeWidth="1" />
            <text x={L - 10} y={y(t) + 4} textAnchor="end" className="fill-stone-400" fontSize="11">
              {fmtTick(t)}
            </text>
          </g>
        ))}
        <path d={area} fill="#6f1b31" fillOpacity="0.1" />
        <path d={line} fill="none" stroke="#6f1b31" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />
        {data.map((d, i) => {
          const last = i === data.length - 1;
          if (!(i % labelEvery === 0 || last)) return null;
          // Skip a regular label that would collide with the final one.
          if (!last && data.length - 1 - i < labelEvery / 2) return null;
          return (
            <text
              key={d.date}
              x={x(i)}
              y={H - 8}
              textAnchor={i === 0 ? 'start' : last ? 'end' : 'middle'}
              className="fill-stone-400"
              fontSize="11"
            >
              {new Date(`${d.date}T00:00:00`).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })}
            </text>
          );
        })}
        {hover !== null && (
          <g pointerEvents="none">
            <line x1={x(hover)} x2={x(hover)} y1={T} y2={y(0)} stroke="#a8a29e" strokeDasharray="3 3" />
            <circle cx={x(hover)} cy={y(data[hover].value)} r="5" fill="#6f1b31" stroke="#fffdf9" strokeWidth="2" />
          </g>
        )}
        <rect x={L} y={T} width={Math.max(0, W - L - R)} height={Math.max(0, H - T - B)} fill="transparent" onMouseMove={onMove} onMouseLeave={() => setHover(null)} />
      </svg>
      {hover !== null && (
        <div
          className="absolute pointer-events-none rounded-md bg-charcoal text-ivory px-2.5 py-1.5 text-xs shadow-lg whitespace-nowrap"
          style={{
            left: Math.min(Math.max(x(hover), 70), W - 70),
            top: Math.max(0, y(data[hover].value) - 40),
            transform: 'translateX(-50%)',
          }}
        >
          <span className="text-stone-300">{formatDate(data[hover].date)}</span>
          <span className="ml-2 font-semibold">{formatINR(data[hover].value)}</span>
        </div>
      )}
    </div>
  );
};

export const OverviewPage: React.FC<{ go: (page: AdminPage) => void }> = ({ go }) => {
  const { orders, products, bookings } = useAdmin();
  const [range, setRange] = useState<Range>('month');

  const days = useMemo(() => rangeDays(range), [range]);
  const inRange = useMemo(() => orders.filter((o) => o.date >= days[0] && o.date <= days[days.length - 1]), [orders, days]);
  const prevRange = useMemo(() => {
    const span = days.length;
    const start = new Date(`${days[0]}T00:00:00`);
    const prevEnd = new Date(start);
    prevEnd.setDate(start.getDate() - 1);
    const prevStart = new Date(prevEnd);
    prevStart.setDate(prevEnd.getDate() - (span - 1));
    return orders.filter((o) => o.date >= isoOf(prevStart) && o.date <= isoOf(prevEnd));
  }, [orders, days]);

  const revenueOf = (list: typeof orders) => list.filter((o) => paymentStatusOf(o) !== 'Refunded').reduce((s, o) => s + o.total, 0);
  const revenue = revenueOf(inRange);
  const prevRevenue = revenueOf(prevRange);
  const change = prevRevenue ? ((revenue - prevRevenue) / prevRevenue) * 100 : null;
  const paidCount = inRange.filter((o) => paymentStatusOf(o) === 'Paid').length;
  const awaiting = inRange.filter((o) => paymentStatusOf(o) === 'Pending').length;

  const today = todayISO();
  const upcoming = bookings
    .filter((b) => b.date >= today && (b.status === 'Pending' || b.status === 'Confirmed'))
    .sort((a, b) => (a.date + a.time).localeCompare(b.date + b.time));
  const needConfirm = upcoming.filter((b) => b.status === 'Pending').length;

  const published = products.filter((p) => productStatusOf(p) === 'published').length;
  const drafts = products.filter((p) => productStatusOf(p) === 'draft').length;
  const archived = products.filter((p) => productStatusOf(p) === 'archived').length;

  const chartData = days.map((d) => ({ date: d, value: revenueOf(orders.filter((o) => o.date === d)) }));
  const recent = [...orders].sort((a, b) => b.date.localeCompare(a.date) || b.orderNumber.localeCompare(a.orderNumber)).slice(0, 5);

  return (
    <>
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-7">
        <div>
          <h1 className="font-serif text-3xl sm:text-4xl text-charcoal">The store, at a glance</h1>
          <p className="mt-1.5 text-sm text-stone-500">
            {new Date().toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })} · Here's how your store is doing.
          </p>
        </div>
        <SelectMenu
          label="Date range"
          value={range}
          onChange={(v) => setRange(v as Range)}
          options={[
            { value: 'month', label: 'This month' },
            { value: '7d', label: 'Last 7 days' },
            { value: '30d', label: 'Last 30 days' },
          ]}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard
          label="Revenue"
          value={formatINR(revenue)}
          icon={<IndianRupee className="w-4 h-4" />}
          note={
            change === null
              ? `Avg. ${formatINR(inRange.length ? revenue / inRange.length : 0)} per order`
              : `${change >= 0 ? '↑' : '↓'} ${Math.abs(change).toFixed(1)}% vs. previous period`
          }
        />
        <StatCard label="Orders" value={String(inRange.length)} icon={<ShoppingBag className="w-4 h-4" />} note={`${paidCount} paid · ${awaiting} awaiting payment`} />
        <StatCard
          label="Upcoming bookings"
          value={String(upcoming.length)}
          icon={<CalendarDays className="w-4 h-4" />}
          note={`${upcoming.length - needConfirm} confirmed · ${needConfirm} pending`}
        />
        <StatCard label="Published sarees" value={String(published)} icon={<Layers className="w-4 h-4" />} note={`${drafts} draft · ${archived} archived`} />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)] gap-4 mt-4">
        <Card className="p-5 flex flex-col">
          <h2 className="font-sans text-base font-semibold text-charcoal">Revenue trend</h2>
          <p className="text-xs text-stone-500 mt-0.5 mb-4">Daily revenue · INR · refunds excluded</p>
          <RevenueChart data={chartData} />
        </Card>

        <Card className="flex flex-col">
          <div className="flex items-start justify-between p-5 pb-3">
            <div>
              <h2 className="font-sans text-base font-semibold text-charcoal">Next appointments</h2>
              <p className="text-xs text-stone-500 mt-0.5">Upcoming · all times IST</p>
            </div>
            <button onClick={() => go('bookings')} className="text-xs font-semibold text-burgundy-800 hover:underline cursor-pointer">
              View all →
            </button>
          </div>
          <ul className="divide-y divide-[#efe8dc] border-t border-[#efe8dc] flex-1">
            {upcoming.slice(0, 3).map((b) => {
              const d = new Date(`${b.date}T00:00:00`);
              return (
                <li key={b.id} className="flex items-center gap-3 px-5 py-3.5">
                  <div className="w-11 shrink-0 rounded-md bg-[#f4ecdf] text-center py-1">
                    <p className="text-base font-semibold text-charcoal leading-tight">{d.getDate()}</p>
                    <p className="text-[10px] uppercase text-stone-500">{d.toLocaleDateString('en-GB', { month: 'short' })}</p>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-charcoal truncate">{b.customerName}</p>
                    <p className="text-xs text-stone-500">
                      {b.service} · {formatTime12(b.time)}
                    </p>
                  </div>
                  <Badge tone={bookingTone(b.status)}>{b.status}</Badge>
                </li>
              );
            })}
            {upcoming.length === 0 && <li className="px-5 py-10 text-center text-sm text-stone-400">No upcoming appointments.</li>}
          </ul>
          {needConfirm > 0 && (
            <p className="px-5 py-3 bg-[#f6f0e6] rounded-b-xl text-xs text-stone-600">
              {needConfirm} appointment{needConfirm > 1 ? 's' : ''} need{needConfirm > 1 ? '' : 's'} your confirmation.
            </p>
          )}
        </Card>
      </div>

      <Card className="mt-4 overflow-hidden">
        <div className="flex items-center justify-between p-5">
          <div>
            <h2 className="font-sans text-base font-semibold text-charcoal">Recent orders</h2>
            <p className="text-xs text-stone-500 mt-0.5">Latest orders from your store</p>
          </div>
          <Button variant="secondary" onClick={() => go('orders')}>
            View orders <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-[#f6f0e6] text-[11px] uppercase tracking-wider text-stone-500">
                <th className="px-5 py-3 text-left font-medium">Order</th>
                <th className="px-5 py-3 text-left font-medium">Customer / Saree</th>
                <th className="px-5 py-3 text-right font-medium">Amount</th>
                <th className="px-5 py-3 text-left font-medium">Payment</th>
                <th className="px-5 py-3 text-left font-medium">Fulfilment</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#efe8dc]">
              {recent.map((o) => (
                <tr key={o.id}>
                  <td className="px-5 py-3">
                    <p className="font-semibold text-burgundy-800">{o.orderNumber}</p>
                    <p className="text-xs text-stone-500">{formatDate(o.date)}</p>
                  </td>
                  <td className="px-5 py-3">
                    <p className="font-medium text-charcoal">{o.shippingAddress.fullName}</p>
                    <p className="text-xs text-stone-500 truncate max-w-[260px]">{o.items[0]?.name}</p>
                  </td>
                  <td className="px-5 py-3 text-right font-semibold text-charcoal">{formatINR(o.total)}</td>
                  <td className="px-5 py-3">
                    <Badge tone={paymentTone(paymentStatusOf(o))}>{paymentStatusOf(o)}</Badge>
                  </td>
                  <td className="px-5 py-3">
                    <Badge tone={fulfilmentTone(o.status)}>{o.status}</Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </>
  );
};
