import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { viteStaticCopy } from 'vite-plugin-static-copy';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom', 
    globals: true, 
    setupFiles: './src/setupTests.js', 
    coverage: {
      reporter: ['text', 'json', 'html'], 
    },
  },
});
