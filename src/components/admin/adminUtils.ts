import { Order, PaymentStatus, SareeProduct, ProductStatus } from '../../types';

export type PaymentKind = 'UPI' | 'COD' | 'Card' | 'Net banking' | 'Other';

export const paymentKind = (method: string): PaymentKind => {
  const m = method.toLowerCase();
  if (m.includes('upi')) return 'UPI';
  if (m.includes('cod') || m.includes('cash on delivery')) return 'COD';
  if (m.includes('card')) return 'Card';
  if (m.includes('net banking') || m.includes('netbanking')) return 'Net banking';
  return 'Other';
};

/** Explicit status wins; otherwise COD is pending until delivered and cancelled orders are refunded. */
export const paymentStatusOf = (o: Order): PaymentStatus => {
  if (o.paymentStatus) return o.paymentStatus;
  if (o.status === 'Cancelled') return 'Refunded';
  if (paymentKind(o.paymentMethod) === 'COD') return o.status === 'Delivered' ? 'Paid' : 'Pending';
  return 'Paid';
};

export const productStatusOf = (p: SareeProduct): ProductStatus => p.status ?? 'published';

export const formatINR = (n: number) => `₹${Math.round(n).toLocaleString('en-IN')}`;

export const formatDate = (iso: string) =>
  new Date(iso.length === 10 ? `${iso}T00:00:00` : iso).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

export const formatTime12 = (hhmm: string) => {
  const [h, m] = hhmm.split(':').map(Number);
  const suffix = h >= 12 ? 'PM' : 'AM';
  return `${String(((h + 11) % 12) + 1).padStart(2, '0')}:${String(m).padStart(2, '0')} ${suffix}`;
};

export const localISO = (d: Date) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;

export const todayISO = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
};

export const downloadCSV = (filename: string, rows: (string | number)[][]) => {
  const csv = rows
    .map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(','))
    .join('\n');
  const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8' }));
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
};

/** Shrinks an uploaded photo so it fits comfortably in browser storage. */
export const fileToCompressedDataURL = (file: File, maxSide = 1000, quality = 0.82) =>
  new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(reader.error);
    reader.onload = () => {
      const img = new Image();
      img.onerror = () => reject(new Error('Unsupported image'));
      img.onload = () => {
        const scale = Math.min(1, maxSide / Math.max(img.width, img.height));
        const canvas = document.createElement('canvas');
        canvas.width = Math.round(img.width * scale);
        canvas.height = Math.round(img.height * scale);
        canvas.getContext('2d')!.drawImage(img, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL('image/jpeg', quality));
      };
      img.src = reader.result as string;
    };
    reader.readAsDataURL(file);
  });
