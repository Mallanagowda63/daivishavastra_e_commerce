import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    port: 3000,
    host: '0.0.0.0',
    // Local testing: the PHP store API (php -S 127.0.0.1:8090 -t public) answers /api;
    // photos uploaded in admin live on the live site, so /uploads is read from there.
    proxy: {
      '/api': 'http://127.0.0.1:8090',
      '/uploads': { target: 'https://daivishavastra.com', changeOrigin: true, headers: { 'User-Agent': 'Mozilla/5.0' } },
    },
  },
});
