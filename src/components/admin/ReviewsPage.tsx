import React, { useState } from 'react';
import { Check, EyeOff, Star, Trash2 } from 'lucide-react';
import { Review, ReviewStatus, deleteReview, formatReviewDate, setReviewStatus, useReviews } from '../../data/reviewStore';
import { useToast } from '../../context/ToastContext';
import { Badge, Button, Card, PageHeader, Tabs } from './adminUi';

const TONE: Record<ReviewStatus, 'amber' | 'green' | 'grey'> = { pending: 'amber', approved: 'green', hidden: 'grey' };
const LABEL: Record<ReviewStatus, string> = { pending: 'Waiting for approval', approved: 'Live on website', hidden: 'Hidden' };

const ReviewCard: React.FC<{ r: Review }> = ({ r }) => {
  const { showToast } = useToast();
  return (
    <Card className="p-4 sm:p-5">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div>
          <p className="font-semibold text-charcoal">
            {r.name}
            {r.city && <span className="font-normal text-stone-500"> · {r.city}</span>}
          </p>
          <p className="text-xs text-stone-500 mt-0.5">
            {formatReviewDate(r.date)}
            {r.productName && ` · ${r.productName}`}
          </p>
        </div>
        <Badge tone={TONE[r.status]}>{LABEL[r.status]}</Badge>
      </div>
      <div className="flex gap-0.5 mt-3" aria-label={`${r.rating} out of 5 stars`}>
        {[1, 2, 3, 4, 5].map((n) => (
          <Star key={n} className={`w-4 h-4 ${n <= r.rating ? 'fill-gold-500 text-gold-500' : 'text-stone-300'}`} />
        ))}
      </div>
      <p className="mt-2 text-sm text-stone-700 leading-relaxed whitespace-pre-line">{r.comment}</p>
      <div className="mt-4 flex flex-wrap gap-2">
        {r.status !== 'approved' && (
          <Button onClick={() => { setReviewStatus(r.id, 'approved'); showToast({ type: 'success', title: 'Review approved', message: 'It now shows on the website.' }); }}>
            <Check className="w-4 h-4" /> Approve
          </Button>
        )}
        {r.status !== 'hidden' && (
          <Button variant="secondary" onClick={() => { setReviewStatus(r.id, 'hidden'); showToast({ type: 'info', title: 'Review hidden', message: 'It no longer shows on the website.' }); }}>
            <EyeOff className="w-4 h-4" /> Hide
          </Button>
        )}
        <Button
          variant="ghost"
          onClick={() => {
            if (window.confirm(`Delete the review from ${r.name}? This cannot be undone.`)) {
              deleteReview(r.id);
              showToast({ type: 'info', title: 'Review deleted', message: r.name });
            }
          }}
        >
          <Trash2 className="w-4 h-4" /> Delete
        </Button>
      </div>
    </Card>
  );
};

export const ReviewsPage: React.FC = () => {
  const reviews = useReviews();
  const [tab, setTab] = useState<ReviewStatus>('pending');
  const count = (s: ReviewStatus) => reviews.filter((r) => r.status === s).length;
  const list = reviews.filter((r) => r.status === tab);

  return (
    <div>
      <PageHeader title="Customer reviews" subtitle="New reviews wait here until you approve them. Only approved reviews show on the website." />
      <div className="mt-5">
        <Tabs
          active={tab}
          onChange={setTab}
          tabs={[
            { id: 'pending', label: 'Waiting', count: count('pending') },
            { id: 'approved', label: 'Approved', count: count('approved') },
            { id: 'hidden', label: 'Hidden', count: count('hidden') },
          ]}
        />
      </div>
      <div className="mt-4 grid gap-3">
        {list.length ? (
          list.map((r) => <ReviewCard key={r.id} r={r} />)
        ) : (
          <Card className="p-10 text-center text-sm text-stone-500">
            {tab === 'pending' ? 'No reviews waiting for approval.' : tab === 'approved' ? 'No approved reviews yet.' : 'No hidden reviews.'}
          </Card>
        )}
      </div>
    </div>
  );
};
