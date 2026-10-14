import React, { useMemo, useState } from 'react';
import { Banknote, IndianRupee, Info, Smartphone } from 'lucide-react';
import { useAdmin } from '../../context/AdminContext';
import { Badge, Button, Card, EmptyRow, PageHeader, SearchInput, SelectMenu, StatCard, TableShell } from './adminUi';
import { paymentTone } from './statusTones';
import { formatDate, formatINR, localISO, paymentKind, paymentStatusOf, todayISO } from './adminUtils';

const maskPhone = (p: string) => p.replace(/(\+91\s?\d{2})\d{3}(\s?\d{2})/, '$1•••$2');

/** When the money arrived: explicit timestamp, else the order date for paid orders. */
const paidOn = (o: { paymentDate?: string; date: string }, paid: boolean) =>
  !paid ? null : o.paymentDate && o.paymentDate.length > 10 ? localISO(new Date(o.paymentDate)) : (o.paymentDate ?? o.date);

export const PaymentsPage: React.FC = () => {
  const { orders, updateOrder } = useAdmin();
  const [query, setQuery] = useState('');
  const [method, setMethod] = useState('all');
  const [status, setStatus] = useState('all');
  const today = todayISO();

  const rows = useMemo(
    () =>
      [...orders]
        .sort((a, b) => b.date.localeCompare(a.date) || b.orderNumber.localeCompare(a.orderNumber))
        .map((o) => {
          const st = paymentStatusOf(o);
          return { o, st, kind: paymentKind(o.paymentMethod), paidDate: paidOn(o, st === 'Paid') };
        }),
    [orders]
  );

  const paid = rows.filter((r) => r.st === 'Paid');
  const todayPaid = paid.filter((r) => r.paidDate === today);
  const upi = paid.filter((r) => r.kind === 'UPI');
  const codAll = rows.filter((r) => r.kind === 'COD' && r.st !== 'Refunded');
  const codCollected = codAll.filter((r) => r.st === 'Paid');
  const codPending = codAll.filter((r) => r.st === 'Pending');
  const sum = (list: typeof rows) => list.reduce((s, r) => s + r.o.total, 0);

  const filtered = rows.filter((r) => {
    const q = query.trim().toLowerCase();
    if (method !== 'all' && r.kind !== method) return false;
    if (status !== 'all' && r.st !== status) return false;
    return !q || r.o.orderNumber.toLowerCase().includes(q) || r.o.shippingAddress.fullName.toLowerCase().includes(q) || r.o.shippingAddress.phone.includes(q);
  });

  return (
    <>
      <PageHeader
        title="Store Payments & Collections"
        subtitle={`${new Date().toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })} · A clear view of collected and pending payments.`}
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard label="Today's payments" value={formatINR(sum(todayPaid))} icon={<IndianRupee className="w-4 h-4" />} note={`${todayPaid.length} paid payment${todayPaid.length === 1 ? '' : 's'} · ${formatDate(today)}`} />
        <StatCard label="UPI payments" value={formatINR(sum(upi))} icon={<Smartphone className="w-4 h-4" />} note={`${upi.length} paid · all time`} />
        <StatCard
          label="Cash on Delivery (COD)"
          value={formatINR(sum(codAll))}
          icon={<Banknote className="w-4 h-4" />}
          note={
            <span className="flex justify-between">
              <span>{formatINR(sum(codCollected))} collected</span>
              <span className="text-amber-700">{formatINR(sum(codPending))} pending</span>
            </span>
          }
        />
      </div>

      <Card className="mt-5 p-5 pb-0 overflow-hidden">
        <h2 className="font-sans text-base font-semibold text-charcoal">Customer payment history</h2>
        <p className="text-xs text-stone-500 mt-0.5">Paid, pending and refunded payments across all orders</p>
        <div className="flex flex-col lg:flex-row gap-3 justify-between my-4">
          <SearchInput value={query} onChange={setQuery} placeholder="Search customer, phone or order ID" />
          <div className="flex flex-wrap gap-2">
            <SelectMenu label="Method" value={method} onChange={setMethod}
              options={[{ value: 'all', label: 'All methods' }, ...['UPI', 'COD', 'Card', 'Net banking', 'Other'].map((m) => ({ value: m, label: m }))]} />
            <SelectMenu label="Status" value={status} onChange={setStatus}
              options={[{ value: 'all', label: 'All statuses' }, { value: 'Paid', label: 'Paid' }, { value: 'Pending', label: 'Pending' }, { value: 'Refunded', label: 'Refunded' }]} />
          </div>
        </div>
      </Card>

      <div className="-mt-px">
        <TableShell
          head={['Customer / Phone', 'Order', 'Payment date', 'Method', 'Amount', 'Status', '']}
          alignRight={[4]}
          footer={
            <div className="flex flex-wrap justify-between gap-2">
              <span>Showing {filtered.length} of {rows.length} payments</span>
              <span>
                Total {formatINR(sum(filtered))} · <span className="text-emerald-700">Collected {formatINR(sum(filtered.filter((r) => r.st === 'Paid')))}</span> ·{' '}
                <span className="text-amber-700">Pending {formatINR(sum(filtered.filter((r) => r.st === 'Pending')))}</span>
              </span>
            </div>
          }
        >
          {filtered.map(({ o, st, kind, paidDate }) => (
            <tr key={o.id} className="hover:bg-[#fbf7f0]">
              <td className="px-4 py-3 whitespace-nowrap">
                <p className="font-medium text-charcoal">{o.shippingAddress.fullName}</p>
                <p className="text-xs text-stone-500">{maskPhone(o.shippingAddress.phone)}</p>
              </td>
              <td className="px-4 py-3 whitespace-nowrap">
                <p className="font-semibold text-burgundy-800">{o.orderNumber}</p>
                <p className="text-xs text-stone-500">{o.status}</p>
              </td>
              <td className="px-4 py-3 whitespace-nowrap">
                {paidDate ? (
                  <>
                    <p className="text-charcoal">{formatDate(paidDate)}</p>
                    {o.paymentDate && o.paymentDate.length > 10 && (
                      <p className="text-xs text-stone-500">{new Date(o.paymentDate).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })} IST</p>
                    )}
                  </>
                ) : (
                  <>
                    <p className="text-stone-400">—</p>
                    <p className="text-xs text-stone-500">Order: {formatDate(o.date)}</p>
                  </>
                )}
              </td>
              <td className="px-4 py-3"><Badge tone={kind === 'UPI' ? 'maroon' : kind === 'COD' ? 'grey' : 'blue'}>{kind}</Badge></td>
              <td className="px-4 py-3 text-right font-semibold text-charcoal whitespace-nowrap">{formatINR(o.total)}</td>
              <td className="px-4 py-3"><Badge tone={paymentTone(st)}>{st}</Badge></td>
              <td className="px-4 py-3">
                {st === 'Pending' && (
                  <Button variant="ghost" className="px-2 py-1 text-xs whitespace-nowrap" onClick={() => updateOrder(o.id, { paymentStatus: 'Paid', paymentDate: new Date().toISOString() })}>
                    Mark collected
                  </Button>
                )}
              </td>
            </tr>
          ))}
          {filtered.length === 0 && <EmptyRow colSpan={7} text="No payments match these filters." />}
        </TableShell>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-5">
        <Card className="p-5">
          <div className="flex items-start justify-between">
            <h3 className="font-sans text-base font-semibold text-charcoal">Pending COD collections</h3>
            <span className="text-sm font-semibold text-amber-700">
              {formatINR(sum(codPending))} · {codPending.length} order{codPending.length === 1 ? '' : 's'}
            </span>
          </div>
          <ul className="mt-2 space-y-1 text-xs text-stone-600">
            {codPending.map(({ o }) => (
              <li key={o.id}>
                {o.orderNumber} · {o.shippingAddress.fullName} · {formatINR(o.total)} · {o.status}
              </li>
            ))}
            {codPending.length === 0 && <li>Nothing pending — all COD payments collected.</li>}
          </ul>
        </Card>
        <Card className="p-5 bg-[#f6f0e6] flex gap-3 text-xs text-stone-600 leading-relaxed">
          <Info className="w-4 h-4 text-gold-700 shrink-0 mt-0.5" />
          <p>
            Online payments (UPI, cards, net banking) count as collected when the order is placed. COD stays pending until the order is
            delivered or you mark it collected. Phone numbers are partly hidden for privacy.
          </p>
        </Card>
      </div>
    </>
  );
};
