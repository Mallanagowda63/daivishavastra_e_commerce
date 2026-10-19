import React, { useMemo, useState } from 'react';
import { Download, Mail, MapPin, MessageCircle, Phone, Users } from 'lucide-react';
import { useAdmin } from '../../context/AdminContext';
import { Order } from '../../types';
import { Badge, Button, EmptyRow, PageHeader, SearchInput, SidePanel, StatCard, TableShell } from './adminUi';
import { downloadCSV, formatDate, formatINR } from './adminUtils';
import { fulfilmentTone } from './statusTones';

interface Customer {
  key: string;
  name: string;
  phone: string;
  email: string;
  address: Order['shippingAddress'];
  orders: Order[];
  spent: number; // excludes cancelled orders
  firstOrder: string;
  lastOrder: string;
}

const digits = (s: string) => s.replace(/\D/g, '').slice(-10);

/** One row per customer, grouped by phone number (or email when there is no phone). */
const buildCustomers = (orders: Order[]): Customer[] => {
  const map = new Map<string, Customer>();
  const sorted = [...orders].sort((a, b) => (a.date < b.date ? 1 : -1)); // newest first
  for (const o of sorted) {
    const phone = digits(o.shippingAddress?.phone ?? '');
    const email = (o.customerEmail ?? '').trim().toLowerCase();
    const key = phone || email || o.id;
    let c = map.get(key);
    if (!c) {
      // newest order gives the current name, email and address
      c = { key, name: o.shippingAddress.fullName, phone: o.shippingAddress.phone, email, address: o.shippingAddress, orders: [], spent: 0, firstOrder: o.date, lastOrder: o.date };
      map.set(key, c);
    }
    c.orders.push(o);
    if (!c.email && email) c.email = email;
    if (o.status !== 'Cancelled') c.spent += o.total;
    if (o.date < c.firstOrder) c.firstOrder = o.date;
  }
  return [...map.values()];
};

const whatsappLink = (phone: string) => {
  const d = digits(phone);
  return d.length === 10 ? `https://wa.me/91${d}` : '';
};

const CustomerPanel: React.FC<{ c: Customer; onClose: () => void }> = ({ c, onClose }) => {
  const a = c.address;
  const wa = whatsappLink(c.phone);
  return (
    <SidePanel title={c.name} subtitle={`Customer since ${formatDate(c.firstOrder)}`} onClose={onClose}>
      <div className="grid grid-cols-3 gap-2 mb-5">
        <div className="rounded-lg bg-white border border-[#ebe3d6] p-3">
          <p className="text-[11px] uppercase tracking-wider text-stone-500">Orders</p>
          <p className="text-lg font-semibold text-charcoal">{c.orders.length}</p>
        </div>
        <div className="rounded-lg bg-white border border-[#ebe3d6] p-3 col-span-2">
          <p className="text-[11px] uppercase tracking-wider text-stone-500">Total spent</p>
          <p className="text-lg font-semibold text-charcoal">{formatINR(c.spent)}</p>
        </div>
      </div>

      <h3 className="text-[11px] uppercase tracking-wider text-stone-500 mb-2">Contact</h3>
      <ul className="space-y-2.5 text-sm text-charcoal mb-5">
        <li className="flex gap-2.5"><Phone className="w-4 h-4 text-stone-400 mt-0.5 shrink-0" /><a href={`tel:${c.phone}`} className="hover:underline">{c.phone || '—'}</a></li>
        {wa && (
          <li className="flex gap-2.5"><MessageCircle className="w-4 h-4 text-stone-400 mt-0.5 shrink-0" /><a href={wa} target="_blank" rel="noreferrer" className="text-burgundy-800 hover:underline">Message on WhatsApp</a></li>
        )}
        <li className="flex gap-2.5"><Mail className="w-4 h-4 text-stone-400 mt-0.5 shrink-0" />{c.email ? <a href={`mailto:${c.email}`} className="hover:underline break-all">{c.email}</a> : '—'}</li>
        <li className="flex gap-2.5"><MapPin className="w-4 h-4 text-stone-400 mt-0.5 shrink-0" />
          <span>{[a.addressLine, [a.city, a.state].filter(Boolean).join(', '), a.pincode].filter(Boolean).join(', ') || '—'}</span>
        </li>
      </ul>

      <h3 className="text-[11px] uppercase tracking-wider text-stone-500 mb-2">Order history</h3>
      <ul className="space-y-2">
        {c.orders.map((o) => (
          <li key={o.id} className="rounded-lg bg-white border border-[#ebe3d6] p-3">
            <div className="flex items-center justify-between gap-2">
              <span className="font-semibold text-burgundy-800">{o.orderNumber}</span>
              <Badge tone={fulfilmentTone(o.status)}>{o.status}</Badge>
            </div>
            <p className="text-xs text-stone-500 mt-0.5">{formatDate(o.date)} · {formatINR(o.total)}</p>
            <p className="text-sm text-charcoal mt-1.5">{o.items.map((i) => `${i.name}${i.quantity > 1 ? ` ×${i.quantity}` : ''}`).join(', ')}</p>
          </li>
        ))}
      </ul>
    </SidePanel>
  );
};

export const CustomersPage: React.FC = () => {
  const { orders } = useAdmin();
  const [query, setQuery] = useState('');
  const [viewing, setViewing] = useState<string | null>(null);
  const customers = useMemo(() => buildCustomers(orders), [orders]);

  const q = query.trim().toLowerCase();
  const filtered = q
    ? customers.filter((c) => [c.name, c.phone, c.email, c.address.city, c.address.state].some((v) => (v ?? '').toLowerCase().includes(q)) || digits(c.phone).includes(q.replace(/\D/g, '') || '~'))
    : customers;
  const repeat = customers.filter((c) => c.orders.length > 1).length;
  const spent = customers.reduce((s, c) => s + c.spent, 0);
  const open = customers.find((c) => c.key === viewing);

  const exportCSV = () =>
    downloadCSV('daivisha-customers.csv', [
      ['Name', 'Phone', 'Email', 'Address', 'City', 'State', 'PIN code', 'Orders', 'Total spent (INR)', 'First order', 'Last order'],
      ...customers.map((c) => [c.name, c.phone, c.email, c.address.addressLine, c.address.city, c.address.state, c.address.pincode, c.orders.length, c.spent, c.firstOrder, c.lastOrder]),
    ]);

  return (
    <div>
      <PageHeader
        title="Customers"
        subtitle="Everyone who has ordered from your store, with their contact details and order history."
        action={
          <Button variant="secondary" onClick={exportCSV} disabled={!customers.length}>
            <Download className="w-4 h-4" /> Export customers
          </Button>
        }
      />

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-5">
        <StatCard label="Customers" value={String(customers.length)} icon={<Users className="w-4 h-4" />} />
        <StatCard label="Ordered more than once" value={String(repeat)} />
        <StatCard label="Total spent by customers" value={formatINR(spent)} note="Cancelled orders not counted" />
      </div>

      <div className="my-5">
        <SearchInput value={query} onChange={setQuery} placeholder="Search name, phone, email or city" />
      </div>

      <TableShell head={['Customer', 'Contact', 'Location', 'Orders', 'Total spent', 'Last order']} alignRight={[3, 4]}>
        {filtered.length === 0 ? (
          <EmptyRow colSpan={6} text={customers.length ? 'No customers match your search.' : 'Customers appear here after their first order.'} />
        ) : (
          filtered.map((c) => (
            <tr key={c.key} className="hover:bg-[#fbf7f0] cursor-pointer" onClick={() => setViewing(c.key)}>
              <td className="px-4 py-3 whitespace-nowrap font-medium text-charcoal">{c.name}</td>
              <td className="px-4 py-3">
                <p className="text-charcoal whitespace-nowrap">{c.phone}</p>
                <p className="text-xs text-stone-500 break-all">{c.email}</p>
              </td>
              <td className="px-4 py-3 text-stone-600 whitespace-nowrap">{[c.address.city, c.address.state].filter(Boolean).join(', ')}</td>
              <td className="px-4 py-3 text-right tabular-nums">{c.orders.length}</td>
              <td className="px-4 py-3 text-right tabular-nums font-medium">{formatINR(c.spent)}</td>
              <td className="px-4 py-3 whitespace-nowrap text-stone-600">{formatDate(c.lastOrder)}</td>
            </tr>
          ))
        )}
      </TableShell>

      {open && <CustomerPanel c={open} onClose={() => setViewing(null)} />}
    </div>
  );
};
