import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@workspace/api-client-react': path.resolve(__dirname, './src/shared'), // Update './src/shared' if your api-client folder is named differently (e.g., './src/api')
    },
  },
  build: {
    outDir: 'dist',
    emptyOutDir: true,
  },
});
