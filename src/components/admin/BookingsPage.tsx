import React, { useMemo, useState } from 'react';
import { Check, Plus, X } from 'lucide-react';
import { useAdmin } from '../../context/AdminContext';
import { BookingService, BookingStatus } from '../../types';
import { Badge, Button, EmptyRow, Field, PageHeader, SearchInput, SidePanel, StatCard, TableShell, Tabs, inputClass } from './adminUi';
import { bookingTone } from './statusTones';
import { formatDate, formatTime12, todayISO } from './adminUtils';

const SERVICES: BookingService[] = ['Bridal consultation', 'Saree styling', 'Video call', 'Store visit'];
type TabId = 'upcoming' | 'pending' | 'past' | 'all';

const AddBookingPanel: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const { addBooking } = useAdmin();
  const [customerName, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [service, setService] = useState<BookingService>('Bridal consultation');
  const [date, setDate] = useState(todayISO());
  const [time, setTime] = useState('11:00');
  const [status, setStatus] = useState<BookingStatus>('Confirmed');
  const [notes, setNotes] = useState('');
  const [error, setError] = useState('');

  const submit = () => {
    if (!customerName.trim() || !phone.trim() || !date || !time) {
      setError('Enter the customer name, phone, date and time.');
      return;
    }
    addBooking({ customerName: customerName.trim(), phone: phone.trim(), service, date, time, status, notes: notes.trim() || undefined });
    onClose();
  };

  return (
    <SidePanel
      title="Add booking"
      subtitle="Schedule a consultation, styling session or visit."
      onClose={onClose}
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>Cancel</Button>
          <Button onClick={submit}>Add booking</Button>
        </>
      }
    >
      <div className="space-y-4">
        <Field label="Customer name" required><input className={inputClass} value={customerName} onChange={(e) => setName(e.target.value)} /></Field>
        <Field label="Phone" required><input className={inputClass} value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+91" /></Field>
        <Field label="Service" required>
          <select className={inputClass} value={service} onChange={(e) => setService(e.target.value as BookingService)}>
            {SERVICES.map((s) => <option key={s}>{s}</option>)}
          </select>
        </Field>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Date" required><input type="date" className={inputClass} value={date} onChange={(e) => setDate(e.target.value)} /></Field>
          <Field label="Time (IST)" required><input type="time" className={inputClass} value={time} onChange={(e) => setTime(e.target.value)} /></Field>
        </div>
        <Field label="Status">
          <select className={inputClass} value={status} onChange={(e) => setStatus(e.target.value as BookingStatus)}>
            <option>Confirmed</option>
            <option>Pending</option>
          </select>
        </Field>
        <Field label="Notes"><textarea className={`${inputClass} min-h-[90px]`} value={notes} onChange={(e) => setNotes(e.target.value)} /></Field>
        {error && <p className="text-sm text-rose-700">{error}</p>}
      </div>
    </SidePanel>
  );
};

export const BookingsPage: React.FC = () => {
  const { bookings, updateBooking } = useAdmin();
  const [tab, setTab] = useState<TabId>('upcoming');
  const [query, setQuery] = useState('');
  const [adding, setAdding] = useState(false);
  const today = todayISO();

  const isUpcoming = (b: (typeof bookings)[number]) => b.date >= today && (b.status === 'Pending' || b.status === 'Confirmed');

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return bookings
      .filter((b) => {
        if (tab === 'upcoming' && !isUpcoming(b)) return false;
        if (tab === 'pending' && b.status !== 'Pending') return false;
        if (tab === 'past' && isUpcoming(b)) return false;
        return !q || b.customerName.toLowerCase().includes(q) || b.phone.includes(q);
      })
      .sort((a, b) => (tab === 'past' ? -1 : 1) * (a.date + a.time).localeCompare(b.date + b.time));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bookings, tab, query, today]);

  const upcoming = bookings.filter(isUpcoming);
  const todays = bookings.filter((b) => b.date === today && b.status !== 'Cancelled');

  return (
    <>
      <PageHeader
        title="Bookings"
        subtitle="Bridal consultations, styling sessions and store visits."
        action={<Button onClick={() => setAdding(true)}><Plus className="w-4 h-4" /> Add booking</Button>}
      />

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <StatCard label="Today" value={String(todays.length)} note="Appointments scheduled today" />
        <StatCard label="Upcoming" value={String(upcoming.length)} note={`${upcoming.filter((b) => b.status === 'Confirmed').length} confirmed`} />
        <StatCard label="Need confirmation" value={String(bookings.filter((b) => b.status === 'Pending').length)} note="Pending requests" />
      </div>

      <Tabs<TabId>
        active={tab}
        onChange={setTab}
        tabs={[
          { id: 'upcoming', label: 'Upcoming', count: upcoming.length },
          { id: 'pending', label: 'Pending', count: bookings.filter((b) => b.status === 'Pending').length },
          { id: 'past', label: 'Past & cancelled', count: bookings.length - upcoming.length },
          { id: 'all', label: 'All', count: bookings.length },
        ]}
      />

      <div className="my-5">
        <SearchInput value={query} onChange={setQuery} placeholder="Search customer or phone" />
      </div>

      <TableShell head={['Date & time', 'Customer', 'Service', 'Notes', 'Status', 'Actions']}>
        {filtered.map((b) => (
          <tr key={b.id} className="hover:bg-[#fbf7f0]">
            <td className="px-4 py-3 whitespace-nowrap">
              <p className="font-semibold text-charcoal">{formatDate(b.date)}</p>
              <p className="text-xs text-stone-500">{formatTime12(b.time)} IST</p>
            </td>
            <td className="px-4 py-3 whitespace-nowrap">
              <p className="font-medium text-charcoal">{b.customerName}</p>
              <p className="text-xs text-stone-500">{b.phone}</p>
            </td>
            <td className="px-4 py-3 whitespace-nowrap text-charcoal">{b.service}</td>
            <td className="px-4 py-3 text-xs text-stone-500 max-w-[260px]">{b.notes || '—'}</td>
            <td className="px-4 py-3"><Badge tone={bookingTone(b.status)}>{b.status}</Badge></td>
            <td className="px-4 py-3">
              <div className="flex gap-1">
                {b.status === 'Pending' && (
                  <Button variant="ghost" className="px-2 py-1" onClick={() => updateBooking(b.id, { status: 'Confirmed' })}>
                    <Check className="w-4 h-4" /> Confirm
                  </Button>
                )}
                {b.status === 'Confirmed' && b.date <= today && (
                  <Button variant="ghost" className="px-2 py-1" onClick={() => updateBooking(b.id, { status: 'Completed' })}>
                    <Check className="w-4 h-4" /> Done
                  </Button>
                )}
                {(b.status === 'Pending' || b.status === 'Confirmed') && (
                  <Button variant="ghost" className="px-2 py-1 text-stone-500" onClick={() => updateBooking(b.id, { status: 'Cancelled' })}>
                    <X className="w-4 h-4" /> Cancel
                  </Button>
                )}
              </div>
            </td>
          </tr>
        ))}
        {filtered.length === 0 && <EmptyRow colSpan={6} text="No bookings here." />}
      </TableShell>

      {adding && <AddBookingPanel onClose={() => setAdding(false)} />}
    </>
  );
};
