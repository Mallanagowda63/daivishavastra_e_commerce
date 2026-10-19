import React, { useState } from 'react';
import { useAdmin } from '../../context/AdminContext';
import { useToast } from '../../context/ToastContext';
import { Button, Card, Field, PageHeader, inputClass } from './adminUi';

export const SettingsPage: React.FC = () => {
  const { changeAdminPassword } = useAdmin();
  const { showToast } = useToast();
  const [current, setCurrent] = useState('');
  const [next, setNext] = useState('');
  const [repeat, setRepeat] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (next.length < 10) return setError('Use at least 10 characters for the new password.');
    if (next !== repeat) return setError('The two new passwords do not match.');
    setBusy(true);
    const err = await changeAdminPassword(current, next);
    setBusy(false);
    if (err) return setError(err);
    setCurrent('');
    setNext('');
    setRepeat('');
    setError('');
    showToast({ type: 'success', title: 'Password changed', message: 'Use the new password next time you sign in.' });
  };

  return (
    <div>
      <PageHeader title="Settings" subtitle="Change the password you use to open this admin workspace." />
      <Card className="mt-5 p-5 max-w-lg">
        <form onSubmit={submit} className="space-y-4">
          <Field label="Current password" required>
            <input type="password" autoComplete="current-password" value={current} onChange={(e) => setCurrent(e.target.value)} className={inputClass} />
          </Field>
          <Field label="New password" hint="At least 10 characters" required>
            <input type="password" autoComplete="new-password" value={next} onChange={(e) => setNext(e.target.value)} className={inputClass} />
          </Field>
          <Field label="Repeat new password" required>
            <input type="password" autoComplete="new-password" value={repeat} onChange={(e) => setRepeat(e.target.value)} className={inputClass} />
          </Field>
          {error && <p className="text-sm text-rose-700">{error}</p>}
          <Button type="submit" disabled={busy}>
            {busy ? 'Saving…' : 'Change password'}
          </Button>
        </form>
      </Card>
    </div>
  );
};
