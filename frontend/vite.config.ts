import { defineConfig } from 'vite';
import path from 'node:path';
import react from '@vitejs/plugin-react-swc';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  plugins: [react(), tsconfigPaths()],
  resolve: {
    alias: {
      'ts-jest/utils': path.resolve(__dirname, 'src/test-utils/ts-jest-utils.ts'),
    }
  },
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
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/setupTests.ts',
  },
  watch: { usePolling: true },
  build: { sourcemap: true }
});
