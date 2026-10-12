import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import basicSsl from '@vitejs/plugin-basic-ssl';

// Theme: Sage Green & Blush Pink motif
export default defineConfig({
  plugins: [react(), basicSsl()],
  server: {
    host: true,
    watch: {
      ignored: ['**/couple-photos/**'],
    },
  },
});
