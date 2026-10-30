import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

const BACKEND = 'https://lms.bishamsinchiury.com.np';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: BACKEND,          // no trailing slash
        changeOrigin: true,
        secure: true,
        // Strip the backend's Domain=... from Set-Cookie so the browser
        // stores cookies for localhost instead of rejecting them
        cookieDomainRewrite: '',
        configure: (proxy) => {
          // Django's CSRF check compares Origin/Referer to the host,
          // so make the request look like it comes from the backend itself
          proxy.on('proxyReq', (proxyReq) => {
            proxyReq.setHeader('Origin', BACKEND);
            proxyReq.setHeader('Referer', `${BACKEND}/`);
          });
        },
      },
    },
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/test/setup.js',
  },
});