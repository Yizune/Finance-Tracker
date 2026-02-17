import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  // server: {
  //   proxy: {
  //     '/categories': 'http://localhost:5002',
  //     '/transactions': 'http://localhost:5002',
  //     '/settings': 'http://localhost:5002',
  //   },
  // },
});