import React, { useMemo, useState } from 'react';
import { ChevronLeft, ChevronRight, Download, Pencil, Plus, Trash2 } from 'lucide-react';
import { useAdmin } from '../../context/AdminContext';
import { ProductStatus, SareeCollection, SareeProduct } from '../../types';
import { Badge, Button, EmptyRow, PageHeader, SearchInput, SelectMenu, TableShell, Tabs } from './adminUi';
import { PRODUCT_STATUS_LABEL, productTone } from './statusTones';
import { downloadCSV, formatDate, formatINR, productStatusOf } from './adminUtils';
import { ProductEditor } from './ProductEditor';

export const COLLECTIONS: SareeCollection[] = [
  'Wedding Collection',
  'Festive Collection',
  'Office Wear',
  'Party Wear',
  'Daily Wear',
  'Luxury Collection',
  'The Heritage Edit',
];

const PAGE_SIZE = 8;
type TabId = 'all' | ProductStatus;
type StockFilter = 'all' | 'in' | 'low' | 'out';

const stockLabel = (n: number) =>
  n === 0 ? <span className="text-amber-700">Out of stock</span> : n <= 5 ? <span className="text-amber-700">{n} available</span> : `${n} available`;

export const ProductsPage: React.FC = () => {
  const { products, deleteProduct } = useAdmin();
  const [editing, setEditing] = useState<SareeProduct | 'new' | null>(null);
  const [tab, setTab] = useState<TabId>('all');
  const [query, setQuery] = useState('');
  const [collection, setCollection] = useState('all');
  const [stock, setStock] = useState<StockFilter>('all');
  const [page, setPage] = useState(1);

  const counts = useMemo(() => {
    const c = { published: 0, draft: 0, archived: 0 };
    products.forEach((p) => c[productStatusOf(p)]++);
    return c;
  }, [products]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return products.filter((p) => {
      if (tab !== 'all' && productStatusOf(p) !== tab) return false;
      if (collection !== 'all' && p.collection !== collection) return false;
      if (stock === 'in' && p.stock <= 5) return false;
      if (stock === 'low' && (p.stock === 0 || p.stock > 5)) return false;
      if (stock === 'out' && p.stock !== 0) return false;
      return !q || p.name.toLowerCase().includes(q) || p.sku.toLowerCase().includes(q);
    });
  }, [products, tab, query, collection, stock]);

  const pages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const current = Math.min(page, pages);
  const rows = filtered.slice((current - 1) * PAGE_SIZE, current * PAGE_SIZE);

  if (editing) {
    return <ProductEditor product={editing === 'new' ? undefined : editing} onDone={() => setEditing(null)} />;
  }

  const exportCSV = () =>
    downloadCSV('daivisha-sarees.csv', [
      ['Name', 'SKU', 'Collection', 'Category', 'Price (INR)', 'MRP (INR)', 'Stock', 'Status'],
      ...filtered.map((p) => [p.name, p.sku, p.collection, p.category, p.sellingPrice, p.originalPrice, p.stock, PRODUCT_STATUS_LABEL[productStatusOf(p)]]),
    ]);

  return (
    <>
      <PageHeader
        title="Saree products"
        subtitle="Curate your catalogue, keep stock current and manage visibility."
        action={
          <Button onClick={() => setEditing('new')}>
            <Plus className="w-4 h-4" /> Add saree
          </Button>
        }
      />

      <div className="flex items-end justify-between gap-4">
        <Tabs<TabId>
          active={tab}
          onChange={(t) => {
            setTab(t);
            setPage(1);
          }}
          tabs={[
            { id: 'all', label: 'All sarees', count: products.length },
            { id: 'published', label: 'Published', count: counts.published },
            { id: 'draft', label: 'Drafts', count: counts.draft },
            { id: 'archived', label: 'Archived', count: counts.archived },
          ]}
        />
      </div>

      <div className="flex flex-col lg:flex-row gap-3 justify-between my-5">
        <SearchInput
          value={query}
          onChange={(v) => {
            setQuery(v);
            setPage(1);
          }}
          placeholder="Search by name or SKU"
        />
        <div className="flex flex-wrap gap-2">
          <SelectMenu
            label="Collection"
            value={collection}
            onChange={(v) => {
              setCollection(v);
              setPage(1);
            }}
            options={[{ value: 'all', label: 'All collections' }, ...COLLECTIONS.map((c) => ({ value: c, label: c }))]}
          />
          <SelectMenu
            label="Stock level"
            value={stock}
            onChange={(v) => {
              setStock(v as StockFilter);
              setPage(1);
            }}
            options={[
              { value: 'all', label: 'All stock levels' },
              { value: 'in', label: 'In stock (6+)' },
              { value: 'low', label: 'Low stock (1–5)' },
              { value: 'out', label: 'Out of stock' },
            ]}
          />
          <Button variant="secondary" onClick={exportCSV}>
            <Download className="w-4 h-4" /> Export
          </Button>
        </div>
      </div>

      <TableShell
        head={['Product / Collection', 'Price', 'Stock', 'Status', 'Updated', 'Action']}
        alignRight={[1]}
        footer={
          <div className="flex items-center justify-between">
            <span>
              Showing {filtered.length ? (current - 1) * PAGE_SIZE + 1 : 0}–{Math.min(current * PAGE_SIZE, filtered.length)} of {filtered.length} sarees
            </span>
            <div className="flex items-center gap-1">
              <button disabled={current === 1} onClick={() => setPage(current - 1)} className="p-1 disabled:opacity-30 cursor-pointer" aria-label="Previous page">
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="px-2.5 py-0.5 rounded-full bg-[#f6e3e7] text-burgundy-800 font-semibold">{current}</span>
              <span>/ {pages}</span>
              <button disabled={current === pages} onClick={() => setPage(current + 1)} className="p-1 disabled:opacity-30 cursor-pointer" aria-label="Next page">
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        }
      >
        {rows.map((p) => {
          const status = productStatusOf(p);
          return (
            <tr key={p.id} className="hover:bg-[#fbf7f0]">
              <td className="px-4 py-3">
                <div className="flex items-center gap-3">
                  <img src={p.images[0]} alt="" className="w-10 h-12 rounded-md object-cover bg-sand shrink-0" />
                  <div className="min-w-0">
                    <p className="font-semibold text-charcoal truncate max-w-[320px]">{p.name}</p>
                    <p className="text-xs text-stone-500">
                      {p.sku} · {p.collection}
                    </p>
                  </div>
                </div>
              </td>
              <td className="px-4 py-3 text-right font-semibold text-charcoal whitespace-nowrap">{formatINR(p.sellingPrice)}</td>
              <td className="px-4 py-3 whitespace-nowrap">{stockLabel(p.stock)}</td>
              <td className="px-4 py-3">
                <Badge tone={productTone(status)}>{PRODUCT_STATUS_LABEL[status]}</Badge>
              </td>
              <td className="px-4 py-3 text-stone-500 whitespace-nowrap">{p.updatedAt ? formatDate(p.updatedAt) : '—'}</td>
              <td className="px-4 py-3">
                <div className="flex items-center gap-4 whitespace-nowrap">
                  <button onClick={() => setEditing(p)} className="inline-flex items-center gap-1.5 text-sm font-semibold text-burgundy-800 hover:underline cursor-pointer">
                    <Pencil className="w-3.5 h-3.5" /> Update
                  </button>
                  <button
                    onClick={() => {
                      if (window.confirm(`Delete "${p.name}"? This removes it from the website and cannot be undone.`)) deleteProduct(p.id);
                    }}
                    className="inline-flex items-center gap-1.5 text-sm font-semibold text-rose-700 hover:underline cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" /> Delete
                  </button>
                </div>
              </td>
            </tr>
          );
        })}
        {rows.length === 0 && <EmptyRow colSpan={6} text="No sarees match these filters." />}
      </TableShell>
    </>
  );
};
