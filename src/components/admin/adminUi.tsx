import React from 'react';
import { ChevronDown, Search, X } from 'lucide-react';

export type Tone = 'green' | 'amber' | 'red' | 'grey' | 'maroon' | 'blue';

const TONES: Record<Tone, string> = {
  green: 'bg-emerald-50 text-emerald-800 ring-emerald-200',
  amber: 'bg-amber-50 text-amber-800 ring-amber-200',
  red: 'bg-rose-50 text-rose-800 ring-rose-200',
  grey: 'bg-stone-100 text-stone-600 ring-stone-200',
  maroon: 'bg-[#f6e3e7] text-burgundy-800 ring-[#ecc9d0]',
  blue: 'bg-sky-50 text-sky-800 ring-sky-200',
};

export const Badge: React.FC<{ tone: Tone; children: React.ReactNode }> = ({ tone, children }) => (
  <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-semibold ring-1 ring-inset whitespace-nowrap ${TONES[tone]}`}>
    {children}
  </span>
);

export const Card: React.FC<{ className?: string; children: React.ReactNode }> = ({ className = '', children }) => (
  <div className={`bg-[#fffdf9] border border-[#ebe3d6] rounded-xl ${className}`}>{children}</div>
);

export const PageHeader: React.FC<{ title: string; subtitle?: string; action?: React.ReactNode }> = ({ title, subtitle, action }) => (
  <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-7">
    <div>
      <h1 className="font-serif text-3xl sm:text-4xl text-charcoal">{title}</h1>
      {subtitle && <p className="mt-1.5 text-sm text-stone-500">{subtitle}</p>}
    </div>
    {action}
  </div>
);

export const StatCard: React.FC<{ label: string; value: string; note?: React.ReactNode; icon?: React.ReactNode }> = ({ label, value, note, icon }) => (
  <Card className="p-5">
    <div className="flex items-start justify-between text-sm text-stone-500">
      <span>{label}</span>
      <span className="text-gold-700">{icon}</span>
    </div>
    <p className="mt-2 text-3xl font-semibold text-charcoal tracking-tight">{value}</p>
    {note && <p className="mt-2 text-xs text-stone-500">{note}</p>}
  </Card>
);

export const Tabs = <T extends string>({
  tabs,
  active,
  onChange,
}: {
  tabs: { id: T; label: string; count?: number }[];
  active: T;
  onChange: (id: T) => void;
}) => (
  // Inset shadow draws the base line inside the scroll box, so the active underline sits on top of it.
  <div className="w-full flex gap-7 overflow-x-auto no-scrollbar shadow-[inset_0_-1px_0_#e3d9ca]">
    {tabs.map((t) => (
      <button
        key={t.id}
        onClick={() => onChange(t.id)}
        className={`flex items-center pb-3 border-b-2 text-sm whitespace-nowrap transition-colors cursor-pointer ${
          active === t.id ? 'border-burgundy-800 text-burgundy-800 font-semibold' : 'border-transparent text-stone-500 hover:text-charcoal'
        }`}
      >
        {t.label}
        {t.count !== undefined && (
          <span
            className={`ml-2 inline-block min-w-6 rounded-full px-1.5 py-0.5 text-center text-[11px] font-semibold ${
              active === t.id ? 'bg-[#f6e3e7] text-burgundy-800' : 'bg-[#efe7da] text-stone-500'
            }`}
          >
            {t.count}
          </span>
        )}
      </button>
    ))}
  </div>
);

export const SearchInput: React.FC<{ value: string; onChange: (v: string) => void; placeholder: string }> = ({ value, onChange, placeholder }) => (
  <label className="relative block w-full sm:max-w-xs">
    <span className="sr-only">{placeholder}</span>
    <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
    <input
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full rounded-lg border border-[#e3d9ca] bg-white pl-9 pr-3 py-2.5 text-sm placeholder:text-stone-400 focus:outline-none focus:border-burgundy-800 focus:ring-2 focus:ring-burgundy-800/15"
    />
  </label>
);

export const SelectMenu: React.FC<{
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
  label: string;
  className?: string;
}> = ({ value, onChange, options, label, className = '' }) => (
  <label className={`relative inline-block ${className}`}>
    <span className="sr-only">{label}</span>
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="appearance-none w-full rounded-lg border border-[#e3d9ca] bg-white pl-3 pr-9 py-2.5 text-sm text-charcoal focus:outline-none focus:border-burgundy-800 cursor-pointer"
    >
      {options.map((o) => (
        <option key={o.value} value={o.value}>
          {o.label}
        </option>
      ))}
    </select>
    <ChevronDown className="w-4 h-4 text-stone-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
  </label>
);

type ButtonVariant = 'primary' | 'secondary' | 'ghost';
const BTN: Record<ButtonVariant, string> = {
  primary: 'bg-burgundy-800 hover:bg-burgundy-900 text-ivory shadow-sm',
  secondary: 'bg-white border border-[#e3d9ca] hover:border-burgundy-800 text-charcoal',
  ghost: 'text-burgundy-800 hover:bg-[#f6e3e7]',
};
export const Button: React.FC<React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: ButtonVariant }> = ({
  variant = 'primary',
  className = '',
  ...props
}) => (
  <button
    {...props}
    className={`inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${BTN[variant]} ${className}`}
  />
);

export const Field: React.FC<{ label: string; hint?: string; required?: boolean; children: React.ReactNode; className?: string }> = ({
  label,
  hint,
  required,
  children,
  className = '',
}) => (
  <label className={`block ${className}`}>
    <span className="block text-xs font-semibold text-charcoal mb-1.5">
      {label}
      {required && <span className="text-burgundy-800"> *</span>}
    </span>
    {children}
    {hint && <span className="block mt-1 text-[11px] text-stone-400">{hint}</span>}
  </label>
);

export const inputClass =
  'w-full rounded-lg border border-[#e3d9ca] bg-white px-3 py-2.5 text-sm text-charcoal placeholder:text-stone-400 focus:outline-none focus:border-burgundy-800 focus:ring-2 focus:ring-burgundy-800/15';

/** Right-hand slide-over panel for detail views and quick forms. */
export const SidePanel: React.FC<{ title: string; subtitle?: string; onClose: () => void; children: React.ReactNode; footer?: React.ReactNode }> = ({
  title,
  subtitle,
  onClose,
  children,
  footer,
}) => (
  <div className="fixed inset-0 z-[60] flex justify-end" role="dialog" aria-modal="true" aria-label={title}>
    <button className="absolute inset-0 bg-black/40" onClick={onClose} aria-label="Close panel" />
    <div className="relative w-full max-w-md h-full bg-[#faf6ef] shadow-2xl flex flex-col animate-in slide-in-from-right">
      <div className="flex items-start justify-between gap-4 px-6 py-5 border-b border-[#ebe3d6]">
        <div>
          <h2 className="font-serif text-2xl text-charcoal">{title}</h2>
          {subtitle && <p className="text-xs text-stone-500 mt-1">{subtitle}</p>}
        </div>
        <button onClick={onClose} className="p-1 text-stone-500 hover:text-charcoal cursor-pointer" aria-label="Close">
          <X className="w-5 h-5" />
        </button>
      </div>
      <div className="flex-1 overflow-y-auto overscroll-contain px-6 py-5">{children}</div>
      {footer && <div className="px-6 py-4 border-t border-[#ebe3d6] flex justify-end gap-2">{footer}</div>}
    </div>
  </div>
);

export const TableShell: React.FC<{ head: string[]; children: React.ReactNode; footer?: React.ReactNode; alignRight?: number[] }> = ({
  head,
  children,
  footer,
  alignRight = [],
}) => (
  <Card className="overflow-hidden">
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-[#f6f0e6] text-[11px] uppercase tracking-wider text-stone-500">
            {head.map((h, i) => (
              <th key={h + i} className={`px-4 py-3 font-medium whitespace-nowrap ${alignRight.includes(i) ? 'text-right' : 'text-left'}`}>
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-[#efe8dc]">{children}</tbody>
      </table>
    </div>
    {footer && <div className="px-4 py-3 border-t border-[#efe8dc] text-xs text-stone-500">{footer}</div>}
  </Card>
);

export const EmptyRow: React.FC<{ colSpan: number; text: string }> = ({ colSpan, text }) => (
  <tr>
    <td colSpan={colSpan} className="px-4 py-12 text-center text-sm text-stone-400">
      {text}
    </td>
  </tr>
);
