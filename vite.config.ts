import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@workspace/api-client-react': path.resolve(__dirname, './src/api'), // Change './src/api' to match your actual folder (e.g. './src/lib', './src/types')
    },
  },
  build: {
    outDir: 'dist',
    emptyOutDir: true,
  },
});
