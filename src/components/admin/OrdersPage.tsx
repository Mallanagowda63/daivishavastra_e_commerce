import React, { useMemo, useState } from 'react';
import { ArrowUpRight, ChevronLeft, ChevronRight, Download, Info, Plus } from 'lucide-react';
import { useAdmin } from '../../context/AdminContext';
import { Order, OrderStatus, PaymentStatus } from '../../types';
import { Badge, Button, Card, EmptyRow, Field, PageHeader, SearchInput, SelectMenu, SidePanel, TableShell, Tabs, inputClass } from './adminUi';
import { fulfilmentTone, paymentTone } from './statusTones';
import { downloadCSV, formatDate, formatINR, localISO, paymentKind, paymentStatusOf, productStatusOf, todayISO } from './adminUtils';

const STATUSES: OrderStatus[] = ['Pending', 'Confirmed', 'Packed', 'Shipped', 'Out for Delivery', 'Delivered', 'Cancelled'];
const TO_FULFIL: OrderStatus[] = ['Pending', 'Confirmed', 'Packed'];
const IN_TRANSIT: OrderStatus[] = ['Shipped', 'Out for Delivery'];
const PAGE_SIZE = 10;

type TabId = 'all' | 'fulfil' | 'shipped' | 'completed';
type DateRange = 'all' | 'today' | '7d' | 'month';

const inDateRange = (date: string, range: DateRange) => {
  if (range === 'all') return true;
  const today = todayISO();
  if (range === 'today') return date === today;
  if (range === 'month') return date.slice(0, 7) === today.slice(0, 7);
  const d = new Date();
  d.setDate(d.getDate() - 6);
  return date >= localISO(d);
};

const OrderDetail: React.FC<{ order: Order; onClose: () => void }> = ({ order, onClose }) => {
  const { updateOrderStatus, updateOrder } = useAdmin();
  const pay = paymentStatusOf(order);
  const a = order.shippingAddress;
  return (
    <SidePanel title={order.orderNumber} subtitle={`Placed ${formatDate(order.date)} · ${order.paymentMethod}`} onClose={onClose}>
      <div className="space-y-6 text-sm">
        <section>
          <h3 className="font-sans text-[11px] uppercase tracking-wider text-stone-500 mb-2">Customer</h3>
          <p className="font-semibold text-charcoal">{a.fullName}</p>
          <p className="text-stone-600">{a.phone}</p>
          <p className="text-stone-600">{[a.addressLine, a.city, a.state, a.pincode].filter(Boolean).join(', ')}</p>
        </section>

        <section>
          <h3 className="font-sans text-[11px] uppercase tracking-wider text-stone-500 mb-2">Items</h3>
          <ul className="space-y-3">
            {order.items.map((it) => (
              <li key={it.id + (it.color ?? '')} className="flex gap-3">
                <img src={it.image} alt="" className="w-12 h-14 rounded object-cover bg-sand" />
                <div className="flex-1">
                  <p className="font-medium text-charcoal leading-snug">{it.name}</p>
                  <p className="text-xs text-stone-500">
                    {it.quantity} × {formatINR(it.price)}
                    {it.color ? ` · ${it.color}` : ''}
                  </p>
                </div>
              </li>
            ))}
          </ul>
          <div className="mt-4 pt-3 border-t border-[#ebe3d6] space-y-1 text-stone-600">
            <div className="flex justify-between"><span>Subtotal</span><span>{formatINR(order.subtotal)}</span></div>
            {order.discount > 0 && <div className="flex justify-between"><span>Discount</span><span>−{formatINR(order.discount)}</span></div>}
            <div className="flex justify-between"><span>Shipping</span><span>{order.shipping ? formatINR(order.shipping) : 'Free'}</span></div>
            <div className="flex justify-between font-semibold text-charcoal pt-1"><span>Total</span><span>{formatINR(order.total)}</span></div>
          </div>
        </section>

        <section>
          <h3 className="font-sans text-[11px] uppercase tracking-wider text-stone-500 mb-2">Fulfilment</h3>
          <select className={inputClass} value={order.status} onChange={(e) => updateOrderStatus(order.id, e.target.value as OrderStatus)}>
            {STATUSES.map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>
          <p className="mt-2 text-xs text-stone-500">
            {order.carrier} · {order.trackingNumber} · ETA {order.estimatedDelivery}
          </p>
        </section>

        <section>
          <h3 className="font-sans text-[11px] uppercase tracking-wider text-stone-500 mb-2">Payment</h3>
          <div className="flex items-center justify-between">
            <Badge tone={paymentTone(pay)}>{pay}</Badge>
            {pay === 'Pending' && (
              <Button variant="secondary" onClick={() => updateOrder(order.id, { paymentStatus: 'Paid', paymentDate: new Date().toISOString() })}>
                Mark payment received
              </Button>
            )}
            {pay === 'Paid' && order.status === 'Cancelled' && (
              <Button variant="secondary" onClick={() => updateOrder(order.id, { paymentStatus: 'Refunded' })}>
                Mark refunded
              </Button>
            )}
          </div>
        </section>
      </div>
    </SidePanel>
  );
};

const AddOrderPanel: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const { products, addManualOrder } = useAdmin();
  const available = products.filter((p) => productStatusOf(p) === 'published' && p.stock > 0);
  const [productId, setProductId] = useState(available[0]?.id ?? '');
  const [qty, setQty] = useState(1);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [method, setMethod] = useState('UPI');
  const [paid, setPaid] = useState<PaymentStatus>('Paid');
  const [error, setError] = useState('');
  const product = products.find((p) => p.id === productId);

  const submit = () => {
    if (!product || !name.trim() || !phone.trim()) {
      setError('Choose a saree and enter the customer name and phone.');
      return;
    }
    if (qty > product.stock) {
      setError(`Only ${product.stock} in stock.`);
      return;
    }
    const total = product.sellingPrice * qty;
    const date = todayISO();
    const eta = new Date();
    eta.setDate(eta.getDate() + 5);
    addManualOrder({
      date,
      items: [{ id: product.id, name: product.name, image: product.images[0], price: product.sellingPrice, quantity: qty }],
      subtotal: total,
      discount: 0,
      shipping: 0,
      total,
      status: 'Confirmed',
      paymentMethod: method === 'COD' ? 'Cash on Delivery (COD)' : method,
      paymentStatus: paid,
      ...(paid === 'Paid' ? { paymentDate: new Date().toISOString() } : {}),
      shippingAddress: { fullName: name.trim(), phone: phone.trim(), addressLine: '', city: city.trim(), state: state.trim(), pincode: '' },
      trackingNumber: '—',
      carrier: 'To be assigned',
      estimatedDelivery: eta.toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }),
    });
    onClose();
  };

  return (
    <SidePanel
      title="Add order"
      subtitle="Record a phone, WhatsApp or in-store sale."
      onClose={onClose}
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>Cancel</Button>
          <Button onClick={submit}>Add order</Button>
        </>
      }
    >
      <div className="space-y-4">
        <Field label="Saree" required>
          <select className={inputClass} value={productId} onChange={(e) => setProductId(e.target.value)}>
            {available.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name} — {formatINR(p.sellingPrice)} ({p.stock} left)
              </option>
            ))}
          </select>
        </Field>
        <Field label="Quantity" required>
          <input type="number" min={1} className={inputClass} value={qty} onChange={(e) => setQty(Math.max(1, Number(e.target.value)))} />
        </Field>
        <Field label="Customer name" required>
          <input className={inputClass} value={name} onChange={(e) => setName(e.target.value)} />
        </Field>
        <Field label="Phone" required>
          <input className={inputClass} value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+91" />
        </Field>
        <div className="grid grid-cols-2 gap-3">
          <Field label="City"><input className={inputClass} value={city} onChange={(e) => setCity(e.target.value)} /></Field>
          <Field label="State"><input className={inputClass} value={state} onChange={(e) => setState(e.target.value)} /></Field>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Payment method">
            <select className={inputClass} value={method} onChange={(e) => setMethod(e.target.value)}>
              {['UPI', 'Credit Card', 'Debit Card', 'Net Banking', 'Cash (in store)'].map((m) => <option key={m}>{m}</option>)}
            </select>
          </Field>
          <Field label="Payment status">
            <select className={inputClass} value={paid} onChange={(e) => setPaid(e.target.value as PaymentStatus)}>
              <option>Paid</option>
              <option>Pending</option>
            </select>
          </Field>
        </div>
        {product && <p className="text-sm text-charcoal">Total: <strong>{formatINR(product.sellingPrice * qty)}</strong></p>}
        {error && <p className="text-sm text-rose-700">{error}</p>}
      </div>
    </SidePanel>
  );
};

export const OrdersPage: React.FC = () => {
  const { orders } = useAdmin();
  const [tab, setTab] = useState<TabId>('all');
  const [query, setQuery] = useState('');
  const [range, setRange] = useState<DateRange>('all');
  const [payment, setPayment] = useState('all');
  const [fulfil, setFulfil] = useState('all');
  const [page, setPage] = useState(1);
  const [viewing, setViewing] = useState<string | null>(null);
  const [adding, setAdding] = useState(false);

  const sorted = useMemo(() => [...orders].sort((a, b) => b.date.localeCompare(a.date) || b.orderNumber.localeCompare(a.orderNumber)), [orders]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return sorted.filter((o) => {
      if (tab === 'fulfil' && !TO_FULFIL.includes(o.status)) return false;
      if (tab === 'shipped' && !IN_TRANSIT.includes(o.status)) return false;
      if (tab === 'completed' && o.status !== 'Delivered' && o.status !== 'Cancelled') return false;
      if (!inDateRange(o.date, range)) return false;
      if (payment !== 'all' && paymentStatusOf(o) !== payment) return false;
      if (fulfil !== 'all' && o.status !== fulfil) return false;
      return !q || o.orderNumber.toLowerCase().includes(q) || o.shippingAddress.fullName.toLowerCase().includes(q) || o.shippingAddress.phone.includes(q);
    });
  }, [sorted, tab, query, range, payment, fulfil]);

  const pages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const current = Math.min(page, pages);
  const rows = filtered.slice((current - 1) * PAGE_SIZE, current * PAGE_SIZE);
  const reset = () => setPage(1);

  const paidValue = orders.filter((o) => paymentStatusOf(o) === 'Paid').reduce((s, o) => s + o.total, 0);
  const toFulfil = orders.filter((o) => TO_FULFIL.includes(o.status)).length;
  const payPending = orders.filter((o) => paymentStatusOf(o) === 'Pending').length;
  const viewingOrder = orders.find((o) => o.id === viewing);

  const exportCSV = () =>
    downloadCSV('daivisha-orders.csv', [
      ['Order', 'Date', 'Customer', 'Phone', 'City', 'Items', 'Amount (INR)', 'Payment method', 'Payment', 'Fulfilment'],
      ...filtered.map((o) => [
        o.orderNumber, o.date, o.shippingAddress.fullName, o.shippingAddress.phone, o.shippingAddress.city,
        o.items.map((i) => `${i.quantity}× ${i.name}`).join('; '), o.total, o.paymentMethod, paymentStatusOf(o), o.status,
      ]),
    ]);

  return (
    <>
      <PageHeader
        title="Orders"
        subtitle="Track customer purchases, payments and every stage of fulfilment."
        action={<Button onClick={() => setAdding(true)}><Plus className="w-4 h-4" /> Add order</Button>}
      />

      <Card className="grid grid-cols-2 lg:grid-cols-4 divide-x divide-[#efe8dc] mb-6">
        {[
          ['All orders', String(orders.length)],
          ['Paid order value', formatINR(paidValue)],
          ['To fulfil', String(toFulfil)],
          ['Payment pending', String(payPending)],
        ].map(([label, value]) => (
          <div key={label} className="p-5">
            <p className="text-xs text-stone-500">{label}</p>
            <p className="mt-1 text-2xl font-semibold text-charcoal">{value}</p>
          </div>
        ))}
      </Card>

      <div className="flex flex-col-reverse sm:flex-row sm:items-end gap-3 sm:gap-4">
        <div className="flex-1 min-w-0">
        <Tabs<TabId>
          active={tab}
          onChange={(t) => { setTab(t); reset(); }}
          tabs={[
            { id: 'all', label: 'All orders', count: orders.length },
            { id: 'fulfil', label: 'To fulfil', count: toFulfil },
            { id: 'shipped', label: 'Shipped', count: orders.filter((o) => IN_TRANSIT.includes(o.status)).length },
            { id: 'completed', label: 'Completed', count: orders.filter((o) => o.status === 'Delivered' || o.status === 'Cancelled').length },
          ]}
        />
        </div>
        <Button variant="secondary" onClick={exportCSV} className="self-end sm:mb-2 shrink-0">
          <Download className="w-4 h-4" /> Export orders
        </Button>
      </div>

      <div className="flex flex-col lg:flex-row gap-3 justify-between my-5">
        <SearchInput value={query} onChange={(v) => { setQuery(v); reset(); }} placeholder="Search order ID, customer or phone" />
        <div className="flex flex-wrap gap-2">
          <SelectMenu label="Date range" value={range} onChange={(v) => { setRange(v as DateRange); reset(); }}
            options={[{ value: 'all', label: 'All dates' }, { value: 'today', label: 'Today' }, { value: '7d', label: 'Last 7 days' }, { value: 'month', label: 'This month' }]} />
          <SelectMenu label="Payment" value={payment} onChange={(v) => { setPayment(v); reset(); }}
            options={[{ value: 'all', label: 'All payments' }, { value: 'Paid', label: 'Paid' }, { value: 'Pending', label: 'Pending' }, { value: 'Refunded', label: 'Refunded' }]} />
          <SelectMenu label="Fulfilment" value={fulfil} onChange={(v) => { setFulfil(v); reset(); }}
            options={[{ value: 'all', label: 'All fulfilment' }, ...STATUSES.map((s) => ({ value: s, label: s }))]} />
        </div>
      </div>

      <TableShell
        head={['Order / Date', 'Customer', 'Products', 'Amount', 'Payment', 'Fulfilment', 'View']}
        alignRight={[3]}
        footer={
          <div className="flex items-center justify-between">
            <span>Showing {filtered.length ? (current - 1) * PAGE_SIZE + 1 : 0}–{Math.min(current * PAGE_SIZE, filtered.length)} of {filtered.length} orders</span>
            <div className="flex items-center gap-1">
              <button disabled={current === 1} onClick={() => setPage(current - 1)} className="p-1 disabled:opacity-30 cursor-pointer" aria-label="Previous page"><ChevronLeft className="w-4 h-4" /></button>
              <span className="px-2.5 py-0.5 rounded-full bg-[#f6e3e7] text-burgundy-800 font-semibold">{current}</span>
              <span>/ {pages}</span>
              <button disabled={current === pages} onClick={() => setPage(current + 1)} className="p-1 disabled:opacity-30 cursor-pointer" aria-label="Next page"><ChevronRight className="w-4 h-4" /></button>
            </div>
          </div>
        }
      >
        {rows.map((o) => {
          const pay = paymentStatusOf(o);
          const units = o.items.reduce((s, i) => s + i.quantity, 0);
          return (
            <tr key={o.id} className="hover:bg-[#fbf7f0] cursor-pointer" onClick={() => setViewing(o.id)}>
              <td className="px-4 py-3 whitespace-nowrap">
                <p className="font-semibold text-burgundy-800">{o.orderNumber}</p>
                <p className="text-xs text-stone-500">{formatDate(o.date)}</p>
              </td>
              <td className="px-4 py-3">
                <p className="font-medium text-charcoal whitespace-nowrap">{o.shippingAddress.fullName}</p>
                <p className="text-xs text-stone-500 whitespace-nowrap">{[o.shippingAddress.city, o.shippingAddress.state].filter(Boolean).join(', ')}</p>
              </td>
              <td className="px-4 py-3">
                <p className="text-charcoal truncate max-w-[240px]">{o.items[0]?.name}{o.items.length > 1 ? ` +${o.items.length - 1}` : ''}</p>
                <p className="text-xs text-stone-500">{units} saree{units > 1 ? 's' : ''} · {paymentKind(o.paymentMethod)}</p>
              </td>
              <td className="px-4 py-3 text-right font-semibold text-charcoal whitespace-nowrap">{formatINR(o.total)}</td>
              <td className="px-4 py-3"><Badge tone={paymentTone(pay)}>{pay}</Badge></td>
              <td className="px-4 py-3"><Badge tone={fulfilmentTone(o.status)}>{o.status}</Badge></td>
              <td className="px-4 py-3">
                <button onClick={(e) => { e.stopPropagation(); setViewing(o.id); }} className="p-1 text-burgundy-800 hover:bg-[#f6e3e7] rounded cursor-pointer" aria-label={`View ${o.orderNumber}`}>
                  <ArrowUpRight className="w-4 h-4" />
                </button>
              </td>
            </tr>
          );
        })}
        {rows.length === 0 && <EmptyRow colSpan={7} text="No orders match these filters." />}
      </TableShell>

      <p className="mt-4 flex items-center gap-2 text-xs text-stone-500">
        <Info className="w-3.5 h-3.5" /> Amounts in INR. Click any order to update its fulfilment or payment.
      </p>

      {viewingOrder && <OrderDetail order={viewingOrder} onClose={() => setViewing(null)} />}
      {adding && <AddOrderPanel onClose={() => setAdding(false)} />}
    </>
  );
};
