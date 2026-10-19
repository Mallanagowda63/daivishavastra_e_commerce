// Connection to the store API (public/api/index.php), which keeps everything in the MongoDB database.

const BASE = '/api/index.php';
const TOKEN_KEY = 'daivisha_admin_token';
// Admin stays signed in on this device for 30 days (the server enforces the same limit).
const SESSION_MS = 30 * 24 * 60 * 60 * 1000;

let token = (() => {
  try {
    const saved = JSON.parse(localStorage.getItem(TOKEN_KEY) || 'null') as { token: string; exp: number } | null;
    if (saved && saved.exp > Date.now()) return saved.token;
    localStorage.removeItem(TOKEN_KEY);
  } catch {
    // storage blocked: admin signs in for this visit only
  }
  return '';
})();

const unauthorizedListeners = new Set<() => void>();

export const getToken = () => token;

export const setToken = (t: string) => {
  token = t;
  try {
    if (t) localStorage.setItem(TOKEN_KEY, JSON.stringify({ token: t, exp: Date.now() + SESSION_MS }));
    else localStorage.removeItem(TOKEN_KEY);
  } catch {
    // storage blocked: stays signed in for this page only
  }
};

/** Called when the admin session has expired, so the admin can sign in again. */
export const onUnauthorized = (fn: () => void) => {
  unauthorizedListeners.add(fn);
  return () => unauthorizedListeners.delete(fn);
};

const errorListeners = new Set<(message: string) => void>();

/** Shows a failed save to the person (the toast system listens). */
export const reportError = (e: unknown) => {
  const message = e instanceof Error ? e.message : 'Something went wrong. Please try again.';
  errorListeners.forEach((l) => l(message));
};

export const onError = (fn: (message: string) => void) => {
  errorListeners.add(fn);
  return () => errorListeners.delete(fn);
};

export class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

const handle = async <T>(res: Response): Promise<T> => {
  let data: unknown = null;
  try {
    data = await res.json();
  } catch {
    // not JSON (e.g. the API is not deployed)
  }
  if (!res.ok || data === null) {
    if (res.status === 401 && token) {
      setToken('');
      unauthorizedListeners.forEach((l) => l());
    }
    const msg = (data as { error?: string } | null)?.error ?? 'Could not reach the store. Please check your connection.';
    throw new ApiError(msg, res.status);
  }
  return data as T;
};

const headers = (json: boolean) => ({
  ...(json ? { 'Content-Type': 'application/json' } : {}),
  ...(token ? { Authorization: `Bearer ${token}` } : {}),
});

/** GET when no body is given, POST otherwise. */
export const api = async <T = { ok: true }>(action: string, body?: unknown): Promise<T> => {
  const res = await fetch(`${BASE}?a=${encodeURIComponent(action)}`, {
    method: body === undefined ? 'GET' : 'POST',
    headers: headers(body !== undefined),
    body: body === undefined ? undefined : JSON.stringify(body),
  });
  return handle<T>(res);
};

/** Upload a photo; returns its link. Photos are shrunk in the browser first so uploads are quick. */
export const uploadImage = async (file: File, maxSide = 1600): Promise<string> => {
  const blob = await shrink(file, maxSide).catch(() => file);
  const form = new FormData();
  form.append('file', blob, file.name.replace(/\.[^.]+$/, '') + '.jpg');
  const res = await fetch(`${BASE}?a=upload`, { method: 'POST', headers: headers(false), body: form });
  return (await handle<{ url: string }>(res)).url;
};

const shrink = (file: File, maxSide: number) =>
  new Promise<Blob>((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('Unsupported image'));
    };
    img.onload = () => {
      URL.revokeObjectURL(url);
      const scale = Math.min(1, maxSide / Math.max(img.width, img.height));
      const canvas = document.createElement('canvas');
      canvas.width = Math.round(img.width * scale);
      canvas.height = Math.round(img.height * scale);
      const ctx = canvas.getContext('2d')!;
      ctx.fillStyle = '#ffffff'; // transparent PNGs get a white background as JPG
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      canvas.toBlob((b) => (b ? resolve(b) : reject(new Error('Could not process image'))), 'image/jpeg', 0.85);
    };
    img.src = url;
  });
