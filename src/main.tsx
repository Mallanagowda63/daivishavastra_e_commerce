import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import '../index.css';

// Images moved from /src/assets/images to /images (public folder). Rewrite paths saved in this browser
// (products, cart, wishlist, orders) so earlier data keeps showing its pictures.
try {
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (!key?.startsWith('daivisha_')) continue;
    const value = localStorage.getItem(key);
    if (value?.includes('/src/assets/images/')) {
      localStorage.setItem(key, value.split('/src/assets/images/').join('/images/'));
    }
  }
} catch {
  // storage unavailable — nothing to migrate
}

const rootElement = document.getElementById('root');

if (rootElement) {
  ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
}
