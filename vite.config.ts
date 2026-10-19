import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    port: 3000,
    host: '0.0.0.0',
    // Local testing: the PHP store API (php -S 127.0.0.1:8090 -t public) answers /api.
    proxy: { '/api': 'http://127.0.0.1:8090', '/uploads': 'http://127.0.0.1:8090' },
  },
});
