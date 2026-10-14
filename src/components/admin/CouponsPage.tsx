import React, { useEffect, useState } from 'react';
import { Clock, Megaphone, Plus, Tag, Trash2 } from 'lucide-react';
import { Coupon } from '../../types';
import { couponActions, couponLabel, isExpired, useCoupons } from '../../data/couponStore';
import { Button, Card, EmptyRow, Field, PageHeader, SidePanel, TableShell, inputClass } from './adminUi';
import { formatINR } from './adminUtils';

const formatExpiry = (iso?: string) =>
  iso
    ? new Date(iso).toLocaleString('en-GB', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit', hour12: true })
    : 'No expiry';

const timeLeft = (iso: string, now: number) => {
  const ms = new Date(iso).getTime() - now;
  if (ms <= 0) return 'Expired';
  const d = Math.floor(ms / 86400000);
  const h = Math.floor((ms % 86400000) / 3600000);
  const m = Math.floor((ms % 3600000) / 60000);
  return d > 0 ? `${d}d ${h}h left` : `${h}h ${m}m left`;
};

const CreateCouponPanel: React.FC<{ onClose: () => void; existing: string[] }> = ({ onClose, existing }) => {
  const [code, setCode] = useState('');
  const [type, setType] = useState<'percent' | 'flat'>('percent');
  const [value, setValue] = useState(10);
  const [minOrder, setMinOrder] = useState(0);
  const [expiresAt, setExpiresAt] = useState('');
  const [description, setDescription] = useState('');
  const [active, setActive] = useState(true);
  const [featured, setFeatured] = useState(false);
  const [error, setError] = useState('');

  const submit = () => {
    const clean = code.trim().toUpperCase();
    if (!/^[A-Z0-9]{3,20}$/.test(clean)) return setError('Code must be 3–20 letters or numbers, no spaces.');
    if (existing.includes(clean)) return setError(`${clean} already exists.`);
    if (value <= 0 || (type === 'percent' && value > 90)) return setError(type === 'percent' ? 'Enter a discount between 1% and 90%.' : 'Enter a discount amount.');
    if (expiresAt && new Date(expiresAt).getTime() < Date.now()) return setError('Expiry must be in the future.');
    const label = type === 'percent' ? `${value}% off` : `Flat ₹${value.toLocaleString('en-IN')} off`;
    couponActions.add({
      code: clean,
      ...(type === 'percent' ? { discountPercentage: value } : { discountAmount: value }),
      minimumOrder: minOrder,
      description: description.trim() || (minOrder ? `${label} on orders above ₹${minOrder.toLocaleString('en-IN')}` : `${label} on any order`),
      expiresAt: expiresAt || undefined,
      active,
      featured: active && featured,
    });
    onClose();
  };

  return (
    <SidePanel
      title="Create custom coupon"
      subtitle="Customers enter this code in the shopping bag."
      onClose={onClose}
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>Cancel</Button>
          <Button onClick={submit}>Create coupon</Button>
        </>
      }
    >
      <div className="space-y-4">
        <Field label="Coupon code" required hint="Letters and numbers only, e.g. DIWALI20.">
          <input className={`${inputClass} font-mono uppercase tracking-wider`} value={code} onChange={(e) => { setCode(e.target.value); setError(''); }} placeholder="DIWALI20" />
        </Field>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Discount type">
            <select className={inputClass} value={type} onChange={(e) => setType(e.target.value as 'percent' | 'flat')}>
              <option value="percent">Percentage (%)</option>
              <option value="flat">Flat amount (₹)</option>
            </select>
          </Field>
          <Field label={type === 'percent' ? 'Discount (%)' : 'Discount (₹)'} required>
            <input type="number" min={1} className={inputClass} value={value || ''} onChange={(e) => setValue(Number(e.target.value))} />
          </Field>
        </div>
        <Field label="Minimum order (₹)" hint="0 means no minimum.">
          <input type="number" min={0} className={inputClass} value={minOrder} onChange={(e) => setMinOrder(Math.max(0, Number(e.target.value)))} />
        </Field>
        <Field label="Expires on" hint="Leave empty for no expiry.">
          <input type="datetime-local" className={inputClass} value={expiresAt} onChange={(e) => setExpiresAt(e.target.value)} />
        </Field>
        <Field label="Description" hint="Shown to customers. Leave empty to generate one.">
          <input className={inputClass} value={description} onChange={(e) => setDescription(e.target.value)} placeholder="20% off festive silks above ₹15,000" />
        </Field>
        <label className="flex items-center gap-2 text-sm text-charcoal">
          <input type="checkbox" checked={active} onChange={(e) => setActive(e.target.checked)} className="accent-burgundy-800" /> Active now
        </label>
        <label className="flex items-center gap-2 text-sm text-charcoal">
          <input type="checkbox" checked={featured} disabled={!active} onChange={(e) => setFeatured(e.target.checked)} className="accent-burgundy-800" /> Show in the top announcement bar
        </label>
        {error && <p className="text-sm text-rose-700">{error}</p>}
      </div>
    </SidePanel>
  );
};

export const CouponsPage: React.FC = () => {
  const coupons = useCoupons();
  const [creating, setCreating] = useState(false);
  const [now, setNow] = useState(Date.now());

  // Keep the expiry countdowns fresh.
  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 60000);
    return () => clearInterval(t);
  }, []);

  const featured = coupons.find((c) => c.featured);

  const deleteAll = () => {
    if (window.confirm(`Delete all ${coupons.length} coupons? This cannot be undone.`)) couponActions.removeAll();
  };
  const deleteOne = (c: Coupon) => {
    if (window.confirm(`Delete coupon ${c.code}?`)) couponActions.remove(c.code);
  };

  return (
    <>
      <PageHeader title="Discount coupons" subtitle="Create offers, switch them on or off, and choose which one appears in the top bar." />

      <Card className="p-5 sm:p-6">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 pb-5 border-b border-[#efe8dc]">
          <div>
            <h2 className="flex items-center gap-2 font-serif text-2xl text-charcoal">
              <Tag className="w-5 h-5 text-gold-700" /> Coupons &amp; promo offers ({coupons.length})
            </h2>
            <p className="mt-1 text-xs text-stone-500">
              Manage store coupons, activate or deactivate offers, set the featured coupon for the top announcement bar, or delete coupons.
            </p>
          </div>
          <div className="flex gap-2 shrink-0">
            <Button variant="secondary" onClick={deleteAll} disabled={!coupons.length} className="text-rose-700 border-rose-200 hover:border-rose-400 bg-rose-50">
              <Trash2 className="w-4 h-4" /> Delete all
            </Button>
            <Button onClick={() => setCreating(true)}>
              <Plus className="w-4 h-4" /> Create custom coupon
            </Button>
          </div>
        </div>

        <div className="mt-4 flex items-center gap-2 text-xs text-stone-600">
          <Megaphone className="w-4 h-4 text-gold-700" />
          {featured ? (
            <span>
              Top bar is showing <strong className="font-mono text-burgundy-800">{featured.code}</strong> — {featured.description}
            </span>
          ) : (
            <span>No coupon in the top bar. Click “Set top banner” on an active coupon to feature it.</span>
          )}
        </div>
      </Card>

      <div className="mt-4">
        <TableShell head={['Coupon code', 'Discount', 'Min order', 'Expiry', 'Top bar banner', 'Status', 'Delete']}>
          {coupons.map((c) => {
            const expired = isExpired(c, now);
            const active = c.active !== false;
            return (
              <tr key={c.code} className={c.featured ? 'bg-[#fbf3e4]' : 'hover:bg-[#fbf7f0]'}>
                <td className="px-4 py-3.5">
                  <span className="inline-block rounded-full border border-gold-500/60 bg-gold-300/40 px-3 py-1 font-mono text-xs font-bold tracking-wider text-burgundy-950">
                    {c.code}
                  </span>
                  <p className="mt-1 text-[11px] text-stone-500 max-w-[220px]">{c.description}</p>
                </td>
                <td className="px-4 py-3.5 font-bold text-charcoal whitespace-nowrap">{couponLabel(c)}</td>
                <td className="px-4 py-3.5 font-semibold text-charcoal whitespace-nowrap">{formatINR(c.minimumOrder)}</td>
                <td className="px-4 py-3.5 whitespace-nowrap">
                  <p className={`flex items-center gap-1.5 text-xs font-mono ${expired ? 'text-rose-700' : 'text-emerald-800'}`}>
                    <Clock className="w-3.5 h-3.5" /> {formatExpiry(c.expiresAt)}
                  </p>
                  {c.expiresAt && <p className={`mt-0.5 text-[11px] ${expired ? 'text-rose-700 font-semibold' : 'text-stone-500'}`}>{timeLeft(c.expiresAt, now)}</p>}
                </td>
                <td className="px-4 py-3.5">
                  <button
                    onClick={() => couponActions.setFeatured(c.code)}
                    disabled={!active || expired}
                    className={`rounded-full px-3 py-1.5 text-xs font-semibold border whitespace-nowrap transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed ${
                      c.featured ? 'bg-burgundy-800 border-burgundy-800 text-ivory' : 'bg-white border-[#e3d9ca] text-charcoal hover:border-burgundy-800'
                    }`}
                    title={c.featured ? 'Click to remove from top bar' : 'Show this coupon in the top bar'}
                  >
                    {c.featured ? '★ In top bar' : 'Set top banner'}
                  </button>
                </td>
                <td className="px-4 py-3.5">
                  <button
                    onClick={() => couponActions.toggleActive(c.code)}
                    className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-bold uppercase ring-1 ring-inset cursor-pointer ${
                      expired
                        ? 'bg-rose-50 text-rose-700 ring-rose-200'
                        : active
                        ? 'bg-emerald-50 text-emerald-800 ring-emerald-200 hover:bg-emerald-100'
                        : 'bg-stone-100 text-stone-500 ring-stone-200 hover:bg-stone-200'
                    }`}
                    title={active ? 'Click to deactivate' : 'Click to activate'}
                  >
                    <span className={`w-1.5 h-1.5 rounded-full ${expired ? 'bg-rose-600' : active ? 'bg-emerald-600' : 'bg-stone-400'}`} />
                    {expired ? 'Expired' : active ? 'Active' : 'Inactive'}
                  </button>
                </td>
                <td className="px-4 py-3.5">
                  <button onClick={() => deleteOne(c)} className="p-2 rounded-lg bg-rose-50 text-rose-600 hover:bg-rose-100 cursor-pointer" aria-label={`Delete ${c.code}`}>
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            );
          })}
          {coupons.length === 0 && <EmptyRow colSpan={7} text="No coupons yet. Create one to start an offer." />}
        </TableShell>
      </div>

      {creating && <CreateCouponPanel onClose={() => setCreating(false)} existing={coupons.map((c) => c.code)} />}
    </>
  );
};
