import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api/generate': {
        target: 'http://localhost:5000',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/generate/, '/generate'),
      },
      '/api/bg-remover': {
        target: 'http://localhost:5001',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/bg-remover/, '/bg-remover'),
      },
      '/api/upload': {
        target: 'http://localhost:5002',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/upload/, '/upload'),
      },
      '/api/register': {
        target: 'http://localhost:5257',
        changeOrigin: true,
        // The rewrite here simply preserves the path since your backend expects /api/register.
        rewrite: (path) => path.replace(/^\/api\/register/, '/api/register'),
      },
      '/api/login': {
        target: 'http://localhost:5257',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/login/, '/api/login'),
      },
      '/api/google-signin': {
        target: 'http://localhost:5257',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/google-signin/, '/api/google-signin'),
      },
    },
    host: '0.0.0.0',
    port: 5173,
    strictPort: true, 
    allowedHosts: ['.trycloudflare.com'] // Allow Cloudflare Tunnel
  },
});
