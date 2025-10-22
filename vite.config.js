import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import Pages from 'vite-plugin-pages';

export default defineConfig({
  plugins: [
    react(),
    // Pages({
    //   // Configuration options for vite-plugin-pages
    //   extensions: ['jsx'], // Assuming you're using JSX files for your components
    // }),
  ],
  define: {
    'process.env': process.env
  }
});
