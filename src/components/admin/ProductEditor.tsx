import React, { useRef, useState } from 'react';
import { ArrowLeft, Check, Star, Trash2, Upload } from 'lucide-react';
import { useAdmin } from '../../context/AdminContext';
import { useToast } from '../../context/ToastContext';
import { ProductStatus, SareeCategory, SareeCollection, SareeFabric, SareeOccasion, SareeProduct } from '../../types';
import { Badge, Button, Card, Field, inputClass } from './adminUi';
import { PRODUCT_STATUS_LABEL, productTone } from './statusTones';
import { fileToCompressedDataURL, productStatusOf } from './adminUtils';
import { COLLECTIONS } from './ProductsPage';
import { SAREE_TYPE_NAMES } from '../../data/sareeTypes';

const CATEGORIES = SAREE_TYPE_NAMES;
const FABRICS: SareeFabric[] = [
  'Pure Silk', 'Kanjivaram Silk', 'Banarasi Katan Silk', 'Cotton Silk', 'Organza',
  'Chanderi Silk', 'Georgette', 'Pure Linen', 'Tussar Silk', 'Gajji Silk',
];
const OCCASIONS: SareeOccasion[] = ['Wedding', 'Festive', 'Party', 'Office Wear', 'Traditional', 'Daily Elegance'];

export const ProductEditor: React.FC<{ product?: SareeProduct; onDone: () => void }> = ({ product, onDone }) => {
  const { addProduct, updateProduct } = useAdmin();
  const { showToast } = useToast();
  const fileRef = useRef<HTMLInputElement>(null);
  const isNew = !product;

  const [name, setName] = useState(product?.name ?? '');
  const [sku, setSku] = useState(product?.sku ?? '');
  const [collection, setCollection] = useState<SareeCollection>(product?.collection ?? 'Festive Collection');
  const [category, setCategory] = useState<SareeCategory>(product?.category ?? SAREE_TYPE_NAMES[0]);
  const [fabric, setFabric] = useState<SareeFabric>(product?.fabric ?? 'Pure Silk');
  const [color, setColor] = useState(product?.color ?? '');
  const [description, setDescription] = useState(product?.description ?? '');
  const [price, setPrice] = useState(product?.sellingPrice ?? 0);
  const [mrp, setMrp] = useState(product?.originalPrice ?? 0);
  const [stock, setStock] = useState(product?.stock ?? 0);
  const [occasions, setOccasions] = useState<SareeOccasion[]>(product?.occasion ?? []);
  const [images, setImages] = useState<string[]>(product?.images ?? []);
  const [selected, setSelected] = useState(0);
  const [status, setStatus] = useState<ProductStatus>(product ? productStatusOf(product) : 'draft');
  const [isNewArrival, setIsNewArrival] = useState(product?.isNewArrival ?? true);
  const [isBestSeller, setIsBestSeller] = useState(product?.isBestSeller ?? false);
  const [uploading, setUploading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleFiles = async (files: FileList | null) => {
    if (!files?.length) return;
    setUploading(true);
    try {
      const urls: string[] = [];
      for (const f of Array.from(files)) {
        if (!f.type.startsWith('image/')) continue;
        if (f.size > 10 * 1024 * 1024) {
          showToast({ type: 'error', title: 'Photo too large', message: `${f.name} is over 10 MB.` });
          continue;
        }
        urls.push(await fileToCompressedDataURL(f));
      }
      setImages((prev) => [...prev, ...urls]);
    } catch {
      showToast({ type: 'error', title: 'Upload failed', message: 'That file could not be read as an image.' });
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = '';
    }
  };

  const removeImage = (i: number) => {
    setImages((prev) => prev.filter((_, idx) => idx !== i));
    setSelected(0);
  };

  const makeCover = (i: number) => {
    setImages((prev) => [prev[i], ...prev.filter((_, idx) => idx !== i)]);
    setSelected(0);
  };

  const validate = (target: ProductStatus) => {
    const e: Record<string, string> = {};
    if (!name.trim()) e.name = 'Saree name is required.';
    if (target === 'published') {
      if (price <= 0) e.price = 'Enter a selling price.';
      if (images.length === 0) e.images = 'Add at least one photo before publishing.';
    }
    if (mrp && mrp < price) e.mrp = 'MRP should be at least the selling price.';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const save = (target: ProductStatus) => {
    if (!validate(target)) return;
    const original = Math.max(mrp, price);
    const data = {
      name: name.trim(),
      sku: sku.trim() || `DV-${Date.now().toString().slice(-5)}`,
      collection,
      category,
      fabric,
      color: color.trim(),
      description: description.trim(),
      sellingPrice: price,
      originalPrice: original,
      discountPercentage: original > price ? Math.round(((original - price) / original) * 100) : 0,
      stock,
      occasion: occasions,
      images,
      secondaryImage: images[1],
      status: target,
      isNewArrival,
      isBestSeller,
    };
    if (product) {
      updateProduct(product.id, data);
      showToast({ type: 'success', title: 'Saree saved', message: `${data.name} · ${PRODUCT_STATUS_LABEL[target]}` });
    } else {
      addProduct({
        ...data,
        rating: 5,
        reviewCount: 0,
        story: data.description,
        details: {
          fabric,
          sareeLength: '5.5 m',
          blousePiece: '0.8 m unstitched',
          work: '',
          border: '',
          palluDetails: '',
          washCare: 'Dry clean only',
          countryOfOrigin: 'India',
        },
        stylingTips: [],
      });
    }
    onDone();
  };

  return (
    <>
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-7">
        <div>
          <h1 className="font-serif text-3xl sm:text-4xl text-charcoal">{isNew ? 'Add saree' : 'Edit saree'}</h1>
          <p className="mt-1.5 text-sm text-stone-500">{isNew ? 'Create a new catalogue listing.' : `${product.name} · ${product.sku}`}</p>
        </div>
        <Button variant="secondary" onClick={onDone}>
          <ArrowLeft className="w-4 h-4" /> Back to products
        </Button>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-[340px_minmax(0,1fr)] gap-5 items-start">
        {/* Photos */}
        <Card className="p-5">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-sans text-base font-semibold text-charcoal">Saree photographs</h2>
            <Badge tone="grey">
              {images.length} photo{images.length === 1 ? '' : 's'}
            </Badge>
          </div>
          {images.length > 0 ? (
            <div className="aspect-[4/5] rounded-lg overflow-hidden bg-sand">
              <img src={images[selected] ?? images[0]} alt="" className="w-full h-full object-cover" />
            </div>
          ) : (
            <div className="aspect-[4/5] rounded-lg bg-[#f4ecdf] grid place-items-center text-sm text-stone-400">No photos yet</div>
          )}
          {images.length > 0 && (
            <div className="grid grid-cols-4 gap-2 mt-3">
              {images.map((src, i) => (
                <div key={i} className={`relative group rounded-md overflow-hidden ring-2 ${i === selected ? 'ring-burgundy-800' : 'ring-transparent'}`}>
                  <button onClick={() => setSelected(i)} className="block w-full aspect-square cursor-pointer" aria-label={`Show photo ${i + 1}`}>
                    <img src={src} alt="" className="w-full h-full object-cover" />
                  </button>
                  <div className="absolute inset-x-0 bottom-0 flex justify-between p-1 opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition-opacity">
                    {i > 0 ? (
                      <button onClick={() => makeCover(i)} title="Make cover" className="p-1 rounded bg-white/90 text-gold-700 cursor-pointer">
                        <Star className="w-3 h-3" />
                      </button>
                    ) : (
                      <span />
                    )}
                    <button onClick={() => removeImage(i)} title="Remove" className="p-1 rounded bg-white/90 text-rose-700 cursor-pointer">
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
          <button
            onClick={() => fileRef.current?.click()}
            disabled={uploading}
            className="mt-3 w-full rounded-lg border border-dashed border-[#d9ccb8] bg-[#f6f0e6] hover:border-burgundy-800 py-6 text-center cursor-pointer disabled:opacity-60"
          >
            <Upload className="w-5 h-5 mx-auto text-gold-700" />
            <p className="mt-2 text-sm font-semibold text-charcoal">{uploading ? 'Uploading…' : 'Upload photos'}</p>
            <p className="text-[11px] text-stone-500">JPG or PNG · up to 10 MB each</p>
          </button>
          <input ref={fileRef} type="file" accept="image/*" multiple hidden onChange={(e) => handleFiles(e.target.files)} />
          {errors.images && <p className="mt-2 text-xs text-rose-700">{errors.images}</p>}
          <p className="mt-3 text-[11px] text-stone-500 leading-relaxed">
            The first photo is your storefront cover. Hover a thumbnail to set it as cover or remove it.
          </p>
        </Card>

        <div className="space-y-5">
          {/* Details */}
          <Card className="p-5">
            <h2 className="font-sans text-base font-semibold text-charcoal mb-4">Product details</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="Saree name" required className="sm:col-span-2">
                <input className={inputClass} value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Gulabi Banarasi Silk" />
                {errors.name && <span className="block mt-1 text-xs text-rose-700">{errors.name}</span>}
              </Field>
              <Field label="Collection" required>
                <select className={inputClass} value={collection} onChange={(e) => setCollection(e.target.value as SareeCollection)}>
                  {COLLECTIONS.map((c) => (
                    <option key={c}>{c}</option>
                  ))}
                </select>
              </Field>
              <Field label="SKU" hint="Leave blank to generate one.">
                <input className={inputClass} value={sku} onChange={(e) => setSku(e.target.value)} placeholder="DV-S001" />
              </Field>
              <Field label="Description" hint="Describe the fabric, weave, occasion and what is included." className="sm:col-span-2">
                <textarea className={`${inputClass} min-h-[110px]`} value={description} onChange={(e) => setDescription(e.target.value)} />
              </Field>
              <Field label="Selling price (INR)" required hint="Inclusive of taxes.">
                <input type="number" min={0} className={inputClass} value={price || ''} onChange={(e) => setPrice(Number(e.target.value))} placeholder="12800" />
                {errors.price && <span className="block mt-1 text-xs text-rose-700">{errors.price}</span>}
              </Field>
              <Field label="MRP (INR)" hint="Shown struck-through when higher than the price.">
                <input type="number" min={0} className={inputClass} value={mrp || ''} onChange={(e) => setMrp(Number(e.target.value))} placeholder="16000" />
                {errors.mrp && <span className="block mt-1 text-xs text-rose-700">{errors.mrp}</span>}
              </Field>
              <Field label="Stock quantity" required hint="Available units for this saree.">
                <input type="number" min={0} className={inputClass} value={stock} onChange={(e) => setStock(Math.max(0, Number(e.target.value)))} />
              </Field>
              <Field label="Colour">
                <input className={inputClass} value={color} onChange={(e) => setColor(e.target.value)} placeholder="e.g. Rani pink" />
              </Field>
            </div>
          </Card>

          {/* Category */}
          <Card className="p-5">
            <h2 className="font-sans text-base font-semibold text-charcoal mb-4">Category &amp; fabric</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="Category" required>
                <select className={inputClass} value={category} onChange={(e) => setCategory(e.target.value as SareeCategory)}>
                  {CATEGORIES.map((c) => (
                    <option key={c}>{c}</option>
                  ))}
                </select>
              </Field>
              <Field label="Fabric" required>
                <select className={inputClass} value={fabric} onChange={(e) => setFabric(e.target.value as SareeFabric)}>
                  {FABRICS.map((c) => (
                    <option key={c}>{c}</option>
                  ))}
                </select>
              </Field>
              <div className="sm:col-span-2">
                <span className="block text-xs font-semibold text-charcoal mb-2">Occasions</span>
                <div className="flex flex-wrap gap-2">
                  {OCCASIONS.map((o) => {
                    const on = occasions.includes(o);
                    return (
                      <button
                        key={o}
                        type="button"
                        onClick={() => setOccasions((prev) => (on ? prev.filter((x) => x !== o) : [...prev, o]))}
                        className={`px-3 py-1.5 rounded-full text-xs border cursor-pointer ${
                          on ? 'bg-burgundy-800 border-burgundy-800 text-ivory' : 'bg-white border-[#e3d9ca] text-charcoal hover:border-burgundy-800'
                        }`}
                      >
                        {o}
                      </button>
                    );
                  })}
                </div>
              </div>
              <label className="flex items-center gap-2 text-sm text-charcoal">
                <input type="checkbox" checked={isNewArrival} onChange={(e) => setIsNewArrival(e.target.checked)} className="accent-burgundy-800" />
                Show in New Arrivals
              </label>
              <label className="flex items-center gap-2 text-sm text-charcoal">
                <input type="checkbox" checked={isBestSeller} onChange={(e) => setIsBestSeller(e.target.checked)} className="accent-burgundy-800" />
                Show in Best Sellers
              </label>
            </div>
          </Card>

          {/* Publishing */}
          <Card className="p-5">
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-sans text-base font-semibold text-charcoal">Publishing</h2>
              <Badge tone={productTone(status)}>{PRODUCT_STATUS_LABEL[status]}</Badge>
            </div>
            <div className="flex flex-wrap gap-5">
              {(['published', 'draft', 'archived'] as ProductStatus[]).map((s) => (
                <label key={s} className="flex items-center gap-2 text-sm text-charcoal cursor-pointer">
                  <input type="radio" name="status" checked={status === s} onChange={() => setStatus(s)} className="accent-burgundy-800" />
                  {PRODUCT_STATUS_LABEL[s]}
                </label>
              ))}
            </div>
            <p className="mt-2 text-xs text-stone-500">Published sarees appear on the website. Drafts and archived sarees stay hidden.</p>
          </Card>

          <Card className="p-4 flex flex-col sm:flex-row items-center justify-end gap-2">
            <Button variant="secondary" onClick={onDone}>
              Cancel
            </Button>
            <Button variant="secondary" onClick={() => save('draft')}>
              Save draft
            </Button>
            <Button onClick={() => save(status === 'draft' ? 'published' : status)}>
              <Check className="w-4 h-4" /> {status === 'archived' ? 'Save as archived' : isNew ? 'Publish saree' : 'Publish changes'}
            </Button>
          </Card>
        </div>
      </div>
    </>
  );
};
