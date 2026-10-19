import React, { useRef, useState } from 'react';
import { ImageIcon, Link2, Trash2, Upload } from 'lucide-react';
import { useAdmin } from '../../context/AdminContext';
import { useToast } from '../../context/ToastContext';
import { COLLECTIONS, collectionImage } from '../../data/collections';
import { removeBanner, setBanner, useBanners } from '../../data/bannerStore';
import { Button, Card, PageHeader, inputClass } from './adminUi';
import { uploadImage } from '../../lib/api';

const BannerRow: React.FC<{ index: number; c: (typeof COLLECTIONS)[number] }> = ({ index, c }) => {
  const banners = useBanners();
  const { products } = useAdmin();
  const { showToast } = useToast();
  const fileRef = useRef<HTMLInputElement>(null);
  const [link, setLink] = useState('');
  const [busy, setBusy] = useState(false);
  const custom = banners[c.key];
  const shown = collectionImage(c, banners, products, 'card');

  const onFile = async (file?: File) => {
    if (!file) return;
    setBusy(true);
    try {
      await setBanner(c.key, await uploadImage(file, 1600));
      showToast({ type: 'success', title: 'Banner updated', message: c.title });
    } catch (e) {
      showToast({ type: 'error', title: 'Banner not saved', message: e instanceof Error ? e.message : 'Please try another photo.' });
    } finally {
      setBusy(false);
    }
  };

  const onLink = async () => {
    const url = link.trim();
    if (!/^https?:\/\/\S+$/i.test(url) && !url.startsWith('/')) {
      return showToast({ type: 'error', title: 'Enter a valid image link', message: 'It should start with https://' });
    }
    try {
      await setBanner(c.key, url);
      setLink('');
      showToast({ type: 'success', title: 'Banner updated', message: c.title });
    } catch (e) {
      showToast({ type: 'error', title: 'Banner not saved', message: e instanceof Error ? e.message : 'Please try again.' });
    }
  };

  return (
    <Card className="p-4 flex flex-col sm:flex-row gap-4">
      <div className="w-full sm:w-44 aspect-[4/3] shrink-0 rounded-md overflow-hidden bg-[#f4ecdf] grid place-items-center">
        {shown ? <img src={shown} alt="" className="w-full h-full object-cover" /> : <ImageIcon className="w-8 h-8 text-stone-400" />}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs text-stone-500">Collection {String(index + 1).padStart(2, '0')}</p>
        <h3 className="font-semibold text-charcoal">{c.title}</h3>
        <p className="text-xs text-stone-500 mt-0.5">
          {custom ? 'Using your banner.' : shown ? 'Using the default photo — add a banner to replace it.' : 'No photo yet — add a banner.'}
        </p>
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={(e) => { onFile(e.target.files?.[0]); e.target.value = ''; }} />
          <Button onClick={() => fileRef.current?.click()} disabled={busy}>
            <Upload className="w-4 h-4" /> {busy ? 'Uploading…' : 'Upload image'}
          </Button>
          {custom && (
            <Button variant="secondary" onClick={() => removeBanner(c.key).catch((e) => showToast({ type: 'error', title: 'Not removed', message: e.message }))}>
              <Trash2 className="w-4 h-4" /> Remove
            </Button>
          )}
        </div>
        <div className="mt-2 flex gap-2">
          <input
            value={link}
            onChange={(e) => setLink(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && onLink()}
            placeholder="…or paste an image link (https://…)"
            className={`${inputClass} flex-1 min-w-0`}
          />
          <Button variant="secondary" onClick={onLink} disabled={!link.trim()}>
            <Link2 className="w-4 h-4" /> Use link
          </Button>
        </div>
      </div>
    </Card>
  );
};

export const BannersPage: React.FC = () => (
  <div>
    <PageHeader
      title="Collection banners"
      subtitle="The photo on each collection card on the home page and at the top of its collection page. Wide photos (landscape) look best."
    />
    <div className="mt-5 grid gap-3">
      {COLLECTIONS.map((c, i) => (
        <BannerRow key={c.key} index={i} c={c} />
      ))}
    </div>
  </div>
);
