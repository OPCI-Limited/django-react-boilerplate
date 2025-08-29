import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  plugins: [react(), tsconfigPaths()],
  server: {
    host: true,     // 0.0.0.0 in Docker
    port: 5173,
    strictPort: true,
    // Allow requests proxied via Nginx/upstreams
    allowedHosts: ['localhost', '127.0.0.1', 'frontend', 'frontend_server', 'nginx'],
    // Make HMR work reliably through Docker/Nginx
    hmr: {
      protocol: 'ws',
      host: 'localhost',
      clientPort: 5173,
    },
    proxy: {
      // update this path if your API prefix differs
      '/api': { target: 'http://backend:8001', changeOrigin: true }
    }
  },
  watch: { usePolling: true },
  build: { sourcemap: true }
});
